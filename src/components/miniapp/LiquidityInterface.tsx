'use client'

import { useState } from 'react'
import { BASE_TOKENS } from '@/constants/tokens'
import { Token } from '@coinbase/onchainkit/token'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { toast } from 'react-hot-toast'
import { FaPlus, FaArrowDown } from 'react-icons/fa'

export function LiquidityInterface() {
  const { isConnected } = useAccount()
  const [token0, setToken0] = useState<Token>(BASE_TOKENS[0])
  const [token1, setToken1] = useState<Token>(BASE_TOKENS[2])
  const [amount0, setAmount0] = useState('')
  const [amount1, setAmount1] = useState('')

  const handleAddLiquidity = () => {
    toast.success('Liquidity provision simulated!', {
      icon: '🦄',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    })
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6">
        <p className="mb-4 text-lg font-medium">Connect your wallet to add liquidity</p>
        <ConnectButton />
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Add Liquidity</h2>
        </div>

        <div className="space-y-4">
          {/* Token 0 Input */}
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl">
            <div className="flex justify-between mb-2">
              <label className="text-sm text-gray-500">Deposit Amount</label>
              <span className="text-sm text-gray-500">Balance: 0.00</span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="number"
                placeholder="0.0"
                value={amount0}
                onChange={(e) => setAmount0(e.target.value)}
                className="bg-transparent text-2xl font-medium outline-none w-full"
              />
              <button className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-sm font-medium flex items-center gap-2 min-w-[100px]">
                <img src={token0.image} alt={token0.symbol} className="w-6 h-6 rounded-full" />
                {token0.symbol}
              </button>
            </div>
          </div>

          <div className="flex justify-center -my-2 relative z-10">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-lg border dark:border-gray-700">
              <FaPlus className="text-gray-400" />
            </div>
          </div>

          {/* Token 1 Input */}
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl">
            <div className="flex justify-between mb-2">
              <label className="text-sm text-gray-500">Deposit Amount</label>
              <span className="text-sm text-gray-500">Balance: 0.00</span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="number"
                placeholder="0.0"
                value={amount1}
                onChange={(e) => setAmount1(e.target.value)}
                className="bg-transparent text-2xl font-medium outline-none w-full"
              />
              <button className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-sm font-medium flex items-center gap-2 min-w-[100px]">
                <img src={token1.image} alt={token1.symbol} className="w-6 h-6 rounded-full" />
                {token1.symbol}
              </button>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-300">Pool Share</span>
              <span className="font-medium">< 0.01%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Fee Tier</span>
              <span className="font-medium">0.3%</span>
            </div>
          </div>

          <button 
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!amount0 || !amount1}
            onClick={handleAddLiquidity}
          >
            Add Liquidity
          </button>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="font-bold mb-4 px-2">Your Positions</h3>
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-center border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 mb-4">No active liquidity positions</p>
        </div>
      </div>
    </div>
  )
}
