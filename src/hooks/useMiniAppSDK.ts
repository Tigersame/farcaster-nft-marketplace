/**
 * Base Mini-App SDK Hook
 * https://docs.base.org/mini-apps/quickstart/build-checklist
 * 
 * React hook for accessing mini-app SDK features
 */

import { useEffect, useState } from 'react'
import { sdkManager, SDKContext, SDKCapabilities } from '@/lib/miniapp/sdk-manager'

export interface UseMiniAppSDKReturn {
  // State
  isInitialized: boolean
  isReady: boolean
  context?: SDKContext
  capabilities?: SDKCapabilities
  
  // User info
  user?: SDKContext['user']
  location?: SDKContext['location']
  client?: SDKContext['client']
  
  // Computed flags
  isAuthenticated: boolean
  isInCast: boolean
  isInChannel: boolean
  isInProfile: boolean
  isBaseApp: boolean
  isMobile: boolean
  
  // Actions
  ready: () => void
  openUrl: (url: string) => void
  close: () => void
  composeCast: (text: string, embeds?: string[]) => void
  addFrame: (url: string) => void
  swapToken: (params: any) => void
  sendToken: (params: any) => void
  haptic: (style?: 'light' | 'medium' | 'heavy') => void
}

export function useMiniAppSDK(): UseMiniAppSDKReturn {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [context, setContext] = useState<SDKContext>()
  const [capabilities, setCapabilities] = useState<SDKCapabilities>()

  useEffect(() => {
    const initSDK = async () => {
      const ctx = await sdkManager.initialize()
      if (ctx) {
        setContext(ctx)
      }
      setIsInitialized(sdkManager.isSDKInitialized())
      setCapabilities(sdkManager.getCapabilities())
    }

    initSDK()
  }, [])

  const ready = () => {
    sdkManager.ready()
    setIsReady(true)
  }

  // Computed properties
  const user = context?.user
  const location = context?.location
  const client = context?.client
  
  const isAuthenticated = !!user?.fid
  const isInCast = location?.type === 'cast'
  const isInChannel = location?.type === 'channel'
  const isInProfile = location?.type === 'profile'
  const isBaseApp = client?.clientFid === 309857 // Base App FID
  const isMobile = client?.platform === 'ios' || client?.platform === 'android'

  return {
    // State
    isInitialized,
    isReady,
    context,
    capabilities,
    
    // User info
    user,
    location,
    client,
    
    // Computed flags
    isAuthenticated,
    isInCast,
    isInChannel,
    isInProfile,
    isBaseApp,
    isMobile,
    
    // Actions
    ready,
    openUrl: sdkManager.actions.openUrl,
    close: sdkManager.actions.close,
    composeCast: sdkManager.actions.composeCast,
    addFrame: sdkManager.actions.addFrame,
    swapToken: sdkManager.actions.swapToken,
    sendToken: sdkManager.actions.sendToken,
    haptic: sdkManager.actions.haptic,
  }
}
