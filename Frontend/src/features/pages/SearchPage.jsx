import React, { use, useEffect, useState } from 'react'
import HorizontalVideoCard from '../video/HorizontalVideoCard';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/axios';

export default function SearchPage({sideNav}) {

    const [searchParam] = useSearchParams();
    const [firstRender,setFirstRender] = useState(true);
    const [loading,setLoading] = useState(true);
    const [searchResults, setSearchResult] = useState([]);
    const [page,setPage] = useState(1);
    const [hasMore,setHasMore] = useState(false);

    const query = searchParam.get('searchQuery');
    if(!query){
        // Error.message = "Please Enter the Search Query";
        throw new Error;
    }


    const getSearchResult = async()=>{
        setLoading(true);
        const url = `/api/v1/videos/searchVideos?searchQuery=${query}&limit=5&page=${page}`
        api.get(url).then(async(res)=>{
            if(res?.data?.data){
                let tempData = res.data.data.data;
                tempData = await tempData.map((ele)=>{
                ele.thumbnail = String(ele.thumbnail).slice(1);
                ele.profilePhoto = String(ele.profilePhoto).slice(1);
                ele.dateUploaded = new Date(ele.dateUploaded).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric",});
                return ele;
                })

                setSearchResult((prev)=>{
                const seen = new Set(prev.map(v => v.video_id));
                const filtered = tempData.filter(v => !seen.has(v.video_id));
                return [...prev, ...filtered];
                });
                // console.log(res.data.data.hasMore);
                setPage(prev=>(prev+1));
                setHasMore(res.data.data.hasMore);
                
            }
            else{
                throw err;
            }
            
        }).catch(err=>{
            console.log(err);
            throw new Error;
        })

        setLoading(false);


    }



  const onScrollHome = (e)=>{
    
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    // console.log(scrollTop,scrollHeight,clientHeight);

    if(scrollTop+clientHeight >= scrollHeight-5){
    //   console.log("You are at the bottom of the page");
      if(hasMore){
        getSearchResult();
      }
    }

  }

  useEffect(()=>{

    if(firstRender){
        getSearchResult();
        setFirstRender(false);
        
    }
    console.log(searchResults);

  },[searchResults])




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
        flex flex-col
      `}
      onScroll={onScrollHome}
    >

        {loading && <div className='h-full w-full flex justify-center items-center text-center text-4xl' >  <i className="fa-solid fa-spinner fa-spin"></i> </div>}
        {!loading &&   searchResults.length>0 &&
        <>      
        <div><h2 className='font-bold text-2xl text-gray-600'>Search Results</h2>
          <div className='border-b-2 border-b-gray-600 w-full rounded-3xl mt-2 mb-2'></div>
        </div>
        {searchResults.map((ele)=>{
          return <HorizontalVideoCard key={ele.video_id} obj={ele} />})
           } 
        </>    
        }

        {!loading && searchResults.length==0 && <div className='h-full w-full flex justify-center items-center text-center text-4xl' > No Results Found </div>}

    </div>
  )
}
