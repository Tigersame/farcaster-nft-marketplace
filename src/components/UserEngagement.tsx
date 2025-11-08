'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface EngagementPrompt {
  id: string
  type: 'next-step' | 'social' | 'discovery' | 'achievement'
  title: string
  description: string
  action: string
  actionUrl?: string
  delay?: number
}

interface UserEngagementProps {
  userActions: string[]
  isConnected: boolean
  nftsViewed: number
  nftsPurchased: number
}

export function UserEngagementSystem({ 
  userActions, 
  isConnected, 
  nftsViewed, 
  nftsPurchased 
}: UserEngagementProps) {
  const [currentPrompt, setCurrentPrompt] = useState<EngagementPrompt | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [dismissedPrompts, setDismissedPrompts] = useState<string[]>([])

  const getEngagementPrompts = (): EngagementPrompt[] => {
    const prompts: EngagementPrompt[] = []

    // Onboarding flow prompts
    if (!isConnected) {
      prompts.push({
        id: 'connect-wallet',
        type: 'next-step',
        title: 'ready to start trading? 🚀',
        description: 'connect your wallet to unlock buying, selling, and creating nfts on base network',
        action: 'Connect Wallet',
        delay: 3000
      })
    }

    // Discovery prompts
    if (nftsViewed >= 3 && nftsPurchased === 0) {
      prompts.push({
        id: 'first-purchase',
        type: 'discovery',
        title: 'found something you like? 💎',
        description: 'make your first purchase and join the farcaster collector community',
        action: 'Browse Featured',
        delay: 5000
      })
    }

    // Social engagement prompts
    if (nftsPurchased >= 1) {
      prompts.push({
        id: 'share-collection',
        type: 'social', 
        title: 'show off your new nft! 📸',
        description: 'cast about your purchase and connect with other collectors',
        action: 'Share on Farcaster',
        delay: 2000
      })
    }

    // Achievement prompts
    if (nftsViewed >= 10) {
      prompts.push({
        id: 'explorer-badge',
        type: 'achievement',
        title: 'explorer badge unlocked! 🏆',
        description: 'you\'ve browsed 10+ nfts. you\'re becoming a true collector!',
        action: 'View Profile',
        delay: 1000
      })
    }

    // Creation prompts
    if (isConnected && !userActions.includes('create')) {
      prompts.push({
        id: 'create-first-nft',
        type: 'next-step',
        title: 'ready to become a creator? 🎨',
        description: 'mint your first nft and start earning from your art',
        action: 'Create NFT',
        actionUrl: '/create',
        delay: 8000
      })
    }

    // Re-engagement prompts
    if (userActions.length === 0) {
      prompts.push({
        id: 'get-started',
        type: 'discovery',
        title: 'let\'s find your first nft! 🔍',
        description: 'browse trending collections or discover hidden gems',
        action: 'Explore Now',
        delay: 5000
      })
    }

    return prompts.filter(p => !dismissedPrompts.includes(p.id))
  }

  useEffect(() => {
    const prompts = getEngagementPrompts()
    if (prompts.length === 0) return

    const nextPrompt = prompts[0]
    
    const timer = setTimeout(() => {
      setCurrentPrompt(nextPrompt)
      setShowPrompt(true)
    }, nextPrompt.delay || 3000)

    return () => clearTimeout(timer)
  }, [userActions, isConnected, nftsViewed, nftsPurchased, dismissedPrompts])

  const handleAction = () => {
    if (!currentPrompt) return

    // Immediate reaction feedback
    setShowPrompt(false)

    // Route to appropriate action
    switch (currentPrompt.id) {
      case 'connect-wallet':
        document.querySelector('[data-testid="rk-connect-button"]')?.dispatchEvent(
          new Event('click', { bubbles: true })
        )
        break
      case 'share-collection':
        window.open('https://warpcast.com/~/compose', '_blank')
        break
      case 'create-first-nft':
        window.location.href = '/create'
        break
      default:
        if (currentPrompt.actionUrl) {
          window.location.href = currentPrompt.actionUrl
        }
    }

    dismissPrompt()
  }

  const dismissPrompt = () => {
    if (currentPrompt) {
      setDismissedPrompts(prev => [...prev, currentPrompt.id])
    }
    setShowPrompt(false)
    setCurrentPrompt(null)
  }

  const getPromptStyles = (type: string) => {
    const styles: Record<string, { gradient: string; icon: string; bg: string; border: string }> = {
      'next-step': {
        gradient: 'from-blue-500 to-cyan-500',
        icon: '🚀',
        bg: 'bg-blue-50',
        border: 'border-blue-200'
      },
      'social': {
        gradient: 'from-purple-500 to-pink-500', 
        icon: '🤝',
        bg: 'bg-purple-50',
        border: 'border-purple-200'
      },
      'discovery': {
        gradient: 'from-green-500 to-emerald-500',
        icon: '🔍',
        bg: 'bg-green-50', 
        border: 'border-green-200'
      },
      'achievement': {
        gradient: 'from-yellow-500 to-orange-500',
        icon: '🏆',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200'
      }
    }
    return styles[type] || styles['next-step']
  }

  if (!currentPrompt || !showPrompt) return null

  const styles = getPromptStyles(currentPrompt.type || 'next-step')

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm"
      >
        <motion.div
          className={`${styles.bg} ${styles.border} border-2 rounded-3xl p-6 shadow-2xl backdrop-blur-xl`}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {/* Reaction indicator */}
          <motion.div
            className="absolute -top-4 left-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <div className="bg-white rounded-full p-2 shadow-lg text-2xl">
              {styles.icon}
            </div>
          </motion.div>

          {/* Content */}
          <div className="mt-4">
            <motion.h3
              className="font-bold text-lg text-gray-900 mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {currentPrompt.title}
            </motion.h3>
            
            <motion.p
              className="text-gray-600 text-sm mb-4 leading-relaxed"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {currentPrompt.description}
            </motion.p>

            {/* Actions */}
            <motion.div
              className="flex space-x-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={handleAction}
                className={`flex-1 bg-gradient-to-r ${styles.gradient} text-white px-4 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
              >
                {currentPrompt.action}
              </button>
              
              <button
                onClick={dismissPrompt}
                className="px-4 py-3 text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            </motion.div>
          </div>

          {/* Pulse indicator */}
          <motion.div
            className={`absolute -inset-1 bg-gradient-to-r ${styles.gradient} rounded-3xl opacity-20 -z-10`}
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Progress tracking component
export function UserProgressTracker({ 
  children, 
  onActionTracked 
}: { 
  children: React.ReactNode
  onActionTracked: (action: string) => void
}) {
  const pageViewTracked = useRef(false)
  const deepScrollTracked = useRef(false)

  useEffect(() => {
    // Track page views only once
    if (!pageViewTracked.current) {
      onActionTracked('page_view')
      pageViewTracked.current = true
    }

    // Track scroll depth
    const handleScroll = () => {
      if (!deepScrollTracked.current) {
        const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        if (scrolled > 50) {
          onActionTracked('deep_scroll')
          deepScrollTracked.current = true
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, []) // Remove onActionTracked from dependencies

  return <>{children}</>
}