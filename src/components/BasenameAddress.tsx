'use client'

import { Address, Name } from '@coinbase/onchainkit/identity'
import { base } from 'viem/chains'

interface BasenameAddressProps {
  address: string
  className?: string
  showFullAddress?: boolean
  chain?: typeof base
}

export function BasenameAddress({ 
  address, 
  className = '', 
  showFullAddress = false,
  chain = base 
}: BasenameAddressProps) {
  return (
    <div className={`inline-flex items-center space-x-1 ${className}`}>
      {/* Try to display Basename first */}
      <Name 
        address={address as `0x${string}`}
        chain={chain}
        className="font-medium text-gray-900 dark:text-white"
      />
      
      {/* Fallback to truncated address if no name is found */}
      {showFullAddress && (
        <Address 
          address={address as `0x${string}`}
          className="text-xs text-gray-500 dark:text-gray-400 font-mono"
        />
      )}
    </div>
  )
}

// Simplified version for just showing address with Basename fallback
export function SimpleBasenameAddress({ address, className = '' }: { address: string, className?: string }) {
  return (
    <span className={`font-mono ${className}`}>
      <Name 
        address={address as `0x${string}`}
        chain={base}
        className="font-medium"
      />
    </span>
  )
}