'use client'

import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiCheck } from 'react-icons/fi'
import { HiOutlineWallet } from 'react-icons/hi2'

/**
 * Global Wallet Connection Prompt
 * Shows on every portal to encourage wallet connection
 * Displays connected wallet address when connected
 */
export function WalletPrompt() {
  const { address, isConnected } = useAccount()
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Check if user previously dismissed the prompt
    const dismissed = localStorage.getItem('wallet-prompt-dismissed')
    if (dismissed === 'true' && !isConnected) {
      setIsDismissed(true)
      return
    }

    // Show prompt after 2 seconds if not connected
    if (!isConnected) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isConnected])

  // Show success message when wallet connects
  useEffect(() => {
    if (isConnected && mounted) {
      setIsVisible(false)
      setShowSuccess(true)
      
      // Hide success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [isConnected, mounted])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem('wallet-prompt-dismissed', 'true')
  }

  const handleConnect = () => {
    // ConnectButton will handle the connection
    // The prompt will auto-hide when connection succeeds
  }

  // Don't render on server
  if (!mounted) return null

  // Format address for display
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <>
      {/* Connection Prompt - Shows when NOT connected */}
      <AnimatePresence>
        {isVisible && !isConnected && !isDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-[9999] max-w-sm"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-lg bg-opacity-95 dark:bg-opacity-95">
              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Dismiss"
              >
                <FiX className="w-5 h-5" />
              </button>

              {/* Icon */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <HiOutlineWallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Connect Your Wallet
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    To buy, sell, and create NFTs
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <FiCheck className="w-4 h-4 text-green-500" />
                  <span>Access your NFT collection</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <FiCheck className="w-4 h-4 text-green-500" />
                  <span>Buy and sell NFTs securely</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <FiCheck className="w-4 h-4 text-green-500" />
                  <span>Create and mint your own NFTs</span>
                </div>
              </div>

              {/* Connect Button */}
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <button
                    onClick={() => {
                      openConnectModal()
                      handleConnect()
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
                  >
                    <HiOutlineWallet className="w-5 h-5" />
                    Connect Wallet
                  </button>
                )}
              </ConnectButton.Custom>

              {/* Dismiss Link */}
              <button
                onClick={handleDismiss}
                className="w-full mt-3 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message - Shows when wallet connects */}
      <AnimatePresence>
        {showSuccess && isConnected && address && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, type: 'spring' }}
            className="fixed bottom-6 right-6 z-[9999] max-w-sm"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-2xl p-6 backdrop-blur-lg">
              {/* Close Button */}
              <button
                onClick={() => setShowSuccess(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                aria-label="Close"
              >
                <FiX className="w-5 h-5" />
              </button>

              {/* Success Icon */}
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiCheck className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Wallet Connected!
                  </h3>
                  <p className="text-sm text-white/90">
                    You're all set to go
                  </p>
                </div>
              </div>

              {/* Connected Address */}
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/70 mb-1">Connected Address</p>
                    <p className="text-sm font-mono font-semibold text-white">
                      {formatAddress(address)}
                    </p>
                  </div>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-4 flex gap-2">
                <a
                  href="/my-nfts"
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all text-center backdrop-blur-sm"
                >
                  My NFTs
                </a>
                <a
                  href="/create"
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all text-center backdrop-blur-sm"
                >
                  Create NFT
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Connection Status Indicator - Bottom Left */}
      <AnimatePresence>
        {isConnected && address && !showSuccess && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-6 z-[9998]"
          >
            <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center gap-2 backdrop-blur-lg bg-opacity-95 dark:bg-opacity-95">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 font-mono">
                {formatAddress(address)}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
