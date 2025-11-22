'use client'

import { motion } from 'framer-motion'
import { BASE_TOKENS } from '@/lib/baseTokens'
import { FiSearch, FiTrendingUp, FiDollarSign, FiStar } from 'react-icons/fi'
import { useState } from 'react'
import type { Token } from '@coinbase/onchainkit/token'

interface TokenWithPrice extends Token {
  price?: string
  change24h?: string
  marketCap?: string
  volume24h?: string
}

const TOKENS_WITH_PRICES: TokenWithPrice[] = [
  { ...BASE_TOKENS[0], price: '$3,245.67', change24h: '+2.34%', marketCap: '$389.2B', volume24h: '$15.2B' },
  { ...BASE_TOKENS[1], price: '$1.00', change24h: '+0.01%', marketCap: '$24.5B', volume24h: '$5.8B' },
  { ...BASE_TOKENS[2], price: '$1.00', change24h: '-0.02%', marketCap: '$5.3B', volume24h: '$1.2B' },
  { ...BASE_TOKENS[3], price: '$3,245.67', change24h: '+2.34%', marketCap: '$389.2B', volume24h: '$8.7B' },
  { ...BASE_TOKENS[4], price: '$0.9998', change24h: '+0.01%', marketCap: '$1.2B', volume24h: '$450M' },
  { ...BASE_TOKENS[5], price: '$3,567.89', change24h: '+2.56%', marketCap: '$8.9B', volume24h: '$2.3B' },
  { ...BASE_TOKENS[6], price: '$3,198.45', change24h: '+2.21%', marketCap: '$3.2B', volume24h: '$890M' },
  { ...BASE_TOKENS[7], price: '$3,401.23', change24h: '+2.45%', marketCap: '$2.1B', volume24h: '$560M' },
]

export function TokenList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'stable' | 'eth'>('all')

  const filteredTokens = TOKENS_WITH_PRICES.filter((token) => {
    const matchesSearch = 
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = 
      selectedCategory === 'all' ||
      (selectedCategory === 'stable' && ['USDC', 'DAI', 'USDbC'].includes(token.symbol)) ||
      (selectedCategory === 'eth' && ['ETH', 'WETH', 'cbETH', 'wstETH', 'rETH'].includes(token.symbol))
    
    return matchesSearch && matchesCategory
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-800/95 dark:to-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <FiDollarSign className="w-5 h-5 text-white" />
            </div>
            Token List
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <FiTrendingUp className="w-4 h-4" />
            <span>Base Network</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tokens..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'All Tokens', icon: '🌐' },
            { id: 'stable', label: 'Stablecoins', icon: '💵' },
            { id: 'eth', label: 'ETH Variants', icon: '💎' },
          ].map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as any)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              <span className="hidden sm:inline">{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Token List */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Token
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                24h Change
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                Market Cap
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                Volume (24h)
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTokens.map((token, index) => (
              <motion.tr
                key={token.address || token.symbol}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {token.image && (
                      <img
                        src={token.image}
                        alt={token.name}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {token.symbol}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {token.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">
                  {token.price}
                </td>
                <td className="px-6 py-4 text-right">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-lg text-sm font-medium ${
                      token.change24h?.startsWith('+')
                        ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
                        : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                    }`}
                  >
                    {token.change24h}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-gray-700 dark:text-gray-300 hidden md:table-cell">
                  {token.marketCap}
                </td>
                <td className="px-6 py-4 text-right text-gray-700 dark:text-gray-300 hidden lg:table-cell">
                  {token.volume24h}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl">
                    Trade
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Stats */}
      <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {filteredTokens.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tokens</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              $389B+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total TVL</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              $35B+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">24h Volume</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
