import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Context from '../../Context/Context';
import axios from 'axios';
import { emailRegex } from '../../../Constant';
import api from '../../api/axios';


export default function Login({handlePages}) {
    
    const navigate = useNavigate();
    const obj = useContext(Context)

    const [email,setEmail] = useState('')
    const [otpEmail,setOtpEmail] = useState('')
    const [password,setPassword] = useState('');
    const [className,setClassName] = useState({
        email :  {class : "border-purple-600" , check:false, placeholder:"Email"} ,
        password : {class : "border-purple-600", check:false , placeholder:"Password"},
        otpEmail : {class : "border-purple-600", check:false , placeholder:"Email"},

        otp : {class : "border-purple-600", check:false , placeholder:"otp"},
        newPassword : {class : "border-purple-600", check:false , placeholder:"new Password"},
        confirmPassword : {class : "border-purple-600", check:false , placeholder:"confirm Password"},

        

    })

    const [isLoading,setLoading] =useState(false);



    const [message,setMessage] = useState('');

    const [message2,setMessage2] = useState('');

    const [message3,setMessage3] = useState('');


    const [page,setPage] = useState(1);

    const location = useLocation()

    const onChangeEmail =async(e)=>{
        setEmail(e.target.value);
        if(!emailRegex.test(e.target.value)){
            setClassName(prev=>({...prev, email:{class : "border-red-700" , check:false, placeholder:"Email" } }))
        }else{
            setClassName(prev=>({...prev, email : {class : "border-purple-600", check:true, placeholder:"Email"} }))
            
        }
    }

    const onChangePassword =async(e)=>{
            setPassword(e.target.value);

        if(String(e.target.value).length<6){
            setClassName(prev=>({...prev, password:{class : "border-red-700" , check:false , placeholder:"Password"} }))
        }else{
            setClassName(prev=>({...prev, password : {class : "border-purple-600", check:true , placeholder:"Password"}  }))
        }
    }


     const onLogin=async()=>{
            if(!emailRegex.test(email)){
                setClassName(prev=>({...prev, email:{class : "border-red-700" , check:false, placeholder:"Email"} }));
                return;
            }
            if(password.length <6){
                setClassName(prev=>({...prev, password:{class : "border-red-700" , check:false, placeholder:"Password"} }))
                return
            }
            else if(className.email.check===true && className.password.check===true){
                
                await api.post('/api/v1/users/login',
                    {"email":email,"password":password}
                ).then(async ()=>{
                    localStorage.setItem("userEmail", email);
                    localStorage.setItem("isLogIn", true);

                    obj.setUserEmail(email);
                    obj.setIsLogIn(true);
                    navigate("/", {replace:true});
                
                }
                ).catch((err)=>{
                    if(err.response?.status ===403){

                        setPage(4);
                    }

                    else if(err.response?.data)
                    {       
                        err = err.response?.data;
                        setMessage(err.message);
                        if(err.data.email && !(err.data.email.check)){
                        setClassName(prev=>({...prev, email:{class : "border-red-700" , check:false} }));
                        return;
                    }

                    else if(err.data.password && !(err.data.password.check)){
                        setClassName(prev=>({...prev, password:{class : "border-red-700" , check:false, }}));
                        return;
                    }
                    }
                    else{
                        setMessage(err.message);

                    }
                }
                )
                
                
                
                
            }
        }
    

    const onChangeOTPEmail =async(e)=>{
        setOtpEmail(e.target.value);
        if(!emailRegex.test(e.target.value)){
            setClassName(prev=>({...prev, otpEmail:{class : "border-red-700" , check:false, placeholder:"Email" } }))
        }else{
            setClassName(prev=>({...prev, otpEmail : {class : "border-purple-600", check:true, placeholder:"Email"} }))
            
        }
    }
    

    const onClickSendOtp = async()=>{
        if(!emailRegex.test(otpEmail)){
            setClassName(prev=>({...prev, otpEmail:{class : "border-red-700" , check:false, placeholder:"Email"} }));
            return;
        }
        else if(className.otpEmail.check){
            setLoading(true);
            await api.post('api/v1/users/generateNewOtp', {"email":otpEmail,"forgetPassword":true}).then(()=>{
                alert("OTP send successfully");
                setPage(3);
            }).catch((err)=>{
                setClassName(prev=>({...prev, otpEmail:{class : "border-red-700" , check:false, }}));

                if(err.response.data.message){
                    setMessage2(err.response.data.message);
                }else{
                    setMessage2(err.message);
                }
            })
            setLoading(false)

        }


    }

    const [newPassword , setNewPassword] = useState('');
    const [confirmPassword , setConfirmPassword] = useState('');
    const [otp,setOtp] = useState();

    const onChangeOtp = (e)=>{
        setOtp(e.target.value);
        if(String(e.target.value).length<4){
            setClassName(prev=>({...prev, otp:{class : "border-red-700" , check:false , placeholder:"OTP"} }))
        }else{
            setClassName(prev=>({...prev, otp : {class : "border-purple-600", check:true , placeholder:"OTP"}  }))
        }
    }


    const onChangeNewPassword = (e)=>{
        setNewPassword(e.target.value);
        if(String(e.target.value).length<6){
            setClassName(prev=>({...prev, newPassword:{class : "border-red-700" , check:false , placeholder:"new Password"} }))
        }else{
            setClassName(prev=>({...prev, newPassword : {class : "border-purple-600", check:true , placeholder:"new Password"}  }))
        }
    }

    const onChangeConfirmPassword = (e)=>{
        setConfirmPassword(e.target.value);
        if(String(e.target.value).length<6 && e.target.value!=newPassword ){
            setClassName(prev=>({...prev, confirmPassword:{class : "border-red-700" , check:false , placeholder:"confirm Password"} }))
        }else{
            setClassName(prev=>({...prev, confirmPassword : {class : "border-purple-600", check:true , placeholder:"confirm Password"}  }))
        }
    }

    const onResetPassword = ()=>{
        if(String(confirmPassword) != String(newPassword)){
            setMessage3("Confirm Password Does not match the New Password")
            return;
        }
        else if(className.otp.check && className.newPassword.check && className.confirmPassword.check){

            api.patch("/api/v1/users/resetPasswordWithOTP",{"email":otpEmail,"otp":otp,"newPassword" :newPassword}).then(()=>{

                alert("Password Changed successfully");
                setOtpEmail('');
                setNewPassword('');
                setOtp('');
                setConfirmPassword('');
                setPage(1);

            }).catch((err)=>{
                
                if(err.response.data.message){
                    setMessage3(err.response.data.message);
                }else{
                    setMessage3(err.message);
                }
            })
        }
    }



    const [cooldown, setCooldown] = useState(0);


    const onClickResendOtp =async(forgetPassword)=>{
          if(className.otpEmail.check){
            setLoading(true);
            await api.post('/api/v1/users/generateNewOtp', {"email":otpEmail,"forgetPassword":forgetPassword}).then(()=>{
                setCooldown(60);
                setMessage3("OTP send Successfully")
            }).catch((err)=>{
                setClassName(prev=>({...prev, otpEmail:{class : "border-red-700" , check:false, }}));

                if(err.response.data.message){
                    setMessage3(err.response.data.message);
                }else{
                    setMessage3(err.message);
                }
            })
            setLoading(false)
        }
    }


    const onVerify = async()=>{
        if(className.otp.check && className.email.check){
            setLoading(true);
            await api.post('/api/v1/users/verifyEmail', {"email":email , "otp":otp}).then(async(res)=>{
                
                if(res.status===200){
                    await api.post('/api/v1/users/login',
                        {"email":email,"password":password}
                    ).then(async ()=>{
                        localStorage.setItem("userEmail", email);
                        localStorage.setItem("isLogIn", true);

                        obj.setUserEmail(email);
                        obj.setIsLogIn(true);
                        
                        setEmail('');
                        setPassword('');
                        setFirstName('');
                        setLastName('')
                        setProfilePhoto('');
                        setOtp('');
                        navigate("/", {replace:true});
                        
                    }
                    ).catch((err)=>{

                        throw new err;
                    })

                }

            }).catch((err)=>{
                setClassName(prev=>({...prev, otp:{class : "border-red-700" , check:false, }}));

                if(err.response.data.message){
                    setMessage3(err.response.data.message);
                }else{
                    setMessage3(err.message);
                }
            })
            setLoading(false)
        }
    }


    useEffect(()=>{
       
        if(obj.isLogIn && location.pathname != '/'){
            navigate('/',{replace:true});
        }
        if(cooldown <= 0){return;}

        const timer = setInterval(()=>{
            setCooldown(prev=>prev-1);
        },1000)

        return ()=>{clearInterval(timer)}

    },[obj.isLogIn, cooldown])
   


  return (
    <>

    {page===1 &&  <div className='flex flex-col items-center justify-center h-[100%] w-[100%]'>
        <div className='block text-purple-600 font-bold text-4xl'> Creators-Hub </div>
        <div className='h-[60%] w-[90%] p-3 flex flex-col rounded-2xl '>
            {/* <div className='font-bold text-lg text-black text-xl'>Email</div> */}
            <div className={`m-1 font-semibold  text-black text-2xs border-1 ${className.email.class} rounded-xl p-2`}><input className='outline-none hover:outline-none w-[100%]' type="text" placeholder={className.email.placeholder} onChange={onChangeEmail} value={email} ></input></div>

            {/* <div className='font-bold text-lg text-black text-xl'>Password</div> */}
            <div className={`m-1 font-semibold text-black text-2xs border-1 ${className.password.class} rounded-xl p-2`}><input className='outline-none hover:outline-none w-[100%]' type="password" placeholder={className.password.placeholder} onChange={onChangePassword} value={password}></input></div>

            <div className='my-2 p-1 w-[100%] h-[20%] flex justify-center items-center'><button className={`my-2 
            
                bg-purple-600
                disabled:bg-gray-700
                disabled:cursor-not-allowed
                disabled:opacity-60
            
            w-[80%] h-[100%] font-bold text-white rounded-2xl shadow-2xl hover:bg-purple-800 hover:cursor-pointer`}
            
            disabled={(className.email.check===true && className.password.check===true)?false:true}
            
            onClick={onLogin}>Login</button></div>
            
            <div className='p-1 w-[100%]  flex justify-center items-center '>
                <h4>Don't have an Account?</h4><h4 className='text-purple-600 hover:text-purple-800 hover:cursor-pointer' onClick={handlePages} >&nbsp; Signup</h4>

            </div>
            <div className='p-1 w-[100%] h-[20%] flex justify-center items-center'>
                <h4 className='text-purple-600 hover:text-purple-800 hover:cursor-pointer ' onClick={()=>{setPage(2)}}> Forgot Password?</h4>

            </div>
        </div>
        <div className='p-1 w-[100%]  flex justify-center items-center'>
            <h4 className='text-red-600'> {message} </h4>
        </div>
    </div>}
    {
        page===2 && (
            <div className='flex flex-col items-center justify-center h-[100%] w-[100%]'>
                { !isLoading && (<><div className='block text-purple-600 font-bold text-xl '>Registered email address</div>
                <div className='h-[60%] w-[90%] p-3 flex flex-col rounded-2xl '>
                    {/* <div className='font-bold text-lg text-black text-xl'>Email</div> */}
                    <div className={`m-1 font-bold  text-black text-2xs border-1 ${className.otpEmail.class} rounded-xl p-2`}><input className='outline-none hover:outline-none w-[100%]' type="text" placeholder={className.otpEmail.placeholder} onChange={onChangeOTPEmail} value={otpEmail} ></input></div>

                    {/* <div className='font-bold text-lg text-black text-xl'>Password</div> */}

                    <div className='my-2 p-1 w-[100%] h-[20%] flex justify-center items-center'><button className='my-2 
                        bg-purple-600
                        disabled:bg-gray-700
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    w-[80%] h-[100%] font-bold text-white rounded-2xl shadow-2xl hover:bg-purple-800 hover:cursor-pointer' onClick={onClickSendOtp} 
                        disabled={className.otpEmail.check===true?false:true}
                        
                        >Send OTP</button></div>
                    
                    <div className='p-1 w-[100%]  flex justify-center items-center'>
                        <h4>Don't have an Account?</h4><h4 className='text-purple-600 hover:text-purple-800 hover:cursor-pointer' onClick={handlePages}>&nbsp; Signup</h4>

                    </div>

                    <div className='p-1 w-[100%]  flex justify-center items-center'>
                        <h4 className='text-red-600'> {message2} </h4>
                    </div>

                </div></>)}
                {isLoading && <i className="fa-solid fa-spinner fa-spin text-4xl"></i>}
            </div>
        )

    }

    {page===3 && 
    (
        <div className='flex flex-col items-center justify-center h-[100%] w-[100%]'>
            <div className='block text-purple-600 font-bold text-2xl '> Reset Password</div>
            <div className='h-[60%] w-[90%] p-3 flex flex-col rounded-2xl '>
                {/* <div className='font-bold text-lg text-black text-xl'>Email</div> */}
                <div className={`m-1 font-semibold  text-black text-2xs border-1 ${className.otp.class} rounded-xl p-2`}><input className='outline-none hover:outline-none w-[100%]' type="text" placeholder='OTP send on Email' onChange={onChangeOtp} value={otp}></input></div>

                {/* <div className='font-bold text-lg text-black text-xl'>Password</div> */}
                <div className={`m-1 font-semibold  text-black text-2xs border-1 ${className.newPassword.class} rounded-xl p-2`}><input className='outline-none hover:outline-none w-[100%]' type="password" placeholder='New Password' onChange={onChangeNewPassword} value={newPassword}></input></div>
                <div className={`m-1 font-semibold  text-black text-2xs border-1 ${className.confirmPassword.class} rounded-xl p-2`}><input className='outline-none hover:outline-none w-[100%]' type="password" placeholder='Confirm Password' onChange={onChangeConfirmPassword} value={confirmPassword}></input></div>

                <div className='my-2 p-1 w-[100%] h-[20%] flex justify-center items-center'><button className='my-2 
                bg-purple-600
                
                disabled:bg-gray-700
                disabled:cursor-not-allowed
                disabled:opacity-60
                w-[80%] h-[100%] font-semibold text-white rounded-2xl shadow-2xl hover:bg-purple-800 hover:cursor-pointer' 
                
                disabled = {(className.otp.check===true && className.newPassword.check===true && className.confirmPassword.check ===true)?false:true}
                onClick={onResetPassword}
                
                >Reset Password</button></div>
                
                <div className='p-1 w-[100%]  flex justify-center items-center'>
                    <h4 className='text-purple-600 hover:text-purple-800 hover:cursor-pointer'>&nbsp; 
                    <button
                        disabled={cooldown > 0}
                        onClick={onClickResendOtp(true)}
                        className={`font-medium ${
                            cooldown > 0
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-purple-600 hover:text-purple-800"
                        }`}
                        >
                        {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                    </button>

                    </h4>

                </div>
                <div className='p-1 w-[100%]  flex justify-center items-center'>
                    {!isLoading && <h4 className='text-red-600'> {message3} </h4>}
                    {isLoading && <i className="fa-solid fa-spinner fa-spin text-xl"></i>}

                </div>

            </div>
        </div>

    )
    
    }


    {
        page===4 &&
            
            (
                <div className='flex flex-col items-center justify-center h-[100%] w-[100%]'>
                    <div className='block text-purple-600 font-bold text-4xl'> Creators-Hub </div>
                    <div className='h-[60%] w-[90%] p-3 flex flex-col rounded-2xl '>
                        <div className='text-lg font-semibold text-gray-400 text-md p-2'>Enter the OTP sent to your email</div>
                        <div className={`m-1 font-semibold  text-black text-2xs border-1 ${className.otp.class} rounded-xl p-2`}>
                           <label>
                            <input className='outline-none hover:outline-none w-[100%]' type="number" placeholder='OTP'
                            onChange={onChangeOtp} value={otp}
                            ></input>
                           </label> 
                        </div>


                        <div className='my-2 p-1 w-[100%] h-[20%] flex justify-center items-center'><button className='my-2 
                        bg-purple-600
                        disabled:bg-gray-700
                        disabled:cursor-not-allowed
                        disabled:opacity-60 
                        w-[80%] h-[100%] font-bold text-white rounded-2xl shadow-2xl hover:bg-purple-800 hover:cursor-pointer' 
                         disabled ={(className.otp.check===true)?false:true}
                        onClick={onVerify}
                        >Verify</button></div>
                        
                        <div className='p-1 w-[100%] h-[20%] flex justify-center items-center'>
                            <h4 className='text-purple-600 hover:text-purple-800 hover:cursor-pointer'>
                                
                            <button
                                disabled={cooldown > 0}
                                onClick={onClickResendOtp(4)}
                                className={`font-medium ${
                                    cooldown > 0
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-purple-600 hover:text-purple-800"
                                }`}
                                >
                                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                            </button>
                            </h4>

                        </div>
                        <div className='p-1 w-[100%] h-[20%] flex justify-center items-center'>
                            {!isLoading && <h4 className='text-red-600'> {message3} </h4>}
                            {isLoading && <i className="fa-solid fa-spinner fa-spin text-xl"></i>}

                        </div>

                    </div>
                </div>

            )


        }

    </>
  )
}
