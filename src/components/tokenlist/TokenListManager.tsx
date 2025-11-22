'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Star, ExternalLink } from 'lucide-react'
import { Token, BASE_TOKENS } from '@/lib/baseTokens'
import { useAccount, useBalance } from 'wagmi'
import { formatUnits, Address } from 'viem'
import { base } from 'wagmi/chains'

export function TokenListManager() {
  const { address } = useAccount()
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'name' | 'balance' | 'symbol'>('name')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  // Get balances for all tokens
  const tokenBalances = useMemo(() => {
    const balances: Record<string, string> = {}
    // In production, fetch balances for all tokens
    // For now, return empty object
    return balances
  }, [address])

  const filteredAndSortedTokens = useMemo(() => {
    let filtered = BASE_TOKENS.filter((token) => {
      const matchesSearch =
        token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.address.toLowerCase().includes(searchQuery.toLowerCase())

      if (showFavoritesOnly) {
        return matchesSearch && favorites.includes(token.address)
      }

      return matchesSearch
    })

    // Sort tokens
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      } else if (sortBy === 'balance') {
        const balanceA = parseFloat(tokenBalances[a.address] || '0')
        const balanceB = parseFloat(tokenBalances[b.address] || '0')
        return balanceB - balanceA
      } else {
        return a.symbol.localeCompare(b.symbol)
      }
    })

    return filtered
  }, [BASE_TOKENS, searchQuery, favorites, showFavoritesOnly, sortBy, tokenBalances])

  const toggleFavorite = (tokenAddress: string) => {
    setFavorites((prev) =>
      prev.includes(tokenAddress)
        ? prev.filter((addr) => addr !== tokenAddress)
        : [...prev, tokenAddress]
    )
  }

  const openExplorer = (address: string) => {
    window.open(`https://basescan.org/token/${address}`, '_blank')
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Token List
          </h2>

          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tokens by name, symbol, or address"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  showFavoritesOnly
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                <Star
                  className={`w-4 h-4 inline mr-1 ${
                    showFavoritesOnly ? 'fill-current' : ''
                  }`}
                />
                Favorites
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'balance' | 'symbol')}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Sort by Name</option>
                <option value="symbol">Sort by Symbol</option>
                <option value="balance">Sort by Balance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Token List */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
          {filteredAndSortedTokens.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No tokens found
            </div>
          ) : (
            filteredAndSortedTokens.map((token) => (
              <motion.div
                key={token.address}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {token.logoURI ? (
                      <img
                        src={token.logoURI}
                        alt={token.symbol}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                          {token.symbol[0]}
                        </span>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {token.symbol}
                        </h3>
                        {favorites.includes(token.address) && (
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {token.name}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-mono truncate">
                        {token.address.slice(0, 6)}...{token.address.slice(-4)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {tokenBalances[token.address] && (
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {parseFloat(tokenBalances[token.address]).toFixed(4)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {token.symbol}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFavorite(token.address)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            favorites.includes(token.address)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-400'
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => openExplorer(token.address)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            {filteredAndSortedTokens.length} token{filteredAndSortedTokens.length !== 1 ? 's' : ''} found
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
            Reference: <a href="https://docs.base.org/tools/contracts" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Base Documentation</a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
