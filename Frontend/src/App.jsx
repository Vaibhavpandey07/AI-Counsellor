
import { useContext, useState } from "react"
import Home from "./features/pages/Home"
import LoginPage from "./features/pages/LoginPage"
import UploadVideo from "./features/video/UploadVideo"
import UpdateUserDetails from "./features/pages/UpdateUserDetails"
import CreateChannel from "./features/Channel/CreateChannel"
import ChannelPage from "./features/pages/ChannelPage"
import Subscriptions from "./features/pages/Subscriptions"
import ContactUs from "./features/pages/ContactUs"
import AboutUs from "./features/pages/AboutUs"
import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom';
import AppLayout from "./components/layout/AppLayout"
import ErrorPage from "./components/common/ErrorPage"
import ProtectedRoutes from "./components/layout/ProtectedRoutes"
import Context from "./Context/Context"
import VideoRouteWrapper from "./features/wrapper/VideoRouteWrapper"
import HomeRouteWrapper from "./features/wrapper/HomeRouteWrapper"
import SearchPageWrapper from "./features/wrapper/SearchPageWrapper"
import PopularChannels from "./features/pages/PopularChannels"
import LikedVideos from "./features/pages/LikedVideos"
import WatchHistory from "./features/pages/WatchHistory"
import UpdateChannel from "./features/Channel/UpdateChannel"
import LandingPage from "./Components/LandingPage" 
import OnBoardingForm from "./features/OnBoarding/OnBoardingForm"


function App() {
  const [sideNav, setSideNav] = useState(true);
  
 
    const obj = useContext(Context);
    const handleSide = ()=>{
        setSideNav(prev =>!prev);
    }
    const sideNavFalse = ()=>{
      setSideNav(false);
    }

    const router = createBrowserRouter(
      [{path:'/',element : <LandingPage/>},
        
        {path :"/" , 
        element : <AppLayout handleSide={handleSide} sideNav={sideNav} sideNavFalse={sideNavFalse}/>,
        errorElement :<ErrorPage  handleSide={handleSide} sideNav={sideNav} sideNavFalse={sideNavFalse}/>,
        children :[
          {path:'/Home',element : <HomeRouteWrapper sideNav={sideNav} />},
          {path:'/search',element : <SearchPageWrapper sideNav={sideNav} />},
          {path:'/about' , element :<AboutUs/> },
          {path:'/contact' , element :<ContactUs/> },
          {path:"/channel/:channelUsername" , element:<ChannelPage sideNav={sideNav}/> } ,
          {path:"/video/:videoId" , element:<VideoRouteWrapper sideNav={sideNav}/> },
          {path:"/channel/popularChannels" , element:<PopularChannels sideNav={sideNav}/> },


          {element : <ProtectedRoutes sideNav={sideNav} />,
            children:[
              {path:'/user/changeDetails', element:<UpdateUserDetails />},
              {path:'/user/Onboarding', element:<OnBoardingForm  sideNav={sideNav}/>

              },
              {path:'/user/subscriptions', element:<Subscriptions sideNav={sideNav}/>},
              {path:'/user/likedVideos', element:< LikedVideos sideNav={sideNav} />},
              {path:'/user/watchHistory', element:< WatchHistory sideNav={sideNav} />},


              {path:'/user/channel/createChannel', element:<CreateChannel />},
              {path:'/user/channel/updateChannel', element:<UpdateChannel />},

              {path:'/user/video/uploadVideo', element:<UploadVideo />},


            ]
          
          }
        ]
      
      },
      { path:'/login',
        element: (obj.isLogIn?<Navigate to="/" replace/>:<LoginPage/>)

      }
    ])


   
  return (
    <>

      {/* <LoginPage/> */}

      {/* <ChannelPage sideNav={sideNav}/> */}
      {/* <ContactUs/> */}
      {/* <AboutUs/> */}
      {/* <VideoPlayerPage sideNav={sideNav} /> */}

      <RouterProvider router={router}/>
    </>
  )
}

export default App
