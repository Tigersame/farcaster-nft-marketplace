'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useMiniApp } from '@/contexts/MiniAppContext'

interface SafeAreaWrapperProps {
  children: ReactNode
}

export function SafeAreaWrapper({ children }: SafeAreaWrapperProps) {
  const { context, isSDKLoaded } = useMiniApp()
  const [padding, setPadding] = useState({ top: 0, bottom: 0, left: 0, right: 0 })

  useEffect(() => {
    if (isSDKLoaded && context?.client.safeAreaInsets) {
      setPadding(context.client.safeAreaInsets)
    }
  }, [isSDKLoaded, context])

  return (
    <div
      style={{
        paddingTop: `${padding.top}px`,
        paddingBottom: `${padding.bottom}px`,
        paddingLeft: `${padding.left}px`,
        paddingRight: `${padding.right}px`,
        minHeight: '100vh',
      }}
      className="transition-all duration-300"
    >
      {children}
    </div>
  )
}
