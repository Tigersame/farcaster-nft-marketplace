'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  FiTrendingUp,
  FiShoppingBag,
  FiUsers,
  FiDollarSign,
  FiFilter,
  FiGrid,
  FiList,
  FiSearch,
  FiRefreshCw,
  FiStar,
  FiEye,
  FiZap,
  FiHeart,
  FiBookmark,
  FiArrowUp,
  FiChevronDown,
  FiX,
  FiSliders,
} from 'react-icons/fi'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { NFTGrid } from '@/components/NFTGrid'
import { VerticalSidebar } from '@/components/VerticalSidebar'
import { NFTCard } from '@/components/NFTCard'
import { AdminToggleButton } from '@/components/AdminToggleButton'
import { FarcasterOnboarding } from '@/components/FarcasterOnboarding'
import { StatsCard } from '@/components/StatsCard'
import { LoadingSpinner } from '@/components/LoadingSpinner'

interface NFTItem {
  tokenId: string
  name: string
  description: string
  image: string
  price: string
  seller: string
  owner: string
  ethPrice: string
  listedAt: string
}

export default function MarketplaceContent() {
  const { address, isConnected, chain } = useAccount()
  const publicClient = usePublicClient()
  
  // Core state
  const [marketItems, setMarketItems] = useState<NFTItem[]>([])
  const [loading, setLoading] = useState(true)
  const [buying, setBuying] = useState<string | null>(null)
  
  // UX state for engagement
  const [userActions, setUserActions] = useState<string[]>([])
  const [nftsViewed, setNftsViewed] = useState(0)
  const [nftsPurchased, setNftsPurchased] = useState(0)
  
  // Filtering and search
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [filterBy, setFilterBy] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [currentView, setCurrentView] = useState('marketplace')

  // Mock data with proper typing
  useEffect(() => {
    const mockItems: NFTItem[] = [
      {
        tokenId: '1',
        name: 'Farcaster Genesis #001',
        description: 'The first NFT in the Farcaster ecosystem on Base. A piece of decentralized social history.',
        image: '/api/placeholder/400/400',
        price: '2500000000000000000',
        seller: '0x742d35Cc6635Cc532A3Fdb1b4858b4c115D29E53',
        owner: '0x742d35Cc6635Cc532A3Fdb1b4858b4c115D29E53',
        ethPrice: '2.5',
        listedAt: new Date().toISOString(),
      },
      {
        tokenId: '2', 
        name: 'Base Builder Badge',
        description: 'Limited edition builder badge for early Base network adopters.',
        image: '/api/placeholder/400/400',
        price: '1000000000000000000',
        seller: '0x8ba1f109551bD432803012645Hac136c22C501e',
        owner: '0x8ba1f109551bD432803012645Hac136c22C501e',
        ethPrice: '1.0',
        listedAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        tokenId: '3',
        name: 'Onchain Summer Vibes',
        description: 'Commemorating the onchain summer movement with vibrant digital art.',
        image: '/api/placeholder/400/400', 
        price: '750000000000000000',
        seller: '0x123f109551bD432803012645Hac136c22C789a',
        owner: '0x123f109551bD432803012645Hac136c22C789a',
        ethPrice: '0.75',
        listedAt: new Date(Date.now() - 7200000).toISOString(),
      }
    ]
    setMarketItems(mockItems)
    setLoading(false)
  }, [])

  // Check if connected to Base network
  const isOnBase = chain?.id === 8453 || chain?.id === 84532 // Base Mainnet or Sepolia

  // Action tracking for engagement
  const trackAction = useCallback((action: string) => {
    setUserActions(prev => [...prev, action])
    toast.success(`Action: ${action}`)
  }, [])

  // Mock components for different views
  const NFTCreator = () => (
    <div className="p-8 bg-white dark:bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Create NFT</h2>
      <p className="text-gray-600 dark:text-gray-400">NFT creation interface coming soon...</p>
    </div>
  )

  const FrameDiscovery = () => (
    <div className="p-8 bg-white dark:bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Farcaster Frames</h2>
      <p className="text-gray-600 dark:text-gray-400">Explore NFTs as interactive frames...</p>
    </div>
  )

  const LiveDataDemo = () => (
    <div className="p-8 bg-white dark:bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Live Market Data</h2>
      <p className="text-gray-600 dark:text-gray-400">Real-time analytics coming soon...</p>
    </div>
  )

  // Filtering logic
  const filteredItems = marketItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'genesis' && item.name.includes('Genesis')) ||
                         (filterBy === 'builder' && item.name.includes('Builder'))
    
    return matchesSearch && matchesFilter
  })

  // Sorting logic
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.ethPrice) - parseFloat(b.ethPrice)
      case 'price-high':
        return parseFloat(b.ethPrice) - parseFloat(a.ethPrice)
      case 'oldest':
        return new Date(a.listedAt).getTime() - new Date(b.listedAt).getTime()
      case 'newest':
      default:
        return new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime()
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Vertical Sidebar */}
      <VerticalSidebar 
        currentView={currentView}
        setCurrentView={setCurrentView}
        isConnected={isConnected}
        onFilterChange={(filters) => {
          // Handle filter changes from sidebar
          if (filters.category) setFilterBy(filters.category)
          if (filters.search) setSearchQuery(filters.search)
        }}
        onViewModeChange={setViewMode}
        viewMode={viewMode}
      />

      {/* Main Content Area */}
      <div className="lg:ml-80">
        <Header />
        
        {/* Chain validation warning */}
        {isConnected && !isOnBase && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-500 p-4 mx-6 mt-4 rounded-r-lg"
          >
            <div className="flex">
              <FiZap className="w-5 h-5 text-yellow-400 dark:text-yellow-500 mt-0.5 mr-3" />
              <div>
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  <strong>Switch to Base network</strong> to trade NFTs with lower fees and faster transactions.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Tabs */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            {[
              { id: 'marketplace', label: 'Browse', icon: FiShoppingBag },
              { id: 'create', label: 'Create', icon: FiZap },
              { id: 'frames', label: 'Frames', icon: FiEye },
              { id: 'live-data', label: 'Live Data', icon: FiTrendingUp }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentView(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    currentView === tab.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {/* Display current view content */}
            <div className="p-4 sm:p-6 lg:p-8">
              {currentView === 'marketplace' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Search and Filter Bar */}
                  <div className="mb-8 space-y-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                      <div className="flex-1 max-w-md">
                        <div className="relative">
                          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search NFTs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="newest">Newest</option>
                          <option value="oldest">Oldest</option>
                          <option value="price-low">Price: Low to High</option>
                          <option value="price-high">Price: High to Low</option>
                        </select>
                        
                        <select
                          value={filterBy}
                          onChange={(e) => setFilterBy(e.target.value)}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="all">All NFTs</option>
                          <option value="genesis">Genesis</option>
                          <option value="builder">Builder</option>
                        </select>
                        
                        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                          <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded transition-colors ${
                              viewMode === 'grid'
                                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                          >
                            <FiGrid className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded transition-colors ${
                              viewMode === 'list'
                                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                          >
                            <FiList className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* NFT Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sortedItems.map((item) => (
                      <NFTCard
                        key={item.tokenId}
                        {...item}
                        onBuy={() => {
                          setNftsViewed(prev => prev + 1)
                          trackAction(`Viewed ${item.name}`)
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {currentView === 'create' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <NFTCreator />
                </motion.div>
              )}

              {currentView === 'live-data' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <LiveDataDemo />
                </motion.div>
              )}

              {currentView === 'frames' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <FrameDiscovery />
                </motion.div>
              )}

              {/* Sidebar Views */}
              {['trending', 'collections', 'activity', 'swap', 'buy', 'sell', 'portfolio', 'wallet', 'mint', 'create-collection', 'bulk-mint', 'search', 'explore', 'favorites', 'watchlist', 'analytics', 'filters', 'price-alerts', 'history', 'rewards', 'referrals', 'settings', 'help', 'contact', 'about'].includes(currentView) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 bg-white dark:bg-gray-800 rounded-lg"
                >
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white capitalize">
                    {currentView.replace('-', ' ')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {currentView} functionality coming soon...
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />

        {/* Admin Toggle Button - Fixed Bottom Left */}
        <AdminToggleButton />
      </div>
    </div>
  )
}