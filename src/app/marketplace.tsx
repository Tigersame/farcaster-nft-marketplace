'use client'

import { useState, useEffect } from 'react'
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
  const [marketItems, setMarketItems] = useState<NFTItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState('all')
  const [copied, setCopied] = useState(false)

  // AI Agent State
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authAddress, setAuthAddress] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState(false)
  const [aiAgentStep, setAiAgentStep] = useState<'signin' | 'permission' | 'chat'>('signin')

  // Wallet integration
  const { address, isConnected, chain } = useAccount()
  const { data: balance } = useBalance({ address, chainId: base.id })
  
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

  // Your own NFT data - customize this with your collection!
  useEffect(() => {
    const myNFTCollection: NFTItem[] = [
      {
        tokenId: '1',
        name: 'Cosmic Explorer #001',
        description: 'Journey through the digital cosmos with this unique piece.',
        image: '/api/placeholder/400/400',
        price: '3200000000000000000',
        seller: '0x742d35Cc6635Cc532A3Fdb1b4858b4c115D29E53',
        owner: '0x742d35Cc6635Cc532A3Fdb1b4858b4c115D29E53',
        ethPrice: '3.2',
        listedAt: new Date().toISOString(),
      },
      {
        tokenId: '2', 
        name: 'Digital Dreamer #042',
        description: 'Where reality meets imagination in the metaverse.',
        image: '/api/placeholder/400/400',
        price: '2800000000000000000',
        seller: '0x8ba1f109551bD432803012645Hac136c22C501e',
        owner: '0x8ba1f109551bD432803012645Hac136c22C501e',
        ethPrice: '2.8',
        listedAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        tokenId: '3',
        name: 'Neon Nights #099',
        description: 'Cyberpunk aesthetics meets blockchain technology.',
        image: '/api/placeholder/400/400', 
        price: '1900000000000000000',
        seller: '0x123f109551bD432803012645Hac136c22C789a',
        owner: '0x123f109551bD432803012645Hac136c22C789a',
        ethPrice: '1.9',
        listedAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        tokenId: '4',
        name: 'Abstract Vision #156',
        description: 'Generative art exploring the boundaries of perception.',
        image: '/api/placeholder/400/400',
        price: '2500000000000000000',
        seller: '0x456f109551bD432803012645Hac136c22C456b',
        owner: '0x456f109551bD432803012645Hac136c22C456b',
        ethPrice: '2.5',
        listedAt: new Date(Date.now() - 10800000).toISOString(),
      },
      {
        tokenId: '5',
        name: 'Ethereal Dreams #203',
        description: 'Floating through dimensions of digital consciousness.',
        image: '/api/placeholder/400/400',
        price: '4100000000000000000',
        seller: '0x789f109551bD432803012645Hac136c22C789c',
        owner: '0x789f109551bD432803012645Hac136c22C789c',
        ethPrice: '4.1',
        listedAt: new Date(Date.now() - 14400000).toISOString(),
      },
      {
        tokenId: '6',
        name: 'Quantum Flux #377',
        description: 'Capturing the essence of quantum entanglement in art.',
        image: '/api/placeholder/400/400',
        price: '1600000000000000000',
        seller: '0x321f109551bD432803012645Hac136c22C321d',
        owner: '0x321f109551bD432803012645Hac136c22C321d',
        ethPrice: '1.6',
        listedAt: new Date(Date.now() - 18000000).toISOString(),
      },
      {
        tokenId: '7',
        name: 'Crystal Cascade #445',
        description: 'Crystalline formations in a digital waterfall.',
        image: '/api/placeholder/400/400',
        price: '2200000000000000000',
        seller: '0xabc1f109551bD432803012645Hac136c22Cabc1',
        owner: '0xabc1f109551bD432803012645Hac136c22Cabc1',
        ethPrice: '2.2',
        listedAt: new Date(Date.now() - 21600000).toISOString(),
      },
      {
        tokenId: '8',
        name: 'Midnight Mirage #512',
        description: 'When darkness reveals hidden beauty.',
        image: '/api/placeholder/400/400',
        price: '3500000000000000000',
        seller: '0xdef2f109551bD432803012645Hac136c22Cdef2',
        owner: '0xdef2f109551bD432803012645Hac136c22Cdef2',
        ethPrice: '3.5',
        listedAt: new Date(Date.now() - 25200000).toISOString(),
      }
    ]
    
    setTimeout(() => {
      setMarketItems(myNFTCollection)
      setLoading(false)
    }, 500)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 transition-colors duration-300">
      {/* Vertical Sidebar - Scrollable */}
      <aside className="fixed left-0 top-0 h-screen w-20 bg-gray-950 border-r border-gray-800 flex flex-col items-center py-6 z-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {/* Wallet Connect Button at Top */}
        <div className="mb-6 w-full px-2">
          <ConnectButton.Custom>
            {({ account, chain, openConnectModal, mounted }) => {
              const connected = mounted && account && chain

              return (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openConnectModal}
                  className={`w-full p-3 rounded-xl transition-all ${
                    connected
                      ? 'bg-green-600 text-white shadow-lg shadow-green-500/50'
                      : 'bg-blue-600 text-white shadow-lg shadow-blue-500/50 animate-pulse'
                  }`}
                  title={connected ? 'Connected' : 'Connect Wallet'}
                >
                  {connected ? (
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-lg">✓</span>
                      </div>
                      <span className="text-[10px] font-medium">Connected</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-lg">👛</span>
                      </div>
                      <span className="text-[10px] font-medium">Connect</span>
                    </div>
                  )}
                </motion.button>
              )
            }}
          </ConnectButton.Custom>
        </div>

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

          {/* Create */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveView('create')}
            className={`p-3 rounded-xl transition-all ${
              activeView === 'create'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            title="Create NFT"
          >
            <FiPlusCircle className="w-6 h-6" />
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

          {/* Profile */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveView('profile')}
            className={`p-3 rounded-xl transition-all ${
              activeView === 'profile'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            title="Profile"
          >
            <FiUser className="w-6 h-6" />
          </motion.button>
        </div>
      </aside>

      {/* Main Content with left margin for sidebar */}
      <div className="ml-20">
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
                  My NFT Collection
                </h1>
                <p className="text-gray-300 text-lg mb-6 max-w-2xl">
                  Your unique digital art collection on Base chain. Each piece tells a story in the metaverse.
                </p>
                
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
                  <div className="bg-gray-900 rounded-xl p-8 border-2 border-dashed border-gray-700 hover:border-blue-500 transition-colors cursor-pointer mb-4">
                    <div className="text-center">
                      <FiZap className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                      <p className="text-white font-medium mb-2">Drop your file here</p>
                      <p className="text-gray-500 text-sm mb-4">or click to browse</p>
                      <p className="text-gray-600 text-xs">PNG, JPG, GIF, SVG up to 10MB</p>
                    </div>
                  </div>
                  
                  {/* Preview */}
                  <div className="bg-gray-900 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-2">Preview</p>
                    <div className="aspect-square bg-gray-800 rounded-lg flex items-center justify-center">
                      <span className="text-gray-600 text-4xl">🖼️</span>
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
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" 
                      placeholder="e.g. Cosmic Explorer #001" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea 
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

        {/* Create View */}
        {activeView === 'create' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <h2 className="text-3xl font-bold text-white mb-6">Create NFT</h2>
              <p className="text-gray-400 mb-6">Upload your artwork and create NFT</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" placeholder="NFT Name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white h-24" placeholder="Describe your NFT"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price (ETH)</label>
                  <input type="number" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" placeholder="0.00" />
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
                  Create NFT
                </button>
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

        {/* Profile View */}
        {activeView === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="max-w-5xl mx-auto">
              {/* Profile Header with Basename Integration */}
              <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-1 mb-8">
                <div className="bg-gray-800 rounded-xl p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                    {/* Avatar with Basename */}
                    <div className="relative">
                      {isConnected && address ? (
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg shadow-blue-500/50">
                          <Avatar address={address as `0x${string}`} chain={base} className="w-full h-full" />
                        </div>
                      ) : (
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-5xl border-4 border-blue-400">
                          👤
                        </div>
                      )}
                      {isConnected && (
                        <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-gray-800 flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1">
                      <div className="mb-4">
                        {isConnected && address ? (
                          <>
                            <div className="mb-3">
                              <Name 
                                address={address as `0x${string}`} 
                                chain={base}
                                className="text-3xl font-bold text-white"
                              />
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                              <Address 
                                address={address as `0x${string}`}
                                className="text-gray-400 font-mono text-sm"
                              />
                              <button
                                onClick={() => address && copyToClipboard(address)}
                                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                title="Copy address"
                              >
                                <FiCopy className={`w-4 h-4 ${copied ? 'text-green-500' : 'text-gray-400'}`} />
                              </button>
                              <a
                                href={`https://basescan.org/address/${address}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                title="View on BaseScan"
                              >
                                <FiExternalLink className="w-4 h-4 text-gray-400" />
                              </a>
                            </div>
                          </>
                        ) : (
                          <>
                            <h2 className="text-3xl font-bold text-white mb-2">Your Profile</h2>
                            <p className="text-gray-400">Connect wallet to view your profile</p>
                          </>
                        )}
                      </div>

                      {/* Network & Chain Info */}
                      {isConnected && (
                        <div className="flex flex-wrap gap-3">
                          <div className="bg-gray-900 px-4 py-2 rounded-lg border border-gray-700">
                            <span className="text-gray-400 text-xs">Network</span>
                            <p className="text-white font-semibold">{chain?.name || 'Unknown'}</p>
                          </div>
                          <div className="bg-gray-900 px-4 py-2 rounded-lg border border-gray-700">
                            <span className="text-gray-400 text-xs">Chain ID</span>
                            <p className="text-white font-semibold">{chain?.id || 'N/A'}</p>
                          </div>
                          <div className="bg-gray-900 px-4 py-2 rounded-lg border border-gray-700">
                            <span className="text-gray-400 text-xs">Status</span>
                            <p className="text-green-500 font-semibold flex items-center gap-2">
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                              Connected
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Wallet Balance & Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <FiDollarSign className="w-5 h-5 text-blue-500" />
                        </div>
                        <span className="text-gray-400 text-sm">Balance</span>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {balance ? parseFloat(balance.formatted).toFixed(4) : '0.00'} {balance?.symbol || 'ETH'}
                      </p>
                    </div>
                    
                    <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <FiPackage className="w-5 h-5 text-purple-500" />
                        </div>
                        <span className="text-gray-400 text-sm">NFTs Owned</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{marketItems.length}</p>
                    </div>
                    
                    <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <FiTrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <span className="text-gray-400 text-sm">Total Value</span>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {marketItems.reduce((sum, item) => sum + parseFloat(item.ethPrice), 0).toFixed(2)} ETH
                      </p>
                    </div>
                    
                    <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                          <FiShoppingBag className="w-5 h-5 text-pink-500" />
                        </div>
                        <span className="text-gray-400 text-sm">Collections</span>
                      </div>
                      <p className="text-2xl font-bold text-white">3</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Details Section */}
              {isConnected && address && (
                <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 mb-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <FiUser className="w-6 h-6" />
                    Account Details
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Full Address */}
                    <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
                      <label className="text-gray-400 text-sm mb-2 block">Wallet Address</label>
                      <div className="flex items-center justify-between gap-4">
                        <code className="text-white font-mono text-sm flex-1 break-all">{address}</code>
                        <button
                          onClick={() => copyToClipboard(address)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          <FiCopy className="w-4 h-4" />
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    {/* Basename */}
                    <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
                      <label className="text-gray-400 text-sm mb-2 block">Basename</label>
                      <Identity
                        address={address as `0x${string}`}
                        chain={base}
                        schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
                      >
                        <Name className="text-white text-lg font-semibold" />
                      </Identity>
                    </div>

                    {/* Chain Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
                        <label className="text-gray-400 text-sm mb-2 block">Network</label>
                        <p className="text-white font-semibold">{chain?.name || 'Not Connected'}</p>
                      </div>
                      <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
                        <label className="text-gray-400 text-sm mb-2 block">Chain ID</label>
                        <p className="text-white font-semibold">{chain?.id || 'N/A'}</p>
                      </div>
                    </div>

                    {/* External Links */}
                    <div className="flex flex-wrap gap-3 pt-4">
                      <a
                        href={`https://basescan.org/address/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-700 rounded-lg text-white transition-colors border border-gray-700"
                      >
                        <FiExternalLink className="w-4 h-4" />
                        View on BaseScan
                      </a>
                      <a
                        href={`https://opensea.io/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-700 rounded-lg text-white transition-colors border border-gray-700"
                      >
                        <FiGlobe className="w-4 h-4" />
                        View on OpenSea
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* NFT Portfolio */}
              <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <FiPackage className="w-6 h-6" />
                  Your NFTs
                </h3>
                
                {marketItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {marketItems.map((item) => (
                      <NFTCard key={item.tokenId} {...item} onBuy={() => console.log('View clicked')} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <p className="text-gray-400 text-lg">No NFTs found in your collection</p>
                    <button 
                      onClick={() => setActiveView('buy')}
                      className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-colors"
                    >
                      Browse Marketplace
                    </button>
                  </div>
                )}
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