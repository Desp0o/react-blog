import React, {useContext} from 'react'
import {AuthContext} from "../components/AuthContext"


export default function Profile() {

  const { currentUser } = useContext(AuthContext)

  return (
    <h1>Hello {currentUser}</h1>
  )
}
