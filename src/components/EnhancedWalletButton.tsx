'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { 
  Avatar,
  Name,
  Address,
  Identity,
} from '@coinbase/onchainkit/identity'
import { CompactDarkModeToggle } from './DarkModeToggle'
import { FiSearch, FiMenu, FiUser } from 'react-icons/fi'
import { useAccount } from 'wagmi'
import { base } from 'viem/chains'

export function EnhancedWalletButton() {
  const { address, isConnected } = useAccount()

  if (!isConnected) {
    return <ConnectButton />
  }

  return (
    <div className="flex items-center space-x-3">
      {/* OnchainKit Identity with Basename support */}
      <Identity className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer">
        <Avatar 
          address={address} 
          chain={base} 
          className="h-6 w-6" 
        />
        <div className="hidden sm:block">
          <Name 
            address={address} 
            chain={base} 
            className="text-sm font-medium text-gray-900 dark:text-white" 
          />
        </div>
      </Identity>
      
      {/* RainbowKit Connect Button for wallet management */}
      <ConnectButton.Custom>
        {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
          return (
            <div className="flex items-center space-x-2">
              {mounted && account && chain && (
                <>
                  <button
                    onClick={openChainModal}
                    className="flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    {chain.hasIcon && (
                      <div className="w-4 h-4">
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            className="w-4 h-4"
                          />
                        )}
                      </div>
                    )}
                    <span>{chain.name}</span>
                  </button>
                  
                  <button
                    onClick={openAccountModal}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    <FiUser className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          )
        }}
      </ConnectButton.Custom>
    </div>
  )
}