'use client'

import { useEffect, useState } from 'react'
import { useConnect, useAccount, useDisconnect } from 'wagmi'
import { useMiniApp } from '@/contexts/MiniAppContext'
import sdk from '@farcaster/frame-sdk'

export function MiniAppWalletConnect() {
  const { isSDKLoaded, context } = useMiniApp()
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Auto-connect Farcaster wallet when in Mini App context
  useEffect(() => {
    if (isSDKLoaded && context && !isConnected && isClient) {
      // Try to use the wallet from Farcaster context
      const coinbaseConnector = connectors.find(c => 
        c.name.toLowerCase().includes('coinbase') || 
        c.id.toLowerCase().includes('coinbase')
      )
      
      if (coinbaseConnector) {
        connect({ connector: coinbaseConnector })
      }
    }
  }, [isSDKLoaded, context, isConnected, connectors, connect, isClient])

  // Show wallet info when connected
  if (!isClient) {
    return null
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-blue-600 dark:bg-blue-500 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-white">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        {!isSDKLoaded && (
          <button
            onClick={() => disconnect()}
            className="text-xs text-white/80 hover:text-white underline"
          >
            Disconnect
          </button>
        )}
      </div>
    )
  }

  // Show connect button only if not in Mini App context
  if (!isSDKLoaded) {
    const injectedConnector = connectors.find(c => c.id === 'injected')
    
    return (
      <button
        onClick={() => {
          if (injectedConnector) {
            connect({ connector: injectedConnector })
          }
        }}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
      >
        Connect Wallet
      </button>
    )
  }

  return (
    <div className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2">
      Connecting...
    </div>
  )
}
