'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

interface XPEvent {
  event: string
  xp: number
  icon: string
  description: string
  dailyLimit?: boolean
}

interface UserStats {
  total_xp: number
  level: number
  badges: any[]
  total_transactions: number
  today_xp: number
  login_streak: number
}

interface TokenConversion {
  xp: number
  baseTokens: number
  sbtBonus: number
  totalTokens: number
  hasSBT: boolean
  level: number
  badges: number
}

export default function LaunchEventDashboard() {
  const { address, isConnected } = useAccount()
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [tokenConversion, setTokenConversion] = useState<TokenConversion | null>(null)
  const [globalStats, setGlobalStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const xpEvents: XPEvent[] = [
    { event: 'Create NFT', xp: 100, icon: '🎨', description: 'Mint your own NFT' },
    { event: 'Swap Tokens', xp: 100, icon: '🔄', description: 'Complete a token swap' },
    { event: 'Buy NFT', xp: 100, icon: '🛒', description: 'Purchase an NFT' },
    { event: 'Sell NFT', xp: 100, icon: '💰', description: 'Sell your NFT' },
    { event: 'Daily Login', xp: 100, icon: '📅', description: 'Login once per day', dailyLimit: true },
    { event: 'Share Project', xp: 100, icon: '📢', description: 'Share on social media', dailyLimit: true },
    { event: 'Claim Genesis SBT', xp: 500, icon: '🏆', description: 'One-time bonus' },
  ]

  useEffect(() => {
    if (isConnected && address) {
      fetchUserStats()
      fetchTokenConversion()
    }
    fetchGlobalStats()
  }, [isConnected, address])

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/${address}/stats`)
      if (response.ok) {
        const data = await response.json()
        setUserStats(data)
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTokenConversion = async () => {
    try {
      const response = await fetch(`${API_URL}/api/token-conversion/${address}`)
      if (response.ok) {
        const data = await response.json()
        setTokenConversion(data)
      }
    } catch (error) {
      console.error('Error fetching token conversion:', error)
    }
  }

  const fetchGlobalStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/stats/global`)
      if (response.ok) {
        const data = await response.json()
        setGlobalStats(data)
      }
    } catch (error) {
      console.error('Error fetching global stats:', error)
    }
  }

  const handleDailyLogin = async () => {
    if (!address) return
    try {
      const response = await fetch(`${API_URL}/api/xp/daily-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      })
      if (response.ok) {
        fetchUserStats()
        alert('✅ Daily login XP claimed!')
      } else {
        const data = await response.json()
        alert(data.message || 'Already claimed today')
      }
    } catch (error) {
      console.error('Error claiming daily login:', error)
    }
  }

  const handleShareProject = async (platform: string) => {
    if (!address) return
    try {
      const response = await fetch(`${API_URL}/api/xp/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, platform })
      })
      if (response.ok) {
        fetchUserStats()
        alert(`✅ Share XP claimed for ${platform}!`)
      } else {
        const data = await response.json()
        alert(data.message || 'Already shared today')
      }
    } catch (error) {
      console.error('Error claiming share XP:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-4">🚀</div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Launch Event Dashboard
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Earn XP, collect badges, and convert to tokens on launch day!
            <br />
            <span className="text-yellow-400 font-semibold">Total XP Pool: 100,000,000,000 XP</span>
          </p>
        </motion.div>

        {/* Global Stats */}
        {globalStats && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid md:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-2xl font-bold text-white">
                {parseInt(globalStats.total_users || 0).toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm">Total Users</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-yellow-400">
                {parseInt(globalStats.total_xp_awarded || 0).toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm">XP Awarded</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="text-3xl mb-2">💎</div>
              <div className="text-2xl font-bold text-green-400">
                {parseInt(globalStats.remaining_xp_pool || 0).toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm">XP Remaining</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-bold text-blue-400">
                Level {parseFloat(globalStats.average_level || 1).toFixed(1)}
              </div>
              <div className="text-gray-400 text-sm">Average Level</div>
            </div>
          </motion.div>
        )}

        {/* User Stats */}
        {isConnected && userStats ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-purple-500/30"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Your Progress</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <div className="text-4xl font-bold text-white mb-2">
                  {userStats.total_xp.toLocaleString()}
                </div>
                <div className="text-gray-300">Total XP</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-2">
                  Level {userStats.level}
                </div>
                <div className="text-gray-300">Current Level</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-pink-400 mb-2">
                  {userStats.badges?.length || 0}
                </div>
                <div className="text-gray-300">Badges Earned</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-yellow-400 mb-2">
                  🔥 {userStats.login_streak || 0}
                </div>
                <div className="text-gray-300">Day Streak</div>
              </div>
            </div>

            {/* Token Conversion Preview */}
            {tokenConversion && (
              <div className="mt-8 p-6 bg-white/10 rounded-xl border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Token Conversion Preview</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Base Tokens</div>
                    <div className="text-2xl font-bold text-white">
                      {tokenConversion.baseTokens.toFixed(2)}
                    </div>
                  </div>
                  {tokenConversion.hasSBT && (
                    <div>
                      <div className="text-sm text-gray-400">SBT Bonus (20%)</div>
                      <div className="text-2xl font-bold text-yellow-400">
                        +{tokenConversion.sbtBonus.toFixed(2)}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-gray-400">Total Tokens</div>
                    <div className="text-2xl font-bold text-green-400">
                      {tokenConversion.totalTokens.toFixed(2)} 🪙
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-400">
                  * Conversion rate: 1000 XP = 1 Token | Launch day only
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          isConnected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center p-12 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 mb-8"
            >
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-white mb-2">Start Your Journey!</h3>
              <p className="text-gray-300">Complete your first action to start earning XP</p>
            </motion.div>
          )
        )}

        {/* XP Events Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Ways to Earn XP</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {xpEvents.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-purple-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{event.icon}</div>
                  <div className="px-3 py-1 bg-yellow-500/20 rounded-full">
                    <span className="text-yellow-400 font-bold">+{event.xp} XP</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{event.event}</h3>
                <p className="text-gray-400 text-sm mb-3">{event.description}</p>
                {event.dailyLimit && (
                  <div className="text-xs text-orange-400">⏰ Once per day</div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <button
                onClick={handleDailyLogin}
                className="p-6 bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 rounded-xl transition-all transform hover:scale-105"
              >
                <div className="text-3xl mb-2">📅</div>
                <div className="font-semibold text-white">Daily Login</div>
                <div className="text-sm text-blue-200">+100 XP</div>
              </button>
              
              <Link href="/genesis">
                <button className="w-full p-6 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl transition-all transform hover:scale-105">
                  <div className="text-3xl mb-2">🏆</div>
                  <div className="font-semibold text-white">Claim Genesis</div>
                  <div className="text-sm text-purple-200">+500 XP</div>
                </button>
              </Link>
              
              <Link href="/mint">
                <button className="w-full p-6 bg-gradient-to-br from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 rounded-xl transition-all transform hover:scale-105">
                  <div className="text-3xl mb-2">🎨</div>
                  <div className="font-semibold text-white">Create NFT</div>
                  <div className="text-sm text-green-200">+100 XP</div>
                </button>
              </Link>
              
              <Link href="/swap">
                <button className="w-full p-6 bg-gradient-to-br from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-xl transition-all transform hover:scale-105">
                  <div className="text-3xl mb-2">🔄</div>
                  <div className="font-semibold text-white">Token Swap</div>
                  <div className="text-sm text-orange-200">+100 XP</div>
                </button>
              </Link>
            </div>

            {/* Social Share Buttons */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Share & Earn +100 XP</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => handleShareProject('Twitter')}
                  className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold text-white transition-all"
                >
                  🐦 Twitter
                </button>
                <button
                  onClick={() => handleShareProject('Farcaster')}
                  className="flex-1 px-4 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold text-white transition-all"
                >
                  🎭 Farcaster
                </button>
                <button
                  onClick={() => handleShareProject('Lens')}
                  className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold text-white transition-all"
                >
                  🌿 Lens
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Not Connected State */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-12 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20"
          >
            <div className="text-6xl mb-4">🔐</div>
            <h3 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h3>
            <p className="text-gray-300 mb-6">Connect your wallet to start earning XP and track your progress</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
