'use client'

import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { baseSepolia, base } from 'wagmi/chains'
import { useState } from 'react'

export function NetworkSwitcher() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { chains, switchChain } = useSwitchChain()
  const [isAdding, setIsAdding] = useState(false)
  
  // Determine expected network from environment
  const isTestnet = process.env.NEXT_PUBLIC_NETWORK === 'baseSepolia'
  const expectedChain = isTestnet ? baseSepolia : base
  const expectedChainId = expectedChain.id
  
  // Don't show if not connected or on correct network
  if (!isConnected || chainId === expectedChainId) {
    return null
  }
  
  const handleSwitchNetwork = async () => {
    try {
      switchChain({ chainId: expectedChainId })
    } catch (error) {
      console.error('Failed to switch network:', error)
      // If switching fails, try adding the network
      if (isTestnet) {
        await addBaseSepoliaToWallet()
      }
    }
  }
  
  const addBaseSepoliaToWallet = async () => {
    if (!window.ethereum) return
    
    setIsAdding(true)
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x14a34', // 84532 in hex
            chainName: 'Base Sepolia Testnet',
            nativeCurrency: {
              name: 'Sepolia Ether',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: ['https://sepolia.base.org'],
            blockExplorerUrls: ['https://sepolia.basescan.org'],
          },
        ],
      })
    } catch (error) {
      console.error('Failed to add Base Sepolia:', error)
    } finally {
      setIsAdding(false)
    }
  }
  
  const currentChainName = chains.find(c => c.id === chainId)?.name || 'Unknown Network'
  
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg shadow-lg p-4 max-w-md">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
              Wrong Network Detected
            </h3>
            <p className="text-xs text-yellow-800 dark:text-yellow-200 mt-1">
              You're on <span className="font-medium">{currentChainName}</span>. 
              Please switch to <span className="font-medium">{expectedChain.name}</span>.
            </p>
          </div>
          <button
            onClick={handleSwitchNetwork}
            disabled={isAdding}
            className="flex-shrink-0 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {isAdding ? 'Adding...' : 'Switch Network'}
          </button>
        </div>
        
        {isTestnet && (
          <div className="mt-3 pt-3 border-t border-yellow-300 dark:border-yellow-700">
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              <strong>Need testnet ETH?</strong> Get free Base Sepolia ETH from{' '}
              <a 
                href="https://www.coinbase.com/faucets/base-ethereum-goerli-faucet" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-yellow-900 dark:hover:text-yellow-100"
              >
                Coinbase Faucet
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

declare global {
  interface Window {
    ethereum?: any
  }
}
