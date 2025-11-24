/**
 * Farcaster Channels Integration
 * https://docs.farcaster.xyz/reference/warpcast/channels
 * 
 * Interact with Farcaster channels
 */

import { hubClient, type ChannelData, type CastData } from './hub'

export interface Channel extends ChannelData {
  isFollowing?: boolean
  isMember?: boolean
}

export interface ChannelActivity {
  castCount: number
  activeUsers: number
  topCasters: Array<{
    fid: number
    username: string
    castCount: number
  }>
  recentCasts: CastData[]
}

class ChannelsManager {
  private static instance: ChannelsManager
  private followedChannels: Map<string, Channel> = new Map()

  private constructor() {}

  static getInstance(): ChannelsManager {
    if (!ChannelsManager.instance) {
      ChannelsManager.instance = new ChannelsManager()
    }
    return ChannelsManager.instance
  }

  /**
   * Get channel by ID
   */
  async getChannel(channelId: string): Promise<Channel | null> {
    try {
      const channel = await hubClient.getChannel(channelId)
      if (!channel) return null

      return {
        ...channel,
        isFollowing: this.followedChannels.has(channelId),
        isMember: this.followedChannels.has(channelId)
      }
    } catch (error) {
      console.error('Failed to get channel:', error)
      return null
    }
  }

  /**
   * Get casts in a channel
   */
  async getChannelCasts(channelId: string, limit: number = 25): Promise<CastData[]> {
    try {
      return await hubClient.getCastsByChannel(channelId, limit)
    } catch (error) {
      console.error('Failed to get channel casts:', error)
      return []
    }
  }

  /**
   * Get channel activity stats
   */
  async getChannelActivity(channelId: string): Promise<ChannelActivity | null> {
    try {
      const casts = await this.getChannelCasts(channelId, 100)
      
      // Count unique users
      const userSet = new Set(casts.map(c => c.author.fid))
      
      // Count casts per user
      const userCastCounts = new Map<number, number>()
      casts.forEach(cast => {
        const count = userCastCounts.get(cast.author.fid) || 0
        userCastCounts.set(cast.author.fid, count + 1)
      })

      // Get top casters
      const topCasters = Array.from(userCastCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([fid, castCount]) => {
          const cast = casts.find(c => c.author.fid === fid)
          return {
            fid,
            username: cast?.author.username || `fid:${fid}`,
            castCount
          }
        })

      return {
        castCount: casts.length,
        activeUsers: userSet.size,
        topCasters,
        recentCasts: casts.slice(0, 10)
      }
    } catch (error) {
      console.error('Failed to get channel activity:', error)
      return null
    }
  }

  /**
   * Follow a channel (local state)
   */
  followChannel(channel: Channel): void {
    this.followedChannels.set(channel.id, channel)
    
    // In production, sync with backend
    this.syncFollowedChannels()
  }

  /**
   * Unfollow a channel
   */
  unfollowChannel(channelId: string): void {
    this.followedChannels.delete(channelId)
    
    // In production, sync with backend
    this.syncFollowedChannels()
  }

  /**
   * Get followed channels
   */
  getFollowedChannels(): Channel[] {
    return Array.from(this.followedChannels.values())
  }

  /**
   * Check if following a channel
   */
  isFollowingChannel(channelId: string): boolean {
    return this.followedChannels.has(channelId)
  }

  /**
   * Sync followed channels (implement with your backend)
   */
  private async syncFollowedChannels(): Promise<void> {
    try {
      // Store in localStorage for now
      if (typeof window !== 'undefined') {
        const channels = Array.from(this.followedChannels.entries())
        localStorage.setItem('followed_channels', JSON.stringify(channels))
      }
    } catch (error) {
      console.error('Failed to sync channels:', error)
    }
  }

  /**
   * Load followed channels from storage
   */
  async loadFollowedChannels(): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('followed_channels')
        if (stored) {
          const channels = JSON.parse(stored) as Array<[string, Channel]>
          this.followedChannels = new Map(channels)
        }
      }
    } catch (error) {
      console.error('Failed to load channels:', error)
    }
  }
}

export const channelsManager = ChannelsManager.getInstance()

/**
 * Recommended CurSwap channels
 */
export const CURSWAP_CHANNELS = {
  base: {
    id: 'base',
    url: 'chain://eip155:8453/erc721:0x...',
    name: 'Base',
    description: 'Official Base channel',
    tags: ['base', 'ethereum', 'l2']
  },
  defi: {
    id: 'defi',
    url: 'chain://eip155:1/erc721:0x...',
    name: 'DeFi',
    description: 'Decentralized Finance discussions',
    tags: ['defi', 'trading', 'yield']
  },
  curswap: {
    id: 'curswap',
    url: 'https://curswap.com',
    name: 'CurSwap',
    description: 'Official CurSwap community channel',
    tags: ['curswap', 'swap', 'pools']
  }
}

/**
 * React hook for channels
 */
import { useState, useEffect } from 'react'

export function useChannel(channelId: string) {
  const [channel, setChannel] = useState<Channel | null>(null)
  const [activity, setActivity] = useState<ChannelActivity | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    loadChannel()
  }, [channelId])

  const loadChannel = async () => {
    setIsLoading(true)
    try {
      const channelData = await channelsManager.getChannel(channelId)
      const activityData = await channelsManager.getChannelActivity(channelId)
      
      setChannel(channelData)
      setActivity(activityData)
      setIsFollowing(channelsManager.isFollowingChannel(channelId))
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFollow = () => {
    if (!channel) return

    if (isFollowing) {
      channelsManager.unfollowChannel(channelId)
      setIsFollowing(false)
    } else {
      channelsManager.followChannel(channel)
      setIsFollowing(true)
    }
  }

  return {
    channel,
    activity,
    isLoading,
    isFollowing,
    toggleFollow,
    refresh: loadChannel
  }
}
