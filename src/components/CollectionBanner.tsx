import { motion } from 'framer-motion'
import { FiTrendingUp, FiUsers, FiDollarSign, FiExternalLink, FiHeart, FiShare2 } from 'react-icons/fi'

interface CollectionBannerProps {
  name: string
  description: string
  totalItems: number
  totalOwners: number
  floorPrice: string
  volumeTraded: string
  imageUrl?: string
  bannerUrl?: string
}

export function CollectionBanner({
  name = "Farcaster Genesis Collection",
  description = "The original NFT collection celebrating the decentralized social future. Each piece represents a unique moment in Farcaster's journey on Base.",
  totalItems = 3,
  totalOwners = 3,
  floorPrice = "0.75",
  volumeTraded = "12.5",
  imageUrl,
  bannerUrl
}: Partial<CollectionBannerProps>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl mb-8"
    >
      {/* Banner Background */}
      <div className="h-60 md:h-80 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>

      {/* Collection Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-end md:space-x-6">
          {/* Collection Avatar */}
          <div className="relative mb-4 md:mb-0">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white dark:bg-gray-800 rounded-2xl border-4 border-white dark:border-gray-800 shadow-xl flex items-center justify-center">
              <span className="text-3xl md:text-4xl">🎨</span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>

          {/* Collection Details */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{name}</h1>
            <p className="text-blue-100 mb-4 max-w-2xl leading-relaxed">{description}</p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <div className="text-2xl font-bold text-white">{totalItems}</div>
                <div className="text-blue-200 text-sm">items</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{totalOwners}</div>
                <div className="text-blue-200 text-sm">owners</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{floorPrice} ETH</div>
                <div className="text-blue-200 text-sm">floor price</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{volumeTraded} ETH</div>
                <div className="text-blue-200 text-sm">volume traded</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button className="bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2">
                <FiHeart className="w-4 h-4" />
                <span>Add to Watchlist</span>
              </button>
              <button className="border border-white border-opacity-30 text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-colors flex items-center space-x-2">
                <FiShare2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button className="border border-white border-opacity-30 text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-colors flex items-center space-x-2">
                <FiExternalLink className="w-4 h-4" />
                <span>View on Basescan</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Top Right Actions */}
      <div className="absolute top-6 right-6 flex space-x-2">
        <button className="bg-black bg-opacity-30 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-opacity-50 transition-all">
          <FiShare2 className="w-5 h-5" />
        </button>
        <button className="bg-black bg-opacity-30 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-opacity-50 transition-all">
          <FiHeart className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  )
}