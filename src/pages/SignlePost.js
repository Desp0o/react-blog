import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from "axios"

export default function SignlePost() {

    const { postId } = useParams();
    const [data, setData] = useState('')

    const fetchSinglePost = async (id) => {
        try {
          const response = await axios.get(`http://localhost:3300/posts/singleposts/${id}`, {
            withCredentials: true
          })
          console.log(response.data)
          setData(response.data)
        } catch (error) {
          console.log(error)
        }
      }

    useEffect(()=>{
        fetchSinglePost(postId)
    },[])  


  return (
    <div>
        <p>title: {data?.title}</p>
        <p>title: {data?.category}</p>
        <p>title: {data?.content}</p>
    </div>
  )
}
