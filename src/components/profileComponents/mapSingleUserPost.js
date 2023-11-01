import React from 'react'
import SmallButtonComponent from '../button/smallButtonComponent'

export default function MapSingleUserPost({data}) {
  return (
    <>
        {data?.map((post)=>{
            return(
                <div className='last_post_single' key={post.postid}>
                    <p>{post.title.length > 15 ? post.title.substring(0, 15) + '...' : post.title}</p>
                    <SmallButtonComponent text='Edit' />
                </div>
            )
        })}
    </>
  )
}
