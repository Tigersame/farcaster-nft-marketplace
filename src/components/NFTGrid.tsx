'use client'

import { useState, useEffect } from 'react'
import { NFTCard } from './NFTCard'

interface NFT {
  tokenId: string
  id: string
  name: string
  description: string
  image: string
  price: string
  ethPrice: string
  seller: string
  owner: string
  listedAt: string
}

export function NFTGrid() {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock NFT data for demo
    const mockNFTs: NFT[] = [
      {
        tokenId: '1',
        id: '1',
        name: 'Farcaster Genesis #001',
        description: 'The first NFT in the Farcaster marketplace collection',
        image: '/api/placeholder/400/400',
        price: '100000000000000000',
        ethPrice: '0.1',
        seller: '0x123...abc',
        owner: '0x123...abc',
        listedAt: new Date().toISOString()
      },
      {
        tokenId: '2',
        id: '2',
        name: 'Base Builder #042',
        description: 'Celebrating the builders on Base network',
        image: '/api/placeholder/400/400',
        price: '50000000000000000',
        ethPrice: '0.05',
        seller: '0x456...def',
        owner: '0x456...def',
        listedAt: new Date().toISOString()
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
        <NFTCard 
          key={nft.id} 
          tokenId={nft.tokenId}
          name={nft.name}
          description={nft.description}
          image={nft.image}
          price={nft.price}
          ethPrice={nft.ethPrice}
          seller={nft.seller}
          owner={nft.owner}
          listedAt={nft.listedAt}
          onBuy={() => console.log('Buy NFT:', nft.tokenId)}
        />
      ))}
    </div>
  )
}