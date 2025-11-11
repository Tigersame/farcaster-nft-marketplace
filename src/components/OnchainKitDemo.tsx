'use client'

import { 
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownBasename,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet'
import { 
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
  useAvatar,
  useName,
} from '@coinbase/onchainkit/identity'
import { base } from 'viem/chains'
import { useState } from 'react'
import { useAccount } from 'wagmi'

export function OnchainKitDemo() {
  const { address } = useAccount()
  const [demoAddress] = useState('0x02feeb0AdE57b6adEEdE5A4EEea6Cf8c21BeB6B1') // Known Basename address
  
  // Use OnchainKit hooks to fetch Basename data
  const { data: demoName, isLoading: nameLoading } = useName({ 
    address: demoAddress as `0x${string}`, 
    chain: base 
  })
  const { data: demoAvatar, isLoading: avatarLoading } = useAvatar({ 
    ensName: demoName || '', 
    chain: base 
  })

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          OnchainKit + Basenames Integration
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Enhanced wallet and identity components with Base network Basename support
        </p>
      </div>

      <div className="space-y-6">
        {/* Enhanced Wallet Connection with Basename support */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Enhanced Wallet Connection
          </h3>
          <Wallet>
            <ConnectWallet>
              <Avatar address={address} className="h-6 w-6" chain={base} />
              <Name address={address} chain={base} />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <Avatar address={address} chain={base} />
                <Name address={address} chain={base} />
                <Address className="text-gray-500" />
                <EthBalance />
              </Identity>
              <WalletDropdownBasename />
              <WalletDropdownLink
                icon="wallet"
                href="https://keys.coinbase.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Wallet
              </WalletDropdownLink>
              <WalletDropdownLink
                icon="wallet"
                href="https://wallet.coinbase.com/funding"
                target="_blank"
                rel="noopener noreferrer"
              >
                Fund Wallet
              </WalletDropdownLink>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </div>

        {/* Basename Resolution Demo */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Basename Resolution Demo
          </h3>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="space-y-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Example Address: <code className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{demoAddress}</code>
              </div>
              
              {nameLoading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
                </div>
              ) : demoName ? (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-green-600 dark:text-green-400">
                    ✅ Basename Resolved: <strong>{demoName}</strong>
                  </div>
                  <Identity className="flex items-center space-x-3">
                    <Avatar 
                      address={demoAddress as `0x${string}`} 
                      chain={base} 
                      className="h-12 w-12" 
                    />
                    <div>
                      <Name 
                        address={demoAddress as `0x${string}`} 
                        chain={base} 
                        className="text-lg font-medium text-gray-900 dark:text-white" 
                      />
                      <Address 
                        address={demoAddress as `0x${string}`} 
                        className="text-sm text-gray-500 dark:text-gray-400" 
                      />
                    </div>
                  </Identity>
                </div>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  No Basename found for this address
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Current User Identity (if connected) */}
        {address && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your Identity
            </h3>
            <Identity className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Avatar address={address} className="h-12 w-12" chain={base} />
              <div className="ml-3">
                <Name address={address} className="text-lg font-medium" chain={base} />
                <Address className="text-sm text-gray-500 dark:text-gray-400" />
                <EthBalance className="text-sm font-medium text-blue-600 dark:text-blue-400" />
              </div>
            </Identity>
          </div>
        )}

        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
          <div>🎨 OnchainKit components automatically adapt to your app's theme</div>
          <div>🔗 Base chain integration enables Basename resolution</div>
          <div>⚡ Automatic fallback to ENS if no Basename is found</div>
        </div>
      </div>
    </div>
  )
}