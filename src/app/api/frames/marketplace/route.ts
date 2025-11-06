import { NextRequest, NextResponse } from 'next/server'
import { generateFrameMetadata, createMarketplaceFrame } from '@/lib/farcaster'

export async function GET(request: NextRequest) {
  try {
    // Generate frame metadata for marketplace
    const frameMetadata = createMarketplaceFrame()
    
    // Create HTML response with frame metadata
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Farcaster NFT Marketplace</title>
          <meta property="fc:frame" content="${frameMetadata['fc:frame']}" />
          <meta property="fc:frame:image" content="${frameMetadata['fc:frame:image']}" />
          <meta property="fc:frame:button:1" content="${frameMetadata['fc:frame:button:1']}" />
          <meta property="fc:frame:button:2" content="${frameMetadata['fc:frame:button:2']}" />
          <meta property="fc:frame:button:3" content="${frameMetadata['fc:frame:button:3']}" />
          <meta property="fc:frame:post_url" content="${frameMetadata['fc:frame:post_url']}" />
          <meta property="og:title" content="Farcaster NFT Marketplace on Base" />
          <meta property="og:description" content="Discover, collect, and trade NFTs within the Farcaster ecosystem on Base network" />
          <meta property="og:image" content="${frameMetadata['fc:frame:image']}" />
        </head>
        <body>
          <h1>Farcaster NFT Marketplace</h1>
          <p>Discover, collect, and trade NFTs within the Farcaster ecosystem on Base network</p>
        </body>
      </html>
    `

    return new NextResponse(html, {
      headers: {
        'content-type': 'text/html',
      },
    })
  } catch (error) {
    console.error('Error generating marketplace frame:', error)
    return NextResponse.json({ error: 'Failed to generate frame' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { buttonIndex, inputText, fid } = body

    // Handle frame interactions
    switch (buttonIndex) {
      case 1: // Browse NFTs
        return NextResponse.redirect(new URL('/', request.url))
      case 2: // Create NFT
        return NextResponse.redirect(new URL('/create', request.url))
      case 3: // Connect Wallet
        return NextResponse.redirect(new URL('/?connect=true', request.url))
      default:
        return NextResponse.redirect(new URL('/', request.url))
    }
  } catch (error) {
    console.error('Error handling frame interaction:', error)
    return NextResponse.json({ error: 'Failed to handle interaction' }, { status: 500 })
  }
}