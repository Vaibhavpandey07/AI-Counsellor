
import { formatCount } from "../../../Constant";
import { Link, useNavigate } from "react-router-dom";

export default function HorizontalVideoCard({ obj, showChannelName = true }) {
  const navigate = useNavigate()

  return (
    <div className="w-full" onClick={()=>{navigate(`/video/${obj.video_id}`,{replace:true})}} onKeyDown={(e) => e.key === "Enter" && navigate(`/video/${obj.video_id}`,{replace:true}) }>
      <div className="flex flex-row gap-4 p-4 rounded-2xl hover:bg-gray-200 transition">

        {/* Thumbnail */}
        <div className="w-64 aspect-video rounded-xl overflow-hidden flex-shrink-0 bg-black shadow-md">
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}${obj.thumbnail}`}
            alt="thumbnail"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col flex-1 overflow-hidden">

          {/* Title */}
          <h4 className="font-semibold text-black text-lg line-clamp-2">
            {obj.title}
          </h4>

          {/* Channel */}
          {showChannelName && (
            <h5 className="text-xs font-medium text-indigo-600 hover:cursor-pointer hover:text-indigo-700 mt-0.5" onClick={(e)=>{e.stopPropagation();navigate(`/channel/${obj.channelUserName}`,{replace:true})}}>
              {obj.channelName}
            </h5>
          )}

          {/* Description (optional) */}
          <p className="text-sm text-gray-700 line-clamp-2 mt-1">
            {obj.description}
          </p>

          {/* Push meta to bottom */}
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
  );
}
