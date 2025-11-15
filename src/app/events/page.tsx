'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

export default function EventsPage() {
  const { address } = useAccount()
  const [events, setEvents] = useState([])
  const [filter, setFilter] = useState('all') // all, mine, sales, listings
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [filter, address])

  const fetchEvents = async () => {
    try {
      let url = `${API_URL}/api/events?limit=100`
      
      if (filter === 'mine' && address) {
        url = `${API_URL}/api/users/${address}/events?limit=100`
      } else if (filter !== 'all') {
        url = `${API_URL}/api/events?type=${filter}&limit=100`
      }

      const response = await fetch(url)
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'NFTListed':
        return '📝'
      case 'NFTSold':
        return '💰'
      case 'NFTDelisted':
        return '🚫'
      default:
        return '📦'
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'NFTListed':
        return 'text-blue-400'
      case 'NFTSold':
        return 'text-green-400'
      case 'NFTDelisted':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05060a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5A61FF] mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading events...</p>
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
            Live Events
          </h1>
          <p className="text-xl text-gray-400">
            Real-time marketplace activity on Base
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full transition ${
              filter === 'all'
                ? 'bg-[#5A61FF] text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            All Events
          </button>
          {address && (
            <button
              onClick={() => setFilter('mine')}
              className={`px-6 py-2 rounded-full transition ${
                filter === 'mine'
                  ? 'bg-[#5A61FF] text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              My Activity
            </button>
          )}
          <button
            onClick={() => setFilter('NFTSold')}
            className={`px-6 py-2 rounded-full transition ${
              filter === 'NFTSold'
                ? 'bg-[#5A61FF] text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            💰 Sales
          </button>
          <button
            onClick={() => setFilter('NFTListed')}
            className={`px-6 py-2 rounded-full transition ${
              filter === 'NFTListed'
                ? 'bg-[#5A61FF] text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            📝 Listings
          </button>
        </div>

        {/* Events Feed */}
        <div className="space-y-4">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-[#0b0c10] rounded-xl p-6 border border-white/10 hover:border-[#5A61FF]/50 transition"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="text-3xl">{getEventIcon(event.event_type)}</div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`font-semibold ${getEventColor(event.event_type)}`}>
                      {event.event_type === 'NFTListed' && 'NFT Listed'}
                      {event.event_type === 'NFTSold' && 'NFT Sold'}
                      {event.event_type === 'NFTDelisted' && 'NFT Delisted'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(event.created_at)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Token ID:</span>{' '}
                      <span className="font-mono text-white">#{event.token_id}</span>
                    </div>
                    {event.price && (
                      <div>
                        <span className="text-gray-400">Price:</span>{' '}
                        <span className="font-semibold text-[#30E19F]">{event.price} ETH</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-400">User:</span>{' '}
                      <span className="font-mono text-white">
                        {event.user_address.slice(0, 6)}...{event.user_address.slice(-4)}
                      </span>
                    </div>
                    {event.xp_awarded > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-[#5A61FF]">+{event.xp_awarded} XP</span>
                      </div>
                    )}
                  </div>

                  {/* Transaction Link */}
                  <a
                    href={`https://basescan.org/tx/${event.tx_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                  >
                    View on Basescan →
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {events.length === 0 && (
          <div className="text-center py-12 text-gray-400 bg-[#0b0c10] rounded-xl border border-white/10">
            <p className="text-xl mb-2">📭 No events found</p>
            <p>Marketplace activity will appear here in real-time</p>
          </div>
        )}
      </div>
    </div>
  )
}
