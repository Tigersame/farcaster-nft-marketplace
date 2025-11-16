'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import NavigationBar from '@/components/NavigationBar'
import { BASE_NFT_CONTRACTS } from '@/lib/nftContracts'
import { FiCheckCircle, FiExternalLink, FiGlobe, FiTwitter } from 'react-icons/fi'
import { EmbedMetaTags } from '@/components/EmbedMetaTags'

export const dynamic = 'force-dynamic'

export default function CollectionsPage() {
  const router = useRouter()

  const handleCollectionClick = (address: string) => {
    router.push(`/collection/${address}`)
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b]">
      {/* Embed Metadata */}
      <EmbedMetaTags
        imageUrl="https://farcastmints.com/screenshots/marketplace.png"
        buttonTitle="Browse Collections"
        url="https://farcastmints.com/collections"
      />
      
      <NavigationBar title="Collections" />
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-lg sm:text-xl font-bold text-white mb-2">
              Verified Collections
            </h1>
            <p className="text-sm text-gray-300 mb-4 max-w-2xl mx-auto">
              Browse curated NFT collections on Base chain. All collections are verified and actively traded.
            </p>
            <div className="flex justify-center gap-4">
              <div className="bg-gray-800 px-4 py-2 rounded-xl">
                <div className="text-lg font-bold text-white">{BASE_NFT_CONTRACTS.length}</div>
                <div className="text-xs text-gray-400">Collections</div>
              </div>
              <div className="bg-gray-800 px-4 py-2 rounded-xl">
                <div className="text-lg font-bold text-white">
                  {BASE_NFT_CONTRACTS.reduce((sum, c) => sum + (c.totalSupply || 0), 0).toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">Total NFTs</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BASE_NFT_CONTRACTS.map((collection, index) => (
            <motion.div
              key={collection.address}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => handleCollectionClick(collection.address)}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-blue-500 transition-all cursor-pointer group"
            >
              {/* Collection Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                    {collection.symbol.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {collection.name}
                      </h3>
                      {collection.verified && (
                        <FiCheckCircle className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{collection.symbol}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                {collection.description}
              </p>

              {/* Category Badge */}
              <div className="mb-4">
                <span className="bg-blue-600/20 text-blue-400 text-xs px-3 py-1 rounded-full">
                  {collection.category}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {collection.floorPrice && (
                  <div>
                    <div className="text-lg font-bold text-white">{collection.floorPrice} ETH</div>
                    <div className="text-xs text-gray-400">Floor Price</div>
                  </div>
                )}
                {collection.totalSupply && (
                  <div>
                    <div className="text-lg font-bold text-white">{collection.totalSupply.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">Total Supply</div>
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="flex gap-2 pt-4 border-t border-gray-800">
                {collection.website && (
                  <a
                    href={collection.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    <FiGlobe className="w-4 h-4" />
                    Website
                  </a>
                )}
                {collection.twitter && (
                  <a
                    href={collection.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    <FiTwitter className="w-4 h-4" />
                    Twitter
                  </a>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCollectionClick(collection.address)
                  }}
                  className="ml-auto flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors text-sm font-semibold"
                >
                  View Collection
                  <FiExternalLink className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
