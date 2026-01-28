import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'

export default function AppLayout({handleSide , sideNav , sideNavFalse}) {
  return (
    <>
        <Navbar handleSide={handleSide} sideNav={sideNav} sideNavFalse={sideNavFalse} />
        <Outlet/>
    </>
  )
}
