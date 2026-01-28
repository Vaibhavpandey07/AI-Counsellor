import { Link, useNavigate } from "react-router-dom";
import { formatCount } from "../../../Constant";
import { useEffect, useState } from "react";
import ConfirmModal from "../../components/modals/ConfirmModal";
import api from "../../api/axios";

export default function ChannelCard({
  obj ={
      "channelName": "Vaibhav Pandey Cricket",
      "description": "Hey friends my name is Vaibhav Pandey , the reason beside creating this channel is to teach you all more and more about cricket including batting bowling and fielding so I need you all to please support me so I can make every child's dream come true \n\nFor Business Inquiries : vaibhav36vp@gmail.com\n\nI started uploading videos on this channel on 26 August  2017",
      "channelUserName": "vaibhavpandey_cricket",
      "profilePhoto": "/public/avatar/228470d9-144f-4c59-9294-45688b015e57-profilePhoto-1767902435209.jpg",
      "coverImage": "/public/coverImages/ca8bb1e1-3761-4b6c-a43d-09e6fceee479-coverImage-1767902525035.jpg",
      "totalSubscriberCount": 1,
      "totalViewCount": 130
        },
  channelSubscribed = true ,owner=false} )
  
  {   

      const navigate = useNavigate();
      const [subscribe,setSubscribe] = useState(channelSubscribed);
      const [showConfirmModal , setShowConfirmModal ]= useState(false);

      
      const onSubscribe =()=>{
        if(subscribe){
          setShowConfirmModal(true);
          
        }else{
          api.get(`/api/v1/channels/subscribeTo/${obj.channelUserName}`).then(res=>{
            setSubscribe(true);
            obj.totalSubscriberCount+=1;
            channelSubscribed = true;
          }).catch(err=>{
            console.log(err.message);
          })
        }
    
      }


      const onConfirmUnsubscribe =()=>{
    
        api.get(`/api/v1/channels/unsubscribeTo/${obj.channelUserName}`).then(res=>{
            setSubscribe(false);
            obj.totalSubscriberCount-=1;
            channelSubscribed = false;
          }).catch(err=>{
            console.log(err.message);
          })
        
        setShowConfirmModal(false)
      }

      const onCardClick = ()=>{
        navigate(`/channel/${obj.channelUserName}`,{replace:true});

      }

  useEffect(()=>{

  },[subscribe]);


  return (
    <>
    <div onClick={onCardClick} onKeyDown={(e) => e.key === "Enter" && navigate(`/channel/${obj.channelUserName}`,{replace:true}) }>
    <div className="h-85 w-116 flex flex-col items-center rounded-2xl hover:bg-gray-200 m-3 transition">

      <div className="relative w-112 flex justify-center">

        <div className="h-44 w-full rounded-xl overflow-hidden shadow-md">
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}${obj.coverImage}`}
            alt="cover"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="absolute -bottom-8">
          <div className="h-16 w-16 rounded-full overflow-hidden border-4 border-white bg-white">
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}${obj.profilePhoto}`}
              alt="avatar"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

      </div>

      <div className="mt-10 flex flex-col items-center text-center px-3">
        <h3 className="font-bold text-lg text-black truncate w-full">
          {obj.channelName}
        </h3>
        
          <div className="text-xs text-gray-600 mt-1">
            <p>{formatCount(obj.totalSubscriberCount)} subscribers</p>
            <p>{formatCount(obj.totalViewCount)} views</p>
          </div>

          {!owner && <button className={`mt-3 px-5 py-1.5 rounded-full ${subscribe?'bg-gray-600':'bg-indigo-600'} text-white text-sm font-semibold  ${subscribe?'hover:bg-gray-700':'hover:bg-indigo-700'} transition`} onClick={(e)=>{e.stopPropagation();onSubscribe()}}>
            {subscribe?'Subscribed':'Subscribe'}
          </button>}

          {owner && <button className={`mt-3 px-5 py-1.5 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition`}>
            Your Channel
          </button>}
        
      </div>
    </div>
    </div>
    <ConfirmModal open={showConfirmModal} onConfirm={onConfirmUnsubscribe} onCancel={()=>setShowConfirmModal(false)} message={`Do you want to Unsubscribe ${obj.channelName}`}/>
    </>
  );
}
