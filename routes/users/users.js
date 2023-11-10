import { pool } from "../dbConnect.js"
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

export const userReg = (req, res) => {
  // First, check if the email already exists in the database
  const checkEmailQuery = 'SELECT * FROM users WHERE mail = ?';
  const checkEmailValues = [req.body.mail];

  // Check if the name already exists in the database
  const checkNameQuery = 'SELECT * FROM users WHERE name = ?';
  const checkNameValues = [req.body.name];

  pool.query(checkEmailQuery, checkEmailValues, (checkEmailError, checkEmailResults) => {
    if (checkEmailError) {
      console.error('Database error (email check):', checkEmailError);
      return res.status(500).json({ error: 'Database error (email check)' });
    }

    if (checkEmailResults.length > 0) {
      return res.status(409).send('User with this email already exists');
    }

    // Email is not found; check if the name exists
    pool.query(checkNameQuery, checkNameValues, (checkNameError, checkNameResults) => {
      if (checkNameError) {
        console.error('Database error (name check):', checkNameError);
        return res.status(500).json({ error: 'Database error (name check)' });
      }

      if (checkNameResults.length > 0) {
        return res.status(409).send('User with this name already exists');
      }

      // If name and email are not found, proceed with password encryption and the INSERT operation
      bcrypt.hash(req.body.password, 10, (hashError, hashedPassword) => {
        if (hashError) {
          console.error('Password hash error:', hashError);
          return res.status(500).json({ error: 'Password hash error' });
        }

        // Now, use the hashedPassword in the INSERT operation
        const insertQuery = 'INSERT INTO users (`name`, `mail`, `password`) VALUES (?, ?, ?)';
        const insertValues = [req.body.name, req.body.mail, hashedPassword];

        pool.query(insertQuery, insertValues, (insertError, insertData) => {
          if (insertError) {
            console.error('Database error (insert):', insertError);
            return res.status(500).json({ error: 'Database error (insert)' });
          }
          return res.status(200).send('You have successfully registered');
        });
      });
    });
  });
};

export const userLogin = (req, res) => {
  const query = "SELECT * FROM users WHERE mail = ?";

  pool.query(query, [req.body.mail], (err, data,) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = data[0];
   

    if (!user.password) {
      return res.status(400).json({ error: 'User password not found' });
    }

    const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: 'Wrong email or password' });
    }

    // Generate an access token and a refresh token
    const accessToken = jwt.sign({id: user.id, name: user.name}, process.env.JWTKEY, {
      expiresIn: '4h', // You should set an appropriate expiration time
    });

    const refreshToken = jwt.sign({id: user.id, name: user.name}, process.env.JWTKEY_REFRESH, {
      expiresIn: '1w', // You should set an appropriate expiration time
    });

    // Set the access token as an HTTP-only cookie for secure storage
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Enable secure cookies in production
      sameSite: 'strict', // Enforce a strict same-site policy
      maxAge: 4 * 60 * 60 * 1000, // 4 hours
    });

    // Set the refresh token as an HTTP-only cookie for secure storage
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Enable secure cookies in production
      sameSite: 'strict', // Enforce a strict same-site policy
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    });
    
    // Send the user's data and access token in the response, excluding the password
    const { password, id, name, mail } = user;
    res.status(200).json({ name, id, refreshToken, mail });
  });
};

export const AuthenticatedUser = (req, res)=>{
  const token = req.cookies.access_token;

  if (!token) {
    // If no token is present, respond with a status indicating there is no token
    return res.status(200).json('no-token');
  }

  jwt.verify(token, process.env.JWTKEY, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        // Token has expired
        return res.status(200).json('token-expired');
      } else {
        // Token is invalid
        return res.status(200).json('token-invalid');
      }
    }

    return res.status(200).json('token-valid');
  });
}

export const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token provided' });
  }

  const accessTokenOld = req.cookies.access_token;

  if(!accessTokenOld){
    return res.status(401).json({ error: 'Log Again'})
  }else{
    jwt.verify(refreshToken, process.env.JWTKEY_REFRESH, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }
  
      // If the refresh token is valid, generate a new access token
      const accessToken = jwt.sign({ id: decoded.id, name: decoded.name }, process.env.JWTKEY, {
        expiresIn: '4h', // Set an appropriate expiration time
      });
  
      // Set the new access token as an HTTP-only cookie
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 4 * 60 * 60 * 1000, // 4 hours
      });
  
      return res.status(200).json(accessToken);
    });
  }

  
};

export const userLogOut = (req, res)=>{
// Clear the access_token and refresh_token cookies
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  
  // Send a response to indicate a successful logout
  res.status(200).json({ message: 'User has been logged out' });
}

export const updateUser = (req, res) => {
  const token = req.cookies.access_token;

  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, process.env.JWTKEY, (err, userInfo) => {
    const userId = userInfo.id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const { currentPassword, newPassword } = req.body
    // Construct the SQL query to fetch the user's current password
    const selectQuery = "SELECT password FROM users WHERE id = ?";
    pool.query(selectQuery, [userId], (selectErr, selectData) => {
      if (selectErr) {
        return res.status(500).json({ error: "Internal server error" });
      }
  
      if (selectData.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const user = selectData[0];
  
      if (!user.password) {
        return res.status(400).json({ error: 'User password not found' });
      }
  
      // Check if the current password provided in the request matches the stored password
      const isPasswordCorrect = bcrypt.compareSync(currentPassword, user.password);
  
      if (!isPasswordCorrect) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
  
      // Hash the new password before updating it in the database
      const hashedNewPassword = bcrypt.hashSync(newPassword, 10); // Adjust the hashing cost factor as needed
  
      // Construct the SQL query to update the user's password
      const updateQuery = "UPDATE users SET password = ? WHERE id = ?";
  
      // Execute the SQL query with the new hashed password and user ID
      pool.query(updateQuery, [hashedNewPassword, userId], (updateErr, updateData) => {
        if (updateErr) {
          return res.status(500).json({ error: "Internal server error" });
        }
  
        // If the update was successful, return a success response
        res.status(200).json({ message: 'Password updated successfully' });
      });
    });





  })
};

export const getUserInfo = (req, res) => {
  const token = req.cookies.access_token;

  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, process.env.JWTKEY, (err, userInfo) => {
    const userId = userInfo.id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const selectQuery = "SELECT mail, name FROM users WHERE id = ?";

    pool.query(selectQuery, [userId], (selectErr, selectData) => {
      if (selectErr) {
        return res.status(500).json({ error: "Internal server error" });
      }

      if (selectData.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Assuming selectData is an array with a single user object
      const user = selectData[0];

      // Send the user's email and name as a response
      return res.status(200).json({ email: user.mail, name: user.name });
    });

  })
};