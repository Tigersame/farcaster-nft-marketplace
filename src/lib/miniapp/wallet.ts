/**
 * Base Mini-App Wallet Integration
 * https://docs.base.org/mini-apps/quickstart/build-checklist
 * 
 * Wallet integration for mini-apps with smart wallet support
 */

import { sdk } from '@farcaster/frame-sdk'

export interface WalletConnection {
  address: string
  chain: number
  isConnected: boolean
  isSmartWallet: boolean
}

export interface TokenBalance {
  token: string
  symbol: string
  balance: string
  decimals: number
  value?: string
}

class MiniAppWalletManager {
  private static instance: MiniAppWalletManager
  private connection?: WalletConnection

  private constructor() {}

  static getInstance(): MiniAppWalletManager {
    if (!MiniAppWalletManager.instance) {
      MiniAppWalletManager.instance = new MiniAppWalletManager()
    }
    return MiniAppWalletManager.instance
  }

  /**
   * Connect wallet using Farcaster's smart wallet
   */
  async connect(): Promise<WalletConnection | null> {
    try {
      // In Farcaster, the user's wallet is automatically connected via their account
      // We can get the user's custody address from the context
      const context = await sdk.context
      
      if ((context as any)?.user?.custody) {
        this.connection = {
          address: (context as any).user.custody,
          chain: 8453, // Base mainnet
          isConnected: true,
          isSmartWallet: true
        }
        
        console.log('Wallet connected:', this.connection)
        return this.connection
      }

      return null
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      return null
    }
  }

  /**
   * Get current wallet connection
   */
  getConnection(): WalletConnection | undefined {
    return this.connection
  }

  /**
   * Disconnect wallet
   */
  disconnect(): void {
    this.connection = undefined
  }

  /**
   * Request token swap via SDK
   */
  async swapToken(params: {
    fromToken: string
    toToken: string
    amount: string
    slippage?: number
  }): Promise<boolean> {
    try {
      if ((sdk.actions as any).swapToken) {
        await (sdk.actions as any).swapToken({
          fromToken: params.fromToken,
          toToken: params.toToken,
          amount: params.amount,
          slippage: params.slippage || 0.5
        })
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to swap token:', error)
      return false
    }
  }

  /**
   * Request token send via SDK
   */
  async sendToken(params: {
    token: string
    amount: string
    recipient: string
  }): Promise<boolean> {
    try {
      if ((sdk.actions as any).sendToken) {
        await (sdk.actions as any).sendToken(params)
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to send token:', error)
      return false
    }
  }

  /**
   * View token details via SDK
   */
  viewToken(tokenAddress: string): void {
    try {
      if ((sdk.actions as any).viewToken) {
        (sdk.actions as any).viewToken({ token: tokenAddress })
      }
    } catch (error) {
      console.error('Failed to view token:', error)
    }
  }

  /**
   * Open wallet in native app
   */
  openWallet(): void {
    try {
      if ((sdk.actions as any).openWallet) {
        (sdk.actions as any).openWallet()
      } else {
        // Fallback: open Base wallet URL
        sdk.actions.openUrl('https://wallet.coinbase.com')
      }
    } catch (error) {
      console.error('Failed to open wallet:', error)
    }
  }
}

export const walletManager = MiniAppWalletManager.getInstance()

/**
 * React hook for wallet integration
 */
export function useWallet() {
  const [connection, setConnection] = React.useState<WalletConnection>()
  const [isConnecting, setIsConnecting] = React.useState(false)

  const connect = async () => {
    setIsConnecting(true)
    try {
      const conn = await walletManager.connect()
      if (conn) {
        setConnection(conn)
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    walletManager.disconnect()
    setConnection(undefined)
  }

  React.useEffect(() => {
    // Auto-connect on mount if available
    const conn = walletManager.getConnection()
    if (conn) {
      setConnection(conn)
    }
  }, [])

  return {
    connection,
    isConnected: !!connection?.isConnected,
    isConnecting,
    connect,
    disconnect,
    swapToken: walletManager.swapToken.bind(walletManager),
    sendToken: walletManager.sendToken.bind(walletManager),
    viewToken: walletManager.viewToken.bind(walletManager),
    openWallet: walletManager.openWallet.bind(walletManager),
  }
}

// Add React import for the hook
import * as React from 'react'
