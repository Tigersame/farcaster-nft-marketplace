'use client'

import { useAccount } from 'wagmi'
import { useActiveListings } from '@/lib/contracts/hooks'
import { NFTCard } from '@/components/NFTCard'
import { LoadingSpinner } from '@/components/LoadingSpinner'

export default function MyNFTsPage() {
  const { address, isConnected } = useAccount()
  const { data: listings, isLoading } = useActiveListings()

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              My NFTs
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Connect your wallet to view your NFT collection
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium">
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            My NFTs
          </h1>
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  // Filter NFTs owned by connected wallet
  const myNFTs = Array.isArray(listings) 
    ? listings.filter((listing: any) => 
        listing.seller.toLowerCase() === address?.toLowerCase()
      )
    : []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My NFTs
          </h1>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
        </div>

        {myNFTs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No NFTs Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You don't have any NFTs listed for sale yet.
            </p>
            <a
              href="/"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium inline-block"
            >
              Create Your First NFT
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myNFTs.map((nft: any) => (
              <NFTCard
                key={nft.tokenId}
                tokenId={nft.tokenId.toString()}
                name={`Farcaster NFT #${nft.tokenId}`}
                description="A unique NFT from the Farcaster marketplace"
                ethPrice={nft.price}
                price={nft.price}
                image="/api/placeholder/400/400"
                seller={nft.seller}
                listedAt={new Date(nft.listedAt * 1000).toISOString()}
                owner={nft.seller}
                onBuy={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}