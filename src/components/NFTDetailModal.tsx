'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiX,
  FiShoppingCart,
  FiTag,
  FiShare2,
  FiSend,
  FiClock,
  FiTrendingUp,
  FiCopy,
  FiExternalLink,
  FiCheck,
} from 'react-icons/fi'
import { useBuyNFT } from '@/lib/contracts/useMarketplace'

interface NFTModalProps {
  isOpen: boolean
  onClose: () => void
  nft: {
    tokenId: string
    name: string
    description?: string
    image: string
    ethPrice: string
    contractAddress: string
    creator: string
    owner: string
    traits?: { trait_type: string; value: string; rarity?: number }[]
    history?: { event: string; from: string; to: string; price?: string; date: string }[]
  }
  onBuy?: () => void
}

type TabType = 'details' | 'activity' | 'offers'

export function NFTDetailModal({ isOpen, onClose, nft, onBuy }: NFTModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('details')
  const [copied, setCopied] = useState(false)
  const { buyNFT, isLoading, isSuccess } = useBuyNFT()

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleBuy = () => {
    if (onBuy) {
      onBuy()
    } else {
      buyNFT(nft.tokenId, nft.ethPrice)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: nft.name,
        text: `Check out ${nft.name} on FarcastMints`,
        url: window.location.href,
      })
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="min-h-screen px-4 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="glass-strong rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  
                  {/* Left: Image */}
                  <div className="relative bg-gradient-to-br from-gray-900 to-black p-8 flex items-center justify-center">
                    <button
                      onClick={onClose}
                      className="absolute top-4 right-4 glass-strong rounded-full p-2 hover:bg-white/10 transition-colors z-10"
                    >
                      <FiX className="w-5 h-5" />
                    </button>

                    <div className="w-full max-w-md">
                      <motion.img
                        layoutId={`nft-image-${nft.tokenId}`}
                        src={nft.image}
                        alt={nft.name}
                        className="w-full rounded-2xl shadow-2xl"
                      />
                    </div>

                    {/* Floating Action Buttons */}
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <button
                        onClick={handleShare}
                        className="glass-strong rounded-full p-3 hover:bg-white/10 transition-colors"
                      >
                        <FiShare2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Right: Details */}
                  <div className="flex flex-col max-h-[90vh] lg:max-h-none">
                    
                    {/* Header */}
                    <div className="p-6 border-b border-white/10">
                      <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        {nft.name}
                      </h2>
                      <p className="text-gray-400 text-sm">Token ID: #{nft.tokenId}</p>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-white/10 px-6">
                      <div className="flex gap-6">
                        {(['details', 'activity', 'offers'] as TabType[]).map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-3 px-1 border-b-2 transition-colors capitalize ${
                              activeTab === tab
                                ? 'border-purple-500 text-white'
                                : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeTab}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {activeTab === 'details' && (
                            <DetailsTab nft={nft} onCopy={handleCopy} copied={copied} />
                          )}
                          {activeTab === 'activity' && (
                            <ActivityTab history={nft.history} />
                          )}
                          {activeTab === 'offers' && (
                            <OffersTab />
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Footer: Price & Actions */}
                    <div className="p-6 border-t border-white/10 glass-dark">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Current Price</p>
                          <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            {nft.ethPrice} ETH
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">≈ ${(parseFloat(nft.ethPrice) * 2000).toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleBuy}
                          disabled={isLoading}
                          className="py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 font-bold text-white shadow-lg shadow-purple-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                              />
                              Processing...
                            </>
                          ) : isSuccess ? (
                            <>
                              <FiCheck className="w-5 h-5" />
                              Success!
                            </>
                          ) : (
                            <>
                              <FiShoppingCart className="w-5 h-5" />
                              Buy Now
                            </>
                          )}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="py-3 px-6 rounded-xl glass-light hover:bg-white/10 font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                          <FiTag className="w-5 h-5" />
                          Make Offer
                        </motion.button>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

// Tab Components
function DetailsTab({ nft, onCopy, copied }: any) {
  return (
    <div className="space-y-6">
      {/* Description */}
      {nft.description && (
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Description</h3>
          <p className="text-gray-300 leading-relaxed">{nft.description}</p>
        </div>
      )}

      {/* Traits */}
      {nft.traits && nft.traits.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Properties</h3>
          <div className="grid grid-cols-2 gap-3">
            {nft.traits.map((trait: any, i: number) => (
              <div key={i} className="glass rounded-lg p-3 hover:bg-white/5 transition-colors">
                <p className="text-xs text-gray-400 uppercase mb-1">{trait.trait_type}</p>
                <p className="font-semibold text-white">{trait.value}</p>
                {trait.rarity && (
                  <p className="text-xs text-purple-400 mt-1">{trait.rarity}% rarity</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contract Details */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-400">Details</h3>
        
        <div className="glass rounded-lg p-3 space-y-2">
          <DetailRow label="Contract Address" value={nft.contractAddress} onCopy={onCopy} copied={copied} />
          <DetailRow label="Token ID" value={nft.tokenId} />
          <DetailRow label="Creator" value={nft.creator} onCopy={onCopy} />
          <DetailRow label="Owner" value={nft.owner} onCopy={onCopy} />
        </div>
      </div>

      {/* Links */}
      <div className="flex gap-3">
        <a
          href={`https://basescan.org/address/${nft.contractAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 glass rounded-lg p-3 hover:bg-white/5 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <FiExternalLink className="w-4 h-4" />
          View on BaseScan
        </a>
      </div>
    </div>
  )
}

function ActivityTab({ history }: any) {
  const mockHistory = history || [
    { event: 'Minted', from: '0x0000...0000', to: '0x1234...5678', date: '2 hours ago' },
    { event: 'Listed', from: '0x1234...5678', to: 'Market', price: '2.5 ETH', date: '1 hour ago' },
    { event: 'Sale', from: '0x1234...5678', to: '0x9abc...def0', price: '2.5 ETH', date: '30 min ago' },
  ]

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-400 mb-4">Transaction History</h3>
      {mockHistory.map((item: any, i: number) => (
        <div key={i} className="glass rounded-lg p-4 hover:bg-white/5 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                item.event === 'Sale' ? 'bg-green-500/20' :
                item.event === 'Listed' ? 'bg-blue-500/20' :
                'bg-purple-500/20'
              }`}>
                {item.event === 'Sale' ? <FiShoppingCart className="w-4 h-4 text-green-400" /> :
                 item.event === 'Listed' ? <FiTag className="w-4 h-4 text-blue-400" /> :
                 <FiSend className="w-4 h-4 text-purple-400" />}
              </div>
              <div>
                <p className="font-medium text-white">{item.event}</p>
                <p className="text-xs text-gray-400 mt-1">
                  From {item.from} to {item.to}
                </p>
              </div>
            </div>
            <div className="text-right">
              {item.price && <p className="font-semibold text-white">{item.price}</p>}
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <FiClock className="w-3 h-3" />
                {item.date}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function OffersTab() {
  return (
    <div className="space-y-4">
      <div className="glass rounded-lg p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
          <FiTrendingUp className="w-8 h-8 text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Offers Yet</h3>
        <p className="text-sm text-gray-400 mb-6">
          Be the first to make an offer on this NFT
        </p>
        <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 font-semibold hover:from-purple-500 hover:to-cyan-500 transition-all">
          Make an Offer
        </button>
      </div>
    </div>
  )
}

function DetailRow({ label, value, onCopy, copied }: any) {
  const shortValue = value?.length > 20 ? `${value.slice(0, 10)}...${value.slice(-8)}` : value

  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-gray-400">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono text-white">{shortValue}</span>
        {onCopy && (
          <button
            onClick={() => onCopy(value)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            {copied ? (
              <FiCheck className="w-3 h-3 text-green-400" />
            ) : (
              <FiCopy className="w-3 h-3 text-gray-400" />
            )}
          </button>
        )}
      </div>
    </div>
  )
}
