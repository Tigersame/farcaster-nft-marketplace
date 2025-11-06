'use client'

import { NotificationProvider } from '@/components/NotificationSystem'
import { ThemeProvider } from '@/contexts/ThemeContext'
import MarketplaceContent from './marketplace'

export default function Home() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <MarketplaceContent />
      </NotificationProvider>
    </ThemeProvider>
  )
}