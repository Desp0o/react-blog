import React, {useContext, useState} from 'react'
import {AuthContext} from "../../components/AuthContext"
import ButtonComponent from '../../components/button/buttonComponent'
import axios from 'axios'

export default function UserInfo() {

    const { currentUser } = useContext(AuthContext)
  const [values, setValues] = useState({})

  const handleUpdatePasswordValues = (e)=>{
    setValues(prevValues => ({...prevValues, [e.target.name]: e.target.value,}));
}

  const updateUserInfo = async () => {
    try {
      const response = await axios.post('http://localhost:3300/users/updateuser', values, ({withCredentials: true}))
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='user_info'>

        <p className='user_info_title'>User Info</p>
        <div className='input_parent'>
            <input className='inputStyle' type='text' name='name' id='name' placeholder='User Name' value={currentUser} disabled/>
        </div>

        <div className='input_parent'>
            <input className='inputStyle' type='text' name='userEmail' id='userEmail' placeholder='User mail' value='tornike.despotashvili@gmail.com' disabled/>
        </div>

        <div className='input_parent'>
            <input className='inputStyle' type='password' name='currentPassword' id='currentPassword' placeholder='New Password' value={values.currentPassword} onChange={handleUpdatePasswordValues}/>
        </div>

        <div className='input_parent'>
            <input className='inputStyle' type='password' name='newPassword' id='newPassword' placeholder='Re Enter Passwrord' value={values.newPassword} onChange={handleUpdatePasswordValues}/>
        </div>

        <ButtonComponent text='Update Password' funName={updateUserInfo} />

    </div>
  )
}
