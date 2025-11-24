/**
 * Base Mini-App SDK Manager
 * https://docs.base.org/mini-apps/quickstart/build-checklist
 * 
 * Manages SDK lifecycle, context, and actions
 */

import { sdk } from '@farcaster/frame-sdk'

export interface SDKContext {
  user?: {
    fid: number
    username?: string
    displayName?: string
    pfpUrl?: string
    bio?: string
    verifications?: string[]
    custody?: string
  }
  location?: {
    type: 'cast' | 'channel' | 'profile' | 'feed'
    cast?: {
      fid: number
      hash: string
    }
    channel?: {
      id: string
      name: string
    }
    profile?: {
      fid: number
    }
  }
  client?: {
    clientFid: number
    name: string
    version: string
    platform: 'ios' | 'android' | 'web'
  }
}

export interface SDKCapabilities {
  hasWallet: boolean
  hasNotifications: boolean
  hasCompose: boolean
  hasActions: boolean
  supportedChains: number[]
}

class MiniAppSDKManager {
  private static instance: MiniAppSDKManager
  private isInitialized = false
  private isReady = false
  private context?: SDKContext
  private capabilities?: SDKCapabilities

  private constructor() {}

  static getInstance(): MiniAppSDKManager {
    if (!MiniAppSDKManager.instance) {
      MiniAppSDKManager.instance = new MiniAppSDKManager()
    }
    return MiniAppSDKManager.instance
  }

  /**
   * Initialize the SDK
   * Call this early in your app lifecycle
   */
  async initialize(): Promise<SDKContext | null> {
    if (this.isInitialized) {
      return this.context || null
    }

    try {
      // Check if we're in a Farcaster environment
      if (!this.isInFarcasterEnvironment()) {
        console.log('Not in Farcaster environment - SDK disabled')
        this.isInitialized = true
        return null
      }

      console.log('Initializing Farcaster SDK...')
      
      // Get context
      this.context = await sdk.context as unknown as SDKContext
      this.isInitialized = true

      console.log('SDK initialized with context:', this.context)
      
      // Get capabilities
      await this.loadCapabilities()

      return this.context
    } catch (error) {
      console.error('Failed to initialize SDK:', error)
      this.isInitialized = true // Mark as initialized even on failure
      return null
    }
  }

  /**
   * Mark the app as ready
   * Call this when your app has finished loading
   */
  ready(): void {
    if (!this.isReady && this.isInitialized) {
      try {
        sdk.actions.ready()
        this.isReady = true
        console.log('App marked as ready')
      } catch (error) {
        console.error('Failed to mark app as ready:', error)
      }
    }
  }

  /**
   * Check if SDK is initialized
   */
  isSDKInitialized(): boolean {
    return this.isInitialized
  }

  /**
   * Check if app is ready
   */
  isAppReady(): boolean {
    return this.isReady
  }

  /**
   * Get current context
   */
  getContext(): SDKContext | undefined {
    return this.context
  }

  /**
   * Get capabilities
   */
  getCapabilities(): SDKCapabilities | undefined {
    return this.capabilities
  }

  /**
   * Check if running in Farcaster environment
   */
  private isInFarcasterEnvironment(): boolean {
    if (typeof window === 'undefined') return false
    
    const isInIframe = window.location !== window.parent.location
    const isFarcasterUA = /warpcast|farcaster|base/i.test(navigator.userAgent)
    
    return isInIframe || isFarcasterUA
  }

  /**
   * Load capabilities from SDK
   */
  private async loadCapabilities(): Promise<void> {
    try {
      // Check available features
      const hasWallet = typeof (sdk.actions as any).connectWallet === 'function'
      const hasNotifications = typeof (sdk.actions as any).requestNotificationPermission === 'function'
      const hasCompose = typeof sdk.actions.composeCast === 'function'
      const hasActions = typeof sdk.actions.openUrl === 'function'

      this.capabilities = {
        hasWallet,
        hasNotifications,
        hasCompose,
        hasActions,
        supportedChains: [8453] // Base mainnet
      }

      console.log('SDK capabilities:', this.capabilities)
    } catch (error) {
      console.error('Failed to load capabilities:', error)
    }
  }

  /**
   * Actions API
   */
  actions = {
    openUrl: (url: string) => {
      try {
        sdk.actions.openUrl(url)
      } catch (error) {
        console.error('Failed to open URL:', error)
        window.open(url, '_blank')
      }
    },

    close: () => {
      try {
        sdk.actions.close()
      } catch (error) {
        console.error('Failed to close app:', error)
      }
    },

    composeCast: (text: string, embeds?: string[]) => {
      try {
        sdk.actions.composeCast({ text, embeds: embeds as any })
      } catch (error) {
        console.error('Failed to compose cast:', error)
      }
    },

    addFrame: (url: string) => {
      try {
        if ((sdk.actions as any).addFrame) {
          (sdk.actions as any).addFrame({ url })
        }
      } catch (error) {
        console.error('Failed to add frame:', error)
      }
    },

    swapToken: (params: {
      fromToken: string
      toToken: string
      amount: string
    }) => {
      try {
        if ((sdk.actions as any).swapToken) {
          (sdk.actions as any).swapToken(params)
        }
      } catch (error) {
        console.error('Failed to swap token:', error)
      }
    },

    sendToken: (params: {
      token: string
      amount: string
      recipient: string
    }) => {
      try {
        if ((sdk.actions as any).sendToken) {
          (sdk.actions as any).sendToken(params)
        }
      } catch (error) {
        console.error('Failed to send token:', error)
      }
    },

    haptic: (style: 'light' | 'medium' | 'heavy' = 'medium') => {
      try {
        if ((sdk.actions as any).haptic) {
          (sdk.actions as any).haptic({ style })
        }
      } catch (error) {
        // Silently fail for haptics
      }
    }
  }
}

export const sdkManager = MiniAppSDKManager.getInstance()
