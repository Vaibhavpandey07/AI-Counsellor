import { useContext, useEffect, useState } from "react";
import Context from "../../Context/Context";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import AlertModal from "../../components/common/Alert";

export default function UpdateChannel() {

  const obj = useContext(Context);
  const navigate = useNavigate();
  const [loading,setLoading] =useState(false);

  const [coverImage, setCoverImage] = useState(null);

  const [channelName, setChannelName] = useState("");
  const [channelUserName, setChannelUserName] = useState("");
  const [description, setDescription] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  const [className,setClassName] = useState({
      channelName :  {class : "text-black" , check:false} ,
      channelUserName : {class : "text-black", check:true },
      description : {class : "text-black", check:false },
      contactInfo : {class : "text-black", check:false },
  })

  const [errorModal,setErrorModal] = useState({show:false,message:""});

  const onChangeChannelName =(e)=>{
    setChannelName(e.target.value);
    if(String(e.target.value).length>0){
      setClassName(prev=>({...prev,channelName:{class : "text-black" , check:true} }))
    }else{
      setClassName(prev=>({...prev,channelName:{class : "text-red-400" , check:false} }))
    }
  }


  const onChangeChannelUserName =(e)=>{
      let value = e.target.value;

      value = value.toLowerCase();

      value = value.replace(/\s+/g, "");

      value = value.replace(/[^a-z0-9._]/g, "");

      setChannelUserName(value);



    if(String(e.target.value).length>0){
      setClassName(prev=>({...prev,channelUserName:{class : "text-black" , check:true} }))
    }else{
      setClassName(prev=>({...prev,channelUserName:{class : "text-red-400" , check:false} }))
    }
  }

  const onChangeDescription =(e)=>{
    setDescription(e.target.value);
    if(String(e.target.value).length>0){
      setClassName(prev=>({...prev,description:{class : "text-black" , check:true} }))
    }else{
      setClassName(prev=>({...prev,description:{class : "text-red-400" , check:false} }))
    }
  }
    
  
  const onChangeContactInfo =(e)=>{
    setContactInfo(e.target.value);
    if(String(e.target.value).length>0){
      setClassName(prev=>({...prev,contactInfo:{class : "text-black" , check:true} }))
    }else{
      setClassName(prev=>({...prev,contactInfo:{class : "text-red-400" , check:false} }))
    }
  }




  const handleSubmit = () => {
    if(className.channelName.check  || className.description.check || className.contactInfo.check || coverImage){

      // formData.append('data',JSON.stringify(

      //     {
      //     "channelName":channelName,
      //     "channelUserName":channelUserName ,
      //     "description":description,
      //     "contactInfo" : contactInfo , 
      //     "homeTabSetting":{"sortBy":"latest"} }

      // ))


      if(coverImage){
        const formData = new FormData();
        formData.append('coverImage',coverImage)
      

        api.patch('/api/v1/channels/updateChannelCoverImage',formData,{
          
          headers: "multipart/form-data"
        }).then((res)=>{
          setErrorModal({show:true , message:`Channel details updated successfully`, textColor:"text-green-600"});

        }).catch(err=>{
          setErrorModal({show:true , message:`${err.response.message}`, textColor:"text-red-600"});
        })
      }


      if(className.channelName.check  || className.description.check || className.contactInfo.check){
        const dataTosend = {
          "channelName":channelName,
          "description":description,
          "contactInfo" : contactInfo , 
        }

        api.patch('/api/v1/channels/updateChannel',dataTosend).then(res=>{
          setErrorModal({show:true , message:`Channel details updated successfully`, textColor:"text-green-600"});
        }).catch(err=>{
          setErrorModal({show:true , message:`${err.response.message}`, textColor:"text-red-600"});
        })
      }


    }
  };


  const [firstRender,setFirstRender] = useState(true);
  const [channelData,setChannelData] = useState({});


  const getUserChannelDetails = async()=>{

    setLoading(true);
    api.get(`/api/v1/channels/UserChannelDetails`).then(res=>{

      if(res?.data?.data){
        res.data.data.profilePhoto = `${String(res.data.data.profilePhoto).slice(1)}`
        res.data.data.coverImage = `${String(res.data.data.coverImage).slice(1)}`
        //  res.data.data.owner
        setChannelData(res.data.data);
      }
    }).catch(err=>{
       return new Error;
    })

    setLoading(false);

  }


  useEffect(()=>{
    if(firstRender){
      getUserChannelDetails();
      setFirstRender(false);
    }
    if(channelData){
      setChannelName(channelData.channelName);
      setChannelUserName(channelData.channelUserName);
      // setCoverImage(channelData.coverImage);
      setDescription(channelData.description);
      setContactInfo(channelData.contactInfo);
    }
  },[channelData])


  return (
    <>
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="w-full max-w-4xl h-auto bg-white rounded-xl shadow-lg overflow-hidden mt-15  z-100 ">

        {/* COVER IMAGE */}
        <div className="relative h-48 md:h-60 bg-gray-200">
          
          <label
            htmlFor="coverUpload"
            className=" cursor-pointer shadow"
          >
            
          {coverImage || channelData.coverImage ? (
            <img
              src={coverImage?URL.createObjectURL(coverImage):`${import.meta.env.VITE_API_BASE_URL}${channelData.coverImage}`}
              alt="cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-red-400">
              Upload Cover Image*
            </div>
          )}
          </label>

          <input
            type="file"
            accept="image/*"
            hidden
            id="coverUpload"
            onChange={(e) => setCoverImage(e.target.files[0])}
          />


          {/* AVATAR */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-100 flex items-center justify-center">
              
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}${obj.userProfilePhoto}`}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              
            </div>


          </div>
        </div>

        {/* FORM */}
        <div className="pt-16 px-6 pb-6 space-y-4">
          <div>
            <label className={`text-sm font-medium ${className.channelName.class}`}>Channel Name*</label>
            <input
              value={channelName}
              onChange={onChangeChannelName}
              className="mt-1 w-full border rounded-md p-2"
              placeholder="Your channel name"
            />
          </div>

          <div>
            <label className={`text-sm font-medium ${className.channelUserName.class}`}>Channel Username*</label>
            <input
              value={channelUserName}
              onChange={onChangeChannelUserName}
              className="mt-1 w-full border rounded-md p-2 disabled:bg-gray-300
                disabled:cursor-not-allowed
                disabled:opacity-60"
              placeholder="@yourchannel"
              disabled ={true}
            />
            <p className="text-xs text-gray-500 mt-1">
              Must be unique
            </p>
          </div>

          <div>
            <label className={`text-sm font-medium ${className.description.class}`}>Description</label>
            <textarea
              value={description}
              onChange={onChangeDescription}
              rows={3}
              className="mt-1 w-full border rounded-md p-2"
              placeholder="Tell viewers about your channel"
            />
          </div>

          <div>
            <label className={`text-sm font-medium ${className.contactInfo.class}`}>Contact Info</label>
            <input
              value={contactInfo}
              onChange={onChangeContactInfo}
              className="mt-1 w-full border rounded-md p-2"
              placeholder="Email or website"
            />
          </div>

          {/* CREATE BUTTON */}
          <div className="pt-4">
            <button
              onClick={handleSubmit}
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700
               disabled:bg-gray-700
                disabled:cursor-not-allowed
                disabled:opacity-60"

              disabled={(className.channelName.check===true ||  className.description.check===true || className.contactInfo.check===true || coverImage)?false:true}
            >
              Update Details Channel
            </button>
          </div>
        </div>

      </div>
    </div>

    <AlertModal open={errorModal.show} message={errorModal.message}  onClose={()=>{setErrorModal({show:false,message:""})}} textColor={errorModal.textColor?errorModal.textColor:'text-red-600'}/>
    </>
  );
}
