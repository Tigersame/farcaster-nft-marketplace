'use client'

import { useState } from 'react'
import { SwapInterface } from './SwapInterface'
import { LiquidityInterface } from './LiquidityInterface'
import { TokenListInterface } from './TokenListInterface'
import { motion, AnimatePresence } from 'framer-motion'

type Tab = 'swap' | 'liquidity' | 'tokens'

export function MiniappContainer() {
  const [activeTab, setActiveTab] = useState<Tab>('swap')

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Navigation Tabs */}
      <div className="flex justify-center mb-6">
        <div className="bg-white dark:bg-gray-800 p-1 rounded-2xl inline-flex shadow-sm border border-gray-100 dark:border-gray-700">
          {(['swap', 'liquidity', 'tokens'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === tab 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'swap' && <SwapInterface />}
          {activeTab === 'liquidity' && <LiquidityInterface />}
          {activeTab === 'tokens' && <TokenListInterface />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
