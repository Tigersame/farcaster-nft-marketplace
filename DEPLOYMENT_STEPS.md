# 🚀 Safe Mainnet Deployment Guide

## Step-by-Step Instructions to Fix Critical Issues and Deploy

---

## 📋 PHASE 1: Fix Critical Security Issues (Required Before Deployment)

### Step 1: Remove Hardcoded API Keys

#### 1.1 Fix `src/lib/wagmi.ts`

**Current (INSECURE):**
```typescript
const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'skI70Usmhsnf0GDuGdYqj'
const tatumApiKey = process.env.NEXT_PUBLIC_TATUM_API_KEY || 't-69148b6d19acc082e210cef0-d24ea3dd27e34b1180b1e14d'
```

**Replace with (SECURE):**
```typescript
const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
const tatumApiKey = process.env.NEXT_PUBLIC_TATUM_API_KEY

if (!alchemyApiKey) {
  console.error('⚠️ NEXT_PUBLIC_ALCHEMY_API_KEY is not set')
}

if (!tatumApiKey) {
  console.error('⚠️ NEXT_PUBLIC_TATUM_API_KEY is not set')
}
```

**Action:** I can do this for you automatically

---

#### 1.2 Fix `hardhat.config.ts`

**Current (INSECURE):**
```typescript
apiKey: process.env.NEXT_PUBLIC_BASE_API_KEY || "IM6NVT4S5QHBX15YXBM274QF27GFG1DSUI"
```

**Replace with (SECURE):**
```typescript
apiKey: process.env.BASESCAN_API_KEY || "",
```

**Action:** I can do this for you automatically

---

#### 1.3 Fix `src/lib/farcaster.ts`

**Current (INSECURE):**
```typescript
const webhookSecret = process.env.FARCASTER_WEBHOOK_SECRET || 'default-secret'
```

**Replace with (SECURE):**
```typescript
const webhookSecret = process.env.FARCASTER_WEBHOOK_SECRET
if (!webhookSecret) {
  throw new Error('FARCASTER_WEBHOOK_SECRET must be configured for production')
}
```

**Action:** I can do this for you automatically

---

### Step 2: Get Real API Keys (You Must Do This Manually)

#### 2.1 Get Alchemy API Key
1. Go to https://dashboard.alchemy.com/
2. Sign up or log in
3. Create a new app for "Base Mainnet"
4. Copy the API key

#### 2.2 Get WalletConnect Project ID
1. Go to https://cloud.walletconnect.com/
2. Sign up or log in
3. Create a new project
4. Copy the Project ID

#### 2.3 Get OnchainKit/CDP API Key
1. Go to https://portal.cdp.coinbase.com/
2. Sign up or log in
3. Create API key
4. Copy the key

#### 2.4 Get BaseScan API Key (for contract verification)
1. Go to https://basescan.org/
2. Sign up and verify email
3. Go to API-KEYs section
4. Generate new API key

---

### Step 3: Create Environment Variables File

Create a file `.env.local` in your project root:

```bash
# Base Network RPC
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org

# Alchemy (from Step 2.1)
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key_here

# WalletConnect (from Step 2.2)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id_here

# OnchainKit/CDP (from Step 2.3)
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here
NEXT_PUBLIC_CDP_API_KEY=your_cdp_api_key_here

# BaseScan (from Step 2.4)
BASESCAN_API_KEY=your_basescan_api_key_here

# For deployment ONLY (NEVER commit this!)
PRIVATE_KEY=your_wallet_private_key_here

# Farcaster Hub
NEXT_PUBLIC_FARCASTER_HUB_URL=https://nemes.farcaster.xyz:2283
```

**⚠️ IMPORTANT:**
- Replace all `your_*_here` values with real keys from Step 2
- NEVER commit `.env.local` to git (it's already in `.gitignore`)
- Keep your PRIVATE_KEY secure!

---

### Step 4: Fix Smart Contract Security Issues

#### 4.1 Add Maximum Price Validation

**Edit:** `contracts/FarcasterNFTMarketplace.sol`

Add after line 20:
```solidity
uint256 public constant MAX_PRICE = 1000000 ether; // 1M ETH maximum
```

In `listNFT` function (line 95), add after price validation:
```solidity
require(price <= MAX_PRICE, "Price exceeds maximum");
```

In `updatePrice` function (line 172), add:
```solidity
require(newPrice <= MAX_PRICE, "Price exceeds maximum");
```

**Action:** I can do this for you automatically

---

#### 4.2 Reorder State Changes in buyNFT

**Edit:** `contracts/FarcasterNFTMarketplace.sol` line 113-145

Move ALL state changes BEFORE `_transfer`:

```solidity
function buyNFT(uint256 tokenId) public payable nonReentrant {
    Listing memory listing = listings[tokenId];
    require(listing.isActive, "NFT not listed");
    require(msg.value >= listing.price, "Insufficient payment");
    require(msg.sender != listing.seller, "Cannot buy own NFT");
    
    // Calculate fees FIRST
    uint256 platformFeeAmount = (listing.price * platformFee) / FEE_DENOMINATOR;
    uint256 royaltyAmount = (listing.price * nftMetadata[tokenId].royaltyPercentage) / FEE_DENOMINATOR;
    uint256 sellerAmount = listing.price - platformFeeAmount - royaltyAmount;
    
    // EFFECTS: Update ALL state BEFORE external calls
    listings[tokenId].isActive = false;
    _itemsSold++;
    
    // Update pending withdrawals
    pendingWithdrawals[listing.seller] += sellerAmount;
    pendingWithdrawals[owner()] += platformFeeAmount;
    
    if (royaltyAmount > 0) {
        address creator = nftMetadata[tokenId].creator;
        pendingWithdrawals[creator] += royaltyAmount;
        emit RoyaltyPaid(tokenId, creator, royaltyAmount);
    }
    
    // INTERACTIONS: External calls LAST
    _transfer(address(this), msg.sender, tokenId);
    
    // Refund excess payment
    if (msg.value > listing.price) {
        payable(msg.sender).transfer(msg.value - listing.price);
    }
    
    emit NFTSold(tokenId, msg.sender, listing.seller, listing.price);
}
```

**Action:** I can do this for you automatically

---

#### 4.3 Add Emergency Pause Mechanism

**Edit:** `contracts/FarcasterNFTMarketplace.sol`

At top, add import:
```solidity
import "@openzeppelin/contracts/utils/Pausable.sol";
```

Change contract declaration:
```solidity
contract FarcasterNFTMarketplace is ERC721URIStorage, ReentrancyGuard, Ownable, Pausable {
```

Add pause functions at the end:
```solidity
/**
 * @dev Pause contract in emergency
 */
function pause() public onlyOwner {
    _pause();
}

/**
 * @dev Unpause contract
 */
function unpause() public onlyOwner {
    _unpause();
}
```

Add `whenNotPaused` to critical functions:
```solidity
function listNFT(uint256 tokenId, uint256 price) public whenNotPaused {
    // ...
}

function buyNFT(uint256 tokenId) public payable nonReentrant whenNotPaused {
    // ...
}
```

**Action:** I can do this for you automatically

---

### Step 5: Add Input Validation to Smart Contract

**Edit:** `contracts/FarcasterNFTMarketplace.sol`

In `mintNFT` function (line 60), add:
```solidity
function mintNFT(
    string memory metadataURI,
    uint256 royaltyPercentage
) public returns (uint256) {
    require(bytes(metadataURI).length > 0, "URI cannot be empty");
    require(bytes(metadataURI).length <= 256, "URI too long");
    require(royaltyPercentage <= 1000, "Royalty too high");
    // ...
}
```

**Action:** I can do this for you automatically

---

## 📋 PHASE 2: Test on Sepolia Testnet (Recommended)

### Step 6: Deploy to Base Sepolia First

#### 6.1 Update Environment for Testnet

In `.env.local`, temporarily change:
```bash
NEXT_PUBLIC_BASE_RPC_URL=https://sepolia.base.org
```

#### 6.2 Get Sepolia ETH
1. Go to https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
2. Enter your wallet address
3. Get free testnet ETH

#### 6.3 Deploy Contract to Sepolia
```bash
npx hardhat run scripts/deploy.ts --network baseSepolia
```

#### 6.4 Verify Contract on BaseScan Sepolia
```bash
npx hardhat verify --network baseSepolia YOUR_CONTRACT_ADDRESS
```

#### 6.5 Test Everything
- Mint an NFT
- List it for sale
- Buy it with another wallet
- Test cancel listing
- Test price updates
- Test withdrawals

**If any issues found, fix them before mainnet!**

---

## 📋 PHASE 3: Deploy to Mainnet

### Step 7: Prepare for Mainnet Deployment

#### 7.1 Update Environment for Mainnet

In `.env.local`, change back:
```bash
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
```

#### 7.2 Get Real ETH on Base Mainnet
You'll need ETH for:
- Contract deployment (~0.01 ETH)
- Gas for transactions (~0.001-0.005 ETH per transaction)

**How to get ETH on Base:**
1. Buy ETH on Coinbase
2. Bridge to Base via https://bridge.base.org/
3. Or use Coinbase Smart Wallet (has Base built-in)

---

### Step 8: Deploy Smart Contract to Mainnet

#### 8.1 Deploy Contract
```bash
npx hardhat run scripts/deploy.ts --network base
```

**Save the contract address!** You'll need it.

#### 8.2 Verify Contract on BaseScan
```bash
npx hardhat verify --network base YOUR_CONTRACT_ADDRESS
```

This makes your contract readable on https://basescan.org/

---

### Step 9: Update Frontend with Contract Address

**Edit:** `src/lib/contracts/marketplaceContract.ts`

Update the contract address:
```typescript
export const MARKETPLACE_ADDRESS = "0xYOUR_DEPLOYED_CONTRACT_ADDRESS_HERE"
```

---

### Step 10: Deploy Frontend to Vercel

#### 10.1 Push to GitHub
```bash
git add .
git commit -m "Mainnet deployment ready"
git push origin main
```

#### 10.2 Deploy on Vercel
1. Go to https://vercel.com/
2. Import your GitHub repository
3. Add ALL environment variables from `.env.local` (except PRIVATE_KEY!)
4. Deploy

**Environment Variables to Add in Vercel:**
- `NEXT_PUBLIC_ALCHEMY_API_KEY`
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`
- `NEXT_PUBLIC_ONCHAINKIT_API_KEY`
- `NEXT_PUBLIC_CDP_API_KEY`
- `NEXT_PUBLIC_BASE_RPC_URL`
- `NEXT_PUBLIC_FARCASTER_HUB_URL`

---

## 📋 PHASE 4: Post-Deployment Checklist

### Step 11: Verify Everything Works

- [ ] Contract is deployed and verified on BaseScan
- [ ] Frontend is live on Vercel
- [ ] Can connect wallet
- [ ] Can mint NFT
- [ ] Can list NFT
- [ ] Can buy NFT
- [ ] Can cancel listing
- [ ] Withdrawals work
- [ ] Platform fees work
- [ ] Royalties work

### Step 12: Security Monitoring

Set up monitoring for:
- Unusual transaction patterns
- High gas usage
- Failed transactions
- Contract balance changes

### Step 13: Add Multi-Sig (Recommended)

Transfer contract ownership to Gnosis Safe:
1. Create Safe at https://safe.global/
2. Add 2-3 trusted addresses
3. Transfer ownership: `contract.transferOwnership(SAFE_ADDRESS)`

---

## 🚨 WHAT TO DO IF SOMETHING GOES WRONG

### If Contract Has Issues:
1. **Pause immediately**: Call `pause()` function
2. **Stop accepting new listings**
3. **Allow withdrawals only**
4. **Deploy fixed version**
5. **Migrate users**

### If Frontend Has Issues:
1. **Revert Vercel deployment** to previous version
2. **Fix locally**
3. **Test on preview URL**
4. **Deploy when fixed**

### If Keys Are Compromised:
1. **Revoke immediately** on provider dashboard
2. **Generate new keys**
3. **Update Vercel environment variables**
4. **Redeploy**

---

## 📊 Estimated Costs

### Development/Testing:
- Sepolia testnet deployment: **FREE** (testnet ETH)
- Testing transactions: **FREE**

### Mainnet Deployment:
- Contract deployment: **~0.01 ETH** (~$30)
- Contract verification: **FREE**
- Vercel hosting: **FREE** (hobby plan)
- API costs: **FREE** (within limits)
- Transaction gas: **~0.001-0.005 ETH** each (~$3-15)

### Total Initial Cost: **~$30-50**

---

## ⏱️ Estimated Timeline

- **Phase 1** (Fix Security): 2-3 hours
- **Phase 2** (Sepolia Testing): 1-2 hours  
- **Phase 3** (Mainnet Deploy): 1 hour
- **Phase 4** (Verification): 30 minutes

**Total Time: 4.5-6.5 hours**

---

## 🎯 QUICK START - Do This Now

**Option A: Let Me Fix Everything Automatically (Recommended)**
Reply with: "Yes, fix all critical issues"

I will automatically:
1. Remove hardcoded API keys
2. Fix smart contract security issues
3. Add proper validation
4. Update configurations

Then you just need to:
1. Get API keys (Step 2)
2. Create .env.local (Step 3)
3. Test on Sepolia (Step 6)
4. Deploy to mainnet (Step 8-10)

**Option B: Manual Step-by-Step**
Start with Step 1.1 above and work through each step.

---

## ❓ Need Help?

If you get stuck at any step:
1. Tell me which step you're on
2. Share the error message
3. I'll help you fix it

---

**Ready to start? Reply with:**
- "Fix all critical issues" - I'll do the code fixes automatically
- "I'll do it manually" - Follow the steps above
- "Deploy to Sepolia first" - I'll help with testnet deployment
