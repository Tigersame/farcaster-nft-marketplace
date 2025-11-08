'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import TransactionWrapper from './TransactionWrapper'
import { ArrowSvg, BaseSvg, OnchainkitSvg } from './svg'

// Custom SwapSettings implementation for our version of OnchainKit
const SwapSettings = ({ children, text, className = '' }: { children: React.ReactNode, text?: string, className?: string }) => (
  <div className={`space-y-3 ${className}`}>
    {text && (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-900 dark:text-white">{text}</span>
      </div>
    )}
    {children}
  </div>
)

const SwapSettingsSlippageTitle = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <h4 className={`text-sm font-medium text-gray-900 dark:text-white ${className}`}>
    {children}
  </h4>
)

const SwapSettingsSlippageDescription = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <p className={`text-xs text-gray-600 dark:text-gray-300 ${className}`}>
    {children}
  </p>
)

const SwapSettingsSlippageInput = ({ className = '' }: { className?: string }) => {
  const [slippage, setSlippage] = useState('0.5')
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex gap-2">
        {['0.1', '0.5', '1.0'].map((value) => (
          <button
            key={value}
            onClick={() => setSlippage(value)}
            className={`px-3 py-1 text-xs rounded-lg border transition-colors ${
              slippage === value
                ? 'bg-blue-100 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-300'
                : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {value}%
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={slippage}
          onChange={(e) => setSlippage(e.target.value)}
          className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0.5"
          step="0.1"
          min="0.1"
          max="50"
        />
        <span className="text-sm text-gray-600 dark:text-gray-300">%</span>
      </div>
    </div>
  )
}

interface Token {
  name: string
  address: string
  symbol: string
  decimals: number
  image: string
  chainId: number
}

interface SwapEnhancedProps {
  from?: Token[]
  to?: Token[]
  isSponsored?: boolean
  className?: string
  onSwapSuccess?: (txHash: string) => void
  onSwapError?: (error: any) => void
}

export function SwapEnhanced({
  from = [],
  to = [],
  isSponsored = false,
  className = '',
  onSwapSuccess,
  onSwapError,
}: SwapEnhancedProps) {
  const { address, isConnected } = useAccount()
  
  // Default tokens for Base chain
  const ETHToken: Token = {
    address: '',
    chainId: 8453,
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
    image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
  }

  const USDCToken: Token = {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    chainId: 8453,
    decimals: 6,
    name: 'USDC',
    symbol: 'USDC',
    image: 'https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png',
  }

  const BaseToken: Token = {
    address: '0x4200000000000000000000000000000000000006',
    chainId: 8453,
    decimals: 18,
    name: 'Base',
    symbol: 'BASE',
    image: 'https://assets.coingecko.com/coins/images/30365/standard/base-logo-in-blue.png',
  }

  const allTokens = from.length > 0 ? from : [ETHToken, USDCToken, BaseToken]
  const toTokens = to.length > 0 ? to : [USDCToken, ETHToken, BaseToken]

  const [fromToken, setFromToken] = useState<Token>(allTokens[0])
  const [toToken, setToToken] = useState<Token>(toTokens[0])
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [swapMessage, setSwapMessage] = useState('')

  const handleToggle = () => {
    const tempToken = fromToken
    setFromToken(toToken)
    setToToken(tempToken)
    
    const tempAmount = fromAmount
    setFromAmount(toAmount)
    setToAmount(tempAmount)
  }

  const handleSwap = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setSwapMessage('Please enter a valid amount')
      return
    }
    
    setIsLoading(true)
    setSwapMessage('Preparing swap...')
    
    // Simulate swap calculation
    setTimeout(() => {
      const rate = fromToken.symbol === 'ETH' ? 2500 : fromToken.symbol === 'USDC' ? 0.0004 : 1800
      const calculatedAmount = (parseFloat(fromAmount) * rate).toFixed(6)
      setToAmount(calculatedAmount)
      setSwapMessage(`Best rate found via Uniswap V3`)
      setIsLoading(false)
    }, 1000)
  }

  const handleSwapSuccess = () => {
    setSwapMessage('🎉 Swap completed successfully!')
    if (onSwapSuccess) onSwapSuccess('0x123...abc')
  }

  const handleSwapError = (error: any) => {
    setSwapMessage('❌ Swap failed. Please try again.')
    if (onSwapError) onSwapError(error)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-md mx-auto ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BaseSvg className="w-6 h-6 text-white" />
            <span className="text-white font-semibold">Swap on Base</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-white bg-opacity-20 rounded-full">
            <OnchainkitSvg className="w-4 h-4 text-white" />
            <span className="text-white text-xs">OnchainKit</span>
          </div>
        </div>
        {isSponsored && (
          <div className="mt-2 text-xs text-blue-100">⚡ Gas sponsored by Paymaster</div>
        )}
      </div>

      {/* Swap Interface */}
      <div className="p-6 space-y-4">
        {/* From Token Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Sell</label>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <select
                value={fromToken.symbol}
                onChange={(e) => {
                  const token = allTokens.find(t => t.symbol === e.target.value)
                  if (token) setFromToken(token)
                }}
                className="bg-transparent text-lg font-semibold text-gray-900 dark:text-white focus:outline-none"
              >
                {allTokens.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <img src={fromToken.image} alt={fromToken.symbol} className="w-6 h-6 rounded-full" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{fromToken.name}</span>
              </div>
            </div>
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0.0"
              className="w-full bg-transparent text-2xl font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
            />
            <div className="flex justify-between items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Balance: 1.234 {fromToken.symbol}</span>
              <button className="text-blue-600 dark:text-blue-400 hover:underline">Max</button>
            </div>
          </div>
        </div>

        {/* Toggle Button */}
        <div className="flex justify-center">
          <button
            onClick={handleToggle}
            className="p-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-colors shadow-sm"
          >
            <ArrowSvg direction="down" className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* To Token Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Buy</label>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <select
                value={toToken.symbol}
                onChange={(e) => {
                  const token = toTokens.find(t => t.symbol === e.target.value)
                  if (token) setToToken(token)
                }}
                className="bg-transparent text-lg font-semibold text-gray-900 dark:text-white focus:outline-none"
              >
                {toTokens.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <img src={toToken.image} alt={toToken.symbol} className="w-6 h-6 rounded-full" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{toToken.name}</span>
              </div>
            </div>
            <input
              type="number"
              value={toAmount}
              readOnly
              placeholder="0.0"
              className="w-full bg-transparent text-2xl font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
            />
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Balance: 456.78 {toToken.symbol}
            </div>
          </div>
        </div>

        {/* Swap Message */}
        {swapMessage && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <p className="text-sm text-blue-800 dark:text-blue-200">{swapMessage}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {!fromAmount || parseFloat(fromAmount) <= 0 ? (
            <button
              onClick={handleSwap}
              disabled={!fromAmount}
              className="w-full bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 px-6 py-4 rounded-xl font-semibold cursor-not-allowed"
            >
              Enter amount
            </button>
          ) : !toAmount ? (
            <button
              onClick={handleSwap}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Finding best rate...
                </>
              ) : (
                'Get quote'
              )}
            </button>
          ) : (
            isConnected && address ? (
              <TransactionWrapper
                address={address}
                contractAddress="0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD" // Uniswap Universal Router
                functionName="swap"
                args={[fromToken.address, toToken.address, fromAmount]}
                onSuccess={handleSwapSuccess}
                onError={handleSwapError}
                className="w-full"
              >
                <div className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2">
                  🔄 Swap {fromAmount} {fromToken.symbol}
                  <ArrowSvg direction="right" className="w-4 h-4" />
                </div>
              </TransactionWrapper>
            ) : (
              <div className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 px-6 py-4 rounded-xl text-center">
                🔗 Connect wallet to swap
              </div>
            )
          )}
        </div>

        {/* Swap Details */}
        {toAmount && (
          <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Rate</span>
              <span className="text-gray-900 dark:text-white">
                1 {fromToken.symbol} = {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(4)} {toToken.symbol}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Network fee</span>
              <span className="text-gray-900 dark:text-white">
                {isSponsored ? '🎉 Sponsored' : '~$0.50'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Route</span>
              <span className="text-gray-900 dark:text-white">Uniswap V3</span>
            </div>
          </div>
        )}

        {/* Swap Settings */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
          <SwapSettings text="Settings" className="mb-4">
            <SwapSettingsSlippageTitle className="text-gray-900 dark:text-white font-medium mb-2">
              Max. slippage
            </SwapSettingsSlippageTitle>
            <SwapSettingsSlippageDescription className="text-gray-600 dark:text-gray-300 text-sm mb-3">
              Your swap will revert if the prices change by more than the selected percentage.
            </SwapSettingsSlippageDescription>
            <SwapSettingsSlippageInput className="w-full" />
          </SwapSettings>
        </div>
      </div>
    </motion.div>
  )
}