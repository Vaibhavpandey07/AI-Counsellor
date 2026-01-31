import React, { useState } from 'react'
import loginImg from "../../assets/images/logIn.jpg"
import Login from '../../features/auth/login'
// import ResetPassword from '../../features/auth/ResetPassword'
// import SendOtp from '../../features/auth/sendOtp'
import Signup from '../../features/auth/Signup'

export default function LoginCard() {
    const [loginPage ,setLoginPage] = useState(true);
    const handlePages = ()=>{
        setLoginPage(prev=>!prev);
    }

  return (
        <div className='flex justify-center items-center h-full w-full '>
            <div className='block flex  flex-col md:flex-row w-[80%] h-[90%] lg:w-[70%] xl:w-[50%] 2xl:w-[40%] md:h-[60%]  overflow-hidden rounded-2xl shadow-xl shadow-purple-500 bg-white '>
                <div className='overflow-hidden w-[100%] h-[50%] md:w-[45%] md:h-[100%]'><img className='overflow-hidden h-full w-full object-cover' src={loginImg} alt=""/></div>
                <div className='overflow-hidden w-[100%] h-[50%] md:w-[55%] md:h-[100%] p-4'>
                    {loginPage && <Login handlePages={handlePages} />}
                    {!loginPage && <Signup handlePages={handlePages} />}
                </div>
    
            </div>
        </div>
  )
}
