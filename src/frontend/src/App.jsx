// eslint-disable-next-line no-use-before-define
import React from 'react'
import { Head } from './common/Head'
import { Footer } from './common/Footer'
import { Navbar } from './common/Navbar'
import { StagingBanner } from './common/StagingBanner'
import { Outlet } from 'react-router-dom'
import { Login } from './routes/Login'

export function App() {
  // When authenticating with internet identity
  const [authClient, setAuthClient] = React.useState()
  // When logging in with email & password
  const [token, setToken] = React.useState()

  if (!(authClient || token)) {
    return <Login setAuthClient={setAuthClient} setToken={setToken} />
  }

  return (
    <div>
      <Head />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}
