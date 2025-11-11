# 🔑 Address Configuration Guide

## ⚠️ IMPORTANT: Replace All Placeholder Addresses

This document lists all the addresses in your codebase that need to be replaced with YOUR own wallet and contract addresses.

---

## 📋 Addresses to Update

### 1. **Your Wallet Address** (Admin/Owner)

**Current Placeholder**: `YOUR_WALLET_ADDRESS_HERE`

**Where to Update**:

1. **`.env.local`** (Line 48)
   ```bash
   NEXT_PUBLIC_ADMIN_ADDRESS=YOUR_WALLET_ADDRESS_HERE
   ```

2. **`farcaster.config.json`** (Line 9)
   ```json
   "ownerAddress": "YOUR_WALLET_ADDRESS_HERE"
   ```

3. **`public/.well-known/farcaster.json`** (Line 8)
   ```json
   "ownerAddress": "YOUR_WALLET_ADDRESS_HERE"
   ```

---

### 2. **Your NFT Marketplace Contract** (After Deployment)

**Current Placeholder**: `YOUR_MAINNET_CONTRACT_ADDRESS_HERE`

**Where to Update**:

1. **`.env.local`** (Line 51)
   ```bash
   NEXT_PUBLIC_MARKETPLACE_CONTRACT=YOUR_MAINNET_CONTRACT_ADDRESS_HERE
   ```

2. **Update after deploying to Base Mainnet**

---

## 🎯 Demo/Example Addresses (Keep or Replace)

These are demonstration addresses used throughout the app. You can:
- **Option A**: Keep them as placeholders for demo purposes
- **Option B**: Replace with your own contract addresses after deployment

### Contract Addresses in Code:

#### **Marketplace Contract**: `0xb4703a3a73aec16e764cbd210b0fde9efdab8941`
Used in:
- `src/app/api/frames/nft/[tokenId]/route.ts` (Line 57)
- `src/app/api/frames/nft/[tokenId]/tx/route.ts` (Line 17)
- `src/components/EnhancedNFTCard.tsx` (Line 27)
- `src/components/NFTCardShowcase.tsx` (Line 12)
- `src/components/NFTMintCardShowcase.tsx` (Line 12)
- `src/components/NFTCreator.tsx` (Line 395)

#### **Demo NFT Contract**: `0x1234567890123456789012345678901234567890`
Used in:
- `src/app/api/frames/nft/[tokenId]/route.ts` (Line 58)
- `src/components/TransactionWrapper.tsx` (Line 33)
- `src/components/NFTCreator.tsx` (Line 355)
- `src/components/NFTCardShowcase.tsx` (Line 18)
- `src/components/NFTMintCardShowcase.tsx` (Line 16)

#### **Other Demo Contracts**:
- `0xed2f34043387783b2727ff2799a46ce3ae1a34d2` - Used in NFTCreator & NFTMintCardShowcase
- `0x877f0f3fef81c28a8c40fe060b17d254003377ad` - Used in NFTCreator & NFTMintCardShowcase
- `0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD` - Used in SwapEnhanced (Uniswap Router)

---

## 🪙 Token Addresses (Standard - Keep These)

These are official token addresses on Base mainnet - **DO NOT CHANGE**:

### **USDC on Base**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
Used in:
- `src/components/SwapEnhanced.tsx` (Line 110)
- `src/components/SwapShowcase.tsx` (Line 21)
- `src/components/MiniAppActions.tsx` (Line 39)
- `src/components/MiniAppDemo.tsx` (Line 266)
- `src/lib/spend-permissions.ts` (Line 8)
- `src/lib/erc20-gas.ts` (Line 20)

### **WETH on Base**: `0x4200000000000000000000000000000000000006`
Used in:
- `src/components/SwapEnhanced.tsx` (Line 119)
- `src/components/SwapShowcase.tsx` (Line 30)

### **ETH (Zero Address)**: `0x0000000000000000000000000000000000000000`
Used in:
- `src/components/MiniAppActions.tsx` (Line 38) - Represents native ETH
- `src/lib/contracts/marketplaceContract.ts` (Line 34) - Placeholder for unset contract

---

## 👥 Example Seller/Owner Addresses

These are fake addresses used for demo NFTs. You can leave them or replace with real addresses:

- `0x742d35Cc6635Cc532A3Fdb1b4858b4c115D29E53` - Used in marketplace.tsx, frame routes
- `0x456d35Cc6635Cc532A3Fdb1b4858b4c115D29E78` - Alternative demo seller
- `0x0987654321098765432109876543210987654321` - Demo owner address
- `0x1234567890123456789012345678901234567890` - Generic placeholder
- `0x9876543210987654321098765432109876543210` - Alternative creator
- `0x1111222233334444555566667777888899990000` - Another demo creator

---

## 🖼️ Famous NFT Collection Addresses (Reference Only)

These are used for live data demos - **DO NOT CHANGE**:

- **Bored Ape Yacht Club**: `0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d`
- **CryptoPunks**: `0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb`
- **Doodles**: `0x8a90cab2b38dba80c64b7734e58ee1db38b8992e`
- **Moonbirds**: `0x23581767a106ae21c074b2276d25e5c3e136a68b`
- **CloneX**: `0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b`
- **Otherdeeds**: `0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258`
- **VeeFriends**: `0xa3aee8bce55beea1951ef834b99f3ac60d1abeeb`
- **Azuki**: `0xed5af388653567af2f388e6224dc7c4b3241c544`

---

## 🔧 System Addresses (Keep These)

### **CDP Paymaster Address**: `0x2FAEB0760D4230Ef2aC21496Bb4F0b47D634FD4c`
- Used for sponsored transactions
- Official Coinbase paymaster
- **DO NOT CHANGE**

### **EntryPoint v0.6**: `0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789`
- ERC-4337 account abstraction
- **DO NOT CHANGE**

---

## 📝 How to Update Your Addresses

### Step 1: Get Your Wallet Address
```bash
# From MetaMask: Click your account → Copy address
# Example: 0xYourWalletAddressHere
```

### Step 2: Deploy Your Marketplace Contract
```bash
# Deploy to Base Mainnet
npx hardhat run scripts/deploy.ts --network base

# Copy the deployed contract address
# Example: 0xYourDeployedContractAddress
```

### Step 3: Update Environment Variables
```bash
# Edit .env.local
NEXT_PUBLIC_ADMIN_ADDRESS=0xYourWalletAddressHere
NEXT_PUBLIC_MARKETPLACE_CONTRACT=0xYourDeployedContractAddress
```

### Step 4: Update Farcaster Config Files
```json
// Edit farcaster.config.json and public/.well-known/farcaster.json
"ownerAddress": "0xYourWalletAddressHere"
```

### Step 5: Update Contract References (Optional)
If you want to use your own contracts instead of demos:

```bash
# Search for demo contracts
grep -r "0xb4703a3a73aec16e764cbd210b0fde9efdab8941" src/

# Replace with your contract address
```

### Step 6: Rebuild and Deploy
```bash
# Clean build
rm -r .next

# Build with new addresses
npm run build

# Deploy to Vercel
vercel --prod
```

---

## ✅ Verification Checklist

After updating addresses:

- [ ] `.env.local` has YOUR wallet address
- [ ] `.env.local` has YOUR deployed contract address
- [ ] `farcaster.config.json` has YOUR wallet address
- [ ] `public/.well-known/farcaster.json` has YOUR wallet address
- [ ] Contract deployed to Base Mainnet
- [ ] Contract verified on Basescan
- [ ] Environment variables set in Vercel
- [ ] Application rebuilt and redeployed
- [ ] Admin panel accessible with YOUR wallet

---

## ⚠️ Security Notes

1. **Never commit private keys** to git
2. **Never hardcode** wallet private keys in code
3. **Use environment variables** for all sensitive data
4. **Verify contract** on Basescan before mainnet use
5. **Test thoroughly** on testnet before mainnet deployment

---

## 🆘 Need Help?

If you're unsure which addresses to update:

1. **Must Update**: Your wallet address and marketplace contract
2. **Optional**: Demo NFT contract addresses
3. **Never Change**: Token addresses (USDC, WETH), system addresses (paymaster, entrypoint)

**Contact**: Check the README for support links
