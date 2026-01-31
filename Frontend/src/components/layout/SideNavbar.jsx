import React, { useContext, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';



export default function SideNavbar({viewSideNav,sideNavFalse,sideButtonRef}) {

  const sideRef = useRef(null);


  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1024px)");

    const handler = (e) => {
      if (
        sideRef.current &&
        !sideRef.current.contains(e.target) &&
        !sideButtonRef.current.contains(e.target)
      ) {
        sideNavFalse();
      }
    };

    const handleChange = () => {
      if (mediaQuery.matches) {
        document.addEventListener("mousedown", handler);
      } else {
        document.removeEventListener("mousedown", handler);
      }
    };

    handleChange();

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      document.removeEventListener("mousedown", handler);
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);


  return (
    <div className={`fixed top-16 z-[998]
      h-[100%] w-[50%] md:w-[35%] lg:w-[20%] xl:w-[16%] bg-white  text-black text-lg flex flex-col  shadow-2xl overflow-y-auto scrollbar-custom pb-14
      transition-transform duration-300
    ${viewSideNav ? "translate-x-0" : "-translate-x-full"}
  `} ref={sideRef}>

        <div className='flex flex-col p-1'>
          <li className='block w-[100%] font-semibold  p-2 my-0.5 hover:bg-gray-200'>
            <div className='inline-block text-center w-[25%]'><i className="fa-solid fa-user"></i></div>
            <Link className='w-[75%] inline-block ' to='/user/dashboard'>Your Account</Link> 
          </li>
          

          <li className='block w-[100%] font-semibold  p-2 my-0.5 hover:bg-gray-200'>
            <div className='inline-block text-center w-[25%]'><i className="fa-solid fa-cube"></i></div>
            <Link className='w-[75%] inline-block ' to='/user/ai/chat'>AI Counsellor Help</Link> 
          </li>


          <div className='mt-3 w-[100%] border-b-2 border-b-gray-300 rounded-3xl'></div>
        </div>

          <div className='flex flex-col p-1'>
            <li className='block w-[100%] font-semibold  p-2 my-0.5 text-purple-600'>
              <h3 className='inline-block text-center  font-bold'>Explore Universities</h3>
            </li>
          <li className='block w-[100%] font-semibold  p-2 my-0.5 hover:bg-gray-200'>
            <div className='inline-block text-center w-[25%]'>
              <i className="fa-solid fa-earth-asia"></i>
              </div>
            <Link className='w-[75%] inline-block ' to='/user/universities'>All Universities</Link> 
          </li>

          <li className='block w-[100%] font-semibold  p-2 my-0.5 hover:bg-gray-200'>
            <div className='inline-block text-center w-[25%]'><i className="fa-solid fa-arrow-trend-up"></i></div>
            <Link className='w-[75%] inline-block ' to='/user/universitiesBasedOnProfile'>Matching with Profile</Link> 
          </li>

          <div className='mt-3 w-[100%] border-b-2 border-b-gray-300 rounded-3xl'></div>
        </div>


          <div className='flex flex-col p-1'>
            <li className='block w-[100%] font-semibold  p-2 my-0.5 text-purple-600 '>
              <h3 className='inline-block text-center  font-bold '>Your Universities</h3>
            </li>
          <li className='block w-[100%] font-semibold  p-2 my-0.5 hover:bg-gray-200'>
            <div className='inline-block text-center w-[25%]'><i className="fa-solid fa-newspaper"></i></div>
            <Link className='w-[75%] inline-block ' to='/user/univeristy/shorlistedUniversity'>ShortListed Universities</Link> 
          </li>

          <li className='block w-[100%] font-semibold  p-2 my-0.5 hover:bg-gray-200'>
            <div className='inline-block text-center w-[25%]'><i className="fa-solid fa-school-lock"></i></div>
            <Link className='w-[75%] inline-block ' to='/user/univeristy/lockedUniversity'>Locked University</Link> 
          </li>

          <div className='mt-3 w-[100%] border-b-2 border-b-gray-300 rounded-3xl'></div>
        </div>


          <div className='flex flex-col p-1'>
            <li className='block w-[100%] font-semibold  p-2 my-0.5'>
              <h3 className='inline-block text-center font-bold text-purple-600'>More</h3>
            </li>
          <li className='block w-[100%] font-semibold  p-2 my-0.5 hover:bg-gray-200'>
            <div className='inline-block text-center w-[25%]'><i className="fa-regular fa-address-card"></i></div>
            <Link className='w-[75%] inline-block ' to='/contact'>Contact</Link> 
          </li>


          <li className='block w-[100%] font-semibold  p-2 my-0.5 hover:bg-gray-200'>
            <div className='inline-block text-center w-[25%]'><i className="fa-solid fa-book"></i></div>
            <Link className='w-[75%] inline-block ' to='/about'>About</Link> 
          </li>


          
          <div className='mt-3 w-[100%] border-b-2 border-b-gray-300 rounded-3xl'></div>
        </div>
      


    </div>
  )
}
      // <div>
      //   <div>Trending Videos</div>
      //   <div>Latest Videos</div>
      //   <div>Popular Channels</div>

      // </div>
      // <div>
      //   <div>Contact us</div>
      //   <div>feedback</div>
      //   <div>About</div>
      // </div>
// categories news sports tech etc