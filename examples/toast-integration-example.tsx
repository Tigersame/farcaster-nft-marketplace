// Example: How to integrate Toast Notifications in your components
// Copy this pattern to add toast feedback to any transaction or user action

'use client'

import { useState } from 'react'
import ToastNotification, { useToastManager } from '@/components/ToastNotification'

export default function ExampleWithToasts() {
  const { toasts, addToast, removeToast, updateToast } = useToastManager()

  // Example 1: Simple success toast
  const handleSimpleSuccess = () => {
    addToast({
      type: 'success',
      message: '✅ Action completed successfully!'
    })
  }

  // Example 2: Error toast
  const handleError = () => {
    addToast({
      type: 'error',
      message: '❌ Something went wrong. Please try again.'
    })
  }

  // Example 3: Transaction flow (pending → success/error)
  const handleTransaction = async () => {
    // Show pending toast
    const toastId = addToast({
      type: 'pending',
      message: '⏳ Processing transaction...',
      autoClose: false // Don't auto-dismiss pending toasts
    })

    try {
      // Simulate transaction
      const txHash = await simulateTransaction()
      
      // Update to success
      updateToast(toastId, {
        type: 'success',
        message: '✅ Transaction confirmed!',
        txHash: txHash,
        explorerUrl: `https://basescan.org/tx/${txHash}`,
        autoClose: true,
        duration: 7000 // Show for 7 seconds
      })
    } catch (error) {
      // Update to error
      updateToast(toastId, {
        type: 'error',
        message: `❌ Transaction failed: ${(error as Error).message}`,
        autoClose: true
      })
    }
  }

  // Example 4: Info toast with custom duration
  const handleInfo = () => {
    addToast({
      type: 'info',
      message: 'ℹ️ Connect your wallet to continue',
      duration: 10000 // Show for 10 seconds
    })
  }

  // Simulate async transaction
  const simulateTransaction = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.3
        if (success) {
          resolve('0x' + Math.random().toString(36).substring(2, 15))
        } else {
          reject(new Error('Insufficient gas'))
        }
      }, 3000)
    })
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Toast Notification Examples</h1>
      
      <div className="flex flex-col gap-4">
        <button
          onClick={handleSimpleSuccess}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Show Success Toast
        </button>

        <button
          onClick={handleError}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Show Error Toast
        </button>

        <button
          onClick={handleTransaction}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Simulate Transaction (Pending → Success/Error)
        </button>

        <button
          onClick={handleInfo}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Show Info Toast
        </button>
      </div>

      {/* Toast Container - Add to your layout or page */}
      <ToastNotification toasts={toasts} onDismiss={removeToast} />
    </div>
  )
}

// ==========================================
// INTEGRATION GUIDE
// ==========================================

// 1. Import the hook and component:
// import ToastNotification, { useToastManager } from '@/components/ToastNotification'

// 2. Use the hook in your component:
// const { toasts, addToast, removeToast, updateToast } = useToastManager()

// 3. Add the ToastNotification component to your JSX:
// <ToastNotification toasts={toasts} onDismiss={removeToast} />

// 4. Trigger toasts on actions:
// addToast({ type: 'success', message: 'Done!' })

// 5. For transactions, use pending → success/error pattern:
// const id = addToast({ type: 'pending', message: 'Processing...', autoClose: false })
// updateToast(id, { type: 'success', message: 'Complete!', txHash: '0x...' })

// ==========================================
// TOAST TYPES
// ==========================================
// - success: Green, check icon, for completed actions
// - error: Red, alert icon, for failures
// - info: Blue, info icon, for informational messages
// - pending: Indigo, spinning loader, for in-progress operations

// ==========================================
// TOAST OPTIONS
// ==========================================
// - type: 'success' | 'error' | 'info' | 'pending'
// - message: string (required)
// - txHash?: string (optional, shows "View transaction" link)
// - explorerUrl?: string (optional, custom explorer link)
// - autoClose?: boolean (default: true, false for pending)
// - duration?: number (default: 5000ms = 5 seconds)
