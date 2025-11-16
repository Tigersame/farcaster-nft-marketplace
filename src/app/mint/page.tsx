"use client";

import MintPortal from '@/components/MintPortal'
import NavigationBar from '@/components/NavigationBar'
import { EmbedMetaTags } from '@/components/EmbedMetaTags'

export const dynamic = 'force-dynamic'

export default function MintPage() {
  return (
    <>
      {/* Embed Metadata */}
      <EmbedMetaTags
        imageUrl="https://farcastmints.com/screenshots/frames.png"
        buttonTitle="Start Minting"
        url="https://farcastmints.com/mint"
      />
      
      <NavigationBar title="Mint NFT" />
      <MintPortal />
    </>
  )
}