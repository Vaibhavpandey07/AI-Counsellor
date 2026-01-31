
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
import {createBrowserRouter, Navigate, RouterProvider, useNavigate} from 'react-router-dom';
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
import AIChatBot from "./features/aiChatBot/aiChatBot"
import OnboardingModeSelection from "./components/layout/OnboardingModeSelection"
import UniversityCard from "./features/university/UniversityCard"
import UniversityDiscoveryPage from "./features/university/UniversityDiscoryPage"
import UserDashboard from "./features/pages/UserDashBoard"
import { dummyUser } from "./features/university/dummyUniversities"
import ShortlistedUniversitiesPage from "./features/pages/ShortlistedUniversitiesPage"
import LockedUniversityPage from "./features/pages/LockUniversityPage"
import UniversitySearchPage from "./features/university/UniversitysearchPage"
import UniversityDiscoryProfileBased from "./features/university/UniversityDiscoryProfileBased"
import ProtectedRoutes2 from "./components/layout/ProtectedRoutes2"
import NoLockedUniversity from "./features/pages/NoLockedUniversity"


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
          {path:'/about' , element :<AboutUs/> },
          {path:'/contact' , element :<ContactUs/> },


          {element : <ProtectedRoutes sideNav={sideNav} />,
            children:[
              {path:'/user/changeDetails', element:<UpdateUserDetails />},
             
              {path :'user/onBoarding/ai', element :    <AIChatBot  sideNav={sideNav}/>},

              {path:'/user/ai/chat', element:<AIChatBot sideNav={sideNav}/>},
              {path:'/user/universities', element:<UniversityDiscoveryPage sideNav={sideNav} />},
              {path:'/user/universitiesBasedOnProfile', element:<UniversityDiscoryProfileBased sideNav={sideNav} />},



              {path:'/user/dashboard', element:< UserDashboard user={dummyUser} sideNav={sideNav} />},
              {path:'/search', element:<UniversitySearchPage user={dummyUser} sideNav={sideNav} />},      

              {path:'/user/channel/createChannel', element:<CreateChannel />},
              {path:'/user/univeristy/shorlistedUniversity', element:<ShortlistedUniversitiesPage sideNav={sideNav} />},
              {path:'/user/univeristy/lockedUniversity', element:<LockedUniversityPage sideNav={sideNav} />,
              errorElement : <NoLockedUniversity/>
            },


              {path:'/user/video/uploadVideo', element:<UploadVideo />},


            ]
          
          }
        ]
      
      },
      { path:'/login',
        element: (obj.isLogIn?<Navigate to="/" replace/>:<LoginPage/>)

      },
      { 
        element : (<ProtectedRoutes2 sideNav={sideNav} />),
        children : [
           {path:'/user/Onboarding', element:<OnboardingModeSelection />},
            {path :'user/onBoarding/form', element :    <OnBoardingForm  sideNav={sideNav}/>},
        ]
      
      

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
