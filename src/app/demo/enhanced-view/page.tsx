'use client'

import { useState } from 'react'
import EnhancedHeader from '@/components/EnhancedHeader'
import NftFilterBar from '@/components/NftFilterBar'
import SimpleNftCard from '@/components/SimpleNftCard'
import VerticalSnapView, { SnapItem } from '@/components/VerticalSnapView'
import DraggableIcons from '@/components/DraggableIcons'

// Mock NFT data
const mockNfts = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&h=400&fit=crop',
    title: 'Cosmic Nebula #001',
    collection: 'Base Genesis',
    chain: 'Base',
    price: '0.042 ETH',
    tokenId: '001',
    owner: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    likes: 42,
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=400&h=400&fit=crop',
    title: 'Farcaster Art #042',
    collection: 'Farcaster OG',
    chain: 'Base',
    price: '0.025 ETH',
    tokenId: '042',
    owner: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    likes: 128,
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',
    title: 'Base Builder Badge',
    collection: 'Builder Series',
    chain: 'Base',
    price: '0.015 ETH',
    tokenId: '123',
    owner: '0x1234567890123456789012345678901234567890',
    likes: 89,
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=400&h=400&fit=crop',
    title: 'OnchainKit Special',
    collection: 'Coinbase Kit',
    chain: 'Base',
    price: '0.038 ETH',
    tokenId: '456',
    owner: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    likes: 215,
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=400&h=400&fit=crop',
    title: 'Digital Dreams #777',
    collection: 'Dream Series',
    chain: 'Base',
    price: '0.055 ETH',
    tokenId: '777',
    owner: '0x9876543210987654321098765432109876543210',
    likes: 167,
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=400&h=400&fit=crop',
    title: 'Abstract Genesis',
    collection: 'Abstract Art',
    chain: 'Base',
    price: '0.032 ETH',
    tokenId: '999',
    owner: '0x5555555555555555555555555555555555555555',
    likes: 93,
  },
]

export default function EnhancedViewPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'snap'>('grid')
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [sortBy, setSortBy] = useState('newest')
  const [favoriteIcons, setFavoriteIcons] = useState(['⭐', '🔥', '💎', '🚀', '🎨'])
  
  const toggleView = () => {
    setViewMode(prev => prev === 'grid' ? 'snap' : 'grid')
  }
  
  const handleSearch = (query: string) => {
    console.log('Search query:', query)
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <EnhancedHeader onToggleView={toggleView} onSearch={handleSearch} />
      <NftFilterBar selected={selectedFilter} onSelect={setSelectedFilter} onSortChange={setSortBy} />
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Draggable Favorites Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Your Favorites (Drag to reorder)
          </h2>
          <DraggableIcons 
            initial={favoriteIcons} 
            onReorder={(items) => {
              setFavoriteIcons(items)
              // Save to localStorage
              localStorage.setItem('favorite_icons', JSON.stringify(items))
            }} 
          />
        </div>

        {/* Current View Indicator */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {selectedFilter} NFTs
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            View: {viewMode === 'grid' ? 'Grid' : 'Scroll Snap'}
          </span>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockNfts.map(nft => (
              <SimpleNftCard 
                key={nft.id} 
                nft={nft}
                onBuy={() => console.log('Buy', nft.id)}
                onList={() => console.log('List', nft.id)}
              />
            ))}
          </div>
        )}

        {/* Vertical Snap View */}
        {viewMode === 'snap' && (
          <VerticalSnapView>
            {mockNfts.map(nft => (
              <SnapItem key={nft.id}>
                <SimpleNftCard 
                  nft={nft}
                  onBuy={() => console.log('Buy', nft.id)}
                  onList={() => console.log('List', nft.id)}
                />
              </SnapItem>
            ))}
          </VerticalSnapView>
        )}

        {/* Info Section */}
        <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Features Implemented
          </h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span><strong>Enhanced Header:</strong> Sticky header with backdrop blur, search, and navigation badges</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span><strong>Filter Bar:</strong> Responsive filter chips with sort dropdown</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span><strong>NFT Cards:</strong> Hover previews showing detailed info, likes, chain badges</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span><strong>Drag-to-Reorder:</strong> Draggable favorites using @dnd-kit with localStorage persistence</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span><strong>Vertical Scroll Snap:</strong> One-scroll-per-page view with CSS scroll-snap</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span><strong>Accessibility:</strong> ARIA labels, keyboard navigation, focus states</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span><strong>Dark Mode:</strong> Full dark mode support with Tailwind</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
