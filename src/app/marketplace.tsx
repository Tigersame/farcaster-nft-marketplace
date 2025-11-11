'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { NFTCard } from '@/components/NFTCard'
import SignInWithBase from '@/components/SignInWithBase'
import SpendPermissionSetup from '@/components/SpendPermissionSetup'
import SpendPermissionManager from '@/components/SpendPermissionManager'
import ChatInterface from '@/components/ChatInterface'
import { useAccount, useBalance, useEnsName } from 'wagmi'
import { base } from 'viem/chains'
import { Name, Avatar, Identity, Address } from '@coinbase/onchainkit/identity'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useBaseNFTs } from '@/hooks/useBaseNFTs'
import { useVerifiedNFTs, useNFTsByCategory } from '@/hooks/useMultiContractNFTs'
import { BASE_NFT_CONTRACTS, getContractsByCategory } from '@/lib/nftContracts'
import { 
  FiGrid, 
  FiTrendingUp, 
  FiShoppingBag, 
  FiHeart, 
  FiClock, 
  FiUser,
  FiRefreshCw,
  FiZap,
  FiDollarSign,
  FiShoppingCart,
  FiPackage,
  FiPlusCircle,
  FiSearch,
  FiStar,
  FiActivity,
  FiBarChart2,
  FiCopy,
  FiExternalLink,
  FiMail,
  FiGlobe
} from 'react-icons/fi'

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
  const router = useRouter()
  
  // Collection selection state
  const [selectedCollection, setSelectedCollection] = useState<'all' | string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  
  // Fetch NFTs based on selection (reduced limits to avoid rate limiting)
  const { nfts: verifiedNFTs, loading: verifiedLoading } = useVerifiedNFTs(60)
  const { nfts: categoryNFTs, loading: categoryLoading } = useNFTsByCategory(selectedCategory || 'Gaming', 30)
  const { nfts: singleCollectionNFTs, loading: singleLoading, hasMore, loadMore } = useBaseNFTs(
    selectedCollection !== 'all' ? selectedCollection : ''
  )
  
  const [marketItems, setMarketItems] = useState<NFTItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState('all')
  const [copied, setCopied] = useState(false)

  // Mint form state
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [nftName, setNftName] = useState('')
  const [nftDescription, setNftDescription] = useState('')
  const [nftPrice, setNftPrice] = useState('')
  const [nftSupply, setNftSupply] = useState('1')

  // AI Agent State
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authAddress, setAuthAddress] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState(false)
  const [aiAgentStep, setAiAgentStep] = useState<'signin' | 'permission' | 'chat'>('signin')

  // Wallet integration
  const { address, isConnected, chain } = useAccount()
  const { data: balance } = useBalance({ address, chainId: base.id })

  // Load NFTs from Base chain based on selection
  useEffect(() => {
    let nftsToDisplay: any[] = []
    let isLoading = false

    if (selectedCollection === 'all') {
      nftsToDisplay = verifiedNFTs
      isLoading = verifiedLoading
    } else if (selectedCategory) {
      nftsToDisplay = categoryNFTs
      isLoading = categoryLoading
    } else {
      nftsToDisplay = singleCollectionNFTs
      isLoading = singleLoading
    }

    if (!isLoading && nftsToDisplay.length > 0) {
      const transformedNFTs: NFTItem[] = nftsToDisplay.map(nft => ({
        tokenId: nft.tokenId,
        name: nft.name,
        description: nft.description || (nft as any).contractName || '',
        image: nft.image,
        price: nft.price || '3800000000000000',
        seller: nft.contractAddress,
        owner: nft.contractAddress,
        ethPrice: nft.ethPrice || '0.0038',
        listedAt: new Date().toISOString(),
      }))
      setMarketItems(transformedNFTs)
      setLoading(false)
    } else if (!isLoading && nftsToDisplay.length === 0) {
      setMarketItems([])
      setLoading(false)
    } else {
      setLoading(isLoading)
    }
  }, [verifiedNFTs, categoryNFTs, singleCollectionNFTs, selectedCollection, selectedCategory, verifiedLoading, categoryLoading, singleLoading])

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }
  
  // Check for existing session on mount
  useEffect(() => {
    const session = localStorage.getItem('auth_session')
    const savedAddress = localStorage.getItem('auth_address')
    const permission = localStorage.getItem('spendPermission')
    
    if (session && savedAddress) {
      setIsAuthenticated(true)
      setAuthAddress(savedAddress)
      setAiAgentStep('permission')
      
      if (permission) {
        setHasPermission(true)
        setAiAgentStep('chat')
      }
    }
  }, [])

  const handleSignIn = (address: string) => {
    setIsAuthenticated(true)
    setAuthAddress(address)
    setAiAgentStep('permission')
  }

  const handlePermissionGranted = (permission: any) => {
    setHasPermission(true)
    setAiAgentStep('chat')
  }
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading || verifiedLoading || categoryLoading || singleLoading) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading NFTs from Base chain...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] transition-colors duration-300">
      {/* Vertical Sidebar - Scrollable (Wallet button moved to header) */}
      <aside className="fixed left-0 top-0 h-screen w-20 bg-gray-950 border-r border-gray-800 flex flex-col items-center py-6 z-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        
        <div className="space-y-4">
          {/* All NFTs */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveView('all')}
            className={`p-3 rounded-xl transition-all ${
              activeView === 'all'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            title="All NFTs"
          >
            <FiGrid className="w-6 h-6" />
          </motion.button>

          {/* Swap */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveView('swap')}
            className={`p-3 rounded-xl transition-all ${
              activeView === 'swap'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            title="Swap Tokens"
          >
            <FiRefreshCw className="w-6 h-6" />
          </motion.button>

          {/* Mint */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveView('mint')}
            className={`p-3 rounded-xl transition-all ${
              activeView === 'mint'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            title="Mint NFT"
          >
            <FiZap className="w-6 h-6" />
          </motion.button>

          {/* Buy */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveView('buy')}
            className={`p-3 rounded-xl transition-all ${
              activeView === 'buy'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            title="Buy NFTs"
          >
            <FiShoppingCart className="w-6 h-6" />
          </motion.button>

          {/* Sell */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveView('sell')}
            className={`p-3 rounded-xl transition-all ${
              activeView === 'sell'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            title="Sell NFTs"
          >
            <FiDollarSign className="w-6 h-6" />
          </motion.button>

          {/* Trending */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveView('trending')}
            className={`p-3 rounded-xl transition-all ${
              activeView === 'trending'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            title="Trending"
          >
            <FiTrendingUp className="w-6 h-6" />
          </motion.button>

          {/* Collections */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveView('collections')}
            className={`p-3 rounded-xl transition-all ${
              activeView === 'collections'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            title="Collections"
          >
            <FiShoppingBag className="w-6 h-6" />
          </motion.button>

          {/* Portfolio */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveView('portfolio')}
            className={`p-3 rounded-xl transition-all ${
              activeView === 'portfolio'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            title="My Portfolio"
          >
            <FiPackage className="w-6 h-6" />
          </motion.button>

          {/* Activity */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveView('activity')}
            className={`p-3 rounded-xl transition-all ${
              activeView === 'activity'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            title="Activity Feed"
          >
            <FiActivity className="w-6 h-6" />
          </motion.button>

          {/* Favorites */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveView('favorites')}
            className={`p-3 rounded-xl transition-all ${
              activeView === 'favorites'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            title="Favorites"
          >
            <FiHeart className="w-6 h-6" />
          </motion.button>

          {/* Search */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveView('search')}
            className={`p-3 rounded-xl transition-all ${
              activeView === 'search'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            title="Search"
          >
            <FiSearch className="w-6 h-6" />
          </motion.button>

          {/* Featured */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveView('featured')}
            className={`p-3 rounded-xl transition-all ${
              activeView === 'featured'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            title="Featured"
          >
            <FiStar className="w-6 h-6" />
          </motion.button>

          {/* Analytics */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveView('analytics')}
            className={`p-3 rounded-xl transition-all ${
              activeView === 'analytics'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            title="Analytics"
          >
            <FiBarChart2 className="w-6 h-6" />
          </motion.button>

          {/* Recent */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveView('recent')}
            className={`p-3 rounded-xl transition-all ${
              activeView === 'recent'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            title="Recent Activity"
          >
            <FiClock className="w-6 h-6" />
          </motion.button>
        </div>
      </aside>

      {/* Main Content with left margin for wider sidebar (240px) */}
      <div className="ml-60">
        <Header />
        
        {/* Hero Banner - Collection Info */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-6">
              {/* Collection Avatar */}
              <div className="hidden sm:flex w-32 h-32 rounded-2xl bg-blue-600/20 backdrop-blur-sm border-4 border-blue-500/30 items-center justify-center text-6xl">
                🎨
              </div>
              
              {/* Collection Info */}
              <div className="flex-1">
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
                  Base NFT Marketplace
                </h1>
                <p className="text-gray-300 text-lg mb-6 max-w-2xl">
                  Discover and collect NFTs from verified Base chain collections
                </p>
                
                {/* Collection Selector */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <button
                    onClick={() => { setSelectedCollection('all'); setSelectedCategory(null); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCollection === 'all' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    All Collections
                  </button>
                  {BASE_NFT_CONTRACTS.slice(0, 5).map(contract => (
                    <button
                      key={contract.address}
                      onClick={() => { setSelectedCollection(contract.address); setSelectedCategory(null); }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCollection === contract.address 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {contract.name}
                    </button>
                  ))}
                </div>

                {/* View Full Collection Page Button */}
                {selectedCollection !== 'all' && (
                  <motion.button
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => router.push(`/collection/${selectedCollection}`)}
                    className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <FiExternalLink className="w-4 h-4" />
                    View Full Collection Page
                  </motion.button>
                )}
                
                {/* Collection Stats */}
                <div className="flex flex-wrap gap-6 sm:gap-8">
                  <div>
                    <div className="text-2xl font-bold text-white">{marketItems.length}</div>
                    <div className="text-sm text-gray-400">items</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {marketItems.reduce((sum, item) => sum + parseFloat(item.ethPrice), 0).toFixed(1)} ETH
                    </div>
                    <div className="text-sm text-gray-400">total volume</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {(marketItems.reduce((sum, item) => sum + parseFloat(item.ethPrice), 0) / marketItems.length).toFixed(2)} ETH
                    </div>
                    <div className="text-sm text-gray-400">floor price</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{marketItems.length}</div>
                    <div className="text-sm text-gray-400">owners</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* All NFTs View - Default */}
        {activeView === 'all' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5"
          >
            {marketItems.map((item, index) => (
              <motion.div
                key={item.tokenId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <NFTCard {...item} onBuy={() => console.log('Buy clicked')} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Load More Button */}
        {activeView === 'all' && hasMore && !singleLoading && selectedCollection !== 'all' && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
            >
              Load More NFTs
            </button>
          </div>
        )}

        {/* Loading indicator for pagination */}
        {(singleLoading && marketItems.length > 0) && (
          <div className="flex justify-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        )}

        {/* AI Agent Swap View with Spend Permissions */}
        {activeView === 'swap' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid md:grid-cols-3 gap-6">
              {/* Main Chat Interface - Takes 2 columns */}
              <div className="md:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">AI Agent</h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Buy creator coins with natural language
                      </p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-sm font-medium">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span>Base Network</span>
                    </div>
                  </div>

                  {/* Step-by-step flow */}
                  {!isAuthenticated ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-400 mb-2">
                          Step 1: Sign In with Base
                        </h3>
                        <p className="text-sm text-blue-800 dark:text-blue-300 mb-4">
                          Authenticate securely using Sign-In with Ethereum (SIWE) to enable AI agent capabilities.
                        </p>
                      </div>
                      <SignInWithBase onSignIn={handleSignIn} />
                    </div>
                  ) : !hasPermission ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20">
                        <div>
                          <h3 className="text-sm font-semibold text-green-900 dark:text-green-400">
                            ✓ Authenticated
                          </h3>
                          <p className="text-xs text-green-800 dark:text-green-300">
                            {authAddress?.slice(0, 6)}...{authAddress?.slice(-4)}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-400 mb-2">
                          Step 2: Set Spending Limit
                        </h3>
                        <p className="text-sm text-blue-800 dark:text-blue-300 mb-4">
                          Grant the AI agent permission to spend up to a daily limit for autonomous transactions.
                        </p>
                      </div>
                      
                      {authAddress && (
                        <SpendPermissionSetup
                          userAddress={authAddress}
                          onPermissionGranted={handlePermissionGranted}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20">
                          <div className="text-sm font-semibold text-green-900 dark:text-green-400 mb-1">
                            ✓ Authenticated
                          </div>
                          <p className="text-xs text-green-800 dark:text-green-300">
                            {authAddress?.slice(0, 6)}...{authAddress?.slice(-4)}
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20">
                          <div className="text-sm font-semibold text-green-900 dark:text-green-400 mb-1">
                            ✓ Permission Granted
                          </div>
                          <p className="text-xs text-green-800 dark:text-green-300">
                            AI agent ready
                          </p>
                        </div>
                      </div>

                      {authAddress && (
                        <ChatInterface
                          userAddress={authAddress}
                          hasPermission={hasPermission}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Sidebar - Permission Management */}
              <div className="space-y-6">
                {/* How it Works */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    How It Works
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">1</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Sign In</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Authenticate with Base Account
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">2</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Set Limit</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Grant daily spending permission
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">3</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Chat & Buy</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          AI executes purchases for you
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Features
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <FiZap className="text-yellow-500" />
                      <span>Gas-free transactions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <FiDollarSign className="text-green-500" />
                      <span>Daily spending limits</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <FiRefreshCw className="text-blue-500" />
                      <span>Revoke anytime</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <FiActivity className="text-purple-500" />
                      <span>Natural language trading</span>
                    </div>
                  </div>
                </div>

                {/* Permission Manager */}
                {isAuthenticated && authAddress && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <SpendPermissionManager
                      isAuthenticated={isAuthenticated}
                      userAddress={authAddress}
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Mint View */}
        {activeView === 'mint' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <h2 className="text-3xl font-bold text-white mb-2">Mint Portal</h2>
              <p className="text-gray-400 mb-8">Create and mint your own NFTs on Base network</p>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Upload Area */}
                <div>
                  <input
                    type="file"
                    id="nft-image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="bg-gray-900 rounded-xl p-8 border-2 border-dashed border-gray-700 hover:border-blue-500 transition-colors cursor-pointer mb-4"
                  >
                    <label htmlFor="nft-image-upload" className="cursor-pointer block">
                      <div className="text-center">
                        {!imagePreview ? (
                          <>
                            <FiZap className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                            <p className="text-white font-medium mb-2">Drop your file here</p>
                            <p className="text-gray-500 text-sm mb-4">or click to browse</p>
                            <p className="text-gray-600 text-xs">PNG, JPG, GIF, SVG up to 10MB</p>
                          </>
                        ) : (
                          <>
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="max-h-48 mx-auto rounded-lg mb-4"
                            />
                            <p className="text-green-500 text-sm">✓ Image uploaded</p>
                            <p className="text-gray-500 text-xs mt-2">Click to change</p>
                          </>
                        )}
                      </div>
                    </label>
                  </div>
                  
                  {/* Preview */}
                  <div className="bg-gray-900 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-2">Preview</p>
                    <div className="aspect-square bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="NFT Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-600 text-4xl">🖼️</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text"
                      value={nftName}
                      onChange={(e) => setNftName(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" 
                      placeholder="e.g. Cosmic Explorer #001" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={nftDescription}
                      onChange={(e) => setNftDescription(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white h-32 focus:outline-none focus:border-blue-500 resize-none" 
                      placeholder="Tell the story behind your NFT..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Price (ETH) <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={nftPrice}
                        onChange={(e) => setNftPrice(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" 
                        placeholder="0.00" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Supply
                      </label>
                      <input 
                        type="number"
                        value={nftSupply}
                        onChange={(e) => setNftSupply(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" 
                        placeholder="1" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Properties
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500" 
                        placeholder="Trait (e.g. Color)" 
                      />
                      <input 
                        type="text" 
                        className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500" 
                        placeholder="Value (e.g. Blue)" 
                      />
                      <button className="bg-blue-600 hover:bg-blue-700 px-4 rounded-lg transition-colors">
                        <FiPlusCircle className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Mint Fees */}
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Platform Fee</span>
                      <span className="text-white">2.5%</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Gas Fee (est.)</span>
                      <span className="text-white">~$0.50</span>
                    </div>
                    <div className="border-t border-gray-800 mt-2 pt-2 flex justify-between">
                      <span className="text-white font-medium">You'll receive</span>
                      <span className="text-white font-bold">0.00 ETH</span>
                    </div>
                  </div>

                  {/* Mint Button */}
                  {isConnected ? (
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02]">
                      <div className="flex items-center justify-center gap-2">
                        <FiZap className="w-5 h-5" />
                        Mint NFT
                      </div>
                    </button>
                  ) : (
                    <ConnectButton.Custom>
                      {({ openConnectModal }) => (
                        <button 
                          onClick={openConnectModal}
                          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-xl transition-colors"
                        >
                          Connect Wallet to Mint
                        </button>
                      )}
                    </ConnectButton.Custom>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Buy View */}
        {activeView === 'buy' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <div className="col-span-full mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">Buy NFTs</h2>
              <p className="text-gray-400">Browse available NFTs for purchase</p>
            </div>
            {marketItems.map((item, index) => (
              <motion.div
                key={item.tokenId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <NFTCard {...item} onBuy={() => console.log('Buy clicked')} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Sell View */}
        {activeView === 'sell' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <h2 className="text-3xl font-bold text-white mb-6">Sell NFTs</h2>
              <p className="text-gray-400 mb-4">List your NFTs for sale</p>
              <div className="bg-gray-900 rounded-xl p-6 text-center">
                <FiDollarSign className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-gray-500">NFT listing interface coming soon...</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Trending View */}
        {activeView === 'trending' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <div className="col-span-full mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">🔥 Trending NFTs</h2>
              <p className="text-gray-400">Hot NFTs right now</p>
            </div>
            {marketItems.slice(0, 4).map((item, index) => (
              <motion.div
                key={item.tokenId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <NFTCard {...item} onBuy={() => console.log('Buy clicked')} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Collections View */}
        {activeView === 'collections' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-xl font-bold text-white mb-2">Art Collection</h3>
                <p className="text-gray-400 text-sm">{marketItems.length} items</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer">
                <div className="text-4xl mb-4">🌌</div>
                <h3 className="text-xl font-bold text-white mb-2">Space Series</h3>
                <p className="text-gray-400 text-sm">3 items</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer">
                <div className="text-4xl mb-4">💎</div>
                <h3 className="text-xl font-bold text-white mb-2">Premium</h3>
                <p className="text-gray-400 text-sm">5 items</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Portfolio View */}
        {activeView === 'portfolio' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">My Portfolio</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <p className="text-gray-400 text-sm mb-2">Total Value</p>
                <p className="text-3xl font-bold text-white">{marketItems.reduce((sum, item) => sum + parseFloat(item.ethPrice), 0).toFixed(2)} ETH</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <p className="text-gray-400 text-sm mb-2">NFTs Owned</p>
                <p className="text-3xl font-bold text-white">{marketItems.length}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <p className="text-gray-400 text-sm mb-2">Average Price</p>
                <p className="text-3xl font-bold text-white">{(marketItems.reduce((sum, item) => sum + parseFloat(item.ethPrice), 0) / marketItems.length).toFixed(2)} ETH</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {marketItems.map((item, index) => (
                <NFTCard key={item.tokenId} {...item} onBuy={() => console.log('View clicked')} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Activity View */}
        {activeView === 'activity' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Activity Feed</h2>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="space-y-4">
                {marketItems.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg">
                    <div className="text-2xl">🎨</div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-gray-400 text-sm">Listed for {item.ethPrice} ETH</p>
                    </div>
                    <p className="text-gray-500 text-sm">Just now</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Favorites View */}
        {activeView === 'favorites' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <div className="col-span-full mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">❤️ Favorites</h2>
              <p className="text-gray-400">Your favorite NFTs</p>
            </div>
            {marketItems.slice(0, 3).map((item, index) => (
              <motion.div
                key={item.tokenId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <NFTCard {...item} onBuy={() => console.log('Buy clicked')} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Search View */}
        {activeView === 'search' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Search NFTs</h2>
            <div className="mb-8">
              <input 
                type="text" 
                placeholder="Search by name, collection, or creator..." 
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-6 py-4 text-white text-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="text-center text-gray-500 py-12">
              <FiSearch className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Start searching for NFTs...</p>
            </div>
          </motion.div>
        )}

        {/* Featured View */}
        {activeView === 'featured' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <div className="col-span-full mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">⭐ Featured</h2>
              <p className="text-gray-400">Handpicked premium NFTs</p>
            </div>
            {marketItems.slice(0, 4).map((item, index) => (
              <motion.div
                key={item.tokenId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <NFTCard {...item} onBuy={() => console.log('Buy clicked')} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Analytics View */}
        {activeView === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">📊 Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <p className="text-gray-400 text-sm mb-2">Total Sales</p>
                <p className="text-2xl font-bold text-white">124</p>
                <p className="text-green-500 text-sm mt-2">+12% this week</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <p className="text-gray-400 text-sm mb-2">Volume</p>
                <p className="text-2xl font-bold text-white">{marketItems.reduce((sum, item) => sum + parseFloat(item.ethPrice), 0).toFixed(1)} ETH</p>
                <p className="text-green-500 text-sm mt-2">+8% this week</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <p className="text-gray-400 text-sm mb-2">Avg Price</p>
                <p className="text-2xl font-bold text-white">{(marketItems.reduce((sum, item) => sum + parseFloat(item.ethPrice), 0) / marketItems.length).toFixed(2)} ETH</p>
                <p className="text-blue-500 text-sm mt-2">Stable</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <p className="text-gray-400 text-sm mb-2">Holders</p>
                <p className="text-2xl font-bold text-white">{marketItems.length}</p>
                <p className="text-green-500 text-sm mt-2">+5 new</p>
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
              <FiBarChart2 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <p className="text-gray-400">Detailed analytics dashboard coming soon...</p>
            </div>
          </motion.div>
        )}

        {/* Recent View */}
        {activeView === 'recent' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">🕐 Recent Activity</h2>
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="divide-y divide-gray-700">
                {marketItems.map((item, index) => (
                  <div key={index} className="p-6 hover:bg-gray-750 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">🎨</div>
                      <div className="flex-1">
                        <p className="text-white font-semibold">{item.name}</p>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{item.ethPrice} ETH</p>
                        <p className="text-gray-500 text-sm">{new Date(item.listedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
      </div>
    </div>
  )
}