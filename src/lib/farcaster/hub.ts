/**
 * Farcaster Hub Integration
 * https://docs.farcaster.xyz/reference/hubble/httpapi
 * 
 * Implements Farcaster Hub HTTP API for fetching on-chain data
 */

const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL || 'https://hub.pinata.cloud'
const HUB_API_KEY = process.env.NEXT_PUBLIC_HUB_API_KEY

export interface CastData {
  hash: string
  threadHash: string
  parentHash?: string
  parentUrl?: string
  rootParentUrl?: string
  parentFid?: number
  author: {
    fid: number
    username?: string
    displayName?: string
    pfp?: {
      url: string
    }
  }
  text: string
  timestamp: number
  embeds: Array<{
    url?: string
    castId?: {
      fid: number
      hash: string
    }
  }>
  mentions: number[]
  mentionsPositions: number[]
  reactions: {
    likes: number
    recasts: number
    replies: number
  }
}

export interface UserData {
  fid: number
  username: string
  displayName: string
  pfp: {
    url: string
  }
  profile: {
    bio: {
      text: string
      mentions: string[]
    }
  }
  followerCount: number
  followingCount: number
  verifications: string[]
  activeOnFcNetwork: boolean
}

export interface ChannelData {
  id: string
  url: string
  name: string
  description: string
  imageUrl: string
  leadFid: number
  createdAt: number
  followerCount: number
  memberCount: number
}

class FarcasterHubClient {
  private static instance: FarcasterHubClient
  private baseUrl: string
  private apiKey?: string

  private constructor() {
    this.baseUrl = HUB_URL
    this.apiKey = HUB_API_KEY
  }

  static getInstance(): FarcasterHubClient {
    if (!FarcasterHubClient.instance) {
      FarcasterHubClient.instance = new FarcasterHubClient()
    }
    return FarcasterHubClient.instance
  }

  /**
   * Fetch user by FID
   */
  async getUserByFid(fid: number): Promise<UserData | null> {
    try {
      const response = await this.fetch(`/v1/userDataByFid?fid=${fid}`)
      return this.parseUserData(response)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      return null
    }
  }

  /**
   * Fetch user by username
   */
  async getUserByUsername(username: string): Promise<UserData | null> {
    try {
      const response = await this.fetch(`/v1/userByUsername?username=${username}`)
      return this.parseUserData(response)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      return null
    }
  }

  /**
   * Fetch cast by hash
   */
  async getCastByHash(hash: string): Promise<CastData | null> {
    try {
      const response = await this.fetch(`/v1/castById?hash=${hash}`)
      return this.parseCastData(response)
    } catch (error) {
      console.error('Failed to fetch cast:', error)
      return null
    }
  }

  /**
   * Fetch casts by user FID
   */
  async getCastsByFid(fid: number, limit: number = 25): Promise<CastData[]> {
    try {
      const response = await this.fetch(`/v1/castsByFid?fid=${fid}&limit=${limit}`)
      return response.messages?.map((m: any) => this.parseCastData(m)) || []
    } catch (error) {
      console.error('Failed to fetch casts:', error)
      return []
    }
  }

  /**
   * Fetch casts in channel
   */
  async getCastsByChannel(channelId: string, limit: number = 25): Promise<CastData[]> {
    try {
      const response = await this.fetch(`/v1/castsByParent?url=chain://${channelId}&limit=${limit}`)
      return response.messages?.map((m: any) => this.parseCastData(m)) || []
    } catch (error) {
      console.error('Failed to fetch channel casts:', error)
      return []
    }
  }

  /**
   * Fetch user's followers
   */
  async getFollowers(fid: number, limit: number = 100): Promise<number[]> {
    try {
      const response = await this.fetch(`/v1/linksByFid?fid=${fid}&link_type=follow&limit=${limit}`)
      return response.messages?.map((m: any) => m.data.linkBody.targetFid) || []
    } catch (error) {
      console.error('Failed to fetch followers:', error)
      return []
    }
  }

  /**
   * Fetch user's following
   */
  async getFollowing(fid: number, limit: number = 100): Promise<number[]> {
    try {
      const response = await this.fetch(`/v1/linksByTargetFid?target_fid=${fid}&link_type=follow&limit=${limit}`)
      return response.messages?.map((m: any) => m.data.fid) || []
    } catch (error) {
      console.error('Failed to fetch following:', error)
      return []
    }
  }

  /**
   * Fetch user's verifications (connected addresses)
   */
  async getVerifications(fid: number): Promise<string[]> {
    try {
      const response = await this.fetch(`/v1/verificationsByFid?fid=${fid}`)
      return response.messages?.map((m: any) => m.data.verificationAddEthAddressBody.address) || []
    } catch (error) {
      console.error('Failed to fetch verifications:', error)
      return []
    }
  }

  /**
   * Fetch channel data
   */
  async getChannel(channelId: string): Promise<ChannelData | null> {
    try {
      // Note: Channel API might be different depending on hub implementation
      const response = await this.fetch(`/v1/channel?id=${channelId}`)
      return this.parseChannelData(response)
    } catch (error) {
      console.error('Failed to fetch channel:', error)
      return null
    }
  }

  /**
   * Search users
   */
  async searchUsers(query: string, limit: number = 10): Promise<UserData[]> {
    try {
      const response = await this.fetch(`/v1/userSearch?q=${encodeURIComponent(query)}&limit=${limit}`)
      return response.users?.map((u: any) => this.parseUserData(u)) || []
    } catch (error) {
      console.error('Failed to search users:', error)
      return []
    }
  }

  /**
   * Get cast reactions
   */
  async getCastReactions(hash: string): Promise<{
    likes: number
    recasts: number
    replies: number
  }> {
    try {
      const response = await this.fetch(`/v1/reactionsByTarget?target_hash=${hash}`)
      
      const likes = response.messages?.filter((m: any) => 
        m.data.reactionBody.type === 1 // LIKE
      ).length || 0
      
      const recasts = response.messages?.filter((m: any) => 
        m.data.reactionBody.type === 2 // RECAST
      ).length || 0

      return { likes, recasts, replies: 0 }
    } catch (error) {
      return { likes: 0, recasts: 0, replies: 0 }
    }
  }

  /**
   * Generic fetch method
   */
  private async fetch(endpoint: string): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    const response = await fetch(url, { headers })

    if (!response.ok) {
      throw new Error(`Hub API error: ${response.status}`)
    }

    return response.json()
  }

  /**
   * Parse user data from Hub response
   */
  private parseUserData(data: any): UserData {
    return {
      fid: data.fid,
      username: data.username || `fid:${data.fid}`,
      displayName: data.displayName || data.username || `User ${data.fid}`,
      pfp: {
        url: data.pfp?.url || ''
      },
      profile: {
        bio: {
          text: data.profile?.bio?.text || '',
          mentions: data.profile?.bio?.mentions || []
        }
      },
      followerCount: data.followerCount || 0,
      followingCount: data.followingCount || 0,
      verifications: data.verifications || [],
      activeOnFcNetwork: data.activeOnFcNetwork || false
    }
  }

  /**
   * Parse cast data from Hub response
   */
  private parseCastData(data: any): CastData {
    const castData = data.data?.castAddBody || data

    return {
      hash: data.hash || '',
      threadHash: castData.parentHash || '',
      parentHash: castData.parentHash,
      parentUrl: castData.parentUrl,
      rootParentUrl: castData.parentUrl,
      parentFid: castData.parentFid,
      author: {
        fid: data.data?.fid || 0,
        username: data.author?.username,
        displayName: data.author?.displayName,
        pfp: data.author?.pfp
      },
      text: castData.text || '',
      timestamp: data.data?.timestamp || Date.now(),
      embeds: castData.embeds || [],
      mentions: castData.mentions || [],
      mentionsPositions: castData.mentionsPositions || [],
      reactions: {
        likes: 0,
        recasts: 0,
        replies: 0
      }
    }
  }

  /**
   * Parse channel data from Hub response
   */
  private parseChannelData(data: any): ChannelData {
    return {
      id: data.id,
      url: data.url,
      name: data.name,
      description: data.description || '',
      imageUrl: data.imageUrl || '',
      leadFid: data.leadFid || 0,
      createdAt: data.createdAt || Date.now(),
      followerCount: data.followerCount || 0,
      memberCount: data.memberCount || 0
    }
  }
}

export const hubClient = FarcasterHubClient.getInstance()
