import React from 'react'
import { useLocation } from 'react-router-dom'
import SearchPage from '../pages/SearchPage';

export default function SearchPageWrapper({sideNav}) {
    const location = useLocation();
  return (
    <SearchPage key={location.pathname + location.search} sideNav={sideNav}/>
  )
}
