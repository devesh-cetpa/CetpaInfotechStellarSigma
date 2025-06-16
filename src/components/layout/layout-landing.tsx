import React from 'react'
import { Outlet } from 'react-router'

import Navbar from '../../pages/landingPage/Navbar'
import Footer from '../../pages/landingPage/Footer'




const LayoutLanding = () => {

  return (
    <div className="min-h-screen">
      <Navbar/>

      <div className="mt-10">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default LayoutLanding
