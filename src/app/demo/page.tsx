import { NFTCardShowcase } from '@/components/NFTCardShowcase'
import { BackToMainButton } from '@/components/BackToMainButton'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-blue-50 dark:bg-blue-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <BackToMainButton />
        <NFTCardShowcase />
      </div>
    </div>
  )
}