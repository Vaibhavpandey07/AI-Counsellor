import { useEffect, useState } from "react";
import { formatCount } from "../../../Constant";
import { Link } from "react-router-dom";
import ConfirmModal from "../../components/modals/ConfirmModal";
import api from "../../api/axios";
import AlertModal from "../../components/common/Alert";

export default function VideoInfoCard({videoDetails}) {
  const description = videoDetails.description

  const MAX_LENGTH = 400; // threshold
  const shouldShowToggle = description.length > MAX_LENGTH;

  const [expanded, setExpanded] = useState(false);

  const [subscribe, setSubscribe] = useState(videoDetails.subscribe);
  const [like, setLike] = useState(videoDetails.liked);
  const [dislike, setDislike] = useState(videoDetails.disliked);

  const [showCopyModal,setShowCopyModal] = useState({check :false , message:""});

  const [linkCopied,setLinkCopied] =useState(false);


  const [showConfirmModal , setShowConfirmModal ]= useState(false);



  const onSubscribe =()=>{
    if(subscribe){
      setShowConfirmModal(true);
      
    }else{
      api.get(`/api/v1/channels/subscribeTo/${videoDetails.channelUserName}`).then(res=>{
        setSubscribe(true);
        videoDetails.totalSubscriberCount+=1;
      }).catch(err=>{
        console.log(err.message);
      })
    }

  }

  const onConfirmUnsubscribe =()=>{
    
    api.get(`/api/v1/channels/unsubscribeTo/${videoDetails.channelUserName}`).then(res=>{
        setSubscribe(false);
        videoDetails.totalSubscriberCount-=1;
      }).catch(err=>{
        console.log(err.message);
      })
    
    setShowConfirmModal(false)
  }

  const onLike=()=>{
    // setLike(prev=>!prev);
    if(!like){
      api.post('/api/v1/videos/likevideo',{"videoId" : videoDetails.video_id ,"liked": true}).then(res=>{
        if(res.status == 409){return;}
        else{
          videoDetails.likes +=1;
          
          if(dislike){
            videoDetails.dislikes -=1;
            setDislike(false);
          }
          setLike(true);
        }
      })
    }
    else{
      api.post('/api/v1/videos/likevideo',{"videoId" : videoDetails.video_id ,"liked": false}).then(res=>{
        if(res.status == 409){return;}
        else{
          videoDetails.likes -=1;
          setLike(false);
        }
      })
    }
  }

  const onDislike =()=>{
      
    if(!dislike){
      api.post('/api/v1/videos/dislikevideo',{"videoId" : videoDetails.video_id ,"disliked": true}).then(res=>{
        if(res.status == 409){return;}
        else{
          videoDetails.dislikes +=1;
          if(like){
            videoDetails.likes -=1;
            setLike(false);
          }
          setDislike(true);
        }
      })
    }
    else{
      api.post('/api/v1/videos/dislikevideo',{"videoId" : videoDetails.video_id ,"disliked": false}).then(res=>{
        if(res.status == 409){return;}
        else{
          videoDetails.dislikes -=1;
          setDislike(false);
        }
      })
    }
  }


  const onShare =()=>{
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    // setLinkCopied(true);
    setShowCopyModal({check:true,message:"Video Url Copied successfully"})
  }



  return (
    <>
    <div className="w-full bg-white rounded-xl shadow-md p-4">

      {/* TITLE */}
      <h1 className="text-xl font-semibold mb-4">
       { videoDetails.title}
      </h1>

      {/* CHANNEL ROW */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div className="flex items-center gap-4">
          
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}${videoDetails.profilePhoto}`}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <Link to={`/channel/${videoDetails.channelUserName}`}><p className="font-semibold text-gray-900">{videoDetails.channelName}</p></Link>
            <p className="text-sm text-gray-600">{formatCount(videoDetails.totalSubscriberCount)} subscribers</p>
          </div>
          
          {!videoDetails.owner && <button className={`ml-2 px-4 py-2 ${subscribe?'bg-gray-700':'bg-indigo-600'} text-white rounded-full text-sm hover:bg-gray-700 hover:cursor-pointer`} onClick={onSubscribe}>
            {subscribe?"Subscribed":"Subscribe"}
            
          </button>}
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-300"onClick={onLike}>
            {like && <i className="fa-solid fa-thumbs-up "></i>}
            {!like && <i className="fa-regular fa-thumbs-up"></i>} {formatCount(videoDetails.likes)}
          </button>
          <button className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-300" onClick={onDislike}>
            {dislike && <i className="fa-solid fa-thumbs-down"></i>}
            {!dislike && <i className="fa-regular fa-thumbs-down"></i>} {formatCount(videoDetails.dislikes)}</button>
          <button className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-300" onClick={onShare}><i className="fa-solid fa-share"></i>          
          </button>
          {linkCopied && (
              // <div className="z-999 top-4 mt-2 px-2 py-1 text-xs text-white bg-black rounded">
              //   Link copied!
              // </div>
              <></>
            )}

          
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="mt-4 bg-gray-100 rounded-xl p-4">

        {/* META */}
        <div className="flex justify-between items-center text-sm text-gray-700 mb-2">
          <span>{formatCount(videoDetails.views)} views • {videoDetails.dateUploaded}</span>

          {shouldShowToggle && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="font-semibold hover:underline"
            >
              {expanded ? "View less" : "View more"}
            </button>
          )}
        </div>

        {/* TEXT */}
        <p
          className={`text-sm text-gray-800 leading-relaxed transition-all ${
            expanded || !shouldShowToggle ? "" : "line-clamp-3"
          }`}
        >
          {description}
        </p>
      </div>
    </div>
        <ConfirmModal open={showConfirmModal} onConfirm={onConfirmUnsubscribe} onCancel={()=>setShowConfirmModal(false)} message={`Do you want to Unsubscribe ${videoDetails.channelName}`}/>
        <AlertModal open={showCopyModal.check} message={showCopyModal.message} onClose={()=>{setShowCopyModal({check:false,message:""})} } textColor="text-green-600"/>
    </>
  );
}
