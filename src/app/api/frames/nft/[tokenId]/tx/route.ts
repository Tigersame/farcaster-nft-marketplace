import { NextRequest, NextResponse } from 'next/server'
import { SecurityUtils } from '@/lib/security'
import { 
  addSecurityHeaders, 
  getClientIP 
} from '@/lib/middleware'
import { 
  tokenIdSchema, 
  validateInputSafe,
  ethereumAddressSchema,
  priceSchema,
  farcasterFrameSchema
} from '@/lib/validation'

// Base chain configuration
const BASE_CHAIN_ID = 8453 // Base mainnet
const MARKETPLACE_CONTRACT = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT || '0xE4241917A3B75C761C87BE335F392e220F67afCf'

// ABI for marketplace purchase function
const PURCHASE_ABI = [
  {
    inputs: [
      { name: 'tokenId', type: 'uint256' },
      { name: 'seller', type: 'address' }
    ],
    name: 'purchaseNFT',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  }
]

interface NFT {
  tokenId: string
  name: string
  price: string // Wei
  ethPrice: string
  seller: string
  owner: string
}

// Mock NFT data (same as main route)
const mockNFTs: Record<string, NFT> = {
  '1': {
    tokenId: '1',
    name: 'Farcaster Genesis #001',
    price: '2500000000000000000',
    ethPrice: '2.5',
    seller: process.env.NEXT_PUBLIC_ADMIN_ADDRESS || '0xEaFE5088BCd7eb27fa1e4AA417a55eD5ea2dab8B',
    owner: process.env.NEXT_PUBLIC_ADMIN_ADDRESS || '0xEaFE5088BCd7eb27fa1e4AA417a55eD5ea2dab8B'
  },
  '2': {
    tokenId: '2',
    name: 'Base Builder Badge',
    price: '1000000000000000000',
    ethPrice: '1.0',
    seller: '0x8ba1f109551bD432803012645Hac136c22C501e',
    owner: '0x8ba1f109551bD432803012645Hac136c22C501e'
  },
  '3': {
    tokenId: '3',
    name: 'Onchain Summer Vibes',
    price: '750000000000000000',
    ethPrice: '0.75',
    seller: '0x123f109551bD432803012645Hac136c22C789a',
    owner: '0x123f109551bD432803012645Hac136c22C789a'
  }
}

/**
 * Transaction endpoint for buying NFT
 * Called when user clicks "Buy Now" button with action="tx"
 * Returns transaction data for frame to execute
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { tokenId: string } }
) {
  const ip = request.ip || 'unknown'
  
  try {
    // Check rate limit - stricter for transaction generation (10 per minute)
    SecurityUtils.checkRateLimit(ip, 10, 60000)
    
    const tokenId = params.tokenId
    const nft = mockNFTs[tokenId]

    if (!nft) {
      const response = NextResponse.json(
        { error: 'NFT not found' },
        { status: 404 }
      )
      addSecurityHeaders(response)
      return response
    }

    const body = await request.json()
    
    // Validate frame data structure
    const validatedData = validateInputSafe(farcasterFrameSchema, body)
    if (!validatedData) {
      console.warn(`Invalid frame data from ${ip}`)
      const response = NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      )
      addSecurityHeaders(response)
      return response
    }
    
    const { untrustedData } = validatedData
    const buyerFid = untrustedData?.fid || 0

    console.log(`🔗 Generating transaction for user ${buyerFid} to buy NFT ${tokenId}`)

    // Encode function call data
    // purchaseNFT(uint256 tokenId, address seller)
    const functionData = encodeFunctionData(
      'purchaseNFT',
      ['uint256', 'address'],
      [tokenId, nft.seller]
    )

    // Return transaction data in Farcaster frame format
    const transactionData = {
      chainId: `eip155:${BASE_CHAIN_ID}`, // Base mainnet
      method: 'eth_sendTransaction',
      params: {
        abi: PURCHASE_ABI,
        to: MARKETPLACE_CONTRACT,
        value: nft.price, // Payment amount in wei
        data: functionData,
      },
    }

    console.log('📤 Transaction data:', {
      contract: MARKETPLACE_CONTRACT,
      tokenId,
      value: nft.ethPrice + ' ETH',
      seller: nft.seller,
      buyer: `fid:${buyerFid}`
    })

    const response = NextResponse.json(transactionData)
    addSecurityHeaders(response)
    return response
  } catch (error) {
    console.error('❌ Transaction generation error:', error)
    
    // Handle rate limit errors specifically
    if (error instanceof Error && error.message.includes('Rate limit exceeded')) {
      const response = NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
      addSecurityHeaders(response)
      return response
    }
    
    // Don't leak error details in production
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? (error instanceof Error ? error.message : 'Unknown error')
      : 'Transaction generation failed'
    
    const response = NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
    addSecurityHeaders(response)
    return response
  }
}

/**
 * Simple function data encoder
 * In production, use ethers.js or viem
 */
function encodeFunctionData(
  functionName: string,
  types: string[],
  values: any[]
): string {
  // Function signature hash (first 4 bytes of keccak256)
  const functionSignature = `${functionName}(${types.join(',')})`
  
  // For demo purposes, return a mock encoded string
  // In production, use proper ABI encoding:
  // import { encodeFunctionData } from 'viem'
  // return encodeFunctionData({ abi: PURCHASE_ABI, functionName: 'purchaseNFT', args: values })
  
  const mockEncoded = `0x${Buffer.from(functionSignature).toString('hex').slice(0, 8)}`
  console.log(`⚙️ Encoded function: ${functionSignature} -> ${mockEncoded}`)
  
  return mockEncoded
}

/**
 * GET handler for testing
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { tokenId: string } }
) {
  // Rate limiting check
  const ip = getClientIP(request)
  if (!SecurityUtils.checkRateLimit(ip, 10, 60000)) {
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

  const response = NextResponse.json({
    message: 'Transaction endpoint ready',
    nft: {
      tokenId: nft.tokenId,
      name: nft.name,
      price: nft.ethPrice + ' ETH',
      seller: nft.seller,
    },
    contract: MARKETPLACE_CONTRACT,
    chainId: BASE_CHAIN_ID,
    instructions: 'POST to this endpoint with frame data to generate transaction'
  })

  return addSecurityHeaders(response)
}
