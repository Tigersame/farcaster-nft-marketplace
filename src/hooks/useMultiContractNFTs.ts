/**
 * Hook to fetch NFTs from multiple contracts on Base chain
 */

import { useState, useEffect } from 'react'
import { BASE_NFT_CONTRACTS } from '@/lib/nftContracts'

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'skI70Usmhsnf0GDuGdYqj'
const BASE_URL = `https://base-mainnet.g.alchemy.com/nft/v3/${ALCHEMY_API_KEY}`

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

        // Fetch NFTs sequentially with delays to avoid rate limiting
        const allNfts: MultiContractNFT[] = []
        const perContractLimit = Math.ceil(limit / contractAddresses.length)

        for (let i = 0; i < contractAddresses.length; i++) {
          const address = contractAddresses[i]
          
          try {
            const url = new URL(`${BASE_URL}/getNFTsForContract`)
            url.searchParams.append('contractAddress', address)
            url.searchParams.append('withMetadata', 'true')
            url.searchParams.append('limit', String(perContractLimit))

            const response = await fetch(url.toString())
            
            // Skip if rate limited or forbidden
            if (response.status === 429 || response.status === 403) {
              console.warn(`API blocked for ${address} (${response.status}). Please update ALCHEMY_API_KEY in .env.local`)
              continue
            }
            
            if (!response.ok) {
              console.warn(`Failed to fetch ${address}: ${response.status}`)
              continue
            }

            const data = await response.json()
            const contract = BASE_NFT_CONTRACTS.find(c => c.address.toLowerCase() === address.toLowerCase())

            const contractNfts = (data.nfts || []).map((nft: any) => ({
              tokenId: nft.tokenId || nft.id?.tokenId || '0',
              name: nft.name || nft.title || `${contract?.name} #${nft.tokenId}`,
              description: nft.description || contract?.description || '',
              image: nft.image?.cachedUrl || 
                     nft.image?.thumbnailUrl ||
                     nft.media?.[0]?.gateway || 
                     '/placeholder-nft.png',
              contractAddress: address,
              contractName: contract?.name || 'Unknown',
              category: contract?.category || 'Other',
              verified: contract?.verified || false,
              price: contract?.floorPrice || '0',
              ethPrice: contract?.floorPrice || '0.0',
            }))
            
            allNfts.push(...contractNfts)
            
            // Add delay between requests (300ms) to avoid rate limiting
            if (i < contractAddresses.length - 1) {
              await delay(300)
            }
          } catch (err) {
            console.error(`Error fetching NFTs from ${address}:`, err)
          }
        }
        
        // Shuffle for variety
        const shuffled = allNfts.sort(() => Math.random() - 0.5)
        setNfts(shuffled.slice(0, limit))
        
        // If no NFTs loaded, set error message
        if (allNfts.length === 0) {
          setError('Alchemy API key is blocked (403). Please update NEXT_PUBLIC_ALCHEMY_API_KEY in .env.local with a new key from https://dashboard.alchemy.com')
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
 * Reduced to first 3 collections to avoid rate limiting
 */
export function useVerifiedNFTs(limit: number = 60) {
  const contracts = BASE_NFT_CONTRACTS
    .slice(0, 3) // Only fetch from first 3 collections to avoid rate limits
    .filter(c => c.verified)
    .map(c => c.address)

  return useMultiContractNFTs(contracts, limit)
}
