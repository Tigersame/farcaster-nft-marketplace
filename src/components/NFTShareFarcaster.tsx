/**
 * Farcaster NFT Share Component
 * 
 * Enables sharing NFTs directly to Farcaster with:
 * - Frame metadata generation
 * - Cast composer integration
 * - Warpcast deep links
 * - Image embeds
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShare2, FiX, FiCopy, FiExternalLink, FiCheck } from 'react-icons/fi'

interface NFTShareFarcasterProps {
  nft: {
    id: string
    name: string
    image: string
    price?: string
    description?: string
    collection?: string
  }
  onClose?: () => void
}

export default function NFTShareFarcaster({ nft, onClose }: NFTShareFarcasterProps) {
  const [copied, setCopied] = useState(false)
  const [shareMethod, setShareMethod] = useState<'warpcast' | 'frame' | 'direct'>('warpcast')

  // Generate NFT URL for sharing
  const nftUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/nft/${nft.id}`
    : `https://farcastersea.com/nft/${nft.id}`

  // Generate Frame URL (for Farcaster Frames)
  const frameUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/api/frames/nft/${nft.id}`
    : `https://farcastersea.com/api/frames/nft/${nft.id}`

  // Generate share text
  const shareText = `Check out "${nft.name}" on FarcastMints! 🌊\n${nft.price ? `Price: ${nft.price} ETH` : 'Available now'}\n\n`

  /**
   * Share to Warpcast with deep link
   */
  const shareToWarpcast = () => {
    const text = encodeURIComponent(shareText)
    const embeds = encodeURIComponent(frameUrl)
    const warpcastUrl = `https://warpcast.com/~/compose?text=${text}&embeds[]=${embeds}`
    
    window.open(warpcastUrl, '_blank', 'noopener,noreferrer')
  }

  /**
   * Copy Frame URL for manual sharing
   */
  const copyFrameUrl = async () => {
    try {
      await navigator.clipboard.writeText(frameUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  /**
   * Copy share text with URL
   */
  const copyShareText = async () => {
    try {
      await navigator.clipboard.writeText(shareText + nftUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  /**
   * Share via native share (mobile)
   */
  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: nft.name,
          text: shareText,
          url: frameUrl,
        })
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err)
        }
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-gray-900 to-black border border-purple-500/20 rounded-2xl p-6 max-w-md w-full shadow-2xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-cyan-400 flex items-center justify-center">
              <FiShare2 className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Share to Farcaster</h2>
              <p className="text-sm text-gray-400">Share {nft.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* NFT Preview */}
        <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex gap-4">
            <img
              src={nft.image}
              alt={nft.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate">{nft.name}</h3>
              <p className="text-sm text-gray-400 truncate">{nft.collection}</p>
              {nft.price && (
                <p className="text-sm font-medium text-purple-400 mt-1">
                  {nft.price} ETH
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Share Method Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setShareMethod('warpcast')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              shareMethod === 'warpcast'
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Warpcast
          </button>
          <button
            onClick={() => setShareMethod('frame')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              shareMethod === 'frame'
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Frame Link
          </button>
          <button
            onClick={() => setShareMethod('direct')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              shareMethod === 'direct'
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Direct
          </button>
        </div>

        {/* Share Content */}
        <div className="space-y-4">
          {/* Warpcast Method */}
          {shareMethod === 'warpcast' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <p className="text-sm text-gray-400">
                Open Warpcast composer with NFT frame pre-loaded
              </p>
              <button
                onClick={shareToWarpcast}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-cyan-400 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
              >
                <FiExternalLink />
                Open in Warpcast
              </button>
            </motion.div>
          )}

          {/* Frame Link Method */}
          {shareMethod === 'frame' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <p className="text-sm text-gray-400">
                Copy the Farcaster Frame URL to share anywhere
              </p>
              <div className="bg-black/40 rounded-lg p-3 flex items-center gap-2 border border-white/10">
                <code className="flex-1 text-xs text-gray-300 truncate">
                  {frameUrl}
                </code>
                <button
                  onClick={copyFrameUrl}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-1.5 text-sm font-medium"
                >
                  {copied ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </motion.div>
          )}

          {/* Direct Share Method */}
          {shareMethod === 'direct' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <p className="text-sm text-gray-400">
                Share text with NFT link
              </p>
              <div className="bg-black/40 rounded-lg p-3 border border-white/10">
                <p className="text-sm text-gray-300 whitespace-pre-wrap break-words">
                  {shareText + nftUrl}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyShareText}
                  className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <FiCopy />
                  {copied ? 'Copied!' : 'Copy Text'}
                </button>
                {typeof navigator !== 'undefined' && typeof navigator.share !== 'undefined' && (
                  <button
                    onClick={nativeShare}
                    className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <FiShare2 />
                    Share
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Frame Preview Info */}
        <div className="mt-6 p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
          <div className="flex gap-3">
            <div className="text-2xl">🖼️</div>
            <div>
              <p className="text-sm font-medium text-cyan-400">Farcaster Frame Enabled</p>
              <p className="text-xs text-gray-400 mt-1">
                Your NFT will display as an interactive frame in Farcaster feeds with buy, like, and share buttons
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
