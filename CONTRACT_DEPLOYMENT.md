# Smart Contract Deployment Guide

Complete guide for deploying the **FarcasterNFTMarketplace** smart contract to Base Network.

## 📋 Contract Overview

### FarcasterNFTMarketplace.sol
- **Type**: ERC-721 NFT with integrated marketplace
- **Features**:
  - ✅ Mint NFTs with IPFS metadata
  - ✅ List NFTs for sale
  - ✅ Buy/sell with automatic fee distribution
  - ✅ Creator royalties (up to 10%)
  - ✅ Platform fees (2.5% default)
  - ✅ Pending withdrawals system
  - ✅ Cancel listings
  - ✅ Update prices
- **Security**: OpenZeppelin contracts, ReentrancyGuard, Ownable
- **Gas Optimized**: 200 runs optimizer enabled

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

This installs:
- **Hardhat** - Ethereum development environment
- **@openzeppelin/contracts** - Secure smart contract library
- **@nomicfoundation/hardhat-toolbox** - Testing utilities
- **@nomicfoundation/hardhat-verify** - Contract verification
- **dotenv** - Environment variable management

### 2. Configure Environment

Add to `.env.local`:

```env
# Your private key (DO NOT COMMIT!)
PRIVATE_KEY=your_wallet_private_key_here

# Base API key for contract verification (already configured)
NEXT_PUBLIC_BASE_API_KEY=IM6NVT4S5QHBX15YXBM274QF27GFG1DSUI

# Contract address (after deployment)
NEXT_PUBLIC_MARKETPLACE_CONTRACT=

# Network selection
NEXT_PUBLIC_NETWORK=baseSepolia
```

⚠️ **IMPORTANT**: Never commit your `PRIVATE_KEY` to Git!

---

## 📦 Compilation

### Compile Contracts

```bash
npm run compile
```

This generates:
- Contract artifacts in `artifacts/`
- TypeScript types in `typechain-types/`
- ABI files for frontend integration

Expected output:
```
Compiled 1 Solidity file successfully
```

---

## 🧪 Testing (Base Sepolia Testnet)

### Step 1: Get Testnet ETH

Get free testnet ETH from:
- [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
- [Alchemy Faucet](https://sepoliafaucet.com/)

Check your balance:
```bash
npx hardhat run scripts/check-balance.ts --network baseSepolia
```

### Step 2: Deploy to Testnet

```bash
npm run deploy:sepolia
```

Expected output:
```
🧪 Deploying FarcasterNFTMarketplace to Base Sepolia testnet...

📝 Deploying with account: 0x...
💰 Account balance: 0.5 ETH

⏳ Deploying contract...
✅ FarcasterNFTMarketplace deployed to: 0xYourContractAddress

📋 Contract Details:
   - Name: Farcaster NFT
   - Symbol: FNFT
   - Platform Fee: 2.5%
   - Network: Base Sepolia Testnet

🔗 Block Explorer:
   https://sepolia.basescan.org/address/0xYourContractAddress
```

### Step 3: Verify Contract

```bash
npx hardhat verify --network baseSepolia 0xYourContractAddress
```

### Step 4: Update Environment

Add deployed address to `.env.local`:
```env
NEXT_PUBLIC_MARKETPLACE_CONTRACT=0xYourContractAddress
NEXT_PUBLIC_NETWORK=baseSepolia
```

### Step 5: Test Minting

```bash
npx hardhat run scripts/mint-test-nft.ts --network baseSepolia
```

---

## 🎯 Production Deployment (Base Mainnet)

### Prerequisites

1. **Real ETH on Base**: Minimum 0.01 ETH for deployment + gas
2. **Backup Private Key**: Store securely in password manager
3. **Tested on Sepolia**: Run full test suite first

### Step 1: Final Checks

```bash
# Run tests
npm run test:contract

# Check gas costs
REPORT_GAS=true npm run compile

# Verify configuration
cat hardhat.config.ts
```

### Step 2: Deploy to Mainnet

```bash
npm run deploy:mainnet
```

⚠️ **This uses real money! Double-check everything!**

Expected output:
```
🚀 Deploying FarcasterNFTMarketplace to Base network...

📝 Deploying with account: 0x...
💰 Account balance: 0.05 ETH

⏳ Deploying contract...
✅ FarcasterNFTMarketplace deployed to: 0xMainnetAddress

🔗 Block Explorer:
   https://basescan.org/address/0xMainnetAddress
```

### Step 3: Verify on BaseScan

```bash
npx hardhat verify --network base 0xMainnetAddress
```

### Step 4: Update Production Environment

Update `.env.local`:
```env
NEXT_PUBLIC_MARKETPLACE_CONTRACT=0xMainnetAddress
NEXT_PUBLIC_NETWORK=base
```

### Step 5: Announce Contract

Share verified contract on:
- **Warpcast**: Post contract address with verification link
- **README.md**: Update with deployed address
- **Frontend**: Update `src/lib/contracts/marketplaceContract.ts`

---

## 🔧 Contract Administration

### Update Platform Fee (Owner Only)

```typescript
// In Hardhat console
const marketplace = await ethers.getContractAt("FarcasterNFTMarketplace", contractAddress);
await marketplace.updatePlatformFee(300); // 3%
```

### Withdraw Platform Fees

```typescript
await marketplace.withdraw(); // Sends to owner address
```

### Transfer Ownership

```typescript
await marketplace.transferOwnership("0xNewOwnerAddress");
```

---

## 📊 Contract Functions

### Read Functions (Free)

```typescript
// Get marketplace stats
const stats = await marketplace.getMarketplaceStats();
// Returns: totalNFTs, totalSold, activeListings

// Get all active listings
const listings = await marketplace.getActiveListings();

// Get NFT metadata
const metadata = await marketplace.getNFTMetadata(tokenId);

// Check pending withdrawals
const pending = await marketplace.pendingWithdrawals(address);
```

### Write Functions (Costs Gas)

```typescript
// Mint NFT
await marketplace.mintNFT(metadataURI, royaltyPercentage);

// List NFT for sale
await marketplace.listNFT(tokenId, priceInWei);

// Buy NFT
await marketplace.buyNFT(tokenId, { value: priceInWei });

// Cancel listing
await marketplace.cancelListing(tokenId);

// Update price
await marketplace.updatePrice(tokenId, newPriceInWei);

// Withdraw earnings
await marketplace.withdraw();
```

---

## 🔗 Frontend Integration

### Step 1: Install Wagmi Hooks

Already installed! Check `src/lib/contracts/hooks.ts`

### Step 2: Use in Components

```typescript
import { useActiveListings, useBuyNFT } from '@/lib/contracts/hooks';

function NFTCard({ tokenId, price }: { tokenId: number, price: string }) {
  const { buyNFT, isLoading } = useBuyNFT(tokenId, price);
  
  return (
    <button onClick={() => buyNFT?.()} disabled={isLoading}>
      {isLoading ? 'Buying...' : `Buy for ${price} ETH`}
    </button>
  );
}
```

### Step 3: Replace Mock Data

Update `src/app/marketplace.tsx`:

```typescript
// OLD: Mock data
const mockNFTs = { ... };

// NEW: Real data from blockchain
const { data: listings } = useActiveListings();
```

---

## 🧪 Testing Locally

### Start Local Hardhat Node

```bash
npx hardhat node
```

### Deploy to Local Network

```bash
npx hardhat run scripts/deploy.ts --network hardhat
```

### Run Full Test Suite

```bash
npm run test:contract
```

Expected tests:
- ✅ Contract deployment
- ✅ NFT minting with royalties
- ✅ Listing NFTs
- ✅ Buying NFTs
- ✅ Fee distribution (platform + royalty)
- ✅ Withdrawals
- ✅ Cancel listings
- ✅ Access control

---

## 📈 Gas Costs (Estimated)

| Function | Base Sepolia | Base Mainnet |
|----------|--------------|--------------|
| Deploy | ~0.002 ETH | ~0.003 ETH |
| Mint NFT | ~0.0005 ETH | ~0.0008 ETH |
| List NFT | ~0.0003 ETH | ~0.0005 ETH |
| Buy NFT | ~0.0004 ETH | ~0.0006 ETH |
| Cancel Listing | ~0.0002 ETH | ~0.0003 ETH |
| Withdraw | ~0.0001 ETH | ~0.0002 ETH |

*Prices vary with network congestion*

---

## 🛡️ Security Considerations

### Auditing

Before mainnet deployment:
1. ✅ Uses OpenZeppelin audited contracts
2. ✅ ReentrancyGuard on all payable functions
3. ✅ No external calls before state changes
4. ⚠️ Consider professional audit for production

### Best Practices

- ✅ Owner controls limited to fee updates
- ✅ Pull payment pattern (no automatic transfers)
- ✅ Checks-Effects-Interactions pattern
- ✅ SafeMath not needed (Solidity 0.8.20+)

---

## 🐛 Troubleshooting

### Error: "insufficient funds"
**Solution**: Add more ETH to deployer wallet

### Error: "nonce too high"
**Solution**: Reset account in MetaMask or wait for pending transactions

### Error: "cannot estimate gas"
**Solution**: Check function parameters and contract state

### Error: "execution reverted"
**Solution**: Enable detailed errors:
```bash
npx hardhat run scripts/deploy.ts --network baseSepolia --show-stack-traces
```

---

## 📚 Additional Resources

- [Base Documentation](https://docs.base.org/)
- [Hardhat Docs](https://hardhat.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [BaseScan](https://basescan.org/)
- [Farcaster Frames](https://docs.farcaster.xyz/developers/frames)

---

## 🎉 Next Steps

After successful deployment:

1. **Update Frontend**: Replace all mock NFT data with blockchain data
2. **Test Transactions**: Mint, list, and buy NFTs on testnet
3. **Deploy to Vercel**: Share live marketplace
4. **Create Farcaster Frames**: Enable social NFT transactions
5. **Community Launch**: Announce on Warpcast with verified contract

---

## 📞 Support

Questions? Check:
- `README.md` - Project overview
- `DEPLOYMENT_READY.md` - Frontend deployment
- `ADMIN_PANEL.md` - Admin features
- `.github/copilot-instructions.md` - Development guidelines

**Contract Address**: Will be added here after deployment ⬇️
```
Base Sepolia: 0x...
Base Mainnet: 0x...
```
