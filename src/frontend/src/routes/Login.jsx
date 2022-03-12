// eslint-disable-next-line no-use-before-define
import React from 'react'
import { Helmet } from 'react-helmet'
import '@dracula/dracula-ui/styles/dracula-ui.css'
import { Box, Card, Heading, Text, Divider } from '@dracula/dracula-ui'
import { LogInWithInternetIdentity } from './LoginWithInternetIdentity'

export function Login({ setAuthClient }) {
  return (
    <div>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <main>
        <div className="container-fluid text-center">
          <Card
            variant="subtle"
            color="none"
            my="sm"
            p="sm"
            display="inline-block"
          >
            <Heading color="white" size="2xl">
              NFT Minter
            </Heading>
            <Heading color="yellow" size="xl">
              Core project of Motoko Bootcamp, March 2022
            </Heading>
            <Divider></Divider>
            <LogInWithInternetIdentity setAuthClient={setAuthClient} />
            <Divider></Divider>
            <img src="motoko-bootcamp.png" />
          </Card>
        </div>
      </main>
    </div>
  )
}
