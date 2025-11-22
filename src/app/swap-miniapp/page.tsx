'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SwapHorizontal, Droplets, List, Settings } from 'lucide-react'
import { SwapInterface } from '@/components/swap/SwapInterface'
import { LiquidityInterface } from '@/components/liquidity/LiquidityInterface'
import { TokenListManager } from '@/components/tokenlist/TokenListManager'
import NavigationBar from '@/components/NavigationBar'

type Tab = 'swap' | 'liquidity' | 'tokens'

export default function SwapMiniAppPage() {
  const [activeTab, setActiveTab] = useState<Tab>('swap')
  const [slippage, setSlippage] = useState(0.5)

  const tabs = [
    { id: 'swap' as Tab, label: 'Swap', icon: SwapHorizontal },
    { id: 'liquidity' as Tab, label: 'Liquidity', icon: Droplets },
    { id: 'tokens' as Tab, label: 'Tokens', icon: List },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <NavigationBar title="Base Swap" />
      
      <main className="container mx-auto px-4 py-6 pt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-2"
          >
            Base Chain Swap
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 dark:text-gray-400"
          >
            Swap, add liquidity, and manage tokens on Base
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs text-gray-500 dark:text-gray-500 mt-2"
          >
            Reference: <a 
              href="https://docs.base.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Base Documentation
            </a> | <a 
              href="https://docs.uniswap.org/contracts/v3/reference/deployments" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Uniswap V3 on Base
            </a>
          </motion.p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-white dark:bg-gray-800 rounded-xl p-1 shadow-lg border border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'swap' && (
              <SwapInterface
                slippage={slippage}
                onSlippageChange={setSlippage}
              />
            )}
            {activeTab === 'liquidity' && (
              <LiquidityInterface />
            )}
            {activeTab === 'tokens' && (
              <TokenListManager />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Info Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              🔄 Swap Tokens
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Exchange tokens instantly using Uniswap V3 on Base. Low fees, fast transactions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              💧 Add Liquidity
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Provide liquidity to pools and earn trading fees. Manage your LP positions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              📋 Token List
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Browse Base chain tokens. Search, favorite, and view token details.
            </p>
          </motion.div>
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          <p>
            Built on <span className="font-semibold">Base</span> • Powered by{' '}
            <span className="font-semibold">Uniswap V3</span>
          </p>
          <p className="mt-2 text-xs">
            Always verify token addresses. This is a demo interface.
          </p>
        </motion.div>
      </main>
    </div>
  )
}
