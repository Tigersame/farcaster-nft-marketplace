// Base chain token list - Reference: https://docs.base.org/tools/contracts
// Popular tokens on Base mainnet

export interface Token {
  address: `0x${string}`
  chainId: number
  decimals: number
  name: string
  symbol: string
  logoURI?: string
  balance?: string
}

// Base mainnet chain ID
export const BASE_CHAIN_ID = 8453

// Native ETH
export const ETH: Token = {
  address: '0x0000000000000000000000000000000000000000' as `0x${string}`,
  chainId: BASE_CHAIN_ID,
  decimals: 18,
  name: 'Ethereum',
  symbol: 'ETH',
  logoURI: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
}

// Wrapped ETH on Base
export const WETH: Token = {
  address: '0x4200000000000000000000000000000000000006' as `0x${string}`,
  chainId: BASE_CHAIN_ID,
  decimals: 18,
  name: 'Wrapped Ether',
  symbol: 'WETH',
  logoURI: 'https://assets.coingecko.com/coins/images/2518/standard/weth.png',
}

// USDC on Base (official)
export const USDC: Token = {
  address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as `0x${string}`,
  chainId: BASE_CHAIN_ID,
  decimals: 6,
  name: 'USD Coin',
  symbol: 'USDC',
  logoURI: 'https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png',
}

// DAI on Base
export const DAI: Token = {
  address: '0x50c5725949A6F0c72E6C4a641F24049A917E0eB6' as `0x${string}`,
  chainId: BASE_CHAIN_ID,
  decimals: 18,
  name: 'Dai Stablecoin',
  symbol: 'DAI',
  logoURI: 'https://assets.coingecko.com/coins/images/9956/standard/Badge_Dai.png',
}

// USDT on Base
export const USDT: Token = {
  address: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2' as `0x${string}`,
  chainId: BASE_CHAIN_ID,
  decimals: 6,
  name: 'Tether USD',
  symbol: 'USDT',
  logoURI: 'https://assets.coingecko.com/coins/images/325/standard/Tether.png',
}

// cbETH on Base
export const CBETH: Token = {
  address: '0x2Ae3F1Ec7F1F5012CFEab0185bfC7aa3cf0DEc22' as `0x${string}`,
  chainId: BASE_CHAIN_ID,
  decimals: 18,
  name: 'Coinbase Wrapped Staked ETH',
  symbol: 'cbETH',
  logoURI: 'https://assets.coingecko.com/coins/images/27008/standard/cbeth.png',
}

// AERO (Aerodrome token)
export const AERO: Token = {
  address: '0x940181a94A35A4569E4529A3CDfB74e38FD98631' as `0x${string}`,
  chainId: BASE_CHAIN_ID,
  decimals: 18,
  name: 'Aerodrome Finance',
  symbol: 'AERO',
  logoURI: 'https://assets.coingecko.com/coins/images/35717/standard/aero.png',
}

// VELO (Velodrome token)
export const VELO: Token = {
  address: '0x9560e827aF36c94D2Ac33a39bCE1Fe78631088Db' as `0x${string}`,
  chainId: BASE_CHAIN_ID,
  decimals: 18,
  name: 'Velodrome Finance',
  symbol: 'VELO',
  logoURI: 'https://assets.coingecko.com/coins/images/25783/standard/velo.png',
}

// Base popular tokens list
export const BASE_TOKENS: Token[] = [
  ETH,
  USDC,
  WETH,
  DAI,
  USDT,
  CBETH,
  AERO,
  VELO,
]

// Token list for Uniswap V3 on Base
// Reference: https://docs.uniswap.org/contracts/v3/reference/deployments
export const UNISWAP_V3_ROUTER = '0x2626664c2603336E57B271c5C0b26F421741e481' as `0x${string}`
export const UNISWAP_V3_FACTORY = '0x33128a8fC17869897dcE68Ed026d694621f6FDfD' as `0x${string}`

// Common token pairs for liquidity pools
export const COMMON_PAIRS = [
  { token0: ETH, token1: USDC },
  { token0: ETH, token1: WETH },
  { token0: USDC, token1: DAI },
  { token0: USDC, token1: USDT },
  { token0: WETH, token1: USDC },
]

// Helper function to find token by address
export function findTokenByAddress(address: string): Token | undefined {
  return BASE_TOKENS.find(
    (token) => token.address.toLowerCase() === address.toLowerCase()
  )
}

// Helper function to find token by symbol
export function findTokenBySymbol(symbol: string): Token | undefined {
  return BASE_TOKENS.find(
    (token) => token.symbol.toUpperCase() === symbol.toUpperCase()
  )
}
