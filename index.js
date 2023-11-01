import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import {userLogin, userReg, AuthenticatedUser, userLogOut, refreshAccessToken } from "./routes/users/users.js"
import { addPost, getAllPosts, getUserPosts } from "./routes/posts/posts.js"

const app = express()
app.use(cors({origin: 'http://localhost:3000', credentials: true})); 
app.use(express.json()); 
app.use(cookieParser()); 

const port = process.env.PORT || 3300

app.get('/', (req, res)=>{
    res.send('hello world')
})

app.post('/users', userReg)
app.post('/users/login', userLogin)
app.get('/users/checktoken', AuthenticatedUser)
app.post('/users/refreshtoken', refreshAccessToken)
app.get('/users/logout', userLogOut)

app.post('/posts', addPost)
app.get('/posts/:id', getUserPosts)
app.get('/posts/', getAllPosts)


app.listen(port)