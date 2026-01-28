import { useEffect, useRef, useState } from "react";
import VideoCard from "./VideoCard";
import api from "../../api/axios";


export default function VideoRow({ title,type , channelUserName}) {
  const scrollRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const [page,setPage] = useState(1);
  const [hasMore,setHasMore]= useState(false);
  const [firstRender,setFirstRender] = useState(true);

  const [videoData,setVideoData] = useState([]);

  const scrollByAmount = 420;

  const updateScrollState = () => {
    // const {scrollLeft,clientWidth,scrollWidth} = e.target;
    const el = scrollRef.current;
    if (!el) return;

    setAtStart(el.scrollLeft <= 0);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 5);

    if(el.scrollLeft + el.clientWidth >= el.scrollWidth - 5){
      
      if(hasMore){
        getChannelVideos();
      }
    }


  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -scrollByAmount,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: scrollByAmount,
      behavior: "smooth",
    });
  };


    const getChannelVideos = async()=>{
      const url = `/api/v1/videos/getAllVideoDetails/${channelUserName}?query=${type}&limit=5&page=${page}`
      api.get(url).then((res)=>{
        if(res?.data?.data){
          let dataList = res.data.data.data.map(ele=>{
            ele.profilePhoto = `${String(ele.profilePhoto).slice(1)}`;
            ele.thumbnail = `${String(ele.thumbnail).slice(1)}`;
            ele.dateUploaded = new Date(ele.dateUploaded).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric",});
            return ele;
          })
          
          
          
          setVideoData((prev)=>{
          const seen = new Set(prev.map(v => v.video_id));
          const filtered = dataList.filter(v => !seen.has(v.video_id));
          return [...prev, ...filtered];
          });
          console.log(res.data.data);
          setHasMore(res.data.data.hasMore);
          setPage(prev=>prev+1);
        }
      })
  }


  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") scrollRight();
      if (e.key === "ArrowLeft") scrollLeft();
    };
    if(firstRender){
      getChannelVideos();
      setFirstRender(false);
    }


    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="w-[90%] mt-8 relative">
      <h2 className="text-lg font-bold mb-3 text-indigo-600">{title}</h2>

      {/* LEFT FADE */}
      {!atStart && (
        <div className="pointer-events-none absolute left-0 top-0 h-full w-7 
                        bg-gradient-to-r from-gray-100/50 to-transparent z-10" />
      )}

      {/* RIGHT FADE */}
      {!atEnd && (
        <div className="pointer-events-none absolute right-0 top-0 h-full w-7 
                        bg-gradient-to-l from-gray-100/50 to-transparent z-10" />
      )}

      {/* LEFT BUTTON */}
      {!atStart && (
        <button
          onMouseEnter={scrollLeft}
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20
                     h-10 w-10 rounded-full bg-white shadow-md
                     flex items-center justify-center hover:bg-gray-100"
        >
          ‹
        </button>
      )}

      {/* RIGHT BUTTON */}
      {!atEnd && (
        <button
          onMouseEnter={scrollRight}
          onClick={scrollRight}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20
                     h-10 w-10 rounded-full bg-white shadow-md
                     flex items-center justify-center hover:bg-gray-100"
        >
          ›
        </button>
      )}

      {/* SCROLL CONTAINER */}
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide px-12"
      >
        {videoData.map((ele) => (
          <div key={ele.video_id} className="flex-shrink-0">
            <VideoCard key={ele.video_id} showChannelName={false} obj={ele}/>
          </div>
        ))}
      </div>
    </div>
  );
}
