# 🚀 Fresh Deployment Guide - Secure Setup

## Step 1: Create New Deployer Wallet

### Option A: Using MetaMask
1. Open MetaMask
2. Click profile icon → **Create Account**
3. Name it "NFT Deployer"
4. Go to **Account Details** → **Export Private Key**
5. Copy private key (starts with 0x...)

### Option B: Using Hardhat
```bash
npx hardhat console --network base
```
```javascript
const wallet = ethers.Wallet.createRandom()
console.log("Address:", wallet.address)
console.log("Private Key:", wallet.privateKey)
```

### ⚠️ IMPORTANT: Fund Your New Wallet
Send **0.01 ETH on Base** to your new deployer address for gas fees.

---

## Step 2: Update Environment Variables

Update your `.env.local` file:

```bash
# NEW Deployer Address (the one you just created)
NEXT_PUBLIC_DEPLOYER_ADDRESS=0xYOUR_NEW_ADDRESS_HERE

# Admin/Owner Address (can be same or different)
NEXT_PUBLIC_ADMIN_ADDRESS=0xYOUR_ADMIN_ADDRESS_HERE

# Keep existing values
NEXT_PUBLIC_NETWORK=base
NEXT_PUBLIC_ALCHEMY_API_KEY=skI70Usmhsnf0GDuGdYqj
NEXT_PUBLIC_ONCHAINKIT_API_KEY=HuxtJLcVLQ5ixxzXFDRKtvKrUr6ZuMBT
# ... rest of your variables
```

**DO NOT** add `PRIVATE_KEY` to `.env.local` - we'll use it temporarily only.

---

## Step 3: Deploy New Contract

### Set Private Key (Temporary - This Session Only)

**PowerShell:**
```powershell
$env:PRIVATE_KEY = "0xYOUR_NEW_PRIVATE_KEY_HERE"

# Verify it's set
echo $env:PRIVATE_KEY
```

**Mac/Linux:**
```bash
export PRIVATE_KEY="0xYOUR_NEW_PRIVATE_KEY_HERE"
echo $PRIVATE_KEY
```

### Deploy to Base Mainnet

```bash
npx hardhat run scripts/deploy.ts --network base
```

**Expected Output:**
```
🚀 Deploying FarcasterNFTMarketplace...
📝 Deploying with account: 0xYourNewAddress
💰 Account balance: 0.01 ETH
🎉 FarcasterNFTMarketplace deployed to: 0xNEW_CONTRACT_ADDRESS
✅ Deployment complete!
```

**Copy the contract address** - you'll need it!

---

## Step 4: Transfer Ownership

Update `scripts/transfer-ownership.ts`:

```typescript
const contractAddress = "0xYOUR_NEW_CONTRACT_ADDRESS";
const newOwner = "0xYOUR_ADMIN_ADDRESS";
```

Then run:

```bash
npx hardhat run scripts/transfer-ownership.ts --network base
```

---

## Step 5: Update Contract Address

### Update `.env.local`:
```bash
NEXT_PUBLIC_MARKETPLACE_CONTRACT=0xYOUR_NEW_CONTRACT_ADDRESS
```

### Update Vercel:
```bash
vercel env add NEXT_PUBLIC_MARKETPLACE_CONTRACT production
# Paste: 0xYOUR_NEW_CONTRACT_ADDRESS

vercel env add NEXT_PUBLIC_DEPLOYER_ADDRESS production
# Paste: 0xYOUR_NEW_DEPLOYER_ADDRESS
```

---

## Step 6: Build and Deploy

```bash
# Build locally to test
npm run build

# Deploy to Vercel
git add -A
git commit -m "deploy: fresh contract deployment"
git push origin main
```

---

## Step 7: Clean Up Private Key

**PowerShell:**
```powershell
Remove-Item Env:PRIVATE_KEY

# Verify it's gone
echo $env:PRIVATE_KEY
# Should show nothing
```

**Mac/Linux:**
```bash
unset PRIVATE_KEY
echo $PRIVATE_KEY
# Should show nothing
```

---

## Step 8: Verify Deployment

### Check Contract on Basescan:
```
https://basescan.org/address/0xYOUR_NEW_CONTRACT_ADDRESS
```

### Verify Ownership:
```bash
npx hardhat console --network base
```
```javascript
const contract = await ethers.getContractAt("FarcasterNFTMarketplace", "0xYOUR_NEW_CONTRACT_ADDRESS")
const owner = await contract.owner()
console.log("Owner:", owner)
// Should show your admin address
```

### Check Production Site:
```
https://farcaster-nft-marketplace-h06rk6bks-devsminiapp.vercel.app
```

---

## ✅ Deployment Checklist

- [ ] Created new wallet and funded with 0.01 ETH
- [ ] Updated `NEXT_PUBLIC_DEPLOYER_ADDRESS` in `.env.local`
- [ ] Set `PRIVATE_KEY` as temporary environment variable
- [ ] Deployed new contract to Base Mainnet
- [ ] Transferred ownership to admin address
- [ ] Updated `NEXT_PUBLIC_MARKETPLACE_CONTRACT` in `.env.local`
- [ ] Updated Vercel environment variables
- [ ] Built and tested locally
- [ ] Pushed to GitHub (triggers Vercel deployment)
- [ ] Removed `PRIVATE_KEY` from environment
- [ ] Verified contract on Basescan
- [ ] Verified ownership is correct
- [ ] Tested production site

---

## 🔐 Security Best Practices

### ✅ DO:
- Keep private key in password manager (1Password, Bitwarden)
- Use hardware wallet (Ledger, Trezor) for large amounts
- Set private key only as temporary environment variable
- Clear private key from terminal history
- Use different wallets for deployer vs owner

### ❌ DON'T:
- Commit private keys to Git
- Share private keys in documentation
- Store private keys in `.env.local` (unless gitignored)
- Reuse compromised private keys
- Keep large amounts in hot wallets

---

## 📝 Summary

**Old (Compromised) Wallet:**
- Address: `0xc7e41f7266BA787a1344Cda4f5069A5B56f2Fa2f`
- Status: ⚠️ Private key leaked, DO NOT USE

**New Wallet:**
- Address: `0xYOUR_NEW_ADDRESS_HERE`
- Status: ✅ Secure, private key never committed

**New Contract:**
- Address: `0xYOUR_NEW_CONTRACT_ADDRESS`
- Owner: `0xYOUR_ADMIN_ADDRESS`
- Network: Base Mainnet (Chain ID: 8453)

---

## Need Help?

If deployment fails:
1. Check wallet has enough ETH (need ~0.005 ETH for gas)
2. Verify `PRIVATE_KEY` environment variable is set
3. Confirm you're on Base mainnet (not testnet)
4. Check Alchemy RPC is working

Run `npm run build` locally first to catch errors before deploying.
