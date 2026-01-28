import { useEffect, useState } from "react";
import VideoCard from "../video/VideoCard";
import VideoRow from "../video/VideoRow";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import { formatCount } from "../../../Constant";
import ConfirmModal from "../../components/modals/ConfirmModal";

export default function ChannelPage({sideNav}) {
  const [showAbout, setShowAbout] = useState(false);
  const [channelData,setChannelData] = useState({});
  const params = useParams()
  const channelUserName = params.channelUsername;
  
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);

  const [firstRender , setFirstRender] = useState(true);

  const getChannelData = async()=>{
    setLoading(true);
    api.get(`/api/v1/channels/getChannelDetails/${channelUserName}`).then(res=>{

      if(res?.data?.data){
        res.data.data.profilePhoto = `${String(res.data.data.profilePhoto).slice(1)}`
        res.data.data.coverImage = `${String(res.data.data.coverImage).slice(1)}`
        //  res.data.data.owner
        setChannelData(res.data.data);
        setSubscribe(res.data.data.subscribe)
        
      }
    }).catch(err=>{
       return new Error;
    })

    setLoading(false);

  }
      const [subscribe,setSubscribe] = useState(false);
      const [showConfirmModal , setShowConfirmModal ]= useState(false);

      
      const onSubscribe =()=>{
        if(subscribe){
          setShowConfirmModal(true);
          
        }else{
          api.get(`/api/v1/channels/subscribeTo/${channelData.channelUserName}`).then(res=>{
            setSubscribe(true);
            channelData.totalSubscriberCount+=1;
            channelSubscribed = true;
          }).catch(err=>{
            console.log(err.message);
          })
        }
    
      }


      const onConfirmUnsubscribe =()=>{
    
        api.get(`/api/v1/channels/unsubscribeTo/${channelData.channelUserName}`).then(res=>{
            setSubscribe(false);
            channelData.totalSubscriberCount-=1;
            channelSubscribed = false;
          }).catch(err=>{
            console.log(err.message);
          })
        
        setShowConfirmModal(false)
      }



  useEffect(()=>{
    if(firstRender){
      getChannelData()
      setFirstRender(false);
    }


  },[channelData,subscribe])


  return (
    <>
    {loading && <div className='h-full w-full flex justify-center items-center text-center text-4xl' >  <i className="fa-solid fa-spinner fa-spin"></i> </div>}
    {!loading && <div className={`
        fixed top-16 right-0 
        h-[calc(100vh-4rem)]
        w-full
        ${sideNav ? "md:w-[65%] lg:w-[80%] xl:w-[84%]" : ""}
        px-2 md:px-4 py-4
        overflow-y-auto
        bg-gray-100
      `} >

      <div className="flex
        flex-col
        items-center
        justify-center mb-2">
      <div className="w-[90%] bg-white rounded-xl shadow-md mt-4">
      <div className="w-[100%] h-60 md:h-74 bg-gray-300 rounded-xl overflow-hidden">
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}${channelData.coverImage}`}
          alt="cover"
          className="w-full h-full object-cover"
        />
      </div>
      </div>

      <div className="w-[90%] bg-white rounded-xl shadow-md mt-4 p-6">
        <div className="flex flex-col md:flex-row gap-6">

          {/* AVATAR */}
          <div className="flex-shrink-0">
            <div className="w-28 h-28 rounded-full overflow-hidden border">
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}${channelData.profilePhoto}`}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* DETAILS */}
          <div className="flex flex-col gap-1">

            <h2 className="text-2xl font-semibold">{channelData.channelName}</h2>
            <p className="text-gray-600">@{channelData.channelUserName}</p>

            {/* <button className={`p-2 mt-2  rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 hover:cursor-pointer transition`}>
              Subscribe
            </button> */}

            {!channelData.owner && <button className={`mt-2 p-2 w-3xs rounded-full ${subscribe?'bg-gray-600':'bg-indigo-600'} text-white text-sm font-semibold ${subscribe?'hover:bg-gray-700':'hover:bg-indigo-700'} transition hover:cursor-pointer`} onClick={(e)=>{e.stopPropagation();onSubscribe()}}>
            {subscribe?'Subscribed':'Subscribe'}
          </button>}

          {channelData.owner && <button className={`mt-2 p-2 w-3xs rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition hover:cursor-pointer flex justify-center items-center`} onClick={(e)=>{e.stopPropagation();navigate('/user/channel/updateChannel',{replace:true})}} >
            <i className="fa-regular fa-pen-to-square"></i>&nbsp;<span>Edit Channel Details</span> 
          </button>}

            {/* SHORT DESCRIPTION */}
            <p className="mt-2 text-sm text-gray-700 max-w-3xl line-clamp-2">
             {channelData.description}
            </p>

            {/* MORE BUTTON */}
            <button
              onClick={() => setShowAbout(true)}
              className="text-sm text-indigo-600 mt-1 w-fit hover:underline"
            >
              More
            </button>

            {/* STATS */}
            <div className="flex gap-4 mt-3 text-sm text-gray-700">
              <span>
                <strong>{formatCount(channelData.totalSubscriberCount)}</strong> subscribers
              </span>
              <span>
                <strong>{formatCount(channelData.totalViewCount)}</strong> views
              </span>
            </div>
          </div>
        </div>
      </div>

      
        <VideoRow key={'lastest'} title="Latest Videos"  type='latest' channelUserName={channelUserName} />
        <VideoRow key={'popular'} title="Popular Videos" type='popular' channelUserName={channelUserName} />




      {showAbout && (
        <div className="fixed inset-0 bg-black/40 z-[9999] flex justify-center items-center">
          <div className="bg-white w-[90%] max-w-lg rounded-xl shadow-xl p-6 relative">

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowAbout(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-3">
              About Channel
            </h3>

            <p className="text-sm text-gray-700 whitespace-pre-line">
              {channelData.description}
            </p>

            <div className="mt-4 text-sm text-gray-600">
              <p>
                <strong>Contact:</strong> {channelData.contactInfo}
              </p>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>}

    <ConfirmModal open={showConfirmModal} onConfirm={onConfirmUnsubscribe} onCancel={()=>setShowConfirmModal(false)} message={`Do you want to Unsubscribe ${channelData.channelName}`}/>
    </>
  );
}
