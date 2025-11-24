/**
 * Farcaster Notifications
 * https://docs.farcaster.xyz/reference/warpcast/notifications
 * 
 * Push notifications for Farcaster events
 */

export interface Notification {
  id: string
  type: 'cast' | 'mention' | 'reply' | 'like' | 'recast' | 'follow' | 'custom'
  title: string
  body: string
  actor: {
    fid: number
    username?: string
    displayName?: string
    pfpUrl?: string
  }
  target?: {
    castHash?: string
    url?: string
  }
  timestamp: number
  read: boolean
}

export interface NotificationPreferences {
  casts: boolean
  mentions: boolean
  replies: boolean
  likes: boolean
  recasts: boolean
  follows: boolean
  custom: boolean
}

class NotificationsManager {
  private static instance: NotificationsManager
  private notifications: Notification[] = []
  private preferences: NotificationPreferences = {
    casts: true,
    mentions: true,
    replies: true,
    likes: true,
    recasts: true,
    follows: true,
    custom: true
  }
  private listeners: Array<(notification: Notification) => void> = []

  private constructor() {
    this.loadPreferences()
    this.loadNotifications()
  }

  static getInstance(): NotificationsManager {
    if (!NotificationsManager.instance) {
      NotificationsManager.instance = new NotificationsManager()
    }
    return NotificationsManager.instance
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Browser does not support notifications')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }

    return false
  }

  /**
   * Show browser notification
   */
  async showNotification(notification: Notification): Promise<void> {
    if (!this.shouldShowNotification(notification.type)) {
      return
    }

    // Request permission if not granted
    const hasPermission = await this.requestPermission()
    if (!hasPermission) {
      console.warn('Notification permission not granted')
      return
    }

    try {
      const notif = new Notification(notification.title, {
        body: notification.body,
        icon: notification.actor.pfpUrl || '/icon.svg',
        badge: '/icon.svg',
        tag: notification.id,
        requireInteraction: false,
        silent: false
      })

      notif.onclick = () => {
        window.focus()
        if (notification.target?.url) {
          window.location.href = notification.target.url
        }
        notif.close()
      }
    } catch (error) {
      console.error('Failed to show notification:', error)
    }
  }

  /**
   * Add notification
   */
  addNotification(notification: Notification): void {
    this.notifications.unshift(notification)
    
    // Limit to last 100 notifications
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100)
    }

    // Save to storage
    this.saveNotifications()

    // Notify listeners
    this.listeners.forEach(listener => listener(notification))

    // Show browser notification
    this.showNotification(notification)
  }

  /**
   * Get all notifications
   */
  getNotifications(options: {
    unreadOnly?: boolean
    type?: Notification['type']
    limit?: number
  } = {}): Notification[] {
    let filtered = [...this.notifications]

    if (options.unreadOnly) {
      filtered = filtered.filter(n => !n.read)
    }

    if (options.type) {
      filtered = filtered.filter(n => n.type === options.type)
    }

    if (options.limit) {
      filtered = filtered.slice(0, options.limit)
    }

    return filtered
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
      this.saveNotifications()
    }
  }

  /**
   * Mark all as read
   */
  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true)
    this.saveNotifications()
  }

  /**
   * Get unread count
   */
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    this.notifications = []
    this.saveNotifications()
  }

  /**
   * Update preferences
   */
  updatePreferences(preferences: Partial<NotificationPreferences>): void {
    this.preferences = { ...this.preferences, ...preferences }
    this.savePreferences()
  }

  /**
   * Get preferences
   */
  getPreferences(): NotificationPreferences {
    return { ...this.preferences }
  }

  /**
   * Subscribe to notifications
   */
  subscribe(listener: (notification: Notification) => void): () => void {
    this.listeners.push(listener)
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  /**
   * Check if notification type should be shown
   */
  private shouldShowNotification(type: Notification['type']): boolean {
    return this.preferences[type] ?? true
  }

  /**
   * Save notifications to storage
   */
  private saveNotifications(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('farcaster_notifications', JSON.stringify(this.notifications))
      } catch (error) {
        console.error('Failed to save notifications:', error)
      }
    }
  }

  /**
   * Load notifications from storage
   */
  private loadNotifications(): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('farcaster_notifications')
        if (stored) {
          this.notifications = JSON.parse(stored)
        }
      } catch (error) {
        console.error('Failed to load notifications:', error)
      }
    }
  }

  /**
   * Save preferences to storage
   */
  private savePreferences(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('notification_preferences', JSON.stringify(this.preferences))
      } catch (error) {
        console.error('Failed to save preferences:', error)
      }
    }
  }

  /**
   * Load preferences from storage
   */
  private loadPreferences(): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('notification_preferences')
        if (stored) {
          this.preferences = JSON.parse(stored)
        }
      } catch (error) {
        console.error('Failed to load preferences:', error)
      }
    }
  }
}

export const notificationsManager = NotificationsManager.getInstance()

/**
 * Helper functions for creating notifications
 */
export const notificationHelpers = {
  /**
   * Create swap notification
   */
  swapCompleted(fromToken: string, toToken: string, amount: string, fid: number): Notification {
    return {
      id: `swap-${Date.now()}`,
      type: 'custom',
      title: 'Swap Completed! 🎉',
      body: `Successfully swapped ${amount} ${fromToken} to ${toToken}`,
      actor: {
        fid,
        username: 'CurSwap',
        displayName: 'CurSwap',
        pfpUrl: '/icon.svg'
      },
      target: {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/defi`
      },
      timestamp: Date.now(),
      read: false
    }
  },

  /**
   * Create pool notification
   */
  poolAdded(poolName: string, apr: string, fid: number): Notification {
    return {
      id: `pool-${Date.now()}`,
      type: 'custom',
      title: 'Liquidity Added! 💧',
      body: `Added liquidity to ${poolName} pool (${apr} APR)`,
      actor: {
        fid,
        username: 'CurSwap',
        displayName: 'CurSwap',
        pfpUrl: '/icon.svg'
      },
      target: {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/defi?tab=pools`
      },
      timestamp: Date.now(),
      read: false
    }
  },

  /**
   * Create mention notification
   */
  mentioned(mentionerFid: number, mentionerUsername: string, castHash: string): Notification {
    return {
      id: `mention-${castHash}`,
      type: 'mention',
      title: `${mentionerUsername} mentioned you`,
      body: 'Check out the cast',
      actor: {
        fid: mentionerFid,
        username: mentionerUsername
      },
      target: {
        castHash,
        url: `https://warpcast.com/~/conversations/${castHash}`
      },
      timestamp: Date.now(),
      read: false
    }
  }
}

/**
 * React hook for notifications
 */
import { useState, useEffect } from 'react'

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [preferences, setPreferences] = useState<NotificationPreferences>(
    notificationsManager.getPreferences()
  )

  useEffect(() => {
    // Load initial notifications
    setNotifications(notificationsManager.getNotifications())
    setUnreadCount(notificationsManager.getUnreadCount())

    // Subscribe to new notifications
    const unsubscribe = notificationsManager.subscribe((notification) => {
      setNotifications(notificationsManager.getNotifications())
      setUnreadCount(notificationsManager.getUnreadCount())
    })

    return unsubscribe
  }, [])

  const markAsRead = (id: string) => {
    notificationsManager.markAsRead(id)
    setNotifications(notificationsManager.getNotifications())
    setUnreadCount(notificationsManager.getUnreadCount())
  }

  const markAllAsRead = () => {
    notificationsManager.markAllAsRead()
    setNotifications(notificationsManager.getNotifications())
    setUnreadCount(0)
  }

  const clearAll = () => {
    notificationsManager.clearAll()
    setNotifications([])
    setUnreadCount(0)
  }

  const updatePreferences = (prefs: Partial<NotificationPreferences>) => {
    notificationsManager.updatePreferences(prefs)
    setPreferences(notificationsManager.getPreferences())
  }

  return {
    notifications,
    unreadCount,
    preferences,
    markAsRead,
    markAllAsRead,
    clearAll,
    updatePreferences
  }
}
