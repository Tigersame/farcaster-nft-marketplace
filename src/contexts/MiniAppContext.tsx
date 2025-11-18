'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

interface FarcasterUser {
  fid: number
  username?: string
  displayName?: string
  pfpUrl?: string
  bio?: string
}

interface MiniAppContextType {
  isSDKLoaded: boolean
  context?: any
  isReady: boolean
  isBaseApp: boolean
  farcasterUser?: FarcasterUser
  isFarcasterConnected: boolean
  openUrl: (url: string) => void
  close: () => void
  composeCast: (text: string, embeds?: string[]) => void
  swapToken: (params: any) => void
  sendToken: (params: any) => void
  viewToken: (address: string) => void
  viewProfile: (fid: number) => void
  viewCast: (identifier: string) => void
  openMiniApp: (appId: string) => void
  addMiniApp: (appUrl: string) => void
  triggerHaptic: (style?: 'light' | 'medium' | 'heavy') => void
  signIn: () => Promise<void>
}

const MiniAppContext = createContext<MiniAppContextType | undefined>(undefined)

export function MiniAppProvider({ children }: { children: ReactNode }) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const [context, setContext] = useState<any>()
  const [isReady, setIsReady] = useState(false)
  const [isBaseApp, setIsBaseApp] = useState(false)
  const [farcasterUser, setFarcasterUser] = useState<FarcasterUser>()
  const [isFarcasterConnected, setIsFarcasterConnected] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        // Check if we're in a Farcaster/Base environment (iframe)
        const isInIframe = typeof window !== 'undefined' && window.location !== window.parent.location
        const isFarcasterUA = typeof window !== 'undefined' && /warpcast|farcaster|base/i.test(navigator.userAgent)
        const isFarcasterEnvironment = isInIframe || isFarcasterUA

        // Always try to initialize SDK if in iframe (Base Preview needs this)
        if (isInIframe) {
          console.log('Running in iframe - initializing Farcaster SDK')
        } else if (!isFarcasterEnvironment) {
          console.log('Not in Farcaster environment - SDK features disabled')
          setIsSDKLoaded(true)
          return
        }

        // Initialize the SDK
        const ctx = await sdk.context
        setContext(ctx)
        setIsSDKLoaded(true)

        // Extract Farcaster user data from context
        if (ctx?.user) {
          const user: FarcasterUser = {
            fid: ctx.user.fid,
            username: ctx.user.username,
            displayName: ctx.user.displayName,
            pfpUrl: ctx.user.pfpUrl,
          }
          setFarcasterUser(user)
          setIsFarcasterConnected(true)
          console.log('Farcaster user connected:', user)
        }

        // Detect if running in Base App (clientFid 309857)
        if (ctx?.client?.clientFid === 309857) {
          setIsBaseApp(true)
          console.log('Running in Base App')
        }

        // Notify the app is ready
        sdk.actions.ready()
        setIsReady(true)
      } catch (error) {
        console.log('Running in browser mode - Farcaster SDK not available')
        // Even if SDK fails, mark as loaded so app still works in browser
        setIsSDKLoaded(true)
      }
    }

    load()
  }, [])

  const openUrl = (url: string) => {
    if (isSDKLoaded) {
      sdk.actions.openUrl(url)
    } else {
      window.open(url, '_blank')
    }
  }

  const close = () => {
    if (isSDKLoaded) {
      sdk.actions.close()
    }
  }

  const composeCast = (text: string, embeds?: string[]) => {
    if (isSDKLoaded && sdk.actions.composeCast) {
      sdk.actions.composeCast({ text, embeds: embeds as any })
    }
  }

  const swapToken = (params: any) => {
    if (isSDKLoaded && sdk.actions.swapToken) {
      sdk.actions.swapToken(params)
    }
  }

  const sendToken = (params: any) => {
    if (isSDKLoaded && sdk.actions.sendToken) {
      sdk.actions.sendToken(params)
    }
  }

  const viewToken = (address: string) => {
    if (isSDKLoaded && sdk.actions.viewToken) {
      sdk.actions.viewToken({ token: address } as any)
    }
  }

  const viewProfile = (fid: number) => {
    if (isSDKLoaded && sdk.actions.viewProfile) {
      sdk.actions.viewProfile({ fid })
    }
  }

  const viewCast = (identifier: string) => {
    if (isSDKLoaded && sdk.actions.viewCast) {
      sdk.actions.viewCast({ hash: identifier } as any)
    }
  }

  const openMiniApp = (appId: string) => {
    if (isSDKLoaded && (sdk.actions as any).openMiniApp) {
      (sdk.actions as any).openMiniApp({ appId })
    }
  }

  const addMiniApp = (appUrl: string) => {
    if (isSDKLoaded && sdk.actions.addMiniApp) {
      (sdk.actions.addMiniApp as any)({ appUrl })
    }
  }

  const triggerHaptic = (style: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (isSDKLoaded && (sdk.actions as any).haptic) {
      (sdk.actions as any).haptic({ style })
    }
  }

  const signIn = async () => {
    try {
      if (isSDKLoaded && context) {
        // SDK automatically provides user context on load
        // This function can be used to trigger re-authentication if needed
        console.log('Farcaster user already authenticated via SDK context')
      } else {
        console.warn('Farcaster SDK not loaded. User must open app in Farcaster.')
      }
    } catch (error) {
      console.error('Farcaster sign-in error:', error)
    }
  }

  return (
    <MiniAppContext.Provider
      value={{
        isSDKLoaded,
        context,
        isReady,
        isBaseApp,
        farcasterUser,
        isFarcasterConnected,
        openUrl,
        close,
        composeCast,
        swapToken,
        sendToken,
        viewToken,
        viewProfile,
        viewCast,
        openMiniApp,
        addMiniApp,
        triggerHaptic,
        signIn,
      }}
    >
      {children}
    </MiniAppContext.Provider>
  )
}

export function useMiniApp() {
  const context = useContext(MiniAppContext)
  if (context === undefined) {
    throw new Error('useMiniApp must be used within a MiniAppProvider')
  }
  return context
}
