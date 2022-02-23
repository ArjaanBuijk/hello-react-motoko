// eslint-disable-next-line no-use-before-define
import React from 'react'
import { canisterMotoko } from 'DeclarationsCanisterMotoko'
import '@dracula/dracula-ui/styles/dracula-ui.css'
import { Box, Card, Input, Button, Divider, Text } from '@dracula/dracula-ui'

export const GreetMotokoForm = () => {
  const [name, setName] = React.useState('')
  const [message, setMessage] = React.useState('')

  async function doGreet() {
    const greeting = await canisterMotoko.greet(name)
    setMessage(greeting)
  }

  return (
    <Box>
      <Input
        id="name"
        color="yellow"
        variant="outline"
        borderSize="sm"
        placeholder="Enter your name & Click Submit..."
        value={name}
        onChange={(event) => setName(event.target.value)}
      ></Input>
      <Button color="yellow" onClick={doGreet}>
        Submit
      </Button>
      <Box>
        <Divider color="purple"></Divider>
      </Box>
      <Card color="pinkPurple" p="sm">
        <Text color="black">{message}</Text>
      </Card>
    </Box>
  )
}
