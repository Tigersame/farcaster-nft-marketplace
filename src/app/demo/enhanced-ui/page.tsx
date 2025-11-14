'use client'

import React, { useState } from 'react'
import { EnhancedNFTCardV2 } from '@/components/EnhancedNFTCardV2'
import { NFTGridSkeleton, CollectionHeaderSkeleton } from '@/components/SkeletonLoaders'
import { NFTDetailModal } from '@/components/NFTDetailModal'
import { motion } from 'framer-motion'

export default function EnhancedUIDemo() {
  const [loading, setLoading] = useState(false)
  const [selectedNFT, setSelectedNFT] = useState<any>(null)

  const mockNFTs = [
    {
      tokenId: '1',
      name: 'Farcaster Genesis #001',
      image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80',
      ethPrice: '2.5',
      category: 'Art',
      verified: true,
      creatorName: 'CryptoArtist',
      creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      floorPrice: '2.2',
      contractAddress: '0x1234567890123456789012345678901234567890',
      creator: '0xCreator1234567890',
      owner: '0xOwner1234567890',
      description: 'An exclusive piece from the Farcaster Genesis collection, featuring unique artwork and rare traits.',
      traits: [
        { trait_type: 'Background', value: 'Cosmic Purple', rarity: 15 },
        { trait_type: 'Eyes', value: 'Laser', rarity: 8 },
        { trait_type: 'Mouth', value: 'Smile', rarity: 45 },
        { trait_type: 'Accessory', value: 'Crown', rarity: 3 },
      ],
    },
    {
      tokenId: '2',
      name: 'Base Builder #042',
      image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80',
      ethPrice: '1.8',
      category: 'Gaming',
      verified: true,
      creatorName: 'BaseDAO',
      floorPrice: '1.5',
      contractAddress: '0x1234567890123456789012345678901234567890',
      creator: '0xCreator1234567890',
      owner: '0xOwner1234567890',
      description: 'Part of the exclusive Base Builder collection.',
      traits: [
        { trait_type: 'Type', value: 'Rare', rarity: 12 },
        { trait_type: 'Power', value: 'High', rarity: 25 },
      ],
    },
    {
      tokenId: '3',
      name: 'Cyber Punk City',
      image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&q=80',
      ethPrice: '3.2',
      category: 'Art',
      verified: false,
      creatorName: 'FutureVisions',
      floorPrice: '2.8',
      contractAddress: '0x1234567890123456789012345678901234567890',
      creator: '0xCreator1234567890',
      owner: '0xOwner1234567890',
      description: 'A stunning cyberpunk cityscape NFT.',
      traits: [
        { trait_type: 'Style', value: 'Cyberpunk', rarity: 20 },
        { trait_type: 'Color', value: 'Neon', rarity: 18 },
      ],
    },
    {
      tokenId: '4',
      name: 'Abstract Dreams #7',
      image: 'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=800&q=80',
      ethPrice: '1.5',
      category: 'Art',
      verified: true,
      creatorName: 'AbstractArtist',
      floorPrice: '1.2',
      contractAddress: '0x1234567890123456789012345678901234567890',
      creator: '0xCreator1234567890',
      owner: '0xOwner1234567890',
      description: 'An abstract masterpiece.',
      traits: [
        { trait_type: 'Theme', value: 'Abstract', rarity: 30 },
      ],
    },
  ]

  const toggleLoading = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#141414] to-[#0a0a0a] text-white">
      
      {/* Header */}
      <header className="glass sticky top-0 z-40 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center">
                <span className="text-xl">🌊</span>
              </div>
              <h1 className="text-xl font-bold">Enhanced UI Demo</h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={toggleLoading}
                className="px-4 py-2 glass-light rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
              >
                Toggle Loading
              </button>
              <a
                href="/"
                className="px-4 py-2 glass-light rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
              >
                ← Back Home
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
            ✨ Enhanced UI Components
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Featuring glassmorphism, 3D hover effects, LQIP image loading, skeleton loaders, and detailed modals
          </p>
        </motion.div>

        {/* Collection Header Demo */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            Collection Header
          </h3>
          {loading ? (
            <CollectionHeaderSkeleton />
          ) : (
            <div className="glass rounded-2xl p-6">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-4xl">
                  🎨
                </div>
                <div className="flex-1">
                  <h4 className="text-3xl font-bold mb-2">Farcaster Genesis Collection</h4>
                  <p className="text-gray-400 mb-4">By CryptoArtist · Verified ✓</p>
                  <div className="flex gap-4">
                    <span className="px-3 py-1 rounded-lg bg-purple-600/20 text-purple-400 text-sm">Art</span>
                    <span className="px-3 py-1 rounded-lg bg-cyan-600/20 text-cyan-400 text-sm">Premium</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6 mt-6 pt-6 border-t border-white/10">
                <div>
                  <p className="text-2xl font-bold">500</p>
                  <p className="text-sm text-gray-400">Total Supply</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">2.2 ETH</p>
                  <p className="text-sm text-gray-400">Floor Price</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">234</p>
                  <p className="text-sm text-gray-400">Owners</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">1,250 ETH</p>
                  <p className="text-sm text-gray-400">Volume</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* NFT Grid Demo */}
        <section>
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            Enhanced NFT Cards
          </h3>
          
          {loading ? (
            <NFTGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockNFTs.map((nft) => (
                <EnhancedNFTCardV2
                  key={nft.tokenId}
                  {...nft}
                  onClick={() => setSelectedNFT(nft)}
                  onBuy={() => {
                    alert(`Buying ${nft.name} for ${nft.ethPrice} ETH`)
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {/* Features Grid */}
        <section className="mt-16">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Features Implemented
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '🎨', title: 'Glassmorphism', desc: 'Glass effects with backdrop blur' },
              { icon: '🎭', title: '3D Hover Effects', desc: 'Card depth, tilt & scale animations' },
              { icon: '🖼️', title: 'Image Loading', desc: 'LQIP placeholders & smooth transitions' },
              { icon: '💎', title: 'Trait Display', desc: 'Metadata, rarity & properties' },
              { icon: '📱', title: 'Detailed Modal', desc: 'Tabs, history, offers & actions' },
              { icon: '⚡', title: 'Skeleton Loaders', desc: 'Loading states & fallbacks' },
              { icon: '🎯', title: 'Quick Actions', desc: 'View, share, like on hover' },
              { icon: '✨', title: 'Smooth Animations', desc: 'Framer Motion transitions' },
              { icon: '🔗', title: 'Wallet Integration', desc: 'Buy, transfer, make offers' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-6 hover:bg-white/5 transition-colors"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h4 className="font-bold mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

      </main>

      {/* NFT Detail Modal */}
      <NFTDetailModal
        isOpen={!!selectedNFT}
        onClose={() => setSelectedNFT(null)}
        nft={selectedNFT || mockNFTs[0]}
        onBuy={() => {
          alert(`Buying ${selectedNFT?.name}`)
          setSelectedNFT(null)
        }}
      />

    </div>
  )
}
