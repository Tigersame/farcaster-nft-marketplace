'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiZap, 
  FiShoppingBag, 
  FiDollarSign, 
  FiUsers, 
  FiTrendingUp,
  FiStar,
  FiEye,
  FiHeart,
  FiArrowRight,
  FiCheck
} from 'react-icons/fi'

interface OnboardingProps {
  onComplete: () => void
  isConnected: boolean
}

export function FarcasterOnboarding({ onComplete, isConnected }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)

  const steps = [
    {
      title: "hey, welcome to FarcastSea! 🖼️",
      subtitle: "i'm your guide to discovering, collecting, and trading nfts on base network.",
      content: [
        "• discover unique nfts: browse curated collections from farcaster creators",
        "• trade with low fees: built on base for lightning-fast, cheap transactions", 
        "• social trading: share finds, follow collectors, build your reputation",
        "• create & mint: turn your art into nfts in seconds with our frame tools"
      ],
      actions: [
        { id: 'browse', label: 'Browse NFTs', icon: FiEye },
        { id: 'create', label: 'Create NFT', icon: FiStar },
        { id: 'connect', label: 'Connect Wallet', icon: FiZap }
      ]
    },
    {
      title: "here's what you can do right now:",
      subtitle: "pick something to get started - we'll guide you through each step",
      content: [
        "🎨 \"show me trending nfts\" - see what's hot in the community",
        "💎 \"create my first nft\" - mint your art with zero coding required",
        "📈 \"check floor prices\" - get market data for any collection", 
        "🔗 \"connect my wallet\" - link your base wallet to start trading"
      ],
      actions: [
        { id: 'trending', label: 'Show Trending', icon: FiTrendingUp },
        { id: 'mint', label: 'Mint NFT', icon: FiStar },
        { id: 'explore', label: 'Explore All', icon: FiShoppingBag }
      ]
    }
  ]

  const handleActionSelect = (actionId: string) => {
    setSelectedAction(actionId)
    
    // Immediate feedback with reaction
    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
        setSelectedAction(null)
      } else {
        onComplete()
        // Route user based on their selection
        handleUserAction(actionId)
      }
    }, 800)
  }

  const handleUserAction = (actionId: string) => {
    switch (actionId) {
      case 'browse':
      case 'trending':
      case 'explore':
        // Stay on main page, scroll to NFT grid
        document.getElementById('nft-grid')?.scrollIntoView({ behavior: 'smooth' })
        break
      case 'create':
      case 'mint':
        window.location.href = '/create'
        break
      case 'connect':
        // Trigger wallet connection
        const button = document.querySelector('[data-testid="rk-connect-button"]') as HTMLElement
        button?.click()
        break
    }
  }

  const currentStepData = steps[currentStep]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-2xl max-w-2xl mx-auto"
      >
        {/* Progress Indicator */}
        <div className="flex justify-center mb-6">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className={`w-3 h-3 rounded-full mx-1 ${
                index === currentStep
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500'
                  : index < currentStep
                  ? 'bg-green-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: index === currentStep ? 1.2 : 1 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="text-center mb-8">
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {currentStepData.title}
          </motion.h2>
          
          <motion.p
            className="text-lg text-gray-600 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {currentStepData.subtitle}
          </motion.p>

          {/* Feature List */}
          <motion.div
            className="text-left space-y-3 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {currentStepData.content.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-3 text-gray-700"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mt-2.5 flex-shrink-0" />
                <p className="leading-relaxed">{item}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <p className="text-center text-gray-600 font-medium mb-4">
            what do you want to do first?
          </p>
          
          <div className="grid gap-3 md:grid-cols-3">
            {currentStepData.actions.map((action, index) => (
              <motion.button
                key={action.id}
                onClick={() => handleActionSelect(action.id)}
                disabled={selectedAction !== null}
                className={`relative flex items-center justify-center space-x-3 p-4 rounded-2xl font-semibold transition-all duration-300 ${
                  selectedAction === action.id
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white scale-105'
                    : selectedAction
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 hover:scale-105 shadow-lg hover:shadow-xl'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {selectedAction === action.id ? (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5"
                    >
                      <FiCheck />
                    </motion.div>
                    <span>Got it!</span>
                  </>
                ) : (
                  <>
                    <action.icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{action.label}</span>
                    <span className="sm:hidden">{action.label.split(' ')[0]}</span>
                  </>
                )}

                {/* Reaction Effect */}
                {selectedAction === action.id && (
                  <motion.div
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                    initial={{ scale: 0, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0, y: -10 }}
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border-2 border-green-500">
                      👍
                    </div>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Skip Option */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <button
            onClick={onComplete}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
          >
            skip intro →
          </button>
        </motion.div>

        {/* Status Indicator */}
        {!isConnected && (
          <motion.div
            className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <FiZap className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-orange-800">
                  Connect your wallet to start trading
                </p>
                <p className="text-xs text-orange-600">
                  we'll help you set up everything step by step
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}