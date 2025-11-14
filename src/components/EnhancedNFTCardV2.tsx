'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiHeart, FiShoppingCart, FiEye, FiShare2, FiCheck } from 'react-icons/fi'
import { useBuyNFT } from '@/lib/contracts/useMarketplace'

interface NFTCardProps {
  tokenId: string
  name: string
  image: string
  ethPrice: string
  category: string
  verified?: boolean
  creatorName?: string
  creatorAvatar?: string
  floorPrice?: string
  traits?: { trait_type: string; value: string }[]
  onBuy?: () => void
  onClick?: () => void
}

export function EnhancedNFTCardV2({
  tokenId,
  name,
  image,
  ethPrice,
  category,
  verified = false,
  creatorName = 'Creator',
  creatorAvatar,
  floorPrice,
  traits,
  onBuy,
  onClick,
}: NFTCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [liked, setLiked] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  
  const { buyNFT, isLoading } = useBuyNFT()

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onBuy) {
      onBuy()
    } else {
      // On-chain buy
      buyNFT(tokenId, ethPrice)
    }
  }

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLiked(!liked)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({
        title: name,
        text: `Check out ${name} on FarcastMints`,
        url: window.location.href,
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -12 }}
      onHoverStart={() => setShowQuickActions(true)}
      onHoverEnd={() => setShowQuickActions(false)}
      onClick={onClick}
      className="group relative cursor-pointer"
    >
      {/* Main Card */}
      <div className="glass rounded-2xl overflow-hidden card-hover reveal-on-hover">
        
        {/* Image Container */}
        <div className="relative w-full" style={{ aspectRatio: '1 / 1.2' }}>
          {/* Blur Placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 skeleton" />
          )}
          
          {/* Main Image */}
          <img
            src={image}
            alt={name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Top Row: Verified Badge & Like */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
            {verified && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="glass-strong rounded-full px-3 py-1 flex items-center gap-1.5"
              >
                <FiCheck className="w-3 h-3 text-blue-400" />
                <span className="text-xs font-medium text-blue-400">Verified</span>
              </motion.div>
            )}
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className="glass-strong rounded-full p-2 ml-auto hover:bg-white/10 transition-colors"
            >
              <FiHeart
                className={`w-4 h-4 transition-all ${
                  liked ? 'fill-red-500 text-red-500' : 'text-white'
                }`}
              />
            </motion.button>
          </div>

          {/* Quick Actions Bar (appears on hover) */}
          <AnimatePresence>
            {showQuickActions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-3 left-3 right-3 flex gap-2 z-10"
              >
                <button
                  onClick={(e) => { e.stopPropagation() }}
                  className="flex-1 glass-strong rounded-lg py-2 px-3 text-xs font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5"
                >
                  <FiEye className="w-3.5 h-3.5" />
                  View
                </button>
                <button
                  onClick={handleShare}
                  className="glass-strong rounded-lg py-2 px-3 text-xs font-medium hover:bg-white/10 transition-colors flex items-center justify-center"
                >
                  <FiShare2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category Badge */}
          <div className="absolute bottom-3 left-3 z-[5]">
            <span className="inline-block px-2.5 py-1 rounded-md bg-purple-600/90 backdrop-blur-sm text-xs font-medium">
              {category}
            </span>
          </div>
        </div>

        {/* Card Footer */}
        <div className="p-4 glass-dark">
          {/* Creator Info */}
          <div className="flex items-center gap-2 mb-3">
            {creatorAvatar ? (
              <img
                src={creatorAvatar}
                alt={creatorName}
                className="w-6 h-6 rounded-full border border-white/10"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500" />
            )}
            <span className="text-xs text-gray-400">{creatorName}</span>
          </div>

          {/* NFT Name */}
          <h3 className="font-bold text-lg mb-2 truncate group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all">
            {name}
          </h3>

          {/* Traits Preview (if available) */}
          {traits && traits.length > 0 && (
            <div className="flex gap-1.5 mb-3 flex-wrap">
              {traits.slice(0, 2).map((trait, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10"
                >
                  {trait.value}
                </span>
              ))}
              {traits.length > 2 && (
                <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-400">
                  +{traits.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Price Row */}
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-xs text-gray-400 mb-1">Price</p>
              <p className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {ethPrice} ETH
              </p>
            </div>
            {floorPrice && (
              <div className="text-right">
                <p className="text-xs text-gray-400">Floor</p>
                <p className="text-sm font-medium text-gray-300">{floorPrice} ETH</p>
              </div>
            )}
          </div>

          {/* Buy Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBuyClick}
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FiShoppingCart className="w-4 h-4" />
                <span>Buy Now</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Glow Effect on Hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10" />
    </motion.div>
  )
}
