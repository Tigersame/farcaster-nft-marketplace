# 🚀 FarcastMints Launch Event System

Complete launch event system with Genesis SBT NFTs, XP rewards, and token conversion.

## 🎯 Overview

### Genesis SBT (Soul Bound Token)
- **Supply**: 20,000 Genesis SBTs (first 20k users)
- **Claim**: 1 SBT per wallet address
- **Non-Transferable**: Soul Bound to your wallet forever
- **Reward**: 500 XP instant bonus + Genesis Holder badge
- **Launch Benefit**: 20% bonus tokens on conversion day

### XP System

Total XP Pool: **100,000,000,000 XP** (100 billion)

#### Ways to Earn XP:

| Activity | XP Reward | Frequency |
|----------|-----------|-----------|
| Create NFT | 100 XP | Unlimited |
| Token Swap | 100 XP | Unlimited |
| Buy NFT | 100 XP | Unlimited |
| Sell NFT | 100 XP | Unlimited |
| Daily Login | 100 XP | Once per day |
| Share Project | 100 XP | Once per day |
| Claim Genesis SBT | 500 XP | One-time |

#### Additional Badges & XP:

| Badge | XP Reward | Requirement |
|-------|-----------|-------------|
| Genesis Holder | 500 XP | Claim Genesis SBT |
| First NFT Creator | 200 XP | Create your first NFT |
| First Swap | 200 XP | Complete first swap |
| 7 Day Streak | 1,000 XP | Login 7 consecutive days |
| 30 Day Streak | 5,000 XP | Login 30 consecutive days |
| Social Influencer | 1,000 XP | Share 5 times |

### Token Conversion (Launch Day)

**Conversion Rate**: 1,000 XP = 1 Token

**Genesis SBT Bonus**: +20% tokens for Genesis holders

**Example**:
- User has 10,000 XP
- Base tokens: 10,000 / 1,000 = 10 tokens
- With Genesis SBT: 10 + (10 * 0.2) = **12 tokens**
- Without Genesis SBT: **10 tokens**

## 📁 Project Structure

```
contracts/
  GenesisSBT.sol                    # Genesis SBT smart contract
  
src/
  app/
    genesis/page.tsx                # Genesis SBT claim page
    launch/page.tsx                 # Launch event dashboard
    events/page.tsx                 # Events feed (existing)
    leaderboard/page.tsx            # Leaderboard (existing)
    
server/
  services/
    enhancedXPService.js            # Enhanced XP service with new events
    eventWatcher.js                 # Blockchain event watcher
  server.js                         # Backend API with new endpoints
  
scripts/
  deploy-genesis-sbt.ts             # Deployment script
```

## 🚀 Setup Instructions

### 1. Deploy Genesis SBT Contract

```bash
# Compile contracts
npx hardhat compile

# Deploy to Base Mainnet
npx hardhat run scripts/deploy-genesis-sbt.ts --network base

# Deploy to Base Sepolia (testnet)
npx hardhat run scripts/deploy-genesis-sbt.ts --network baseSepolia
```

### 2. Update Environment Variables

Add to `.env.local`:
```env
NEXT_PUBLIC_GENESIS_SBT_ADDRESS=0x... # Your deployed contract address
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

Add to `server/.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/farcastmints
BASE_RPC_URL=https://mainnet.base.org
MARKETPLACE_CONTRACT_ADDRESS=0x665Cf11D9B9A427c7c0ae410B7A7E6F629f5cAc5
```

### 3. Initialize Database

```bash
cd server
node scripts/init-db.js
```

### 4. Start Servers

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd server
npm run dev
```

## 🎮 User Flow

### For Users:

1. **Visit Launch Dashboard** (`/launch`)
   - See global stats
   - View XP earning opportunities
   - Check token conversion preview

2. **Claim Genesis SBT** (`/genesis`)
   - Connect wallet
   - Claim 1 Genesis SBT (if available)
   - Earn instant 500 XP + Genesis Holder badge

3. **Earn XP Daily**
   - Click "Daily Login" button → +100 XP
   - Share project on social media → +100 XP
   - Create NFTs → +100 XP each
   - Trade NFTs → +100 XP per transaction
   - Complete swaps → +100 XP each

4. **Track Progress**
   - View Events feed (`/events`)
   - Check Leaderboard ranking (`/leaderboard`)
   - Monitor XP accumulation on dashboard

5. **Launch Day - Token Conversion**
   - Admin enables token conversion
   - Users convert XP to tokens
   - Genesis holders get 20% bonus
   - SBT converts to token launch NFT

## 🔧 API Endpoints

### New XP Endpoints:

```
POST /api/xp/create-nft
Body: { address, tokenId }
Response: { total_xp, level, xp_awarded }

POST /api/xp/swap
Body: { address, txHash }
Response: { total_xp, level, xp_awarded }

POST /api/xp/daily-login
Body: { address }
Response: { total_xp, level, xp_awarded } | { alreadyClaimed: true }

POST /api/xp/share
Body: { address, platform }
Response: { total_xp, level, xp_awarded } | { alreadyClaimed: true }

POST /api/xp/genesis-sbt
Body: { address, tokenId }
Response: { total_xp, level, xp_awarded }

GET /api/users/:address/stats
Response: { total_xp, level, badges, total_transactions, today_xp, login_streak }

GET /api/token-conversion/:address
Response: { xp, baseTokens, sbtBonus, totalTokens, hasSBT, level, badges }

GET /api/stats/global
Response: { total_users, total_xp_awarded, total_xp_pool, remaining_xp_pool, average_level, highest_xp }
```

## 🎨 Frontend Integration

### Trigger XP Awards:

```typescript
// After NFT creation
await fetch(`${API_URL}/api/xp/create-nft`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ address: userAddress, tokenId: newTokenId })
})

// After swap completion
await fetch(`${API_URL}/api/xp/swap`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ address: userAddress, txHash: transaction.hash })
})

// Daily login button
await fetch(`${API_URL}/api/xp/daily-login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ address: userAddress })
})
```

## 🏆 Smart Contract Functions

### Genesis SBT Contract:

```solidity
// Claim Genesis SBT (user)
function claimGenesisSBT() external

// Check if user claimed (view)
function hasClaimedSBT(address user) external view returns (bool)

// Get total claimed (view)
function totalClaimed() external view returns (uint256)

// Get remaining supply (view)
function remainingSupply() external view returns (uint256)

// Enable token conversion (owner only)
function enableTokenConversion() external onlyOwner

// Set claiming status (owner only)
function setClaimingEnabled(bool enabled) external onlyOwner
```

## 📊 Database Schema

New tables automatically created by `init-db.js`:

- `users` - User profiles with XP and badges
- `marketplace_events` - NFT marketplace events
- `xp_transactions` - XP transaction history
- `badges` - Badge definitions
- `leaderboard` - Ranking view

## 🎯 Marketing Points

1. **Limited Genesis SBTs** - Only 20,000 available (FOMO)
2. **Passive Earning** - Daily login = 100 XP/day
3. **Active Earning** - Trading = 100-500 XP per action
4. **Bonus Rewards** - Genesis holders get 20% more tokens
5. **Gamification** - Levels, badges, leaderboard rankings
6. **Token Launch** - Convert XP to real tokens on launch day

## ⚠️ Important Notes

1. **Genesis SBTs are non-transferable** - Soul Bound to wallet
2. **Daily limits** - Login and share XP limited to once per day
3. **XP Pool** - Total 100B XP distributed among all users
4. **Token conversion** - Only available on official launch day
5. **Database required** - PostgreSQL must be running for backend

## 🚀 Launch Checklist

- [ ] Deploy Genesis SBT contract
- [ ] Verify contract on Basescan
- [ ] Upload SBT metadata to IPFS
- [ ] Update environment variables
- [ ] Initialize database
- [ ] Test all XP endpoints
- [ ] Test Genesis claim flow
- [ ] Enable claiming on contract
- [ ] Announce launch event
- [ ] Monitor for issues
- [ ] On launch day: enable token conversion

## 📞 Support

For issues or questions:
- Check backend logs: `cd server && npm run dev`
- Check frontend logs: Browser console
- Verify database connection
- Confirm contract deployment

---

Built with ❤️ for the FarcastMints community
