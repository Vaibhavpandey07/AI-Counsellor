import React from 'react'
import Navbar from '../../components/layout/Navbar'
import LoginCard from '../../components/layout/LoginCard'
import SimpleNavbar from '../../components/layout/SimpleNavbar'

export default function LoginPage() {
  return (
    <>
        <Navbar showSideNav={false} showUser={false} showSearchBar={false} />
        {/* <SimpleNavbar showButton={false} /> */}
        <LoginCard/>

    </>
  )
}
