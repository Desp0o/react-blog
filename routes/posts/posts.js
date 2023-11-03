import { pool } from "../dbConnect.js"
import jwt from "jsonwebtoken";

export const addPost = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated!");
  
    jwt.verify(token, process.env.JWTKEY, (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
  
      const q =
        "INSERT INTO posts(`title`, `content`, `cover`, `category`,`uid`) VALUES (?)";
  
      const values = [
        req.body.title,
        req.body.content,
        req.body.cover,
        req.body.category,
        userInfo.id,
      ];
  
      pool.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Post has been created.");
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

export const getSinglePostForEdit = (req, res) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json("Not authenticated!");
  }

  jwt.verify(token, process.env.JWTKEY, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

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