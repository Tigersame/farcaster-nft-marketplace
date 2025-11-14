'use client'

import { useParams, useRouter } from 'next/navigation'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useNotifications } from '@/components/NotificationSystem'

// Mock NFT data (same as marketplace)
const mockNFTs: Record<string, any> = {
  '1': {
    id: '1',
    tokenId: '1',
    name: 'Farcaster Genesis #001',
    description: 'The first NFT minted on FarcastMints marketplace. A historic piece commemorating the launch of Farcaster-native NFT trading.',
    image: 'https://i.seadn.io/gae/2hDpuTi-0AMKvoZJGd-yKWvK4tKdQr_kLIpB_qSeMau2TNGCNidAosMEvrEXFO9G6tmlFlPQplpwiqirgrIPWnCKMvElaYgI-HiVvXc?auto=format&dpr=1&w=384',
    price: '2.5',
    seller: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    owner: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    isListed: true,
    royalty: 5,
    creator: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    attributes: [
      { trait_type: 'Rarity', value: 'Legendary' },
      { trait_type: 'Collection', value: 'Genesis' },
      { trait_type: 'Edition', value: '1 of 1' },
    ]
  },
  '2': {
    id: '2',
    tokenId: '2',
    name: 'Base Builder Badge',
    description: 'Official badge for early Base network builders and contributors.',
    image: 'https://i.seadn.io/gcs/files/3d8d9b0ff645bb48d0c8f7c8db6ef2a1.png?auto=format&dpr=1&w=384',
    price: '1.0',
    seller: '0x123d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    owner: '0x123d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    isListed: true,
    royalty: 10,
    creator: '0x123d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    attributes: [
      { trait_type: 'Rarity', value: 'Rare' },
      { trait_type: 'Collection', value: 'Builders' },
      { trait_type: 'Network', value: 'Base' },
    ]
  },
  '3': {
    id: '3',
    tokenId: '3',
    name: 'Farcaster Purple #128',
    description: 'Part of the exclusive Purple collection celebrating Farcaster community members.',
    image: 'https://i.seadn.io/gcs/files/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6.png?auto=format&dpr=1&w=384',
    price: '3.2',
    seller: '0x456d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    owner: '0x456d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    isListed: true,
    royalty: 7.5,
    creator: '0x456d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    attributes: [
      { trait_type: 'Rarity', value: 'Epic' },
      { trait_type: 'Collection', value: 'Purple' },
      { trait_type: 'Number', value: '128' },
    ]
  },
}

const marketplaceABI = [
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'buyNFT',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'getListingPrice',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
]

export default function NFTDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { showNotification } = useNotifications()
  const [isLoading, setIsLoading] = useState(false)

  const nftId = params?.id as string
  const nft = mockNFTs[nftId]

  const contractAddress = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT as `0x${string}`

  const { writeContract, data: hash, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (isConfirmed) {
      showNotification('NFT purchased successfully!', 'success')
      setTimeout(() => {
        router.push('/my-nfts')
      }, 2000)
    }
  }, [isConfirmed, router, showNotification])

  if (!nft) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">NFT Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">The NFT you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push('/marketplace')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Back to Marketplace
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const handleBuyNFT = async () => {
    if (!isConnected) {
      showNotification('Please connect your wallet first', 'error')
      return
    }

    if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
      showNotification('Marketplace contract not configured', 'error')
      return
    }

    if (address?.toLowerCase() === nft.owner?.toLowerCase()) {
      showNotification('You already own this NFT', 'error')
      return
    }

    try {
      setIsLoading(true)
      writeContract({
        address: contractAddress,
        abi: marketplaceABI,
        functionName: 'buyNFT',
        args: [BigInt(nft.tokenId)],
        value: parseEther(nft.price),
      })
    } catch (error: any) {
      console.error('Purchase error:', error)
      showNotification(error?.message || 'Failed to purchase NFT', 'error')
      setIsLoading(false)
    }
  }

  const isOwner = address?.toLowerCase() === nft.owner?.toLowerCase()
  const buttonLoading = isPending || isConfirming || isLoading

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm">
          <button 
            onClick={() => router.push('/marketplace')}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            Marketplace
          </button>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900 dark:text-white font-medium">{nft.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Attributes */}
            {nft.attributes && nft.attributes.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attributes</h3>
                <div className="grid grid-cols-2 gap-3">
                  {nft.attributes.map((attr: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center"
                    >
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">
                        {attr.trait_type}
                      </div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {attr.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Title & Description */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {nft.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {nft.description}
              </p>
            </div>

            {/* Owner Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex-1">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Owned by</div>
                <div className="text-sm font-mono text-gray-900 dark:text-white">
                  {nft.owner?.slice(0, 6)}...{nft.owner?.slice(-4)}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Creator</div>
                <div className="text-sm font-mono text-gray-900 dark:text-white">
                  {nft.creator?.slice(0, 6)}...{nft.creator?.slice(-4)}
                </div>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Current Price</div>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {nft.price}
                </span>
                <span className="text-xl text-gray-500 dark:text-gray-400">ETH</span>
              </div>

              {/* Buy Button */}
              {nft.isListed && (
                <button
                  onClick={handleBuyNFT}
                  disabled={!isConnected || isOwner || buttonLoading}
                  className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-lg"
                >
                  {!isConnected
                    ? 'Connect Wallet to Buy'
                    : isOwner
                    ? 'You Own This NFT'
                    : buttonLoading
                    ? 'Processing...'
                    : `Buy for ${nft.price} ETH`}
                </button>
              )}

              {!nft.isListed && (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  Not currently listed for sale
                </div>
              )}
            </div>

            {/* Additional Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Token ID</span>
                <span className="font-mono text-gray-900 dark:text-white">{nft.tokenId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Royalty</span>
                <span className="text-gray-900 dark:text-white">{nft.royalty}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Blockchain</span>
                <span className="text-gray-900 dark:text-white">
                  {process.env.NEXT_PUBLIC_NETWORK === 'baseSepolia' ? 'Base Sepolia' : 'Base'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Contract</span>
                <span className="font-mono text-sm text-gray-900 dark:text-white">
                  {contractAddress?.slice(0, 6)}...{contractAddress?.slice(-4)}
                </span>
              </div>
            </div>

            {/* Transaction Status */}
            {hash && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  {isConfirming && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  )}
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {isConfirming ? 'Confirming transaction...' : 'Transaction submitted!'}
                  </span>
                </div>
                <a
                  href={`https://${process.env.NEXT_PUBLIC_NETWORK === 'baseSepolia' ? 'sepolia.' : ''}basescan.org/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View on BaseScan →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
