// eslint-disable-next-line no-use-before-define
import React from 'react'
import PropTypes from 'prop-types'

import '@dracula/dracula-ui/styles/dracula-ui.css'
import { Anchor, Box, Card, Button, Divider, Text } from '@dracula/dracula-ui'

import { DelegationIdentity } from '@dfinity/identity'
import { AuthClient } from '@dfinity/auth-client'

// TODO: externalize II_URL in a .json
//       Or based on isDevelopment flag in webpack.config.js, as done in IC-AVATAR
const II_URL = 'https://identity.ic0.app/'
let authClient

export function LogInWithInternetIdentity({ setAuthClient }) {
  async function doLogIn() {
    authClient = await AuthClient.create()

    const handleSucess = () => {
      // Save the authClient for use in rest of application
      setAuthClient(authClient)

      // Write debug logs to console
      const identity = authClient.getIdentity()
      const principal = identity.getPrincipal()

      let delegation = 'Current identity is not a DelegationIdentity'
      let expiration = 'N/A'
      if (identity instanceof DelegationIdentity) {
        delegation = JSON.stringify(
          identity.getDelegation().toJSON(),
          undefined,
          2
        )

        // cannot use Math.min, as we deal with bigint here
        const nextExpiration = identity
          .getDelegation()
          .delegations.map((d) => d.delegation.expiration)
          .reduce((current, next) => (next < current ? next : current))
        expiration = nextExpiration - BigInt(Date.now()) * BigInt(1000_000)
      }
      console.log('authClient : ' + authClient)
      console.log('principal  : ' + principal)
      console.log('delegation : ' + delegation)
      console.log('expiration : ' + expiration)
    }

    authClient.login({
      identityProvider: II_URL,
      onSuccess: handleSucess,
    })
  }

  return (
    <Box>
      <Card variant="subtle" color="purple" p="md" m="md">
        <Box>
          <Text color="white">Login with your Internet Identity: </Text>
        </Box>

        <Divider></Divider>
        <Button
          variant="ghost"
          color="black"
          size="lg"
          p="2xl"
          onClick={doLogIn}
        >
          <img src="loop.svg" />
        </Button>
      </Card>

      <Card variant="subtle" color="purple" p="md" m="md">
        <Box>
          <Text color="white">
            <i>Don't have an Internet Identity?</i>
          </Text>
          <br />
          <Anchor href="https://smartcontracts.org/docs/ic-identity-guide/auth-how-to.html#_create_an_identity_anchor" color="cyan">
            <i>Create an Identity Anchor.</i>
          </Anchor>
        </Box>
      </Card>
    </Box>
  )
}

LogInWithInternetIdentity.propTypes = {
  setAuthClient: PropTypes.func.isRequired,
}
