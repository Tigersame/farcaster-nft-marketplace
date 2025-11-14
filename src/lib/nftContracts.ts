/**
 * Popular NFT Contracts on Base Chain
 * Updated list of verified NFT collections
 */

export interface NFTContract {
  address: string
  name: string
  symbol: string
  description: string
  category: 'Gaming' | 'Art' | 'PFP' | 'Utility' | 'Metaverse' | 'Music' | 'Sports'
  verified: boolean
  floorPrice?: string
  totalSupply?: number
  website?: string
  twitter?: string
}

export const BASE_NFT_CONTRACTS: NFTContract[] = [
  // Gaming NFTs
  {
    address: '0x41Dc69132ccE31FCbF6755c84538CA268520246f',
    name: 'DX Terminal',
    symbol: 'DXTERM',
    description: 'Premium gaming terminals and virtual assets on Base',
    category: 'Gaming',
    verified: true,
    floorPrice: '0.0038',
    totalSupply: 36647,
    website: 'https://dxrg.ai',
  },
  
  // Base Ecosystem NFTs
  {
    address: '0x03c4738Ee98aE44591e1A4A4F3CaB6641d95DD9a',
    name: 'Based Fellas',
    symbol: 'FELLAS',
    description: 'Community-driven PFP collection on Base',
    category: 'PFP',
    verified: true,
  },
  
  {
    address: '0xD4307E0acD12CF46fD6cf93BC264f5D5D1598792',
    name: 'Basepaint',
    symbol: 'PAINT',
    description: 'Collaborative art created by the Base community',
    category: 'Art',
    verified: true,
  },
  
  {
    address: '0x4f89Cd0CAE1e54D98db6a80150a824a533502EEa',
    name: 'Base Gods',
    symbol: 'GODS',
    description: 'Mythology-inspired NFT collection',
    category: 'PFP',
    verified: true,
  },
  
  // Music NFTs
  {
    address: '0x0fe154e2448b488fc0de099206670d2e1e9fb4bf',
    name: 'Sound.xyz',
    symbol: 'SOUND',
    description: 'Music NFTs and artist support platform',
    category: 'Music',
    verified: true,
  },
  
  // Additional Popular Collections
  {
    address: '0x8eB24319393716668D768dCEC29356ae9CfFe285',
    name: 'Truworld',
    symbol: 'TRUWORLD',
    description: 'Metaverse land and virtual real estate',
    category: 'Metaverse',
    verified: true,
  },
  
  {
    address: '0xFd8427165dF67DF6fd1B4F3Fd2e18c4e65F6914D',
    name: 'Toshi',
    symbol: 'TOSHI',
    description: 'Base mascot collectibles',
    category: 'PFP',
    verified: true,
  },
  
  {
    address: '0x8c0b04bcb9b83a23bb368c66b9d25e3cd9e18f6c',
    name: 'Base Apes',
    symbol: 'BAPE',
    description: 'Ape-themed PFP collection on Base',
    category: 'PFP',
    verified: true,
  },
  
  {
    address: '0xfA29b4eAA232ff238B40453373220FcbEE1A1bEc',
    name: 'New Collection',
    symbol: 'NEW',
    description: 'Featured NFT collection on Base',
    category: 'Art',
    verified: true,
  },
]

/**
 * Get contract by address
 */
export function getContractByAddress(address: string): NFTContract | undefined {
  return BASE_NFT_CONTRACTS.find(
    contract => contract.address.toLowerCase() === address.toLowerCase()
  )
}

/**
 * Get contracts by category
 */
export function getContractsByCategory(category: NFTContract['category']): NFTContract[] {
  return BASE_NFT_CONTRACTS.filter(contract => contract.category === category)
}

/**
 * Get all verified contracts
 */
export function getVerifiedContracts(): NFTContract[] {
  return BASE_NFT_CONTRACTS.filter(contract => contract.verified)
}

/**
 * Get all contract addresses for bulk fetching
 */
export function getAllContractAddresses(): string[] {
  return BASE_NFT_CONTRACTS.map(contract => contract.address)
}
