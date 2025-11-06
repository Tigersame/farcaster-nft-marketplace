'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShare2, FiCopy, FiExternalLink, FiCheck, FiX } from 'react-icons/fi'

interface FrameShareProps {
  tokenId: string
  nftName: string
}

export function FrameShare({ tokenId, nftName }: FrameShareProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const frameUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/frames/nft/${tokenId}`
  const castUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(`Check out this NFT: ${nftName}`)}&embeds[]=${encodeURIComponent(frameUrl)}`

  const copyFrameUrl = async () => {
    try {
      await navigator.clipboard.writeText(frameUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareOnWarpcast = () => {
    window.open(castUrl, '_blank')
  }

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors text-sm font-medium"
      >
        <FiShare2 className="w-4 h-4" />
        <span>Share Frame</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Share as Farcaster Frame</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Share this NFT in Farcaster feeds</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Frame Preview */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-100">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🖼️</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{nftName}</p>
                    <p className="text-xs text-gray-600">Interactive Farcaster Frame</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white rounded-lg p-2 text-center border">
                    💎 Buy NFT
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center border">
                    ❤️ Like
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center border">
                    🔗 Details
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center border">
                    📤 Share
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {/* Cast on Warpcast */}
                <button
                  onClick={shareOnWarpcast}
                  className="w-full flex items-center justify-center space-x-2 bg-purple-500 text-white py-3 px-4 rounded-xl hover:bg-purple-600 transition-colors font-medium"
                >
                  <FiExternalLink className="w-4 h-4" />
                  <span>Cast on Warpcast</span>
                </button>

                {/* Copy Frame URL */}
                <button
                  onClick={copyFrameUrl}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border-2 transition-all font-medium ${
                    copied 
                      ? 'border-green-200 bg-green-50 text-green-700'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {copied ? (
                    <>
                      <FiCheck className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <FiCopy className="w-4 h-4" />
                      <span>Copy Frame URL</span>
                    </>
                  )}
                </button>
              </div>

              {/* Frame URL Preview */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                <p className="text-xs text-gray-500 mb-1">Frame URL:</p>
                <p className="text-xs font-mono text-gray-700 break-all">{frameUrl}</p>
              </div>

              {/* Info */}
              <div className="mt-4 text-xs text-gray-500">
                <p>💡 <strong>Tip:</strong> Frames allow direct NFT interactions within Farcaster feeds. Users can buy, like, and share without leaving their timeline!</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Frame discovery component for the main marketplace
export function FrameDiscovery() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-2xl">🖼️</span>
            <h3 className="font-semibold text-purple-900">Farcaster Frames</h3>
          </div>
          
          <p className="text-purple-700 text-sm mb-4">
            Share NFTs as interactive frames in Farcaster. Users can buy, like, and interact directly from their feed.
          </p>

          <div className="flex space-x-3">
            <a
              href="/api/frames"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-xl hover:bg-purple-600 transition-colors text-sm font-medium"
            >
              <FiExternalLink className="w-4 h-4" />
              <span>View All Frames</span>
            </a>
          </div>
        </div>

        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="text-4xl"
        >
          ⚡
        </motion.div>
      </div>
    </motion.div>
  )
}