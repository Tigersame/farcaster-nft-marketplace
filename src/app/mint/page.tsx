"use client";

import MintPortal from '@/components/MintPortal'
import NavigationBar from '@/components/NavigationBar'

export default function MintPage() {
  return (
    <>
      <NavigationBar title="Mint NFT" />
      <MintPortal />
    </>
  )
}