'use client'

import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import CollectionPagePro from '@/components/CollectionPagePro'
import { getContractByAddress } from '@/lib/nftContracts'

export default function CollectionPage() {
  const params = useParams()
  const router = useRouter()
  const address = params?.address as string

  // Get collection info
  const collectionData = getContractByAddress(address)
  
  // Check if collection exists
  if (!collectionData) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Collection Not Found</h1>
          <button
            onClick={() => router.push('/collections')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            Back to Collections
          </button>
        </div>
      </div>
    )
  }

  // Map collection data to CollectionPagePro format
  const collection = {
    name: collectionData.name || 'Collection',
    description: collectionData.description || 'Explore this verified NFT collection on Base chain',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=400&fit=crop',
    totalSupply: collectionData.totalSupply || 10000,
    floorPrice: collectionData.floorPrice || '0.001',
    volume: '125.5', // Mock volume data
    owners: Math.floor(Math.random() * 5000) + 500, // Mock owners count
  }

  // Generate demo items based on collection
  const items = Array.from({ length: 12 }, (_, i) => ({
    id: `${address}-${i + 1}`,
    tokenId: String(i + 1),
    name: `${collection.name} #${String(i + 1).padStart(3, '0')}`,
    image: `https://images.unsplash.com/photo-${1620641788421 + i}?w=400&h=400&fit=crop`,
    price: (Math.random() * 2 + 0.5).toFixed(3),
  }))

  return (
    <>
      <Header />
      <CollectionPagePro collection={collection} items={items} />
      <Footer />
    </>
  )
}
