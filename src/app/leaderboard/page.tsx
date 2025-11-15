'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

export default function LeaderboardPage() {
  const { address } = useAccount()
  const [leaderboard, setLeaderboard] = useState([])
  const [userRank, setUserRank] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, week, month

  useEffect(() => {
    fetchLeaderboard()
    if (address) {
      fetchUserRank()
    }
  }, [address])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${API_URL}/api/leaderboard?limit=100`)
      const data = await response.json()
      setLeaderboard(data)
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserRank = async () => {
    try {
      const response = await fetch(`${API_URL}/api/leaderboard/${address}/rank`)
      const data = await response.json()
      setUserRank(data)
    } catch (error) {
      console.error('Error fetching user rank:', error)
    }
  }

  const getLevelColor = (level: number) => {
    if (level >= 20) return 'text-[#FFD700]' // Gold
    if (level >= 10) return 'text-[#C0C0C0]' // Silver
    if (level >= 5) return 'text-[#CD7F32]' // Bronze
    return 'text-gray-400'
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05060a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5A61FF] mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#05060a] text-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#5A61FF] to-[#805BFF] bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <p className="text-xl text-gray-400">
            Top collectors and traders on FarcastMints
          </p>
        </div>

        {/* User Rank Card (if connected) */}
        {address && userRank && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[#5A61FF]/20 to-[#805BFF]/20 rounded-2xl p-6 mb-8 border border-[#5A61FF]/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Your Rank</p>
                <p className="text-3xl font-bold">{getRankBadge(userRank.rank)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Total XP</p>
                <p className="text-3xl font-bold text-[#5A61FF]">{userRank.total_xp.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full transition ${
              filter === 'all'
                ? 'bg-[#5A61FF] text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setFilter('week')}
            className={`px-6 py-2 rounded-full transition ${
              filter === 'week'
                ? 'bg-[#5A61FF] text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setFilter('month')}
            className={`px-6 py-2 rounded-full transition ${
              filter === 'month'
                ? 'bg-[#5A61FF] text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            This Month
          </button>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-[#0b0c10] rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Level</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">XP</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Badges</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Transactions</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((user, index) => (
                  <motion.tr
                    key={user.wallet_address}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border-t border-white/5 hover:bg-white/5 transition ${
                      user.wallet_address?.toLowerCase() === address?.toLowerCase()
                        ? 'bg-[#5A61FF]/10'
                        : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span className="text-2xl">{getRankBadge(user.rank)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold">
                          {user.username || `${user.wallet_address.slice(0, 6)}...${user.wallet_address.slice(-4)}`}
                        </p>
                        <p className="text-xs text-gray-500">{user.wallet_address.slice(0, 10)}...</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-lg font-bold ${getLevelColor(user.level)}`}>
                        Lv. {user.level}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-[#5A61FF]">
                        {user.total_xp.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {user.badges?.slice(0, 5).map((badge: any, i: number) => (
                          <span key={i} className="text-xl" title={badge.name}>
                            {badge.icon}
                          </span>
                        ))}
                        {user.badges?.length > 5 && (
                          <span className="text-xs text-gray-400">+{user.badges.length - 5}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {user.total_transactions || 0}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {leaderboard.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-xl">No users on the leaderboard yet.</p>
            <p className="mt-2">Be the first to earn XP!</p>
          </div>
        )}
      </div>
    </div>
  )
}
