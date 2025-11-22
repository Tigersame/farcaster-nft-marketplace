'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { EnhancedSwapWidget } from '@/components/defi/EnhancedSwapWidget'
import { TokenList } from '@/components/defi/TokenList'
import { LiquidityPools } from '@/components/defi/LiquidityPools'
import NavigationBar from '@/components/NavigationBar'
import { FiRefreshCw, FiDollarSign, FiDroplet, FiTrendingUp } from 'react-icons/fi'

export const dynamic = 'force-dynamic'

type TabType = 'swap' | 'tokens' | 'pools'

export default function DeFiPage() {
  const [activeTab, setActiveTab] = useState<TabType>('swap')

  const tabs = [
    { id: 'swap' as TabType, label: 'Swap', icon: FiRefreshCw, color: 'from-blue-500 to-purple-600' },
    { id: 'tokens' as TabType, label: 'Tokens', icon: FiDollarSign, color: 'from-green-500 to-emerald-600' },
    { id: 'pools' as TabType, label: 'Liquidity', icon: FiDroplet, color: 'from-purple-500 to-pink-600' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0b0b] via-[#1a1a2e] to-[#0b0b0b]">
      <NavigationBar title="DeFi Hub" />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-2xl opacity-50"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl">
                  <FiTrendingUp className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Base Chain <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">DeFi Hub</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Trade tokens, provide liquidity, and earn rewards on Base network
            </p>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { label: 'Total Value Locked', value: '$507M+' },
                { label: '24h Volume', value: '$56M+' },
                { label: 'Total Tokens', value: '8+' },
                { label: 'Liquidity Pools', value: '5' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10"
                >
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex bg-white/5 backdrop-blur-xl p-2 rounded-2xl border border-white/10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content Area */}
          <div className="max-w-7xl mx-auto">
            {activeTab === 'swap' && (
              <motion.div
                key="swap"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                <div className="lg:col-span-2">
                  <EnhancedSwapWidget />
                </div>
                <div className="space-y-6">
                  {/* Recent Swaps Card */}
                  <div className="bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-800/95 dark:to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-2xl">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      Recent Swaps
                    </h3>
                    <div className="space-y-3">
                      {[
                        { from: 'ETH', to: 'USDC', amount: '1.5', time: '2m ago' },
                        { from: 'USDC', to: 'DAI', amount: '1000', time: '5m ago' },
                        { from: 'WETH', to: 'cbETH', amount: '0.8', time: '8m ago' },
                      ].map((swap, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {swap.from} → {swap.to}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {swap.time}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Info Card */}
                  <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-3xl p-6 border border-blue-500/20">
                    <h3 className="text-lg font-bold text-white mb-2">
                      Why Trade on Base?
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>Ultra-low transaction fees (pennies)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>Lightning-fast confirmation times</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>Deep liquidity across major pairs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>Secure and battle-tested infrastructure</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'tokens' && (
              <motion.div
                key="tokens"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <TokenList />
              </motion.div>
            )}

            {activeTab === 'pools' && (
              <motion.div
                key="pools"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <LiquidityPools />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="relative mt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-center shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-2">
              Ready to start trading?
            </h3>
            <p className="text-blue-100 mb-6">
              Connect your wallet and trade tokens with confidence on Base network
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white hover:bg-gray-100 text-purple-600 font-semibold rounded-xl transition-all shadow-lg">
                Connect Wallet
              </button>
              <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/20">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
