import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import {userLogin, updateUser, userReg, AuthenticatedUser, userLogOut, refreshAccessToken, getUserInfo } from "./routes/users/users.js"
import { addPost, getAllPosts, getUserPosts, getSinglePost, updatePost } from "./routes/posts/posts.js"
import multer from "multer"
import path from "path"

const app = express()
app.use(cors({origin: 'http://localhost:3000', credentials: true})); 
app.use(cookieParser()); 
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('uploads'))

const port = process.env.PORT || 3300
app.get('/', (req, res)=>{
    res.send('hello world')
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Specify the directory where you want to store the uploaded files
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '_' + Date.now() + '_' + path.extname(file.originalname)); // Rename the file with a timestamp to avoid overwriting
    },
})

export const upload = multer({ storage: storage })

app.post('/users', userReg)
app.post('/users/login', userLogin)
app.get('/users/checktoken', AuthenticatedUser)
app.post('/users/refreshtoken', refreshAccessToken)
app.get('/users/logout', userLogOut)
app.post('/users/updateuser', updateUser)
app.get('/users/getuserinfo', getUserInfo)

app.post('/posts', addPost)
app.get('/posts/:id', getUserPosts)
app.get('/posts/', getAllPosts)
app.get('/posts/singleposts/:postid', getSinglePost)
app.post('/posts/userpostedit/:postid', updatePost)




app.listen(port)