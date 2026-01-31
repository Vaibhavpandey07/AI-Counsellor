import React, { useContext, useEffect, useState } from 'react'
import { emailRegex } from '../../../Constant';
import api from '../../api/axios';
import Context from '../../Context/Context';
import { useNavigate } from 'react-router-dom';

export default function Signup({handlePages}) {
    
    const obj = useContext(Context)
    const navigate = useNavigate();

    const [page,setPage] = useState(1);
    const [fileName, setFileName] = React.useState("");

    const [image, setImage] = useState(null);


    const [email,setEmail] = useState('')
    const [otp,setOtp] = useState('')
    const [password,setPassword] = useState('');
    const [firstName,setFirstName] = useState('');
    const [lastName,setLastName] = useState('');
    const [profilePhoto, setProfilePhoto] = useState(null);



    const [className,setClassName] = useState({
        email :  {class : "border-purple-600" , check:false, placeholder:"Email"} ,
        password : {class : "border-purple-600", check:false , placeholder:"Password"},
        otp : {class : "border-purple-600", check:false , placeholder:"otp"},
    })

    const [isLoading,setLoading] =useState(false);



    const [message2,setMessage2] = useState('');

    const [message3,setMessage3] = useState('');

    const [cooldown, setCooldown] = useState(0);
    

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

    const onChangeOtp =async(e)=>{
        setOtp(e.target.value);

        if(String(e.target.value).length<4){
            setClassName(prev=>({...prev, otp:{class : "border-red-700" , check:false , placeholder:"Password"} }))
        }else{
            setClassName(prev=>({...prev, otp : {class : "border-purple-600", check:true , placeholder:"Password"}  }))
        }
    }

    const onClcikNext =()=>{
        if(!emailRegex.test(email)){
            setClassName(prev=>({...prev, email:{class : "border-red-700" , check:false, placeholder:"Email"} }));
            return;
        }
        if(password.length <6){
            setClassName(prev=>({...prev, password:{class : "border-red-700" , check:false, placeholder:"Password"} }))
            return
        }
        else if(className.email.check===true && className.password.check===true && firstName.length>0 && lastName.length>0 ){
            setPage(2);
        }
    }




    const handleFile = async(e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Optional: validate file type
        if (!file.type.startsWith("image/")) return;
        setImage(URL.createObjectURL(file));
        setFileName(file.name);

        setProfilePhoto(file);

    };

    const onSubmit = async()=>{
        
        const formData = new FormData();

        formData.append('profilePhoto',profilePhoto);

        formData.append('data', JSON.stringify(
            {
                "email":email,
                "firstName":firstName ,
                "lastName":lastName ,
                "password":password,
            }))

        
        setLoading(true)
        await api.post("/api/v1/users/register",formData,{
            headers:{
                "Content-Type":"multipart/form-data"
            }
        }).then((res)=>{
            setPage(3);
            alert("Verification OTP Sent on Email")
        }).catch(err=>{
            if(err?.response?.data?.message){
                setMessage2(err?.response?.data?.message);
            }else{
                setMessage2(err.message);
            }
        })
        setLoading(false)


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


    
    const onClickResendOtp =async()=>{
          if(className.email.check){
            setLoading(true);
            await api.post('/api/v1/users/generateNewOtp', {"email":email}).then(()=>{
                setCooldown(60);
                setMessage3("OTP send Successfully")
            }).catch((err)=>{

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
        <div className='flex flex-col items-center justify-center h-[100%] w-[100%]'>
        
        {page===1 && <>
        
        <div className='block text-purple-600 font-bold text-4xl'> Sign-Up </div>
        <div className='h-[60%] w-[90%] p-3 flex flex-col rounded-2xl '>
            {/* <div className='font-bold text-lg text-black text-xl'>Email</div> */}
            <div className={`m-1 font-semibold  text-black text-2xs border-1 ${className.email.class} rounded-xl p-2`}><input className='outline-none hover:outline-none w-[100%]' type="text" placeholder='Email' value={email} onChange={onChangeEmail} ></input></div>

            <div className='m-1 font-semibold  text-black text-2xs border-1 border-purple-600 rounded-xl p-2'><input className='outline-none hover:outline-none w-[100%]' type="text" placeholder='First Name' value={firstName} onChange={(e)=>setFirstName(e.target.value)}></input></div>

            <div className='m-1 font-semibold  text-black text-2xs border-1 border-purple-600 rounded-xl p-2'><input className='outline-none hover:outline-none w-[100%]' type="text" placeholder='Last Name' value={lastName} onChange={(e)=>setLastName(e.target.value)}></input></div>

            {/* <div className='font-bold text-lg text-black text-xl'>Password</div> */}
            <div className={`m-1 font-semibold  text-black text-2xs border-1 ${className.password.class} rounded-xl p-2`}><input className='outline-none hover:outline-none w-[100%]' type="password" placeholder='Password' onChange={onChangePassword} value={password}></input></div>

            <div className='my-2 p-1 w-[100%] h-[20%] flex justify-center items-center'><button className='my-2 
            bg-purple-600
            disabled:bg-gray-700
            disabled:cursor-not-allowed
            disabled:opacity-60
            w-[80%] h-[100%] font-semibold text-white rounded-2xl shadow-2xl hover:bg-purple-800 hover:cursor-pointer' 
            
            disabled={(className.email.check===true && className.password.check===true && firstName.length>0 && lastName.length>0)?false:true}
            
            onClick={onClcikNext} >
                Next
                <i class="fa-solid fa-angles-right"></i>
            </button></div>
            <div className='p-1 w-[100%]  flex justify-center items-center'>
                <h4>Have an Account?</h4><h4 className='text-purple-600 hover:text-purple-800 hover:cursor-pointer'onClick={handlePages}>&nbsp; Login</h4>

            </div>
            
            

        </div>
        </>
        }
        {page===2 &&
        <div className='h-[80%] w-[90%] p-3 flex flex-col rounded-2xl '>
            {/* <div className='font-bold text-lg text-black text-xl'>Email</div> */}
            {!isLoading && <>
            
            <div className='flex w-[100%] h-[41%] p-1 m-1 justify-center items-center'>
                <div className=' flex justify-center items-center h-[100%] w-[26%] md:w-[46%] lg:w-[40%] xl:w-[46%] rounded-full text-purple-600 shadow-4xl border-2 border-gray-100 overflow-hidden'> 

                    {image ? 
                    (<img src={image} alt="avatar" className="w-full h-full object-cover" />) :
                    
                    (<i className="fa-regular fa-user fa-fade text-4xl"></i>)
                    }
                    
                </div>
            </div>
            

            <div className='m-1   text-2xs border-1 border-purple-600 rounded-xl '>
                <label className="cursor-pointer">
                    <input
                        type="file"
                        className="hidden"
                        onChange={handleFile}
                    />

                    <div className="flex justify-between items-center rounded-lg px-4 py-2 ">
                        <h6 className='text-gray-500 w-[80%] overflow-hidden'>{fileName || "Choose Profile Photo"}</h6>
                        <i className="fa-solid fa-file text-purple-600"></i>
                    </div>
                    
                </label>
            
            </div>
            <div className='my-2 p-1 w-[100%] h-[20%] flex justify-center items-center'>
                
                <button className='my-2 mx-3 bg-purple-600 w-[40%] h-[80%] font-semibold text-white rounded-2xl shadow-2xl hover:bg-purple-800 hover:cursor-pointer' onClick={()=>{setPage(1)}} ><i className="fa-solid fa-angles-left"></i> Back</button>
                <button className='my-2 
                    bg-purple-600
                    disabled:bg-gray-700
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    w-[40%] h-[80%] font-semibold  text-white rounded-2xl shadow-2xl hover:bg-purple-800 hover:cursor-pointer' onClick={onSubmit}
                    disabled={fileName?false:true}
                    
                    
                    >Submit </button>
            
            </div>
            
            <div className='p-1 w-[100%]  flex justify-center items-center'>
                <h4>Have an Account?</h4><h4 className='text-purple-600 hover:text-purple-800 hover:cursor-pointer' onClick={handlePages}>&nbsp; Login</h4>

            </div>
            

            <div className='p-1 w-[100%]  flex justify-center items-center'>
                <h4 className='text-red-600'>{message2}</h4>
            </div></>}
            
            
            {isLoading && 
            <div className='flex w-[100%] h-[90%] p-1 m-1 justify-center items-center'>
                <i className="fa-solid fa-spinner fa-spin text-4xl"></i>
            </div>}

            

        </div>
        }

        {
            page===3 &&
            
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
                                onClick={onClickResendOtp}
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
    </div>
  )
}
