import { NextRequest, NextResponse } from 'next/server'
import {
  autoPopulateInteractionData,
  createPurchaseRecord,
  createLikeRecord,
  createViewRecord,
  createShareRecord,
  saveInteractionRecord,
  logButtonClick,
} from '@/lib/frameInteractions'
import { SecurityUtils } from '@/lib/security'
import { 
  createSecureHandler, 
  addSecurityHeaders, 
  getClientIP 
} from '@/lib/middleware'
import { 
  tokenIdSchema, 
  farcasterFrameSchema, 
  validateInputSafe 
} from '@/lib/validation'

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
    castId?: {
      fid: number
      hash: string
    }
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
  contractAddress?: string
  chainId?: number
  attributes?: Array<{ trait_type: string; value: string | number }>
}

// Base chain contract addresses (replace with your actual deployed contracts)
const MARKETPLACE_CONTRACT = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT || '0xE4241917A3B75C761C87BE335F392e220F67afCf'
const NFT_CONTRACT = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT || '0xE4241917A3B75C761C87BE335F392e220F67afCf'
const BASE_CHAIN_ID = 8453 // Base mainnet

// Mock NFT data - in production, fetch from blockchain
const mockNFTs: Record<string, NFT> = {
  '1': {
    tokenId: '1',
    name: 'Farcaster Genesis #001',
    description: 'The first NFT in the Farcaster ecosystem on Base.',
    image: 'https://picsum.photos/400/400?random=1',
    price: '2500000000000000000', // Wei
    ethPrice: '2.5',
    seller: process.env.NEXT_PUBLIC_ADMIN_ADDRESS || '0xEaFE5088BCd7eb27fa1e4AA417a55eD5ea2dab8B',
    owner: process.env.NEXT_PUBLIC_ADMIN_ADDRESS || '0xEaFE5088BCd7eb27fa1e4AA417a55eD5ea2dab8B',
    contractAddress: NFT_CONTRACT,
    chainId: BASE_CHAIN_ID,
    attributes: [
      { trait_type: 'Rarity', value: 'Legendary' },
      { trait_type: 'Generation', value: 1 }
    ]
  },
  '2': {
    tokenId: '2',
    name: 'Base Builder Badge',
    description: 'Limited edition builder badge for early Base network adopters.',
    image: 'https://picsum.photos/400/400?random=2',
    price: '1000000000000000000',
    ethPrice: '1.0',
    seller: '0x8ba1f109551bD432803012645Hac136c22C501e',
    owner: '0x8ba1f109551bD432803012645Hac136c22C501e',
    contractAddress: NFT_CONTRACT,
    chainId: BASE_CHAIN_ID,
    attributes: [
      { trait_type: 'Badge Type', value: 'Builder' },
      { trait_type: 'Network', value: 'Base' }
    ]
  },
  '3': {
    tokenId: '3',
    name: 'Onchain Summer Vibes',
    description: 'Commemorating the onchain summer movement.',
    image: 'https://picsum.photos/400/400?random=3',
    price: '750000000000000000',
    ethPrice: '0.75',
    seller: '0x123f109551bD432803012645Hac136c22C789a',
    owner: '0x123f109551bD432803012645Hac136c22C789a',
    contractAddress: NFT_CONTRACT,
    chainId: BASE_CHAIN_ID,
    attributes: [
      { trait_type: 'Season', value: 'Summer' },
      { trait_type: 'Theme', value: 'Onchain' }
    ]
  },
  '4': {
    tokenId: '4',
    name: 'Crypto Punk Revival #2847',
    description: 'A modern tribute to the original CryptoPunks with enhanced attributes.',
    image: 'https://picsum.photos/400/400?random=2',
    price: '1000000000000000000', // Wei
    ethPrice: '1.0',
    seller: process.env.NEXT_PUBLIC_ADMIN_ADDRESS || '0xEaFE5088BCd7eb27fa1e4AA417a55eD5ea2dab8B',
    owner: process.env.NEXT_PUBLIC_ADMIN_ADDRESS || '0xEaFE5088BCd7eb27fa1e4AA417a55eD5ea2dab8B',
    contractAddress: NFT_CONTRACT,
    chainId: BASE_CHAIN_ID,
    attributes: [
      { trait_type: 'Type', value: 'Punk' },
      { trait_type: 'Edition', value: 'Revival' },
      { trait_type: 'Number', value: '2847' }
    ]
  },
  '5': {
    tokenId: '5',
    name: 'Neural Art Genesis',
    description: 'AI-generated masterpiece created through neural networks.',
    image: 'https://picsum.photos/400/400?random=5',
    price: '1250000000000000000',
    ethPrice: '1.25',
    seller: '0x789e109551bD432803012645Hac136c22C501f',
    owner: '0x789e109551bD432803012645Hac136c22C501f',
    contractAddress: NFT_CONTRACT,
    chainId: BASE_CHAIN_ID,
    attributes: [
      { trait_type: 'Type', value: 'AI Art' },
      { trait_type: 'Algorithm', value: 'Neural Network' }
    ]
  },
  '6': {
    tokenId: '6',
    name: 'Base Ecosystem Explorer',
    description: 'Interactive NFT showcasing the growing Base ecosystem.',
    image: 'https://picsum.photos/400/400?random=6',
    price: '800000000000000000',
    ethPrice: '0.8',
    seller: '0x321a109551bD432803012645Hac136c22C901b',
    owner: '0x321a109551bD432803012645Hac136c22C901b',
    contractAddress: NFT_CONTRACT,
    chainId: BASE_CHAIN_ID,
    attributes: [
      { trait_type: 'Category', value: 'Ecosystem' },
      { trait_type: 'Interactive', value: 'Yes' }
    ]
  },
  '7': {
    tokenId: '7',
    name: 'Farcaster Frame Art #42',
    description: 'First interactive frame art that responds to social interactions.',
    image: 'https://picsum.photos/400/400?random=7',
    price: '1800000000000000000',
    ethPrice: '1.8',
    seller: '0x654b109551bD432803012645Hac136c22C702c',
    owner: '0x654b109551bD432803012645Hac136c22C702c',
    contractAddress: NFT_CONTRACT,
    chainId: BASE_CHAIN_ID,
    attributes: [
      { trait_type: 'Platform', value: 'Farcaster' },
      { trait_type: 'Interactive', value: 'Social' },
      { trait_type: 'Edition', value: '42' }
    ]
  },
  '8': {
    tokenId: '8',
    name: 'Onchain Music Genesis',
    description: 'Revolutionary music NFT with embedded audio.',
    image: 'https://picsum.photos/400/400?random=8',
    price: '3200000000000000000',
    ethPrice: '3.2',
    seller: '0x987c109551bD432803012645Hac136c22C203d',
    owner: '0x987c109551bD432803012645Hac136c22C203d',
    contractAddress: NFT_CONTRACT,
    chainId: BASE_CHAIN_ID,
    attributes: [
      { trait_type: 'Type', value: 'Music' },
      { trait_type: 'Audio', value: 'Embedded' }
    ]
  },
  '9': {
    tokenId: '9',
    name: 'Pixel Warriors #156',
    description: 'Retro-style pixel art warriors with unique battle stats.',
    image: 'https://picsum.photos/400/400?random=9',
    price: '650000000000000000',
    ethPrice: '0.65',
    seller: '0x147d109551bD432803012645Hac136c22C504e',
    owner: '0x147d109551bD432803012645Hac136c22C504e',
    contractAddress: NFT_CONTRACT,
    chainId: BASE_CHAIN_ID,
    attributes: [
      { trait_type: 'Style', value: 'Pixel Art' },
      { trait_type: 'Class', value: 'Warrior' },
      { trait_type: 'Number', value: '156' }
    ]
  },
  '10': {
    tokenId: '10',
    name: 'Base Degen Collection #001',
    description: 'Exclusive degen-themed art celebrating Base community culture.',
    image: 'https://picsum.photos/400/400?random=10',
    price: '420000000000000000',
    ethPrice: '0.42',
    seller: '0x369e109551bD432803012645Hac136c22C805f',
    owner: '0x369e109551bD432803012645Hac136c22C805f',
    contractAddress: NFT_CONTRACT,
    chainId: BASE_CHAIN_ID,
    attributes: [
      { trait_type: 'Collection', value: 'Degen' },
      { trait_type: 'Community', value: 'Base' },
      { trait_type: 'Edition', value: '001' }
    ]
  },
  '11': {
    tokenId: '11',
    name: 'MetaVerse Land Plot #777',
    description: 'Premium virtual real estate in the emerging Base metaverse.',
    image: 'https://picsum.photos/400/400?random=11',
    price: '7500000000000000000',
    ethPrice: '7.5',
    seller: '0x258f109551bD432803012645Hac136c22C106g',
    owner: '0x258f109551bD432803012645Hac136c22C106g',
    contractAddress: NFT_CONTRACT,
    chainId: BASE_CHAIN_ID,
    attributes: [
      { trait_type: 'Type', value: 'Virtual Land' },
      { trait_type: 'Location', value: 'Premium' },
      { trait_type: 'Plot', value: '777' }
    ]
  },
  '12': {
    tokenId: '12',
    name: 'Animated Cosmos #99',
    description: 'Mesmerizing animated space art with particle effects.',
    image: 'https://picsum.photos/400/400?random=12',
    price: '2100000000000000000',
    ethPrice: '2.1',
    seller: '0x741g109551bD432803012645Hac136c22C407h',
    owner: '0x741g109551bD432803012645Hac136c22C407h',
    contractAddress: NFT_CONTRACT,
    chainId: BASE_CHAIN_ID,
    attributes: [
      { trait_type: 'Type', value: 'Animated' },
      { trait_type: 'Theme', value: 'Cosmos' },
      { trait_type: 'Effects', value: 'Particle' }
    ]
  }
}

function generateFrameHtml(nft: NFT, action: 'view' | 'purchase' | 'success' | 'error' = 'view', baseUrl: string, txHash?: string) {
  const frameImage = `${baseUrl}/api/frames/image/${nft.tokenId}?action=${action}`
  
  let buttons = []
  let postUrl = `${baseUrl}/api/frames/nft/${nft.tokenId}`

  switch (action) {
    case 'view':
      // OpenSea-style buttons with proper actions
      buttons = [
        // Button 1: Transaction button for buying (fc:frame:button:1:action = "tx")
        `<meta property="fc:frame:button:1" content="💎 Buy Now ${nft.ethPrice} ETH" />`,
        `<meta property="fc:frame:button:1:action" content="tx" />`,
        `<meta property="fc:frame:button:1:target" content="${baseUrl}/api/frames/nft/${nft.tokenId}/tx" />`,
        `<meta property="fc:frame:button:1:post_url" content="${postUrl}" />`,
        
        // Button 2: Like button (standard post)
        `<meta property="fc:frame:button:2" content="❤️ Like" />`,
        `<meta property="fc:frame:button:2:action" content="post" />`,
        
        // Button 3: View on marketplace (link)
        `<meta property="fc:frame:button:3" content="🔗 View Details" />`,
        `<meta property="fc:frame:button:3:action" content="link" />`,
        `<meta property="fc:frame:button:3:target" content="${baseUrl}/?nft=${nft.tokenId}" />`,
        
        // Button 4: Share (post)
        `<meta property="fc:frame:button:4" content="📤 Share" />`,
        `<meta property="fc:frame:button:4:action" content="post" />`
      ]
      break
      
    case 'purchase':
      buttons = [
        // Confirm transaction
        `<meta property="fc:frame:button:1" content="✅ Confirm Purchase" />`,
        `<meta property="fc:frame:button:1:action" content="tx" />`,
        `<meta property="fc:frame:button:1:target" content="${baseUrl}/api/frames/nft/${nft.tokenId}/tx" />`,
        `<meta property="fc:frame:button:1:post_url" content="${postUrl}" />`,
        
        // Cancel
        `<meta property="fc:frame:button:2" content="❌ Cancel" />`,
        `<meta property="fc:frame:button:2:action" content="post" />`
      ]
      break
      
    case 'success':
      buttons = [
        // View transaction on BaseScan
        `<meta property="fc:frame:button:1" content="📜 View Transaction" />`,
        `<meta property="fc:frame:button:1:action" content="link" />`,
        `<meta property="fc:frame:button:1:target" content="https://basescan.org/tx/${txHash || '0x'}" />`,
        
        // View collection
        `<meta property="fc:frame:button:2" content="🎉 View My NFTs" />`,
        `<meta property="fc:frame:button:2:action" content="link" />`,
        `<meta property="fc:frame:button:2:target" content="${baseUrl}/my-nfts" />`,
        
        // Browse more
        `<meta property="fc:frame:button:3" content="🔄 Browse More" />`,
        `<meta property="fc:frame:button:3:action" content="post" />`,
        
        // Share purchase
        `<meta property="fc:frame:button:4" content="📢 Share Purchase" />`,
        `<meta property="fc:frame:button:4:action" content="post" />`
      ]
      break
      
    case 'error':
      buttons = [
        // Try again
        `<meta property="fc:frame:button:1" content="🔄 Try Again" />`,
        `<meta property="fc:frame:button:1:action" content="post" />`,
        
        // View marketplace
        `<meta property="fc:frame:button:2" content="🏠 Back to Marketplace" />`,
        `<meta property="fc:frame:button:2:action" content="link" />`,
        `<meta property="fc:frame:button:2:target" content="${baseUrl}" />`
      ]
      break
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${nft.name} | FarcastSea</title>
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
            View in <a href="${baseUrl}" style="color: #3b82f6;">FarcastSea</a>
          </p>
        </div>
      </body>
    </html>
  `
}

export async function GET(request: NextRequest, { params }: { params: { tokenId: string } }) {
  // Validate token ID
  const validatedTokenId = SecurityUtils.sanitizeTokenId(params.tokenId)
  if (!validatedTokenId) {
    return NextResponse.json({ error: 'Invalid token ID' }, { status: 400 })
  }

  const tokenId = validatedTokenId
  const nft = mockNFTs[tokenId]
  
  if (!nft) {
    return NextResponse.json({ error: 'NFT not found' }, { status: 404 })
  }

  const url = new URL(request.url)
  const baseUrl = `${url.protocol}//${url.host}`
  
  const html = generateFrameHtml(nft, 'view', baseUrl)
  
  const response = new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
  
  return addSecurityHeaders(response)
}

export async function POST(request: NextRequest, { params }: { params: { tokenId: string } }) {
  // Rate limiting check
  const ip = getClientIP(request)
  if (!SecurityUtils.checkRateLimit(ip, 20, 60000)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' }, 
      { status: 429 }
    )
  }

  // Validate token ID
  const validatedTokenId = SecurityUtils.sanitizeTokenId(params.tokenId)
  if (!validatedTokenId) {
    return NextResponse.json({ error: 'Invalid token ID' }, { status: 400 })
  }

  const tokenId = validatedTokenId
  const nft = mockNFTs[tokenId]
  
  if (!nft) {
    return NextResponse.json({ error: 'NFT not found' }, { status: 404 })
  }

  try {
    const body = await request.json()
    
    // Validate Farcaster frame request structure
    const validatedBody = validateInputSafe(farcasterFrameSchema, body)
    if (!validatedBody) {
      console.warn(`[SECURITY] Invalid frame request from IP: ${ip}`)
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { untrustedData } = validatedBody
    const { buttonIndex, fid, messageHash, timestamp } = untrustedData

    const url = new URL(request.url)
    const baseUrl = `${url.protocol}//${url.host}`

    // Auto-populate interaction data
    const baseInteractionData = autoPopulateInteractionData(untrustedData, nft)

    // Define button labels for logging
    const buttonLabels = ['Buy', 'Like', 'View Details', 'Share']
    const buttonLabel = buttonLabels[buttonIndex - 1] || 'Unknown'
    
    // Log button click with auto-populated data
    logButtonClick(buttonIndex, buttonLabel, fid, tokenId)

    // Handle button interactions with auto-filled data
    switch (buttonIndex) {
      case 1: // Buy NFT - Auto-populate purchase data
        const purchaseRecord = createPurchaseRecord(baseInteractionData, nft)
        await saveInteractionRecord(purchaseRecord)
        
        console.log(`💎 Purchase initiated by user ${fid}:`, purchaseRecord)
        
        const purchaseHtml = generateFrameHtml(nft, 'purchase', baseUrl)
        return addSecurityHeaders(new NextResponse(purchaseHtml, {
          headers: { 'Content-Type': 'text/html' }
        }))

      case 2: // Like NFT - Auto-populate like data
        const likeRecord = createLikeRecord(baseInteractionData, nft)
        await saveInteractionRecord(likeRecord)
        
        console.log(`❤️ Like recorded for user ${fid}:`, likeRecord)
        
        const likedHtml = generateFrameHtml(nft, 'view', baseUrl)
        return addSecurityHeaders(new NextResponse(likedHtml, {
          headers: { 'Content-Type': 'text/html' }
        }))

      case 3: // View Details - Auto-populate view data
        const viewRecord = createViewRecord(baseInteractionData, nft, 'farcaster_frame')
        await saveInteractionRecord(viewRecord)
        
        console.log(`�️ View details accessed by user ${fid}:`, viewRecord)
        
        // Redirect to main marketplace with auto-populated params
        return NextResponse.redirect(`${baseUrl}/?nft=${tokenId}&ref=frame&fid=${fid}`)

      case 4: // Share NFT - Auto-populate share data
        const shareUrl = `${baseUrl}/api/frames/nft/${tokenId}`
        const shareRecord = createShareRecord(baseInteractionData, nft, shareUrl)
        await saveInteractionRecord(shareRecord)
        
        console.log(`� Share action by user ${fid}:`, shareRecord)
        
        const sharedHtml = generateFrameHtml(nft, 'view', baseUrl)
        return addSecurityHeaders(new NextResponse(sharedHtml, {
          headers: { 'Content-Type': 'text/html' }
        }))

      default:
        console.log(`⚠️ Unknown button ${buttonIndex} clicked by user ${fid}`)
        const defaultHtml = generateFrameHtml(nft, 'view', baseUrl)
        return addSecurityHeaders(new NextResponse(defaultHtml, {
          headers: { 'Content-Type': 'text/html' }
        }))
    }
  } catch (error) {
    console.error('❌ Frame processing error:', error)
    
    // Don't leak error details in production
    const safeError = process.env.NODE_ENV === 'development' ? String(error) : 'Processing error'
    console.warn(`[SECURITY] Frame error from IP ${ip}: ${safeError}`)
    
    const errorHtml = generateFrameHtml(nft, 'view', request.url.split('/api')[0])
    return addSecurityHeaders(new NextResponse(errorHtml, {
      headers: { 'Content-Type': 'text/html' }
    }))
  }
}