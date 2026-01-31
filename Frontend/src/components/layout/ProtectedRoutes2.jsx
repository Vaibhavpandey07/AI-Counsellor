import React, { useContext } from 'react'
import Context from '../../Context/Context'
import { Navigate, Outlet } from 'react-router-dom';
import SimpleNavbar from './SimpleNavbar';
import Navbar from './Navbar';

export default function ProtectedRoutes2() {
    const obj = useContext(Context);
    
    return (
    <>
        {obj.isLogIn?(<><Navbar sideNav={false} showSearchBar={false}/> <Outlet/></>):(<Navigate to='/logIn' replace/>)}
    </>
  )
}
