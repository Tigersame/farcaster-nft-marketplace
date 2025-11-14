'use client'

import { Avatar, Name } from '@coinbase/onchainkit/identity'
import { base } from 'viem/chains'

interface OwnerBadgeProps {
  address: string
  label?: string
  showAvatar?: boolean
  className?: string
}

export function OwnerBadge({ 
  address, 
  label = 'Owner',
  showAvatar = true,
  className = '' 
}: OwnerBadgeProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && (
        <span className="text-xs text-gray-500 dark:text-gray-400">{label}:</span>
      )}
      <div className="flex items-center gap-1.5">
        {showAvatar && (
          <Avatar 
            address={address as `0x${string}`}
            chain={base}
            className="h-5 w-5 rounded-full border border-gray-200 dark:border-gray-700"
          />
        )}
        <Name 
          address={address as `0x${string}`}
          chain={base}
          className="text-sm font-medium text-gray-900 dark:text-white"
        />
      </div>
    </div>
  )
}

// Creator badge variant
export function CreatorBadge({ address, className = '' }: { address: string, className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <Avatar 
        address={address as `0x${string}`}
        chain={base}
        className="h-4 w-4 rounded-full"
      />
      <span className="text-xs text-gray-600 dark:text-gray-400">by</span>
      <Name 
        address={address as `0x${string}`}
        chain={base}
        className="text-xs font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      />
    </div>
  )
}
