'use client'

import { useState, useEffect } from 'react'
import { useAccount, useBalance, useWriteContract } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'
import { ArrowDownUp, Settings, Info } from 'lucide-react'
import { Token, BASE_TOKENS, ETH, USDC } from '@/lib/baseTokens'
import { TokenSelector } from './TokenSelector'
import { formatUnits, parseUnits, Address } from 'viem'
import { base } from 'wagmi/chains'
import toast from 'react-hot-toast'

interface SwapInterfaceProps {
  slippage?: number
  onSlippageChange?: (slippage: number) => void
}

export function SwapInterface({
  slippage = 0.5,
  onSlippageChange,
}: SwapInterfaceProps) {
  const { address, isConnected } = useAccount()
  const [fromToken, setFromToken] = useState<Token>(ETH)
  const [toToken, setToToken] = useState<Token>(USDC)
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [showTokenSelector, setShowTokenSelector] = useState<'from' | 'to' | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [priceImpact, setPriceImpact] = useState<number | null>(null)
  const [exchangeRate, setExchangeRate] = useState<string>('')

  // Get balances
  const { data: fromBalance } = useBalance({
    address,
    token: fromToken.address === ETH.address ? undefined : (fromToken.address as Address),
    chainId: base.id,
  })

  const { data: toBalance } = useBalance({
    address,
    token: toToken.address === ETH.address ? undefined : (toToken.address as Address),
    chainId: base.id,
  })

  // Approve token spending (for ERC20 tokens)
  const { writeContract: approveToken } = useWriteContract()

  // Calculate swap quote (mock - replace with actual Uniswap V3 quote)
  useEffect(() => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setToAmount('')
      setExchangeRate('')
      setPriceImpact(null)
      return
    }

    // Mock exchange rate calculation
    // In production, use Uniswap V3 quoter contract
    const mockRate = fromToken.symbol === 'ETH' ? 2500 : fromToken.symbol === 'USDC' ? 0.0004 : 1
    const calculatedAmount = (parseFloat(fromAmount) * mockRate).toFixed(6)
    setToAmount(calculatedAmount)
    setExchangeRate(`1 ${fromToken.symbol} = ${mockRate.toFixed(4)} ${toToken.symbol}`)
    
    // Mock price impact (should be calculated from liquidity depth)
    const impact = parseFloat(fromAmount) > 1 ? 0.5 : parseFloat(fromAmount) > 0.1 ? 1.2 : 2.5
    setPriceImpact(impact)
  }, [fromAmount, fromToken, toToken])

  const handleToggle = () => {
    const tempToken = fromToken
    setFromToken(toToken)
    setToToken(tempToken)
    const tempAmount = fromAmount
    setFromAmount(toAmount)
    setToAmount(tempAmount)
  }

  const handleMax = () => {
    if (fromBalance) {
      const balance = parseFloat(formatUnits(fromBalance.value, fromBalance.decimals))
      setFromAmount(balance.toString())
    }
  }

  const handleSwap = async () => {
    if (!address || !isConnected) {
      toast.error('Please connect your wallet')
      return
    }

    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    try {
      // If swapping ERC20, need to approve first
      if (fromToken.address !== ETH.address) {
        // Check allowance
        // For now, we'll just show a toast
        toast.loading('Approving token...')
        
        // In production, check allowance and approve if needed
        // Then proceed with swap
      }

      // Execute swap via Uniswap V3 Router
      // This is a mock - replace with actual contract call
      toast.success('Swap executed successfully!')
      
      // Reset amounts
      setFromAmount('')
      setToAmount('')
    } catch (error: any) {
      toast.error(error.message || 'Swap failed')
    }
  }

  const toggleFavorite = (tokenAddress: string) => {
    setFavorites((prev) =>
      prev.includes(tokenAddress)
        ? prev.filter((addr) => addr !== tokenAddress)
        : [...prev, tokenAddress]
    )
  }

  const canSwap = fromAmount && parseFloat(fromAmount) > 0 && toAmount && isConnected

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Swap</h2>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
          >
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Slippage Tolerance
                </label>
                <div className="flex gap-2">
                  {[0.1, 0.5, 1.0].map((value) => (
                    <button
                      key={value}
                      onClick={() => onSlippageChange?.(value)}
                      className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                        slippage === value
                          ? 'bg-blue-100 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-300'
                          : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {value}%
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={slippage}
                  onChange={(e) => onSlippageChange?.(parseFloat(e.target.value) || 0)}
                  className="mt-2 w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Custom"
                  step="0.1"
                  min="0.1"
                  max="50"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Swap Interface */}
        <div className="p-4 space-y-4">
          {/* From Token */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">From</span>
              {fromBalance && (
                <span className="text-gray-500 dark:text-gray-400">
                  Balance: {parseFloat(formatUnits(fromBalance.value, fromBalance.decimals)).toFixed(4)}
                </span>
              )}
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  placeholder="0.0"
                  className="flex-1 bg-transparent text-2xl font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                />
                <button
                  onClick={() => setShowTokenSelector('from')}
                  className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {fromToken.logoURI && (
                    <img src={fromToken.logoURI} alt={fromToken.symbol} className="w-6 h-6 rounded-full" />
                  )}
                  <span className="font-semibold text-gray-900 dark:text-white">{fromToken.symbol}</span>
                </button>
              </div>
              <button
                onClick={handleMax}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                MAX
              </button>
            </div>
          </div>

          {/* Toggle Button */}
          <div className="flex justify-center -my-2">
            <button
              onClick={handleToggle}
              className="p-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors shadow-sm z-10"
            >
              <ArrowDownUp className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* To Token */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">To</span>
              {toBalance && (
                <span className="text-gray-500 dark:text-gray-400">
                  Balance: {parseFloat(formatUnits(toBalance.value, toBalance.decimals)).toFixed(4)}
                </span>
              )}
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <input
                  type="text"
                  value={toAmount || '0.0'}
                  readOnly
                  placeholder="0.0"
                  className="flex-1 bg-transparent text-2xl font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                />
                <button
                  onClick={() => setShowTokenSelector('to')}
                  className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {toToken.logoURI && (
                    <img src={toToken.logoURI} alt={toToken.symbol} className="w-6 h-6 rounded-full" />
                  )}
                  <span className="font-semibold text-gray-900 dark:text-white">{toToken.symbol}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Swap Details */}
          {toAmount && parseFloat(toAmount) > 0 && (
            <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  <Info className="w-4 h-4" />
                  Exchange Rate
                </span>
                <span className="text-gray-900 dark:text-white font-medium">{exchangeRate}</span>
              </div>
              {priceImpact !== null && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Price Impact</span>
                  <span className={`font-medium ${
                    priceImpact > 3 ? 'text-red-600 dark:text-red-400' :
                    priceImpact > 1 ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-green-600 dark:text-green-400'
                  }`}>
                    {priceImpact.toFixed(2)}%
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Slippage Tolerance</span>
                <span className="text-gray-900 dark:text-white">{slippage}%</span>
              </div>
            </div>
          )}

          {/* Swap Button */}
          {!isConnected ? (
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button
                  onClick={openConnectModal}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-semibold text-lg transition-colors"
                >
                  Connect Wallet
                </button>
              )}
            </ConnectButton.Custom>
          ) : (
            <button
              onClick={handleSwap}
              disabled={!canSwap}
              className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-colors ${
                canSwap
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              {!fromAmount ? 'Enter amount' : 'Swap'}
            </button>
          )}
        </div>
      </motion.div>

      {/* Token Selector Modal */}
      {showTokenSelector && (
        <TokenSelector
          tokens={BASE_TOKENS}
          selectedToken={showTokenSelector === 'from' ? fromToken : toToken}
          onSelect={(token) => {
            if (showTokenSelector === 'from') {
              setFromToken(token)
            } else {
              setToToken(token)
            }
          }}
          onClose={() => setShowTokenSelector(null)}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  )
}
