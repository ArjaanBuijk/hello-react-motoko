// eslint-disable-next-line no-use-before-define
import React from 'react'
import { NftCardMintOrStatus } from './NftCardMintOrStatus'
import '@dracula/dracula-ui/styles/dracula-ui.css'
import { Card, Heading } from '@dracula/dracula-ui'

export function NftCard({ name, picture, collection, artist, id }) {
  return (
    <Card width="md" rounded="3xl" m="sm" p="sm">
      <Heading color="black">{name}</Heading>
      <div className="panel-body">
        <img src={picture} width="300" />
        <br />
        <br />
        <strong>Collection</strong>: <span>{collection}</span>
        <br />
        <strong>Artist</strong>: <span>{artist}</span>
        <br />
        <br />
        <NftCardMintOrStatus
          name={name}
          picture={picture}
          collection={collection}
          artist={artist}
          id={id}
        ></NftCardMintOrStatus>
      </div>
    </Card>
  )
}
