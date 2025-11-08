import { ConnectButton } from '@rainbow-me/rainbowkit'
import { CompactDarkModeToggle } from './DarkModeToggle'
import { EnhancedWalletButton } from './EnhancedWalletButton'
import WalletWrapper from './WalletWrapper'
import { FiSearch, FiMenu, FiUser } from 'react-icons/fi'

export function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🌊</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">FarcasterSea</span>
            </div>
          </div>

          {/* Center Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search OpenSea"
                className="w-full pl-12 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-gray-400 text-sm">/</span>
              </div>
            </div>
          </div>
          
          {/* Main Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
              All
            </a>
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 dark:text-gray-300 font-medium">🎮 Gaming</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 dark:text-gray-300 font-medium">🎨 Art</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 dark:text-gray-300 font-medium">📊 PFPs</span>
            </div>
            <a href="/mint" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium flex items-center gap-1">
              ⚡ Mint
            </a>
            <a href="/swap" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium flex items-center gap-1">
              🔄 Swap
            </a>
            <a href="/swap/settings" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium flex items-center gap-1 text-sm">
              ⚙️ Settings
            </a>
            <a href="/demo" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium flex items-center gap-1">
              🚀 Demo
            </a>
            <a href="#more" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
              More
            </a>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Category Pills */}
            <div className="hidden lg:flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">All</span>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-500 dark:text-gray-400 text-sm">=</span>
              <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-500 dark:text-gray-400 text-sm">...</span>
            </div>

            {/* NFTs and Tokens Toggle */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">🖼️ NFTs</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">🪙 Tokens</span>
              </div>
            </div>

            {/* Theme Toggle */}
            <CompactDarkModeToggle />

            {/* Enhanced Wallet with Template Patterns */}
            <WalletWrapper 
              text="Connect Wallet"
              withWalletAggregator={true}
              className="ml-4"
            />

            {/* Layout Toggle */}
            <div className="hidden lg:flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
              <span>1d</span>
              <div className="grid grid-cols-3 gap-0.5 ml-2">
                <div className="w-1 h-1 bg-gray-400 rounded-sm"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-sm"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-sm"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-sm"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-sm"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-sm"></div>
              </div>
              <div className="flex flex-col gap-0.5 ml-1">
                <div className="w-3 h-0.5 bg-gray-400 rounded-sm"></div>
                <div className="w-3 h-0.5 bg-gray-400 rounded-sm"></div>
                <div className="w-3 h-0.5 bg-gray-400 rounded-sm"></div>
              </div>
              <span className="ml-2">»</span>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
              <FiMenu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}