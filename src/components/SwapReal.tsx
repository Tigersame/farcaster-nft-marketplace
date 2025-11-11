'use client'

import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'
import { 
  Swap,
  SwapAmountInput,
  SwapToggleButton,
  SwapButton,
  SwapMessage,
} from '@coinbase/onchainkit/swap'
import type { Token } from '@coinbase/onchainkit/token'
import { base } from 'wagmi/chains'
import { BaseSvg, OnchainkitSvg } from './svg'

interface SwapRealProps {
  isSponsored?: boolean
  className?: string
}

export function SwapReal({ isSponsored = false, className = '' }: SwapRealProps) {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  
  // Check if on Base network
  const isOnBase = chainId === base.id
  
  // ETH token for Base
  const ETHToken: Token = {
    address: '',
    chainId: 8453,
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
    image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
  }

  // USDC token for Base
  const USDCToken: Token = {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    chainId: 8453,
    decimals: 6,
    name: 'USDC',
    symbol: 'USDC',
    image: 'https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden w-full max-w-md mx-auto ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BaseSvg className="w-5 h-5 text-white" />
            <span className="text-white font-semibold text-sm">Swap on Base</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-white bg-opacity-20 rounded-full">
            <OnchainkitSvg className="w-4 h-4 text-white" />
            <span className="text-white text-xs">OnchainKit</span>
          </div>
        </div>
        {isSponsored && (
          <div className="mt-1 text-xs text-blue-100">⚡ Gas sponsored</div>
        )}
      </div>

      {/* Swap Interface */}
      <div className="p-4">
        {!isConnected ? (
          <div className="text-center py-8 space-y-4">
            <p className="text-gray-600 dark:text-gray-300 mb-4">Connect your wallet to start swapping</p>
            <ConnectButton />
          </div>
        ) : !isOnBase ? (
          <div className="text-center py-8 space-y-4">
            <p className="text-gray-600 dark:text-gray-300">Please switch to Base network</p>
            <button
              onClick={() => switchChain?.({ chainId: base.id })}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Switch to Base
            </button>
          </div>
        ) : (
          address && (
            <Swap address={address}>
              <SwapAmountInput
                label="You pay"
                swappableTokens={[ETHToken, USDCToken]}
                token={ETHToken}
                type="from"
              />
              <SwapToggleButton />
              <SwapAmountInput
                label="You receive"
                swappableTokens={[USDCToken, ETHToken]}
                token={USDCToken}
                type="to"
              />
              <SwapButton />
              <SwapMessage />
            </Swap>
          )
        )}
      </div>
    </motion.div>
  )
}
