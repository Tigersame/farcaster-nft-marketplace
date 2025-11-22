'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { BRANDING, getLogoUrl } from '@/config/branding'
import { FiGrid, FiLayers, FiZap, FiShoppingBag, FiTrendingUp } from 'react-icons/fi'
import { EmbedMetaTags } from '@/components/EmbedMetaTags'

export const dynamic = 'force-dynamic'

export default function Home() {
  const features = [
    {
      icon: FiGrid,
      title: 'Collections',
      description: 'Browse verified NFT collections',
      href: '/collections',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: FiLayers,
      title: 'Collection Pro',
      description: 'Advanced collection analytics',
      href: '/collection-pro',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FiZap,
      title: 'Mint NFTs',
      description: 'Create and mint your NFTs',
      href: '/mint',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: FiShoppingBag,
      title: 'My NFTs',
      description: 'View your NFT collection',
      href: '/my-nfts',
      color: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0b0b] via-[#1a1a2e] to-[#0b0b0b]">
      {/* Embed Metadata */}
      <EmbedMetaTags
        imageUrl="https://farcastmints.com/og-image.png"
        buttonTitle="Open App"
        url="https://farcastmints.com"
      />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Logo */}
            {BRANDING.display.showIcon && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-center mb-8"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-2xl opacity-50"></div>
                  <img 
                    src={getLogoUrl('main')} 
                    alt={BRANDING.name}
                    className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl shadow-2xl"
                  />
                </div>
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl sm:text-6xl font-bold text-white mb-6"
            >
              Welcome to <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{BRANDING.name}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
            >
              Trade NFTs on Base Network with gasless transactions and social engagement
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/collections"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-purple-500/50"
              >
                Explore Collections
              </Link>
              <Link
                href="/mint"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/20"
              >
                Start Minting
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {/* DeFi Feature Card - Highlighted */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="lg:col-span-5"
          >
            <Link
              href="/defi"
              className="block group"
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 hover:shadow-2xl hover:shadow-purple-500/50 transition-all">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center">
                      <FiTrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-2">🚀 DeFi Hub - NEW!</h3>
                      <p className="text-white/90 text-lg">Swap tokens, provide liquidity & earn rewards on Base</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-8 text-white">
                    <div className="text-center">
                      <div className="text-2xl font-bold">$507M+</div>
                      <div className="text-sm text-white/80">TVL</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">8+</div>
                      <div className="text-sm text-white/80">Tokens</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">5</div>
                      <div className="text-sm text-white/80">Pools</div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {features.map((feature, index) => (
            <motion.div
              key={feature.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
            >
              <Link
                href={feature.href}
                className="block group"
              >
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-6 hover:border-purple-500/50 transition-all h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                  
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}