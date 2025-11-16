/**
 * Suppress known harmless console errors in development
 */

export function suppressKnownErrors() {
  if (typeof window === 'undefined') return

  const originalError = console.error
  const originalWarn = console.warn

  console.error = (...args: any[]) => {
    const message = args[0]?.toString() || ''
    
    // Suppress known harmless errors
    if (
      message.includes('MetaMask encountered an error') ||
      message.includes('Cannot set property ethereum') ||
      message.includes('Could not establish connection') ||
      message.includes('Receiving end does not exist') ||
      message.includes('Content Security Policy')
    ) {
      return
    }

    originalError.apply(console, args)
  }

  console.warn = (...args: any[]) => {
    const message = args[0]?.toString() || ''
    
    // Suppress known harmless warnings
    if (
      message.includes('WalletConnect Core is already initialized') ||
      message.includes('Multiple versions of Lit loaded')
    ) {
      return
    }

    originalWarn.apply(console, args)
  }
}
