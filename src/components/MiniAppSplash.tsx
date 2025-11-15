'use client'

import { useEffect, useState } from 'react'
import { useMiniApp } from '@/contexts/MiniAppContext'
import { BRANDING } from '@/config/branding'

/**
 * Mini App Splash Screen
 * Shows while the app is loading, as per Farcaster Mini App specification
 * https://miniapps.farcaster.xyz/docs/specification#splash-screen
 * 
 * Requirements:
 * - Display icon and background color from manifest
 * - Show loading indicator
 * - Hide when sdk.actions.ready() is called
 * - Animated transition
 */
export function MiniAppSplash() {
  const { isSDKLoaded, isReady } = useMiniApp()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Hide splash when SDK is ready
    if (isReady) {
      // Add slight delay for smooth transition
      setTimeout(() => {
        setVisible(false)
      }, 300)
    }
  }, [isReady])

  // Only show splash in Farcaster environment and when not ready
  if (!isSDKLoaded || !visible) {
    return null
  }

  return (
    <div 
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-300"
      style={{ 
        backgroundColor: '#1a1a2e', // splashBackgroundColor from manifest
        opacity: isReady ? 0 : 1,
      }}
    >
      {/* Splash Image - 200x200px from manifest */}
      <div className="relative mb-8">
        <div className="w-[200px] h-[200px] rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
          <span className="text-white font-bold text-8xl">{BRANDING.name[0]}</span>
        </div>
        
        {/* Loading Animation */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>

      {/* App Name */}
      <h1 className="text-3xl font-bold text-white mb-2">
        {BRANDING.name}
      </h1>
      <p className="text-gray-400 text-sm">
        Loading your marketplace...
      </p>
    </div>
  )
}
