/**
 * Hook to fetch NFTs from Base chain using multi-provider fallback
 */

import { useState, useEffect } from 'react'
import { fetchNFTsWithFallback } from '@/lib/nftProviders'

export interface BaseNFT {
  tokenId: string
  name: string
  description: string
  image: string
  contractAddress: string
  price?: string
  ethPrice?: string
}

export function useBaseNFTs(contractAddress: string) {
  const [nfts, setNfts] = useState<BaseNFT[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pageKey, setPageKey] = useState<string | undefined>()

  const fetchNFTs = async (nextPageKey?: string) => {
    try {
      setLoading(true)
      setError(null)

      // Set timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        setLoading(false)
        if (nfts.length === 0) {
          setError('Request timed out. Check your API key.')
        }
      }, 2000) // Reduced from 3s to 2s for instant response

      // Use multi-provider fetch with automatic fallback
      const { nfts: fetchedNfts, provider } = await fetchNFTsWithFallback(contractAddress, 100)
      
      clearTimeout(timeoutId) // Clear timeout on response
      
      console.log(`✅ Fetched ${fetchedNfts.length} NFTs from ${contractAddress} using ${provider}`)
      
      const transformedNFTs: BaseNFT[] = fetchedNfts.map(nft => ({
        tokenId: nft.tokenId,
        name: nft.name,
        description: nft.description,
        image: nft.image,
        contractAddress: nft.contractAddress,
        price: '0',
        ethPrice: '0.0038', // Default floor price
      }))

      if (nextPageKey) {
        setNfts(prev => [...prev, ...transformedNFTs])
      } else {
        setNfts(transformedNFTs)
      }
      
      // Note: Pagination not supported with multi-provider yet
      setPageKey(undefined)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching Base NFTs:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch NFTs')
      setLoading(false)
    }
  }

  useEffect(() => {
    if (contractAddress) {
      fetchNFTs()
    }
  }, [contractAddress])

  const loadMore = () => {
    if (pageKey && !loading) {
      fetchNFTs(pageKey)
    }
  }

  return { nfts, loading, error, hasMore: !!pageKey, loadMore }
}

export function useOwnerNFTs(ownerAddress: string, contractAddresses?: string[]) {
  const [nfts, setNfts] = useState<BaseNFT[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ownerAddress) return

    const fetchOwnerNFTs = async () => {
      try {
        setLoading(true)
        setError(null)

        // If specific contracts provided, fetch from each
        if (contractAddresses && contractAddresses.length > 0) {
          const allNfts: BaseNFT[] = []
          
          for (const contractAddr of contractAddresses) {
            try {
              const { nfts: fetchedNfts } = await fetchNFTsWithFallback(contractAddr, 50)
              const ownerNfts = fetchedNfts.map(nft => ({
                tokenId: nft.tokenId,
                name: nft.name,
                description: nft.description,
                image: nft.image,
                contractAddress: nft.contractAddress,
                price: '0',
                ethPrice: '0.0038',
              }))
              allNfts.push(...ownerNfts)
            } catch (err) {
              console.warn(`Failed to fetch from ${contractAddr}:`, err)
            }
          }
          
          setNfts(allNfts)
        } else {
          // No contract filter - return empty
          setNfts([])
        }

        setLoading(false)
      } catch (err) {
        console.error('Error fetching owner NFTs:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch NFTs')
        setLoading(false)
      }
    }

    fetchOwnerNFTs()
  }, [ownerAddress, contractAddresses])

  return { nfts, loading, error }
}
