'use client'

import MarketplaceContent from '../marketplace'

export const dynamic = 'force-dynamic'

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-blue-50 dark:bg-blue-900">
      <main>
        <MarketplaceContent />
      </main>
    </div>
  )
}