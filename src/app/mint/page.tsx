import { NFTMintCardShowcase } from '@/components/NFTMintCardShowcase'
import { BackToMainButton } from '@/components/BackToMainButton'

export default function MintPage() {
  return (
    <div className="min-h-screen bg-blue-50 dark:bg-blue-900 px-4 py-6 md:px-6 lg:px-8">
      <div className="w-full max-w-6xl mx-auto">
        <BackToMainButton />
        <NFTMintCardShowcase />
      </div>
    </div>
  )
}