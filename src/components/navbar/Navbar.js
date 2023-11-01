import React,{ useContext } from 'react'
import { AuthContext } from '../AuthContext'
import './Navbar.css'
import LogoSvg from "../allSvg"
import NavLinkItem from './NavLinkItem'
import AuthLink from './AuthLink'
import { Link } from 'react-router-dom'

export default function Navbar() {
    const {currentUser,logOutHandler} = useContext(AuthContext)
  return (
    <>
        <div className='navbar'>
            <LogoSvg />

            <div className='nav_menu'>
                <div className='nav_links'>
                    <NavLinkItem linkName='Home' path='/'/> 
                    <NavLinkItem linkName='Recipes' path='/pages/Recipes'/>
                    <NavLinkItem linkName='About Me' />
                    <NavLinkItem linkName='Blog' />
                </div>

                {currentUser !== null ? 
                    <div className='authorized_user'> 
                        <Link to="/pages/Profile" className='user_name'>{currentUser}</Link> 
                        <p className='logout_out' onClick={logOutHandler}>Log Out</p>
                    </div>
                        : 
                    <div className='nav_auth'>
                        <AuthLink linkName='Sign in'/>
                        <AuthLink linkName='Sign Up'/>
                    </div>
                }

                
            </div>
        </div>
    </>
  )
}
