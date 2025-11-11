import { motion } from 'framer-motion'
import { FiHeart, FiEye, FiTag, FiTrendingUp, FiMoreHorizontal } from 'react-icons/fi'
import { FrameShare } from './FrameShare'
import { SimpleBasenameAddress } from './BasenameAddress'

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
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg dark:shadow-gray-900/20 transition-all overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        <div className="flex p-4">
          {/* Image */}
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center relative group flex-shrink-0">
            <div className="text-2xl">🖼️</div>
          </div>
          
          {/* Content */}
          <div className="flex-1 ml-4 flex justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">{name}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-1">{description}</p>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Owner: <SimpleBasenameAddress address={owner} className="text-gray-700 dark:text-gray-300" />
              </div>
            </div>
            
            {/* Price and Actions */}
            <div className="text-right flex flex-col justify-between">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Price</div>
                <div className="font-bold text-lg text-gray-900 dark:text-white">{ethPrice} ETH</div>
              </div>
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={onBuy}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  Buy Now
                </button>
                <FrameShare tokenId={tokenId} nftName={name} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl dark:shadow-gray-900/20 transition-all overflow-hidden border border-gray-200 dark:border-gray-700 group"
    >
      {/* Image Container - OpenSea Style */}
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center relative overflow-hidden">
        {/* Placeholder for NFT image */}
        <div className="text-6xl opacity-60">🖼️</div>
        
        {/* Hover overlay with interactions */}
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-3">
            <button className="bg-white bg-opacity-20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-opacity-30 transition-all">
              <FiEye className="w-5 h-5" />
            </button>
            <button className="bg-white bg-opacity-20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-opacity-30 transition-all">
              <FiHeart className="w-5 h-5" />
            </button>
            <button className="bg-white bg-opacity-20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-opacity-30 transition-all">
              <FiMoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <div className="bg-white dark:bg-gray-800 bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-900 dark:text-white">
            #{tokenId}
          </div>
          <div className="flex space-x-2">
            <div className="bg-blue-500 bg-opacity-90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <FiTrendingUp className="w-3 h-3" />
              <span>Hot</span>
            </div>
          </div>
        </div>

        {/* Bottom stats overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex space-x-3 text-white text-sm">
            <div className="flex items-center space-x-1 bg-black bg-opacity-40 backdrop-blur-sm px-2 py-1 rounded-full">
              <FiEye className="w-3 h-3" />
              <span>234</span>
            </div>
            <div className="flex items-center space-x-1 bg-black bg-opacity-40 backdrop-blur-sm px-2 py-1 rounded-full">
              <FiHeart className="w-3 h-3" />
              <span>12</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Card Content - OpenSea Style */}
      <div className="p-4">
        {/* Collection and Title */}
        <div className="mb-3">
          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1 uppercase tracking-wide">
            Base Collection
          </div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1 line-clamp-1">{name}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed">{description}</p>
        </div>
        
        {/* Price Section */}
        <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current price</div>
              <div className="flex items-baseline space-x-1">
                <span className="font-bold text-xl text-gray-900 dark:text-white">{ethPrice}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">ETH</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">${price}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last sale</div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{(parseFloat(ethPrice) * 0.8).toFixed(2)} ETH</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 mb-3">
          <button 
            onClick={onBuy}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Buy now
          </button>
          <button className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-3 rounded-xl font-semibold transition-colors">
            Make offer
          </button>
        </div>

        {/* Share and Sell NFT Buttons */}
        <div className="mb-3 flex space-x-2">
          <div className="flex-1">
            <FrameShare tokenId={tokenId} nftName={name} />
          </div>
          <button className="flex-1 border border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center">
            <FiTag className="w-4 h-4 mr-2" />
            Sell NFT
          </button>
        </div>
        
        {/* Owner Info */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Owned by</div>
                <SimpleBasenameAddress address={owner} className="text-gray-700 dark:text-gray-300 text-sm" />
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 dark:text-gray-400">Listed</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">{new Date(listedAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}