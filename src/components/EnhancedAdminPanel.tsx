'use client'

import { useState, useEffect, useRef } from 'react'
import { useAccount } from 'wagmi'
import { useTheme } from '@/contexts/ThemeContext'
import { toast } from 'react-hot-toast'
import { 
  FiShield, 
  FiUsers, 
  FiDollarSign, 
  FiSettings, 
  FiTrash2, 
  FiEdit3, 
  FiEye, 
  FiTrendingUp,
  FiAlertTriangle,
  FiRefreshCw,
  FiDownload,
  FiUpload,
  FiLock,
  FiUnlock,
  FiImage,
  FiLayout,
  FiMonitor,
  FiSun,
  FiMoon,
  FiType,
  FiGrid,
  FiSave,
  FiRotateCw,
  FiCheck,
  FiX,
  FiPlus,
  FiMinus,
  FiChevronDown,
  FiChevronUp,
  FiZap,
  FiPackage,
  FiCreditCard,
  FiTarget,
  FiSliders,
  FiCode,
  FiDatabase,
  FiGlobe,
  FiMail,
  FiTool,
  FiLayers,
  FiFilter,
  FiStar,
  FiHeart,
  FiBookmark,
  FiShare2,
  FiMessageSquare,
  FiMaximize2,
  FiMinimize2,
  FiCopy,
  FiExternalLink,
  FiActivity,
  FiBarChart,
  FiPieChart,
  FiCalendar
} from 'react-icons/fi'

interface AdminStats {
  totalUsers: number
  totalNFTs: number
  totalVolume: string
  activeListings: number
  pendingTransactions: number
  reportedItems: number
  totalFees: string
  activeUsers: number
  pendingWithdrawals: number
  monthlyRevenue: string
  systemHealth: number
}

interface NFTItem {
  id: string
  name: string
  creator: string
  price: string
  status: 'active' | 'pending' | 'reported' | 'banned'
  owner?: string
  dateCreated?: string
  lastActivity?: string
  views?: number
  likes?: number
}

interface MarketplaceConfig {
  logo: string
  siteName: string
  tagline: string
  headerStyle: 'default' | 'gradient' | 'solid' | 'transparent' | 'glass'
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontFamily: string
  borderRadius: string
  headerHeight: string
  footerText: string
  contactEmail: string
  socialLinks: {
    twitter: string
    discord: string
    telegram: string
    farcaster: string
  }
  features: {
    darkMode: boolean
    animations: boolean
    sounds: boolean
    notifications: boolean
    autoRefresh: boolean
    maintenance: boolean
  }
  layout: {
    maxWidth: string
    gridCols: string
    spacing: string
    cardStyle: string
  }
}

interface FeeConfig {
  marketplaceFee: number
  creatorRoyalty: number
  minimumPrice: number
  listingFee: number
  withdrawalFee: number
  processingFee: number
  bulkDiscountThreshold: number
  bulkDiscount: number
  premiumCreatorFee: number
}

export function SuperAdminPanel() {
  const { address, isConnected } = useAccount()
  const { isDarkMode, toggleDarkMode, setDarkMode } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [isExpanded, setIsExpanded] = useState(true)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 1247,
    totalNFTs: 5834,
    totalVolume: '2,456.7',
    activeListings: 342,
    pendingTransactions: 23,
    reportedItems: 7,
    totalFees: '45.8',
    activeUsers: 234,
    pendingWithdrawals: 3,
    monthlyRevenue: '128.5',
    systemHealth: 98
  })
  
  const [marketplaceConfig, setMarketplaceConfig] = useState<MarketplaceConfig>({
    logo: '/logo.png',
    siteName: 'Farcaster NFT Marketplace',
    tagline: 'The Future of Social NFTs',
    headerStyle: 'gradient',
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    accentColor: '#ec4899',
    fontFamily: 'Inter',
    borderRadius: '12px',
    headerHeight: '80px',
    footerText: '© 2024 Farcaster NFT Marketplace. All rights reserved.',
    contactEmail: 'admin@farcaster-nft.com',
    socialLinks: {
      twitter: 'https://twitter.com/farcaster',
      discord: 'https://discord.gg/farcaster',
      telegram: 'https://t.me/farcaster',
      farcaster: 'https://warpcast.com/farcaster'
    },
    features: {
      darkMode: true,
      animations: true,
      sounds: false,
      notifications: true,
      autoRefresh: true,
      maintenance: false
    },
    layout: {
      maxWidth: '1200px',
      gridCols: '3',
      spacing: '24px',
      cardStyle: 'rounded'
    }
  })

  const [feeConfig, setFeeConfig] = useState<FeeConfig>({
    marketplaceFee: 2.5,
    creatorRoyalty: 5.0,
    minimumPrice: 0.001,
    listingFee: 0.01,
    withdrawalFee: 0.5,
    processingFee: 0.1,
    bulkDiscountThreshold: 10,
    bulkDiscount: 0.5,
    premiumCreatorFee: 1.5
  })
  
  const [nftItems, setNftItems] = useState<NFTItem[]>([
    { 
      id: '1', 
      name: 'Farcaster Genesis #001', 
      creator: '0x1234...5678', 
      price: '2.5', 
      status: 'active',
      owner: '0x1234...5678',
      dateCreated: '2024-01-15',
      lastActivity: '2024-01-20',
      views: 342,
      likes: 89
    },
    { 
      id: '2', 
      name: 'Base Builder Badge', 
      creator: '0x9876...4321', 
      price: '1.0', 
      status: 'pending',
      owner: '0x9876...4321',
      dateCreated: '2024-01-18',
      lastActivity: '2024-01-19',
      views: 156,
      likes: 42
    },
    { 
      id: '3', 
      name: 'Purple Circle NFT', 
      creator: '0x5555...6666', 
      price: '0.8', 
      status: 'reported',
      owner: '0x5555...6666',
      dateCreated: '2024-01-10',
      lastActivity: '2024-01-12',
      views: 78,
      likes: 12
    }
  ])

  useEffect(() => {
    const adminAddress = process.env.NEXT_PUBLIC_ADMIN_ADDRESS || '0x' 
    if (isConnected && address && adminAddress) {
      setIsAdmin(address.toLowerCase() === adminAddress.toLowerCase())
    } else {
      setIsAdmin(false)
    }
  }, [address, isConnected])

  const saveAllConfigs = async () => {
    setSaveStatus('saving')
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSaveStatus('saved')
      toast.success('All configurations saved successfully!')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      setSaveStatus('error')
      toast.error('Failed to save configurations')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }
  }

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const previewUrl = URL.createObjectURL(file)
        setMarketplaceConfig(prev => ({ ...prev, logo: previewUrl }))
        toast.success('Logo uploaded! Preview active.')
      } catch (error) {
        toast.error('Failed to upload logo')
      }
    }
  }

  const withdrawFees = async (amount: number) => {
    try {
      setSaveStatus('saving')
      await new Promise(resolve => setTimeout(resolve, 2000))
      setStats(prev => ({ 
        ...prev, 
        totalFees: (parseFloat(prev.totalFees) - amount).toFixed(2) 
      }))
      setSaveStatus('saved')
      toast.success(`Successfully withdrew ${amount} ETH`)
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      setSaveStatus('error')
      toast.error('Withdrawal failed')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }
  }

  const handleCreateNFT = () => {
    const newNFT: NFTItem = {
      id: (nftItems.length + 1).toString(),
      name: 'Admin Created NFT',
      creator: address || '0x0000...0000',
      price: '1.0',
      status: 'active',
      owner: address || '0x0000...0000',
      dateCreated: new Date().toISOString().split('T')[0],
      lastActivity: new Date().toISOString().split('T')[0],
      views: 0,
      likes: 0
    }
    setNftItems(prev => [newNFT, ...prev])
    toast.success('New NFT created successfully')
  }

  if (!isConnected || !isAdmin) {
    return (
      <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6'>
        <div className='flex items-center gap-2'>
          <FiShield className='w-5 h-5 text-red-600 dark:text-red-400' />
          <p className='text-red-800 dark:text-red-200 font-medium'>
            {!isConnected ? 'Connect wallet to access admin panel' : 'Access denied - Admin privileges required'}
          </p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: FiBarChart, color: 'blue' },
    { id: 'appearance', label: 'Logo & Branding', icon: FiImage, color: 'purple' },
    { id: 'theme', label: 'Theme & Style', icon: FiSun, color: 'yellow' },
    { id: 'layout', label: 'Layout Control', icon: FiLayout, color: 'green' },
    { id: 'header', label: 'Header Settings', icon: FiType, color: 'indigo' },
    { id: 'nfts', label: 'NFT Management', icon: FiPackage, color: 'pink' },
    { id: 'users', label: 'User Control', icon: FiUsers, color: 'cyan' },
    { id: 'fees', label: 'Fee Management', icon: FiCreditCard, color: 'orange' },
    { id: 'withdrawal', label: 'Withdrawals', icon: FiDownload, color: 'emerald' },
    { id: 'settings', label: 'System Settings', icon: FiSettings, color: 'gray' }
  ]

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8 transition-all duration-500 ${isExpanded ? '' : 'max-h-24'}`}>
      {/* Enhanced Header */}
      <div className='bg-gradient-to-r from-red-600 via-purple-600 to-pink-600 p-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='relative'>
              <FiShield className='w-10 h-10 text-white' />
              <div className='absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse'></div>
            </div>
            <div>
              <h2 className='text-3xl font-bold text-white'>Super Admin Control Center</h2>
              <p className='text-red-100'>Complete Marketplace Control & Management Dashboard</p>
            </div>
          </div>
          
          <div className='flex items-center gap-4'>
            {/* Status Indicators */}
            <div className='grid grid-cols-2 gap-2 text-white text-xs'>
              <div className='flex items-center gap-2 bg-white/10 px-3 py-1 rounded'>
                <FiAlertTriangle className='w-3 h-3' />
                <span>{stats.reportedItems} Reports</span>
              </div>
              <div className='flex items-center gap-2 bg-white/10 px-3 py-1 rounded'>
                <FiDollarSign className='w-3 h-3' />
                <span>{stats.totalFees} ETH</span>
              </div>
            </div>
            
            {/* Save Status */}
            {saveStatus !== 'idle' && (
              <div className='flex items-center gap-2 text-white bg-white/10 px-3 py-2 rounded-lg'>
                {saveStatus === 'saving' && <FiRotateCw className='w-4 h-4 animate-spin' />}
                {saveStatus === 'saved' && <FiCheck className='w-4 h-4 text-green-300' />}
                {saveStatus === 'error' && <FiX className='w-4 h-4 text-red-300' />}
                <span className='text-sm font-medium'>
                  {saveStatus === 'saving' && 'Saving...'}
                  {saveStatus === 'saved' && 'Saved!'}
                  {saveStatus === 'error' && 'Error!'}
                </span>
              </div>
            )}
            
            {/* Toggle Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='text-white hover:text-red-200 transition-colors p-2 rounded-lg hover:bg-white/10'
            >
              {isExpanded ? <FiMinimize2 className='w-5 h-5' /> : <FiMaximize2 className='w-5 h-5' />}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Tab Navigation */}
          <div className='border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700'>
            <nav className='flex space-x-1 px-6 py-3 overflow-x-auto'>
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-red-500 text-white shadow-lg scale-105'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-gray-600'
                    }`}
                  >
                    <Icon className='w-4 h-4' />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className='p-6 max-h-[80vh] overflow-y-auto'>
            {/* DASHBOARD TAB */}
            {activeTab === 'overview' && (
              <div className='space-y-8'>
                {/* Stats Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                  <div className='bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-blue-100 text-sm font-medium'>Total Users</p>
                        <p className='text-3xl font-bold'>{stats.totalUsers.toLocaleString()}</p>
                      </div>
                      <FiUsers className='w-10 h-10 text-blue-200' />
                    </div>
                  </div>
                  
                  <div className='bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-green-100 text-sm font-medium'>Total NFTs</p>
                        <p className='text-3xl font-bold'>{stats.totalNFTs.toLocaleString()}</p>
                      </div>
                      <FiPackage className='w-10 h-10 text-green-200' />
                    </div>
                  </div>
                  
                  <div className='bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-purple-100 text-sm font-medium'>Volume (ETH)</p>
                        <p className='text-3xl font-bold'>{stats.totalVolume}</p>
                      </div>
                      <FiTrendingUp className='w-10 h-10 text-purple-200' />
                    </div>
                  </div>
                  
                  <div className='bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-xl text-white shadow-lg'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-indigo-100 text-sm font-medium'>Total Fees</p>
                        <p className='text-3xl font-bold'>{stats.totalFees}</p>
                      </div>
                      <FiDollarSign className='w-10 h-10 text-indigo-200' />
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                  <button 
                    onClick={() => setActiveTab('nfts')}
                    className='p-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all transform hover:scale-105 shadow-lg'
                  >
                    <div className='flex items-center gap-3'>
                      <FiPackage className='w-6 h-6' />
                      <div className='text-left'>
                        <div className='font-semibold'>Manage NFTs</div>
                        <div className='text-sm text-blue-100'>Control listings</div>
                      </div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('appearance')}
                    className='p-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl transition-all transform hover:scale-105 shadow-lg'
                  >
                    <div className='flex items-center gap-3'>
                      <FiImage className='w-6 h-6' />
                      <div className='text-left'>
                        <div className='font-semibold'>Change Logo</div>
                        <div className='text-sm text-purple-100'>Update branding</div>
                      </div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('fees')}
                    className='p-4 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-xl transition-all transform hover:scale-105 shadow-lg'
                  >
                    <div className='flex items-center gap-3'>
                      <FiCreditCard className='w-6 h-6' />
                      <div className='text-left'>
                        <div className='font-semibold'>Manage Fees</div>
                        <div className='text-sm text-orange-100'>Configure rates</div>
                      </div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('withdrawal')}
                    className='p-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl transition-all transform hover:scale-105 shadow-lg'
                  >
                    <div className='flex items-center gap-3'>
                      <FiDownload className='w-6 h-6' />
                      <div className='text-left'>
                        <div className='font-semibold'>Withdraw Fees</div>
                        <div className='text-sm text-emerald-100'>{stats.totalFees} ETH ready</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* LOGO & BRANDING TAB */}
            {activeTab === 'appearance' && (
              <div className='space-y-8'>
                <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700'>
                  <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3'>
                    <FiImage className='w-6 h-6 text-purple-500' />
                    Logo & Branding Control
                  </h3>
                  
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    {/* Logo Upload */}
                    <div className='space-y-4'>
                      <div className='p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-purple-500 transition-colors'>
                        <div className='text-center space-y-4'>
                          <div className='mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center overflow-hidden'>
                            {marketplaceConfig.logo ? (
                              <img src={marketplaceConfig.logo} alt="Logo" className='w-full h-full object-cover' />
                            ) : (
                              <FiImage className='w-8 h-8 text-gray-400' />
                            )}
                          </div>
                          <div>
                            <h4 className='font-semibold text-gray-900 dark:text-white'>Upload New Logo</h4>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>PNG, JPG up to 5MB</p>
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                          >
                            Choose Logo File
                          </button>
                        </div>
                      </div>
                      
                      {/* Brand Text */}
                      <div className='space-y-4'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                            Site Name
                          </label>
                          <input
                            type="text"
                            value={marketplaceConfig.siteName}
                            onChange={(e) => setMarketplaceConfig(prev => ({ ...prev, siteName: e.target.value }))}
                            className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                          />
                        </div>
                        
                        <div>
                          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                            Tagline
                          </label>
                          <input
                            type="text"
                            value={marketplaceConfig.tagline}
                            onChange={(e) => setMarketplaceConfig(prev => ({ ...prev, tagline: e.target.value }))}
                            className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Preview */}
                    <div className='space-y-4'>
                      <h4 className='font-semibold text-gray-900 dark:text-white'>Live Preview</h4>
                      <div className='border border-gray-200 dark:border-gray-600 rounded-xl p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'>
                        <div className='flex items-center gap-4'>
                          <div className='w-12 h-12 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden shadow-md'>
                            {marketplaceConfig.logo ? (
                              <img src={marketplaceConfig.logo} alt="Logo" className='w-full h-full object-cover' />
                            ) : (
                              <FiImage className='w-6 h-6 text-gray-400' />
                            )}
                          </div>
                          <div>
                            <h3 className='font-bold text-gray-900 dark:text-white'>{marketplaceConfig.siteName}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{marketplaceConfig.tagline}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className='mt-6 flex gap-3'>
                    <button
                      onClick={saveAllConfigs}
                      disabled={saveStatus === 'saving'}
                      className='px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors flex items-center gap-2 font-medium'
                    >
                      {saveStatus === 'saving' ? <FiRotateCw className='w-4 h-4 animate-spin' /> : <FiSave className='w-4 h-4' />}
                      Save Branding
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* THEME & STYLE TAB */}
            {activeTab === 'theme' && (
              <div className='space-y-8'>
                <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700'>
                  <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3'>
                    <FiSun className='w-6 h-6 text-yellow-500' />
                    Theme & Style Management
                  </h3>
                  
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    {/* Color Controls */}
                    <div className='space-y-6'>
                      <div>
                        <h4 className='font-semibold text-gray-900 dark:text-white mb-4'>Color Palette</h4>
                        <div className='space-y-4'>
                          <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                              Primary Color
                            </label>
                            <div className='flex gap-2'>
                              <input
                                type="color"
                                value={marketplaceConfig.primaryColor}
                                onChange={(e) => setMarketplaceConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                                className='w-12 h-10 rounded border border-gray-300 dark:border-gray-600'
                              />
                              <input
                                type="text"
                                value={marketplaceConfig.primaryColor}
                                onChange={(e) => setMarketplaceConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                                className='flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm'
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                              Secondary Color
                            </label>
                            <div className='flex gap-2'>
                              <input
                                type="color"
                                value={marketplaceConfig.secondaryColor}
                                onChange={(e) => setMarketplaceConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                                className='w-12 h-10 rounded border border-gray-300 dark:border-gray-600'
                              />
                              <input
                                type="text"
                                value={marketplaceConfig.secondaryColor}
                                onChange={(e) => setMarketplaceConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                                className='flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm'
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Theme Toggle */}
                      <div>
                        <h4 className='font-semibold text-gray-900 dark:text-white mb-4'>Theme Settings</h4>
                        <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                          <div>
                            <label className='font-medium text-gray-900 dark:text-white'>Dark Mode</label>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>Enable dark theme</p>
                          </div>
                          <button
                            onClick={() => {
                              setMarketplaceConfig(prev => ({ 
                                ...prev, 
                                features: { ...prev.features, darkMode: !prev.features.darkMode }
                              }))
                              toggleDarkMode()
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              marketplaceConfig.features.darkMode ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              marketplaceConfig.features.darkMode ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Preview */}
                    <div className='space-y-4'>
                      <h4 className='font-semibold text-gray-900 dark:text-white'>Color Preview</h4>
                      <div className='space-y-3'>
                        <div 
                          className='p-4 rounded-lg text-white font-medium'
                          style={{ backgroundColor: marketplaceConfig.primaryColor }}
                        >
                          Primary Color Preview
                        </div>
                        <div 
                          className='p-4 rounded-lg text-white font-medium'
                          style={{ backgroundColor: marketplaceConfig.secondaryColor }}
                        >
                          Secondary Color Preview
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className='mt-6'>
                    <button
                      onClick={saveAllConfigs}
                      className='px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium'
                    >
                      <FiSave className='w-4 h-4' />
                      Save Theme
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* NFT MANAGEMENT TAB */}
            {activeTab === 'nfts' && (
              <div className='space-y-6'>
                <div className='flex justify-between items-center'>
                  <h3 className='text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3'>
                    <FiPackage className='w-6 h-6 text-pink-500' />
                    NFT Management & Control
                  </h3>
                  <div className='flex gap-2'>
                    <button 
                      onClick={handleCreateNFT}
                      className='px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm'
                    >
                      <FiPlus className='w-4 h-4' />
                      Create NFT
                    </button>
                  </div>
                </div>

                <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
                  <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                      <thead className='bg-gray-50 dark:bg-gray-700'>
                        <tr>
                          <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                            NFT Details
                          </th>
                          <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                            Creator
                          </th>
                          <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                            Price
                          </th>
                          <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                            Status
                          </th>
                          <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                        {nftItems.map((item) => (
                          <tr key={item.id} className='hover:bg-gray-50 dark:hover:bg-gray-700/50'>
                            <td className='px-6 py-4'>
                              <div className='flex items-center gap-3'>
                                <div className='w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white font-bold'>
                                  #{item.id}
                                </div>
                                <div>
                                  <div className='text-sm font-medium text-gray-900 dark:text-white'>{item.name}</div>
                                  <div className='text-sm text-gray-500 dark:text-gray-400'>
                                    Views: {item.views} • Likes: {item.likes}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 text-sm text-gray-900 dark:text-white'>{item.creator}</td>
                            <td className='px-6 py-4 text-sm font-medium text-gray-900 dark:text-white'>{item.price} ETH</td>
                            <td className='px-6 py-4'>
                              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                item.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                                item.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                                item.status === 'reported' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className='px-6 py-4'>
                              <div className='flex items-center gap-2'>
                                <button className='p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg'>
                                  <FiEye className='w-4 h-4' />
                                </button>
                                <button className='p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg'>
                                  <FiEdit3 className='w-4 h-4' />
                                </button>
                                {item.status === 'banned' ? (
                                  <button 
                                    onClick={() => {
                                      setNftItems(prev => prev.map(nft => 
                                        nft.id === item.id ? { ...nft, status: 'active' as const } : nft
                                      ))
                                      toast.success('NFT unbanned')
                                    }}
                                    className='p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg'
                                  >
                                    <FiUnlock className='w-4 h-4' />
                                  </button>
                                ) : (
                                  <button 
                                    onClick={() => {
                                      setNftItems(prev => prev.map(nft => 
                                        nft.id === item.id ? { ...nft, status: 'banned' as const } : nft
                                      ))
                                      toast.success('NFT banned')
                                    }}
                                    className='p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg'
                                  >
                                    <FiLock className='w-4 h-4' />
                                  </button>
                                )}
                                <button 
                                  onClick={() => {
                                    setNftItems(prev => prev.filter(nft => nft.id !== item.id))
                                    toast.success('NFT removed')
                                  }}
                                  className='p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg'
                                >
                                  <FiTrash2 className='w-4 h-4' />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* FEE MANAGEMENT TAB */}
            {activeTab === 'fees' && (
              <div className='space-y-6'>
                <h3 className='text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3'>
                  <FiCreditCard className='w-6 h-6 text-orange-500' />
                  Fee Management & Configuration
                </h3>
                
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                  {/* Fee Configuration */}
                  <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700'>
                    <h4 className='font-semibold text-gray-900 dark:text-white mb-6'>Platform Fees</h4>
                    <div className='space-y-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                          Marketplace Fee (%)
                        </label>
                        <input 
                          type='number' 
                          step="0.1"
                          value={feeConfig.marketplaceFee}
                          onChange={(e) => setFeeConfig(prev => ({ 
                            ...prev, 
                            marketplaceFee: parseFloat(e.target.value) || 0 
                          }))}
                          className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                        />
                      </div>
                      
                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                          Creator Royalty (%)
                        </label>
                        <input 
                          type='number' 
                          step="0.1"
                          value={feeConfig.creatorRoyalty}
                          onChange={(e) => setFeeConfig(prev => ({ 
                            ...prev, 
                            creatorRoyalty: parseFloat(e.target.value) || 0 
                          }))}
                          className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                        />
                      </div>
                      
                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                          Minimum Price (ETH)
                        </label>
                        <input 
                          type='number' 
                          step="0.001"
                          value={feeConfig.minimumPrice}
                          onChange={(e) => setFeeConfig(prev => ({ 
                            ...prev, 
                            minimumPrice: parseFloat(e.target.value) || 0 
                          }))}
                          className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                        />
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        saveAllConfigs()
                        toast.success('Fee configuration updated!')
                      }}
                      className='w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg transition-colors font-medium'
                    >
                      Update Fee Structure
                    </button>
                  </div>
                  
                  {/* Fee Calculator */}
                  <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700'>
                    <h4 className='font-semibold text-gray-900 dark:text-white mb-6'>Fee Calculator</h4>
                    <div className='space-y-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                          Sale Price (ETH)
                        </label>
                        <input 
                          type='number' 
                          step="0.01"
                          defaultValue="1.0"
                          className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                        />
                      </div>
                      
                      <div className='p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Sale Price:</span>
                            <span className="font-medium">1.000 ETH</span>
                          </div>
                          <div className="flex justify-between text-red-600 dark:text-red-400">
                            <span>Marketplace Fee ({feeConfig.marketplaceFee}%):</span>
                            <span>-{(feeConfig.marketplaceFee / 100).toFixed(3)} ETH</span>
                          </div>
                          <div className="flex justify-between text-red-600 dark:text-red-400">
                            <span>Creator Royalty ({feeConfig.creatorRoyalty}%):</span>
                            <span>-{(feeConfig.creatorRoyalty / 100).toFixed(3)} ETH</span>
                          </div>
                          <hr className="border-gray-300 dark:border-gray-600" />
                          <div className="flex justify-between font-bold text-green-600 dark:text-green-400">
                            <span>Seller Receives:</span>
                            <span>{(1 - (feeConfig.marketplaceFee + feeConfig.creatorRoyalty) / 100).toFixed(3)} ETH</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* WITHDRAWAL TAB */}
            {activeTab === 'withdrawal' && (
              <div className='space-y-6'>
                <h3 className='text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3'>
                  <FiDownload className='w-6 h-6 text-emerald-500' />
                  Fee Withdrawal & Treasury Management
                </h3>
                
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                  {/* Available Balance */}
                  <div className='bg-gradient-to-br from-emerald-500 to-green-600 p-6 rounded-xl text-white shadow-lg'>
                    <div className='flex items-center justify-between mb-4'>
                      <h4 className='text-xl font-bold'>Available Balance</h4>
                      <FiDollarSign className='w-8 h-8 text-emerald-200' />
                    </div>
                    <div className='text-4xl font-bold mb-2'>{stats.totalFees} ETH</div>
                    <div className='text-emerald-100 text-sm'>
                      ≈ ${(parseFloat(stats.totalFees) * 2500).toLocaleString()} USD
                    </div>
                  </div>
                  
                  {/* Withdrawal Form */}
                  <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700'>
                    <h4 className='font-semibold text-gray-900 dark:text-white mb-6'>Withdraw Funds</h4>
                    <div className='space-y-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                          Withdrawal Amount (ETH)
                        </label>
                        <input 
                          type='number' 
                          step="0.001"
                          max={parseFloat(stats.totalFees)}
                          placeholder='0.000'
                          className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                          id="withdrawal-amount"
                        />
                      </div>
                      
                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                          Destination Address
                        </label>
                        <input 
                          type='text' 
                          defaultValue={address || ''}
                          className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                          placeholder='0x...'
                        />
                      </div>
                      
                      <button
                        onClick={() => {
                          const amountInput = document.getElementById('withdrawal-amount') as HTMLInputElement
                          const amount = parseFloat(amountInput?.value || '0')
                          if (amount > 0 && amount <= parseFloat(stats.totalFees)) {
                            withdrawFees(amount)
                            if (amountInput) amountInput.value = ''
                          } else {
                            toast.error('Invalid withdrawal amount')
                          }
                        }}
                        className='w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2'
                      >
                        <FiDownload className='w-4 h-4' />
                        Withdraw ETH
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}