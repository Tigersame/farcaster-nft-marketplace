import { motion } from 'framer-motion'
import { FiHeart, FiEye, FiTag, FiTrendingUp } from 'react-icons/fi'
import { FrameShare } from './FrameShare'

export interface NFTCardProps {
  tokenId: string
  name: string
  description: string
  image: string
  price: string
  ethPrice: string
  seller: string
  owner: string
  listedAt: string
  onBuy: () => void
  viewMode?: 'grid' | 'list'
}

export function NFTCard({ 
  tokenId, name, description, image, price, ethPrice, seller, owner, listedAt, onBuy, viewMode = 'grid' 
}: NFTCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl dark:shadow-gray-900/20 transition-all overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      <div className="aspect-square bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center relative group">
        {/* Placeholder for NFT image */}
        <div className="text-6xl">🖼️</div>
        
        {/* Hover overlay with stats */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-1 text-white text-sm">
            <FiEye className="w-4 h-4" />
            <span>234</span>
          </div>
          <div className="flex items-center space-x-1 text-white text-sm">
            <FiHeart className="w-4 h-4" />
            <span>12</span>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-1">{name}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{description}</p>
          </div>
          <div className="flex items-center space-x-1 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full">
            <FiTrendingUp className="w-3 h-3" />
            <span>Hot</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
              <FiTag className="w-3 h-3" />
              <span>Current Price</span>
            </div>
            <p className="font-bold text-xl text-blue-600 dark:text-blue-400">{ethPrice} ETH</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">${price}</p>
          </div>
        </div>

        <div className="flex space-x-3 mb-4">
          <button 
            onClick={onBuy}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-medium transition-all transform hover:scale-105"
          >
            Buy Now
          </button>
          
          <FrameShare tokenId={tokenId} nftName={name} />
        </div>
        
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div>
              <span>Owner: </span>
              <span className="font-mono text-gray-700 dark:text-gray-300">{owner.slice(0, 6)}...{owner.slice(-4)}</span>
            </div>
            <div className="text-right">
              <div>Listed {listedAt}</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}