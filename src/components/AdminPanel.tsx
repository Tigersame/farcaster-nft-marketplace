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
  FiMinimize2
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
}

interface MarketplaceConfig {
  logo: string
  siteName: string
  tagline: string
  headerStyle: 'default' | 'gradient' | 'solid' | 'transparent'
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
  }
  features: {
    darkMode: boolean
    animations: boolean
    sounds: boolean
    notifications: boolean
  }
}

interface FeeConfig {
  marketplaceFee: number
  creatorRoyalty: number
  minimumPrice: number
  listingFee: number
  withdrawalFee: number
  processingFee: number
}

export function AdminPanel() {
  const { address, isConnected } = useAccount()
  const { theme, toggleTheme } = useTheme()
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
    pendingWithdrawals: 3
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
      telegram: 'https://t.me/farcaster'
    },
    features: {
      darkMode: true,
      animations: true,
      sounds: false,
      notifications: true
    }
  })

  const [feeConfig, setFeeConfig] = useState<FeeConfig>({
    marketplaceFee: 2.5,
    creatorRoyalty: 5.0,
    minimumPrice: 0.001,
    listingFee: 0.01,
    withdrawalFee: 0.5,
    processingFee: 0.1
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
      lastActivity: '2024-01-20'
    },
    { 
      id: '2', 
      name: 'Base Builder Badge', 
      creator: '0x9876...4321', 
      price: '1.0', 
      status: 'pending',
      owner: '0x9876...4321',
      dateCreated: '2024-01-18',
      lastActivity: '2024-01-19'
    },
    { 
      id: '3', 
      name: 'Purple Circle NFT', 
      creator: '0x5555...6666', 
      price: '0.8', 
      status: 'reported',
      owner: '0x5555...6666',
      dateCreated: '2024-01-10',
      lastActivity: '2024-01-12'
    }
  ])

  useEffect(() => {
    const adminAddress = process.env.NEXT_PUBLIC_ADMIN_ADDRESS || '0x' // Set default admin address
    if (isConnected && address && adminAddress) {
      setIsAdmin(address.toLowerCase() === adminAddress.toLowerCase())
    } else {
      setIsAdmin(false)
    }
  }, [address, isConnected])

  // Save functions with optimistic UI updates
  const saveMarketplaceConfig = async () => {
    setSaveStatus('saving')
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSaveStatus('saved')
      toast.success('Marketplace configuration saved successfully!')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      setSaveStatus('error')
      toast.error('Failed to save configuration')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }
  }

  const saveFeeConfig = async () => {
    setSaveStatus('saving')
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSaveStatus('saved')
      toast.success('Fee configuration saved successfully!')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      setSaveStatus('error')
      toast.error('Failed to save fee configuration')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }
  }

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        // Create a preview URL
        const previewUrl = URL.createObjectURL(file)
        setMarketplaceConfig(prev => ({ ...prev, logo: previewUrl }))
        toast.success('Logo uploaded successfully! Remember to save changes.')
      } catch (error) {
        toast.error('Failed to upload logo')
      }
    }
  }

  const withdrawFees = async (amount: number) => {
    try {
      // Simulate withdrawal
      await new Promise(resolve => setTimeout(resolve, 2000))
      setStats(prev => ({ 
        ...prev, 
        totalFees: (parseFloat(prev.totalFees) - amount).toString() 
      }))
      toast.success(`Successfully withdrew ${amount} ETH`)
    } catch (error) {
      toast.error('Withdrawal failed')
    }
  }

  const handleBanNFT = (id: string) => {
    setNftItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'banned' as const } : item
    ))
    toast.success('NFT banned successfully')
  }

  const handleUnbanNFT = (id: string) => {
    setNftItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'active' as const } : item
    ))
    toast.success('NFT unbanned successfully')
  }

  const handleRemoveNFT = (id: string) => {
    setNftItems(prev => prev.filter(item => item.id !== id))
    toast.success('NFT removed successfully')
  }

  const handleCreateNFT = () => {
    const newNFT: NFTItem = {
      id: (nftItems.length + 1).toString(),
      name: 'New Admin NFT',
      creator: address || '0x0000...0000',
      price: '1.0',
      status: 'active',
      owner: address || '0x0000...0000',
      dateCreated: new Date().toISOString().split('T')[0],
      lastActivity: new Date().toISOString().split('T')[0]
    }
    setNftItems(prev => [newNFT, ...prev])
    toast.success('New NFT created successfully')
  }

  const bulkUpdateNFTs = (action: 'approve' | 'ban' | 'delete', selectedIds: string[]) => {
    if (action === 'delete') {
      setNftItems(prev => prev.filter(item => !selectedIds.includes(item.id)))
    } else if (action === 'approve') {
      setNftItems(prev => prev.map(item => 
        selectedIds.includes(item.id) ? { ...item, status: 'active' as const } : item
      ))
    } else if (action === 'ban') {
      setNftItems(prev => prev.map(item => 
        selectedIds.includes(item.id) ? { ...item, status: 'banned' as const } : item
      ))
    }
    toast.success(`Bulk ${action} completed for ${selectedIds.length} items`)
  }

  if (!isConnected || !isAdmin) {
    return null
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiTrendingUp },
    { id: 'appearance', label: 'Appearance', icon: FiImage },
    { id: 'layout', label: 'Layout & Theme', icon: FiLayout },
    { id: 'nfts', label: 'NFT Management', icon: FiPackage },
    { id: 'users', label: 'User Management', icon: FiUsers },
    { id: 'finance', label: 'Financial', icon: FiDollarSign },
    { id: 'fees', label: 'Fee Management', icon: FiCreditCard },
    { id: 'withdrawal', label: 'Withdrawals', icon: FiDownload },
    { id: 'settings', label: 'System Settings', icon: FiSettings }
  ]

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8 transition-all duration-300 ${isExpanded ? '' : 'max-h-20'}`}>
      {/* Collapsible Header */}
      <div className='bg-gradient-to-r from-red-600 to-purple-600 p-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <FiShield className='w-8 h-8 text-white' />
            <div>
              <h2 className='text-2xl font-bold text-white'>Super Admin Control Panel</h2>
              <p className='text-red-100'>Complete Marketplace Control & Management</p>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            {/* Save Status Indicator */}
            {saveStatus !== 'idle' && (
              <div className='flex items-center gap-2 text-white'>
                {saveStatus === 'saving' && <FiRotateCw className='w-4 h-4 animate-spin' />}
                {saveStatus === 'saved' && <FiCheck className='w-4 h-4 text-green-300' />}
                {saveStatus === 'error' && <FiX className='w-4 h-4 text-red-300' />}
                <span className='text-sm'>
                  {saveStatus === 'saving' && 'Saving...'}
                  {saveStatus === 'saved' && 'Saved!'}
                  {saveStatus === 'error' && 'Error!'}
                </span>
              </div>
            )}
            
            {/* Quick Stats */}
            <div className='flex items-center gap-4 text-white text-sm'>
              <div className='flex items-center gap-1'>
                <FiAlertTriangle className='w-4 h-4' />
                <span>{stats.reportedItems} Reports</span>
              </div>
              <div className='flex items-center gap-1'>
                <FiDollarSign className='w-4 h-4' />
                <span>{stats.totalFees} ETH Fees</span>
              </div>
            </div>
            
            {/* Collapse Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='text-white hover:text-red-200 transition-colors'
            >
              {isExpanded ? <FiMinimize2 className='w-5 h-5' /> : <FiMaximize2 className='w-5 h-5' />}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Enhanced Tab Navigation */}
          <div className='border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'>
            <nav className='flex space-x-1 px-6 py-2 overflow-x-auto'>
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-4 rounded-lg font-medium text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-red-500 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className='w-4 h-4' />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Enhanced Tab Content */}
          <div className='p-6 max-h-[80vh] overflow-y-auto'>
        {activeTab === 'overview' && (
          <div className='space-y-6'>
            {/* Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4'>
              <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-blue-600 dark:text-blue-400'>Total Users</p>
                    <p className='text-2xl font-bold text-blue-900 dark:text-blue-100'>{stats.totalUsers}</p>
                  </div>
                  <FiUsers className='w-8 h-8 text-blue-500' />
                </div>
              </div>
              
              <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-green-600 dark:text-green-400'>Total NFTs</p>
                    <p className='text-2xl font-bold text-green-900 dark:text-green-100'>{stats.totalNFTs}</p>
                  </div>
                  <FiEdit3 className='w-8 h-8 text-green-500' />
                </div>
              </div>
              
              <div className='bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-purple-600 dark:text-purple-400'>Volume (ETH)</p>
                    <p className='text-2xl font-bold text-purple-900 dark:text-purple-100'>{stats.totalVolume}</p>
                  </div>
                  <FiDollarSign className='w-8 h-8 text-purple-500' />
                </div>
              </div>
              
              <div className='bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-yellow-600 dark:text-yellow-400'>Active Listings</p>
                    <p className='text-2xl font-bold text-yellow-900 dark:text-yellow-100'>{stats.activeListings}</p>
                  </div>
                  <FiEye className='w-8 h-8 text-yellow-500' />
                </div>
              </div>
              
              <div className='bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-orange-600 dark:text-orange-400'>Pending</p>
                    <p className='text-2xl font-bold text-orange-900 dark:text-orange-100'>{stats.pendingTransactions}</p>
                  </div>
                  <FiRefreshCw className='w-8 h-8 text-orange-500' />
                </div>
              </div>
              
              <div className='bg-red-50 dark:bg-red-900/20 p-4 rounded-lg'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-red-600 dark:text-red-400'>Reports</p>
                    <p className='text-2xl font-bold text-red-900 dark:text-red-100'>{stats.reportedItems}</p>
                  </div>
                  <FiAlertTriangle className='w-8 h-8 text-red-500' />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              <button className='p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-3'>
                <FiRefreshCw className='w-5 h-5' />
                Refresh Data
              </button>
              <button className='p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-3'>
                <FiDownload className='w-5 h-5' />
                Export Reports
              </button>
              <button className='p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-3'>
                <FiUpload className='w-5 h-5' />
                Bulk Import
              </button>
              <button className='p-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-3'>
                <FiSettings className='w-5 h-5' />
                System Settings
              </button>
            </div>
          </div>
        )}

        {activeTab === 'nfts' && (
          <div className='space-y-6'>
            <div className='flex justify-between items-center'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>NFT Management</h3>
              <div className='flex gap-2'>
                <button className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2'>
                  <FiUpload className='w-4 h-4' />
                  Bulk Actions
                </button>
                <button className='px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2'>
                  <FiDownload className='w-4 h-4' />
                  Export List
                </button>
              </div>
            </div>

            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                <thead className='bg-gray-50 dark:bg-gray-800'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      NFT Details
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Creator
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Price
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700'>
                  {nftItems.map((item) => (
                    <tr key={item.id}>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm font-medium text-gray-900 dark:text-white'>{item.name}</div>
                        <div className='text-sm text-gray-500 dark:text-gray-400'>ID: {item.id}</div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                        {item.creator}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white'>
                        {item.price} ETH
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                          item.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                          item.status === 'reported' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2'>
                        <button className='text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300'>
                          <FiEye className='w-4 h-4' />
                        </button>
                        <button className='text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'>
                          <FiEdit3 className='w-4 h-4' />
                        </button>
                        {item.status === 'banned' ? (
                          <button 
                            onClick={() => handleUnbanNFT(item.id)}
                            className='text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                          >
                            <FiUnlock className='w-4 h-4' />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleBanNFT(item.id)}
                            className='text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300'
                          >
                            <FiLock className='w-4 h-4' />
                          </button>
                        )}
                        <button 
                          onClick={() => handleRemoveNFT(item.id)}
                          className='text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                        >
                          <FiTrash2 className='w-4 h-4' />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>User Management</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              <div className='p-4 border border-gray-200 dark:border-gray-700 rounded-lg'>
                <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>Ban User</h4>
                <input 
                  type='text' 
                  placeholder='Enter wallet address'
                  className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                />
                <button className='w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition-colors'>
                  Ban User
                </button>
              </div>
              
              <div className='p-4 border border-gray-200 dark:border-gray-700 rounded-lg'>
                <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>Verify Creator</h4>
                <input 
                  type='text' 
                  placeholder='Enter wallet address'
                  className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                />
                <button className='w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors'>
                  Verify Creator
                </button>
              </div>
              
              <div className='p-4 border border-gray-200 dark:border-gray-700 rounded-lg'>
                <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>Set Admin</h4>
                <input 
                  type='text' 
                  placeholder='Enter wallet address'
                  className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                />
                <button className='w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition-colors'>
                  Grant Admin
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'finance' && (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Financial Management</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='p-6 border border-gray-200 dark:border-gray-700 rounded-lg'>
                <h4 className='font-semibold text-gray-900 dark:text-white mb-4'>Platform Fees</h4>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      Marketplace Fee (%)
                    </label>
                    <input 
                      type='number' 
                      defaultValue='2.5'
                      className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      Creator Royalty (%)
                    </label>
                    <input 
                      type='number' 
                      defaultValue='5.0'
                      className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                    />
                  </div>
                  <button className='w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-colors'>
                    Update Fees
                  </button>
                </div>
              </div>
              
              <div className='p-6 border border-gray-200 dark:border-gray-700 rounded-lg'>
                <h4 className='font-semibold text-gray-900 dark:text-white mb-4'>Withdraw Funds</h4>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      Available Balance
                    </label>
                    <p className='text-2xl font-bold text-green-600 dark:text-green-400'>15.2 ETH</p>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      Amount to Withdraw
                    </label>
                    <input 
                      type='number' 
                      placeholder='0.0'
                      className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                    />
                  </div>
                  <button className='w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors'>
                    Withdraw ETH
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>System Settings</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='p-6 border border-gray-200 dark:border-gray-700 rounded-lg'>
                <h4 className='font-semibold text-gray-900 dark:text-white mb-4'>Marketplace Settings</h4>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Maintenance Mode
                    </label>
                    <input type='checkbox' className='toggle' />
                  </div>
                  <div className='flex items-center justify-between'>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      New Registrations
                    </label>
                    <input type='checkbox' defaultChecked className='toggle' />
                  </div>
                  <div className='flex items-center justify-between'>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Auto-approve NFTs
                    </label>
                    <input type='checkbox' className='toggle' />
                  </div>
                </div>
              </div>
              
              <div className='p-6 border border-gray-200 dark:border-gray-700 rounded-lg'>
                <h4 className='font-semibold text-gray-900 dark:text-white mb-4'>Danger Zone</h4>
                <div className='space-y-4'>
                  <button className='w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded transition-colors'>
                    Clear All Cache
                  </button>
                  <button className='w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition-colors'>
                    Emergency Stop
                  </button>
                  <button className='w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded transition-colors'>
                    Database Backup
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
