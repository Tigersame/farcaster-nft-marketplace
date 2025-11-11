'use client'

import { useMiniApp } from '@/contexts/MiniAppContext'
import { FiUser, FiLogIn } from 'react-icons/fi'
import { motion } from 'framer-motion'

export function FarcasterConnectButton() {
  const { 
    isSDKLoaded, 
    farcasterUser, 
    isFarcasterConnected, 
    signIn,
    viewProfile 
  } = useMiniApp()

  // If not in Farcaster environment, don't show the button
  if (!isSDKLoaded || !isFarcasterConnected) {
    return null
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => farcasterUser && viewProfile(farcasterUser.fid)}
      className="flex items-center gap-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
      title={`Farcaster: @${farcasterUser?.username}`}
    >
      {/* Farcaster Avatar */}
      {farcasterUser?.pfpUrl ? (
        <img 
          src={farcasterUser.pfpUrl} 
          alt={farcasterUser.username}
          className="w-7 h-7 rounded-full border-2 border-white/30"
        />
      ) : (
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
          <FiUser className="w-4 h-4" />
        </div>
      )}
      
      {/* User Info */}
      <div className="flex flex-col items-start">
        <span className="text-sm font-bold leading-tight">
          {farcasterUser?.displayName || farcasterUser?.username || `FID ${farcasterUser?.fid}`}
        </span>
        {farcasterUser?.username && (
          <span className="text-xs opacity-90 leading-tight">
            @{farcasterUser.username}
          </span>
        )}
      </div>

      {/* Verified Badge */}
      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
        <span className="text-xs">✓</span>
      </div>
    </motion.button>
  )
}

// Fallback button when not in Farcaster (shows how to access)
export function FarcasterPromptButton() {
  const { isSDKLoaded, isFarcasterConnected } = useMiniApp()

  // Only show if NOT in Farcaster environment
  if (isSDKLoaded && isFarcasterConnected) {
    return null
  }

  return (
    <motion.a
      href="https://warpcast.com/~/add-cast-action?url=https://farcaster-nft-marketplace.vercel.app"
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
      title="Open in Farcaster to connect"
    >
      <FiLogIn className="w-4 h-4" />
      <span className="text-sm">Open in Farcaster</span>
    </motion.a>
  )
}
