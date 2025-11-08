'use client'

import { Header } from '../../../components/Header'
import { SwapSettingsShowcase } from '../../../components/SwapSettingsShowcase'

export default function SwapSettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <SwapSettingsShowcase />
      </main>
    </div>
  )
}