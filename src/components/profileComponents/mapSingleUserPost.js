import React from 'react'
import SmallButtonComponent from '../button/smallButtonComponent'
import { Link } from "react-router-dom"

export default function MapSingleUserPost({data}) {

  
  
  return (
    <>
        {data?.map((post)=>{
            return(
              <Link to={`/pages/singlepost/${post.postid}`} key={post.postid} >
                <div className='last_post_single' >
                    <p>{post.title.length > 15 ? post.title.substring(0, 15) + '...' : post.title}</p>
                    <SmallButtonComponent text='Edit' id={post.postid} />
                    <p >post edit</p>
                </div>
              </Link>
            )
        })}
    </>
  )
}
