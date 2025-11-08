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
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
          <OnchainkitSvg className="w-8 h-8" />
          Token Swap
          <BaseSvg className="w-8 h-8" />
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Enhanced token swapping with OnchainKit patterns and Base chain integration
        </p>
      </div>

      {/* Mode Selector */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Swap Modes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setSwapMode('default')}
            className={`p-4 rounded-xl border transition-all ${
              swapMode === 'default'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Default Swap</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Standard token swapping with multiple token options
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Multi-token</span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Uniswap V3</span>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSwapMode('sponsored')}
            className={`p-4 rounded-xl border transition-all ${
              swapMode === 'sponsored'
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Sponsored Swap</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Gas-free swapping powered by Coinbase Paymaster
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 bg-green-100 dark:bg-green-700 rounded">⚡ Gas Free</span>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-700 rounded">Paymaster</span>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSwapMode('custom')}
            className={`p-4 rounded-xl border transition-all ${
              swapMode === 'custom'
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Custom Pair</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Fixed ETH ↔ USDC trading pair only
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-700 rounded">ETH/USDC</span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-700 rounded">Fixed Pair</span>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSwapMode('settings')}
            className={`p-4 rounded-xl border transition-all ${
              swapMode === 'settings'
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Settings Demo</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Showcases slippage configuration settings
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-700 rounded">⚙️ Settings</span>
                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-700 rounded">Slippage</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Swap Interface */}
      <div className="flex justify-center mb-8">
        <SwapEnhanced
          {...getSwapProps()}
          onSwapSuccess={handleSwapSuccess}
          onSwapError={handleSwapError}
        />
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="text-center p-4">
          <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <BaseSvg className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Base Optimized</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">Built specifically for Base chain with low fees</p>
        </div>
        
        <div className="text-center p-4">
          <div className="w-12 h-12 mx-auto mb-3 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <span className="text-green-600 text-xl">⚡</span>
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Gas Sponsorship</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">Optional Paymaster integration for gas-free swaps</p>
        </div>
        
        <div className="text-center p-4">
          <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
            <OnchainkitSvg className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">OnchainKit Powered</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">Following Coinbase's best practices</p>
        </div>
        
        <div className="text-center p-4">
          <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
            <span className="text-orange-600 text-xl">🔄</span>
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Best Rates</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">Uniswap V3 and 0x Aggregator support</p>
        </div>
      </div>

      {/* Implementation Details */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Swap Component Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Component Structure</h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <li>• SwapAmountInput for token selection and amounts</li>
              <li>• SwapToggleButton for reversing swap direction</li>
              <li>• SwapButton with transaction integration</li>
              <li>• SwapMessage for real-time feedback</li>
              <li>• SwapToast for success notifications</li>
              <li>• TransactionWrapper for onchain execution</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Advanced Features</h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <li>• Real-time rate calculation and display</li>
              <li>• Multiple swap router support (Uniswap V3, 0x)</li>
              <li>• Gas sponsorship via Coinbase Paymaster</li>
              <li>• Custom token pair configurations</li>
              <li>• Balance display and max amount buttons</li>
              <li>• Comprehensive error handling and feedback</li>
            </ul>
          </div>
        </div>
        
        {/* Current Mode Details */}
        <div className="mt-6 p-4 bg-white dark:bg-gray-700 rounded-xl">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            Current Mode: {
              swapMode === 'default' ? 'Default Swap' : 
              swapMode === 'sponsored' ? 'Sponsored Swap' : 
              swapMode === 'custom' ? 'Custom Pair' : 
              'Settings Demo'
            }
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-300">Gas Sponsorship:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {getSwapProps().isSponsored ? '✅ Enabled' : '❌ Disabled'}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-300">From Tokens:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {getSwapProps().from.map(t => t.symbol).join(', ')}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-300">To Tokens:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {getSwapProps().to.map(t => t.symbol).join(', ')}
              </span>
            </div>
          </div>
          {swapMode === 'settings' && (
            <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <h5 className="font-medium text-orange-900 dark:text-orange-300 mb-1">Settings Mode Features</h5>
              <p className="text-sm text-orange-700 dark:text-orange-400">
                This mode demonstrates slippage configuration with preset buttons (0.1%, 0.5%, 1.0%) and a custom input field. 
                The SwapSettings component includes title, description, and interactive slippage controls.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}