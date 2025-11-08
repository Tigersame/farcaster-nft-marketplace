'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import TransactionWrapper from './TransactionWrapper'
import { ArrowSvg, BaseSvg, OnchainkitSvg } from './svg'

interface NFTMintCardEnhancedProps {
  contractAddress: string
  tokenId?: string
  title?: string
  description?: string
  imageUrl?: string
  creator?: string
  mintPrice?: string
  mintPriceETH?: string
  maxSupply?: number
  totalSupply?: number
  onMintSuccess?: (tokenId: string) => void
  onMintError?: (error: any) => void
  className?: string
}

export function NFTMintCardEnhanced({
  contractAddress,
  tokenId = '1',
  title = 'Farcaster Genesis Collection',
  description = 'Unique NFTs from the Farcaster ecosystem on Base',
  imageUrl = '',
  creator = '0x...',
  mintPrice = '50.00',
  mintPriceETH = '0.05',
  maxSupply = 1000,
  totalSupply = 347,
  onMintSuccess,
  onMintError,
  className = '',
}: NFTMintCardEnhancedProps) {
  const { address, isConnected } = useAccount()
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const progress = (totalSupply / maxSupply) * 100
  const remaining = maxSupply - totalSupply

  const totalCost = (parseFloat(mintPriceETH) * quantity).toFixed(3)
  const totalCostUSD = (parseFloat(mintPrice) * quantity).toFixed(2)

  const handleMintSuccess = () => {
    setIsLoading(false)
    if (onMintSuccess) onMintSuccess(tokenId)
  }

  const handleMintError = (error: any) => {
    setIsLoading(false)
    if (onMintError) onMintError(error)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-md mx-auto ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BaseSvg className="w-6 h-6 text-white" />
            <span className="text-white font-semibold">Mint on Base</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-white bg-opacity-20 rounded-full">
            <OnchainkitSvg className="w-4 h-4 text-white" />
            <span className="text-white text-xs">OnchainKit</span>
          </div>
        </div>
      </div>

      {/* NFT Media */}
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 relative">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🎨</div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Preview Image</p>
            </div>
          </div>
        )}
        
        {/* Collection Badge */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded-full">
          #{tokenId}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Creator Info */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Created by</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {creator.slice(0, 6)}...{creator.slice(-4)}
            </p>
          </div>
        </div>

        {/* Collection Title */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
        </div>

        {/* Supply Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">Minted</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {totalSupply} / {maxSupply}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {remaining} remaining
          </p>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900 dark:text-white">Quantity</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              -
            </button>
            <span className="w-8 text-center font-medium text-gray-900 dark:text-white">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(10, quantity + 1))}
              className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Asset Cost */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Unit Price</span>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-white">{mintPriceETH} ETH</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">${mintPrice}</div>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900 dark:text-white">Total Cost</span>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900 dark:text-white">{totalCost} ETH</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">${totalCostUSD}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mint Button */}
        {isConnected && address ? (
          <TransactionWrapper
            address={address}
            contractAddress={contractAddress as `0x${string}`}
            functionName="mint"
            args={[address, quantity]}
            onSuccess={handleMintSuccess}
            onError={handleMintError}
            className="w-full"
          >
            <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Minting...
                </>
              ) : (
                <>
                  🚀 Mint {quantity > 1 ? `${quantity} NFTs` : 'NFT'}
                  <ArrowSvg direction="right" className="w-4 h-4" />
                </>
              )}
            </div>
          </TransactionWrapper>
        ) : (
          <div className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 px-6 py-4 rounded-xl text-center">
            🔗 Connect your wallet to mint
          </div>
        )}

        {/* Contract Info */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Contract</span>
            <span className="font-mono">
              {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}