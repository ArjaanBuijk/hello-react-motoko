// eslint-disable-next-line no-use-before-define
import React from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  canisterMinter,
  canisterId,
  createActor,
} from 'DeclarationsCanisterMinter'
import '@dracula/dracula-ui/styles/dracula-ui.css'
import { Badge, Button } from '@dracula/dracula-ui'

export function NftCardMintOrStatus({ name, picture, collection, artist, id }) {
  const [authClient, setAuthClient] = useOutletContext()
  const [tokenPk, setTokenPk] = React.useState(null)
  const [owner, setOwner] = React.useState(null)
  const [amIOwner, setAmIOwner] = React.useState(null)

  // Get the owner status
  // https://stackoverflow.com/a/57856876/5480536
  //   React.useEffect(() => {
  //     getOwner()
  //   })

  // Call ownerOf & set state variable owner
  // If owned, get tokenPk and set it too
  const getOwner = async () => {
    await ownerOf()
  }

  getOwner()

  async function ownerOf() {
    console.log('Checking owner of image: ' + id)
    const identity = await authClient.getIdentity()
    const mintActor = createActor(canisterId, {
      agentOptions: {
        identity,
      },
    })
    try {
      const owner = await mintActor.ownerOf(id)
      console.log(owner)

      if (owner.length !== 0) {
        setOwner(owner[0].toString())
        if (identity.getPrincipal().toString() === owner[0].toString()) {
          setAmIOwner(true)
        } else {
          setAmIOwner(false)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
  // TODO:
  // get status of this nft
  // if not owned, show 'Buy' button
  // if owned by other, show 'Sold' label
  // if owned by user, show 'Mine' label
  //   const [tokenPk, setTokenPk] = React.useState('')

  async function doMint() {
    console.log('Minting image: ' + id)
    // This is an un-authenticated call
    // const result = await canisterMinter.mint(id.toString())
    // console.log(result)

    const identity = await authClient.getIdentity()
    const mintActor = createActor(canisterId, {
      agentOptions: {
        identity,
      },
    })
    try {
      const response = await mintActor.mint(id.toString())
      console.log(response)
      setTokenPk(response.ok)
      setAmIOwner(true)
      setOwner(identity.getPrincipal().toString())
    } catch (error) {
      console.error(error)
    }
  }

  if (owner === null) {
    return (
      <Button color="green" onClick={doMint}>
        Mint!
      </Button>
    )
  }
  if (amIOwner) {
    return <Badge color="animated">You own it!</Badge>
  }
  return <Badge color="red">Someone else owns it...</Badge>
}
