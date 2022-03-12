// eslint-disable-next-line no-use-before-define
import React from 'react'
import { Head } from './common/Head'
import { Footer } from './common/Footer'
import { Navbar } from './common/Navbar'
import { Outlet } from 'react-router-dom'
import { Login } from './routes/Login'

export function App() {
  // When authenticating with internet identity
  const [authClient, setAuthClient] = React.useState()

  if (!authClient) {
    return <Login setAuthClient={setAuthClient} />
  }

  return (
    <div>
      <Head />
      <Navbar />
      <Outlet context={[authClient, setAuthClient]} />
      <Footer />
    </div>
  )
}
