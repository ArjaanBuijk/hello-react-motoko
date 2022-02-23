// eslint-disable-next-line no-use-before-define
import React from 'react'
import { Helmet } from 'react-helmet'
import { GreetMotokoForm } from './GreetMotokoForm'
import '@dracula/dracula-ui/styles/dracula-ui.css'
import { Box, Card, Heading } from '@dracula/dracula-ui'

export function GreetMotoko() {
  return (
    <div>
      <Helmet>
        <title>GreetMotoko</title>
      </Helmet>
      <main>
        <div className="container-fluid">
          <Card color="blackSecondary" my="lg" p="lg" display="inline-block">
            <Box my="sm" py="sm">
              <Heading color="yellow" size="xl">
                Greet my Motoko backend canister.
              </Heading>
            </Box>
            <Box my="lg">
              <GreetMotokoForm />
            </Box>
          </Card>
        </div>
      </main>
    </div>
  )
}
