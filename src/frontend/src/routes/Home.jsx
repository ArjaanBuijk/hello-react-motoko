// eslint-disable-next-line no-use-before-define
import React from 'react'
import { Helmet } from 'react-helmet'
import '@dracula/dracula-ui/styles/dracula-ui.css'
import { Box, Button, Card, Heading, Divider } from '@dracula/dracula-ui'
import nfts from '../nfts.json'
import { NftCard } from './NftCard'

export function Home() {
  console.log(nfts)
  const nftCards = nfts.map((nft) => (
    <div key={nft.id} className="col">
      <NftCard
        name={nft.name}
        picture={nft.picture}
        collection={nft.collection}
        artist={nft.artist}
        id={nft.id}
      ></NftCard>
    </div>
  ))

  return (
    <div>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <main>
        <div className="container-fluid text-center">
          <Card color="animated" my="lg" p="sm">
            <div className="row">{nftCards}</div>
          </Card>
        </div>
      </main>
    </div>
  )
}
