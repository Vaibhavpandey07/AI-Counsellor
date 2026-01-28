import React, { useContext } from 'react'
import Context from '../../Context/Context'
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoutes() {
    const obj = useContext(Context);
    
    return (
    <>
        {obj.isLogIn?(<Outlet/>):(<Navigate to='/logIn' replace/>)}
    </>
  )
}
