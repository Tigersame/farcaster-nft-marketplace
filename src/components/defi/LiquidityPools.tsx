'use client'

import { motion } from 'framer-motion'
import { MOCK_LIQUIDITY_POOLS } from '@/lib/baseTokens'
import { FiDroplet, FiTrendingUp, FiExternalLink, FiPlusCircle } from 'react-icons/fi'
import { useState } from 'react'

export function LiquidityPools() {
  const [selectedPool, setSelectedPool] = useState<string | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-800/95 dark:to-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <FiDroplet className="w-5 h-5 text-white" />
            </div>
            Liquidity Pools
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl">
            <FiPlusCircle className="w-4 h-4" />
            Add Liquidity
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Earn fees by providing liquidity to trading pairs
        </p>
      </div>

      {/* Pool Stats Overview */}
      <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {MOCK_LIQUIDITY_POOLS.length}
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Total Pools</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              $118M+
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Total TVL</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              $21M+
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">24h Volume</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              13.1%
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Avg APR</div>
          </div>
        </div>
      </div>

      {/* Pools Grid */}
      <div className="p-6 space-y-4">
        {MOCK_LIQUIDITY_POOLS.map((pool, index) => (
          <motion.div
            key={pool.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative overflow-hidden rounded-2xl border-2 transition-all cursor-pointer ${
              selectedPool === pool.id
                ? 'border-purple-500 dark:border-purple-400 shadow-lg shadow-purple-500/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
            }`}
            onClick={() => setSelectedPool(selectedPool === pool.id ? null : pool.id)}
          >
            <div className="bg-white dark:bg-gray-800 p-6">
              {/* Pool Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Token Icons */}
                  <div className="flex items-center -space-x-2">
                    <img
                      src={pool.token0.image}
                      alt={pool.token0.symbol}
                      className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 relative z-10"
                    />
                    <img
                      src={pool.token1.image}
                      alt={pool.token1.symbol}
                      className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {pool.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Fee: {pool.fee}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                    <FiTrendingUp className="w-5 h-5" />
                    {pool.apr}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">APR</div>
                </div>
              </div>

              {/* Pool Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Total Value Locked
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {pool.tvl}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    24h Volume
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {pool.volume24h}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedPool === pool.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Pool Address</span>
                    <a
                      href={`https://basescan.org/address/${pool.poolAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="font-mono text-xs">
                        {pool.poolAddress.slice(0, 6)}...{pool.poolAddress.slice(-4)}
                      </span>
                      <FiExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Add liquidity logic
                      }}
                      className="py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
                    >
                      Add Liquidity
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Remove liquidity logic
                      }}
                      className="py-2 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-all"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Pool Composition */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pool Composition
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <img
                            src={pool.token0.image}
                            alt={pool.token0.symbol}
                            className="w-5 h-5 rounded-full"
                          />
                          <span className="text-gray-900 dark:text-white font-medium">
                            {pool.token0.symbol}
                          </span>
                        </div>
                        <span className="text-gray-600 dark:text-gray-400">50%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <img
                            src={pool.token1.image}
                            alt={pool.token1.symbol}
                            className="w-5 h-5 rounded-full"
                          />
                          <span className="text-gray-900 dark:text-white font-medium">
                            {pool.token1.symbol}
                          </span>
                        </div>
                        <span className="text-gray-600 dark:text-gray-400">50%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Start Earning Passive Income
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Provide liquidity to earn trading fees from every swap
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl">
            Learn More About Liquidity Pools
          </button>
        </div>
      </div>
    </motion.div>
  )
}
