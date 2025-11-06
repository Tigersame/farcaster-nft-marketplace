'use client'

import { useState, useEffect } from 'react'
import { NFTCard } from './NFTCard'

interface NFT {
  id: string
  name: string
  description: string
  image: string
  price: string
  owner: string
}

export function NFTGrid() {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock NFT data for demo
    const mockNFTs: NFT[] = [
      {
        id: '1',
        name: 'Farcaster Genesis #001',
        description: 'The first NFT in the Farcaster marketplace collection',
        image: '/api/placeholder/400/400',
        price: '0.1',
        owner: '0x123...abc'
      },
      {
        id: '2',
        name: 'Base Builder #042',
        description: 'Celebrating the builders on Base network',
        image: '/api/placeholder/400/400',
        price: '0.05',
        owner: '0x456...def'
      }
    ]
    
    setTimeout(() => {
      setNfts(mockNFTs)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
            <div className="bg-gray-200 h-4 rounded mb-2"></div>
            <div className="bg-gray-200 h-3 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {nfts.map((nft) => (
        <NFTCard key={nft.id} nft={nft} />
      ))}
    </div>
  )
}