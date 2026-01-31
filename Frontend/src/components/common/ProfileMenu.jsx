import { useContext, useEffect, useRef, useState } from "react";
import Context from "../../Context/Context";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const obj = useContext(Context);
  const navigate = useNavigate();

  const userSettingChange= ()=>{
    return navigate('user/dashboard', {replace:true});
  }
  const uploadClick =()=>{
    if(!obj.isCreator){
      return navigate('/user/channel/createChannel', {replace:true});
    }else{
      return navigate('/user/video/uploadVideo', {replace:true});
    }
  }

  const userChannel =()=>{
    return navigate('/user/ai/chat', {replace:true});
    
  }

  const onLogout =async()=>{
    api.get("/api/v1/users/logout").then(()=>{

        obj.setUsername('');
        obj.setUserProfilePhoto('');
        obj.setIsCreator(false)
        obj.setIsLogIn(false)
        obj.setUserEmail('');
        obj.setChannelDetails({});
        localStorage.removeItem('isLogIn');
        localStorage.removeItem('userEmail');
    }).catch(err=>{
      console.log(err.message);
    })
  }




  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [obj.userProfilePhoto]);

  return (
    <div className="relative mr-4" ref={menuRef}>
      {/* Profile Avatar */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="h-9 w-9 rounded-full overflow-hidden  border-gray-400 bg-gray-200 text-purple-600 shadow-md shadow-gray-400"
      >
        {obj.isLogIn && <img
          src={`${import.meta.env.VITE_API_BASE_URL}${obj.userProfilePhoto}`}
          alt="profile"
          className="h-full w-full object-cover hover:filter hover:blur-[1px]"
        />}
        { !obj.isLogIn && 

          <i className="fa-solid fa-user hover:filter hover:blur-[1px]"></i>
        }
      </button>

      {/* Dropdown */}
      {open && obj.isLogIn && (
        <div className="absolute right-2 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-300 z-50">
          
          {/* Header */}
          <div className="px-4 py-3 border-b border-b-gray-400">
            <p className="text-sm font-semibold">{obj.username}</p>
            <p className="text-xs text-gray-500">{obj.userEmail}</p>
          </div>

          {/* Menu Items */}
          {/* ${danger ? "text-red-600 hover:bg-red-50" : ""} */}

          <ul className="py-2 text-sm">
 

             <li>
              <button
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 `} onClick={userChannel}>
                <i className='fa-solid fa-dice-d6 text-purple-600'></i> AI counsellor
              </button>
            </li>

             <li>
              <button
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 `} onClick={userSettingChange}>
                <i className='fa-solid fa-user text-purple-600'></i> DashBoard
              </button>
            </li>

            {/* <li>
              <button
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 `} >
                <i className='fa-regular fa-image text-purple-600'></i> Change profile photo
              </button>
            </li> */}

            <li className="border-t border-t-gray-400 my-2" />
            
             <li>
              <button
                className={`w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 `} onClick={onLogout}> 
                <i className="fa-solid fa-arrow-right-from-bracket"></i>Logout
              </button>
            </li>

          </ul>
        </div>
      )}

        {open && !obj.isLogIn && (
        <div className="absolute right-2 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-300 z-50">
          
          {/* Header */}
          <div className="px-4 py-3 border-b border-b-gray-400">
            <p className="text-sm font-semibold">Please Login</p>
          </div>

          <ul className="py-2 text-sm">

            
             <li>
              <Link to="/login">
              <button
                className={`w-full text-left px-4 py-2 text-green-600 hover:bg-green-50 `} >
                <i className="fa-solid fa-user-plus"></i> &nbsp; Login
              </button>
              </Link>
            </li>

          </ul>
        </div>
      )}
    </div>
  );
}


