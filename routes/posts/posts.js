import { pool } from "../dbConnect.js"
import bcrypt from 'bcrypt';
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

        const query =
            "SELECT * FROM posts WHERE `uid` = ?";

        pool.query(query, [userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);
            console.log(data);
            return res.status(200).json(data);
        });
    });
};