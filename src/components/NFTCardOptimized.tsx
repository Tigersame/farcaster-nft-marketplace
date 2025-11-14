"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { FiShoppingCart, FiShare2, FiX, FiHeart, FiExternalLink } from "react-icons/fi"
import { useBuyNFTContract } from "@/hooks/useBuyNFTContract"
import { useAccount } from "wagmi"
import NFTShareFarcaster from "./NFTShareFarcaster"

interface NFTCardOptimizedProps {
  token: {
    id: string
    name: string
    collection?: string
    image: string
    blurDataURL?: string
    price?: string
    description?: string
    contractAddress?: string
    traits?: { trait_type: string; value: string }[]
    verified?: boolean
    creator?: string
  }
  onBuy?: (token: any) => Promise<void>
}

export default function NFTCardOptimized({ token, onBuy }: NFTCardOptimizedProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [liked, setLiked] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  
  const { address, isConnected } = useAccount()

  const {
    id,
    name,
    collection = "Collection",
    image,
    blurDataURL,
    price,
    description,
    contractAddress,
    traits,
    verified,
    creator,
  } = token || {}

  // Use production contract hook
  const { 
    buy, 
    isLoading: buying, 
    txHash, 
    explorerUrl 
  } = useBuyNFTContract({
    tokenId: id,
    priceEth: price || '0',
    onSuccess: (hash) => {
      setToast(`✅ Transaction confirmed! TX: ${hash.slice(0, 10)}...`)
      setTimeout(() => setModalOpen(false), 2000)
    },
    onError: (error) => {
      setToast(`❌ ${error.message}`)
    },
    onPendingStart: () => {
      setToast('⏳ Processing transaction...')
    }
  })

  // Generate default blur placeholder (1x1 gray pixel)
  const defaultBlurDataURL = 
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8dPjwfwAG8QKgdnblowAAAABJRU5ErkJggg=="

  async function handleBuy() {
    // If custom onBuy provided, use that
    if (onBuy) {
      try {
        setToast('⏳ Processing...')
        await onBuy(token)
        setToast('✅ Purchase complete!')
        setTimeout(() => setModalOpen(false), 1500)
      } catch (e) {
        console.error(e)
        setToast("❌ Transaction failed")
      }
      return
    }

    // Otherwise use production contract hook
    if (!isConnected) {
      setToast('⚠️ Please connect your wallet first')
      return
    }

    await buy()
  }

  function handleShare() {
    // Open Farcaster share modal
    setShareModalOpen(true)
  }

  return (
    <>
      {/* Card */}
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
        className="group relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-white/[0.02] to-white/[0.03] backdrop-blur-sm border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.6)] cursor-pointer hover:border-purple-500/30 transition-all"
      >
        {/* NFT Image */}
        <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
          <Image
            src={image}
            alt={name}
            placeholder="blur"
            blurDataURL={blurDataURL || defaultBlurDataURL}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
            <div className="flex gap-2">
              <div className="px-2.5 py-1 text-xs bg-black/60 backdrop-blur-md rounded-md border border-white/10">
                {collection}
              </div>
              {verified && (
                <div className="px-2.5 py-1 text-xs bg-blue-600/80 backdrop-blur-md rounded-md border border-blue-400/20 flex items-center gap-1">
                  <span>✓</span>
                  <span>Verified</span>
                </div>
              )}
            </div>
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                setLiked(!liked)
              }}
              className="p-2 bg-black/60 backdrop-blur-md rounded-full hover:bg-black/80 transition-colors"
            >
              <FiHeart
                className={`w-4 h-4 transition-all ${
                  liked ? "fill-red-500 text-red-500" : "text-white"
                }`}
              />
            </motion.button>
          </div>

          {/* Bottom Price & View Button */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
            <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-400 text-xs font-bold text-black shadow-lg">
              {price ? `${price} ETH` : "Not listed"}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation()
                setModalOpen(true)
              }}
              className="px-3 py-1.5 text-sm rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 font-medium transition-colors"
            >
              View
            </motion.button>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-4 py-3 bg-black/40 backdrop-blur-sm flex items-start justify-between border-t border-white/10"
          onClick={() => setModalOpen(true)}
        >
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate text-white">{name}</div>
            <div className="text-xs text-gray-400 mt-1">
              #{id} • {collection}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              setModalOpen(true)
            }}
            className="ml-3 text-sm px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-400 text-black font-semibold shadow-lg hover:shadow-purple-500/50 transition-all flex-shrink-0"
          >
            Buy
          </motion.button>
        </div>

        {/* Glow Effect on Hover */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10" />
      </motion.div>

      {/* Modal / Drawer */}
      <AnimatePresence>
        {modalOpen && (
          <>
            {/* Background Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            />

            {/* Right-side Drawer */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed right-0 top-0 h-full w-full sm:w-[520px] z-50 bg-gradient-to-tl from-white/[0.03] to-white/[0.05] backdrop-blur-xl border-l border-white/10 shadow-2xl overflow-y-auto"
            >
              <div className="p-6 flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-1">{name}</h2>
                    <p className="text-sm text-gray-400">{collection}</p>
                  </div>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                {/* Image */}
                <div className="relative w-full rounded-2xl overflow-hidden bg-black/30 shadow-2xl mb-6">
                  <div className="relative w-full" style={{ aspectRatio: "1" }}>
                    <Image
                      src={image}
                      alt={name}
                      fill
                      placeholder="blur"
                      blurDataURL={blurDataURL || defaultBlurDataURL}
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 520px"
                    />
                  </div>
                </div>

                {/* Description */}
                {description && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Description</h3>
                    <p className="text-gray-300 leading-relaxed text-sm">{description}</p>
                  </div>
                )}

                {/* Traits */}
                {traits && traits.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-400 mb-3">Properties</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {traits.map((trait, i) => (
                        <div
                          key={i}
                          className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors"
                        >
                          <p className="text-xs text-gray-400 uppercase mb-1">
                            {trait.trait_type}
                          </p>
                          <p className="font-semibold text-white text-sm">{trait.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Details */}
                <div className="mb-6 space-y-2 text-sm">
                  <h3 className="font-semibold text-gray-400 mb-3">Details</h3>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Token ID</span>
                      <span className="text-white font-mono">#{id}</span>
                    </div>
                    {contractAddress && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Contract</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-mono text-xs">
                            {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
                          </span>
                          <a
                            href={`https://basescan.org/address/${contractAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300"
                          >
                            <FiExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    )}
                    {creator && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Creator</span>
                        <span className="text-white font-mono text-xs">
                          {creator.slice(0, 6)}...{creator.slice(-4)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Action Buttons */}
                <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
                  {/* Price */}
                  {price && (
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-400 text-sm">Current Price</span>
                      <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        {price} ETH
                      </span>
                    </div>
                  )}

                  {/* Buy & Share Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBuy}
                      disabled={buying}
                      className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-400 text-black font-bold shadow-lg hover:shadow-purple-500/50 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                      {buying ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                          />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FiShoppingCart className="w-4 h-4" />
                          {isConnected ? `Buy ${price ? `for ${price} ETH` : ''}` : 'Connect Wallet'}
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleShare}
                      className="px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold hover:bg-white/20 transition-colors border border-white/20 flex items-center justify-center"
                    >
                      <FiShare2 className="w-4 h-4" />
                    </motion.button>
                  </div>

                  {/* Transaction Status Toast */}
                  {toast && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-sm"
                    >
                      <p className="text-white">{toast}</p>
                      {explorerUrl && (
                        <a
                          href={explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 mt-2 text-cyan-400 hover:text-cyan-300 text-xs"
                        >
                          View on BaseScan <FiExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Farcaster Share Modal */}
      <AnimatePresence>
        {shareModalOpen && (
          <NFTShareFarcaster
            nft={{
              id,
              name,
              image,
              price,
              description,
              collection,
            }}
            onClose={() => setShareModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
