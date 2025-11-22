'use client'

import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'
import { 
  Swap,
  SwapAmountInput,
  SwapToggleButton,
  SwapButton,
  SwapMessage,
  SwapToast,
} from '@coinbase/onchainkit/swap'
import { BASE_TOKENS } from '@/lib/baseTokens'
import { FiRefreshCw, FiSettings } from 'react-icons/fi'
import { useState } from 'react'

export function EnhancedSwapWidget() {
  const { address, isConnected } = useAccount()
  const [slippage, setSlippage] = useState('0.5')
  const [showSettings, setShowSettings] = useState(false)

  if (!isConnected) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-800/95 dark:to-gray-900/80 backdrop-blur-xl p-8 rounded-3xl max-w-lg mx-auto text-center border border-gray-200 dark:border-gray-700 shadow-2xl"
      >
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiRefreshCw className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Connect Wallet to Swap
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start trading tokens on Base network
          </p>
        </div>
        <ConnectButton />
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-800/95 dark:to-gray-900/80 backdrop-blur-xl rounded-3xl max-w-lg mx-auto border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FiRefreshCw className="w-5 h-5 text-white" />
            </div>
            Swap Tokens
          </h2>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FiSettings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-6 pt-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50"
          >
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                  Slippage Tolerance
                </label>
                <div className="flex gap-2">
                  {['0.1', '0.5', '1.0'].map((value) => (
                    <button
                      key={value}
                      onClick={() => setSlippage(value)}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                        slippage === value
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {value}%
                    </button>
                  ))}
                  <input
                    type="text"
                    value={slippage}
                    onChange={(e) => setSlippage(e.target.value)}
                    className="w-20 py-2 px-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Custom"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Swap Component */}
        <div className="p-6">
          {address ? (
            <Swap address={address}>
              <SwapAmountInput
                label="You Pay"
                swappableTokens={BASE_TOKENS}
                token={BASE_TOKENS[0]}
                type="from"
              />
              <div className="my-4 flex justify-center">
                <SwapToggleButton />
              </div>
              <SwapAmountInput
                label="You Receive"
                swappableTokens={BASE_TOKENS}
                token={BASE_TOKENS[1]}
                type="to"
              />
              <div className="mt-6">
                <SwapButton className="w-full" />
              </div>
              <div className="mt-4">
                <SwapMessage />
              </div>
            </Swap>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div className="px-6 pb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-1">
              💡 Powered by Base Network
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Low fees, fast transactions, and deep liquidity
            </p>
          </div>
        </div>
      </div>
      <SwapToast />
    </motion.div>
  )
}
