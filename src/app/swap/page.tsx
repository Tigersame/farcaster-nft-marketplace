'use client'

import { Header } from '../../components/Header'
import { MiniappContainer } from '../../components/miniapp/MiniappContainer'
import NavigationBar from '@/components/NavigationBar'

export const dynamic = 'force-dynamic'

export default function SwapPage() {
  return (
    <div className="min-h-screen bg-blue-50 dark:bg-blue-900 flex flex-col">
      <NavigationBar title="Swap & Liquidity" />
      <Header />
      <main className="flex-1 px-4 py-6 md:px-6 lg:px-8 pt-20">
        <div className="w-full max-w-7xl mx-auto">
          <div className="py-8">
            <MiniappContainer />
          </div>
        </div>
      </main>
    </div>
  )
}
