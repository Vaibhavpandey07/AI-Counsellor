import React, { useContext, useEffect, useState } from 'react'
import ChannelCard from '../Channel/ChannelCard';
import Context from '../../Context/Context';
import api from '../../api/axios';

export default function PopularChannels({sideNav}) {
  const [popularChannels , setPopularChannels] = useState([]);
  const [firsRender,setFirstRender] = useState(true);
  const [loading, setLoading] = useState(false);

  const obj = useContext(Context);
  
  const getSubscribedChannels = async()=>{
    setLoading(true);
    api.get('/api/v1/channels/popularChannels').then(async(res)=>{
      if(res?.data?.data){
        let tempData  = res.data.data;
        console.log(tempData);
        tempData = await tempData.map((ele)=>{
                ele.coverImage = String(ele.coverImage).slice(1);
                ele.profilePhoto = String(ele.profilePhoto).slice(1);
                return ele;
                })
        setPopularChannels(tempData);
      }
    }).catch(err=>{
      console.log(err);
      // throw new Error;
    })
    setLoading(false);
  }

  useEffect(()=>{
    if(firsRender){
      getSubscribedChannels();
      setFirstRender(false);
    }

  },[popularChannels])

  return (
    <>
      {loading && <div className='h-full w-full flex justify-center items-center text-center text-4xl' >  <i className="fa-solid fa-spinner fa-spin"></i> </div>}

       {!loading && <div className={`fixed h-full  w-[100%] ${sideNav?"md:w-[65%] lg:w-[80%] xl:w-[84%]":""}  top-16 right-0 p-3 md:p-5  flex flex-wrap flex-row overflow-y-scroll`}>
          {popularChannels.map(ele=>{
            
            return <ChannelCard key={ele.channelUserName} obj={ele} owner={ele.owner || false} channelSubscribed={ele.subscribe} /> 
          })}
        </div>}



    </>
  )
}

