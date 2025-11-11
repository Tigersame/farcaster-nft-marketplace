'use client'

import { motion } from 'framer-motion'
import { FiHeart, FiEye, FiTag, FiTrendingUp, FiMoreHorizontal } from 'react-icons/fi'
import { FrameShare } from './FrameShare'
import { SimpleBasenameAddress } from './BasenameAddress'
import { ArrowSvg, BaseSvg } from './svg'

export interface EnhancedNFTCardProps {
  tokenId: string
  contractAddress?: string
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
  showOnchainInfo?: boolean
}

export function EnhancedNFTCard({ 
  tokenId, 
  contractAddress = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT || '0xE4241917A3B75C761C87BE335F392e220F67afCf',
  name, 
  description, 
  image, 
  price, 
  ethPrice, 
  seller, 
  owner, 
  listedAt, 
  onBuy, 
  viewMode = 'grid',
  showOnchainInfo = false
}: EnhancedNFTCardProps) {

  // List view with enhanced Base chain info
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
            {image ? (
              <img src={image} alt={name} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <div className="text-2xl">🖼️</div>
            )}
            {showOnchainInfo && (
              <div className="absolute -top-1 -right-1">
                <BaseSvg className="w-5 h-5" />
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 ml-4 flex justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{name}</h3>
                {showOnchainInfo && (
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                    Base
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-1">{description}</p>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Owner: <SimpleBasenameAddress address={owner} className="text-gray-700 dark:text-gray-300" />
              </div>
              {showOnchainInfo && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Contract: {contractAddress.slice(0, 8)}...{contractAddress.slice(-6)}
                </div>
              )}
            </div>
            
            {/* Price and Actions */}
            <div className="text-right flex flex-col justify-between">
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">{ethPrice} ETH</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">${price}</div>
              </div>
              <button 
                onClick={onBuy}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1"
              >
                Buy now <ArrowSvg direction="right" className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Grid view (default) with enhanced Base chain features
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg dark:shadow-gray-900/20 transition-all overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      {/* Image Container */}
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 relative group overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">🖼️</div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-3">
            <button className="p-3 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all">
              <FiEye className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-3 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all">
              <FiHeart className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-3 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all">
              <FiMoreHorizontal className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
        
        {/* Top Right Icons */}
        <div className="absolute top-3 right-3 flex space-x-2">
          <div className="px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded-full">
            #{tokenId}
          </div>
          {showOnchainInfo && (
            <div className="p-1 bg-blue-600 bg-opacity-90 rounded-full">
              <BaseSvg className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex-1">{name}</h3>
          {showOnchainInfo && (
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full ml-2">
              Base
            </span>
          )}
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{description}</p>
        
        {/* Contract Info (if enabled) */}
        {showOnchainInfo && (
          <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Contract:</span>
              <span className="text-gray-700 dark:text-gray-300 font-mono">
                {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
              </span>
            </div>
          </div>
        )}
        
        {/* Price */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-600 dark:text-gray-300">Current price</span>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{ethPrice} ETH</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">${price}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 mb-3">
          <button 
            onClick={onBuy}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            Buy now <ArrowSvg direction="right" className="w-4 h-4" />
          </button>
          <button className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-3 rounded-xl font-semibold transition-colors">
            Make offer
          </button>
        </div>

        <div className="mb-3">
          <FrameShare tokenId={tokenId} nftName={name} />
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