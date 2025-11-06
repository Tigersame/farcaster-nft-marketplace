import { ConnectButton } from '@rainbow-me/rainbowkit'
import { CompactDarkModeToggle } from './DarkModeToggle'

export function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              🖼️ Farcaster NFTs
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Marketplace
            </a>
            <a href="/create" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Create
            </a>
            <a href="/my-nfts" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              My NFTs
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <CompactDarkModeToggle />
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  )
}