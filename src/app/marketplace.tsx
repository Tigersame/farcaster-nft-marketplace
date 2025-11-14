'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import EnhancedHeader from '@/components/EnhancedHeader'
import NFTCardOptimized from '@/components/NFTCardOptimized'
import RefinedNftCard from '@/components/RefinedNftCard'
import SimpleNftCard from '@/components/SimpleNftCard'
import NftFilterBar from '@/components/NftFilterBar'
import Pagination from '@/components/Pagination'
import VerticalSnapView, { SnapItem } from '@/components/VerticalSnapView'
import DraggableIcons from '@/components/DraggableIcons'
import { getCategoryBlurDataURL } from '@/lib/blurDataURL'
import SignInWithBase from '@/components/SignInWithBase'
import SpendPermissionSetup from '@/components/SpendPermissionSetup'
import SpendPermissionManager from '@/components/SpendPermissionManager'
import ChatInterface from '@/components/ChatInterface'
import { useAccount, useBalance, useEnsName } from 'wagmi'
import { base } from 'viem/chains'
import { Name, Avatar, Identity, Address } from '@coinbase/onchainkit/identity'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useListNFT } from '@/lib/contracts/useMarketplace'
import { useVerifiedNFTs, useNFTsByCategory } from '@/hooks/useMultiContractNFTs'
import { BASE_NFT_CONTRACTS, getContractsByCategory } from '@/lib/nftContracts'
import { useOptimisticUI } from '@/lib/optimistic-ui'
import { trackNFTView, trackBuyClick, trackSearch } from '@/lib/analytics'
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
  const { listNFT, isLoading: isListing, isSuccess: listingSuccess } = useListNFT()
  
  // Prevent hydration errors
  const [mounted, setMounted] = useState(false)
  
  // Optimistic UI hook
  const { isPending, startAction, confirmAction, failAction } = useOptimisticUI()
  
  // Listing form state
  const [listingForm, setListingForm] = useState({
    tokenId: '',
    price: ''
  })
  
  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'snap'>('grid')
  const [favoriteIcons, setFavoriteIcons] = useState(['⭐', '🔥', '💎', '🚀', '🎨'])
  
  // Collection selection state
  const [selectedCollection, setSelectedCollection] = useState<'all' | string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  
  // Randomize items on mount to shuffle NFT order across pages
  useEffect(() => {
    if (mounted) {
      setMarketItems(prev => {
        const shuffled = [...prev]
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        return shuffled
      })
    }
  }, [mounted])
  
  // Set mounted after hydration
  useEffect(() => {
    setMounted(true)
    
    // Load favorites from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('favorite_icons')
      if (saved) {
        try {
          setFavoriteIcons(JSON.parse(saved))
        } catch (e) {
          console.error('Failed to load favorites:', e)
        }
      }
    }
  }, [])
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (mounted) {
      trackSearch(query, filteredItems.length)
    }
  }
  
  // DISABLED: Fetch NFTs based on selection - Using demo data only for performance
  // const { nfts: verifiedNFTs, loading: verifiedLoading, error: verifiedError } = useVerifiedNFTs(4)
  // const { nfts: categoryNFTs, loading: categoryLoading, error: categoryError } = useNFTsByCategory(selectedCategory || 'Gaming', 3)
  // const { nfts: singleCollectionNFTs, loading: singleLoading, error: singleError, hasMore, loadMore } = useBaseNFTs(
  //   selectedCollection !== 'all' ? selectedCollection : ''
  // )
  
  // Use static demo data - no API calls
  const verifiedNFTs: any[] = []
  const verifiedLoading = false
  const verifiedError = null
  const categoryNFTs: any[] = []
  const categoryLoading = false
  const categoryError = null
  const singleCollectionNFTs: any[] = []
  const singleLoading = false
  const singleError = null
  const hasMore = false
  const loadMore = () => {}
  
  const [marketItems, setMarketItems] = useState<NFTItem[]>([
    // Show demo data immediately - no loading
    {
      tokenId: '1',
      name: 'Base Genesis NFT #001',
      description: 'Limited edition Base network genesis collection',
      image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&h=400&fit=crop',
      price: '5000000000000000',
      seller: '0x0000000000000000000000000000000000000000',
      owner: '0x0000000000000000000000000000000000000000',
      ethPrice: '0.005',
      listedAt: new Date().toISOString(),
    },
    {
      tokenId: '2',
      name: 'Farcaster Art #042',
      description: 'Exclusive Farcaster community artwork',
      image: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=400&h=400&fit=crop',
      price: '3800000000000000',
      seller: '0x0000000000000000000000000000000000000000',
      owner: '0x0000000000000000000000000000000000000000',
      ethPrice: '0.0038',
      listedAt: new Date().toISOString(),
    },
    {
      tokenId: '3',
      name: 'Base Builder Badge',
      description: 'Official Base network builder badge',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',
      price: '2500000000000000',
      seller: '0x0000000000000000000000000000000000000000',
      owner: '0x0000000000000000000000000000000000000000',
      ethPrice: '0.0025',
      listedAt: new Date().toISOString(),
    },
    {
      tokenId: '4',
      name: 'OnchainKit NFT',
      description: 'Powered by Coinbase OnchainKit',
      image: 'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=400&h=400&fit=crop',
      price: '4200000000000000',
      seller: '0x0000000000000000000000000000000000000000',
      owner: '0x0000000000000000000000000000000000000000',
      ethPrice: '0.0042',
      listedAt: new Date().toISOString(),
    },
    {
      tokenId: '5',
      name: 'Crypto Punk Style #005',
      description: 'Pixelated avatar NFT collection',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=400&fit=crop',
      price: '6500000000000000',
      seller: '0x0000000000000000000000000000000000000000',
      owner: '0x0000000000000000000000000000000000000000',
      ethPrice: '0.0065',
      listedAt: new Date().toISOString(),
    },
    {
      tokenId: '6',
      name: 'Abstract Dreams #128',
      description: 'Modern abstract digital art',
      image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&h=400&fit=crop',
      price: '3200000000000000',
      seller: '0x0000000000000000000000000000000000000000',
      owner: '0x0000000000000000000000000000000000000000',
      ethPrice: '0.0032',
      listedAt: new Date().toISOString(),
    },
    {
      tokenId: '7',
      name: 'Neon City #077',
      description: 'Cyberpunk cityscape collection',
      image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&h=400&fit=crop',
      price: '4800000000000000',
      seller: '0x0000000000000000000000000000000000000000',
      owner: '0x0000000000000000000000000000000000000000',
      ethPrice: '0.0048',
      listedAt: new Date().toISOString(),
    },
    {
      tokenId: '8',
      name: 'Digital Portrait #213',
      description: 'AI-generated portrait series',
      image: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=400&h=400&fit=crop',
      price: '2900000000000000',
      seller: '0x0000000000000000000000000000000000000000',
      owner: '0x0000000000000000000000000000000000000000',
      ethPrice: '0.0029',
      listedAt: new Date().toISOString(),
    },
    {
      tokenId: '9',
      name: 'Space Explorer #099',
      description: 'Cosmic adventure NFT series',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',
      price: '5500000000000000',
      seller: '0x0000000000000000000000000000000000000000',
      owner: '0x0000000000000000000000000000000000000000',
      ethPrice: '0.0055',
      listedAt: new Date().toISOString(),
    },
    {
      tokenId: '10',
      name: 'Geometric Art #155',
      description: 'Mathematical beauty in NFT form',
      image: 'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=400&h=400&fit=crop',
      price: '3600000000000000',
      seller: '0x0000000000000000000000000000000000000000',
      owner: '0x0000000000000000000000000000000000000000',
      ethPrice: '0.0036',
      listedAt: new Date().toISOString(),
    },
    {
      tokenId: '11',
      name: 'Nature Spirit #088',
      description: 'Organic forms and natural beauty',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=400&fit=crop',
      price: '4100000000000000',
      seller: '0x0000000000000000000000000000000000000000',
      owner: '0x0000000000000000000000000000000000000000',
      ethPrice: '0.0041',
      listedAt: new Date().toISOString(),
    },
    {
      tokenId: '12',
      name: 'Urban Legend #244',
      description: 'Street art meets blockchain',
      image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&h=400&fit=crop',
      price: '3900000000000000',
      seller: '0x0000000000000000000000000000000000000000',
      owner: '0x0000000000000000000000000000000000000000',
      ethPrice: '0.0039',
      listedAt: new Date().toISOString(),
    },
    {
      tokenId: '13',
      name: 'Future Vision #312',
      description: 'Futuristic concept art collection',
      image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&h=400&fit=crop',
      price: '5200000000000000',
      seller: '0x0000000000000000000000000000000000000000',
      owner: '0x0000000000000000000000000000000000000000',
      ethPrice: '0.0052',
      listedAt: new Date().toISOString(),
    },
    {
      tokenId: '14',
      name: 'Retro Wave #177',
      description: 'Nostalgic 80s aesthetic NFTs',
      image: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=400&h=400&fit=crop',
      price: '2800000000000000',
      seller: '0x0000000000000000000000000000000000000000',
      owner: '0x0000000000000000000000000000000000000000',
      ethPrice: '0.0028',
      listedAt: new Date().toISOString(),
    },
    {
      tokenId: '15',
      name: 'Ocean Depths #423',
      description: 'Underwater world exploration',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',
      price: '4600000000000000',
      seller: '0x0000000000000000000000000000000000000000',
      owner: '0x0000000000000000000000000000000000000000',
      ethPrice: '0.0046',
      listedAt: new Date().toISOString(),
    },
    {
      tokenId: '16',
      name: 'Crystal Dreams #091',
      description: 'Gemstone-inspired digital art',
      image: 'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=400&h=400&fit=crop',
      price: '3400000000000000',
      seller: '0x0000000000000000000000000000000000000000',
      owner: '0x0000000000000000000000000000000000000000',
      ethPrice: '0.0034',
      listedAt: new Date().toISOString(),
    },
    {
      tokenId: '17',
      name: 'Pixel Warriors #256',
      description: '8-bit gaming nostalgia',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=400&fit=crop',
      price: '4400000000000000',
      seller: '0x0000000000000000000000000000000000000000',
      owner: '0x0000000000000000000000000000000000000000',
      ethPrice: '0.0044',
      listedAt: new Date().toISOString(),
    },
    {
      tokenId: '18',
      name: 'Cosmic Energy #501',
      description: 'Universal forces visualized',
      image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&h=400&fit=crop',
      price: '5900000000000000',
      seller: '0x0000000000000000000000000000000000000000',
      owner: '0x0000000000000000000000000000000000000000',
      ethPrice: '0.0059',
      listedAt: new Date().toISOString(),
    },
  ])
  const [loading, setLoading] = useState(false) // No loading - demo data only
  const error = verifiedError || categoryError || singleError
  const [activeView, setActiveView] = useState('all')
  const [copied, setCopied] = useState(false)
  
  // Filter NFTs based on search
  const filteredItems = marketItems.filter(item => {
    if (!searchQuery) return true
    const search = searchQuery.toLowerCase()
    return (
      item.name.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search)
    )
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedItems = filteredItems.slice(startIndex, endIndex)

  // Reset to page 1 when search or filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedFilter, sortBy])

  // Scroll to top when page changes
  useEffect(() => {
    if (mounted && currentPage > 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [currentPage, mounted])

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

  // Load NFTs from Base chain based on selection - DISABLED for performance
  useEffect(() => {
    // Always show demo data immediately - no API calls
    setLoading(false)
    
    /* DISABLED: RPC calls causing slow loading
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

    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        setLoading(false)
        if (marketItems.length === 0) {
          setMarketItems([
            {
              tokenId: '1',
              name: 'Base Genesis NFT',
              description: 'Limited edition Base network genesis collection',
              image: 'https://via.placeholder.com/400x400.png?text=Base+NFT+1',
              price: '5000000000000000',
              seller: '0x0000000000000000000000000000000000000000',
              owner: '0x0000000000000000000000000000000000000000',
              ethPrice: '0.005',
              listedAt: new Date().toISOString(),
            },
            {
              tokenId: '2',
              name: 'Farcaster Art #42',
              description: 'Exclusive Farcaster community artwork',
              image: 'https://via.placeholder.com/400x400.png?text=Farcaster+Art',
              price: '3800000000000000',
              seller: '0x0000000000000000000000000000000000000000',
              owner: '0x0000000000000000000000000000000000000000',
              ethPrice: '0.0038',
              listedAt: new Date().toISOString(),
            },
          ])
        }
      }
    }, 1500)

    if (!isLoading && nftsToDisplay.length > 0) {
      clearTimeout(loadingTimeout)
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
      clearTimeout(loadingTimeout)
      setMarketItems([])
      setLoading(false)
    } else {
      setLoading(isLoading)
    }

    return () => clearTimeout(loadingTimeout)
    */
  }, [selectedCollection, selectedCategory])

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
    <div className="min-h-screen bg-[#0b0b0b] transition-colors duration-300 pt-16">
      {/* Main Content */}
      <div>
        <EnhancedHeader 
          onToggleView={() => setViewMode(prev => {
            if (prev === 'grid') return 'snap'
            if (prev === 'snap') return 'list'
            return 'grid'
          })}
          onSearch={handleSearch}
        />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        {activeView === 'all' && mounted && (
          <div className="mb-6">
            <NftFilterBar
              selected={selectedFilter}
              onSelect={(filter: string) => {
                setSelectedFilter(filter)
                trackSearch(filter, marketItems.length)
              }}
              onSortChange={setSortBy}
            />
          </div>
        )}

        {/* All NFTs View - Default */}
        {activeView === 'all' && (
          <>
            {/* Draggable Favorites Section */}
            {mounted && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Your Favorites (Drag to reorder)
                </h2>
                <DraggableIcons 
                  initial={favoriteIcons} 
                  onReorder={(items) => {
                    setFavoriteIcons(items)
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('favorite_icons', JSON.stringify(items))
                    }
                  }} 
                />
              </div>
            )}

            {/* View Mode Indicator */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                {searchQuery && (
                  <div className="text-sm text-gray-400">
                    Found {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} for "{searchQuery}"
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                View: {viewMode === 'grid' ? 'Grid' : viewMode === 'snap' ? 'Scroll Snap' : 'List'}
              </span>
            </div>
            
            {/* Grid View */}
            {viewMode === 'grid' && (
              <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
              >
                {paginatedItems.map((item, index) => {
                  const nftData = {
                    id: item.tokenId,
                    image: item.image,
                    title: item.name,
                    description: item.description,
                    collection: 'FarcasterSea',
                    chain: 'Base',
                    price: `${item.ethPrice} ETH`,
                    tokenId: item.tokenId,
                    owner: item.owner,
                    // Deterministic likes based on tokenId (avoids hydration error)
                    likes: (parseInt(item.tokenId) * 37) % 200 + 1,
                  }

                  return (
                    <motion.div
                      key={item.tokenId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      onClick={() => mounted && trackNFTView(item.tokenId, 'FarcasterSea', 'marketplace')}
                    >
                      <SimpleNftCard 
                        nft={nftData}
                        onBuy={() => {
                          trackBuyClick(item.tokenId, item.ethPrice, 'FarcasterSea')
                          // Handle buy logic here
                        }}
                        onList={() => {
                          router.push(`/nft/${item.tokenId}`)
                        }}
                      />
                    </motion.div>
                  )
                })}
              </motion.div>
              
              {/* Pagination */}
              {filteredItems.length > itemsPerPage && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredItems.length}
                  showItemsInfo={true}
                />
              )}
              </>
            )}

            {/* Vertical Snap View */}
            {viewMode === 'snap' && (
              <>
                <VerticalSnapView>
                  {paginatedItems.map((item, index) => {
                    const nftData = {
                      id: item.tokenId,
                      image: item.image,
                      title: item.name,
                      description: item.description,
                      collection: 'FarcasterSea',
                      chain: 'Base',
                      price: `${item.ethPrice} ETH`,
                      tokenId: item.tokenId,
                      owner: item.owner,
                      // Deterministic likes based on tokenId (avoids hydration error)
                      likes: (parseInt(item.tokenId) * 37) % 200 + 1,
                    }

                    return (
                      <SnapItem key={item.tokenId}>
                        <SimpleNftCard 
                          nft={nftData}
                          onBuy={() => {
                            trackBuyClick(item.tokenId, item.ethPrice, 'FarcasterSea')
                            // Handle buy logic here
                          }}
                          onList={() => {
                            router.push(`/nft/${item.tokenId}`)
                          }}
                        />
                      </SnapItem>
                    )
                  })}
                </VerticalSnapView>
                
                {/* Pagination */}
                {filteredItems.length > itemsPerPage && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredItems.length}
                    showItemsInfo={true}
                  />
                )}
              </>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  {paginatedItems.map((item, index) => {
                    const nftData = {
                      id: item.tokenId,
                      image: item.image,
                      title: item.name,
                      description: item.description,
                      collection: 'FarcasterSea',
                      chain: 'Base',
                      price: `${item.ethPrice} ETH`,
                      owner: item.owner,
                      mintDate: item.listedAt,
                    }

                    return (
                      <motion.div
                        key={item.tokenId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.03 }}
                        onClick={() => mounted && trackNFTView(item.tokenId, 'FarcasterSea', 'marketplace')}
                      >
                        <RefinedNftCard 
                          nft={nftData}
                          onBuy={(nft) => {
                            trackBuyClick(nft.id, nft.price, nft.collection)
                            // Handle buy logic here
                          }}
                          onOpen={(nft) => {
                            router.push(`/nft/${nft.id}`)
                          }}
                          pending={mounted ? isPending(item.tokenId) : false}
                        />
                      </motion.div>
                    )
                  })}
                </motion.div>
                
                {/* Pagination */}
                {filteredItems.length > itemsPerPage && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredItems.length}
                    showItemsInfo={true}
                  />
                )}
              </>
            )}
          </>
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
            className="nft-grid"
            role="list"
            aria-label="NFT marketplace grid view"
          >
            {marketItems.map((item, index) => {
              const nftData = {
                id: item.tokenId,
                image: item.image,
                title: item.name,
                description: item.description,
                collection: 'FarcasterSea',
                chain: 'Base',
                price: `${item.ethPrice} ETH`,
                owner: item.owner,
                mintDate: item.listedAt,
              }

              return (
                <motion.div
                  key={item.tokenId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <RefinedNftCard 
                    nft={nftData}
                    onBuy={(nft) => {
                      if (!isConnected) {
                        alert('Please connect your wallet to buy NFTs')
                        return
                      }
                      trackBuyClick(nft.id, nft.price, nft.collection)
                      // Handle buy logic
                      console.log('Buying NFT:', nft)
                    }}
                    onOpen={(nft) => router.push(`/nft/${nft.id}`)}
                    pending={mounted ? isPending(item.tokenId) : false}
                  />
                </motion.div>
              )
            })}
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
              <h2 className="text-3xl font-bold text-white mb-6">Sell Your NFT</h2>
              <p className="text-gray-400 mb-6">List your NFT for sale on the marketplace</p>
              
              <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault()
                const contractAddress = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT
                
                if (!contractAddress || contractAddress === '0x5FbDB2315678afecb367f032d93F642f64180aa3') {
                  // Demo mode
                  alert(`NFT listing submitted! (Demo mode)\n\nToken ID: ${listingForm.tokenId}\nPrice: ${listingForm.price} ETH`)
                } else {
                  // Real on-chain listing
                  listNFT(listingForm.tokenId, listingForm.price)
                }
              }}>
                {/* Token ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Token ID
                  </label>
                  <input
                    type="text"
                    placeholder="1"
                    value={listingForm.tokenId}
                    onChange={(e) => setListingForm({...listingForm, tokenId: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">The token ID of the NFT you want to sell</p>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price (ETH)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    placeholder="0.05"
                    value={listingForm.price}
                    onChange={(e) => setListingForm({...listingForm, price: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Price in ETH (e.g., 0.05)</p>
                </div>

                {/* Fee Info */}
                {listingForm.price && parseFloat(listingForm.price) > 0 && (
                  <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">Listing Price</span>
                      <span className="text-white font-medium">{listingForm.price} ETH</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">Platform Fee (2.5%)</span>
                      <span className="text-gray-400">{(parseFloat(listingForm.price) * 0.025).toFixed(4)} ETH</span>
                    </div>
                    <div className="border-t border-blue-700/30 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-white font-semibold">You'll receive</span>
                        <span className="text-green-400 font-bold">{(parseFloat(listingForm.price) * 0.975).toFixed(4)} ETH</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isListing}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-105 disabled:scale-100"
                >
                  <div className="flex items-center justify-center gap-2">
                    {isListing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Listing...</span>
                      </>
                    ) : (
                      <>
                        <FiDollarSign className="w-5 h-5" />
                        List NFT for Sale
                      </>
                    )}
                  </div>
                </button>

                {listingSuccess && (
                  <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                    <p className="text-green-400 font-medium">✅ NFT listed successfully!</p>
                  </div>
                )}
              </form>

              {/* Info Box */}
              <div className="mt-6 bg-blue-900/20 border border-blue-700/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="text-blue-400 mt-1">ℹ️</div>
                  <div className="text-sm text-gray-300">
                    <p className="font-semibold text-blue-300 mb-1">How to sell:</p>
                    <ul className="space-y-1 text-gray-400">
                      <li>• Enter your NFT contract address and token ID</li>
                      <li>• Set your desired price in ETH</li>
                      <li>• Approve the marketplace contract (one-time)</li>
                      <li>• List your NFT and wait for buyers!</li>
                    </ul>
                  </div>
                </div>
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
                <NFTCardOptimized 
                  token={{
                    id: item.tokenId,
                    name: item.name,
                    collection: 'Trending Collection',
                    image: item.image,
                    blurDataURL: getCategoryBlurDataURL('Art'),
                    price: item.ethPrice,
                    description: item.description,
                    verified: true,
                  }}
                />
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
                <NFTCardOptimized 
                  key={item.tokenId}
                  token={{
                    id: item.tokenId,
                    name: item.name,
                    collection: 'Analytics Collection',
                    image: item.image,
                    blurDataURL: getCategoryBlurDataURL('Art'),
                    price: item.ethPrice,
                    description: item.description,
                    verified: true,
                  }}
                />
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
                <NFTCardOptimized 
                  token={{
                    id: item.tokenId,
                    name: item.name,
                    collection: 'FarcasterSea',
                    image: item.image,
                    blurDataURL: getCategoryBlurDataURL('Art'),
                    price: item.ethPrice,
                    description: item.description,
                    verified: true,
                  }}
                />
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
            {marketItems.slice(0, 4).map((item, index) => (
              <motion.div
                key={item.tokenId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <NFTCardOptimized 
                  token={{
                    id: item.tokenId,
                    name: item.name,
                    collection: 'Featured Collection',
                    image: item.image,
                    blurDataURL: getCategoryBlurDataURL('Collectibles'),
                    price: item.ethPrice,
                    description: item.description,
                    verified: true,
                  }}
                />
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

      </div>
    </div>
  )
}