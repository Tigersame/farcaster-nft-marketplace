'use client'

import { useState } from 'react'
import { EnhancedNFTCard } from './EnhancedNFTCard'
import { BaseSvg, OnchainkitSvg } from './svg'

export function NFTCardShowcase() {
  const [showEnhanced, setShowEnhanced] = useState(false)
  
  const demoNFT = {
    tokenId: '1',
    contractAddress: '0xb4703a3a73aec16e764cbd210b0fde9efdab8941',
    name: 'Farcaster Genesis #001',
    description: 'The first NFT from the Farcaster Genesis collection, featuring unique artwork from the Base ecosystem.',
    image: '/nft-placeholder.jpg',
    price: '2,450.00',
    ethPrice: '2.5',
    seller: '0x1234567890123456789012345678901234567890',
    owner: '0x0987654321098765432109876543210987654321',
    listedAt: '2024-11-01T10:00:00Z',
    onBuy: () => alert('🎉 Demo purchase successful!'),
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
          <OnchainkitSvg className="w-8 h-8" />
          Enhanced NFT Cards
          <BaseSvg className="w-8 h-8" />
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Experience NFT cards powered by OnchainKit template patterns with Base chain integration
        </p>
        
        {/* Toggle Controls */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => setShowEnhanced(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              !showEnhanced 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Standard View
          </button>
          <button
            onClick={() => setShowEnhanced(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              showEnhanced 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <BaseSvg className="w-4 h-4" />
            Enhanced with Base Info
          </button>
        </div>
      </div>

      {/* Card Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Grid View */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Grid View</h3>
          <EnhancedNFTCard
            {...demoNFT}
            viewMode="grid"
            showOnchainInfo={showEnhanced}
          />
        </div>

        {/* List View */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">List View</h3>
          <EnhancedNFTCard
            {...demoNFT}
            viewMode="list"
            showOnchainInfo={showEnhanced}
          />
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Enhanced Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <BaseSvg className="w-5 h-5 mt-1 text-blue-600" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Base Chain Integration</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Visual indicators for Base network NFTs</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 mt-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Basename Support</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Automatic address resolution to human-readable names</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <OnchainkitSvg className="w-5 h-5 mt-1" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">OnchainKit Patterns</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Following Coinbase's best practices for web3 UX</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}