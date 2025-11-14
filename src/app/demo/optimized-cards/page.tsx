'use client'

import React from 'react'
import NFTCardOptimized from '@/components/NFTCardOptimized'
import { generateMockNFTWithBlur, getShimmerBlurDataURL } from '@/lib/blurDataURL'
import { motion } from 'framer-motion'

export default function OptimizedCardsDemo() {
  // Generate mock NFTs with blur placeholders
  const mockNFTs = [
    generateMockNFTWithBlur(
      '1',
      'Farcaster Genesis',
      'Art',
      'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80'
    ),
    generateMockNFTWithBlur(
      '2',
      'Base Builder',
      'Gaming',
      'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80'
    ),
    generateMockNFTWithBlur(
      '3',
      'Cyber Punk City',
      'Art',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&q=80'
    ),
    generateMockNFTWithBlur(
      '4',
      'Abstract Dreams',
      'Art',
      'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=800&q=80'
    ),
    generateMockNFTWithBlur(
      '5',
      'Digital Landscape',
      'Photography',
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80'
    ),
    generateMockNFTWithBlur(
      '6',
      'Neon Samurai',
      'Collectibles',
      'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&q=80'
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
                <span className="text-xl">🌊</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Optimized NFT Cards</h1>
                <p className="text-xs text-gray-400">Next.js Image with blur placeholders</p>
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
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
            ⚡ Next.js Image Optimization
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Featuring automatic WebP/AVIF conversion, responsive srcset, lazy loading, and blur-up placeholders
          </p>
        </motion.div>

        {/* Features Grid */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: '🖼️',
                title: 'Next/Image Optimized',
                desc: 'Automatic format conversion (WebP/AVIF), responsive srcset, and lazy loading',
              },
              {
                icon: '✨',
                title: 'Blur Placeholders',
                desc: 'Category-based gradient blurs for instant visual feedback while loading',
              },
              {
                icon: '⚡',
                title: 'Performance',
                desc: 'Images outside viewport lazy-load. Smaller sizes served on mobile.',
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

        {/* NFT Grid */}
        <section>
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            Optimized NFT Cards
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

        {/* Technical Info */}
        <section className="mt-16">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Technical Implementation
          </h3>
          
          <div className="glass rounded-2xl p-8 space-y-6">
            <div>
              <h4 className="font-bold text-lg mb-2 text-purple-400">Next.js Image Features</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span><strong>Automatic format conversion:</strong> Serves WebP/AVIF when supported by browser</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span><strong>Responsive srcset:</strong> Different image sizes for mobile/tablet/desktop</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span><strong>Lazy loading:</strong> Images outside viewport load on scroll</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span><strong>Blur placeholders:</strong> Category-based gradient blurs show instantly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span><strong>Priority loading:</strong> Above-fold images load first</span>
                </li>
              </ul>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h4 className="font-bold text-lg mb-2 text-cyan-400">Blur Data URL Generation</h4>
              <pre className="bg-black/40 rounded-lg p-4 overflow-x-auto text-xs">
{`// Category-based gradient blurs
const NFT_CATEGORY_COLORS = {
  Art: ['#7A5AF8', '#00D2FF'],      // Purple to Cyan
  Gaming: ['#FF6B6B', '#FFD166'],   // Red to Yellow
  Music: ['#4ADE80', '#06B6D4'],    // Green to Teal
}

// Generate blur placeholder
blurDataURL: getCategoryBlurDataURL(category)`}
              </pre>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h4 className="font-bold text-lg mb-2 text-purple-400">Performance Metrics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-light rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-400">~60%</p>
                  <p className="text-xs text-gray-400 mt-1">Smaller file size</p>
                </div>
                <div className="glass-light rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-400">~40%</p>
                  <p className="text-xs text-gray-400 mt-1">Faster LCP</p>
                </div>
                <div className="glass-light rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-400">Instant</p>
                  <p className="text-xs text-gray-400 mt-1">Blur preview</p>
                </div>
                <div className="glass-light rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-cyan-400">Auto</p>
                  <p className="text-xs text-gray-400 mt-1">Format detect</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Example */}
        <section className="mt-16">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            Usage Example
          </h3>
          
          <div className="glass rounded-2xl p-6">
            <pre className="bg-black/40 rounded-lg p-6 overflow-x-auto text-sm">
{`import NFTCardOptimized from '@/components/NFTCardOptimized'
import { generateMockNFTWithBlur } from '@/lib/blurDataURL'

const nft = generateMockNFTWithBlur(
  '1',
  'Farcaster Genesis',
  'Art',
  'https://your-image-url.jpg'
)

<NFTCardOptimized
  token={nft}
  onBuy={async (token) => {
    // Your buy logic here
    await buyNFT(token.id, token.price)
  }}
/>`}
            </pre>
          </div>
        </section>

      </main>
    </div>
  )
}
