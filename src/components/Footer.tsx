import { FiTwitter, FiGithub, FiMessageCircle, FiMail, FiExternalLink } from 'react-icons/fi'

export function Footer() {
  return (
    <footer className="bg-blue-100 dark:bg-blue-800 border-t border-blue-200 dark:border-blue-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🌊</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">FarcasterSea</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              The largest NFT marketplace on Base. Buy, sell, and discover exclusive digital assets built for the Farcaster ecosystem.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://warpcast.com/~/channel/base" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                title="Farcaster"
              >
                <FiMessageCircle className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com/base" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                title="Twitter"
              >
                <FiTwitter className="w-5 h-5" />
              </a>
              <a 
                href="https://github.com/base-org" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                title="GitHub"
              >
                <FiGithub className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm">Marketplace</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                  All NFTs
                </a>
              </li>
              <li>
                <a href="/?category=art" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                  Art
                </a>
              </li>
              <li>
                <a href="/?category=photography" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                  Photography
                </a>
              </li>
              <li>
                <a href="/?category=games" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                  Games
                </a>
              </li>
              <li>
                <a href="/?category=metaverse" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                  Metaverse
                </a>
              </li>
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm">My Account</h3>
            <ul className="space-y-3">
              <li>
                <a href="/my-nfts" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                  Profile
                </a>
              </li>
              <li>
                <a href="/my-nfts?tab=favorites" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                  Favorites
                </a>
              </li>
              <li>
                <a href="/my-nfts?tab=watchlist" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                  Watchlist
                </a>
              </li>
              <li>
                <a href="/my-nfts" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                  My Collections
                </a>
              </li>
              <li>
                <a href="/my-nfts?tab=settings" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                  Settings
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://docs.base.org" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm flex items-center gap-1"
                >
                  Help Center
                  <FiExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://status.base.org" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm flex items-center gap-1"
                >
                  Platform Status
                  <FiExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.base.org/ecosystem" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm flex items-center gap-1"
                >
                  Partners
                  <FiExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://basescan.org/gastracker" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm flex items-center gap-1"
                >
                  Gas Tracker
                  <FiExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.base.org/blog" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm flex items-center gap-1"
                >
                  Blog
                  <FiExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm">Learn</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://docs.base.org/docs/building-with-base" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm flex items-center gap-1"
                >
                  Base Docs
                  <FiExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.coinbase.com/onchain-kit" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm flex items-center gap-1"
                >
                  OnchainKit
                  <FiExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.base.org/names" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm flex items-center gap-1"
                >
                  Basename
                  <FiExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://docs.farcaster.xyz" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm flex items-center gap-1"
                >
                  Farcaster Docs
                  <FiExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://opensea.io" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm flex items-center gap-1"
                >
                  OpenSea
                  <FiExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-600 dark:text-gray-400 text-sm text-center md:text-left">
            © 2025 FarcasterSea. Built on <a href="https://www.base.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Base</a> chain • Powered by <a href="https://www.farcaster.xyz" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">Farcaster</a>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6 text-sm">
            <a 
              href="https://www.base.org/privacy-policy" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="https://www.base.org/terms-of-service" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Terms of Service
            </a>
            <a 
              href="https://www.coinbase.com/legal/cookie" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}