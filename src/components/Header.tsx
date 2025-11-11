import { Name, Avatar, Identity, Address, EthBalance } from '@coinbase/onchainkit/identity'
import { 
  Wallet,
  ConnectWallet,
  WalletDropdown,
  WalletDropdownBaseName,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet'
import { color } from '@coinbase/onchainkit/theme'
import { base } from 'viem/chains'
import { CompactDarkModeToggle } from './DarkModeToggle'
import { useMiniApp } from '@/contexts/MiniAppContext'
import { FiSearch, FiMenu } from 'react-icons/fi'

export function Header() {
  const { isFarcasterConnected, farcasterUser, viewProfile } = useMiniApp()
  
  return (
    <header className="bg-white dark:bg-[#151b2b] border-b border-gray-200 dark:border-gray-800 transition-colors duration-300 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🌊</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">FarcasterSea</span>
            </div>
          </div>

          {/* Center Search Bar */}
          <div className="flex-1 max-w-xl mx-4 hidden lg:block">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search NFTs..."
                className="w-full pl-12 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Main Navigation - Compact */}
          <nav className="hidden xl:flex items-center space-x-6">
            <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium">
              Explore
            </a>
            <a href="/mint" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium">
              Mint
            </a>
            <a href="/swap" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium">
              Swap
            </a>
          </nav>

          {/* Right Side Actions - Profile Section */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Theme Toggle */}
            <CompactDarkModeToggle />

            {/* Wallet Component with Basename Support */}
            <Wallet>
              <ConnectWallet className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl active:scale-95">
                <Avatar className="h-6 w-6" />
                <Name className="font-semibold text-sm" />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2 hover:bg-gray-50 dark:hover:bg-gray-800" hasCopyAddressOnClick>
                  <Avatar />
                  <Name className="font-semibold" />
                  <Address className={color.foregroundMuted} />
                  <EthBalance />
                </Identity>
                <WalletDropdownBaseName className="hover:bg-blue-50 dark:hover:bg-blue-900/20" />
                <WalletDropdownLink
                  icon="wallet"
                  href="https://keys.coinbase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Wallet
                </WalletDropdownLink>
                <WalletDropdownDisconnect className="hover:bg-red-50 dark:hover:bg-red-900/20" />
              </WalletDropdown>
            </Wallet>

            {/* Farcaster Badge (when connected in Farcaster) - Secondary */}
            {isFarcasterConnected && farcasterUser && (
              <button
                onClick={() => viewProfile(farcasterUser.fid)}
                className="hidden lg:flex items-center gap-2 bg-purple-100 dark:bg-purple-900/20 hover:bg-purple-200 dark:hover:bg-purple-900/30 px-3 py-2 rounded-lg transition-all border border-purple-200 dark:border-purple-800"
                title={`Farcaster: @${farcasterUser.username}`}
              >
                {farcasterUser.pfpUrl && (
                  <img 
                    src={farcasterUser.pfpUrl} 
                    alt={farcasterUser.username}
                    className="w-5 h-5 rounded-full"
                  />
                )}
                <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                  @{farcasterUser.username}
                </span>
              </button>
            )}

            {/* Farcaster Prompt - When NOT in Farcaster */}
            {!isFarcasterConnected && (
              <a
                href="https://warpcast.com/~/add-cast-action?url=https://farcaster-nft-marketplace.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg font-medium transition-all shadow-sm hover:shadow-md text-sm"
                title="Open in Farcaster"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.24 5.16l-2.12-1.24L4.76 10.5v3l11.36 6.58 2.12-1.24v-13.68zm-1.88 11.44l-8.48-4.92v-2.36l8.48-4.92v12.2z"/>
                </svg>
                <span>Farcaster</span>
              </a>
            )}

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg">
              <FiMenu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}