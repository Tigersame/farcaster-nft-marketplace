'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  FiHome,
  FiSearch,
  FiShoppingBag,
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiSettings,
  FiGrid,
  FiList,
  FiFilter,
  FiStar,
  FiHeart,
  FiBookmark,
  FiZap,
  FiRefreshCw,
  FiPlus,
  FiEye,
  FiUpload,
  FiDownload,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiRepeat,
  FiCreditCard,
  FiActivity,
  FiBarChart,
  FiPieChart,
  FiTarget,
  FiAward,
  FiGift,
  FiShield,
  FiMoon,
  FiSun,
  FiGlobe,
  FiMessageSquare,
  FiMail,
  FiPhone,
  FiInfo,
  FiHelpCircle,
  FiChevronRight,
  FiChevronLeft,
  FiMenu,
  FiX,
  FiMinimize2,
  FiMaximize2
} from 'react-icons/fi'
import { useTheme } from '@/contexts/ThemeContext'

interface SidebarProps {
  currentView: string
  setCurrentView: (view: string) => void
  isConnected: boolean
  onFilterChange?: (filters: any) => void
  onViewModeChange?: (mode: 'grid' | 'list') => void
  viewMode?: 'grid' | 'list'
}

interface NavigationItem {
  id: string
  label: string
  icon: any
  color: string
  category: 'main' | 'trading' | 'create' | 'discover' | 'tools' | 'settings'
  description?: string
  requiresWallet?: boolean
  badge?: string | number
  isNew?: boolean
}

export function VerticalSidebar({ 
  currentView, 
  setCurrentView, 
  isConnected,
  onFilterChange,
  onViewModeChange,
  viewMode = 'grid'
}: SidebarProps) {
  const { isDarkMode, toggleDarkMode } = useTheme()
  const { address } = useAccount()
  const [isCollapsed, setIsCollapsed] = useState(false) // Always keep expanded
  const [isMinimized, setIsMinimized] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all') // Show all categories by default
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState(3)

  const navigationItems: NavigationItem[] = [
    // Main Navigation
    { id: 'marketplace', label: 'Marketplace', icon: FiHome, color: 'blue', category: 'main', description: 'Browse all NFTs' },
    { id: 'trending', label: 'Trending', icon: FiTrendingUp, color: 'green', category: 'main', description: 'Hot NFTs right now', badge: 'HOT' },
    { id: 'collections', label: 'Collections', icon: FiGrid, color: 'purple', category: 'main', description: 'Featured collections' },
    { id: 'activity', label: 'Activity', icon: FiActivity, color: 'orange', category: 'main', description: 'Recent transactions', badge: notifications },
    
    // Trading & Finance
    { id: 'swap', label: 'Swap Tokens', icon: FiRepeat, color: 'indigo', category: 'trading', description: 'Exchange cryptocurrencies', isNew: true },
    { id: 'buy', label: 'Buy NFTs', icon: FiShoppingBag, color: 'emerald', category: 'trading', description: 'Purchase NFTs' },
    { id: 'sell', label: 'Sell NFTs', icon: FiDollarSign, color: 'yellow', category: 'trading', description: 'List your NFTs' },
    { id: 'portfolio', label: 'Portfolio', icon: FiPieChart, color: 'pink', category: 'trading', description: 'Your NFT collection', requiresWallet: true },
    { id: 'wallet', label: 'Wallet', icon: FiCreditCard, color: 'cyan', category: 'trading', description: 'Manage funds', requiresWallet: true },
    
    // Create & Mint
    { id: 'mint', label: 'Mint NFT', icon: FiPlus, color: 'rose', category: 'create', description: 'Create new NFTs', requiresWallet: true },
    { id: 'create-collection', label: 'Create Collection', icon: FiUpload, color: 'violet', category: 'create', description: 'Launch collection', requiresWallet: true },
    { id: 'bulk-mint', label: 'Bulk Mint', icon: FiZap, color: 'amber', category: 'create', description: 'Mint multiple NFTs', requiresWallet: true },
    
    // Discover & Search
    { id: 'search', label: 'Search', icon: FiSearch, color: 'slate', category: 'discover', description: 'Find specific NFTs' },
    { id: 'explore', label: 'Explore', icon: FiGlobe, color: 'teal', category: 'discover', description: 'Discover new projects' },
    { id: 'favorites', label: 'Favorites', icon: FiHeart, color: 'red', category: 'discover', description: 'Your liked NFTs', requiresWallet: true },
    { id: 'watchlist', label: 'Watchlist', icon: FiBookmark, color: 'blue', category: 'discover', description: 'Saved for later', requiresWallet: true },
    { id: 'analytics', label: 'Analytics', icon: FiBarChart, color: 'gray', category: 'discover', description: 'Market insights' },
    
    // Tools & Utilities
    { id: 'filters', label: 'Advanced Filters', icon: FiFilter, color: 'indigo', category: 'tools', description: 'Refine your search' },
    { id: 'price-alerts', label: 'Price Alerts', icon: FiTarget, color: 'orange', category: 'tools', description: 'Track price changes', requiresWallet: true },
    { id: 'history', label: 'Transaction History', icon: FiList, color: 'green', category: 'tools', description: 'Your trade history', requiresWallet: true },
    { id: 'rewards', label: 'Rewards', icon: FiAward, color: 'yellow', category: 'tools', description: 'Earn loyalty points', badge: 'NEW' },
    { id: 'referrals', label: 'Referrals', icon: FiGift, color: 'pink', category: 'tools', description: 'Invite friends' },
    
    // Settings & Support
    { id: 'settings', label: 'Settings', icon: FiSettings, color: 'gray', category: 'settings', description: 'App preferences' },
    { id: 'help', label: 'Help Center', icon: FiHelpCircle, color: 'blue', category: 'settings', description: 'Get support' },
    { id: 'contact', label: 'Contact Us', icon: FiMail, color: 'green', category: 'settings', description: 'Reach out to us' },
    { id: 'about', label: 'About', icon: FiInfo, color: 'purple', category: 'settings', description: 'Learn more' }
  ]

  const categories = [
    { id: 'main', label: 'Main', icon: FiHome },
    { id: 'trading', label: 'Trading', icon: FiDollarSign },
    { id: 'create', label: 'Create', icon: FiPlus },
    { id: 'discover', label: 'Discover', icon: FiSearch },
    { id: 'tools', label: 'Tools', icon: FiZap },
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ]

  const filteredItems = navigationItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch = item.label.toLowerCase().includes(searchQuery.toLowerCase())
    const hasAccess = !item.requiresWallet || isConnected
    return matchesCategory && matchesSearch && hasAccess
  })

  const handleItemClick = (item: NavigationItem) => {
    if (item.requiresWallet && !isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    setCurrentView(item.id)
    
    // Handle special actions
    switch (item.id) {
      case 'swap':
        toast.success('Opening Token Swap Interface')
        break
      case 'mint':
        toast.success('Opening NFT Minting Studio')
        break
      case 'search':
        // Focus search input
        break
      case 'filters':
        onFilterChange?.({})
        break
      default:
        break
    }
  }

  const sidebarVariants = {
    expanded: { width: isMinimized ? 0 : 240 }, // Wider sidebar for better visibility
    collapsed: { width: isMinimized ? 0 : 240 } // Always expanded
  }

  const itemVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -20 }
  }

  return (
    <>
      {/* Sidebar Container */}
      <motion.div
        variants={sidebarVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-xl z-40 overflow-hidden ${
          isMinimized ? 'hidden' : 'block'
        }`}
      >
        {/* Header */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <motion.div
              variants={itemVariants}
              animate="expanded"
              className="flex items-center gap-2"
            >
              <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FiZap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-gray-900 dark:text-white">NFT Hub</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">All Portals</p>
              </div>
            </motion.div>
            
            <div className="flex items-center gap-1">
              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-target"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? (
                  <FiSun className="w-4 h-4 text-yellow-500" />
                ) : (
                  <FiMoon className="w-4 h-4 text-gray-600" />
                )}
              </button>
              
              {/* Collapse Toggle - Removed to keep sidebar always open */}
              {/* <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-target"
                title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                {isCollapsed ? (
                  <FiChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                ) : (
                  <FiChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                )}
              </button> */}
            </div>
          </div>

          {/* Search Bar - Always visible */}
          <motion.div
            variants={itemVariants}
            animate="expanded"
            className="mt-3"
          >
              <div className="relative">
                <FiSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
          </motion.div>
        </div>

        {/* Category Tabs - Always visible */}
        <motion.div
          variants={itemVariants}
          animate="expanded"
          className="p-2 border-b border-gray-200 dark:border-gray-700"
        >
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors touch-target ${
                  selectedCategory === 'all'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors touch-target ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </motion.div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-0.5">
            {filteredItems.map((item, index) => {
              const Icon = item.icon
              const isActive = currentView === item.id
              const isDisabled = item.requiresWallet && !isConnected

              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleItemClick(item)}
                  disabled={isDisabled}
                  className={`w-full p-2 rounded-lg text-left transition-all duration-200 group relative touch-target ${
                    isActive
                      ? `bg-${item.color}-100 dark:bg-${item.color}-900/30 text-${item.color}-700 dark:text-${item.color}-300 shadow-sm`
                      : isDisabled
                      ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  title={item.description}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="relative flex-shrink-0">
                      <Icon className={`w-4 h-4 ${isActive ? `text-${item.color}-600 dark:text-${item.color}-400` : ''}`} />
                      
                      {/* Badge */}
                      {item.badge && (
                        <div className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center px-0.5">
                          {typeof item.badge === 'number' && item.badge > 99 ? '99+' : item.badge}
                        </div>
                      )}
                      
                      {/* New Indicator */}
                      {item.isNew && (
                        <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-400 rounded-full" />
                      )}
                    </div>
                    
                    <motion.div
                      variants={itemVariants}
                      animate="expanded"
                      className="flex-1 min-w-0"
                    >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium truncate">{item.label}</span>
                          {(item.badge || item.isNew) && (
                            <div className="flex items-center gap-1 ml-1.5">
                              {item.badge && (
                                <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                                  isActive 
                                    ? `bg-${item.color}-200 text-${item.color}-800 dark:bg-${item.color}-800 dark:text-${item.color}-200`
                                    : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                }`}>
                                  {typeof item.badge === 'number' && item.badge > 99 ? '99+' : item.badge}
                                </span>
                              )}
                              {item.isNew && (
                                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full">
                                  NEW
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </motion.div>
                    
                    {isActive && (
                      <FiChevronRight className="w-4 h-4 opacity-60" />
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {!isCollapsed ? (
            <motion.div
              variants={itemVariants}
              animate={isCollapsed ? 'collapsed' : 'expanded'}
              className="space-y-3"
            >
              {/* View Mode Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View Mode</span>
                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => onViewModeChange?.('grid')}
                    className={`p-1.5 rounded transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <FiGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onViewModeChange?.('list')}
                    className={`p-1.5 rounded transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <FiList className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* User Status */}
              {isConnected ? (
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Connected</p>
                    <p className="text-xs text-green-600 dark:text-green-400 truncate">
                      {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Wallet'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Connect Wallet</p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">For full access</p>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => onViewModeChange?.(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title={`Switch to ${viewMode === 'grid' ? 'List' : 'Grid'} View`}
              >
                {viewMode === 'grid' ? (
                  <FiList className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <FiGrid className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
              
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
            </div>
          )}
        </div>
      </motion.div>

      {/* Minimize Toggle Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setIsMinimized(!isMinimized)}
        className={`fixed top-4 z-50 p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all ${
          isMinimized ? 'left-4' : isCollapsed ? 'left-24' : 'left-80'
        }`}
        title={isMinimized ? 'Show Sidebar' : 'Hide Sidebar'}
      >
        {isMinimized ? (
          <FiMenu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        ) : (
          <FiX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        )}
      </motion.button>

      {/* Overlay for mobile */}
      {!isCollapsed && !isMinimized && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-30 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  )
}