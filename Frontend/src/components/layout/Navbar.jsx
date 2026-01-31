import React, { useContext, useRef, useState } from 'react'
import logo from '../../assets/images/logo.png'
import SideNavbar from './SideNavbar.jsx';
import ProfileMenu from '../common/ProfileMenu.jsx';
import SearchBar from './SearchBar.jsx';
import { Link } from 'react-router-dom';
import Context from '../../Context/Context.jsx';

export default function Navbar({handleSide, sideNav,sideNavFalse, showSideNav=true ,showUser=true , showSearchBar=true }) {
  const [viewSideNav , setViewSideNav] = useState(true);
  const sideButtonRef = useRef(null)

  const obj = useContext(Context)


  return (
    <>
    <nav className="fixed top-0 flex w-full h-16 bg-[#ffffff] justify-between items-center shadow-md z-[998]">
        <div className='flex flex-row items-center justify-center mx-2 p-2 md:p-4 text-white'>
          
          {showSideNav && <button ref={sideButtonRef} className='h-[100%]  p-2 px-4 mr-2 transform transition-transform duration-200 text-purple-600 hover:bg-gray-300 rounded-4xl'><i className="fa-solid fa-bars " onClick={handleSide}></i></button>}
          <div className='font-bold text-purple-600 h-[100%]'><Link to="/">AI Counsellor</Link></div>
        </div>


        
        {/* {showSearchBar && <div className='mx-2 flex flex-row justify-center items-center  h-9 w-[52%] md:w-[63%] lg:w-[42%] bg-white rounded-xl shadow-xs border-2 border-purple-600 '>
            <input type='text' className='mx-2 w-auto md:w-[78%] lg:w-[88%] outline-none focus:outline-none focus:ring-0'></input>
             
            <button className='h-[100%] w-auto md:w-[11%] lg:w-[6%] transform transition-transform duration-200  hover:bg-gray-200'><i className="fas fa-search  "></i></button>
            <button className= 'h-[100%] w-auto md:w-[11%] lg:w-[6%]  transform transition-transform duration-200  hover:bg-gray-200 rounded-r-xl'><i className="fa-solid fa-microphone "></i></button>
        </div>} */}
        {/* <SearchBar showSearchBar={showSearchBar}/> */}
        {/* {showUser && <div className='mr-3 lg:mr-10 p-2  bg-white outline-1 rounded-2xl text-purple-600 font-bold flex justify-centert text-center items-center h-9 hover:bg-gray-200'><button className=''><i class="fa-regular fa-user"></i></button></div>} */}
        {showUser && <ProfileMenu />}

    </nav>
      {showSideNav && sideNav && <SideNavbar viewSideNav={viewSideNav}  sideNavFalse={sideNavFalse} sideButtonRef={sideButtonRef}/>}
    </>
  )
}
