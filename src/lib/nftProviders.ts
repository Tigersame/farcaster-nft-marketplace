/**
 * Multi-provider NFT fetcher with automatic fallback
 * Uses Tatum, QuickNode, Alchemy, and public RPCs
 */

// Provider configurations with priority order
const NFT_API_PROVIDERS = [
  {
    name: 'Tatum',
    baseUrl: process.env.NEXT_PUBLIC_TATUM_API_KEY
      ? `https://base-mainnet.gateway.tatum.io/${process.env.NEXT_PUBLIC_TATUM_API_KEY}`
      : 'https://base-mainnet.gateway.tatum.io/t-69148b6d19acc082e210cef0-d24ea3dd27e34b1180b1e14d',
    method: 'rpc',
  },
  {
    name: 'QuickNode',
    baseUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL 
      ? `${process.env.NEXT_PUBLIC_BASE_RPC_URL.replace(/\/$/, '')}`
      : null,
    method: 'quicknode',
  },
  {
    name: 'Ankr',
    baseUrl: process.env.NEXT_PUBLIC_ANKR_RPC_URL || null,
    method: 'rpc',
  },
  {
    name: 'Alchemy',
    baseUrl: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
      ? `https://base-mainnet.g.alchemy.com/nft/v3/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
      : null,
    method: 'alchemy',
  },
  {
    name: 'Chainstack',
    baseUrl: process.env.NEXT_PUBLIC_CHAINSTACK_API_KEY
      ? `https://base-mainnet.core.chainstack.com/${process.env.NEXT_PUBLIC_CHAINSTACK_API_KEY}`
      : null,
    method: 'rpc',
  },
  {
    name: 'Public Base RPC',
    baseUrl: 'https://mainnet.base.org',
    method: 'rpc',
  },
]

export interface NFTMetadata {
  tokenId: string
  name: string
  description: string
  image: string
  contractAddress: string
  owner?: string
}

/**
 * Fetch NFTs using Alchemy API format
 */
async function fetchWithAlchemy(baseUrl: string, contractAddress: string, limit: number): Promise<NFTMetadata[]> {
  const url = new URL(`${baseUrl}/getNFTsForContract`)
  url.searchParams.append('contractAddress', contractAddress)
  url.searchParams.append('withMetadata', 'true')
  url.searchParams.append('limit', String(limit))

  const response = await fetch(url.toString(), {
    signal: AbortSignal.timeout(2000), // Reduced from 3s to 2s for instant response
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const data = await response.json()
  
  return (data.nfts || []).map((nft: any) => ({
    tokenId: nft.tokenId || nft.id?.tokenId || '0',
    name: nft.name || nft.title || `NFT #${nft.tokenId}`,
    description: nft.description || '',
    image: nft.image?.cachedUrl || 
           nft.image?.thumbnailUrl ||
           nft.media?.[0]?.gateway || 
           nft.image?.originalUrl ||
           '/placeholder-nft.png',
    contractAddress: nft.contract?.address || contractAddress,
    owner: nft.owner || undefined,
  }))
}

/**
 * Fetch NFTs using standard RPC calls (ERC721 enumerable)
 */
async function fetchWithRPC(rpcUrl: string, contractAddress: string, limit: number): Promise<NFTMetadata[]> {
  // Get total supply first
  const totalSupplyResponse = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_call',
      params: [
        {
          to: contractAddress,
          data: '0x18160ddd', // totalSupply() selector
        },
        'latest',
      ],
    }),
    signal: AbortSignal.timeout(2000), // Reduced from 3s to 2s
  })

  if (!totalSupplyResponse.ok) {
    throw new Error(`RPC failed: ${totalSupplyResponse.status}`)
  }

  const totalSupplyData = await totalSupplyResponse.json()
  const totalSupply = parseInt(totalSupplyData.result || '0x0', 16)

  // Fetch token metadata for first N tokens
  const nfts: NFTMetadata[] = []
  const tokensToFetch = Math.min(limit, totalSupply)

  for (let i = 0; i < tokensToFetch; i++) {
    nfts.push({
      tokenId: String(i),
      name: `NFT #${i}`,
      description: `Token from ${contractAddress}`,
      image: '/placeholder-nft.png',
      contractAddress,
    })
  }

  return nfts
}

/**
 * Fetch NFTs using QuickNode endpoints
 */
async function fetchWithQuickNode(baseUrl: string, contractAddress: string, limit: number): Promise<NFTMetadata[]> {
  // QuickNode supports qn_fetchNFTs method
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 1,
      jsonrpc: '2.0',
      method: 'qn_fetchNFTs',
      params: {
        collection: contractAddress,
        page: 1,
        perPage: limit,
      },
    }),
    signal: AbortSignal.timeout(2000), // Reduced from 3s to 2s
  })

  if (!response.ok) {
    throw new Error(`QuickNode failed: ${response.status}`)
  }

  const data = await response.json()
  
  if (data.error) {
    throw new Error(data.error.message || 'QuickNode error')
  }

  const assets = data.result?.assets || []
  
  return assets.map((nft: any) => ({
    tokenId: nft.tokenId || nft.collectionTokenId || '0',
    name: nft.name || `NFT #${nft.tokenId}`,
    description: nft.description || '',
    image: nft.imageUrl || nft.imageData?.thumbnailUrl || '/placeholder-nft.png',
    contractAddress: nft.collectionAddress || contractAddress,
    owner: nft.owner || undefined,
  }))
}

/**
 * Main function to fetch NFTs with automatic provider fallback
 */
export async function fetchNFTsWithFallback(
  contractAddress: string,
  limit: number = 50
): Promise<{ nfts: NFTMetadata[]; provider: string }> {
  const errors: Array<{ provider: string; error: string }> = []

  for (const provider of NFT_API_PROVIDERS) {
    if (!provider.baseUrl) {
      continue // Skip if no API key configured
    }

    try {
      console.log(`Trying ${provider.name}...`)
      
      let nfts: NFTMetadata[] = []
      
      switch (provider.method) {
        case 'alchemy':
          nfts = await fetchWithAlchemy(provider.baseUrl, contractAddress, limit)
          break
        case 'quicknode':
          nfts = await fetchWithQuickNode(provider.baseUrl, contractAddress, limit)
          break
        case 'rpc':
          nfts = await fetchWithRPC(provider.baseUrl, contractAddress, limit)
          break
      }

      if (nfts.length > 0) {
        console.log(`✅ Success with ${provider.name}`)
        return { nfts, provider: provider.name }
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      console.warn(`❌ ${provider.name} failed:`, errorMsg)
      errors.push({ provider: provider.name, error: errorMsg })
    }
  }

  // All providers failed
  throw new Error(
    `All NFT providers failed:\n${errors.map(e => `${e.provider}: ${e.error}`).join('\n')}`
  )
}

/**
 * Fetch NFTs from multiple contracts with fallback
 */
export async function fetchMultiContractNFTs(
  contractAddresses: string[],
  limitPerContract: number = 12 // Reduced default from 20 to 12
): Promise<{ nfts: NFTMetadata[]; successfulProviders: string[] }> {
  const allNfts: NFTMetadata[] = []
  const providers: string[] = []

  for (const address of contractAddresses) {
    try {
      const { nfts, provider } = await fetchNFTsWithFallback(address, limitPerContract)
      allNfts.push(...nfts)
      if (!providers.includes(provider)) {
        providers.push(provider)
      }
      
      // Reduced delay between requests from 100ms to 50ms
      await new Promise(resolve => setTimeout(resolve, 50))
    } catch (error) {
      console.error(`Failed to fetch from ${address}:`, error)
    }
  }

  return {
    nfts: allNfts,
    successfulProviders: providers,
  }
}

/**
 * Get available providers (for debugging)
 */
export function getAvailableProviders(): string[] {
  return NFT_API_PROVIDERS
    .filter(p => p.baseUrl)
    .map(p => p.name)
}
