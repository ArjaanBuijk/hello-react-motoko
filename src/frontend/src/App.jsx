// eslint-disable-next-line no-use-before-define
import React from 'react'
import { Head } from './common/Head'
import { Footer } from './common/Footer'
import { Navbar } from './common/Navbar'
import { StagingBanner } from './common/StagingBanner'
import { Outlet } from 'react-router-dom'

export function App() {
  return (
    <div>
      <Head />
      <Navbar />
      <Outlet />
      <StagingBanner />
      <Footer />
    </div>
  )
}
