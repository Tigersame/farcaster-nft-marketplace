'use client'

import { Header } from '../../components/Header'
import MarketplaceContent from '../marketplace'
import { BackToMainButton } from '../../components/BackToMainButton'

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-blue-50 dark:bg-blue-900">
      <Header />
      <main>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <BackToMainButton />
        </div>
        <MarketplaceContent />
      </main>
    </div>
  )
}