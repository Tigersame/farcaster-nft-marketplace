'use client'

import NFTCreator from '@/components/NFTCreator'
import { Header } from '@/components/Header'

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Create Your NFT
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Turn your digital art into a unique NFT on the Base network
            </p>
          </div>
          
          <NFTCreator />
        </div>
      </main>
    </div>
  )
}