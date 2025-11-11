import { NextRequest, NextResponse } from 'next/server'
import { validateFarcasterSignature } from '../../../lib/farcaster'
import { SecurityUtils } from '../../../lib/security'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-farcaster-signature')
    
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 })
    }

    // Validate the Farcaster signature
    if (!validateFarcasterSignature(body, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const data = JSON.parse(body)
    
    // Handle different webhook types
    switch (data.type) {
      case 'frame_action':
        return handleFrameAction(data)
      case 'cast_created':
        return handleCastCreated(data)
      case 'cast_liked':
        return handleCastLiked(data)
      default:
        console.log('Unknown webhook type:', data.type)
        return NextResponse.json({ success: true })
    }
    
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleFrameAction(data: any) {
  console.log('Frame action received:', data)
  
  // Handle frame interactions (buy, like, share, etc.)
  const { action, tokenId, userFid } = data
  
  switch (action) {
    case 'buy':
      // Track purchase attempt
      console.log(`User ${userFid} attempted to buy NFT ${tokenId}`)
      break
    case 'like':
      // Track like
      console.log(`User ${userFid} liked NFT ${tokenId}`)
      break
    case 'share':
      // Track share
      console.log(`User ${userFid} shared NFT ${tokenId}`)
      break
  }
  
  return NextResponse.json({ success: true })
}

async function handleCastCreated(data: any) {
  console.log('Cast created:', data)
  
  // Handle when someone creates a cast about the marketplace
  const { castHash, authorFid, text } = data
  
  // Check if the cast mentions our marketplace or NFTs
  if (text.includes('FarcastSea') || text.includes('nft')) {
    console.log(`Marketplace mention in cast ${castHash} by user ${authorFid}`)
  }
  
  return NextResponse.json({ success: true })
}

async function handleCastLiked(data: any) {
  console.log('Cast liked:', data)
  
  // Handle when someone likes a cast about the marketplace
  const { castHash, likerFid } = data
  
  console.log(`Cast ${castHash} liked by user ${likerFid}`)
  
  return NextResponse.json({ success: true })
}

export async function GET() {
  return NextResponse.json({ 
    status: 'active',
    service: 'FarcastSea Webhook',
    timestamp: new Date().toISOString()
  })
}