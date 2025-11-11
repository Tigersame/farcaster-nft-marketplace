'use client'

import { useState } from 'react'
import { SwapEnhanced } from './SwapEnhanced'
import { BaseSvg, OnchainkitSvg } from './svg'

export function SwapShowcase() {
  const [swapMode, setSwapMode] = useState<'default' | 'sponsored' | 'custom' | 'settings'>('default')
  
  // Token definitions for different swap scenarios
  const ETHToken = {
    address: '',
    chainId: 8453,
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
    image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
  }

  const USDCToken = {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    chainId: 8453,
    decimals: 6,
    name: 'USDC',
    symbol: 'USDC',
    image: 'https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png',
  }

  const BaseToken = {
    address: '0x4200000000000000000000000000000000000006',
    chainId: 8453,
    decimals: 18,
    name: 'Base',
    symbol: 'BASE',
    image: 'https://assets.coingecko.com/coins/images/30365/standard/base-logo-in-blue.png',
  }

  const handleSwapSuccess = (txHash: string) => {
    alert(`🎉 Swap completed successfully! Transaction: ${txHash}`)
  }

  const handleSwapError = (error: any) => {
    console.error('Swap failed:', error)
    alert('❌ Swap failed. Please try again.')
  }

  const getSwapProps = () => {
    switch (swapMode) {
      case 'sponsored':
        return {
          from: [ETHToken, USDCToken, BaseToken],
          to: [USDCToken, ETHToken, BaseToken],
          isSponsored: true,
        }
      case 'custom':
        return {
          from: [ETHToken],
          to: [USDCToken],
          isSponsored: false,
        }
      case 'settings':
        return {
          from: [ETHToken, USDCToken],
          to: [USDCToken, ETHToken],
          isSponsored: false,
        }
      default:
        return {
          from: [ETHToken, USDCToken, BaseToken],
          to: [USDCToken, ETHToken, BaseToken],
          isSponsored: false,
        }
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <SwapEnhanced
        from={getSwapProps().from}
        to={getSwapProps().to}
        isSponsored={getSwapProps().isSponsored}
        onSwapSuccess={handleSwapSuccess}
        onSwapError={handleSwapError}
      />
    </div>
  )
}