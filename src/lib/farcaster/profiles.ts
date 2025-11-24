/**
 * Farcaster User Profiles
 * https://docs.farcaster.xyz/reference/hubble/httpapi/userdata
 * 
 * Manage user profiles and verifications
 */

import { hubClient, type UserData, type CastData } from './hub'

export interface UserProfile extends UserData {
  casts?: CastData[]
  followers?: number[]
  following?: number[]
  badges?: Badge[]
  socialLinks?: SocialLink[]
}

export interface Badge {
  id: string
  name: string
  description: string
  imageUrl: string
  earnedAt: number
}

export interface SocialLink {
  platform: 'twitter' | 'github' | 'website' | 'other'
  url: string
  verified: boolean
}

export interface VerificationStatus {
  address: string
  verified: boolean
  verifiedAt?: number
  chainId?: number
}

class ProfilesManager {
  private static instance: ProfilesManager
  private cache: Map<number, UserProfile> = new Map()
  private cacheExpiry: Map<number, number> = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  private constructor() {}

  static getInstance(): ProfilesManager {
    if (!ProfilesManager.instance) {
      ProfilesManager.instance = new ProfilesManager()
    }
    return ProfilesManager.instance
  }

  /**
   * Get full user profile by FID
   */
  async getProfile(fid: number, options: {
    includeCasts?: boolean
    includeFollowers?: boolean
    includeFollowing?: boolean
  } = {}): Promise<UserProfile | null> {
    // Check cache first
    const cached = this.getFromCache(fid)
    if (cached) return cached

    try {
      // Fetch user data
      const user = await hubClient.getUserByFid(fid)
      if (!user) return null

      const profile: UserProfile = { ...user }

      // Optionally fetch casts
      if (options.includeCasts) {
        profile.casts = await hubClient.getCastsByFid(fid, 25)
      }

      // Optionally fetch followers
      if (options.includeFollowers) {
        profile.followers = await hubClient.getFollowers(fid)
      }

      // Optionally fetch following
      if (options.includeFollowing) {
        profile.following = await hubClient.getFollowing(fid)
      }

      // Add to cache
      this.addToCache(fid, profile)

      return profile
    } catch (error) {
      console.error('Failed to get profile:', error)
      return null
    }
  }

  /**
   * Get profile by username
   */
  async getProfileByUsername(username: string): Promise<UserProfile | null> {
    try {
      const user = await hubClient.getUserByUsername(username)
      if (!user) return null

      return this.getProfile(user.fid)
    } catch (error) {
      console.error('Failed to get profile by username:', error)
      return null
    }
  }

  /**
   * Get user's verifications
   */
  async getVerifications(fid: number): Promise<VerificationStatus[]> {
    try {
      const addresses = await hubClient.getVerifications(fid)
      
      return addresses.map(address => ({
        address,
        verified: true,
        verifiedAt: Date.now(),
        chainId: 1 // Ethereum mainnet
      }))
    } catch (error) {
      console.error('Failed to get verifications:', error)
      return []
    }
  }

  /**
   * Check if user has verified a specific address
   */
  async hasVerifiedAddress(fid: number, address: string): Promise<boolean> {
    try {
      const verifications = await this.getVerifications(fid)
      return verifications.some(
        v => v.address.toLowerCase() === address.toLowerCase()
      )
    } catch (error) {
      return false
    }
  }

  /**
   * Get user's recent activity
   */
  async getRecentActivity(fid: number, limit: number = 10): Promise<CastData[]> {
    try {
      return await hubClient.getCastsByFid(fid, limit)
    } catch (error) {
      console.error('Failed to get recent activity:', error)
      return []
    }
  }

  /**
   * Get mutual followers
   */
  async getMutualFollowers(fid1: number, fid2: number): Promise<number[]> {
    try {
      const [followers1, followers2] = await Promise.all([
        hubClient.getFollowers(fid1),
        hubClient.getFollowers(fid2)
      ])

      return followers1.filter(f => followers2.includes(f))
    } catch (error) {
      console.error('Failed to get mutual followers:', error)
      return []
    }
  }

  /**
   * Check if user follows another user
   */
  async isFollowing(followerFid: number, targetFid: number): Promise<boolean> {
    try {
      const following = await hubClient.getFollowing(followerFid)
      return following.includes(targetFid)
    } catch (error) {
      return false
    }
  }

  /**
   * Get user stats
   */
  async getUserStats(fid: number): Promise<{
    castCount: number
    followerCount: number
    followingCount: number
    verificationCount: number
  }> {
    try {
      const [casts, followers, following, verifications] = await Promise.all([
        hubClient.getCastsByFid(fid, 1000),
        hubClient.getFollowers(fid),
        hubClient.getFollowing(fid),
        hubClient.getVerifications(fid)
      ])

      return {
        castCount: casts.length,
        followerCount: followers.length,
        followingCount: following.length,
        verificationCount: verifications.length
      }
    } catch (error) {
      console.error('Failed to get user stats:', error)
      return {
        castCount: 0,
        followerCount: 0,
        followingCount: 0,
        verificationCount: 0
      }
    }
  }

  /**
   * Search for users
   */
  async searchUsers(query: string, limit: number = 10): Promise<UserProfile[]> {
    try {
      const users = await hubClient.searchUsers(query, limit)
      return users.map(user => ({ ...user }))
    } catch (error) {
      console.error('Failed to search users:', error)
      return []
    }
  }

  /**
   * Cache management
   */
  private getFromCache(fid: number): UserProfile | null {
    const expiry = this.cacheExpiry.get(fid)
    if (expiry && expiry > Date.now()) {
      return this.cache.get(fid) || null
    }
    
    // Clear expired cache
    this.cache.delete(fid)
    this.cacheExpiry.delete(fid)
    return null
  }

  private addToCache(fid: number, profile: UserProfile): void {
    this.cache.set(fid, profile)
    this.cacheExpiry.set(fid, Date.now() + this.CACHE_DURATION)
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear()
    this.cacheExpiry.clear()
  }
}

export const profilesManager = ProfilesManager.getInstance()

/**
 * React hook for user profiles
 */
import { useState, useEffect } from 'react'

export function useProfile(fid: number) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>()

  useEffect(() => {
    loadProfile()
  }, [fid])

  const loadProfile = async () => {
    setIsLoading(true)
    setError(undefined)

    try {
      const data = await profilesManager.getProfile(fid, {
        includeCasts: true,
        includeFollowers: false,
        includeFollowing: false
      })

      if (data) {
        setProfile(data)
      } else {
        setError('Profile not found')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    profile,
    isLoading,
    error,
    refresh: loadProfile
  }
}

/**
 * React hook for verifications
 */
export function useVerifications(fid: number) {
  const [verifications, setVerifications] = useState<VerificationStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadVerifications()
  }, [fid])

  const loadVerifications = async () => {
    setIsLoading(true)
    try {
      const data = await profilesManager.getVerifications(fid)
      setVerifications(data)
    } finally {
      setIsLoading(false)
    }
  }

  const hasVerifiedAddress = (address: string) => {
    return verifications.some(
      v => v.address.toLowerCase() === address.toLowerCase()
    )
  }

  return {
    verifications,
    isLoading,
    hasVerifiedAddress,
    refresh: loadVerifications
  }
}
