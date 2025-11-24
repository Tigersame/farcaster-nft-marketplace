/**
 * Base Mini-App Loading States
 * Consistent loading indicators for mini-app operations
 */

'use client'

import { motion } from 'framer-motion'
import { BRANDING } from '@/config/branding'

interface LoadingStateProps {
  message?: string
  size?: 'small' | 'medium' | 'large'
  fullScreen?: boolean
}

export function LoadingState({ 
  message = 'Loading...', 
  size = 'medium',
  fullScreen = false 
}: LoadingStateProps) {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  }

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Animated Logo */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg`}
      >
        <span className="text-white font-bold text-xl">
          {BRANDING.display.iconInitial}
        </span>
      </motion.div>

      {/* Loading Dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2
            }}
            className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          />
        ))}
      </div>

      {/* Message */}
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-600 dark:text-gray-400 text-center"
        >
          {message}
        </motion.p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
        {content}
      </div>
    )
  }

  return (
    <div className="w-full min-h-[200px] flex items-center justify-center">
      {content}
    </div>
  )
}

/**
 * Skeleton loader for content
 */
export function SkeletonLoader({ 
  lines = 3,
  className = '' 
}: { 
  lines?: number
  className?: string 
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
          style={{ width: `${Math.random() * 30 + 70}%` }}
        />
      ))}
    </div>
  )
}

/**
 * Spinner component
 */
export function Spinner({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4'
  }

  return (
    <div
      className={`${sizeClasses[size]} border-blue-500 border-t-transparent rounded-full animate-spin`}
    />
  )
}
