import { NextRequest, NextResponse } from 'next/server'

interface FrameRequest {
  trustedData: {
    messageBytes: string
  }
  untrustedData: {
    fid: number
    url: string
    messageHash: string
    timestamp: number
    network: number
    buttonIndex: number
    inputText?: string
  }
}

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

// Mock NFT data - in production, fetch from your database/smart contract
const mockNFTs: Record<string, NFT> = {
  '1': {
    tokenId: '1',
    name: 'Farcaster Genesis #001',
    description: 'The first NFT in the Farcaster ecosystem on Base.',
    image: 'https://picsum.photos/400/400?random=1',
    price: '2500000000000000000',
    ethPrice: '2.5',
    seller: '0x742d35Cc6635Cc532A3Fdb1b4858b4c115D29E53',
    owner: '0x742d35Cc6635Cc532A3Fdb1b4858b4c115D29E53'
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

function generateFrameHtml(nft: NFT, action: 'view' | 'purchase' | 'success' = 'view', baseUrl: string) {
  const frameImage = `${baseUrl}/api/frames/image/${nft.tokenId}?action=${action}`
  
  let buttons = []
  let postUrl = `${baseUrl}/api/frames/nft/${nft.tokenId}`

  switch (action) {
    case 'view':
      buttons = [
        `<meta property="fc:frame:button:1" content="💎 Buy ${nft.ethPrice} ETH" />`,
        `<meta property="fc:frame:button:2" content="❤️ Like" />`,
        `<meta property="fc:frame:button:3" content="🔗 View Details" />`,
        `<meta property="fc:frame:button:4" content="📤 Share" />`
      ]
      break
    case 'purchase':
      buttons = [
        `<meta property="fc:frame:button:1" content="✅ Confirm Purchase" />`,
        `<meta property="fc:frame:button:2" content="❌ Cancel" />`
      ]
      break
    case 'success':
      buttons = [
        `<meta property="fc:frame:button:1" content="🎉 View Collection" />`,
        `<meta property="fc:frame:button:2" content="🔄 Browse More" />`
      ]
      break
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${nft.name} | Base NFT Marketplace</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${frameImage}" />
        <meta property="fc:frame:post_url" content="${postUrl}" />
        ${buttons.join('\n        ')}
        <meta property="og:title" content="${nft.name}" />
        <meta property="og:description" content="${nft.description}" />
        <meta property="og:image" content="${nft.image}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${nft.name}" />
        <meta name="twitter:description" content="${nft.description}" />
        <meta name="twitter:image" content="${nft.image}" />
      </head>
      <body>
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui;">
          <img src="${nft.image}" alt="${nft.name}" style="width: 300px; height: 300px; object-fit: cover; border-radius: 12px; margin-bottom: 20px;" />
          <h1 style="margin: 0 0 10px 0; color: #1f2937;">${nft.name}</h1>
          <p style="margin: 0 0 15px 0; color: #6b7280; text-align: center; max-width: 400px;">${nft.description}</p>
          <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 8px 16px; border-radius: 8px; font-weight: bold;">
            ${nft.ethPrice} ETH
          </div>
          <p style="margin-top: 20px; color: #9ca3af; font-size: 14px;">
            View in <a href="${baseUrl}" style="color: #3b82f6;">Base NFT Marketplace</a>
          </p>
        </div>
      </body>
    </html>
  `
}

export async function GET(request: NextRequest, { params }: { params: { tokenId: string } }) {
  const tokenId = params.tokenId
  const nft = mockNFTs[tokenId]
  
  if (!nft) {
    return NextResponse.json({ error: 'NFT not found' }, { status: 404 })
  }

  const url = new URL(request.url)
  const baseUrl = `${url.protocol}//${url.host}`
  
  const html = generateFrameHtml(nft, 'view', baseUrl)
  
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}

export async function POST(request: NextRequest, { params }: { params: { tokenId: string } }) {
  const tokenId = params.tokenId
  const nft = mockNFTs[tokenId]
  
  if (!nft) {
    return NextResponse.json({ error: 'NFT not found' }, { status: 404 })
  }

  try {
    const body: FrameRequest = await request.json()
    const { untrustedData } = body
    const { buttonIndex, fid } = untrustedData

    const url = new URL(request.url)
    const baseUrl = `${url.protocol}//${url.host}`

    // Handle button interactions
    switch (buttonIndex) {
      case 1: // Buy NFT
        // In production, initiate real purchase transaction
        console.log(`User ${fid} wants to purchase NFT ${tokenId}`)
        const purchaseHtml = generateFrameHtml(nft, 'purchase', baseUrl)
        return new NextResponse(purchaseHtml, {
          headers: { 'Content-Type': 'text/html' }
        })

      case 2: // Like NFT
        console.log(`User ${fid} liked NFT ${tokenId}`)
        // Store like in database
        const likedHtml = generateFrameHtml(nft, 'view', baseUrl)
        return new NextResponse(likedHtml, {
          headers: { 'Content-Type': 'text/html' }
        })

      case 3: // View Details
        // Redirect to main marketplace
        return NextResponse.redirect(`${baseUrl}/?nft=${tokenId}`)

      case 4: // Share NFT
        console.log(`User ${fid} shared NFT ${tokenId}`)
        const sharedHtml = generateFrameHtml(nft, 'view', baseUrl)
        return new NextResponse(sharedHtml, {
          headers: { 'Content-Type': 'text/html' }
        })

      default:
        const defaultHtml = generateFrameHtml(nft, 'view', baseUrl)
        return new NextResponse(defaultHtml, {
          headers: { 'Content-Type': 'text/html' }
        })
    }
  } catch (error) {
    console.error('Frame processing error:', error)
    const errorHtml = generateFrameHtml(nft, 'view', request.url.split('/api')[0])
    return new NextResponse(errorHtml, {
      headers: { 'Content-Type': 'text/html' }
    })
  }
}