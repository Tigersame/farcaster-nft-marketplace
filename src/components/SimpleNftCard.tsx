'use client'

import { useState } from "react"
import Image from "next/image"
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

interface SimpleNftCardProps {
  nft: {
    id: string
    image: string
    title: string
    collection: string
    chain?: string
    price?: string
    tokenId?: string
    owner?: string
    likes?: number
  }
  onBuy?: () => void
  onList?: () => void
}

export default function SimpleNftCard({ nft, onBuy, onList }: SimpleNftCardProps) {
  const [hover, setHover] = useState(false)
  const { isConnected } = useAccount()
  
  return (
    <article
      className="group rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden relative bg-white dark:bg-gray-900 transition-transform hover:scale-[1.02] hover:shadow-lg"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      tabIndex={0}
      role="article"
      aria-label={`NFT: ${nft.title}`}
    >
      <div className="relative w-full aspect-square bg-gray-50 dark:bg-gray-800">
        <Image
          src={nft.image}
          alt={nft.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover w-full h-full"
        />
        {nft.chain && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
              {nft.chain}
            </span>
          </div>
        )}
        {nft.likes && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-1 rounded-lg bg-white/80 backdrop-blur-sm text-gray-700 text-xs font-medium flex items-center gap-1">
              <svg className="w-3 h-3 fill-red-500" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
              {nft.likes}
            </span>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-sm truncate text-gray-900 dark:text-white">{nft.title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{nft.collection}</p>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{nft.price ?? "—"}</div>
            <div className="text-xs text-gray-400">Price</div>
          </div>
          <div className="flex gap-2">
            {onBuy && (
              isConnected ? (
                <button 
                  onClick={onBuy}
                  className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label={`Buy ${nft.title}`}
                >
                  Buy
                </button>
              ) : (
                <ConnectButton.Custom>
                  {({ openConnectModal }) => (
                    <button
                      onClick={openConnectModal}
                      className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      aria-label="Connect wallet to buy"
                    >
                      Connect
                    </button>
                  )}
                </ConnectButton.Custom>
              )
            )}
            {onList && (
              <button 
                onClick={onList}
                className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label={`List ${nft.title}`}
              >
                List
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hover/Focus preview */}
      {hover && (
        <div 
          className="pointer-events-none absolute z-40 -right-2 top-0 -translate-y-2 w-72 p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl"
          role="tooltip"
        >
          <div className="relative w-full h-36 rounded-md overflow-hidden mb-2">
            <Image
              src={nft.image}
              alt=""
              fill
              className="object-cover"
            />
          </div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">{nft.title}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {nft.collection} {nft.tokenId && `· #${nft.tokenId}`}
          </div>
          {nft.owner && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Owner: {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
            </div>
          )}
          <div className="mt-2 flex justify-between items-center">
            <div className="text-sm font-medium text-gray-900 dark:text-white">{nft.price ?? "Not for sale"}</div>
            <button className="text-sm px-2 py-1 rounded-md border border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
              Quick buy
            </button>
          </div>
        </div>
      )}
    </article>
  )
}
