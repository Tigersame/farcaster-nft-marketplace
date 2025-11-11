'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { NFTCard } from '@/components/NFTCard'
import { useBaseNFTs } from '@/hooks/useBaseNFTs'
import { getContractByAddress } from '@/lib/nftContracts'
import { FiArrowLeft, FiExternalLink, FiGlobe, FiTwitter } from 'react-icons/fi'

export default function CollectionPage() {
  const params = useParams()
  const router = useRouter()
  const address = params?.address as string

  // Get collection info
  const collection = getContractByAddress(address)
  const { nfts, loading, error, hasMore, loadMore } = useBaseNFTs(address)

  const [marketItems, setMarketItems] = useState<any[]>([])

  useEffect(() => {
    if (nfts.length > 0) {
      const transformed = nfts.map(nft => ({
        tokenId: nft.tokenId,
        name: nft.name,
        description: nft.description,
        image: nft.image,
        price: nft.price || '0',
        seller: address,
        owner: address,
        ethPrice: nft.ethPrice || '0.0',
        listedAt: new Date().toISOString(),
      }))
      setMarketItems(transformed)
    }
  }, [nfts, address])

  if (loading && marketItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading collection...</p>
        </div>
      </div>
    )
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Collection Not Found</h1>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b]">
      <Header />

      {/* Collection Hero Banner */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Back Button */}
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              Back to Collections
            </button>

            <div className="flex items-start gap-6">
              {/* Collection Avatar */}
              <div className="hidden sm:flex w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center text-6xl shadow-xl">
                {collection.symbol.charAt(0)}
              </div>

              {/* Collection Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-4xl sm:text-5xl font-bold text-white">
                    {collection.name}
                  </h1>
                  {collection.verified && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      ✓ Verified
                    </span>
                  )}
                </div>

                <p className="text-gray-300 text-lg mb-6 max-w-2xl">
                  {collection.description}
                </p>

                {/* Collection Links */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-lg text-sm">
                    {collection.category}
                  </span>
                  {collection.website && (
                    <a
                      href={collection.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-lg text-sm transition-colors"
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
                      className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-lg text-sm transition-colors"
                    >
                      <FiTwitter className="w-4 h-4" />
                      Twitter
                    </a>
                  )}
                  <a
                    href={`https://basescan.org/address/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-lg text-sm transition-colors"
                  >
                    <FiExternalLink className="w-4 h-4" />
                    Contract
                  </a>
                </div>

                {/* Collection Stats */}
                <div className="flex flex-wrap gap-6 sm:gap-8">
                  {collection.totalSupply && (
                    <div>
                      <div className="text-2xl font-bold text-white">{collection.totalSupply.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">total supply</div>
                    </div>
                  )}
                  {collection.floorPrice && (
                    <div>
                      <div className="text-2xl font-bold text-white">{collection.floorPrice} ETH</div>
                      <div className="text-sm text-gray-400">floor price</div>
                    </div>
                  )}
                  <div>
                    <div className="text-2xl font-bold text-white">{marketItems.length}</div>
                    <div className="text-sm text-gray-400">items loaded</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* NFT Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
            Error loading NFTs: {error}
          </div>
        )}

        {marketItems.length === 0 && !loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No NFTs found in this collection</p>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5"
            >
              {marketItems.map((item, index) => (
                <motion.div
                  key={item.tokenId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.02 }}
                >
                  <NFTCard {...item} onBuy={() => console.log('Buy clicked')} />
                </motion.div>
              ))}
            </motion.div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                >
                  {loading ? 'Loading...' : 'Load More NFTs'}
                </button>
              </div>
            )}

            {loading && marketItems.length > 0 && (
              <div className="flex justify-center mt-8">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}
