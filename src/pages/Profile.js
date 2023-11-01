import React, {useContext} from 'react'
import {AuthContext} from "../components/AuthContext"
import "../pages/styles/profile.css"
import ButtonComponent from '../components/button/buttonComponent'

export default function Profile() {

  const { currentUser } = useContext(AuthContext)

  const updateUserInfo = async () => {

  }

  return (
    <>
      <div className='profile_Main'>
        <div className='profile_inner'>
            <h1 className='profile_header'>{currentUser}</h1>

            <div className='profile_content'>
                <div className='user_info'>

                  <p className='user_info_title'>User Info</p>
                  <div className='input_parent'>
                      <input className='inputStyle' type='text' name='name' id='name' placeholder='User Name' value={currentUser} disabled/>
                  </div>

                  <div className='input_parent'>
                      <input className='inputStyle' type='text' name='userEmail' id='userEmail' placeholder='User mail' value='tornike.despotashvili@gmail.com' disabled/>
                  </div>

                  <div className='input_parent'>
                      <input className='inputStyle' type='password' name='userPassword1' id='userPassword1' placeholder='New Password' value=''/>
                  </div>

                  <div className='input_parent'>
                      <input className='inputStyle' type='password' name='userPassword2' id='userPassword2' placeholder='Re Enter Passwrord' value=''/>
                  </div>

                  <ButtonComponent text='Update Password' funName={updateUserInfo} />

                </div>
            </div>
        </div>
      </div>
    </>
  )
}
