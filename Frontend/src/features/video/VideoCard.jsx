import React from "react";
import thumbnail from "../../assets/images/thumbnail.jpg";
import channelProfilePhoto from "../../assets/images/channelProfilePhoto.jpg";
import { Link, replace, useNavigate } from "react-router-dom";
import { formatCount } from "../../../Constant";

export default function VideoCard({ obj, showChannelName = true }) {
  const navigate = useNavigate();
  return (

    <div className="
      w-full max-w-[320px] sm:max-w-[360px]
      flex flex-col
      rounded-xl
      hover:bg-gray-200
      transition
      p-2
      
    ">
   <div onClick={()=>{navigate(`/video/${obj.video_id}`,{replace:true})}} onKeyDown={(e) => e.key === "Enter" && navigate(`/video/${obj.video_id}`,{replace:true}) }>

      <div className="
        w-full aspect-video
        rounded-lg
        overflow-hidden
        shadow-md
      ">
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}${obj.thumbnail}`}
          alt="thumbnail"
          className="w-full h-full object-cover"
        />
      </div>
      

      <div className="flex gap-3 mt-3">
        
        <div className="w-10 h-10 flex-shrink-0 rounded-full overflow-hidden">
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}${obj.profilePhoto}`}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <h3 className="font-semibold text-sm text-black line-clamp-2">
            {obj.title}
          </h3>

          {showChannelName && (
            <h5 className="text-xs font-medium text-indigo-600 hover:cursor-pointer hover:text-indigo-700 mt-0.5" onClick={(e)=>{e.stopPropagation();navigate(`/channel/${obj.channelUserName}`,{replace:true})}}>
              {obj.channelName}
            </h5>
          )}

          {/* <div className="flex  text-xs text-gray-600 gap-1 mt-0.5">
            <span>{formatCount(obj.views)} views</span>
            <span>•</span>
            <span>{obj.dateUploaded}</span>
          </div> */}
          
          <div className="flex-1" />

          {/* Meta */}
          <div className="text-sm text-gray-600 flex flex-row gap-2 mt-2">
            <span>{formatCount(obj.views)} views</span>
            <span>•</span>
            <span>{obj.dateUploaded}</span>
          </div>



        </div>
      </div>
    </div>
    </div>
  );
}
