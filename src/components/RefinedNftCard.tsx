'use client'

import Image from 'next/image'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

interface RefinedNftCardProps {
  nft: {
    id: string
    image: string
    title: string
    description?: string
    collection: string
    chain?: string
    price?: string
    owner?: string
    mintDate?: string
  }
  onBuy?: (nft: any) => void
  onOpen?: (nft: any) => void
  pending?: boolean
}

export default function RefinedNftCard({ nft, onBuy, onOpen, pending = false }: RefinedNftCardProps) {
  const { isConnected } = useAccount()
  
  return (
    <article 
      className="rounded-2xl bg-white dark:bg-gray-900 shadow-subtle hover:shadow-pop border border-gray-200 dark:border-gray-800 overflow-hidden transition-shadow duration-150 motion-reduce:transition-none"
      role="article"
      aria-label={`NFT: ${nft.title}`}
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
        <Image 
          src={nft.image} 
          alt={nft.title} 
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover" 
          loading="lazy"
        />
        
        {/* Collection Badge */}
        <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
          {nft.collection}
        </div>
        
        {/* Chain Badge */}
        {nft.chain && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-gray-900 dark:text-white text-xs font-medium">
            {nft.chain}
          </div>
        )}

        {/* Pending Overlay */}
        {pending && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="text-white text-sm font-medium">Processing...</div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-sm truncate text-gray-900 dark:text-white">
          {nft.title}
        </h3>
        
        {nft.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
            {nft.description}
          </p>
        )}

        {/* Metadata */}
        {(nft.owner || nft.mintDate) && (
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
            {nft.owner && (
              <span className="truncate">
                Owner: {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
              </span>
            )}
            {nft.mintDate && (
              <span>· {nft.mintDate}</span>
            )}
          </div>
        )}

        {/* Price & Actions */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {nft.price ?? '—'}
            </div>
            <div className="text-xs text-gray-400">Price</div>
          </div>
          
          <div className="flex gap-2">
            {onOpen && (
              <button 
                onClick={() => onOpen(nft)} 
                className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0"
                aria-label={`View details for ${nft.title}`}
                disabled={pending}
              >
                Details
              </button>
            )}
            {onBuy && (
              isConnected ? (
                <button 
                  onClick={() => onBuy(nft)} 
                  className="px-3 py-1 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={`Buy ${nft.title}`}
                  disabled={pending}
                >
                  {pending ? '...' : 'Buy'}
                </button>
              ) : (
                <ConnectButton.Custom>
                  {({ openConnectModal }) => (
                    <button
                      onClick={openConnectModal}
                      className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0"
                      aria-label="Connect wallet to buy"
                    >
                      Connect
                    </button>
                  )}
                </ConnectButton.Custom>
              )
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
