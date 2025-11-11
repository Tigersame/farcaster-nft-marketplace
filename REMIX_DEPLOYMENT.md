# 🎯 Deploy with Remix IDE - Complete Guide

## Step 1: Prepare Contract File

1. Open the flattened contract file:
   - File: `FlattenedContract.sol` (already in your project)
   - Or use: `contracts/FarcasterNFTMarketplace.sol`

2. Copy the entire contract code

---

## Step 2: Open Remix IDE

1. Go to: **https://remix.ethereum.org/**
2. Create new file: `FarcasterNFTMarketplace.sol`
3. Paste your contract code

---

## Step 3: Compile Contract

### In Remix:
1. Click **"Solidity Compiler"** tab (left sidebar)
2. Select compiler version: **`0.8.20`** or higher
3. Enable **"Optimization"**: 200 runs
4. Click **"Compile FarcasterNFTMarketplace.sol"**

### Check for Errors:
- ✅ Green checkmark = Success
- ❌ Red X = Fix errors first

---

## Step 4: Connect Wallet to Base Network

### Add Base Network to MetaMask:

**Network Details:**
- **Network Name:** Base Mainnet
- **RPC URL:** `https://mainnet.base.org`
- **Chain ID:** `8453`
- **Currency Symbol:** ETH
- **Block Explorer:** `https://basescan.org`

### Or Quick Add:
Visit: **https://chainlist.org/chain/8453** and click "Add to MetaMask"

### Fund Your Wallet:
- Need **~0.005 ETH** on Base for deployment gas
- Bridge ETH from Ethereum mainnet: **https://bridge.base.org**

---

## Step 5: Deploy Contract

### In Remix:

1. Click **"Deploy & Run Transactions"** tab (left sidebar)

2. **Environment:** Select `Injected Provider - MetaMask`
   - MetaMask will popup asking to connect
   - Make sure you're on **Base Mainnet** (Chain ID: 8453)

3. **Account:** Your wallet address should show with balance

4. **Contract:** Select `FarcasterNFTMarketplace`

5. **Constructor Parameters:** (Leave empty - no constructor args needed)

6. **Gas Limit:** Auto-calculated (usually ~3,000,000)

7. Click **"Deploy"** (orange button)

### MetaMask Confirmation:
- Review gas fee (~0.003-0.005 ETH)
- Click **"Confirm"**
- Wait for transaction to complete (10-30 seconds)

### After Deployment:
- ✅ Contract appears under "Deployed Contracts"
- Copy the **contract address** (starts with 0x...)
- Copy the **transaction hash** from MetaMask

---

## Step 6: Verify Contract on Basescan

### Method 1: Remix Etherscan Plugin

1. In Remix, go to **Plugin Manager**
2. Activate **"Contract Verification - Etherscan"**
3. Click the plugin in left sidebar
4. Select your deployed contract
5. Enter Basescan API Key: `VQHM1K2KBNFYC71YHYJP8UBXJXICRJJD2P`
6. Click **"Verify"**

### Method 2: Manual Verification

1. Go to: `https://basescan.org/address/YOUR_CONTRACT_ADDRESS#code`
2. Click **"Verify and Publish"**
3. Fill in:
   - **Compiler Type:** Solidity (Single file)
   - **Compiler Version:** `v0.8.20+commit.a1b79de6`
   - **Open Source License:** MIT
4. Paste your contract code
5. Click **"Verify and Publish"**

---

## Step 7: Transfer Ownership

### In Remix Deployed Contracts:

1. Find your deployed contract
2. Expand it to see all functions
3. Find **`transferOwnership`** function
4. Enter new owner address: `0xYOUR_ADMIN_ADDRESS`
5. Click **"transact"**
6. Confirm in MetaMask

### Verify Ownership Changed:

1. Click **`owner`** function (view function)
2. Should show your new admin address

---

## Step 8: Update Your Project

### Update `.env.local`:

```bash
# Your wallet that deployed the contract
NEXT_PUBLIC_DEPLOYER_ADDRESS=0xYOUR_WALLET_ADDRESS

# Admin/Owner address (after transfer)
NEXT_PUBLIC_ADMIN_ADDRESS=0xYOUR_ADMIN_ADDRESS

# NEW contract address from Remix
NEXT_PUBLIC_MARKETPLACE_CONTRACT=0xNEW_CONTRACT_ADDRESS_FROM_REMIX

# Keep existing
NEXT_PUBLIC_NETWORK=base
NEXT_PUBLIC_ALCHEMY_API_KEY=skI70Usmhsnf0GDuGdYqj
NEXT_PUBLIC_ONCHAINKIT_API_KEY=HuxtJLcVLQ5ixxzXFDRKtvKrUr6ZuMBT
```

### Update Vercel Environment Variables:

```bash
vercel env add NEXT_PUBLIC_MARKETPLACE_CONTRACT production
# Paste: 0xYOUR_NEW_CONTRACT_ADDRESS

vercel env add NEXT_PUBLIC_DEPLOYER_ADDRESS production  
# Paste: 0xYOUR_WALLET_ADDRESS

vercel env add NEXT_PUBLIC_ADMIN_ADDRESS production
# Paste: 0xYOUR_ADMIN_ADDRESS
```

---

## Step 9: Deploy Frontend

```bash
# Build and test locally
npm run build

# If build successful, deploy
git add -A
git commit -m "deploy: new contract via Remix"
git push origin main
```

Vercel will automatically deploy when you push to main.

---

## ✅ Deployment Checklist

- [ ] Copied contract code to Remix
- [ ] Compiled with Solidity 0.8.20+
- [ ] Connected MetaMask to Base Mainnet
- [ ] Wallet funded with 0.005+ ETH on Base
- [ ] Deployed contract via Remix
- [ ] Copied contract address
- [ ] Verified contract on Basescan
- [ ] Transferred ownership to admin address
- [ ] Verified new owner with `owner()` function
- [ ] Updated `.env.local` with new contract address
- [ ] Updated Vercel environment variables
- [ ] Tested local build
- [ ] Pushed to GitHub
- [ ] Verified production deployment

---

## 🔍 Verify Deployment Success

### Check Contract on Basescan:
```
https://basescan.org/address/0xYOUR_CONTRACT_ADDRESS
```

**You should see:**
- ✅ Contract balance: 0 ETH (normal for new contract)
- ✅ Contract creator: Your wallet address
- ✅ Transactions: Deployment transaction
- ✅ Contract verified with green checkmark

### Check Contract Functions:

In Remix, call these **view functions** (free, no gas):

1. **`owner()`** → Should return your admin address
2. **`platformFeePercent()`** → Should return 250 (2.5%)
3. **`maxRoyaltyPercent()`** → Should return 1000 (10%)

### Test on Production:
```
https://farcaster-nft-marketplace-h06rk6bks-devsminiapp.vercel.app
```

Connect wallet and verify:
- Contract address shows correctly
- Can interact with marketplace features
- Transactions work properly

---

## 🚨 Troubleshooting

### "Insufficient Funds" Error
- Need more ETH on Base network
- Bridge ETH: https://bridge.base.org

### "Wrong Network" Error  
- Switch MetaMask to Base Mainnet (Chain ID: 8453)
- Check network in MetaMask dropdown

### "Gas Estimation Failed"
- Increase gas limit manually in MetaMask
- Try 4,000,000 gas limit

### "Contract Already Exists"
- Each deployment creates NEW contract
- Can't overwrite existing contract
- Use new address for each deployment

### Verification Failed
- Make sure compiler version matches exactly
- Use the SAME code that was deployed
- Check optimization settings (200 runs)

---

## 📝 Important Contract Details

**Contract Name:** `FarcasterNFTMarketplace`

**Solidity Version:** `^0.8.20`

**Constructor:** None (no parameters needed)

**Key Functions:**
- `mintNFT()` - Create new NFT
- `listNFT()` - List NFT for sale
- `buyNFT()` - Purchase listed NFT
- `cancelListing()` - Remove listing
- `transferOwnership()` - Transfer contract ownership
- `setPlatformFee()` - Change platform fee (owner only)

**Platform Fee:** 2.5% (250 basis points)

**Max Royalty:** 10% (1000 basis points)

**Network:** Base Mainnet (Chain ID: 8453)

---

## 🎉 Success!

Once deployed:

1. **Contract Address:** `0xYOUR_NEW_CONTRACT_ADDRESS`
2. **Owner:** Your admin address
3. **Status:** Verified on Basescan
4. **Frontend:** Connected and working

Your NFT marketplace is now live on Base! 🚀

---

## Need Help?

**Common Issues:**
- Remix not connecting → Refresh page and reconnect MetaMask
- Out of gas → Increase gas limit or add more ETH
- Wrong network → Double-check Chain ID is 8453
- Contract not showing → Clear Remix cache and reload

**Resources:**
- Remix Docs: https://remix-ide.readthedocs.io
- Base Docs: https://docs.base.org
- Basescan: https://basescan.org
