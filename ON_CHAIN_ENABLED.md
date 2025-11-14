# On-Chain NFT Buy/Sell/Mint Implementation

## ✅ What's Now Enabled

Your Farcaster NFT Marketplace now supports **real on-chain transactions** for buying, selling, and minting NFTs!

## 🔗 Smart Contract Integration

### Contract Details
- **Contract**: `FarcasterNFTMarketplace.sol`
- **Address**: Set in `.env.local` as `NEXT_PUBLIC_MARKETPLACE_CONTRACT`
- **Current**: `0x5FbDB2315678afecb367f032d93F642f64180aa3` (Hardhat local)
- **Features**:
  - Mint NFTs with royalties (max 10%)
  - List NFTs for sale
  - Buy NFTs with automatic fee distribution
  - Cancel listings
  - Update prices
  - Withdraw earnings

### Platform Fees
- **Platform Fee**: 2.5% (250 basis points)
- **Creator Royalty**: Up to 10% (set at mint time)
- **Fee Distribution**: Automatic on every sale

## 📝 New Files Created

### 1. `src/lib/contracts/marketplaceABI.ts`
Complete ABI for the marketplace contract with all functions and events:
- `mintNFT(metadataURI, royaltyPercentage)`
- `listNFT(tokenId, price)`
- `buyNFT(tokenId)` - payable
- `cancelListing(tokenId)`
- `updatePrice(tokenId, newPrice)`
- `withdraw()`
- Events: NFTMinted, NFTListed, NFTSold

### 2. `src/lib/contracts/useMarketplace.ts`
Custom React hooks using wagmi v2:
- `useBuyNFT()` - Purchase NFTs
- `useListNFT()` - List NFTs for sale
- `useMintNFT()` - Mint new NFTs
- `useCancelListing()` - Remove listings
- `useGetListing(tokenId)` - Get listing details
- `useGetPlatformFee()` - Get current fee

## 🎯 Updated Components

### 1. NFTCard.tsx
**Buy NFT Functionality**:
- ✅ Detects if contract is deployed
- ✅ Demo mode: Uses callback (for testing)
- ✅ Live mode: Executes on-chain `buyNFT()` transaction
- ✅ Loading states with spinner
- ✅ Success notifications
- ✅ Disabled state while processing

**Usage**:
```tsx
const { buyNFT, isLoading, isSuccess } = useBuyNFT()
buyNFT(tokenId, ethPrice) // Triggers MetaMask transaction
```

### 2. Marketplace (Sell NFTs Section)
**List NFT Functionality**:
- ✅ Token ID input
- ✅ Price input (ETH)
- ✅ Real-time fee calculation
  - Platform fee: 2.5%
  - You'll receive: 97.5% of price
- ✅ Loading states
- ✅ Success confirmation
- ✅ On-chain listing via `listNFT()`

**Usage**:
```tsx
const { listNFT, isLoading, isSuccess } = useListNFT()
listNFT(tokenId, price) // Triggers approval + listing
```

### 3. NFTMintCardEnhanced.tsx
**Mint NFT Functionality**:
- ✅ Detects contract deployment
- ✅ Demo mode: 2-second simulation
- ✅ Live mode: On-chain `mintNFT()` transaction
- ✅ Quantity selector (1-10)
- ✅ Automatic metadata URI generation
- ✅ 5% default royalty
- ✅ Loading + success states

**Usage**:
```tsx
const { mintNFT, isLoading, isSuccess } = useMintNFT()
mintNFT(metadataURI, 500) // 500 = 5% royalty
```

## 🔄 Dual Mode Operation

### Demo Mode (Default)
When contract address is `0x5FbDB2315678afecb367f032d93F642f64180aa3` or not set:
- Shows alerts with transaction details
- Simulates loading states
- No actual blockchain transactions
- Perfect for testing UI/UX

### Live Mode
When contract is deployed to Base (or other network):
- Real MetaMask pop-ups
- Actual blockchain transactions
- Gas fees apply
- Permanent on-chain records
- Event emissions

## 🚀 How to Deploy for Real Transactions

### Step 1: Deploy Contract to Base
```bash
# In your project root
npx hardhat run scripts/deploy.ts --network base
```

### Step 2: Update Environment Variable
```env
# .env.local
NEXT_PUBLIC_MARKETPLACE_CONTRACT=0xYourDeployedContractAddress
```

### Step 3: Test on Base Sepolia (Testnet)
```bash
npx hardhat run scripts/deploy-sepolia.ts --network base-sepolia
```

### Step 4: Restart Dev Server
```bash
npm run dev -- -p 3001
```

## 💡 Transaction Flows

### Buying an NFT
1. User clicks "Buy" button
2. Hook calls `buyNFT(tokenId, price)`
3. MetaMask prompts for transaction
4. User approves + pays ETH
5. Smart contract:
   - Transfers NFT to buyer
   - Calculates fees (platform 2.5% + royalty)
   - Distributes payments
6. Success notification shows
7. NFT ownership updates

### Listing an NFT
1. User enters Token ID + Price
2. Hook calls `listNFT(tokenId, price)`
3. MetaMask prompts for approval (first time)
4. User approves contract
5. MetaMask prompts for listing tx
6. Smart contract:
   - Transfers NFT to marketplace
   - Creates active listing
   - Emits NFTListed event
7. Success confirmation
8. NFT appears in marketplace

### Minting an NFT
1. User selects quantity
2. Hook calls `mintNFT(metadataURI, royalty)`
3. MetaMask prompts for transaction
4. User approves
5. Smart contract:
   - Mints new ERC-721 token
   - Sets metadata URI
   - Records creator + royalty %
   - Emits NFTMinted event
6. Success with new Token ID
7. NFT owned by minter

## 🔐 Security Features

### Built-in Protections
- ✅ ReentrancyGuard on buy function
- ✅ Price validation (must be > 0)
- ✅ Owner verification for listings
- ✅ Active listing checks
- ✅ Royalty caps (max 10%)
- ✅ Platform fee caps (max 10%)
- ✅ Withdraw pattern (pull over push)

### User Safety
- ✅ Can't buy own NFT
- ✅ Excess payment refunded
- ✅ Atomic transactions
- ✅ Event logging for transparency

## 📊 Gas Optimization

Contract uses:
- `ReentrancyGuard` for security
- Mappings for O(1) lookups
- Minimal storage slots
- Efficient fee calculations
- Pull payment pattern

## 🧪 Testing Checklist

Before deploying to mainnet:

- [ ] Deploy to Base Sepolia testnet
- [ ] Test minting NFT
- [ ] Test listing NFT
- [ ] Test buying NFT
- [ ] Test canceling listing
- [ ] Verify fee distribution
- [ ] Check royalty payments
- [ ] Test withdraw function
- [ ] Verify events emission
- [ ] Check gas costs

## 📖 User Instructions

### For Buyers
1. Connect wallet (top right)
2. Browse NFTs in marketplace
3. Click "Buy" on desired NFT
4. Approve transaction in MetaMask
5. Wait for confirmation
6. NFT appears in your wallet

### For Sellers
1. Connect wallet
2. Go to "Sell NFTs" in sidebar
3. Enter your NFT's Token ID
4. Set price in ETH
5. Review fees (2.5% platform)
6. Click "List NFT for Sale"
7. Approve in MetaMask
8. Wait for confirmation

### For Creators
1. Connect wallet
2. Go to "Create" or "Mint" page
3. Upload image + metadata
4. Set royalty (0-10%)
5. Click "Mint NFT"
6. Approve in MetaMask
7. Receive new Token ID

## 🔧 Troubleshooting

### "Transaction Failed"
- Check wallet has enough ETH for gas
- Verify you own the NFT (for listing)
- Ensure NFT isn't already listed
- Check price is greater than 0

### "MetaMask Not Popping Up"
- Ensure wallet is connected
- Check you're on correct network (Base)
- Try refreshing page
- Clear browser cache

### "Contract Not Deployed"
- Verify NEXT_PUBLIC_MARKETPLACE_CONTRACT is set
- Ensure contract deployed to current network
- Check network in MetaMask matches app

## 🎉 Success!

Your marketplace now supports:
- ✅ Real on-chain NFT minting
- ✅ Real on-chain NFT listing
- ✅ Real on-chain NFT buying
- ✅ Automatic fee distribution
- ✅ Creator royalties
- ✅ Secure withdrawals
- ✅ Full event logging

All with a seamless UX that works in both demo and live modes!
