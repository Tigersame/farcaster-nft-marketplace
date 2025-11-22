'use client'

import { motion } from 'framer-motion'
import { FiShare2, FiTwitter, FiMessageCircle } from 'react-icons/fi'
import { useState } from 'react'

interface ShareDeFiProps {
  poolName?: string
  apr?: string
  type?: 'swap' | 'pool' | 'general'
}

export function ShareDeFi({ poolName, apr, type = 'general' }: ShareDeFiProps) {
  const [showShare, setShowShare] = useState(false)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://farcastmints.com'

  const getShareText = () => {
    switch (type) {
      case 'pool':
        return `Just found this amazing pool on Base DeFi Hub!\n${poolName} - ${apr} APR 💰\nEarn passive income by providing liquidity! 🚀`
      case 'swap':
        return `Trading on Base DeFi Hub! 🔄\nLow fees, fast transactions, deep liquidity\nJoin me on Base network! 🚀`
      default:
        return `Check out Base DeFi Hub! 🚀\nSwap tokens, provide liquidity & earn rewards\n$507M+ TVL | 8+ Tokens | 5 Pools 💎`
    }
  }

  const shareOnFarcaster = () => {
    const text = encodeURIComponent(getShareText())
    const url = encodeURIComponent(`${baseUrl}/defi`)
    const frameUrl = encodeURIComponent(`${baseUrl}/api/frames/defi`)
    window.open(
      `https://warpcast.com/~/compose?text=${text}&embeds[]=${url}`,
      '_blank'
    )
  }

  const shareOnTwitter = () => {
    const text = encodeURIComponent(getShareText())
    const url = encodeURIComponent(`${baseUrl}/defi`)
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      '_blank'
    )
  }

  const copyFrameUrl = () => {
    const frameUrl = `${baseUrl}/api/frames/defi`
    navigator.clipboard.writeText(frameUrl)
    alert('Frame URL copied to clipboard!')
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowShare(!showShare)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
      >
        <FiShare2 className="w-4 h-4" />
        Share
      </button>

      {showShare && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 z-50"
        >
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Share DeFi Hub
          </h3>
          <div className="space-y-2">
            <button
              onClick={shareOnFarcaster}
              className="w-full flex items-center gap-3 px-4 py-3 bg-purple-100 dark:bg-purple-900/20 hover:bg-purple-200 dark:hover:bg-purple-900/40 text-purple-900 dark:text-purple-100 rounded-xl transition-all"
            >
              <FiMessageCircle className="w-5 h-5" />
              Share on Farcaster
            </button>
            <button
              onClick={shareOnTwitter}
              className="w-full flex items-center gap-3 px-4 py-3 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/40 text-blue-900 dark:text-blue-100 rounded-xl transition-all"
            >
              <FiTwitter className="w-5 h-5" />
              Share on Twitter
            </button>
            <button
              onClick={copyFrameUrl}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl transition-all"
            >
              <FiShare2 className="w-5 h-5" />
              Copy Frame URL
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
