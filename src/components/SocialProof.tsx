'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface ActivityItem {
  id: string
  type: 'purchase' | 'listing' | 'offer' | 'follow' | 'like'
  user: {
    fid: string
    username: string
    displayName: string
    avatar: string
    verified?: boolean
  }
  nft?: {
    name: string
    image: string
    price?: string
  }
  timestamp: Date
  action: string
}

interface SocialProofProps {
  showRecentActivity?: boolean
  showLiveUsers?: boolean
  showTrending?: boolean
}

export function SocialProofFeed({ 
  showRecentActivity = true, 
  showLiveUsers = true, 
  showTrending = true 
}: SocialProofProps) {
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [liveUsers, setLiveUsers] = useState<number>(0)
  const [trendingItems, setTrendingItems] = useState<string[]>([])

  // Generate real-time activity with proper avatars
  useEffect(() => {
    const generateActivity = (): ActivityItem[] => {
      const users = [
        { name: 'Art Lover', username: 'artlover.eth', avatar: '🎨', verified: true },
        { name: 'Crypto Creator', username: 'cryptocreator', avatar: '👩‍🎨', verified: false },
        { name: 'NFT Collector', username: 'collector123', avatar: '💎', verified: true },
        { name: 'Base Builder', username: 'basebuilder', avatar: '🔵', verified: true },
        { name: 'Farcaster Fan', username: 'farcasterfan', avatar: '🟣', verified: false },
        { name: 'Digital Artist', username: 'digitalartist', avatar: '🖼️', verified: true },
        { name: 'Onchain Maxi', username: 'onchainmaxi', avatar: '⛓️', verified: false },
        { name: 'Web3 Native', username: 'web3native', avatar: '🌐', verified: true }
      ]

      const nfts = [
        { name: 'Farcaster Genesis #001', emoji: '🚀', price: '2.5 ETH' },
        { name: 'Base Builder Badge', emoji: '🔵', price: '1.0 ETH' },
        { name: 'Onchain Summer Vibes', emoji: '☀️', price: '0.75 ETH' },
        { name: 'Cosmic Dreamscape #42', emoji: '🌌', price: '0.5 ETH' },
        { name: 'Digital Sunset', emoji: '🌅', price: '1.2 ETH' },
        { name: 'Abstract Vision #7', emoji: '🎭', price: '0.8 ETH' },
        { name: 'Pixel Dreams', emoji: '🎮', price: '0.3 ETH' },
        { name: 'Neural Networks', emoji: '🧠', price: '1.5 ETH' }
      ]

      const actions = [
        { type: 'purchase' as const, action: 'purchased', hasPrice: true },
        { type: 'listing' as const, action: 'listed for sale', hasPrice: true },
        { type: 'offer' as const, action: 'made an offer on', hasPrice: false },
        { type: 'like' as const, action: 'liked', hasPrice: false },
        { type: 'follow' as const, action: 'started following', hasPrice: false }
      ]

      return Array.from({ length: 8 }, (_, i) => {
        const user = users[Math.floor(Math.random() * users.length)]
        const nft = nfts[Math.floor(Math.random() * nfts.length)]
        const actionData = actions[Math.floor(Math.random() * actions.length)]
        
        return {
          id: `activity-${i}`,
          type: actionData.type,
          user: {
            fid: `${12345 + i}`,
            username: user.username,
            displayName: user.name,
            avatar: user.avatar,
            verified: user.verified
          },
          nft: {
            name: nft.name,
            image: nft.emoji,
            price: actionData.hasPrice ? nft.price : undefined
          },
          timestamp: new Date(Date.now() - (i + 1) * 2 * 60 * 1000), // 2, 4, 6... minutes ago
          action: actionData.action
        }
      })
    }

    const initialActivity = generateActivity()
    setRecentActivity(initialActivity)

    // Add new activity every 15 seconds
    const addNewActivity = () => {
      const newActivity = generateActivity()[0] // Get just one new item
      newActivity.timestamp = new Date() // Set to now
      newActivity.id = `activity-${Date.now()}` // Unique ID
      
      setRecentActivity(prev => [newActivity, ...prev.slice(0, 7)]) // Keep only 8 most recent
    }

    const activityInterval = setInterval(addNewActivity, 15000) // Every 15 seconds

    // Simulate live user count
    const updateLiveUsers = () => {
      setLiveUsers(prev => {
        const change = Math.floor(Math.random() * 6) - 2 // -2 to +3
        return Math.max(127, Math.min(456, prev + change))
      })
    }

    setLiveUsers(234) // Initial count
    const userInterval = setInterval(updateLiveUsers, 8000)

    // Simulate trending items
    const trending = [
      "🔥 Cosmic Collection trending",
      "💎 Base Builders gaining momentum", 
      "⚡ New artist spotlight",
      "🚀 Community picks rising"
    ]
    setTrendingItems(trending)

    return () => {
      clearInterval(userInterval)
      clearInterval(activityInterval)
    }
  }, [])

  const getTimeAgo = (timestamp: Date) => {
    const diff = Date.now() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      purchase: '💎',
      listing: '📈', 
      offer: '💰',
      follow: '👥',
      like: '❤️'
    }
    return icons[type] || '🔄'
  }

  return (
    <div className="space-y-6">
      {/* Live Users Counter */}
      {showLiveUsers && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-2xl p-4 transition-colors duration-300"
        >
          <div className="flex items-center space-x-3">
            <motion.div
              className="w-3 h-3 bg-green-500 rounded-full"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <div>
              <motion.span 
                className="font-bold text-green-800 text-lg"
                key={liveUsers}
                initial={{ scale: 1.2, color: '#10b981' }}
                animate={{ scale: 1, color: '#065f46' }}
                transition={{ duration: 0.3 }}
              >
                {liveUsers}
              </motion.span>
              <span className="text-green-700 dark:text-green-300 text-sm ml-2">collectors online</span>
            </div>
          </div>
          <p className="text-green-600 dark:text-green-400 text-xs mt-1">
            join the most active nft community on base 🚀
          </p>
        </motion.div>
      )}

      {/* Trending Items */}
      {showTrending && trendingItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700 rounded-2xl p-4 transition-colors duration-300"
        >
          <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-3 flex items-center space-x-2">
            <span>🌟</span>
            <span>trending right now</span>
          </h4>
          <div className="space-y-2">
            {trendingItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-purple-700 dark:text-purple-300 text-sm flex items-center space-x-2 hover:bg-purple-100 dark:hover:bg-purple-800/30 p-2 rounded-lg cursor-pointer transition-colors"
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ 
                    duration: 2,
                    delay: index * 0.5,
                    repeat: Infinity,
                    repeatDelay: 5
                  }}
                >
                  {item.split(' ')[0]}
                </motion.span>
                <span>{item.substring(2)}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Activity Feed */}
      {showRecentActivity && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm transition-colors duration-300"
        >
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              🔄
            </motion.span>
            <span>recent activity</span>
          </h4>

          <div className="space-y-3">
            <AnimatePresence>
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -50, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 50, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors group cursor-pointer"
                >
                  {/* Activity Icon */}
                  <motion.div
                    className="text-lg"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    {getActivityIcon(activity.type)}
                  </motion.div>

                  {/* User Avatar */}
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-600 group-hover:border-blue-300 dark:group-hover:border-blue-400 transition-colors bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-lg">
                      {activity.user.avatar}
                    </div>
                    {activity.user.verified && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>

                  {/* Activity Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="font-medium text-gray-900 dark:text-white truncate">
                        {activity.user.displayName}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {activity.action}
                      </span>
                    </div>
                    
                    {activity.nft && (
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="w-5 h-5 rounded bg-gradient-to-br from-purple-100 to-pink-100 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center text-sm">
                          {activity.nft.image}
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-300 truncate flex-1">
                          {activity.nft.name}
                        </span>
                        {activity.nft.price && (
                          <span className="text-xs font-medium text-green-600 dark:text-green-400">
                            {activity.nft.price}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    {getTimeAgo(activity.timestamp)}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* View All Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
          >
            view all activity →
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}

// Compact version for sidebar
export function SocialProofWidget() {
  const [stats, setStats] = useState({
    todaysSales: 42,
    activeListings: 1247,
    topSale: '12.5 ETH'
  })

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl p-4 space-y-3 transition-colors duration-300"
    >
      <h4 className="font-semibold text-blue-900 dark:text-blue-300 flex items-center space-x-2">
        <span>📊</span>
        <span>marketplace pulse</span>
      </h4>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-blue-700 dark:text-blue-300">today's sales:</span>
          <motion.span 
            className="font-bold text-blue-900 dark:text-blue-100"
            key={stats.todaysSales}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
          >
            {stats.todaysSales}
          </motion.span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-blue-700 dark:text-blue-300">active listings:</span>
          <span className="font-medium text-blue-800 dark:text-blue-200">
            {stats.activeListings.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-blue-700 dark:text-blue-300">top sale:</span>
          <span className="font-bold text-green-600 dark:text-green-400">
            {stats.topSale}
          </span>
        </div>
      </div>

      <motion.div
        className="text-xs text-blue-600 text-center pt-2 border-t border-blue-200"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        🔥 hottest marketplace on base
      </motion.div>
    </motion.div>
  )
}