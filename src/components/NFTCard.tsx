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
      whileHover={{ y: -4, scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl dark:shadow-gray-900/20 transition-all overflow-hidden border border-gray-200 dark:border-gray-700 group w-full max-w-[180px] sm:max-w-[270px] h-[250px] sm:h-[340px] flex flex-col mx-auto"
    >
      {/* Image Container - OpenSea Style - 160x160px mobile, 250x250px desktop */}
      <div className="w-full h-[160px] sm:h-[250px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center relative overflow-hidden flex-shrink-0">
        {/* Placeholder for NFT image */}
        <div className="text-4xl sm:text-5xl opacity-60">🖼️</div>
        
        {/* Hover overlay with interactions */}
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-2">
            <button className="bg-white bg-opacity-20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-opacity-30 transition-all">
              <FiEye className="w-4 h-4" />
            </button>
            <button className="bg-white bg-opacity-20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-opacity-30 transition-all">
              <FiHeart className="w-4 h-4" />
            </button>
            <button className="bg-white bg-opacity-20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-opacity-30 transition-all">
              <FiMoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top badges */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          <div className="bg-white dark:bg-gray-800 bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-900 dark:text-white">
            #{tokenId}
          </div>
          <div className="flex space-x-1.5">
            <div className="bg-blue-500 bg-opacity-90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <FiTrendingUp className="w-3 h-3" />
              <span>Hot</span>
            </div>
          </div>
        </div>

        {/* Bottom stats overlay */}
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex space-x-2 text-white text-xs">
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
      
      {/* Card Content - OpenSea Style - Fixed height for remaining 90px */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        {/* Collection and Title */}
        <div className="mb-2">
          <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mb-0.5 uppercase tracking-wide">
            Base Collection
          </div>
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-0.5 line-clamp-1">{name}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-xs line-clamp-1 leading-tight">{description}</p>
        </div>
        
        {/* Price and Action - Compact */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">
            <div className="text-[10px] text-gray-500 dark:text-gray-400">Price</div>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-sm text-gray-900 dark:text-white">{ethPrice}</span>
              <span className="text-[10px] text-gray-600 dark:text-gray-400">ETH</span>
            </div>
          </div>
          <button 
            onClick={onBuy}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105"
          >
            Buy
          </button>
        </div>
      </div>
    </motion.div>
  )
}