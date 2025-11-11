'use client'

import { useState } from 'react'
import { NFTMintCardEnhanced } from './NFTMintCardEnhanced'
import { BaseSvg, OnchainkitSvg } from './svg'

export function NFTMintCardShowcase() {
  const [selectedContract, setSelectedContract] = useState(0)
  
  const mintContracts = [
    {
      contractAddress: '0xb4703a3a73aec16e764cbd210b0fde9efdab8941',
      title: 'Farcaster Genesis Collection',
      description: 'Exclusive NFTs celebrating the Farcaster ecosystem on Base',
      imageUrl: '',
      creator: '0x1234567890123456789012345678901234567890',
      mintPrice: '25.00',
      mintPriceETH: '0.025',
      maxSupply: 1000,
      totalSupply: 347,
    },
    {
      contractAddress: '0xed2f34043387783b2727ff2799a46ce3ae1a34d2',
      title: 'Base Builder Badges',
      description: 'Commemorative badges for Base ecosystem builders',
      imageUrl: '',
      creator: '0x9876543210987654321098765432109876543210',
      mintPrice: '15.00',
      mintPriceETH: '0.015',
      maxSupply: 500,
      totalSupply: 128,
    },
    {
      contractAddress: '0x877f0f3fef81c28a8c40fe060b17d254003377ad',
      title: 'OnchainKit Pioneers',
      description: 'Limited edition NFTs for OnchainKit early adopters',
      imageUrl: '',
      creator: '0x1111222233334444555566667777888899990000',
      mintPrice: '75.00',
      mintPriceETH: '0.075',
      maxSupply: 250,
      totalSupply: 89,
    },
  ]

  const currentContract = mintContracts[selectedContract]

  const handleMintSuccess = (tokenId: string) => {
    alert(`🎉 Successfully minted NFT #${tokenId}!`)
    // Update total supply (mock)
    mintContracts[selectedContract].totalSupply += 1
  }

  const handleMintError = (error: any) => {
    console.error('Mint failed:', error)
    alert('❌ Minting failed. Please try again.')
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
          <OnchainkitSvg className="w-6 h-6 md:w-8 md:h-8" />
          NFT Mint Cards
          <BaseSvg className="w-6 h-6 md:w-8 md:h-8" />
        </h2>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-6">
          Enhanced NFT minting experience with OnchainKit patterns and Base chain integration
        </p>
      </div>

      {/* Contract Selector */}
      <div className="mb-8">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Collection to Mint</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {mintContracts.map((contract, index) => (
            <button
              key={contract.contractAddress}
              onClick={() => setSelectedContract(index)}
              className={`p-4 rounded-xl border transition-all ${
                selectedContract === index
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="text-left">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{contract.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{contract.description}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    {contract.totalSupply}/{contract.maxSupply} minted
                  </span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {contract.mintPriceETH} ETH
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Mint Card Display */}
      <div className="flex justify-center mb-8">
        <NFTMintCardEnhanced
          {...currentContract}
          onMintSuccess={handleMintSuccess}
          onMintError={handleMintError}
        />
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="text-center p-4">
          <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <BaseSvg className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Base Native</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">Built for Base chain with optimized gas costs</p>
        </div>
        
        <div className="text-center p-4">
          <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
            <OnchainkitSvg className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">OnchainKit Powered</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">Using Coinbase's proven patterns</p>
        </div>
        
        <div className="text-center p-4">
          <div className="w-12 h-12 mx-auto mb-3 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <span className="text-green-600 text-xl">⚡</span>
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Instant Minting</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">Fast transactions with real-time feedback</p>
        </div>
        
        <div className="text-center p-4">
          <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
            <span className="text-orange-600 text-xl">🎨</span>
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Rich Media</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">Support for images, videos, and audio</p>
        </div>
      </div>

    </div>
  )
}