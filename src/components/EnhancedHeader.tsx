'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { base } from 'viem/chains'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiGrid, 
  FiSearch,
  FiZap,
  FiMenu,
  FiX,
  FiRefreshCw,
} from 'react-icons/fi'
import { SwapEnhanced } from './SwapEnhanced'

interface EnhancedHeaderProps {
  onToggleView?: () => void
  onSearch?: (query: string) => void
}

export default function EnhancedHeader({ onToggleView, onSearch }: EnhancedHeaderProps) {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isSwapOpen, setIsSwapOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
    }
  }

  const isOnBase = chainId === base.id
  
  const navLinks = [
    { label: 'Explore', href: '/marketplace' },
    { label: 'Collections', href: '/collections' },
    { label: 'Mint', href: '/create' },
    { label: 'My NFTs', href: '/my-nfts' },
  ]

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-sm bg-black/60 shadow-sm transition-all">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-14 sm:h-16 flex items-center justify-between gap-4">
            
            {/* Left: Logo + Nav */}
            <div className="flex items-center gap-4 min-w-0">
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg transition-transform hover:scale-105"
                aria-label="Go to home"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 sm:w-7 sm:h-7">
                    <path d="M0 0h10v10H0z" fill="#1a1a1a"/>
                    <circle cx="5" cy="5" r="2.5" fill="white"/>
                    <path d="M0 14c0-2.2 1.8-4 4-4h6v10H0V14z" fill="#1a1a1a"/>
                  </svg>
                </div>
                <div className="hidden sm:flex flex-col leading-tight">
                  <span className="font-bold text-white text-lg">Farcast</span>
                  <span className="font-bold text-white text-lg -mt-1">Mints</span>
                </div>
              </button>

              {/* Desktop Navigation */}
              <nav 
                className="hidden md:flex items-center gap-2" 
                role="navigation"
                aria-label="Primary navigation"
              >
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => router.push(link.href)}
                    className="text-sm text-white/80 px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    aria-label={`Navigate to ${link.label}`}
                  >
                    {link.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Center: Search */}
            <div className="flex-1 flex justify-center px-4 hidden md:flex">
              <div className="w-full max-w-md">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <FiSearch 
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" 
                      size={16} 
                    />
                    <input
                      type="text"
                      placeholder="Search NFTs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search NFTs"
                      className="w-full pl-10 pr-4 h-10 rounded-full bg-white/4 border border-white/10 placeholder:text-white/40 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner transition-all"
                    />
                  </div>
                </form>
              </div>
            </div>

            {/* Right: Badges + Actions */}
            <div className="flex items-center gap-3">
              {/* Network Badge with Glow */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (!isOnBase && switchChain) {
                    switchChain({ chainId: base.id })
                  }
                }}
                className="relative hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs bg-white/3 border border-white/6 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label={isOnBase ? "Connected to Base" : "Switch to Base network"}
              >
                <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${
                  isOnBase 
                    ? 'bg-gradient-to-tr from-sky-400 to-indigo-600' 
                    : 'bg-gradient-to-tr from-orange-400 to-red-600'
                }`} />
                <span className="text-white/90 font-medium">
                  {isOnBase ? 'Base' : 'Mainnet'}
                </span>
                
                {/* Animated glow for active network */}
                {isOnBase && (
                  <motion.span
                    aria-hidden
                    initial={{ boxShadow: "0 0 0 rgba(99,102,241,0)" }}
                    animate={{ boxShadow: "0 0 18px rgba(99,102,241,0.12)" }}
                    transition={{ repeat: Infinity, repeatType: "mirror", duration: 2 }}
                    className="absolute inset-0 rounded-full pointer-events-none"
                  />
                )}
              </motion.button>

              {/* Farcaster Badge */}
              <button
                onClick={() => router.push('/farcaster')}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/3 border border-white/6 text-xs hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label="Connect Farcaster"
              >
                <FiZap size={14} />
                <span className="text-white/90 font-medium">Farcaster</span>
              </button>

              {/* Swap - Secondary CTA */}
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsSwapOpen(true)}
                className="hidden sm:flex items-center gap-2 h-10 px-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium shadow-md transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label="Swap tokens"
              >
                <FiRefreshCw size={16} />
                <span>Swap</span>
              </motion.button>

              {/* View Toggle - Ghost Button */}
              {onToggleView && (
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onToggleView}
                  className="hidden lg:flex p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  aria-label="Toggle view"
                >
                  <FiGrid size={18} />
                </motion.button>
              )}

              {/* Connect Button - Primary CTA */}
              <div className="hidden sm:flex items-center">
                <ConnectButton />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-full bg-white/4 text-white hover:bg-white/8 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-white/10 bg-black/80 backdrop-blur-md"
            >
              <div className="px-4 py-4 space-y-2">
                {/* Mobile Nav Links */}
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => {
                      router.push(link.href)
                      setMobileMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/5 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    {link.label}
                  </button>
                ))}
                
                {/* Mobile Search */}
                <div className="pt-4">
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <FiSearch 
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" 
                        size={16} 
                      />
                      <input
                        type="text"
                        placeholder="Search NFTs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search NFTs on mobile"
                        className="w-full pl-10 pr-4 h-10 rounded-full bg-white/4 border border-white/10 placeholder:text-white/40 text-white text-sm focus:outline-none focus:ring-2 focus-visible:ring-indigo-500 shadow-inner"
                      />
                    </div>
                  </form>
                </div>

                {/* Mobile Action Buttons */}
                <div className="pt-4 space-y-2">
                  <button
                    onClick={() => {
                      setIsSwapOpen(true)
                      setMobileMenuOpen(false)
                    }}
                    className="w-full flex items-center justify-center gap-2 h-10 px-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <FiRefreshCw size={16} />
                    <span>Swap</span>
                  </button>

                  {/* Network Badge Mobile */}
                  <button
                    onClick={() => {
                      if (!isOnBase && switchChain) {
                        switchChain({ chainId: base.id })
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm bg-white/3 border border-white/6 text-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      isOnBase 
                        ? 'bg-gradient-to-tr from-sky-400 to-indigo-600' 
                        : 'bg-gradient-to-tr from-orange-400 to-red-600'
                    }`} />
                    <span>{isOnBase ? 'Base Network' : 'Switch to Base'}</span>
                  </button>

                  {/* Mobile Connect */}
                  <div className="pt-2">
                    <ConnectButton />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

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
    </>
  )
}
