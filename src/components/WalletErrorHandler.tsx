'use client'

import { useEffect } from 'react'

export function WalletErrorHandler() {
  useEffect(() => {
    // Aggressive console.error suppression for wallet conflicts
    const originalError = console.error
    console.error = (...args) => {
      const message = String(args[0] || '')
      
      // Suppress all wallet-related errors
      if (
        message.includes('MetaMask') ||
        message.includes('ethereum') ||
        message.includes('Cannot set property') ||
        message.includes('Cannot redefine property') ||
        message.includes('wallet') ||
        message.includes('extension') ||
        message.includes('runtime.lastError') ||
        message.includes('Receiving end does not exist') ||
        message.includes('inpage.js')
      ) {
        return // Completely suppress these
      }
      
      originalError.apply(console, args)
    }
    
    // Suppress console.log for React DevTools and other noise
    const originalLog = console.log
    console.log = (...args) => {
      const message = String(args[0] || '')
      
      if (
        message.includes('Download the React DevTools') ||
        message.includes('better development experience')
      ) {
        return // Suppress React DevTools message
      }
      
      originalLog.apply(console, args)
    }

    // Handle MetaMask provider conflicts
    const handleProviderError = (event: ErrorEvent) => {
      const message = event.message || ''
      
      // Suppress MetaMask global provider conflicts
      if (message.includes('Cannot set property ethereum') || 
          message.includes('Cannot redefine property: ethereum') ||
          message.includes('setting the global Ethereum provider') ||
          message.includes('MetaMask encountered an error') ||
          message.includes('Error in invocation of runtime.sendMessage') ||
          message.includes('chrome.runtime.sendMessage') ||
          message.includes('Extension ID')) {
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