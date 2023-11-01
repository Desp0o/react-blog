import React, { useEffect, useState } from 'react'
import axios from 'axios'
import MapSingleUserPost from './mapSingleUserPost'

export default function UsersLastPosts() {

    const [data, setData] = useState([])

    useEffect(()=>{
        const fetchUserPosts = async () => {
            try {
                const response = await axios.get('http://localhost:3300/posts/:id', ({withCredentials: true}))
                setData(response.data)
            } catch (error) {
                console.log(error);
            }
        }

        fetchUserPosts()
    },[])

  return (
    <div className='user_posts'>
        <p className='user_posts_header'>User's last posts</p>

        <div className='last_posts_content'>

            { data ? 
                <MapSingleUserPost data={data} />
                    : 
                'Loading......'
            }
            
        </div>
    </div>
  )
}
