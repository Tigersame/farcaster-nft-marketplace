'use client'

import { Header } from '../../../components/Header'
import { SwapSettingsShowcase } from '../../../components/SwapSettingsShowcase'

export default function SwapSettingsPage() {
  return (
    <div className="min-h-screen bg-blue-50 dark:bg-blue-900 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-6 md:px-6 lg:px-8">
        <div className="w-full max-w-5xl h-full flex items-center justify-center">
          <SwapSettingsShowcase />
        </div>
      </main>
    </div>
  )
}