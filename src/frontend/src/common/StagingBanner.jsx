// eslint-disable-next-line no-use-before-define
import React from 'react'
import '@dracula/dracula-ui/styles/dracula-ui.css'
import { Card, Text } from '@dracula/dracula-ui'

export function StagingBanner() {
  return (
    <main>
      <div className="container-fluid">
        <Card variant="subtle" color="red" m="md" p="md" display="inline-block">
          <Text color="red" size="md">
            This dApp is for my own educational purposes only!
          </Text>
        </Card>
      </div>
    </main>
  )
}
