import { useContext, useEffect, useState } from "react";
import Context from "../../Context/Context";
import ConfirmModal from "../../components/modals/ConfirmModal";
import api from "../../api/axios";
import AlertModal from "../../components/common/Alert";

export default function UpdateUserDetails() {

  const obj = useContext(Context);


  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showModal,setShowModal] = useState(false);
  
  
  const [showUpdateModal,setShowUpdateModal] = useState({check:false,"message":''});
  const [showAvatarUpdate,setShowAvatarUpdate] = useState({check:false,"message":''});
  const [showDeleteModal,setShowDeleteModal] = useState({check:false,"message":''});





  const handleSave = async() => {
    let payload = {};
    if(firstName != obj.firstName && firstName.length >0){
      payload.firstName = firstName;
    }
    if(lastName != obj.lastName && lastName.length >0){
      payload.lastName = lastName;
    }

    if(Object.keys(payload).length > 0){
      await api.patch('/api/v1/users/updateDetails',payload).then((res)=>{
        payload.firstName?obj.setFirstName(payload.firstName):'';
        payload.lastName?obj.setLastName(payload.lastName):'';
        setShowUpdateModal({check:true,message : "User Details Updated Successfully"});
      }).catch(err=>{
          if(err.response.data.message){
              setShowUpdateModal({check:true,message : err.response.data.message});
          }else{
              setShowUpdateModal({check:true,message : err.message});
          }

      })
    }

    if(profilePhoto){
      let formData = new FormData();
      formData.append('profilePhoto',profilePhoto)

      await api.patch('/api/v1/users/updateProfilePhoto',formData,{headers:{
        "Content-Type": "multipart/form-data"
      }}).then(res=>{
          
          setShowAvatarUpdate({check:true,message:"Profile Photo Updated!"})
          obj.setUserProfilePhoto(String(res.data.data.profilePhoto).slice(1));

      }).catch(err=>{

          if(err.response.data.message){
              setShowAvatarUpdate({check:true,message : err.response.data.message});
          }else{
              setShowAvatarUpdate({check:true,message : err.message});
          }


      })
    }


    else{
      setShowUpdateModal({check:true,message : "No Fields Updated"});
    }
  };


  const onConfirmDelete = ()=>{
    setShowModal(false);
    api.delete('/api/v1/users/removeUser').then(res=>{

      
        obj.setUsername('');
        obj.setUserProfilePhoto('');
        obj.setIsCreator(false)
        obj.setIsLogIn(false)
        obj.setUserEmail('');
        obj.setChannelDetails({});
        localStorage.removeItem('isLogIn');
        localStorage.removeItem('userEmail');

    }).catch(err=>{

      if(err.response.data.message){
          setShowDeleteModal({check:true,message : err.response.data.message});
      }else{
          setShowDeleteModal({check:true,message : err.message});
      }

    })

  }

  const onCancelDelete = ()=>{
      setShowModal(false);
  }






  useEffect(()=>{

    setFirstName(obj.firstName);
    setLastName(obj.lastName);
    setEmail(obj.userEmail)

  },[obj])


  return (<>
   
   
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">User Settings</h2>
          <button
            onClick={()=>setShowModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete Account
          </button>
        </div>

        {/* Profile Photo (Top, Centered) */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-28 h-28 rounded-full border overflow-hidden flex items-center justify-center bg-gray-100">
            {
              <img
                src={(profilePhoto)?URL.createObjectURL(profilePhoto):`${import.meta.env.VITE_API_BASE_URL}${obj.userProfilePhoto}`}
                alt="profile"
                className="w-full h-full object-cover"
              />
            }
          </div>

          <input
            type="file"
            accept="image/*"
            hidden
            id="profileUpload"
            onChange={(e) => setProfilePhoto(e.target.files[0])}
          />

          <label
            htmlFor="profileUpload"
            className="text-indigo-600 cursor-pointer text-sm"
          >
            Change profile photo
          </label>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">First Name</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 w-full border rounded-md p-2"
              placeholder="Enter first name"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Last Name</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 w-full border rounded-md p-2"
              placeholder="Enter last name"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={true}
              className="mt-1 w-full border rounded-md p-2 disabled:text-gray-700
                        disabled:cursor-not-allowed
                        disabled:opacity-60"
              placeholder="Enter email"
            />
          </div>

          <div>
            <button
              className="mt-1 w-full border rounded-md p-2 bg-indigo-600 text-white disabled:text-gray-700
                        disabled:cursor-not-allowed
                        disabled:opacity-60 hover:cursor-pointer hover:bg-indigo-700 shadow-2xl"

              onClick={handleSave}
            >
              Save Changes

            </button>
          </div>
        </div>
      </div>
    </div>
   
 
    <ConfirmModal open={showModal} onConfirm={onConfirmDelete} onCancel={onCancelDelete} message={"All Users Details will be Deleted"} />
    <AlertModal open={showUpdateModal.check} message={showUpdateModal.message} onClose={()=>{setShowUpdateModal({check:false,message:""})}} />
    <AlertModal open={showAvatarUpdate.check} message={showAvatarUpdate.message} onClose={()=>{setShowAvatarUpdate({check:false,message:""})}} />

    <AlertModal open={showDeleteModal.check} message={showDeleteModal.message} onClose={()=>{setShowDeleteModal({check:false,message:""})}} />


  </>
)}

 