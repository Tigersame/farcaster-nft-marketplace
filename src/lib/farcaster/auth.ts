/**
 * Farcaster Auth (Sign In With Farcaster)
 * https://docs.farcaster.xyz/auth-kit/introduction
 * 
 * Implements SIWF protocol for authenticating users with Farcaster
 */

import { AuthClientError, createAppClient, viemConnector } from '@farcaster/auth-client'

export interface FarcasterAuthConfig {
  relay?: string
  domain?: string
  siweUri?: string
  rpcUrl?: string
  version?: string
}

export interface FarcasterUser {
  fid: number
  username?: string
  displayName?: string
  pfpUrl?: string
  bio?: string
  custody?: string
  verifications?: string[]
}

export interface AuthResult {
  success: boolean
  user?: FarcasterUser
  message?: string
  signature?: string
  error?: string
}

class FarcasterAuthManager {
  private static instance: FarcasterAuthManager
  private config: FarcasterAuthConfig
  private appClient: any

  private constructor() {
    this.config = {
      relay: 'https://relay.farcaster.xyz',
      domain: process.env.NEXT_PUBLIC_BASE_URL?.replace(/^https?:\/\//, '') || 'curswap.com',
      siweUri: process.env.NEXT_PUBLIC_BASE_URL || 'https://curswap.com',
      rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org',
      version: 'v1'
    }
  }

  static getInstance(): FarcasterAuthManager {
    if (!FarcasterAuthManager.instance) {
      FarcasterAuthManager.instance = new FarcasterAuthManager()
    }
    return FarcasterAuthManager.instance
  }

  /**
   * Initialize Auth Client
   */
  async initialize(): Promise<void> {
    try {
      this.appClient = createAppClient({
        relay: this.config.relay,
        ethereum: viemConnector({
          rpcUrl: this.config.rpcUrl!
        })
      })
    } catch (error) {
      console.error('Failed to initialize Farcaster Auth:', error)
    }
  }

  /**
   * Sign In With Farcaster
   * Returns a channel for QR code or deep link
   */
  async signIn(): Promise<{
    channelToken: string
    url: string
    connectUri: string
    nonce: string
  }> {
    if (!this.appClient) {
      await this.initialize()
    }

    const nonce = this.generateNonce()

    const channel = await this.appClient.createChannel({
      siweUri: this.config.siweUri,
      domain: this.config.domain,
      nonce
    })

    return {
      channelToken: channel.channelToken,
      url: channel.url,
      connectUri: channel.connectUri,
      nonce
    }
  }

  /**
   * Poll for auth status
   */
  async pollAuthStatus(channelToken: string): Promise<AuthResult> {
    try {
      const response = await this.appClient.watchStatus({
        channelToken,
        timeout: 300000, // 5 minutes
        interval: 1000, // 1 second
        onResponse: (res: any) => {
          if (res.state === 'completed') {
            return res
          }
        }
      })

      if (response.state === 'completed' && response.message && response.signature) {
        const user = await this.getUserFromMessage(response.message)
        return {
          success: true,
          user,
          message: response.message,
          signature: response.signature
        }
      }

      return {
        success: false,
        error: 'Authentication failed'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Verify SIWE message
   */
  async verify(message: string, signature: string): Promise<boolean> {
    try {
      const result = await this.appClient.verifySignInMessage({
        message,
        signature,
        domain: this.config.domain,
        nonce: this.extractNonce(message)
      })
      return result.success
    } catch (error) {
      console.error('Verification failed:', error)
      return false
    }
  }

  /**
   * Get user data from SIWE message
   */
  private async getUserFromMessage(message: string): Promise<FarcasterUser> {
    // Parse SIWE message to extract FID and other data
    const fidMatch = message.match(/fid:(\d+)/)
    const fid = fidMatch ? parseInt(fidMatch[1]) : 0

    // In production, fetch full user data from Farcaster Hub
    return {
      fid,
      username: `fid:${fid}`,
      displayName: `User ${fid}`
    }
  }

  /**
   * Generate secure nonce
   */
  private generateNonce(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  /**
   * Extract nonce from SIWE message
   */
  private extractNonce(message: string): string {
    const nonceMatch = message.match(/Nonce: ([a-f0-9]+)/)
    return nonceMatch ? nonceMatch[1] : ''
  }

  /**
   * Sign out
   */
  signOut(): void {
    // Clear any stored auth state
    if (typeof window !== 'undefined') {
      localStorage.removeItem('farcaster_auth')
      sessionStorage.removeItem('farcaster_user')
    }
  }
}

export const farcasterAuth = FarcasterAuthManager.getInstance()

/**
 * React hook for Farcaster Auth
 */
import { useState, useCallback } from 'react'

export function useFarcasterAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [user, setUser] = useState<FarcasterUser>()
  const [authData, setAuthData] = useState<{
    channelToken?: string
    url?: string
    connectUri?: string
  }>()

  const signIn = useCallback(async () => {
    setIsLoading(true)
    setError(undefined)

    try {
      const data = await farcasterAuth.signIn()
      setAuthData(data)

      // Start polling for auth status
      const result = await farcasterAuth.pollAuthStatus(data.channelToken)

      if (result.success && result.user) {
        setUser(result.user)
        
        // Store auth data
        if (typeof window !== 'undefined') {
          localStorage.setItem('farcaster_auth', JSON.stringify({
            message: result.message,
            signature: result.signature,
            timestamp: Date.now()
          }))
          sessionStorage.setItem('farcaster_user', JSON.stringify(result.user))
        }
      } else {
        setError(result.error || 'Authentication failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signOut = useCallback(() => {
    farcasterAuth.signOut()
    setUser(undefined)
    setAuthData(undefined)
  }, [])

  return {
    user,
    isLoading,
    error,
    authData,
    signIn,
    signOut,
    isAuthenticated: !!user
  }
}
