'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Notification {
  id: string
  type: 'success' | 'info' | 'warning' | 'celebration'
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  celebrate: (message: string) => void
  reactToAction: (action: string, details?: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification = { ...notification, id }
    
    setNotifications(prev => [...prev, newNotification])

    // Auto-remove after duration
    setTimeout(() => {
      removeNotification(id)
    }, notification.duration || 5000)
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const celebrate = (message: string) => {
    addNotification({
      type: 'celebration',
      title: 'amazing! 🎉',
      message,
      duration: 4000
    })
  }

  const reactToAction = (action: string, details?: string) => {
    const reactions: Record<string, { title: string; message: string; type: 'success' | 'info' }> = {
      wallet_connected: {
        title: 'wallet connected! 🔗',
        message: 'you\'re ready to start trading nfts on base',
        type: 'success'
      },
      nft_viewed: {
        title: 'nice choice! 👀',
        message: details || 'exploring the collection like a pro',
        type: 'info'
      },
      nft_purchased: {
        title: 'purchase successful! 💎',
        message: 'nft added to your collection',
        type: 'success'
      },
      nft_listed: {
        title: 'listed for sale! 📈',
        message: 'your nft is now available to collectors',
        type: 'success'
      },
      profile_updated: {
        title: 'profile looking good! ✨',
        message: 'your farcaster profile is updated',
        type: 'success'
      },
      collection_created: {
        title: 'collection created! 🎨',
        message: 'time to add some amazing nfts',
        type: 'success'
      }
    }

    const reaction = reactions[action]
    if (reaction) {
      addNotification({
        type: reaction.type,
        title: reaction.title,
        message: reaction.message,
        duration: 3000
      })
    }
  }

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      celebrate,
      reactToAction
    }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  )
}

function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications()

  return (
    <div className="fixed top-6 right-6 z-50 space-y-3 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationCard 
            key={notification.id} 
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

function NotificationCard({ 
  notification, 
  onClose 
}: { 
  notification: Notification
  onClose: () => void 
}) {
  const getNotificationStyles = (type: string) => {
    const styles: Record<string, { bg: string; border: string; gradient: string; icon: string }> = {
      success: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        gradient: 'from-green-500 to-emerald-500',
        icon: '✅'
      },
      info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200', 
        gradient: 'from-blue-500 to-cyan-500',
        icon: 'ℹ️'
      },
      warning: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        gradient: 'from-yellow-500 to-orange-500', 
        icon: '⚠️'
      },
      celebration: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        gradient: 'from-purple-500 to-pink-500',
        icon: '🎉'
      }
    }
    return styles[type] || styles['info']
  }

  const styles = getNotificationStyles(notification.type || 'info')

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      whileHover={{ scale: 1.02 }}
      className={`${styles.bg} ${styles.border} border-2 rounded-2xl p-4 shadow-xl backdrop-blur-xl relative overflow-hidden`}
    >
      {/* Animated background */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${styles.gradient} opacity-5`}
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start space-x-3">
          {/* Icon with bounce */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 10,
              delay: 0.1 
            }}
            className="text-xl"
          >
            {styles.icon}
          </motion.div>

          <div className="flex-1 min-w-0">
            {/* Title */}
            <motion.h4
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-semibold text-gray-900 text-sm"
            >
              {notification.title}
            </motion.h4>

            {/* Message */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 text-xs mt-1 leading-relaxed"
            >
              {notification.message}
            </motion.p>

            {/* Action button */}
            {notification.action && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                onClick={notification.action.onClick}
                className={`mt-3 px-4 py-2 bg-gradient-to-r ${styles.gradient} text-white text-xs font-medium rounded-xl hover:shadow-md transition-all duration-200 transform hover:scale-105`}
              >
                {notification.action.label}
              </motion.button>
            )}
          </div>

          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
          >
            ✕
          </motion.button>
        </div>
      </div>

      {/* Progress bar for celebration notifications */}
      {notification.type === 'celebration' && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ 
            duration: (notification.duration || 4000) / 1000,
            ease: "linear"
          }}
        />
      )}
    </motion.div>
  )
}

// Reaction hooks for common actions
export function useActionReactions() {
  const { reactToAction, celebrate } = useNotifications()

  return {
    onWalletConnected: () => reactToAction('wallet_connected'),
    onNFTViewed: (nftTitle?: string) => reactToAction('nft_viewed', nftTitle ? `checking out "${nftTitle}"` : undefined),
    onNFTPurchased: () => {
      reactToAction('nft_purchased')
      setTimeout(() => celebrate('welcome to the collector club! 🏆'), 1000)
    },
    onNFTListed: () => reactToAction('nft_listed'),
    onProfileUpdated: () => reactToAction('profile_updated'),
    onCollectionCreated: () => {
      reactToAction('collection_created')
      setTimeout(() => celebrate('you\'re now a creator! time to build something amazing 🚀'), 1500)
    }
  }
}