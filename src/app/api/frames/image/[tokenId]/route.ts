import { NextRequest, NextResponse } from 'next/server'
import { SecurityUtils } from '../../../../../lib/security'
import { addSecurityHeaders } from '../../../../../lib/middleware'
import { validateInputSafe, tokenIdSchema } from '../../../../../lib/validation'

interface NFT {
  tokenId: string
  name: string
  description: string
  image: string
  price: string
  ethPrice: string
  seller: string
  owner: string
}

// Mock NFT data
const mockNFTs: Record<string, NFT> = {
  '1': {
    tokenId: '1',
    name: 'Farcaster Genesis #001',
    description: 'The first NFT in the Farcaster ecosystem on Base.',
    image: 'https://picsum.photos/400/400?random=1',
    price: '2500000000000000000',
    ethPrice: '2.5',
    seller: process.env.NEXT_PUBLIC_ADMIN_ADDRESS || '0xEaFE5088BCd7eb27fa1e4AA417a55eD5ea2dab8B',
    owner: process.env.NEXT_PUBLIC_ADMIN_ADDRESS || '0xEaFE5088BCd7eb27fa1e4AA417a55eD5ea2dab8B'
  },
  '2': {
    tokenId: '2',
    name: 'Base Builder Badge',
    description: 'Limited edition builder badge for early Base network adopters.',
    image: 'https://picsum.photos/400/400?random=2',
    price: '1000000000000000000',
    ethPrice: '1.0',
    seller: '0x8ba1f109551bD432803012645Hac136c22C501e',
    owner: '0x8ba1f109551bD432803012645Hac136c22C501e'
  },
  '3': {
    tokenId: '3',
    name: 'Onchain Summer Vibes',
    description: 'Commemorating the onchain summer movement.',
    image: 'https://picsum.photos/400/400?random=3',
    price: '750000000000000000',
    ethPrice: '0.75',
    seller: '0x123f109551bD432803012645Hac136c22C789a',
    owner: '0x123f109551bD432803012645Hac136c22C789a'
  }
}

function generateFrameImageSVG(nft: NFT, action: string = 'view'): string {
  const actionText = action === 'purchase' ? 'Ready to Purchase?' : 
                    action === 'success' ? 'Purchase Successful! 🎉' : 
                    'Available on Base'

  const actionColor = action === 'purchase' ? '#f59e0b' : 
                     action === 'success' ? '#10b981' : 
                     '#3b82f6'

  return `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e40af"/>
          <stop offset="100%" style="stop-color:#7c3aed"/>
        </linearGradient>
        <linearGradient id="card" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ffffff"/>
          <stop offset="100%" style="stop-color:#f8fafc"/>
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#00000020"/>
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="1200" height="630" fill="url(#bg)"/>
      
      <!-- Decorative elements -->
      <circle cx="100" cy="100" r="60" fill="#ffffff10"/>
      <circle cx="1100" cy="530" r="80" fill="#ffffff08"/>
      
      <!-- Main card -->
      <rect x="100" y="100" width="1000" height="430" rx="24" fill="url(#card)" filter="url(#shadow)"/>
      
      <!-- NFT Image placeholder -->
      <rect x="150" y="150" width="280" height="280" rx="16" fill="#e5e7eb"/>
      <text x="290" y="310" text-anchor="middle" font-family="system-ui" font-size="60" fill="#9ca3af">🖼️</text>
      
      <!-- Content -->
      <text x="480" y="200" font-family="system-ui" font-size="36" font-weight="bold" fill="#1f2937">${nft.name}</text>
      <text x="480" y="240" font-family="system-ui" font-size="18" fill="#6b7280">${nft.description.length > 60 ? nft.description.substring(0, 60) + '...' : nft.description}</text>
      
      <!-- Price -->
      <rect x="480" y="280" width="200" height="60" rx="30" fill="${actionColor}"/>
      <text x="580" y="320" text-anchor="middle" font-family="system-ui" font-size="24" font-weight="bold" fill="white">${nft.ethPrice} ETH</text>
      
      <!-- Action text -->
      <text x="480" y="380" font-family="system-ui" font-size="20" font-weight="600" fill="${actionColor}">${actionText}</text>
      
      <!-- Base branding -->
      <text x="480" y="420" font-family="system-ui" font-size="16" fill="#64748b">Base NFT Marketplace • Farcaster Frame</text>
      
      <!-- Logo/Icon -->
      <circle cx="950" cy="200" r="40" fill="#3b82f6"/>
      <text x="950" y="215" text-anchor="middle" font-family="system-ui" font-size="30" fill="white">⚡</text>
    </svg>
  `
}

export async function GET(
  request: NextRequest,
  { params }: { params: { tokenId: string } }
) {
  const ip = request.ip || 'unknown'
  
  try {
    // Rate limit image generation (more lenient than transactions but still limited)
    SecurityUtils.checkRateLimit(ip, 30, 60000)
    
    // Validate tokenId parameter
    const validatedTokenId = validateInputSafe(tokenIdSchema, params.tokenId)
    if (!validatedTokenId) {
      console.warn(`Invalid tokenId from ${ip}: ${params.tokenId}`)
      const response = new NextResponse('Invalid token ID', { status: 400 })
      addSecurityHeaders(response)
      return response
    }
    
    const tokenId = validatedTokenId
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'view'
    
    // Validate action parameter
    const allowedActions = ['view', 'purchase', 'success', 'error']
    if (!allowedActions.includes(action)) {
      console.warn(`Invalid action from ${ip}: ${action}`)
      const response = new NextResponse('Invalid action parameter', { status: 400 })
      addSecurityHeaders(response)
      return response
    }
    
    const nft = mockNFTs[tokenId]
    
    if (!nft) {
      const response = new NextResponse('NFT not found', { status: 404 })
      addSecurityHeaders(response)
      return response
    }

    const svg = generateFrameImageSVG(nft, action)
    
    const response = new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    })
    addSecurityHeaders(response)
    return response
  } catch (error) {
    console.error('❌ Frame image generation error:', error)
    
    // Handle rate limit errors
    if (error instanceof Error && error.message.includes('Rate limit exceeded')) {
      const response = new NextResponse('Too many requests', { status: 429 })
      addSecurityHeaders(response)
      return response
    }
    
    // Don't leak error details
    const errorMessage = process.env.NODE_ENV === 'development'
      ? (error instanceof Error ? error.message : 'Unknown error')
      : 'Image generation failed'
    
    const response = new NextResponse(errorMessage, { status: 500 })
    addSecurityHeaders(response)
    return response
  }
}