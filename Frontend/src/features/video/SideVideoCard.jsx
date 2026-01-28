import React from 'react'

import channelProfilePhoto from '../../assets/images/channelProfilePhoto.jpg'
import { formatCount } from '../../../Constant'
import { Link, useNavigate } from 'react-router-dom'


export default function VideoCard({ obj,sideNav, showChannelName = true }) {
  const navigate = useNavigate();
  
  




  return (
    
    <div className={`w-full mt-1 mb-1 max-w-md ${sideNav?'h-92':'h-95'} flex flex-col rounded-2xl hover:bg-gray-200 p-2 transition-colors`}  onClick={()=>{navigate(`/video/${obj.video_id}`,{replace:true})}} onKeyDown={(e) => e.key === "Enter" && navigate(`/video/${obj.video_id}`,{replace:true}) }>
      
      {/* Thumbnail (16:9, no overflow) */}
      <div className="w-full  aspect-video max-h-[70%] rounded-xl overflow-hidden shadow-md shrink-0">
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}${obj.thumbnail}`}
          alt="thumbnail"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-row gap-3 mt-3 overflow-hidden">
        
        {/* Avatar */}
        <div className="h-10 w-10 mt-1 rounded-full overflow-hidden shrink-0">
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}${obj.profilePhoto}`}
            alt="profilePhoto"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Text */}
        <div className="flex flex-col overflow-hidden">
          
          <h3 className="font-semibold text-black text-sm line-clamp-2">
            {obj.title}
          </h3>

          {showChannelName && (
            <h5 className="text-xs font-medium text-indigo-600 hover:cursor-pointer hover:text-indigo-700 mt-0.5" onClick={(e)=>{e.stopPropagation();navigate(`/channel/${obj.channelUserName}`,{replace:true})}}>
              {obj.channelName}
            </h5>
          )}

          <div className="flex flex-row text-xs font-medium text-gray-600 mt-3">
            <span>{formatCount(obj.views)} views</span>
            <span className="mx-1">•</span>
            <span>{obj.dateUploaded}</span>
          </div>
        </div>
      </div>
    </div>

  );
}


