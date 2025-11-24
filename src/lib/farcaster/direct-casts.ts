/**
 * Farcaster Direct Casts API
 * https://docs.farcaster.xyz/reference/warpcast/direct-casts
 * 
 * Send direct messages to Farcaster users
 */

const WARPCAST_API = 'https://api.warpcast.com'

export interface DirectCast {
  recipientFid: number
  message: string
  idempotencyKey?: string
}

export interface DirectCastResult {
  success: boolean
  messageId?: string
  error?: string
}

export interface DirectCastThread {
  threadId: string
  participantFids: number[]
  messages: DirectCastMessage[]
  unreadCount: number
  lastMessageAt: number
}

export interface DirectCastMessage {
  id: string
  threadId: string
  senderFid: number
  recipientFid: number
  message: string
  timestamp: number
  read: boolean
}

class DirectCastsClient {
  private static instance: DirectCastsClient
  private apiKey?: string

  private constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_WARPCAST_API_KEY
  }

  static getInstance(): DirectCastsClient {
    if (!DirectCastsClient.instance) {
      DirectCastsClient.instance = new DirectCastsClient()
    }
    return DirectCastsClient.instance
  }

  /**
   * Send a direct cast to a user
   */
  async sendDirectCast(params: DirectCast): Promise<DirectCastResult> {
    try {
      if (!this.apiKey) {
        throw new Error('Warpcast API key not configured')
      }

      const response = await fetch(`${WARPCAST_API}/v1/direct-casts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientFid: params.recipientFid,
          message: params.message,
          idempotencyKey: params.idempotencyKey || this.generateIdempotencyKey()
        })
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        success: true,
        messageId: data.result?.messageId
      }
    } catch (error) {
      console.error('Failed to send direct cast:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get direct cast threads for a user
   */
  async getThreads(fid: number): Promise<DirectCastThread[]> {
    try {
      if (!this.apiKey) {
        throw new Error('Warpcast API key not configured')
      }

      const response = await fetch(`${WARPCAST_API}/v1/direct-casts/threads?fid=${fid}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      return data.result?.threads || []
    } catch (error) {
      console.error('Failed to fetch threads:', error)
      return []
    }
  }

  /**
   * Get messages from a thread
   */
  async getThreadMessages(threadId: string): Promise<DirectCastMessage[]> {
    try {
      if (!this.apiKey) {
        throw new Error('Warpcast API key not configured')
      }

      const response = await fetch(
        `${WARPCAST_API}/v1/direct-casts/threads/${threadId}/messages`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      return data.result?.messages || []
    } catch (error) {
      console.error('Failed to fetch messages:', error)
      return []
    }
  }

  /**
   * Mark thread as read
   */
  async markThreadAsRead(threadId: string): Promise<boolean> {
    try {
      if (!this.apiKey) {
        throw new Error('Warpcast API key not configured')
      }

      const response = await fetch(
        `${WARPCAST_API}/v1/direct-casts/threads/${threadId}/read`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return response.ok
    } catch (error) {
      console.error('Failed to mark thread as read:', error)
      return false
    }
  }

  /**
   * Generate idempotency key for message
   */
  private generateIdempotencyKey(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

export const directCastsClient = DirectCastsClient.getInstance()

/**
 * Helper functions for common Direct Cast use cases
 */
export const directCastHelpers = {
  /**
   * Send a swap notification to user
   */
  async sendSwapNotification(
    recipientFid: number,
    fromToken: string,
    toToken: string,
    amount: string
  ): Promise<DirectCastResult> {
    const message = `🔄 Your swap is ready!\n\n${amount} ${fromToken} → ${toToken}\n\nComplete your swap on CurSwap: https://curswap.com/defi`
    
    return directCastsClient.sendDirectCast({
      recipientFid,
      message
    })
  },

  /**
   * Send a pool update notification
   */
  async sendPoolNotification(
    recipientFid: number,
    poolName: string,
    apr: string
  ): Promise<DirectCastResult> {
    const message = `💧 Pool Update!\n\n${poolName} now has ${apr} APR\n\nStart earning: https://curswap.com/defi?tab=pools`
    
    return directCastsClient.sendDirectCast({
      recipientFid,
      message
    })
  },

  /**
   * Send a welcome message
   */
  async sendWelcomeMessage(recipientFid: number): Promise<DirectCastResult> {
    const message = `👋 Welcome to CurSwap!\n\nStart swapping tokens, earning from liquidity pools, and exploring DeFi on Base.\n\nhttps://curswap.com/defi`
    
    return directCastsClient.sendDirectCast({
      recipientFid,
      message
    })
  }
}
