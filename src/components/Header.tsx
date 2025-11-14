'use client'

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
import { base, baseSepolia } from 'viem/chains'
import { CompactDarkModeToggle } from './DarkModeToggle'
import { useMiniApp } from '@/contexts/MiniAppContext'
import { CompactUserProfile, UserProfile } from './UserProfile'
import { FiSearch, FiMenu, FiX, FiRefreshCw, FiGlobe, FiCheckCircle } from 'react-icons/fi'
import { SwapEnhanced } from './SwapEnhanced'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { useFarcasterOAuth } from '@/hooks/useFarcasterOAuth'
import { motion, AnimatePresence } from 'framer-motion'

export function Header() {
  const { isFarcasterConnected, farcasterUser, viewProfile } = useMiniApp()
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const { profile: farcasterProfile, loading: farcasterLoading, connect: connectFarcaster } = useFarcasterOAuth()
  
  const [isSwapOpen, setIsSwapOpen] = useState(false)
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showFarcasterModal, setShowFarcasterModal] = useState(false)

  // Determine target chain based on environment
  const isTestnet = process.env.NEXT_PUBLIC_NETWORK === 'baseSepolia'
  const targetChainId = isTestnet ? baseSepolia.id : base.id
  const targetChainName = isTestnet ? 'Base Sepolia' : 'Base'
  const isOnCorrectNetwork = chainId === targetChainId

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSwitchNetwork = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first to switch network.')
      return
    }

    if (switchChain) {
      try {
        switchChain({ chainId: targetChainId })
      } catch (error) {
        console.error('Network switch error:', error)
        alert(`Please switch your wallet network to ${targetChainName} (Chain ID: ${targetChainId}).`)
      }
    } else {
      alert(`Please switch your wallet network to ${targetChainName}.`)
    }
  }
  
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
              <span className="text-xl font-bold text-gray-900 dark:text-white">FarcastMints</span>
            </div>
          </div>

          {/* Network & Farcaster Badges */}
          <div className="hidden sm:flex items-center gap-2 ml-2">
            {/* Network Badge */}
            <motion.button
              onClick={handleSwitchNetwork}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all badge-glow cursor-pointer
                        ${isOnCorrectNetwork 
                          ? 'bg-green-500/30 text-green-200 border-2 border-green-400/50' 
                          : 'bg-orange-500/30 text-orange-200 border-2 border-orange-400/50 hover:bg-orange-500/40 hover:border-orange-400'
                        }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={isOnCorrectNetwork ? `Connected to ${targetChainName}` : `Click to switch to ${targetChainName}`}
            >
              {isOnCorrectNetwork ? (
                <FiCheckCircle className="w-4 h-4" />
              ) : (
                <FiGlobe className="w-4 h-4 animate-pulse" />
              )}
              <span className="whitespace-nowrap">
                {isSwitching ? 'Switching...' : isOnCorrectNetwork ? targetChainName : `Switch to ${targetChainName}`}
              </span>
            </motion.button>

            {/* Farcaster OAuth Badge */}
            <AnimatePresence mode="wait">
              {farcasterProfile ? (
                <motion.div
                  key="connected"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 badge-glow"
                >
                  {farcasterProfile.avatar && (
                    <img 
                      src={farcasterProfile.avatar} 
                      alt={farcasterProfile.displayName || 'Farcaster'} 
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  )}
                  <span className="whitespace-nowrap">
                    {farcasterProfile.displayName || farcasterProfile.username || 'Farcaster'}
                  </span>
                </motion.div>
              ) : (
                <motion.button
                  key="disconnected"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => setShowFarcasterModal(true)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-purple-600/30 text-purple-200 border border-purple-500/50 hover:bg-purple-600/50 hover:border-purple-400 transition-all cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Connect Farcaster - Share NFTs & Social Posts"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.24 5.16l-2.12-1.24L4.76 10.5v3l11.36 6.58 2.12-1.24v-13.68zm-1.88 11.44l-8.48-4.92v-2.36l8.48-4.92v12.2z"/>
                  </svg>
                  <span className="font-semibold">Connect Farcaster</span>
                </motion.button>
              )}
            </AnimatePresence>

            {/* Farcaster Modal */}
            {showFarcasterModal && mounted && createPortal(
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
                onClick={() => setShowFarcasterModal(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.24 5.16l-2.12-1.24L4.76 10.5v3l11.36 6.58 2.12-1.24v-13.68zm-1.88 11.44l-8.48-4.92v-2.36l8.48-4.92v12.2z"/>
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Connect Farcaster</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Share NFTs & Social Posts</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowFarcasterModal(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                      <FiX className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                      <div className="w-5 h-5 mt-0.5">
                        <svg viewBox="0 0 24 24" fill="none" className="text-purple-600 dark:text-purple-400">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Share NFTs</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Post your NFT collections to Farcaster</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                      <div className="w-5 h-5 mt-0.5">
                        <svg viewBox="0 0 24 24" fill="none" className="text-purple-600 dark:text-purple-400">
                          <path d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Social Posts</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Engage with the Farcaster community</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                      <div className="w-5 h-5 mt-0.5">
                        <svg viewBox="0 0 24 24" fill="none" className="text-purple-600 dark:text-purple-400">
                          <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Decentralized</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Your identity, your control</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 pt-2">
                    <a
                      href="https://farcaster.xyz/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors text-center"
                    >
                      Visit Farcaster
                    </a>
                    <button
                      onClick={() => setShowFarcasterModal(false)}
                      className="block w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors text-center"
                    >
                      Close
                    </button>
                  </div>

                  {/* Info */}
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                    Connect to share your NFTs and engage with the decentralized social network
                  </p>
                </motion.div>
              </div>,
              document.body
            )}
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
            <a href="/front" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium">
              Explore
            </a>
            <a href="/collections" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium">
              Collections
            </a>
            <a href="/mint" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium">
              Mint
            </a>
            {isConnected && (
              <button
                onClick={() => setIsPortfolioOpen(true)}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium"
              >
                My Portfolio
              </button>
            )}
            <button 
              onClick={() => {
                console.log('Swap button clicked in Header!')
                setIsSwapOpen(true)
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors text-sm font-medium flex items-center gap-1 shadow-sm"
            >
              <FiRefreshCw className="w-4 h-4" />
              Swap
            </button>
          </nav>

          {/* Right Side Actions - Profile Section */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Theme Toggle */}
            <CompactDarkModeToggle />

            {/* User Profile with Wallet, Basename & Farcaster Integration */}
            {isConnected ? (
              <CompactUserProfile />
            ) : (
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
            )}

            {/* Farcaster Prompt - When NOT in Farcaster and NOT connected */}
            {!isFarcasterConnected && !isConnected && (
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

      {/* Swap Portal Modal */}
      {mounted && isSwapOpen && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn" 
          onClick={() => setIsSwapOpen(false)}
        >
          <div className="relative w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsSwapOpen(false)}
              className="absolute -top-12 right-0 p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close swap"
            >
              <FiX className="w-6 h-6" />
            </button>
            <div className="animate-slideUp">
              <SwapEnhanced />
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* My Portfolio Modal - Shows Basename & Farcaster Profile */}
      {mounted && isPortfolioOpen && (
        <UserProfile 
          showFullProfile={isPortfolioOpen}
          onClose={() => setIsPortfolioOpen(false)}
        />
      )}
    </header>
  )
}