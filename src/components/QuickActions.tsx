'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Base App Quick Actions Content Types
export interface Action {
  id: string
  label: string
  imageUrl?: string
  style?: 'primary' | 'secondary' | 'danger'
  expiresAt?: string
}

export interface ActionsContent {
  id: string
  description: string
  actions: Action[]
  expiresAt?: string
}

export interface IntentContent {
  id: string
  actionId: string
  metadata?: Record<string, string | number | boolean | null>
}

interface QuickActionsProps {
  content: ActionsContent
  onActionSelect: (intent: IntentContent) => void
  disabled?: boolean
}

export function QuickActions({ content, onActionSelect, disabled }: QuickActionsProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleActionClick = async (action: Action) => {
    if (disabled || isProcessing) return

    setSelectedAction(action.id)
    setIsProcessing(true)

    try {
      // Create intent message following Base App spec
      const intent: IntentContent = {
        id: content.id,
        actionId: action.id,
        metadata: {
          timestamp: Date.now(),
          actionLabel: action.label,
          style: action.style || 'primary'
        }
      }

      await onActionSelect(intent)
    } finally {
      setIsProcessing(false)
      setSelectedAction(null)
    }
  }

  const getActionStyles = (style?: string) => {
    const styles = {
      primary: {
        bg: 'bg-blue-500 hover:bg-blue-600',
        text: 'text-white',
        border: 'border-blue-500',
        shadow: 'shadow-blue-200'
      },
      secondary: {
        bg: 'bg-gray-100 hover:bg-gray-200',
        text: 'text-gray-900',
        border: 'border-gray-300',
        shadow: 'shadow-gray-100'
      },
      danger: {
        bg: 'bg-red-500 hover:bg-red-600',
        text: 'text-white',
        border: 'border-red-500',
        shadow: 'shadow-red-200'
      }
    }
    return styles[style as keyof typeof styles] || styles.primary
  }

  const isExpired = content.expiresAt ? new Date(content.expiresAt) < new Date() : false

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-white rounded-2xl border p-6 shadow-lg max-w-md ${
        disabled || isExpired ? 'opacity-60' : ''
      }`}
    >
      {/* Description */}
      <div className="mb-6">
        <p className="text-gray-800 font-medium leading-relaxed">
          {content.description}
        </p>
        {content.expiresAt && (
          <p className="text-xs text-gray-500 mt-2">
            {isExpired ? 'Expired' : `Expires ${new Date(content.expiresAt).toLocaleDateString()}`}
          </p>
        )}
      </div>

      {/* Actions Grid */}
      <div className="space-y-3">
        <AnimatePresence>
          {content.actions.map((action, index) => {
            const actionExpired = action.expiresAt ? new Date(action.expiresAt) < new Date() : false
            const isSelected = selectedAction === action.id
            const actionStyles = getActionStyles(action.style)
            
            return (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleActionClick(action)}
                disabled={disabled || isExpired || actionExpired || isProcessing}
                className={`
                  w-full flex items-center justify-between p-4 rounded-xl font-medium
                  transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                  ${actionStyles.bg} ${actionStyles.text} ${actionStyles.border}
                  hover:shadow-lg ${actionStyles.shadow}
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  ${isSelected ? 'ring-2 ring-blue-300 ring-opacity-50' : ''}
                `}
              >
                <div className="flex items-center space-x-3">
                  {action.imageUrl && (
                    <img
                      src={action.imageUrl}
                      alt={action.label}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span className="font-semibold">{action.label}</span>
                </div>

                {isSelected && isProcessing && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                  />
                )}
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Fallback instructions */}
      {disabled && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
          <p className="text-xs text-gray-600 font-mono">
            {content.description}
            <br />
            {content.actions.map((action, i) => (
              <span key={action.id}>
                [{i + 1}] {action.label}
                <br />
              </span>
            ))}
            Reply with the number to select
          </p>
        </div>
      )}
    </motion.div>
  )
}

// NFT-specific Quick Actions presets
export const createNFTQuickActions = {
  // Purchase flow
  purchase: (nftId: string, nftName: string): ActionsContent => ({
    id: `nft_purchase_${nftId}`,
    description: `Ready to purchase "${nftName}"? Choose your payment method:`,
    actions: [
      { id: 'buy_eth', label: 'Buy with ETH', style: 'primary' },
      { id: 'buy_usdc', label: 'Buy with USDC', style: 'secondary' },
      { id: 'make_offer', label: 'Make Offer', style: 'secondary' }
    ],
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  }),

  // Listing flow
  listing: (nftId: string): ActionsContent => ({
    id: `nft_listing_${nftId}`,
    description: 'How would you like to sell this NFT?',
    actions: [
      { id: 'fixed_price', label: 'Fixed Price Sale', style: 'primary' },
      { id: 'auction', label: 'Start Auction', style: 'secondary' },
      { id: 'accept_offers', label: 'Accept Offers Only', style: 'secondary' }
    ]
  }),

  // Social interactions
  social: (nftId: string, nftName: string): ActionsContent => ({
    id: `nft_social_${nftId}`,
    description: `Share "${nftName}" with the Farcaster community:`,
    actions: [
      { id: 'cast_share', label: 'Cast to Timeline', style: 'primary' },
      { id: 'dm_share', label: 'Send as DM', style: 'secondary' },
      { id: 'add_favorite', label: 'Add to Favorites', style: 'secondary' }
    ]
  }),

  // Collection management
  collection: (collectionId: string): ActionsContent => ({
    id: `collection_${collectionId}`,
    description: 'Manage your NFT collection:',
    actions: [
      { id: 'mint_new', label: 'Mint New NFT', style: 'primary' },
      { id: 'edit_collection', label: 'Edit Details', style: 'secondary' },
      { id: 'view_analytics', label: 'View Analytics', style: 'secondary' },
      { id: 'export_data', label: 'Export Data', style: 'secondary' }
    ]
  }),

  // Onboarding flow
  onboarding: (step: string): ActionsContent => ({
    id: `onboarding_${step}`,
    description: 'Welcome to Base NFT Marketplace! Get started:',
    actions: [
      { id: 'connect_wallet', label: 'Connect Wallet', style: 'primary' },
      { id: 'browse_nfts', label: 'Browse NFTs', style: 'secondary' },
      { id: 'learn_more', label: 'Learn About NFTs', style: 'secondary' }
    ]
  })
}