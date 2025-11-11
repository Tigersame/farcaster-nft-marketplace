import { NextRequest, NextResponse } from 'next/server'
import { generateFrameMetadata, createMarketplaceFrame } from '@/lib/farcaster'
import { SecurityUtils } from '@/lib/security'
import { addSecurityHeaders } from '@/lib/middleware'
import { validateInputSafe, farcasterFrameSchema } from '@/lib/validation'

export async function GET(request: NextRequest) {
  const ip = request.ip || 'unknown'
  
  try {
    // Rate limit marketplace frame requests
    SecurityUtils.checkRateLimit(ip, 50, 60000)
    
    // Generate frame metadata for marketplace
    const frameMetadata = createMarketplaceFrame()
    
    // Create HTML response with frame metadata
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>FarcastSea</title>
          <meta property="fc:frame" content="${frameMetadata['fc:frame']}" />
          <meta property="fc:frame:image" content="${frameMetadata['fc:frame:image']}" />
          <meta property="fc:frame:button:1" content="${frameMetadata['fc:frame:button:1']}" />
          <meta property="fc:frame:button:2" content="${frameMetadata['fc:frame:button:2']}" />
          <meta property="fc:frame:button:3" content="${frameMetadata['fc:frame:button:3']}" />
          <meta property="fc:frame:post_url" content="${frameMetadata['fc:frame:post_url']}" />
          <meta property="og:title" content="FarcastSea on Base" />
          <meta property="og:description" content="Discover, collect, and trade NFTs within the Farcaster ecosystem on Base network" />
          <meta property="og:image" content="${frameMetadata['fc:frame:image']}" />
        </head>
        <body>
          <h1>FarcastSea</h1>
          <p>Discover, collect, and trade NFTs within the Farcaster ecosystem on Base network</p>
        </body>
      </html>
    `

    const response = new NextResponse(html, {
      headers: {
        'content-type': 'text/html',
      },
    })
    addSecurityHeaders(response)
    return response
  } catch (error) {
    console.error('Error generating marketplace frame:', error)
    
    // Handle rate limit errors
    if (error instanceof Error && error.message.includes('Rate limit exceeded')) {
      const response = NextResponse.json({ error: 'Too many requests' }, { status: 429 })
      addSecurityHeaders(response)
      return response
    }
    
    // Don't leak error details in production
    const errorMessage = process.env.NODE_ENV === 'development'
      ? (error instanceof Error ? error.message : 'Unknown error')
      : 'Failed to generate frame'
    
    const response = NextResponse.json({ error: errorMessage }, { status: 500 })
    addSecurityHeaders(response)
    return response
  }
}

export async function POST(request: NextRequest) {
  const ip = request.ip || 'unknown'
  
  try {
    // Rate limit frame interactions
    SecurityUtils.checkRateLimit(ip, 30, 60000)
    
    const body = await request.json()
    
    // Validate frame interaction data
    const validatedData = validateInputSafe(farcasterFrameSchema, body)
    if (!validatedData) {
      console.warn(`Invalid frame interaction from ${ip}`)
      const response = NextResponse.json({ error: 'Invalid request format' }, { status: 400 })
      addSecurityHeaders(response)
      return response
    }
    
    const { buttonIndex, inputText, fid } = validatedData.untrustedData || {}

    // Validate button index
    if (!buttonIndex || buttonIndex < 1 || buttonIndex > 3) {
      console.warn(`Invalid button index from ${ip}: ${buttonIndex}`)
      const response = NextResponse.json({ error: 'Invalid button index' }, { status: 400 })
      addSecurityHeaders(response)
      return response
    }

    let redirectUrl: string
    // Handle frame interactions
    switch (buttonIndex) {
      case 1: // Browse NFTs
        redirectUrl = new URL('/', request.url).toString()
        break
      case 2: // Create NFT
        redirectUrl = new URL('/create', request.url).toString()
        break
      case 3: // Connect Wallet
        redirectUrl = new URL('/?connect=true', request.url).toString()
        break
      default:
        redirectUrl = new URL('/', request.url).toString()
    }
    
    const response = NextResponse.redirect(redirectUrl)
    addSecurityHeaders(response)
    return response
  } catch (error) {
    console.error('Error handling frame interaction:', error)
    
    // Handle rate limit errors
    if (error instanceof Error && error.message.includes('Rate limit exceeded')) {
      const response = NextResponse.json({ error: 'Too many requests' }, { status: 429 })
      addSecurityHeaders(response)
      return response
    }
    
    // Don't leak error details in production
    const errorMessage = process.env.NODE_ENV === 'development'
      ? (error instanceof Error ? error.message : 'Unknown error')
      : 'Failed to handle interaction'
    
    const response = NextResponse.json({ error: errorMessage }, { status: 500 })
    addSecurityHeaders(response)
    return response
  }
}