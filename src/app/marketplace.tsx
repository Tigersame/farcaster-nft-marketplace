'use client'

import { useState, useEffect } from 'react'
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
import { NFTGrid } from '@/components/NFTGrid'
import { NFTCard } from '@/components/NFTCard'
import { StatsCard } from '@/components/StatsCard'
import { useNotifications, useActionReactions } from '@/components/NotificationSystem'
import { UserEngagementSystem, UserProgressTracker } from '@/components/UserEngagement'
import { SocialProofFeed, SocialProofWidget } from '@/components/SocialProof'
import { ChatLauncher } from '@/components/XMTPChat'
import { FrameDiscovery } from '@/components/FrameShare'
import NFTCreator from '@/components/NFTCreator'
import { AdminPanel } from '@/components/AdminPanel'

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
  
  // Engagement tracking
  const { addNotification, celebrate } = useNotifications()
  const reactions = useActionReactions()
  
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
  const [currentView, setCurrentView] = useState<'browse' | 'create' | 'frames'>('browse')

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
    
    setTimeout(() => {
      setMarketItems(mockItems)
      setLoading(false)
    }, 1000)
  }, [])

  // Track user engagement
  const trackAction = (action: string) => {
    setUserActions(prev => Array.from(new Set([...prev, action])))
  }

  const handleBuyNFT = async (item: NFTItem) => {
    if (!isConnected) {
      addNotification({
        type: 'warning',
        title: 'connect your wallet first! 🔗',
        message: 'you need to connect your wallet to purchase nfts'
      })
      return
    }

    setBuying(item.tokenId)
    
    try {
      // Simulate purchase delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Success feedback
      reactions.onNFTPurchased()
      setNftsPurchased(prev => prev + 1)
      trackAction('purchase')
      
      toast.success(`Successfully purchased ${item.name}!`)
    } catch (error) {
      toast.error('Failed to purchase NFT')
    } finally {
      setBuying(null)
    }
  }

  const handleNFTView = (item: NFTItem) => {
    reactions.onNFTViewed(item.name)
    setNftsViewed(prev => prev + 1)
    trackAction('view')
  }

  // Base chain validation
  const isOnBase = chain?.id === 8453 || chain?.id === 84532

  const stats = {
    totalSales: marketItems.length * 1.2, 
    eth: marketItems.filter(item => parseFloat(item.ethPrice) > 0).length,
    owners: new Set(marketItems.map(item => item.owner)).size,
    floorPrice: Math.min(...marketItems.map(item => parseFloat(item.ethPrice)))
  }

  const filteredItems = marketItems
    .filter(item => {
      const query = searchQuery.toLowerCase()
      return (
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tokenId.includes(searchQuery)
      )
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.ethPrice) - parseFloat(b.ethPrice)
        case 'price-high':
          return parseFloat(b.ethPrice) - parseFloat(a.ethPrice)
        case 'oldest':
          return new Date(a.listedAt).getTime() - new Date(b.listedAt).getTime()
        default: // newest
          return new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime()
      }
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 transition-colors duration-300">
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            className="text-center space-y-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <FiZap className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-medium">loading the future of nfts...</p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <UserProgressTracker onActionTracked={trackAction}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 transition-colors duration-300">
        <Header />
        
        {/* Admin Panel - only visible to admin wallet */}
        <AdminPanel />
        
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

        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Hero Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white relative overflow-hidden"
              >
                <div className="relative z-10">
                  <motion.h1
                    className="text-4xl md:text-5xl font-bold mb-4"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    welcome to base nfts 🚀
                  </motion.h1>
                  <motion.p
                    className="text-xl text-purple-100 mb-6 max-w-2xl"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    discover, trade, and create nfts in the farcaster ecosystem. 
                    built on base for lightning-fast, low-cost transactions.
                  </motion.p>
                  <motion.div
                    className="flex space-x-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <button className="bg-white text-purple-600 px-6 py-3 rounded-2xl font-semibold hover:bg-gray-100 transition-colors">
                      explore nfts
                    </button>
                    <button className="border border-white text-white px-6 py-3 rounded-2xl font-semibold hover:bg-white hover:text-purple-600 transition-colors">
                      create nft
                    </button>
                  </motion.div>
                </div>
                <motion.div
                  className="absolute top-0 right-0 w-64 h-64 opacity-20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <FiZap className="w-full h-full" />
                </motion.div>
              </motion.div>

              {/* Navigation Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentView('browse')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-semibold transition-all ${
                      currentView === 'browse'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <FiGrid className="w-4 h-4" />
                    <span>Browse NFTs</span>
                  </button>
                  <button
                    onClick={() => setCurrentView('create')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-semibold transition-all ${
                      currentView === 'create'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <FiArrowUp className="w-4 h-4" />
                    <span>Create NFT</span>
                  </button>
                  <button
                    onClick={() => setCurrentView('frames')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-semibold transition-all ${
                      currentView === 'frames'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <FiBookmark className="w-4 h-4" />
                    <span>Frames</span>
                  </button>
                </div>
              </motion.div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatsCard
                  icon={<FiTrendingUp />}
                  label="Total Sales"
                  value={`${stats.totalSales.toFixed(1)}K`}
                  change="+12.5%"
                  color="blue"
                />
                <StatsCard
                  icon={<FiShoppingBag />}
                  label="ETH Volume" 
                  value={`${stats.eth}Ξ`}
                  change="+8.2%"
                  color="purple"
                />
                <StatsCard
                  icon={<FiUsers />}
                  label="Owners"
                  value={stats.owners.toString()}
                  change="+15.1%"
                  color="green"
                />
                <StatsCard
                  icon={<FiDollarSign />}
                  label="Floor Price"
                  value={`${stats.floorPrice}Ξ`}
                  change="-2.1%"
                  color="orange"
                />
              </div>

              {/* Conditional View Content */}
              {currentView === 'browse' && (
                <>
                  {/* Search and Filters */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300"
                  >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="search nfts, creators..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FiSliders className="w-4 h-4" />
                      <span className="text-sm font-medium">filters</span>
                    </button>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="newest">newest first</option>
                      <option value="oldest">oldest first</option>
                      <option value="price-low">price: low to high</option>
                      <option value="price-high">price: high to low</option>
                    </select>

                    <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        <FiGrid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        <FiList className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Advanced Filters */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-200"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">status</label>
                          <select className="w-full p-2 border border-gray-200 rounded-lg text-sm">
                            <option>buy now</option>
                            <option>on auction</option>
                            <option>has offers</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">price range</label>
                          <div className="flex space-x-2">
                            <input type="number" placeholder="min" className="w-full p-2 border border-gray-200 rounded-lg text-sm" />
                            <input type="number" placeholder="max" className="w-full p-2 border border-gray-200 rounded-lg text-sm" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">collection</label>
                          <select className="w-full p-2 border border-gray-200 rounded-lg text-sm">
                            <option>all collections</option>
                            <option>farcaster genesis</option>
                            <option>base builders</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">rarity</label>
                          <select className="w-full p-2 border border-gray-200 rounded-lg text-sm">
                            <option>all rarities</option>
                            <option>common</option>
                            <option>rare</option>
                            <option>legendary</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* NFT Grid */}
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                <AnimatePresence>
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.tokenId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleNFTView(item)}
                    >
                      <NFTCard
                        {...item}
                        onBuy={() => handleBuyNFT(item)}
                        viewMode={viewMode}
                      />
                      {buying === item.tokenId && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        >
                          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl text-center border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                            <FiRefreshCw className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
                            <p className="text-lg font-semibold">processing purchase...</p>
                            <p className="text-gray-600 mt-2">confirming transaction on base network</p>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
                </>
              )}

              {currentView === 'create' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <NFTCreator />
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
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <FrameDiscovery />
              <SocialProofWidget />
              <SocialProofFeed showRecentActivity={true} showLiveUsers={false} showTrending={false} />
            </div>
          </div>
        </div>

        {/* Engagement Systems */}
        <UserEngagementSystem
          userActions={userActions}
          isConnected={isConnected}
          nftsViewed={nftsViewed}
          nftsPurchased={nftsPurchased}
        />

        {/* XMTP Chat Integration */}
        <ChatLauncher 
          nftId={filteredItems.length > 0 ? filteredItems[0]?.tokenId : undefined}
          nftName={filteredItems.length > 0 ? filteredItems[0]?.name : undefined}
        />
      </div>
    </UserProgressTracker>
  )
}