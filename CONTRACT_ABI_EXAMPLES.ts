/**
 * 🔧 Example Contract ABIs for Common NFT Marketplace Patterns
 * 
 * Copy the appropriate ABI section to src/hooks/useBuyNFTContract.ts
 * Replace the placeholder ABI (lines 28-38) with one of these patterns
 */

// ============================================================================
// PATTERN 1: OpenSea-Style Marketplace Buy
// ============================================================================

export const OPENSEA_MARKETPLACE_ABI = [
  {
    inputs: [
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'address', name: 'nftContract', type: 'address' },
    ],
    name: 'buy',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

// Usage in hook (line 238):
// args: [BigInt(tokenId), '0xNFTContractAddress' as Address]

// ============================================================================
// PATTERN 2: Simple NFT Mint (Fixed Price)
// ============================================================================

export const SIMPLE_MINT_ABI = [
  {
    inputs: [{ internalType: 'uint256', name: 'quantity', type: 'uint256' }],
    name: 'mint',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

// Usage in hook (line 238):
// args: [BigInt(1)] // Mint 1 token

// ============================================================================
// PATTERN 3: ERC721 Marketplace Execute Sale
// ============================================================================

export const EXECUTE_SALE_ABI = [
  {
    inputs: [
      { internalType: 'uint256', name: 'listingId', type: 'uint256' },
    ],
    name: 'executeSale',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

// ============================================================================
// PATTERN 4: Zora-Style Mint with Recipient
// ============================================================================

export const ZORA_MINT_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'recipient', type: 'address' },
      { internalType: 'uint256', name: 'quantity', type: 'uint256' },
      { internalType: 'string', name: 'comment', type: 'string' },
    ],
    name: 'mintWithComment',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

// Usage in hook:
// Update buy() function to pass address:
// args: [address as Address, BigInt(1), '']

// ============================================================================
// PATTERN 5: Manifold Creator Mint
// ============================================================================

export const MANIFOLD_MINT_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'creatorContractAddress', type: 'address' },
      { internalType: 'uint256', name: 'instanceId', type: 'uint256' },
      { internalType: 'uint32', name: 'mintIndex', type: 'uint32' },
      { internalType: 'bytes32[]', name: 'merkleProof', type: 'bytes32[]' },
      { internalType: 'address', name: 'mintFor', type: 'address' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

// ============================================================================
// PATTERN 6: Fixed Price Sale Contract
// ============================================================================

export const FIXED_PRICE_SALE_ABI = [
  {
    inputs: [
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'purchase',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  // Optional: Get price function
  {
    inputs: [
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'getPrice',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

// ============================================================================
// PATTERN 7: Auction-Style Marketplace
// ============================================================================

export const AUCTION_MARKETPLACE_ABI = [
  {
    inputs: [
      { internalType: 'uint256', name: 'auctionId', type: 'uint256' },
    ],
    name: 'placeBid',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'auctionId', type: 'uint256' },
    ],
    name: 'finalizeAuction',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

// ============================================================================
// PATTERN 8: ERC1155 Multi-Edition Mint
// ============================================================================

export const ERC1155_MINT_ABI = [
  {
    inputs: [
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

// Usage:
// args: [BigInt(tokenId), BigInt(quantity)]

// ============================================================================
// PATTERN 9: Allowlist/Whitelist Mint
// ============================================================================

export const ALLOWLIST_MINT_ABI = [
  {
    inputs: [
      { internalType: 'uint256', name: 'quantity', type: 'uint256' },
      { internalType: 'bytes32[]', name: 'proof', type: 'bytes32[]' },
    ],
    name: 'mintAllowlist',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

// ============================================================================
// PATTERN 10: Thirdweb Marketplace V3
// ============================================================================

export const THIRDWEB_MARKETPLACE_ABI = [
  {
    inputs: [
      { internalType: 'uint256', name: 'listingId', type: 'uint256' },
      { internalType: 'address', name: 'buyFor', type: 'address' },
      { internalType: 'uint256', name: 'quantity', type: 'uint256' },
      { internalType: 'address', name: 'currency', type: 'address' },
      { internalType: 'uint256', name: 'expectedTotalPrice', type: 'uint256' },
    ],
    name: 'buy',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

// ============================================================================
// HELPER: Get Full ABI from Etherscan/BaseScan
// ============================================================================

/**
 * If your contract is verified on block explorer:
 * 
 * 1. Go to: https://basescan.org/address/YOUR_CONTRACT_ADDRESS
 * 2. Click "Contract" tab
 * 3. Scroll to "Contract ABI" section
 * 4. Click "Copy ABI to clipboard"
 * 5. Paste into useBuyNFTContract.ts (line 28)
 * 
 * You can also extract just the functions you need:
 */

// Example: Extract buy function from full ABI
export function extractBuyFunction(fullABI: any[]) {
  return fullABI.filter(
    (item) => item.type === 'function' && item.name === 'buy'
  )
}

// ============================================================================
// INTEGRATION INSTRUCTIONS
// ============================================================================

/**
 * TO USE THESE ABIS:
 * 
 * 1. Open: src/hooks/useBuyNFTContract.ts
 * 
 * 2. Replace lines 28-38 with one of the ABIs above
 * 
 * 3. Update CONTRACT_FUNCTION_NAME (line 51) to match:
 *    - 'buy' for marketplace patterns
 *    - 'mint' for minting patterns
 *    - 'purchase' for fixed price
 *    - 'placeBid' for auctions
 * 
 * 4. Update args in buy() function (line 238) to match ABI inputs:
 *    args: [BigInt(tokenId)] // Simple
 *    args: [BigInt(tokenId), address as Address] // With recipient
 *    args: [BigInt(1), []] // Quantity + proof
 * 
 * 5. Test on testnet first!
 */

// ============================================================================
// EXAMPLE: Complete Integration
// ============================================================================

/**
 * Let's say you have a simple marketplace with this function:
 * 
 * function buyNFT(uint256 tokenId) external payable {
 *   require(msg.value >= listings[tokenId].price);
 *   // Transfer NFT to buyer
 * }
 * 
 * YOUR STEPS:
 * 
 * 1. Copy OPENSEA_MARKETPLACE_ABI (simplified version):
 */

export const YOUR_MARKETPLACE_ABI = [
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'buyNFT',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

/**
 * 2. In useBuyNFTContract.ts:
 * 
 * Line 28: Replace MARKETPLACE_ABI with YOUR_MARKETPLACE_ABI
 * Line 51: Change to: const CONTRACT_FUNCTION_NAME = 'buyNFT' as const
 * Line 238: Keep args: [BigInt(tokenId)]
 * 
 * 3. In .env.local:
 * 
 * NEXT_PUBLIC_MARKETPLACE_CONTRACT=0xYourDeployedContractAddress
 * 
 * 4. Done! The hook will now call your buyNFT function.
 */

// ============================================================================
// DEBUGGING
// ============================================================================

/**
 * If transactions fail, add console.logs to useBuyNFTContract.ts:
 * 
 * // Line 230 (in buy function):
 * console.log('Transaction Config:', {
 *   address: MARKETPLACE_CONTRACT_ADDRESS,
 *   functionName: CONTRACT_FUNCTION_NAME,
 *   args: [BigInt(tokenId)],
 *   value: value?.toString(),
 * })
 * 
 * This will show exactly what's being sent to the contract.
 * Compare with what your contract expects.
 */

export default {
  OPENSEA_MARKETPLACE_ABI,
  SIMPLE_MINT_ABI,
  EXECUTE_SALE_ABI,
  ZORA_MINT_ABI,
  MANIFOLD_MINT_ABI,
  FIXED_PRICE_SALE_ABI,
  AUCTION_MARKETPLACE_ABI,
  ERC1155_MINT_ABI,
  ALLOWLIST_MINT_ABI,
  THIRDWEB_MARKETPLACE_ABI,
}
