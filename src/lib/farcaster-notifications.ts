/**
 * Farcaster Mini App Notifications Service
 * Send notifications to users who have installed your Mini App
 * 
 * Follows the Mini App specification:
 * https://miniapps.farcaster.xyz/docs/specification#notifications
 */

interface NotificationPayload {
  notificationId: string // Max 128 chars - combined with FID for idempotency
  title: string // Max 32 chars
  body: string // Max 128 chars
  targetUrl: string // Max 1024 chars - must be same domain as Mini App
  tokens: string[] // Max 100 tokens per request
}

interface NotificationResponse {
  successfulTokens: string[]
  invalidTokens: string[] // Tokens to never use again
  rateLimitedTokens: string[] // Tokens to retry later
}

export class FarcasterNotifications {
  /**
   * Send notification to users via their notification tokens
   * 
   * @param notificationUrl - URL provided by Farcaster client (from webhook)
   * @param payload - Notification data
   * @returns Response indicating success/failure per token
   */
  async sendNotification(
    notificationUrl: string,
    payload: NotificationPayload
  ): Promise<NotificationResponse | null> {
    try {
      // Validate payload
      if (payload.notificationId.length > 128) {
        throw new Error('notificationId must be max 128 characters')
      }
      if (payload.title.length > 32) {
        throw new Error('title must be max 32 characters')
      }
      if (payload.body.length > 128) {
        throw new Error('body must be max 128 characters')
      }
      if (payload.targetUrl.length > 1024) {
        throw new Error('targetUrl must be max 1024 characters')
      }
      if (payload.tokens.length > 100) {
        throw new Error('max 100 tokens per request')
      }

      const response = await fetch(notificationUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Notification API error: ${response.statusText}`)
      }

      const result: NotificationResponse = await response.json()
      
      console.log('Notification sent:', {
        successful: result.successfulTokens.length,
        invalid: result.invalidTokens.length,
        rateLimited: result.rateLimitedTokens.length
      })

      return result
    } catch (error) {
      console.error('Failed to send notification:', error)
      return null
    }
  }

  /**
   * Helper methods for common notification types
   * These generate notification payloads - you need to provide tokens from your database
   */

  /**
   * Create NFT Purchase notification payload
   */
  createNFTPurchaseNotification(nftName: string, price: string): Omit<NotificationPayload, 'tokens'> {
    return {
      notificationId: `nft-purchase-${Date.now()}`,
      title: '🎉 NFT Sold!',
      body: `Your "${nftName}" sold for ${price} ETH`.substring(0, 128),
      targetUrl: 'https://farcastmints.com/my-nfts',
    }
  }

  /**
   * Create XP Milestone notification payload
   */
  createXPMilestoneNotification(xp: number, rank: number): Omit<NotificationPayload, 'tokens'> {
    return {
      notificationId: `xp-milestone-${xp}`,
      title: '⭐ XP Milestone!',
      body: `You earned ${xp.toLocaleString()} XP! Rank #${rank}`.substring(0, 128),
      targetUrl: 'https://farcastmints.com/leaderboard',
    }
  }

  /**
   * Create Genesis SBT Claim notification payload
   */
  createGenesisClaimNotification(): Omit<NotificationPayload, 'tokens'> {
    return {
      notificationId: 'genesis-claim-reminder',
      title: '🏆 Claim Genesis SBT!',
      body: 'Get 5000 XP bonus - Limited!'.substring(0, 128),
      targetUrl: 'https://farcastmints.com/event',
    }
  }

  /**
   * Create NFT Offer notification payload
   */
  createOfferNotification(nftName: string, offerPrice: string): Omit<NotificationPayload, 'tokens'> {
    return {
      notificationId: `offer-${Date.now()}`,
      title: '💰 New Offer!',
      body: `${offerPrice} ETH on "${nftName}"`.substring(0, 128),
      targetUrl: 'https://farcastmints.com/my-nfts',
    }
  }

  /**
   * Create Daily Bonus notification payload
   */
  createDailyBonusNotification(): Omit<NotificationPayload, 'tokens'> {
    return {
      notificationId: `daily-bonus-${new Date().toISOString().split('T')[0]}`,
      title: '🎁 Daily Bonus!',
      body: 'Claim your 100 XP daily bonus now'.substring(0, 128),
      targetUrl: 'https://farcastmints.com',
    }
  }

  /**
   * Create Leaderboard Change notification payload
   */
  createLeaderboardNotification(oldRank: number, newRank: number): Omit<NotificationPayload, 'tokens'> {
    const change = oldRank - newRank
    const emoji = change > 0 ? '📈' : '📉'
    return {
      notificationId: `leaderboard-${Date.now()}`,
      title: `${emoji} Leaderboard Update`,
      body: `Rank changed: #${oldRank} → #${newRank}`.substring(0, 128),
      targetUrl: 'https://farcastmints.com/leaderboard',
    }
  }
}

// Export singleton instance
export const notifications = new FarcasterNotifications()

/**
 * Example usage:
 * 
 * // In your webhook handler, store tokens:
 * const { notificationUrl, token } = event.notificationDetails
 * await db.save({ fid, token, url: notificationUrl })
 * 
 * // Later, send notifications:
 * const user = await db.findUser(fid)
 * const notification = notifications.createNFTPurchaseNotification("Cool NFT", "2.5")
 * await notifications.sendNotification(user.notificationUrl, {
 *   ...notification,
 *   tokens: [user.token]
 * })
 * /
      targetUrl: 'https://farcastmints.com/event',
      iconUrl: 'https://farcastmints.com/icon.svg',
    })
  }

  /**
   * Leaderboard Position Update
   */
  async notifyLeaderboardChange(fid: number, newRank: number, previousRank: number) {
    const direction = newRank < previousRank ? 'up' : 'down'
    const emoji = direction === 'up' ? '📈' : '📉'
    
    return this.sendNotification(fid, {
      title: `${emoji} Leaderboard Update`,
      body: `You moved ${direction} to rank #${newRank}!`,
      targetUrl: 'https://farcastmints.com/leaderboard',
      iconUrl: 'https://farcastmints.com/icon.svg',
    })
  }
}

// Export singleton instance
export const notifications = new FarcasterNotifications()
