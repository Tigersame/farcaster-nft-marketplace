'use client'

import { Header } from '../../components/Header'
import { SwapShowcase } from '../../components/SwapShowcase'

export default function SwapPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <SwapShowcase />
      </main>
    </div>
  )
}