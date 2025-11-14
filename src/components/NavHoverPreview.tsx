'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { FiTrendingUp, FiTrendingDown, FiHeart, FiEye, FiDollarSign } from 'react-icons/fi'

interface PreviewNFT {
  id: string
  name: string
  image: string
  price: string
  priceChange?: number
  likes?: number
  views?: number
}

interface NavHoverPreviewProps {
  isVisible: boolean
  category: string
  position: { x: number; y: number }
  items?: PreviewNFT[]
}

export function NavHoverPreview({ isVisible, category, position, items }: NavHoverPreviewProps) {
  // Generate mock data based on category
  const getMockData = (): PreviewNFT[] => {
    switch (category) {
      case 'trending':
        return [
          { id: '1', name: 'Bored Ape #8547', image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=200', price: '42.5 ETH', priceChange: 15.3, likes: 234, views: 1523 },
          { id: '2', name: 'CryptoPunk #4156', image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=200', price: '38.2 ETH', priceChange: 8.7, likes: 456, views: 2341 },
          { id: '3', name: 'Azuki #9341', image: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=200', price: '12.1 ETH', priceChange: -3.2, likes: 189, views: 987 }
        ]
      case 'favorites':
        return [
          { id: '1', name: 'My Favorite #1', image: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?w=200', price: '5.5 ETH', likes: 23 },
          { id: '2', name: 'My Favorite #2', image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=200', price: '3.2 ETH', likes: 45 },
          { id: '3', name: 'My Favorite #3', image: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=200', price: '8.9 ETH', likes: 67 }
        ]
      case 'watchlist':
        return [
          { id: '1', name: 'Watching #1', image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=200', price: '15.2 ETH', priceChange: 5.3 },
          { id: '2', name: 'Watching #2', image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=200', price: '22.8 ETH', priceChange: -2.1 },
          { id: '3', name: 'Watching #3', image: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=200', price: '9.7 ETH', priceChange: 12.4 }
        ]
      case 'portfolio':
        return [
          { id: '1', name: 'My NFT #1', image: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?w=200', price: '7.5 ETH', priceChange: 18.2 },
          { id: '2', name: 'My NFT #2', image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=200', price: '4.3 ETH', priceChange: -5.4 },
          { id: '3', name: 'My NFT #3', image: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=200', price: '11.2 ETH', priceChange: 23.1 }
        ]
      case 'activity':
        return [
          { id: '1', name: 'Recent Sale', image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=200', price: '6.5 ETH', views: 234 },
          { id: '2', name: 'Recent Mint', image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=200', price: '2.1 ETH', views: 123 },
          { id: '3', name: 'Recent Transfer', image: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=200', price: '8.3 ETH', views: 456 }
        ]
      case 'collections':
        return [
          { id: '1', name: 'Top Collection #1', image: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?w=200', price: '25.5 ETH', priceChange: 45.3, views: 5234 },
          { id: '2', name: 'Top Collection #2', image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=200', price: '18.2 ETH', priceChange: 12.7, views: 3241 },
          { id: '3', name: 'Top Collection #3', image: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=200', price: '32.1 ETH', priceChange: -8.2, views: 4567 }
        ]
      default:
        return []
    }
  }

  const previewData = items || getMockData()

  if (!isVisible || previewData.length === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: -10 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.9, x: -10 }}
        transition={{ duration: 0.2 }}
        className="fixed z-[100] pointer-events-none"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-3 w-64 pointer-events-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white capitalize">
              {category === 'favorites' ? 'Your Favorites' : 
               category === 'watchlist' ? 'Your Watchlist' :
               category === 'portfolio' ? 'Your Portfolio' :
               category === 'activity' ? 'Recent Activity' :
               category === 'collections' ? 'Top Collections' :
               category === 'trending' ? 'Trending Now' : 'Recent Items'}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {previewData.length} items
            </span>
          </div>

          {/* Preview Items */}
          <div className="space-y-2">
            {previewData.slice(0, 3).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
              >
                {/* NFT Image */}
                <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="48px"
                  />
                  {index === 0 && (
                    <div className="absolute top-0 left-0 bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-br-lg">
                      #1
                    </div>
                  )}
                </div>

                {/* NFT Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {item.price}
                    </span>
                    {item.priceChange !== undefined && (
                      <div className={`flex items-center gap-0.5 ${
                        item.priceChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {item.priceChange >= 0 ? (
                          <FiTrendingUp className="w-2.5 h-2.5" />
                        ) : (
                          <FiTrendingDown className="w-2.5 h-2.5" />
                        )}
                        <span className="text-[10px] font-bold">
                          {Math.abs(item.priceChange).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-col items-end gap-0.5">
                  {item.likes !== undefined && (
                    <div className="flex items-center gap-1 text-pink-500">
                      <FiHeart className="w-2.5 h-2.5" />
                      <span className="text-[10px] font-semibold">{item.likes}</span>
                    </div>
                  )}
                  {item.views !== undefined && (
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <FiEye className="w-2.5 h-2.5" />
                      <span className="text-[10px] font-semibold">{item.views}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              View All →
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
