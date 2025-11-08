'use client'

import { useEffect } from 'react'

export function WalletErrorHandler() {
  useEffect(() => {
    // Handle MetaMask provider conflicts
    const handleProviderError = (event: ErrorEvent) => {
      const message = event.message || ''
      
      // Suppress MetaMask global provider conflicts
      if (message.includes('Cannot set property ethereum') || 
          message.includes('setting the global Ethereum provider') ||
          message.includes('MetaMask encountered an error')) {
        console.warn('⚠️ Multiple wallet extensions detected. This is normal - RainbowKit will handle provider selection.')
        event.preventDefault()
        return false
      }
      
      // Suppress Cross-Origin-Opener-Policy errors in development
      if (message.includes('Cross-Origin-Opener-Policy') || message.includes('404')) {
        event.preventDefault()
        return false
      }
      
      // Suppress CSP violations for wallet extensions
      if (message.includes('Content Security Policy directive') || 
          message.includes('style-src')) {
        event.preventDefault()
        return false
      }
    }

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason?.message || event.reason || ''
      
      if (reason.includes('Cross-Origin-Opener-Policy') || 
          reason.includes('HTTP error! status: 404')) {
        console.warn('⚠️ Suppressed non-critical error:', reason)
        event.preventDefault()
      }
    }

    // Handle development-only warnings
    const handleConsoleWarnings = () => {
      const originalWarn = console.warn
      console.warn = (...args) => {
        const message = args.join(' ')
        
        // Suppress non-critical development warnings
        if (message.includes('@react-native-async-storage/async-storage') ||
            message.includes('Lit is in dev mode') ||
            message.includes('Download the React DevTools') ||
            message.includes('WalletConnect Core is already initialized') ||
            message.includes('Loading multiple versions is not recommended')) {
          return
        }
        
        originalWarn.apply(console, args)
      }
      
      // Also handle console.log for WalletConnect messages
      const originalLog = console.log
      console.log = (...args) => {
        const message = args.join(' ')
        
        if (message.includes('WalletConnect Core is already initialized')) {
          return
        }
        
        originalLog.apply(console, args)
      }
    }

    window.addEventListener('error', handleProviderError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    handleConsoleWarnings()

    return () => {
      window.removeEventListener('error', handleProviderError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return null
}