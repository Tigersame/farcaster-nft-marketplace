// Metadata proxy API route - fetches and caches IPFS metadata
// GET /api/metadata/[cid]

import { NextRequest, NextResponse } from 'next/server'

// IPFS gateway fallbacks (ordered by reliability)
const IPFS_GATEWAYS = [
  'https://cloudflare-ipfs.com/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://nftstorage.link/ipfs/',
]

// In-memory cache (use Redis in production)
const metadataCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 1000 * 60 * 60 * 24 * 7 // 7 days

/**
 * Fetch from IPFS with gateway fallback
 */
async function fetchFromIPFS(cid: string): Promise<any> {
  for (const gateway of IPFS_GATEWAYS) {
    try {
      const url = `${gateway}${cid}`
      console.log(`Trying gateway: ${url}`)
      
      const response = await fetch(url, {
        signal: AbortSignal.timeout(5000), // 5 second timeout
      })
      
      if (response.ok) {
        const data = await response.json()
        return data
      }
    } catch (error) {
      console.error(`Gateway failed: ${gateway}`, (error as Error).message)
      continue
    }
  }
  
  throw new Error(`Failed to fetch IPFS content: ${cid}`)
}

/**
 * Normalize metadata from different standards
 */
function normalizeMetadata(raw: any): any {
  return {
    name: raw.name || raw.title || 'Untitled',
    description: raw.description || '',
    image: raw.image || raw.image_url || raw.imageUrl || '',
    attributes: raw.attributes || raw.traits || [],
    external_url: raw.external_url || raw.externalUrl || '',
    animation_url: raw.animation_url || raw.animationUrl || '',
    background_color: raw.background_color || raw.backgroundColor || '',
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { cid: string } }
) {
  const { cid } = params
  
  try {
    // Check cache first
    const cached = metadataCache.get(cid)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`Cache hit: ${cid}`)
      return NextResponse.json({
        ...cached.data,
        cached: true,
      })
    }
    
    // Fetch from IPFS
    console.log(`Cache miss: ${cid}`)
    const raw = await fetchFromIPFS(cid)
    const normalized = normalizeMetadata(raw)
    
    // Cache result
    metadataCache.set(cid, {
      data: normalized,
      timestamp: Date.now(),
    })
    
    return NextResponse.json({
      ...normalized,
      cached: false,
    })
  } catch (error) {
    console.error('Metadata fetch error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch metadata',
        message: (error as Error).message,
      },
      { status: 500 }
    )
  }
}

// Optional: Cache invalidation
export async function DELETE(
  request: NextRequest,
  { params }: { params: { cid: string } }
) {
  const { cid } = params
  metadataCache.delete(cid)
  
  return NextResponse.json({
    success: true,
    message: 'Cache invalidated',
  })
}
