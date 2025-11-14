# 🚀 Production NFT Card Integration Guide
## wagmi + viem + Next.js Image Optimization

Complete guide to wire up your FarcasterSea marketplace with real blockchain transactions.

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Configuration Steps](#configuration-steps)
3. [Contract Integration](#contract-integration)
4. [Blur Placeholder Generation](#blur-placeholder-generation)
5. [Grid Integration](#grid-integration)
6. [Testing](#testing)
7. [Deployment](#deployment)

---

## 🎯 Quick Start

**What's Been Set Up:**

✅ **NFTCardOptimized** - Next.js Image component with blur placeholders  
✅ **useBuyNFTContract** - Production contract interaction hook  
✅ **Blur generation script** - Auto-generate placeholders  
✅ **wagmi v2 + viem** - Already configured in providers.tsx  
✅ **Base network support** - Configured for Base mainnet

**What You Need to Do:**

1. Deploy your marketplace contract (or use existing)
2. Update contract address + ABI in `src/hooks/useBuyNFTContract.ts`
3. Generate blur placeholders for your images
4. Replace NFT cards in your marketplace pages

---

## ⚙️ Configuration Steps

### Step 1: Install Dependencies

The script requires Sharp for image processing:

```bash
npm install sharp glob fs-extra
```

### Step 2: Update Environment Variables

Edit `.env.local`:

```bash
# Replace with your actual contract address
NEXT_PUBLIC_MARKETPLACE_CONTRACT=0xYourContractAddressHere
```

### Step 3: Configure Your Contract

**File:** `src/hooks/useBuyNFTContract.ts`

**Lines 15-51** - Replace these placeholder values:

```typescript
// 1. YOUR CONTRACT ADDRESS
const MARKETPLACE_CONTRACT_ADDRESS = 
  process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT as Address || 
  '0x0000000000000000000000000000000000000000' as Address

// 2. YOUR CONTRACT ABI
const MARKETPLACE_ABI = [
  // REPLACE THIS ENTIRE ARRAY WITH YOUR ABI
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'buy', // ← Change to your function name
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

// 3. YOUR FUNCTION NAME
const CONTRACT_FUNCTION_NAME = 'buy' as const // ← Change to match ABI
```

---

## 🔧 Contract Integration

### Finding Your Contract ABI

**Option 1: From Hardhat/Foundry**

After compiling your contract:

```bash
# Hardhat
cat artifacts/contracts/YourContract.sol/YourContract.json | jq '.abi'

# Foundry
cat out/YourContract.sol/YourContract.json | jq '.abi'
```

**Option 2: From Block Explorer**

1. Go to BaseScan: https://basescan.org/address/YOUR_CONTRACT
2. Click "Contract" tab
3. Scroll to "Contract ABI"
4. Copy the JSON array

**Option 3: Manual Definition**

If you only need specific functions, define them manually:

```typescript
const MARKETPLACE_ABI = [
  // Buy function (payable)
  {
    inputs: [
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' }
    ],
    name: 'buy',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  // Mint function (if separate)
  {
    inputs: [
      { internalType: 'uint256', name: 'quantity', type: 'uint256' }
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const
```

### Common Contract Patterns

**Pattern 1: Marketplace Buy (most common)**

```typescript
// Contract: marketplace.buy(uint256 tokenId)
const CONTRACT_FUNCTION_NAME = 'buy'
// Hook automatically sends ETH value based on token.price
```

**Pattern 2: Direct Mint**

```typescript
// Contract: nft.mint(uint256 quantity)
const CONTRACT_FUNCTION_NAME = 'mint'
// Update args in useBuyNFTContract.ts line 238:
args: [BigInt(1)], // Mint 1 token
```

**Pattern 3: Marketplace Execute Sale**

```typescript
// Contract: marketplace.executeSale(uint256 listingId, address buyer)
const CONTRACT_FUNCTION_NAME = 'executeSale'
// Update args to include buyer address
```

**Pattern 4: Simple Payable (no function)**

If your contract mints on `receive()` or `fallback()`:

```typescript
// Leave CONTRACT_FUNCTION_NAME as 'buy'
// The hook will automatically fallback to sendTransaction
// (see line 247 in useBuyNFTContract.ts)
```

---

## 🎨 Blur Placeholder Generation

### Step 1: Add Images to Public Folder

Create directory and add images:

```bash
mkdir public/nfts
# Add your NFT images: public/nfts/nft1.jpg, nft2.png, etc.
```

### Step 2: Run Blur Generator

```bash
node scripts/generate-blur.js
```

**Output:**

```
🔍 Scanning for images...
📁 Images directory: C:\...\public\nfts
📸 Found 6 images
🎨 Generating blur placeholders...

✅ [1/6] nft1.jpg
✅ [2/6] nft2.png
✅ [3/6] nft3.webp
...

✨ Success! Generated 6 blur placeholders
💾 Saved to: C:\...\public\nfts\blur-map.json
```

### Step 3: Import and Use

```typescript
import blurMap from '@/public/nfts/blur-map.json'

const tokens = [
  {
    id: '1',
    name: 'Cool NFT',
    image: '/nfts/nft1.jpg',
    blurDataURL: blurMap['nft1.jpg'], // ← Auto blur!
    price: '0.5',
  },
]
```

### Alternative: Category-Based Blur

If images are on IPFS/CDN, use category gradients:

```typescript
import { getCategoryBlurDataURL } from '@/lib/blurDataURL'

const token = {
  id: '1',
  name: 'Digital Art',
  image: 'ipfs://QmXXX...',
  blurDataURL: getCategoryBlurDataURL('Art'), // Purple-cyan gradient
  price: '0.5',
}
```

**Available categories:**

- `Art` - Purple to Cyan
- `Gaming` - Red to Yellow
- `Music` - Green to Teal
- `Photography` - Orange to Red
- `Sports` - Green to Blue
- `Collectibles` - Pink to Purple
- `Utility` - Indigo to Teal

---

## 🎯 Grid Integration

### Replace Existing Cards

**Option 1: Direct Replacement**

Find your current NFT grid (likely in `src/app/marketplace.tsx`):

```typescript
// OLD CODE
import NFTCard from '@/components/NFTCard'

// Replace with:
import NFTCardOptimized from '@/components/NFTCardOptimized'

// In your grid mapping:
{tokens.map(token => (
  <NFTCardOptimized 
    key={token.id} 
    token={token}
  />
))}
```

**Option 2: Custom Buy Handler**

If you have custom buy logic:

```typescript
<NFTCardOptimized
  token={token}
  onBuy={async (token) => {
    // Your custom logic here
    await customBuyFunction(token.id, token.price)
  }}
/>
```

**Option 3: With Blur Map**

```typescript
import NFTCardOptimized from '@/components/NFTCardOptimized'
import blurMap from '@/public/nfts/blur-map.json'

function NFTGrid({ tokens }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tokens.map(token => {
        // Extract filename from path
        const imageFile = token.image?.split('/').pop()
        
        return (
          <NFTCardOptimized
            key={token.id}
            token={{
              ...token,
              blurDataURL: blurMap[imageFile] || getCategoryBlurDataURL('Art'),
            }}
          />
        )
      })}
    </div>
  )
}
```

---

## 🧪 Testing

### Test on Base Sepolia (Testnet)

**1. Update Chain in useBuyNFTContract.ts:**

```typescript
import { baseSepolia } from 'wagmi/chains'

// Line 57:
const TARGET_CHAIN = baseSepolia
```

**2. Get Testnet ETH:**

- Base Sepolia Faucet: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
- Bridge from Goerli: https://bridge.base.org/deposit

**3. Test Purchase Flow:**

1. Connect wallet to Base Sepolia
2. Click "Buy" on NFT card
3. Wallet should prompt for transaction
4. Confirm and wait for confirmation
5. Check transaction on BaseScan Sepolia

**4. Debug Mode:**

Add console logs to hook:

```typescript
// In useBuyNFTContract.ts, buy() function:
console.log('Buying NFT:', { tokenId, priceEth, value })
console.log('Contract:', MARKETPLACE_CONTRACT_ADDRESS)
console.log('Connected:', isConnected, 'Address:', address)
```

---

## 🚀 Deployment

### Pre-Deployment Checklist

- [ ] Contract deployed to Base mainnet
- [ ] Contract address updated in `.env.local`
- [ ] ABI updated in `useBuyNFTContract.ts`
- [ ] Function name matches your contract
- [ ] Tested on Base Sepolia testnet
- [ ] Blur placeholders generated
- [ ] Images configured in `next.config.js` domains
- [ ] Explorer links point to BaseScan mainnet

### Switch to Mainnet

**1. Update Chain:**

```typescript
// useBuyNFTContract.ts line 54
import { base } from 'wagmi/chains'

const TARGET_CHAIN = base // ← Mainnet
```

**2. Update Contract Address:**

```bash
# .env.local
NEXT_PUBLIC_MARKETPLACE_CONTRACT=0xYourMainnetContract
```

**3. Verify Next.js Config:**

```javascript
// next.config.js
images: {
  domains: [
    'gateway.pinata.cloud',
    'ipfs.io',
    'images.unsplash.com',
    // Add your CDN domains
  ],
}
```

**4. Deploy to Vercel:**

```bash
vercel --prod
```

Add env vars in Vercel dashboard:
- `NEXT_PUBLIC_MARKETPLACE_CONTRACT`
- (Any other env vars from `.env.local`)

---

## 🔍 Troubleshooting

### "Contract not configured" Error

**Problem:** Hook shows error about missing configuration

**Solution:**
```typescript
// Check useBuyNFTContract.ts line 15
const MARKETPLACE_CONTRACT_ADDRESS = 
  process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT as Address

// Ensure .env.local has:
NEXT_PUBLIC_MARKETPLACE_CONTRACT=0xYourActualAddress
```

### "Invalid src prop" on next/image

**Problem:** Image domain not allowed

**Solution:**
```javascript
// next.config.js
images: {
  domains: ['your-cdn.com'], // Add your domain
}
```

### Transaction Reverts

**Problem:** Transaction fails on-chain

**Common causes:**
1. Wrong function name/args in ABI
2. Insufficient ETH sent (check price)
3. Token not available/already sold
4. Contract paused/requires whitelist

**Debug:**
```typescript
// Test contract directly with ethers:
const contract = new ethers.Contract(address, abi, signer)
await contract.buy(tokenId, { value: parseEther('0.5') })
```

### "Please switch to Base network"

**Problem:** User on wrong chain

**Solution:** Hook automatically prompts to switch. Ensure:
```typescript
// useBuyNFTContract.ts line 209
if (chainId !== TARGET_CHAIN.id) {
  await switchChain?.({ chainId: TARGET_CHAIN.id })
}
```

---

## 📚 Reference Files

**Core Files You'll Edit:**

1. `src/hooks/useBuyNFTContract.ts` - Contract config (ADDRESS, ABI, FUNCTION)
2. `.env.local` - Environment variables
3. `scripts/generate-blur.js` - Blur generation
4. `src/app/marketplace.tsx` - Grid integration
5. `next.config.js` - Image domains

**Helper Libraries:**

- `src/lib/blurDataURL.ts` - Category blur generators
- `src/components/NFTCardOptimized.tsx` - Production card component
- `public/nfts/blur-map.json` - Generated blur data (auto-created)

---

## 🎓 Next Steps

1. **Deploy Contract:** Use Hardhat/Foundry to deploy to Base
2. **Update ABI:** Copy ABI from build artifacts to hook
3. **Test End-to-End:** Buy NFT on testnet
4. **Generate Blurs:** Run script for all images
5. **Integrate Grid:** Replace cards in marketplace
6. **Deploy:** Push to Vercel with env vars

---

## 💡 Pro Tips

**Performance:**
- Generate blur placeholders at build time (add to `package.json` build script)
- Use responsive image sizes in Next.js Image `sizes` prop
- Lazy load images below fold

**Security:**
- Never expose private keys in frontend
- Validate token prices server-side before purchase
- Use contract events to verify purchases
- Implement purchase limits if needed

**UX:**
- Show transaction hash + explorer link while pending
- Add toast notifications for tx status
- Disable buy button while processing
- Show gas estimates (use `estimateGas` from viem)

---

## 📞 Support

**Common Resources:**

- wagmi docs: https://wagmi.sh
- viem docs: https://viem.sh
- Next.js Image: https://nextjs.org/docs/api-reference/next/image
- Base docs: https://docs.base.org

**Your Project Structure:**

```
farcaster-nft-marketplace/
├── src/
│   ├── hooks/
│   │   └── useBuyNFTContract.ts     ← Configure contract here
│   ├── components/
│   │   └── NFTCardOptimized.tsx     ← Production card
│   ├── lib/
│   │   └── blurDataURL.ts           ← Blur generators
│   └── app/
│       └── marketplace.tsx          ← Integrate cards here
├── scripts/
│   └── generate-blur.js             ← Run to generate blurs
├── public/
│   └── nfts/
│       ├── *.{jpg,png,webp}        ← Your images
│       └── blur-map.json            ← Generated
├── .env.local                       ← Contract address
└── next.config.js                   ← Image domains
```

---

**✨ You're all set! Update the contract config and you'll have production-ready NFT transactions with optimized images.**
