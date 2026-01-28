import React, { useEffect, useState } from 'react'
import SideVideoCard from '../video/SideVideoCard'
import VideoPlayer from '../video/VideoPlayer'
import VideoInfoCard from '../video/VideoInfoCard'
import CommentSection from '../Comments/CommentSection'
import { useParams } from 'react-router-dom'
import api from "../../api/axios";

export default function VideoPlayerPage({sideNav}) {
  const params = useParams()
  const [videoId,setVideoId] = useState(params.videoId);
  const [videoDetails,setVideoDetails] = useState({videoUrl: "/public/hls/cd4cfaf9-8f08-4dc1-8a1f-93a272aaf6be-video-1767809354750/master.m3u8",
        thumbnail: "/public/thumbnails/a9227bce-e5d7-4fe3-958c-807df89c74d9-thumbnail-1767813651772.jpg",
        title: "valorant",
        description: "Valorant GamePlay",
        category: "education",
        language: "English",
        dateUploaded: "7 Jan 2026",
        location: "India",
        views: 100000000,
        likes: 150000,
        dislikes: 0,
        tags: [
            "valo",
            "valorant",
            "gamePlay"
        ],
        channelName: "Creator-Hub",
        channelDescription: "this is description ",
        channelUserName: "creatorhub",
        profilePhoto: "/public/avatar/a1eb8946-7ae3-4810-bdc8-9ef929dfd0bd-profilePhoto-1767807193284.jpg",
        totalSubscriberCount: 0,
        liked: false,
        disliked: false});

    const [firstRender, setFirstRender] = useState(true);
    const [loading,setLoading] = useState(true);
    const [videoSuggestions,setVideosSuggestions] = useState([]);
    const [sideLoading,setSideLoading] = useState(true);
    const [cursor,setCursor] = useState(null);
    const [hasMore,setHasMore] = useState(true);



  
  
  const getVideoDetails = async()=>{
    setLoading(true);
     if(videoId){
        await api.get(`/api/v1/videos/getVideoDetails/${videoId}`).then(res=>{
        if(res?.data?.data){
          res.data = res.data.data;
          res.data.videoUrl = String(res.data.videoUrl).slice(1),
          res.data.thumbnail = String(res.data.thumbnail).slice(1),
          res.data.profilePhoto = String(res.data.profilePhoto).slice(1),
          res.data.dateUploaded = new Date(res.data.dateUploaded).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric",});
          setVideoDetails(res.data);
        }else{
          throw err;
        }
      }).catch(err=>{
          console.log("Unable to play the requested Video",err);
      })
    }

     setLoading(false);
  }

  const getSideBarVideosSuggestions = async()=>{
    setSideLoading(true);
    await api.get(`/api/v1/videos/randomVideos?limit=5${cursor?`&cursor=${cursor}`:''}`).then(async(res)=>{

      if(res?.data?.data){

        let tempData = res.data.data.data;
        tempData = await tempData.filter(ele=>ele.video_id!=videoId).map((ele)=>{
          ele.thumbnail = String(ele.thumbnail).slice(1);
          ele.profilePhoto = String(ele.profilePhoto).slice(1);
          ele.dateUploaded = new Date(ele.dateUploaded).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric",});
          return ele;
        })

        setVideosSuggestions((prev)=>{
          const seen = new Set(prev.map(v => v.video_id));
          const filtered = tempData.filter(v => !seen.has(v.video_id));
          return [...prev, ...filtered];
          });
        setCursor(res.data.data.newCursor);
        setHasMore(res.data.data.hasMore);
        
      }else{
        throw err;
      }
        
    }).catch(err=>{
      console.log("Unable to fetch Videos");
    })


    setSideLoading(false);
  }


  const onScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    // console.log(scrollTop, clientHeight, scrollHeight);

    if (scrollTop + clientHeight >= scrollHeight - 5) {
      if(hasMore){
        getSideBarVideosSuggestions();
      }
    }
  };
  
  useEffect(()=>{
    if(firstRender){

     
      getSideBarVideosSuggestions();
      setFirstRender(false);


    }
    
    getVideoDetails();
    // console.log(document.documentElement.scrollHeight, window.scrollY, window.innerHeight);


  },[videoId])


  return (
    <div className={`fixed h-full w-[100%]  ${sideNav?"md:w-[65%] lg:w-[80%] xl:w-[84%]":""}  pt-20 md:pt-20 right-0 p-2   flex flex-col  lg:flex-row overflow-y-scroll scroll-custom overflow-x-hidden mb-10`} onScroll={onScroll}>

    {!loading && <>
    <div className=' w-[100%]   lg:w-[58%] xl:w-[68%]  m-2 p-3 mb-6 border-b-2 border-b-gray-500 md:border-none'>
            <VideoPlayer src={`${import.meta.env.VITE_API_BASE_URL}${videoDetails.videoUrl}`} thumbnail={`${import.meta.env.VITE_API_BASE_URL}${videoDetails.thumbnail}`}/>
            <VideoInfoCard videoDetails={videoDetails} />
            <CommentSection/>

              


            </div>

    {<div className=' w-[100%]  md:w-[95%] lg:w-[38%] xl:w-[28%]  my-2 flex  flex-col items-center pb-7 '>
      {videoSuggestions.map((ele)=>{
        
        return <SideVideoCard key={ele.video_id} obj={ele} sideNav={sideNav}/>
      })}

      {sideLoading && <i className="fa-solid fa-spinner fa-spin"></i> }
    </div>}

    </>}
    
    {loading && <>
      <div className='text-4xl w-full h-full flex justify-center items-center text-center'>
        <i className="fa-solid fa-spinner fa-spin"></i>
      </div>
    </>}
    </div>
  )
}
