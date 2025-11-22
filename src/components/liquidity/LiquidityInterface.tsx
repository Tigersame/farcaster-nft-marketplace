'use client'

import { useState, useEffect } from 'react'
import { useAccount, useBalance, useWriteContract } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'
import { Plus, Minus, TrendingUp, Info } from 'lucide-react'
import { Token, BASE_TOKENS, ETH, USDC } from '@/lib/baseTokens'
import { TokenSelector } from '../swap/TokenSelector'
import { formatUnits, parseUnits, Address } from 'viem'
import { base } from 'wagmi/chains'
import toast from 'react-hot-toast'

interface LiquidityInterfaceProps {
  mode?: 'add' | 'remove'
}

export function LiquidityInterface({ mode: initialMode = 'add' }: LiquidityInterfaceProps) {
  const { address, isConnected } = useAccount()
  const [mode, setMode] = useState<'add' | 'remove'>(initialMode)
  const [token0, setToken0] = useState<Token>(ETH)
  const [token1, setToken1] = useState<Token>(USDC)
  const [amount0, setAmount0] = useState('')
  const [amount1, setAmount1] = useState('')
  const [showTokenSelector, setShowTokenSelector] = useState<'token0' | 'token1' | null>(null)
  const [lpTokens, setLpTokens] = useState('0') // LP tokens user owns
  const [poolShare, setPoolShare] = useState(0) // User's share of pool
  const [poolLiquidity, setPoolLiquidity] = useState({ token0: '0', token1: '0' })

  const { data: token0Balance } = useBalance({
    address,
    token: token0.address === ETH.address ? undefined : (token0.address as Address),
    chainId: base.id,
  })

  const { data: token1Balance } = useBalance({
    address,
    token: token1.address === ETH.address ? undefined : (token1.address as Address),
    chainId: base.id,
  })

  const { writeContract } = useWriteContract()

  // Calculate amounts based on pool ratio (mock)
  useEffect(() => {
    if (mode === 'add' && amount0 && parseFloat(amount0) > 0) {
      // Mock calculation - in production, use actual pool reserves
      const ratio = token0.symbol === 'ETH' ? 2500 : 1
      const calculatedAmount1 = (parseFloat(amount0) * ratio).toFixed(6)
      setAmount1(calculatedAmount1)
    } else if (mode === 'remove' && lpTokens && parseFloat(lpTokens) > 0) {
      // Mock calculation for removal
      const totalLP = 1000 // Mock total LP tokens
      const share = parseFloat(lpTokens) / totalLP
      setPoolShare(share * 100)
      
      // Mock pool reserves
      const poolToken0 = 100 // Mock
      const poolToken1 = 250000 // Mock
      setPoolLiquidity({
        token0: (poolToken0 * share).toFixed(6),
        token1: (poolToken1 * share).toFixed(6),
      })
      setAmount0((poolToken0 * share).toFixed(6))
      setAmount1((poolToken1 * share).toFixed(6))
    }
  }, [amount0, lpTokens, mode, token0])

  const handleAddLiquidity = async () => {
    if (!address || !isConnected) {
      toast.error('Please connect your wallet')
      return
    }

    if (!amount0 || parseFloat(amount0) <= 0 || !amount1 || parseFloat(amount1) <= 0) {
      toast.error('Please enter valid amounts')
      return
    }

    try {
      toast.loading('Adding liquidity...')
      
      // In production, this would:
      // 1. Approve tokens if needed
      // 2. Call Uniswap V3 addLiquidity or similar
      // 3. Handle native ETH wrapping if needed
      
      // Mock success
      setTimeout(() => {
        toast.success('Liquidity added successfully!')
        setAmount0('')
        setAmount1('')
      }, 2000)
    } catch (error: any) {
      toast.error(error.message || 'Failed to add liquidity')
    }
  }

  const handleRemoveLiquidity = async () => {
    if (!address || !isConnected) {
      toast.error('Please connect your wallet')
      return
    }

    if (!lpTokens || parseFloat(lpTokens) <= 0) {
      toast.error('Please enter LP token amount')
      return
    }

    try {
      toast.loading('Removing liquidity...')
      
      // In production, this would:
      // 1. Approve LP tokens
      // 2. Call removeLiquidity
      // 3. Burn LP tokens and receive underlying tokens
      
      // Mock success
      setTimeout(() => {
        toast.success('Liquidity removed successfully!')
        setLpTokens('0')
        setAmount0('')
        setAmount1('')
      }, 2000)
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove liquidity')
    }
  }

  const handleMax = (token: 'token0' | 'token1') => {
    if (token === 'token0' && token0Balance) {
      const balance = parseFloat(formatUnits(token0Balance.value, token0Balance.decimals))
      setAmount0(balance.toString())
    } else if (token === 'token1' && token1Balance) {
      const balance = parseFloat(formatUnits(token1Balance.value, token1Balance.decimals))
      setAmount1(balance.toString())
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {/* Header with Mode Toggle */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setMode('add')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                mode === 'add'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Add
            </button>
            <button
              onClick={() => setMode('remove')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                mode === 'remove'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              <Minus className="w-4 h-4 inline mr-2" />
              Remove
            </button>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {mode === 'add' ? 'Add Liquidity' : 'Remove Liquidity'}
          </h2>
        </div>

        {/* Add Liquidity Mode */}
        {mode === 'add' && (
          <div className="p-4 space-y-4">
            {/* Token 0 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Token 0</span>
                {token0Balance && (
                  <span className="text-gray-500 dark:text-gray-400">
                    Balance: {parseFloat(formatUnits(token0Balance.value, token0Balance.decimals)).toFixed(4)}
                  </span>
                )}
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <input
                    type="number"
                    value={amount0}
                    onChange={(e) => setAmount0(e.target.value)}
                    placeholder="0.0"
                    className="flex-1 bg-transparent text-xl font-semibold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                  />
                  <button
                    onClick={() => setShowTokenSelector('token0')}
                    className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {token0.logoURI && (
                      <img src={token0.logoURI} alt={token0.symbol} className="w-6 h-6 rounded-full" />
                    )}
                    <span className="font-semibold text-gray-900 dark:text-white">{token0.symbol}</span>
                  </button>
                </div>
                <button
                  onClick={() => handleMax('token0')}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Token 1 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Token 1</span>
                {token1Balance && (
                  <span className="text-gray-500 dark:text-gray-400">
                    Balance: {parseFloat(formatUnits(token1Balance.value, token1Balance.decimals)).toFixed(4)}
                  </span>
                )}
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <input
                    type="number"
                    value={amount1}
                    onChange={(e) => setAmount1(e.target.value)}
                    placeholder="0.0"
                    className="flex-1 bg-transparent text-xl font-semibold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                  />
                  <button
                    onClick={() => setShowTokenSelector('token1')}
                    className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {token1.logoURI && (
                      <img src={token1.logoURI} alt={token1.symbol} className="w-6 h-6 rounded-full" />
                    )}
                    <span className="font-semibold text-gray-900 dark:text-white">{token1.symbol}</span>
                  </button>
                </div>
                <button
                  onClick={() => handleMax('token1')}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Pool Info */}
            {amount0 && amount1 && parseFloat(amount0) > 0 && parseFloat(amount1) > 0 && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                    <Info className="w-4 h-4" />
                    Pool Ratio
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    1 {token0.symbol} = {(parseFloat(amount1) / parseFloat(amount0)).toFixed(4)} {token1.symbol}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Share of Pool</span>
                  <span className="text-gray-900 dark:text-white">~0.01%</span>
                </div>
              </div>
            )}

            {/* Add Button */}
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
                onClick={handleAddLiquidity}
                disabled={!amount0 || !amount1 || parseFloat(amount0) <= 0 || parseFloat(amount1) <= 0}
                className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-colors ${
                  amount0 && amount1 && parseFloat(amount0) > 0 && parseFloat(amount1) > 0
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                Add Liquidity
              </button>
            )}
          </div>
        )}

        {/* Remove Liquidity Mode */}
        {mode === 'remove' && (
          <div className="p-4 space-y-4">
            {/* LP Token Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">LP Tokens</span>
                <span className="text-gray-500 dark:text-gray-400">
                  You own: {lpTokens}
                </span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <input
                  type="number"
                  value={lpTokens}
                  onChange={(e) => setLpTokens(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-transparent text-xl font-semibold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                />
                <button
                  onClick={() => setLpTokens('100')} // Mock max
                  className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Pool Share Info */}
            {lpTokens && parseFloat(lpTokens) > 0 && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    Pool Share
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {poolShare.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">You will receive:</span>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">{token0.symbol}</span>
                    <span className="text-gray-900 dark:text-white font-medium">{amount0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">{token1.symbol}</span>
                    <span className="text-gray-900 dark:text-white font-medium">{amount1}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Remove Button */}
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
                onClick={handleRemoveLiquidity}
                disabled={!lpTokens || parseFloat(lpTokens) <= 0}
                className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-colors ${
                  lpTokens && parseFloat(lpTokens) > 0
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                Remove Liquidity
              </button>
            )}
          </div>
        )}
      </motion.div>

      {/* Token Selector Modal */}
      {showTokenSelector && (
        <TokenSelector
          tokens={BASE_TOKENS}
          selectedToken={showTokenSelector === 'token0' ? token0 : token1}
          onSelect={(token) => {
            if (showTokenSelector === 'token0') {
              setToken0(token)
            } else {
              setToken1(token)
            }
          }}
          onClose={() => setShowTokenSelector(null)}
        />
      )}
    </div>
  )
}
