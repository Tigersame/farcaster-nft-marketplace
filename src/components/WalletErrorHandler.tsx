'use client'

import { useEffect } from 'react'

export function WalletErrorHandler() {
  useEffect(() => {
    // Handle MetaMask provider conflicts
    const handleProviderError = (event: ErrorEvent) => {
      if (event.message?.includes('Cannot set property ethereum')) {
        console.warn('⚠️ Multiple wallet extensions detected. Using the first available provider.')
        // Suppress the error to prevent console spam
        event.preventDefault()
        return false
      }
    }

    // Handle async-storage missing warning (non-blocking)
    const handleAsyncStorageWarning = () => {
      const originalWarn = console.warn
      console.warn = (...args) => {
        const message = args.join(' ')
        if (message.includes('@react-native-async-storage/async-storage')) {
          // Suppress this warning as it's not critical for web apps
          return
        }
        originalWarn.apply(console, args)
      }
    }

    window.addEventListener('error', handleProviderError)
    handleAsyncStorageWarning()

    return () => {
      window.removeEventListener('error', handleProviderError)
    }
  }, [])

  return null
}