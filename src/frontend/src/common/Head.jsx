// eslint-disable-next-line no-use-before-define
import React from 'react'
import { Helmet } from 'react-helmet'
import '@dracula/dracula-ui/styles/dracula-ui.css'

export function Head(props) {
  return (
    <Helmet>
      {/* Bootstrap 5: Required meta tags for proper responsive behaviors */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <meta
        name="description"
        content="A React + Motoko example for the internet computer."
      />
      <meta
        name="keywords"
        content="Internet Computer, Motoko, JavaScript, React"
      />
      <meta name="author" content="Arjaan Buijk" />

      <title>hello-react-motoko</title>
      <link rel="icon" href="favicon.ico" />
    </Helmet>
  )
}
