// Farcaster Frame utilities for Base network integration

export interface FrameMetadata {
  'fc:frame': string
  'fc:frame:image': string
  'fc:frame:button:1'?: string
  'fc:frame:button:2'?: string
  'fc:frame:button:3'?: string
  'fc:frame:button:4'?: string
  'fc:frame:post_url'?: string
  'fc:frame:input:text'?: string
  'og:image'?: string
  'og:title'?: string
  'og:description'?: string
}

export function generateFrameMetadata(
  image: string,
  buttons: string[] = [],
  postUrl?: string,
  inputText?: string
): FrameMetadata {
  const metadata: FrameMetadata = {
    'fc:frame': 'vNext',
    'fc:frame:image': image,
    'og:image': image,
  }

  buttons.forEach((button, index) => {
    if (index < 4) {
      metadata[`fc:frame:button:${index + 1}` as keyof FrameMetadata] = button
    }
  })

  if (postUrl) {
    metadata['fc:frame:post_url'] = postUrl
  }

  if (inputText) {
    metadata['fc:frame:input:text'] = inputText
  }

  return metadata
}

export interface NFTFrameData {
  tokenId: string
  name: string
  description: string
  image: string
  price: string
  seller: string
  chainId: number
}

export function createNFTFrame(nft: NFTFrameData): FrameMetadata {
  return generateFrameMetadata(
    nft.image,
    ['View Details', 'Buy NFT', 'Share'],
    `/api/frames/nft/${nft.tokenId}`,
  )
}

export function createMarketplaceFrame(): FrameMetadata {
  return generateFrameMetadata(
    '/api/frames/marketplace-preview',
    ['Browse NFTs', 'Create NFT', 'Connect Wallet'],
    '/api/frames/marketplace'
  )
}

// Farcaster user data utilities
export interface FarcasterUser {
  fid: number
  username: string
  displayName: string
  pfpUrl?: string
  bio?: string
  followerCount?: number
  followingCount?: number
}

export async function getFarcasterUser(fid: number): Promise<FarcasterUser | null> {
  try {
    // This would integrate with Farcaster Hub API
    // For demo purposes, return mock data
    return {
      fid,
      username: `user${fid}`,
      displayName: `Farcaster User ${fid}`,
      pfpUrl: '/api/placeholder/100/100',
      bio: 'Building on Base network',
      followerCount: Math.floor(Math.random() * 1000),
      followingCount: Math.floor(Math.random() * 500),
    }
  } catch (error) {
    console.error('Error fetching Farcaster user:', error)
    return null
  }
}

// Base network utilities for Farcaster integration
export const BASE_CHAIN_CONFIG = {
  chainId: 8453, // Base Mainnet
  name: 'Base',
  currency: 'ETH',
  rpcUrl: `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'skI70Usmhsnf0GDuGdYqj'}`,
  blockExplorer: 'https://basescan.org',
}

export const BASE_SEPOLIA_CONFIG = {
  chainId: 84532, // Base Sepolia Testnet
  name: 'Base Sepolia',
  currency: 'ETH',
  rpcUrl: 'https://sepolia.base.org',
  blockExplorer: 'https://sepolia.basescan.org',
}

export function formatAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function getExplorerUrl(hash: string, type: 'tx' | 'address' = 'tx'): string {
  const baseUrl = BASE_CHAIN_CONFIG.blockExplorer
  return `${baseUrl}/${type}/${hash}`
}

// Farcaster Cast utilities
export interface CastData {
  text: string
  embeds?: string[]
  mentions?: number[]
  parentUrl?: string
}

export function createNFTCast(nft: NFTFrameData): CastData {
  return {
    text: `🖼️ Check out this amazing NFT: "${nft.name}" - ${nft.price} ETH on Base network! 

${nft.description}

#NFT #Base #Farcaster`,
    embeds: [`${window.location.origin}/nft/${nft.tokenId}`],
  }
}

export function createMarketplaceCast(): CastData {
  return {
    text: `🚀 Discover unique NFTs on our Farcaster marketplace built on Base! 

✨ Browse collections
🎨 Create your own NFTs  
💎 Trade with low fees

Join the future of social NFT trading!

#NFT #Farcaster #Base #Web3`,
    embeds: [window.location.origin],
  }
}

/**
 * Validate Farcaster webhook signature
 */
export function validateFarcasterSignature(body: string, signature: string): boolean {
  try {
    // This is a simplified validation - in production you would use proper cryptographic verification
    // with the actual Farcaster webhook secret
    const webhookSecret = process.env.FARCASTER_WEBHOOK_SECRET || 'default-secret'
    
    // Basic signature validation (replace with proper HMAC verification in production)
    const expectedSignature = `fc-signature-${Buffer.from(body + webhookSecret).toString('base64').slice(0, 32)}`
    
    return signature === expectedSignature
  } catch (error) {
    console.error('Signature validation error:', error)
    return false
  }
}

/**
 * Parse Farcaster frame action data
 */
export interface FarcasterFrameAction {
  buttonIndex: number
  castId: {
    fid: number
    hash: string
  }
  inputText?: string
  state?: string
  transactionId?: string
  address?: string
  url: string
}

export function parseFrameAction(data: any): FarcasterFrameAction | null {
  try {
    return {
      buttonIndex: data.untrustedData?.buttonIndex || 0,
      castId: {
        fid: data.untrustedData?.castId?.fid || 0,
        hash: data.untrustedData?.castId?.hash || '',
      },
      inputText: data.untrustedData?.inputText,
      state: data.untrustedData?.state,
      transactionId: data.untrustedData?.transactionId,
      address: data.untrustedData?.address,
      url: data.untrustedData?.url || '',
    }
  } catch (error) {
    console.error('Error parsing frame action:', error)
    return null
  }
}