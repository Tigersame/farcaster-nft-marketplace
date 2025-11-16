'use client'

import { useMiniApp } from '@/contexts/MiniAppContext'
import { useState } from 'react'

export function MiniAppActions() {
  const { 
    isSDKLoaded, 
    isBaseApp, 
    composeCast, 
    swapToken, 
    sendToken, 
    viewToken,
    viewProfile,
    triggerHaptic,
    close
  } = useMiniApp()
  
  const [showActions, setShowActions] = useState(false)

  // Always show the component, not just when SDK is loaded
  // if (!isSDKLoaded) return null

  const handleComposeCast = () => {
    if (isSDKLoaded) {
      triggerHaptic('light')
      composeCast('Check out this NFT from FarcastMints! 🎨', ['https://farcaster-nft-marketplace.vercel.app'])
    } else {
      // Fallback for browser
      alert('📝 Compose Cast: This feature works in Farcaster Mini App')
    }
  }

  const handleSwapToken = () => {
    if (isSDKLoaded) {
      triggerHaptic('medium')
      swapToken({
        fromToken: '0x0000000000000000000000000000000000000000', // ETH
        toToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
        amount: '0.01'
      })
    } else {
      // Fallback for browser
      alert('🔄 Swap Tokens: This feature works in Farcaster Mini App')
    }
  }

  const handleViewProfile = () => {
    if (isSDKLoaded) {
      triggerHaptic('light')
      viewProfile(639734) // Your FID
    } else {
      // Fallback for browser
      alert('👤 View Profile: This feature works in Farcaster Mini App')
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => {
          if (isSDKLoaded) {
            triggerHaptic('light')
          }
          setShowActions(!showActions)
        }}
        className="touch-target w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all"
      >
        {showActions ? '✕' : '⚡'}
      </button>

      {showActions && (
        <div className="absolute bottom-16 right-0 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 space-y-2">
          <div className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            {isBaseApp ? '⚡ Base App Actions' : '📱 Mini App Actions'}
          </div>

          <button
            onClick={handleComposeCast}
            className="touch-target w-full px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-sm font-medium"
          >
            📝 Share Cast
          </button>

          <button
            onClick={handleSwapToken}
            className="touch-target w-full px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors text-sm font-medium"
          >
            🔄 Swap Tokens
          </button>

          <button
            onClick={handleViewProfile}
            className="touch-target w-full px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors text-sm font-medium"
          >
            👤 View Profile
          </button>

          <button
            onClick={() => {
              if (isSDKLoaded) {
                triggerHaptic('heavy')
                close()
              } else {
                alert('✕ Close App: This feature works in Farcaster Mini App')
              }
            }}
            className="touch-target w-full px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors text-sm font-medium"
          >
            ✕ Close App
          </button>
        </div>
      )}
    </div>
  )
}
