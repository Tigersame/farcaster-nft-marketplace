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
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden w-full max-w-[180px] sm:max-w-[270px] h-[250px] sm:h-[340px] flex flex-col mx-auto"
    >
      {/* Image Container - 160x160px mobile, 250x250px desktop */}
      <div className="w-full h-[160px] sm:h-[250px] bg-gray-800 flex items-center justify-center relative overflow-hidden flex-shrink-0">
        {/* Placeholder for NFT image */}
        <img 
          src={image || '/placeholder-nft.png'} 
          alt={name} 
          className="w-full h-full object-cover" 
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23374151" width="100" height="100"/%3E%3Ctext x="50" y="55" font-size="40" text-anchor="middle" fill="%239CA3AF"%3E🖼️%3C/text%3E%3C/svg%3E'
          }} 
        />
      </div>
      
      {/* Card Content - Simplified Clean Design */}
      <div className="p-3 flex-1 flex flex-col justify-between bg-gray-900">
        {/* NFT Info */}
        <div>
          <div className="text-sm text-gray-300 font-semibold mb-1 truncate">{name}</div>
          <div className="text-xs text-gray-400">#{tokenId} • Base Collection</div>
        </div>
        
        {/* Price and Action */}
        <div className="flex items-center justify-between mt-3">
          <div className="text-xs text-gray-200 font-medium">{ethPrice} ETH</div>
          <button 
            onClick={onBuy}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition-colors"
          >
            Buy
          </button>
        </div>
      </div>
    </motion.div>
  )
}