import { motion } from 'framer-motion'
import { FiTrendingUp, FiArrowUp, FiArrowDown } from 'react-icons/fi'

interface TrendingCollection {
  rank: number
  name: string
  floorPrice: string
  change: number
  volume: string
  sales: number
  imageUrl?: string
}

export function TrendingCollections() {
  const trendingCollections: TrendingCollection[] = [
    {
      rank: 1,
      name: "Farcaster Genesis",
      floorPrice: "2.5",
      change: 15.2,
      volume: "125.5",
      sales: 45,
    },
    {
      rank: 2,
      name: "Base Builders",
      floorPrice: "1.0",
      change: 8.7,
      volume: "89.2",
      sales: 32,
    },
    {
      rank: 3,
      name: "Onchain Summer",
      floorPrice: "0.75",
      change: -2.1,
      volume: "67.8",
      sales: 28,
    },
    {
      rank: 4,
      name: "Frame Artists",
      floorPrice: "1.2",
      change: 22.4,
      volume: "45.6",
      sales: 19,
    },
    {
      rank: 5,
      name: "XMTP Pioneers",
      floorPrice: "0.9",
      change: 5.3,
      volume: "34.2",
      sales: 15,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <FiTrendingUp className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Trending Collections</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Top collections over last 24 hours</p>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {trendingCollections.map((collection, index) => (
          <motion.div
            key={collection.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              {/* Rank */}
              <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-semibold text-gray-700 dark:text-gray-300">
                {collection.rank}
              </div>

              {/* Collection Image */}
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white">
                <span className="text-lg">🎨</span>
              </div>

              {/* Collection Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-white truncate">{collection.name}</h3>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <span>Floor: {collection.floorPrice} ETH</span>
                  <span>Vol: {collection.volume} ETH</span>
                  <span>{collection.sales} sales</span>
                </div>
              </div>

              {/* Change */}
              <div className="flex items-center space-x-1">
                {collection.change >= 0 ? (
                  <FiArrowUp className="w-4 h-4 text-green-500" />
                ) : (
                  <FiArrowDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  collection.change >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {Math.abs(collection.change)}%
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900">
        <button className="w-full text-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors">
          View all collections
        </button>
      </div>
    </motion.div>
  )
}