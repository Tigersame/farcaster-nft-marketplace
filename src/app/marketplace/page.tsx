'use client'

import { Header } from '../../components/Header'
import MarketplaceContent from '../marketplace'

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main>
        <MarketplaceContent />
      </main>
    </div>
  )
}