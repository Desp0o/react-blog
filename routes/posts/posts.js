import { pool } from "../dbConnect.js"
import jwt from "jsonwebtoken";
import multer from "multer";

import { upload } from "../../index.js";

export const addPost = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated!");
  
    

    jwt.verify(token, process.env.JWTKEY, (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
      
      const q =
        "INSERT INTO posts(`title`, `content`, `cover`, `category`,`uid`, `author`) VALUES (?)";

        upload.single('cover')(req, res, (err) => {
          if (err) {
            return res.status(500).json(err.message);
          }
    
          const values = [
            req.body.title,
            req.body.content,
            req.file ? req.file.filename : null, // Use the filename from Multer
            req.body.category,
            userInfo.id,
            userInfo.name,
          ];
    
          pool.query(q, [values], (err, data) => {
            if (err) {
              return res.status(500).json(err);
            }
            return res.json("Post has been created.");
          });
        });
      });
};


export const getAllPosts = (req, res) => {
    const query = "SELECT * FROM `posts`"
    
    pool.query(query, [req.query.cat], (err, data) => {
        if (err) return res.status(500).send(err);
    
        return res.status(200).json(data);
    });
};

export const getUserPosts = (req, res) => {
    const token = req.cookies.access_token;
    
    if (!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, process.env.JWTKEY, (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        

        const query = "SELECT * FROM posts WHERE `uid` = ?";

        pool.query(query, [userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);
            
            return res.status(200).json(data);
        });
    });
};

export const getSinglePost = (req, res) => {
  const token = req.cookies.access_token;

  jwt.verify(token, process.env.JWTKEY, (err, userInfo) => {

    const postId = req.params.postid;

    const query = "SELECT * FROM posts WHERE postid = ?";

    pool.query(query, [postId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database query error' });
      }
      
      if (results.length > 0) {
        const post = results[0];
        
        return res.json(post);
      } else {
        return res.status(404).json({ message: 'Post not found' });
      }
    });
  });
};

export const updatePost = (req, res) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json("Not authenticated!");
  }

  jwt.verify(token, process.env.JWTKEY, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const postId = req.params.postid;

    // Construct a query to fetch the post's uid
    const selectPostQuery = "SELECT uid FROM posts WHERE postid = ?";
    pool.query(selectPostQuery, [postId], (selectErr, selectData) => {
      if (selectErr) {
        return res.status(500).json({ error: "Database query error" });
      }

      if (selectData.length === 0) {
        return res.status(404).json({ message: "Post not found" });
      }

      const postUid = selectData[0].uid
      const userID = JSON.stringify(userInfo.id);

      console.log("postUid:", postUid);
      console.log("userID:", userID);

      // Check if the user's 'id' matches the post's 'uid'
      if (userID === postUid) {
        const { title, content, cover, category } = req.body;
        const updateQuery = "UPDATE posts SET title = ?, content = ?, cover = ?, category = ? WHERE postid = ?";

        pool.query(updateQuery, [title, content, cover, category, postId], (updateErr, updateResults) => {
          if (updateErr) {
            return res.status(500).json({ error: "Database query error" });
          }

          if (updateResults.affectedRows > 0) {
            return res.json({ message: "Post updated successfully" });
          } else {
            return res.status(404).json({ message: "Post not found" });
          }
        });
      } else {
        return res.status(403).json({ message: "Not authorized to update this post" });
      }
    });
  });
};


// export const postDelete = ()


