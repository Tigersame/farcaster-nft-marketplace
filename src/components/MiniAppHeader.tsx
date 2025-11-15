'use client'

import { useMiniApp } from '@/contexts/MiniAppContext'
import { BRANDING } from '@/config/branding'

/**
 * Mini App Header
 * Displays app name and author as per Farcaster Mini App specification
 * https://miniapps.farcaster.xyz/docs/specification#header
 * 
 * Hosts render this header above the Mini App content showing:
 * - App name from manifest
 * - Author/creator information
 */
export function MiniAppHeader() {
  const { isSDKLoaded, farcasterUser } = useMiniApp()

  // Only show header when in Farcaster environment
  if (!isSDKLoaded) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 py-3">
        {/* App Icon & Name */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">{BRANDING.name[0]}</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-900 dark:text-white">
              {BRANDING.name}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              by {farcasterUser?.displayName || farcasterUser?.username || 'FarcastMints'}
            </p>
          </div>
        </div>

        {/* User Profile (if connected) */}
        {farcasterUser && (
          <div className="flex items-center gap-2">
            {farcasterUser.pfpUrl && (
              <img 
                src={farcasterUser.pfpUrl} 
                alt={farcasterUser.displayName || farcasterUser.username}
                className="w-8 h-8 rounded-full"
              />
            )}
          </div>
        )}
      </div>
    </header>
  )
}
