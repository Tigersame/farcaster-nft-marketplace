/**
 * Hook to fetch NFTs from Base chain using Alchemy API
 */

import { useState, useEffect } from 'react'

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'skI70Usmhsnf0GDuGdYqj'
const BASE_URL = `https://base-mainnet.g.alchemy.com/nft/v3/${ALCHEMY_API_KEY}`

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

      const url = new URL(`${BASE_URL}/getNFTsForContract`)
      url.searchParams.append('contractAddress', contractAddress)
      url.searchParams.append('withMetadata', 'true')
      url.searchParams.append('limit', '100')
      
      if (nextPageKey) {
        url.searchParams.append('pageKey', nextPageKey)
      }

      const response = await fetch(url.toString())
      
      if (!response.ok) {
        throw new Error(`Failed to fetch NFTs: ${response.status}`)
      }

      const data = await response.json()
      
      const transformedNFTs: BaseNFT[] = (data.nfts || []).map((nft: any) => ({
        tokenId: nft.tokenId || nft.id?.tokenId || '0',
        name: nft.name || nft.title || nft.contract?.name || `NFT #${nft.tokenId}`,
        description: nft.description || nft.contract?.name || '',
        image: nft.image?.cachedUrl || 
               nft.image?.thumbnailUrl ||
               nft.media?.[0]?.gateway || 
               nft.image?.originalUrl ||
               '/placeholder-nft.png',
        contractAddress: nft.contract?.address || contractAddress,
        price: '0',
        ethPrice: '0.0038', // Default floor price
      }))

      if (nextPageKey) {
        setNfts(prev => [...prev, ...transformedNFTs])
      } else {
        setNfts(transformedNFTs)
      }
      
      setPageKey(data.pageKey)
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

        const url = new URL(`${BASE_URL}/getNFTsForOwner`)
        url.searchParams.append('owner', ownerAddress)
        url.searchParams.append('withMetadata', 'true')
        
        if (contractAddresses && contractAddresses.length > 0) {
          contractAddresses.forEach(addr => {
            url.searchParams.append('contractAddresses[]', addr)
          })
        }

        const response = await fetch(url.toString())
        
        if (!response.ok) {
          throw new Error(`Failed to fetch NFTs: ${response.status}`)
        }

        const data = await response.json()
        
        const transformedNFTs: BaseNFT[] = (data.ownedNfts || []).map((nft: any) => ({
          tokenId: nft.tokenId || nft.id?.tokenId || '0',
          name: nft.name || nft.title || `NFT #${nft.tokenId}`,
          description: nft.description || '',
          image: nft.image?.cachedUrl || 
                 nft.media?.[0]?.gateway || 
                 '/placeholder-nft.png',
          contractAddress: nft.contract?.address || '',
          price: '0',
          ethPrice: '0.0',
        }))

        setNfts(transformedNFTs)
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
