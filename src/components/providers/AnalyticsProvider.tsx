'use client'

import { useEffect } from 'react'
import { setupAnalyticsListeners } from '@/lib/analytics-enhanced'

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize analytics listeners
    setupAnalyticsListeners()
    
    console.log('✅ Analytics provider initialized')
  }, [])

  return <>{children}</>
}
