'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Token } from '@/lib/baseTokens'
import { Search, X, Star } from 'lucide-react'

interface TokenSelectorProps {
  tokens: Token[]
  selectedToken?: Token
  onSelect: (token: Token) => void
  onClose: () => void
  favorites?: string[]
  onToggleFavorite?: (address: string) => void
}

export function TokenSelector({
  tokens,
  selectedToken,
  onSelect,
  onClose,
  favorites = [],
  onToggleFavorite,
}: TokenSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFavorites, setShowFavorites] = useState(false)

  const filteredTokens = tokens.filter((token) => {
    const matchesSearch =
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.address.toLowerCase().includes(searchQuery.toLowerCase())

    if (showFavorites) {
      return matchesSearch && favorites.includes(token.address)
    }

    return matchesSearch
  })

  const handleSelect = (token: Token) => {
    onSelect(token)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Select Token
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name or paste address"
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {onToggleFavorite && (
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`mt-2 px-3 py-1 text-sm rounded-lg transition-colors ${
                showFavorites
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              <Star
                className={`w-4 h-4 inline mr-1 ${
                  showFavorites ? 'fill-current' : ''
                }`}
              />
              Favorites
            </button>
          )}
        </div>

        {/* Token List */}
        <div className="flex-1 overflow-y-auto p-2">
          <AnimatePresence>
            {filteredTokens.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No tokens found
              </div>
            ) : (
              filteredTokens.map((token) => (
                <motion.button
                  key={token.address}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => handleSelect(token)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    selectedToken?.address === token.address
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {token.logoURI ? (
                      <img
                        src={token.logoURI}
                        alt={token.symbol}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                          {token.symbol[0]}
                        </span>
                      </div>
                    )}
                    <div className="text-left">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {token.symbol}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {token.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {token.balance && (
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {parseFloat(token.balance).toFixed(4)}
                      </span>
                    )}
                    {onToggleFavorite && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onToggleFavorite(token.address)
                        }}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            favorites.includes(token.address)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-400'
                          }`}
                        />
                      </button>
                    )}
                  </div>
                </motion.button>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
