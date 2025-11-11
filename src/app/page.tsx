'use client'

import MarketplaceContent from './marketplace'
import { SafeAreaWrapper } from '@/components/SafeAreaWrapper'

export default function Home() {
  return (
    <SafeAreaWrapper>
      <MarketplaceContent />
    </SafeAreaWrapper>
  )
}