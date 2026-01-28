import React, { useContext, useEffect, useState } from "react";
import VideoCard from "../video/VideoCard";
import Context from "../../Context/Context";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import HorizontalVideoCard from "../video/HorizontalVideoCard";

export default function Home({ sideNav }) {

  const [searchParam] = useSearchParams();
  const [loading,setLoading] = useState(true);
  const [cursor,setCursor] = useState(null);
  const [hasMore,setHasMore] = useState(false);
  const [videoSuggestions,setVideoSuggestions] = useState([]);

  const [cursorDate,setCursorDate] = useState(null);

  const [firstRender,setFirstRender] =useState(true);


  const getVideosSuggestions = async()=>{
    setLoading(true);
    let pageType = 'randomVideos'
    if(searchParam.get('type') == 'trending'){
      pageType = 'trendingVideos'
    }
    else if(searchParam.get('type') == 'lastest'){
      pageType='latestVideos'
    }
    
    const url = `/api/v1/videos/${pageType}?limit=14${cursor?`&cursor=${cursor}`:''}${cursorDate?`&cursorDate=${cursorDate}`:''}`

    

    await api.get(url).then(async(res)=>{

      if(res?.data?.data){

        let tempData = res.data.data.data;
        tempData = await tempData.map((ele)=>{
          ele.thumbnail = String(ele.thumbnail).slice(1);
          ele.profilePhoto = String(ele.profilePhoto).slice(1);
          ele.dateUploaded = new Date(ele.dateUploaded).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric",});
          return ele;
        })

        setVideoSuggestions((prev)=>{
          const seen = new Set(prev.map(v => v.video_id));
          const filtered = tempData.filter(v => !seen.has(v.video_id));
          return [...prev, ...filtered];
          });
        setCursor(res.data.data.newCursor);
        setHasMore(res.data.data.hasMore);
        // if(res.data.data.cursorDate){
        //   setCursorDate(res.data.data.cursorDate);
        // }
        
      }else{
        throw err;
      }
        
    }).catch(err=>{
      console.log("Unable to fetch Videos");
    })


    setLoading(false);
  }





  const onScrollHome = (e)=>{
    
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    // console.log(scrollTop,scrollHeight,clientHeight);

    if(scrollTop+clientHeight >= scrollHeight-5){
      // console.log("You are at the bottom of the page");
      if(hasMore){
        getVideosSuggestions();
      }
    }

  }

  useEffect(()=>{
    if(firstRender){
      getVideosSuggestions();
      setFirstRender(false);
    }
    // console.log(videoSuggestions);

  },[videoSuggestions])


  return (
    <div
      className={`
        fixed top-16 right-0 
        h-[calc(100vh-4rem)]
        w-full
        ${sideNav ? "md:w-[65%] lg:w-[80%] xl:w-[84%]" : ""}
        px-2 md:px-4 py-4
        overflow-y-auto
        bg-gray-100
      `}
      onScroll={onScrollHome}
    >
      <div
        className="
          flex flex-wrap
          justify-center md:justify-start
          gap-2
        "
      >
        {videoSuggestions.map((ele) => {
          
          return <VideoCard key={ele.video_id} obj={ele}/>
          // return <HorizontalVideoCard key={ele.video_id} obj={ele} />
        }
        )}
      </div>
    </div>
  );
}
