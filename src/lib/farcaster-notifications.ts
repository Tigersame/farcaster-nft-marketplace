/**
 * Farcaster Mini App Notifications Service
 * Send notifications to users who have installed your Mini App
 */

interface NotificationData {
  title: string
  body: string
  targetUrl?: string
  iconUrl?: string
}

export class FarcasterNotifications {
  private apiKey: string
  private apiUrl: string

  constructor() {
    this.apiKey = process.env.FARCASTER_API_KEY || ''
    this.apiUrl = 'https://api.farcaster.xyz/v1'
  }

  /**
   * Send notification to a specific user
   */
  async sendNotification(fid: number, notification: NotificationData) {
    if (!this.apiKey) {
      console.warn('FARCASTER_API_KEY not configured - notifications disabled')
      return false
    }

    try {
      const response = await fetch(`${this.apiUrl}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          fid,
          ...notification,
        }),
      })

      if (!response.ok) {
        throw new Error(`Notification API error: ${response.statusText}`)
      }

      console.log(`Notification sent to FID ${fid}:`, notification.title)
      return true
    } catch (error) {
      console.error('Failed to send notification:', error)
      return false
    }
  }

  /**
   * Send notification to multiple users
   */
  async sendBulkNotifications(fids: number[], notification: NotificationData) {
    const results = await Promise.allSettled(
      fids.map(fid => this.sendNotification(fid, notification))
    )

    const successful = results.filter(r => r.status === 'fulfilled').length
    console.log(`Sent ${successful}/${fids.length} notifications`)
    
    return successful
  }

  /**
   * NFT Purchase Notification
   */
  async notifyNFTPurchase(sellerFid: number, nftName: string, price: string) {
    return this.sendNotification(sellerFid, {
      title: '🎉 NFT Sold!',
      body: `Your "${nftName}" sold for ${price} ETH`,
      targetUrl: 'https://farcastmints.com/my-nfts',
      iconUrl: 'https://farcastmints.com/icon.svg',
    })
  }

  /**
   * XP Milestone Notification
   */
  async notifyXPMilestone(fid: number, xp: number, rank: number) {
    return this.sendNotification(fid, {
      title: '⭐ XP Milestone Reached!',
      body: `You've earned ${xp.toLocaleString()} XP! Rank #${rank}`,
      targetUrl: 'https://farcastmints.com/leaderboard',
      iconUrl: 'https://farcastmints.com/icon.svg',
    })
  }

  /**
   * Genesis SBT Claim Reminder
   */
  async notifyGenesisClaim(fid: number) {
    return this.sendNotification(fid, {
      title: '🏆 Claim Your Genesis SBT!',
      body: 'Get 5000 XP bonus - Limited to 20,000 claims',
      targetUrl: 'https://farcastmints.com/event',
      iconUrl: 'https://farcastmints.com/icon.svg',
    })
  }

  /**
   * NFT Offer Notification
   */
  async notifyOffer(ownerFid: number, nftName: string, offerPrice: string) {
    return this.sendNotification(ownerFid, {
      title: '💰 New Offer on Your NFT',
      body: `${offerPrice} ETH offer on "${nftName}"`,
      targetUrl: 'https://farcastmints.com/my-nfts',
      iconUrl: 'https://farcastmints.com/icon.svg',
    })
  }

  /**
   * Daily XP Bonus Available
   */
  async notifyDailyBonus(fid: number) {
    return this.sendNotification(fid, {
      title: '🎁 Daily Bonus Available!',
      body: 'Log in now to claim your 100 XP daily bonus',
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
