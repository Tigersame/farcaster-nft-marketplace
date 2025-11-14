/**
 * Hook to fetch NFTs from multiple contracts on Base chain
 * Uses multiple providers with automatic fallback
 */

import { useState, useEffect } from 'react'
import { BASE_NFT_CONTRACTS } from '@/lib/nftContracts'
import { fetchMultiContractNFTs, getAvailableProviders } from '@/lib/nftProviders'

// Helper to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export interface MultiContractNFT {
  tokenId: string
  name: string
  description: string
  image: string
  contractAddress: string
  contractName: string
  category: string
  verified: boolean
  price?: string
  ethPrice?: string
}

export function useMultiContractNFTs(contractAddresses: string[], limit: number = 50) {
  const [nfts, setNfts] = useState<MultiContractNFT[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!contractAddresses || contractAddresses.length === 0) {
      setLoading(false)
      return
    }

    const fetchAllNFTs = async () => {
      try {
        setLoading(true)
        setError(null)

        // Log available providers
        const providers = getAvailableProviders()
        console.log(`🔄 Available NFT providers: ${providers.join(', ')}`)

        // Set a timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
          setLoading(false)
          if (nfts.length === 0) {
            setError('Request timed out. Check RPC providers.')
          }
        }, 2000) // Reduced from 4s to 2s for instant response

        // Use multi-provider fetch with automatic fallback
        const perContractLimit = Math.ceil(limit / contractAddresses.length)
        const { nfts: fetchedNfts, successfulProviders } = await fetchMultiContractNFTs(
          contractAddresses,
          perContractLimit
        )

        clearTimeout(timeoutId) // Clear timeout if successful

        // Transform to our format with contract metadata
        const transformedNfts: MultiContractNFT[] = fetchedNfts.map(nft => {
          const contract = BASE_NFT_CONTRACTS.find(
            c => c.address.toLowerCase() === nft.contractAddress.toLowerCase()
          )

          return {
            tokenId: nft.tokenId,
            name: nft.name,
            description: nft.description || contract?.description || '',
            image: nft.image,
            contractAddress: nft.contractAddress,
            contractName: contract?.name || 'Unknown',
            category: contract?.category || 'Other',
            verified: contract?.verified || false,
            price: contract?.floorPrice || '0',
            ethPrice: contract?.floorPrice || '0.0',
          }
        })

        // Shuffle for variety and limit
        const shuffled = transformedNfts.sort(() => Math.random() - 0.5)
        setNfts(shuffled.slice(0, limit))

        // If no NFTs loaded, set error message
        if (transformedNfts.length === 0) {
          setError(`Unable to load NFTs from any provider. Tried: ${successfulProviders.join(', ') || 'none'}`)
        } else {
          console.log(`✅ Loaded ${transformedNfts.length} NFTs using: ${successfulProviders.join(', ')}`)
        }

        setLoading(false)
      } catch (err) {
        console.error('Error fetching multi-contract NFTs:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch NFTs')
        setLoading(false)
      }
    }

    fetchAllNFTs()
  }, [contractAddresses, limit])

  return { nfts, loading, error }
}

/**
 * Hook to fetch NFTs by category
 */
export function useNFTsByCategory(category: string, limit: number = 50) {
  const contracts = BASE_NFT_CONTRACTS
    .filter(c => c.category === category)
    .map(c => c.address)

  return useMultiContractNFTs(contracts, limit)
}

/**
 * Hook to fetch all verified NFTs
 * Ultra-reduced to 1 collection for fastest loading
 */
export function useVerifiedNFTs(limit: number = 8) {
  const contracts = BASE_NFT_CONTRACTS
    .slice(0, 1) // Only fetch from first 1 collection for fastest loading
    .filter(c => c.verified)
    .map(c => c.address)

  return useMultiContractNFTs(contracts, limit)
}
