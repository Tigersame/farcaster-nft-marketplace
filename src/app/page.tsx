'use client'

import FrontPage from '@/components/FrontPage'
import { SafeAreaWrapper } from '@/components/SafeAreaWrapper'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <SafeAreaWrapper>
      <FrontPage />
    </SafeAreaWrapper>
  )
}