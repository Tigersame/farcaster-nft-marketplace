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
  },
  '4': {
    tokenId: '4',
    name: 'Crypto Punk Revival #2847',
    description: 'A modern tribute to the original CryptoPunks with enhanced attributes.',
    image: 'https://picsum.photos/400/400?random=4',
    price: '5000000000000000000',
    ethPrice: '5.0',
    seller: '0x456d35Cc6635Cc532A3Fdb1b4858b4c115D29E78',
    owner: '0x456d35Cc6635Cc532A3Fdb1b4858b4c115D29E78'
  },
  '5': {
    tokenId: '5',
    name: 'Neural Art Genesis',
    description: 'AI-generated masterpiece created through neural networks.',
    image: 'https://picsum.photos/400/400?random=5',
    price: '1250000000000000000',
    ethPrice: '1.25',
    seller: '0x789e109551bD432803012645Hac136c22C501f',
    owner: '0x789e109551bD432803012645Hac136c22C501f'
  },
  '6': {
    tokenId: '6',
    name: 'Base Ecosystem Explorer',
    description: 'Interactive NFT showcasing the growing Base ecosystem.',
    image: 'https://picsum.photos/400/400?random=6',
    price: '800000000000000000',
    ethPrice: '0.8',
    seller: '0x321a109551bD432803012645Hac136c22C901b',
    owner: '0x321a109551bD432803012645Hac136c22C901b'
  },
  '7': {
    tokenId: '7',
    name: 'Farcaster Frame Art #42',
    description: 'First interactive frame art that responds to social interactions.',
    image: 'https://picsum.photos/400/400?random=7',
    price: '1800000000000000000',
    ethPrice: '1.8',
    seller: '0x654b109551bD432803012645Hac136c22C702c',
    owner: '0x654b109551bD432803012645Hac136c22C702c'
  },
  '8': {
    tokenId: '8',
    name: 'Onchain Music Genesis',
    description: 'Revolutionary music NFT with embedded audio.',
    image: 'https://picsum.photos/400/400?random=8',
    price: '3200000000000000000',
    ethPrice: '3.2',
    seller: '0x987c109551bD432803012645Hac136c22C203d',
    owner: '0x987c109551bD432803012645Hac136c22C203d'
  },
  '9': {
    tokenId: '9',
    name: 'Pixel Warriors #156',
    description: 'Retro-style pixel art warriors with unique battle stats.',
    image: 'https://picsum.photos/400/400?random=9',
    price: '650000000000000000',
    ethPrice: '0.65',
    seller: '0x147d109551bD432803012645Hac136c22C504e',
    owner: '0x147d109551bD432803012645Hac136c22C504e'
  },
  '10': {
    tokenId: '10',
    name: 'Base Degen Collection #001',
    description: 'Exclusive degen-themed art celebrating Base community culture.',
    image: 'https://picsum.photos/400/400?random=10',
    price: '420000000000000000',
    ethPrice: '0.42',
    seller: '0x369e109551bD432803012645Hac136c22C805f',
    owner: '0x369e109551bD432803012645Hac136c22C805f'
  },
  '11': {
    tokenId: '11',
    name: 'MetaVerse Land Plot #777',
    description: 'Premium virtual real estate in the emerging Base metaverse.',
    image: 'https://picsum.photos/400/400?random=11',
    price: '7500000000000000000',
    ethPrice: '7.5',
    seller: '0x258f109551bD432803012645Hac136c22C106g',
    owner: '0x258f109551bD432803012645Hac136c22C106g'
  },
  '12': {
    tokenId: '12',
    name: 'Animated Cosmos #99',
    description: 'Mesmerizing animated space art with particle effects.',
    image: 'https://picsum.photos/400/400?random=12',
    price: '2100000000000000000',
    ethPrice: '2.1',
    seller: '0x741g109551bD432803012645Hac136c22C407h',
    owner: '0x741g109551bD432803012645Hac136c22C407h'
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