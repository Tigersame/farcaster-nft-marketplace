'use client'

import { useState } from 'react'
import NFTCardOptimized from '@/components/NFTCardOptimized'
import { generateMockNFTWithBlur } from '@/lib/blurDataURL'
import { motion } from 'framer-motion'
import { FiShare2, FiMessageCircle, FiUsers } from 'react-icons/fi'

export default function FarcasterShareDemo() {
  const [shareCount, setShareCount] = useState(127)
  const [likeCount, setLikeCount] = useState(342)

  // Generate sample NFTs
  const mockNFTs = [
    generateMockNFTWithBlur(
      '1',
      'Farcaster Genesis #001',
      'Art',
      'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80'
    ),
    generateMockNFTWithBlur(
      '2',
      'Base Builder Badge',
      'Gaming',
      'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80'
    ),
    generateMockNFTWithBlur(
      '3',
      'Cyber Punk City',
      'Art',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&q=80'
    ),
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#141414] to-[#0a0a0a] text-white">
      
      {/* Header */}
      <header className="glass sticky top-0 z-40 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center">
                <FiShare2 className="text-xl text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Farcaster Share Integration</h1>
                <p className="text-xs text-gray-400">Share NFTs to Farcaster with Frames</p>
              </div>
            </div>
            <a
              href="/"
              className="px-4 py-2 glass-light rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
            >
              ← Back Home
            </a>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 text-sm mb-6">
            <FiMessageCircle className="w-4 h-4" />
            Farcaster Native Sharing
          </div>
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
            Share NFTs with Farcaster Frames
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Interactive NFT frames appear directly in Farcaster feeds with buy, like, and share buttons
          </p>
        </motion.div>

        {/* Features Grid */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: '🖼️',
                title: 'Interactive Frames',
                desc: 'NFTs display as interactive cards with actions directly in the feed',
              },
              {
                icon: '🔗',
                title: 'Warpcast Integration',
                desc: 'One-click sharing to Warpcast with pre-filled composer',
              },
              {
                icon: '⚡',
                title: 'Real-time Updates',
                desc: 'Track shares, likes, and views with live interaction data',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-6 text-center"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Social Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-4 mb-12 glass rounded-2xl p-6"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">{shareCount}</div>
            <div className="text-sm text-gray-400 flex items-center justify-center gap-1 mt-1">
              <FiShare2 className="w-3 h-3" />
              Farcaster Shares
            </div>
          </div>
          <div className="text-center border-x border-white/10">
            <div className="text-3xl font-bold text-cyan-400">{likeCount}</div>
            <div className="text-sm text-gray-400 flex items-center justify-center gap-1 mt-1">
              ❤️ Frame Likes
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">892</div>
            <div className="text-sm text-gray-400 flex items-center justify-center gap-1 mt-1">
              <FiUsers className="w-3 h-3" />
              Frame Views
            </div>
          </div>
        </motion.div>

        {/* Try It Section */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            Try Farcaster Share
          </h3>
          <p className="text-gray-400 mb-6">
            Click the share button on any NFT card below to open the Farcaster share modal
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockNFTs.map((nft) => (
              <NFTCardOptimized
                key={nft.id}
                token={nft}
                onBuy={async (token) => {
                  await new Promise((r) => setTimeout(r, 1500))
                  alert(`✅ Successfully purchased ${token.name}!`)
                }}
              />
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mt-16">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            How Farcaster Frames Work
          </h3>
          
          <div className="glass rounded-2xl p-8 space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 text-purple-400">Share NFT</h4>
                <p className="text-sm text-gray-300">
                  Click the share button and select your sharing method (Warpcast, Frame Link, or Direct)
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 text-cyan-400">Frame Appears in Feed</h4>
                <p className="text-sm text-gray-300">
                  Your NFT appears as an interactive frame in Farcaster with image, price, and action buttons
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 text-green-400">Users Interact</h4>
                <p className="text-sm text-gray-300">
                  Users can buy, like, view details, or share - all without leaving Farcaster
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Frame API Reference */}
        <section className="mt-16">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            Frame API Endpoints
          </h3>
          
          <div className="glass rounded-2xl p-6">
            <pre className="bg-black/40 rounded-lg p-4 overflow-x-auto text-sm">
{`// Frame Display
GET /api/frames/nft/[tokenId]
→ Returns Farcaster Frame HTML with Open Graph meta tags

// Frame Interaction
POST /api/frames/nft/[tokenId]
→ Handles button clicks (Buy, Like, View, Share)

// Frame Image
GET /api/frames/image/[tokenId]
→ Dynamic OG image generation for NFT`}
            </pre>
          </div>
        </section>

      </main>
    </div>
  )
}
