'use client'

import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { 
  Swap,
  SwapAmountInput,
  SwapToggleButton,
  SwapButton,
  SwapMessage,
} from '@coinbase/onchainkit/swap'
import { BASE_TOKENS } from '@/constants/tokens'
import { useState } from 'react'

export function SwapInterface() {
  const { address, isConnected } = useAccount()
  const [fromToken, setFromToken] = useState(BASE_TOKENS[0])
  const [toToken, setToToken] = useState(BASE_TOKENS[2]) // USDC default

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6">
        <p className="mb-4 text-lg font-medium">Connect your wallet to start swapping</p>
        <ConnectButton />
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-2 shadow-sm border border-gray-100 dark:border-gray-700">
        {address && (
          <Swap address={address}>
            <div className="flex justify-between items-center px-4 py-2 mb-2">
              <h2 className="text-lg font-bold">Swap</h2>
            </div>
            
            <SwapAmountInput
              label="Sell"
              swappableTokens={BASE_TOKENS}
              token={fromToken}
              onTokenChange={setFromToken}
              type="from"
            />
            
            <div className="relative h-4">
              <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <SwapToggleButton />
              </div>
            </div>

            <SwapAmountInput
              label="Buy"
              swappableTokens={BASE_TOKENS}
              token={toToken}
              onTokenChange={setToToken}
              type="to"
            />
            
            <div className="mt-4">
              <SwapButton />
            </div>
            
            <div className="mt-2">
              <SwapMessage />
            </div>
          </Swap>
        )}
      </div>
    </div>
  )
}
