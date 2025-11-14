'use client'

import { useAccount } from 'wagmi'
import { useMiniApp } from '@/contexts/MiniAppContext'
import { Avatar, Name, Identity } from '@coinbase/onchainkit/identity'
import { base } from 'viem/chains'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { 
  FiUser, 
  FiCreditCard, 
  FiExternalLink, 
  FiCopy, 
  FiCheck,
  FiX
} from 'react-icons/fi'

interface UserProfileProps {
  showFullProfile?: boolean
  onClose?: () => void
}

export function UserProfile({ showFullProfile = false, onClose }: UserProfileProps) {
  const { address, isConnected } = useAccount()
  const { isFarcasterConnected, farcasterUser } = useMiniApp()
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(showFullProfile)

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    onClose?.()
  }

  if (!isConnected) {
    return null
  }

  // Compact profile view
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 rounded-lg border border-purple-500/20 transition-all duration-200"
      >
        <Identity className="flex items-center space-x-2">
          <Avatar 
            address={address} 
            chain={base}
            className="h-8 w-8 rounded-full border-2 border-purple-500/30"
          />
          <div className="hidden sm:block text-left">
            <Name 
              address={address}
              chain={base}
              className="text-sm font-medium text-gray-900 dark:text-white"
            />
          </div>
        </Identity>
      </button>
    )
  }

  // Full profile modal
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Profile Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-md"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              {/* Header */}
              <div className="relative h-32 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Avatar Section */}
              <div className="relative px-6 pb-6">
                <div className="absolute -top-16 left-6">
                  <div className="relative">
                    <Avatar 
                      address={address}
                      chain={base}
                      className="h-24 w-24 rounded-full border-4 border-white dark:border-gray-900 shadow-lg"
                    />
                    {isFarcasterConnected && (
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-purple-600 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.24 5.74h-3.12v10.03h3.12V5.74zm-4.68 0H10.44v10.03h3.12V5.74zm-4.68 0H5.76v10.03h3.12V5.74z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-12">
                  {/* Basename / Display Name */}
                  <div className="mb-4">
                    <Identity className="block">
                      <Name 
                        address={address}
                        chain={base}
                        className="text-2xl font-bold text-gray-900 dark:text-white"
                      />
                    </Identity>
                    
                    {isFarcasterConnected && farcasterUser && (
                      <p className="text-sm text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1 mt-1">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.24 5.74h-3.12v10.03h3.12V5.74zm-4.68 0H10.44v10.03h3.12V5.74zm-4.68 0H5.76v10.03h3.12V5.74z"/>
                        </svg>
                        @{farcasterUser.username}
                      </p>
                    )}
                  </div>

                  {/* Farcaster Bio */}
                  {isFarcasterConnected && farcasterUser?.displayName && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {farcasterUser.displayName}
                    </p>
                  )}

                  {/* Wallet Address */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FiCreditCard className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-xs font-mono text-gray-700 dark:text-gray-300">
                          {address?.slice(0, 6)}...{address?.slice(-4)}
                        </span>
                      </div>
                      <button
                        onClick={copyAddress}
                        className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                      >
                        {copied ? (
                          <FiCheck className="w-4 h-4 text-green-500" />
                        ) : (
                          <FiCopy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        )}
                      </button>
                    </div>

                    {/* Farcaster FID */}
                    {isFarcasterConnected && farcasterUser && (
                      <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FiUser className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                            FID: {farcasterUser.fid}
                          </span>
                        </div>
                        <a
                          href={`https://warpcast.com/${farcasterUser.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-md hover:bg-purple-200 dark:hover:bg-purple-800 transition"
                        >
                          <FiExternalLink className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <a
                      href={`https://basescan.org/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition text-sm font-medium text-blue-700 dark:text-blue-300"
                    >
                      <FiExternalLink className="w-4 h-4" />
                      <span>BaseScan</span>
                    </a>
                    
                    {farcasterUser && (
                      <a
                        href={`https://warpcast.com/${farcasterUser.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition text-sm font-medium text-purple-700 dark:text-purple-300"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.24 5.74h-3.12v10.03h3.12V5.74zm-4.68 0H10.44v10.03h3.12V5.74zm-4.68 0H5.76v10.03h3.12V5.74z"/>
                        </svg>
                        <span>Warpcast</span>
                      </a>
                    )}
                  </div>

                  {/* Connection Status */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span>Wallet Connected</span>
                      </div>
                      {isFarcasterConnected && (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                          <span>Farcaster Connected</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Compact version for header/nav
export function CompactUserProfile() {
  const { address, isConnected } = useAccount()
  const { isFarcasterConnected, farcasterUser } = useMiniApp()
  const [showProfile, setShowProfile] = useState(false)

  if (!isConnected) return null

  return (
    <>
      <button
        onClick={() => setShowProfile(true)}
        className="relative group"
      >
        <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 border border-purple-500/20 transition-all duration-200">
          <div className="relative">
            <Avatar 
              address={address}
              chain={base}
              className="h-8 w-8 rounded-full border-2 border-purple-500/30"
            />
            {isFarcasterConnected && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-purple-600 rounded-full border border-white dark:border-gray-900" />
            )}
          </div>
          <div className="hidden sm:block text-left">
            <Name 
              address={address}
              chain={base}
              className="text-sm font-medium text-gray-900 dark:text-white block"
            />
            {isFarcasterConnected && farcasterUser && (
              <span className="text-xs text-purple-600 dark:text-purple-400">
                @{farcasterUser.username}
              </span>
            )}
          </div>
        </div>
      </button>

      <UserProfile 
        showFullProfile={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </>
  )
}
