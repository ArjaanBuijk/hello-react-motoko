// eslint-disable-next-line no-use-before-define
import React from 'react'
import { Helmet } from 'react-helmet'
import '@dracula/dracula-ui/styles/dracula-ui.css'
import { Card, Heading } from '@dracula/dracula-ui'

export function Home() {
  return (
    <div>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <main>
        <div className="container-fluid">
          <Card color="animated" my="lg" p="lg" display="inline-block">
            <Heading color="black" size="xl">
              Welcome to my React + Motoko playground...
            </Heading>
          </Card>
        </div>
      </main>
    </div>
  )
}
