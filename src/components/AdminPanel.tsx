'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiShield, 
  FiUsers, 
  FiTrendingUp, 
  FiDollarSign,
  FiSettings,
  FiDatabase,
  FiActivity,
  FiAlertCircle,
  FiCheckCircle,
  FiX,
  FiRefreshCw,
  FiDownload,
  FiUpload
} from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { LiveNFTModal } from './LiveNFTModal'
import { HubProviderManager } from './HubProviderManager'
import { HubConfigModal } from './HubConfigModal'

// Admin wallet address
const ADMIN_ADDRESS = '0xcaA2dC702DdF5625296d42aa13B37458d29d2e49'

interface AdminStats {
  totalNFTs: number
  totalUsers: number
  totalVolume: string
  activeListings: number
  pendingTransactions: number
  systemHealth: 'healthy' | 'warning' | 'critical'
}

export function AdminPanel() {
  const { address, isConnected } = useAccount()
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'nfts' | 'live-data' | 'hub-config' | 'users' | 'settings'>('overview')
  const [showLiveNFTModal, setShowLiveNFTModal] = useState(false)
  const [showHubConfigModal, setShowHubConfigModal] = useState(false)
  const [stats, setStats] = useState<AdminStats>({
    totalNFTs: 156,
    totalUsers: 1247,
    totalVolume: '45.8',
    activeListings: 89,
    pendingTransactions: 3,
    systemHealth: 'healthy'
  })

  // Check if connected wallet is admin
  useEffect(() => {
    if (isConnected && address) {
      const isAdminWallet = address.toLowerCase() === ADMIN_ADDRESS.toLowerCase()
      setIsAdmin(isAdminWallet)
      
      if (isAdminWallet) {
        toast.success('🔐 Admin access granted!', {
          duration: 3000,
          position: 'top-center',
        })
      }
    } else {
      setIsAdmin(false)
    }
  }, [address, isConnected])

  if (!isAdmin) {
    return null // Hide admin panel if not admin
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiActivity },
    { id: 'nfts', label: 'NFT Management', icon: FiDatabase },
    { id: 'live-data', label: 'Live NFT Data', icon: FiTrendingUp },
    { id: 'hub-config', label: 'Hub Config', icon: FiSettings },
    { id: 'users', label: 'Users', icon: FiUsers },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ]

  const refreshStats = () => {
    toast.success('Stats refreshed!')
    // In production, fetch real data from API
    setStats(prev => ({
      ...prev,
      totalUsers: prev.totalUsers + Math.floor(Math.random() * 10),
      activeListings: prev.activeListings + Math.floor(Math.random() * 5)
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 right-4 z-50 w-96 max-h-[80vh] overflow-hidden"
    >
      {/* Admin Badge */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-t-2xl flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-2">
          <FiShield className="w-5 h-5" />
          <span className="font-bold">Admin Panel</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={refreshStats}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            title="Refresh stats"
          >
            <FiRefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-x border-gray-200 dark:border-gray-700 flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-3 py-3 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-b-2 border-purple-600'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4 mx-auto mb-1" />
            <div className="hidden sm:block">{tab.label.split(' ')[0]}</div>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 border-x border-b border-gray-200 dark:border-gray-700 rounded-b-2xl p-4 max-h-[60vh] overflow-y-auto shadow-xl">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* System Health */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">System Health</span>
                  <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 capitalize">
                  {stats.systemHealth}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total NFTs</div>
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{stats.totalNFTs}</div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-xl border border-purple-200 dark:border-purple-800">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Users</div>
                  <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{stats.totalUsers}</div>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl border border-indigo-200 dark:border-indigo-800">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Volume</div>
                  <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{stats.totalVolume} ETH</div>
                </div>

                <div className="bg-pink-50 dark:bg-pink-900/20 p-3 rounded-xl border border-pink-200 dark:border-pink-800">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Listings</div>
                  <div className="text-xl font-bold text-pink-600 dark:text-pink-400">{stats.activeListings}</div>
                </div>
              </div>

              {/* Pending Actions */}
              {stats.pendingTransactions > 0 && (
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiAlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Pending Actions</span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {stats.pendingTransactions} transactions awaiting confirmation
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'nfts' && (
            <motion.div
              key="nfts"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3">NFT Management</h3>
              
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2">
                <FiUpload className="w-4 h-4" />
                <span>Bulk Upload NFTs</span>
              </button>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2">
                <FiDownload className="w-4 h-4" />
                <span>Export NFT Data</span>
              </button>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Quick Actions</div>
                
                <button className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 rounded-lg text-sm font-medium transition-colors">
                  Feature NFT
                </button>

                <button className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 rounded-lg text-sm font-medium transition-colors">
                  Moderate Listings
                </button>

                <button className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 rounded-lg text-sm font-medium transition-colors">
                  View Flagged Items
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'live-data' && (
            <motion.div
              key="live-data"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3">Live NFT Data</h3>
              
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiTrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-semibold text-gray-800 dark:text-gray-200">Alchemy Integration</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Fetch real NFT data from Ethereum mainnet using Alchemy API
                  </p>
                  <div className="flex space-x-2">
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-xs font-medium">
                      API Connected
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-xs font-medium">
                      Live Data
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setShowLiveNFTModal(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
                >
                  <FiDatabase className="w-4 h-4" />
                  <span>Open Live NFT Manager</span>
                </button>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Stats</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white dark:bg-gray-600 p-2 rounded">
                      <div className="text-gray-500 dark:text-gray-400">Popular Collections</div>
                      <div className="font-bold text-purple-600 dark:text-purple-400">8</div>
                    </div>
                    <div className="bg-white dark:bg-gray-600 p-2 rounded">
                      <div className="text-gray-500 dark:text-gray-400">API Calls Today</div>
                      <div className="font-bold text-blue-600 dark:text-blue-400">247</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'hub-config' && (
            <motion.div
              key="hub-config"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3">Farcaster Hub Configuration</h3>
              
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiAlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <span className="font-semibold text-gray-800 dark:text-gray-200">Migration Required</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Your current hub (nemes.farcaster.xyz) is deprecated. Migrate to a modern provider.
                  </p>
                  <div className="flex space-x-2">
                    <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-xs font-medium">
                      ⚠️ Deprecated Hub
                    </div>
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-xs font-medium">
                      Free Migration Available
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setShowHubConfigModal(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
                >
                  <FiSettings className="w-4 h-4" />
                  <span>Configure Hub Providers</span>
                </button>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recommended Providers</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white dark:bg-gray-600 p-2 rounded">
                      <div className="text-gray-500 dark:text-gray-400">Pinata Hub</div>
                      <div className="font-bold text-green-600 dark:text-green-400">Free & Reliable</div>
                    </div>
                    <div className="bg-white dark:bg-gray-600 p-2 rounded">
                      <div className="text-gray-500 dark:text-gray-400">Neynar Hub</div>
                      <div className="font-bold text-blue-600 dark:text-blue-400">Feature Rich</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3">User Management</h3>

              <div className="space-y-2">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Total Registered</div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stats.totalUsers}</div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Active Today</div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">342</div>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <button className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 rounded-lg text-sm font-medium transition-colors">
                  View All Users
                </button>

                <button className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 rounded-lg text-sm font-medium transition-colors">
                  Banned Users
                </button>

                <button className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 rounded-lg text-sm font-medium transition-colors">
                  User Reports
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3">Platform Settings</h3>

              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Maintenance Mode</span>
                    <input type="checkbox" className="toggle" />
                  </label>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">New Registrations</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </label>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-Moderation</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </label>
                </div>
              </div>

              <div className="pt-3 space-y-2">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                  Save Settings
                </button>

                <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                  Clear Cache
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Live NFT Modal */}
      <LiveNFTModal 
        isOpen={showLiveNFTModal} 
        onClose={() => setShowLiveNFTModal(false)} 
      />

      {/* Hub Config Modal */}
      <HubConfigModal 
        isOpen={showHubConfigModal} 
        onClose={() => setShowHubConfigModal(false)} 
      />
    </motion.div>
  )
}
