import React from 'react'
import Home from '../pages/Home'
import { useLocation } from 'react-router-dom'

export default function HomeRouteWrapper({sideNav}) {
    const location = useLocation();
  return (
    <Home key={location.pathname + location.search} sideNav={sideNav}/>
  )
}
