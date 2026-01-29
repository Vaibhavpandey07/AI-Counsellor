import React from 'react'
import Navbar from '../../components/layout/Navbar'
import LoginCard from '../../components/layout/LoginCard'
import SimpleNavbar from '../../components/layout/SimpleNavbar'

export default function LoginPage({sideNav = false}) {
  return (
    <>
        <Navbar showSideNav={false} showUser={false} showSearchBar={false} />
        {/* <SimpleNavbar showButton={false} /> */}
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
    >
        <LoginCard/>
        </div>

    </>
  )
}
