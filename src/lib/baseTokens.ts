/**
 * Base Chain Token List
 * Comprehensive list of popular tokens on Base network
 */

import type { Token } from '@coinbase/onchainkit/token'

export const BASE_TOKENS: Token[] = [
  {
    address: '',
    chainId: 8453,
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
    image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
  },
  {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    chainId: 8453,
    decimals: 6,
    name: 'USD Coin',
    symbol: 'USDC',
    image: 'https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png',
  },
  {
    address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    chainId: 8453,
    decimals: 18,
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    image: 'https://ethereum-optimism.github.io/data/DAI/logo.svg',
  },
  {
    address: '0x4200000000000000000000000000000000000006',
    chainId: 8453,
    decimals: 18,
    name: 'Wrapped Ether',
    symbol: 'WETH',
    image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
  },
  {
    address: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
    chainId: 8453,
    decimals: 6,
    name: 'USD Base Coin',
    symbol: 'USDbC',
    image: 'https://ethereum-optimism.github.io/data/USDC/logo.png',
  },
  {
    address: '0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452',
    chainId: 8453,
    decimals: 18,
    name: 'Wrapped stETH',
    symbol: 'wstETH',
    image: 'https://assets.coingecko.com/coins/images/18834/large/wstETH.png',
  },
  {
    address: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22',
    chainId: 8453,
    decimals: 18,
    name: 'Coinbase Wrapped Staked ETH',
    symbol: 'cbETH',
    image: 'https://assets.coingecko.com/coins/images/27008/large/cbeth.png',
  },
  {
    address: '0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c',
    chainId: 8453,
    decimals: 18,
    name: 'Rocket Pool ETH',
    symbol: 'rETH',
    image: 'https://assets.coingecko.com/coins/images/20764/large/reth.png',
  },
]

export interface LiquidityPool {
  id: string
  name: string
  token0: Token
  token1: Token
  tvl: string
  apr: string
  volume24h: string
  fee: string
  poolAddress: string
}

export const MOCK_LIQUIDITY_POOLS: LiquidityPool[] = [
  {
    id: '1',
    name: 'ETH/USDC',
    token0: BASE_TOKENS[0], // ETH
    token1: BASE_TOKENS[1], // USDC
    tvl: '$45,234,567',
    apr: '12.5%',
    volume24h: '$8,234,567',
    fee: '0.3%',
    poolAddress: '0x1234567890123456789012345678901234567890',
  },
  {
    id: '2',
    name: 'WETH/USDC',
    token0: BASE_TOKENS[3], // WETH
    token1: BASE_TOKENS[1], // USDC
    tvl: '$32,456,789',
    apr: '18.2%',
    volume24h: '$5,678,901',
    fee: '0.3%',
    poolAddress: '0x2345678901234567890123456789012345678901',
  },
  {
    id: '3',
    name: 'DAI/USDC',
    token0: BASE_TOKENS[2], // DAI
    token1: BASE_TOKENS[1], // USDC
    tvl: '$12,345,678',
    apr: '8.7%',
    volume24h: '$2,345,678',
    fee: '0.05%',
    poolAddress: '0x3456789012345678901234567890123456789012',
  },
  {
    id: '4',
    name: 'cbETH/ETH',
    token0: BASE_TOKENS[6], // cbETH
    token1: BASE_TOKENS[0], // ETH
    tvl: '$18,765,432',
    apr: '15.3%',
    volume24h: '$3,456,789',
    fee: '0.3%',
    poolAddress: '0x4567890123456789012345678901234567890123',
  },
  {
    id: '5',
    name: 'wstETH/WETH',
    token0: BASE_TOKENS[5], // wstETH
    token1: BASE_TOKENS[3], // WETH
    tvl: '$9,876,543',
    apr: '10.8%',
    volume24h: '$1,234,567',
    fee: '0.3%',
    poolAddress: '0x5678901234567890123456789012345678901234',
  },
]

export function getTokenByAddress(address: string): Token | undefined {
  return BASE_TOKENS.find(
    (token) => token.address.toLowerCase() === address.toLowerCase()
  )
}

export function getTokenBySymbol(symbol: string): Token | undefined {
  return BASE_TOKENS.find(
    (token) => token.symbol.toUpperCase() === symbol.toUpperCase()
  )
}
