'use client'

import Link from 'next/link'
import { FiSearch } from 'react-icons/fi'

interface RefinedHeaderProps {
  onToggleView?: () => void
  onSearch?: (query: string) => void
}

export default function RefinedHeader({ onToggleView, onSearch }: RefinedHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shadow-md">
            FM
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">FarcastMints</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Base Chain · NFT Portal</div>
          </div>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              aria-label="Search" 
              placeholder="Search collection, token, creator..." 
              className="w-full rounded-lg pl-10 pr-3 py-2 shadow-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button 
            className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0"
            aria-label="Connect wallet"
          >
            <span className="hidden sm:inline">Connect</span>
            <span className="sm:hidden">💼</span>
          </button>
          {onToggleView && (
            <button 
              onClick={onToggleView} 
              className="px-3 py-1 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-medium min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0"
              aria-label="Toggle view"
            >
              <span className="hidden sm:inline">Toggle</span>
              <span className="sm:hidden">⚡</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
