import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from "axios"

export default function SignInForm() {

  const navigate = useNavigate()
  const {setCurrentUSer, tokenStatus, setRefreshToken} = useContext(AuthContext)

  const [values, setValues] = useState({mail:'', password:''})
  const [response, setResponse] = useState('')

  useEffect(()=>{
    if(tokenStatus === 'token-valid'){
      navigate('/')
    }
  },[])

  const handleValues = (e)=>{
      setValues(prevValues => ({...prevValues, [e.target.name]: e.target.value,}));
  }

  const getValues = async ()=> {
    try {
          const response = await axios.post(process.env.REACT_APP_LOG_HOST, values, {withCredentials: true});
          console.log(response.data);

          const user = localStorage.setItem('user', JSON.stringify(response.data.name)) //set username in localstorage
          const refreshTokenStorage = localStorage.setItem('refreshToken', JSON.stringify(response.data.refreshToken)) //set username in localstorage
          
          setRefreshToken(refreshTokenStorage)
          setCurrentUSer(user) //set username from localstorage to context
          
          window.location.href = '/';
          setValues({mail:'', password:''}) //clear inputs
      } catch (error) {
        setResponse(error.response.data.error);
        console.error('Error:', error);
        
      }
  }

  return (
    <div className='signUp_form_inside'>
        <div className='input_parent'>
            <input className='inputStyle' type='text' name='mail' id='mail' placeholder='Email' value={values.mail} onInput={handleValues}/>
        </div>

        <div className='input_parent'>
            <input className='inputStyle' type='password' name='password' id='password' placeholder='Password' value={values.password} onInput={handleValues}/>
        </div>

        <div className='signUp_btn' onClick={getValues}>Log In</div>

        <p className='signUp_response_error'>{response}</p>
    </div>
  )
}
