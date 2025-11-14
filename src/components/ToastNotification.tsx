'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX, FiLoader } from 'react-icons/fi'

export type ToastType = 'success' | 'error' | 'info' | 'pending'

export interface Toast {
  id: string
  type: ToastType
  message: string
  txHash?: string
  explorerUrl?: string
  autoClose?: boolean
  duration?: number
}

interface ToastNotificationProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

export default function ToastNotification({ toasts, onDismiss }: ToastNotificationProps) {
  useEffect(() => {
    toasts.forEach((toast) => {
      if (toast.autoClose !== false && toast.type !== 'pending') {
        const timer = setTimeout(() => {
          onDismiss(toast.id)
        }, toast.duration || 5000)
        
        return () => clearTimeout(timer)
      }
    })
  }, [toasts, onDismiss])

  return (
    <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-3 max-w-md" role="region" aria-live="polite" aria-label="Notifications">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`
              relative flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md
              ${toast.type === 'success' ? 'bg-green-500/90 border-green-400 text-white' : ''}
              ${toast.type === 'error' ? 'bg-red-500/90 border-red-400 text-white' : ''}
              ${toast.type === 'info' ? 'bg-blue-500/90 border-blue-400 text-white' : ''}
              ${toast.type === 'pending' ? 'bg-indigo-500/90 border-indigo-400 text-white' : ''}
            `}
          >
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === 'success' && <FiCheckCircle size={20} />}
              {toast.type === 'error' && <FiAlertCircle size={20} />}
              {toast.type === 'info' && <FiInfo size={20} />}
              {toast.type === 'pending' && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <FiLoader size={20} />
                </motion.div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-snug">{toast.message}</p>
              {toast.txHash && (
                <a
                  href={toast.explorerUrl || `https://basescan.org/tx/${toast.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs underline hover:no-underline mt-1 inline-block opacity-90 hover:opacity-100"
                >
                  View transaction ↗
                </a>
              )}
            </div>

            {/* Close button */}
            {toast.type !== 'pending' && (
              <button
                onClick={() => onDismiss(toast.id)}
                className="flex-shrink-0 p-1 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Dismiss notification"
              >
                <FiX size={16} />
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Toast Manager Hook
export function useToastManager() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])
    return id
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const updateToast = (id: string, updates: Partial<Toast>) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    )
  }

  return { toasts, addToast, removeToast, updateToast }
}

// Add to useState import
import { useState } from 'react'
