# Admin System Implementation

Complete admin control system for FarcastMints NFT Marketplace with role-based access control, Gnosis Safe integration, audit logging, and analytics tracking.

## 🏗️ Architecture Overview

### Smart Contract Layer
- **AdminNFTMarketplace.sol** - Production-grade NFT marketplace contract
- OpenZeppelin AccessControl for granular permissions
- UUPS upgradeable pattern
- 5 core roles: MINTER, CURATOR, FINANCE, PAUSER, UPGRADER

### Backend API Layer
- `/api/admin/*` endpoints for all admin operations
- Analytics tracking (Segment/Amplitude)
- Audit logging (tamper-evident)
- Gnosis Safe integration for multisig

### Frontend Dashboard
- **AdminDashboard.tsx** - Comprehensive admin UI
- 8 tabs: Overview, NFT Management, Collections, Minting, Finance, Roles, Theme, Audit Log
- Real-time stats and activity feed
- Role-based access control

## 📋 Features Implemented

### ✅ Smart Contract (AdminNFTMarketplace.sol)

**Roles & Permissions:**
- `DEFAULT_ADMIN_ROLE` - Top-level admin (should be Gnosis Safe)
- `MINTER_ROLE` - Can mint NFTs (single & batch)
- `CURATOR_ROLE` - Can manage collections, set prices, delist NFTs
- `FINANCE_ROLE` - Can withdraw revenue
- `PAUSER_ROLE` - Can pause/unpause marketplace
- `UPGRADER_ROLE` - Can upgrade contract implementation

**Core Functions:**
```solidity
// Minting
mintTo(address to, string uri) → uint256 tokenId
batchMint(address to, string[] uris) → uint256[] tokenIds
whitelistMint(string uri) → uint256 tokenId

// Collections
createCollection(bytes32 id, string name, ...) 
updateCollection(bytes32 id, ...)
setRoyalty(bytes32 id, uint256 bps, address recipient)
addToCollection(uint256 tokenId, bytes32 collectionId)

// Marketplace
setPrice(uint256 tokenId, uint256 price)
batchSetPrice(uint256[] tokenIds, uint256[] prices)
delistNFT(uint256 tokenId)
removeNFT(uint256 tokenId) // burns token
purchase(uint256 tokenId) payable

// Finance
withdraw(address to, uint256 amount)
withdrawAll()
setTreasury(address newTreasury)

// Admin
pause() / unpause()
setMetadataProxy(string url)
setWhitelist(address account, bool status)
batchWhitelist(address[] accounts, bool status)
transferAdmin(address newAdmin) // ONE-TIME ONLY
```

**Events (for on-chain auditability):**
- `NFTMinted`, `NFTBatchMinted`, `NFTAdded`, `NFTRemoved`, `NFTDelisted`
- `PriceSet`, `CollectionCreated`, `CollectionUpdated`
- `ThemeUpdated`, `RevenueWithdrawn`, `MetadataProxyUpdated`
- `RoyaltySet`, `WhitelistUpdated`, `TreasuryUpdated`, `AdminTransferred`

### ✅ Admin API Endpoints

**Collections** (`/api/admin/collections`)
- `POST` - Create new collection
- `GET` - Fetch all collections

**Minting** (`/api/admin/mint`)
- `POST` - Mint single or batch NFTs

**Pricing** (`/api/admin/price`)
- `POST` - Set NFT price

**NFT Management** (`/api/admin/nft/remove`)
- `POST` - Delist or remove NFT

**Finance** (`/api/admin/withdraw`)
- `POST` - Create Gnosis Safe withdrawal proposal

**Theme** (`/api/admin/theme`)
- `POST` - Update theme settings
- `GET` - Fetch current theme

**Roles** (`/api/admin/roles`)
- `POST` - Create grant/revoke role proposal
- `GET` - List available roles

**Audit Logs** (`/api/admin/audit-logs`)
- `GET` - Retrieve audit logs with filters
- `POST` - Save audit log entry

### ✅ Utility Libraries

**Analytics (`src/lib/analytics.ts`)**
- `trackAdminMint`, `trackAdminBatchMint`
- `trackAdminCreateCollection`, `trackAdminUpdateCollection`
- `trackAdminSetPrice`, `trackAdminDelist`, `trackAdminRemoveNFT`
- `trackAdminWithdrawProposed`, `trackAdminWithdrawExecuted`
- `trackAdminSetTheme`
- `trackAdminGrantRole`, `trackAdminRevokeRole`
- `trackAdminPause`, `trackAdminUnpause`, `trackAdminSetWhitelist`
- Sends to Segment/Amplitude + Sentry breadcrumbs

**Audit Logging (`src/lib/auditLog.ts`)**
- `createAuditLog` - Create tamper-evident log entry
- `getAuditLogs` - Retrieve logs with filters
- Specific helpers: `logMint`, `logBatchMint`, `logCreateCollection`, `logSetPrice`, `logDelist`, `logWithdrawProposed`, `logWithdrawExecuted`, `logGrantRole`, `logRevokeRole`, `logPause`, `logUnpause`, `logSetTheme`
- Auto-archives to S3/IPFS (configurable)

**Gnosis Safe Integration (`src/lib/gnosisSafe.ts`)**
- `createSafeProposal` - Generic Safe transaction
- `createWithdrawProposal` - ETH withdrawal proposal
- `createContractCallProposal` - Contract function call
- `createGrantRoleProposal` - Grant role via Safe
- `createRevokeRoleProposal` - Revoke role via Safe
- `createUpgradeProposal` - Upgrade contract
- `getPendingSafeProposals`, `getSafeProposalStatus`
- `ROLES` constants (hashes for all roles)

### ✅ Admin Dashboard UI

**Tabs:**
1. **Overview** - Stats cards, recent activity feed, pending proposals
2. **NFT Management** - Set price, delist, remove NFTs
3. **Collections** - Create/update collections, set royalties
4. **Minting** - Mint single or batch NFTs
5. **Finance** - Withdraw proposals (Gnosis Safe), revenue stats
6. **Roles** - View roles and descriptions (management via Safe)
7. **Theme** - Color pickers, header style selector
8. **Audit Log** - Complete audit trail with filters

**Features:**
- Role-based access control (only shows for admin wallets)
- Floating settings button (bottom-right)
- Slide-in panel with backdrop blur
- Real-time stats dashboard
- Form validation and error handling
- Analytics and audit logging on all actions
- Responsive design

**Admin Address Configuration:**
```typescript
const ADMIN_ADDRESSES = [
  '0xcaA2dC702DdF5625296d42aa13B37458d29d2e49',
  // Add more admin addresses here
];
```

## 🚀 Deployment Guide

### 1. Deploy Smart Contract

```bash
# Install dependencies
npm install

# Deploy to Base Sepolia
npx hardhat run scripts/deploy-admin-marketplace.ts --network base-sepolia

# Verify on Basescan
npx hardhat verify --network base-sepolia <CONTRACT_ADDRESS> "FarcastMints" "FMINT" "<ADMIN_ADDRESS>" "<TREASURY_ADDRESS>"
```

### 2. Create Gnosis Safe

1. Go to [safe.global](https://safe.global)
2. Create new Safe on Base network
3. Add signers (3-of-5 or 2-of-3 recommended)
4. Fund Safe with gas fees

### 3. Transfer Admin Role to Safe

**IMPORTANT:** This is a ONE-TIME operation!

```javascript
// In Hardhat console or script
const marketplace = await ethers.getContractAt('AdminNFTMarketplace', '<CONTRACT_ADDRESS>');
const safeAddress = '<GNOSIS_SAFE_ADDRESS>';
await marketplace.transferAdmin(safeAddress);
// This revokes deployer's DEFAULT_ADMIN_ROLE and grants it to Safe
```

### 4. Configure Environment Variables

```env
# .env.local
NEXT_PUBLIC_MARKETPLACE_ADDRESS=<DEPLOYED_CONTRACT_ADDRESS>
NEXT_PUBLIC_GNOSIS_SAFE_ADDRESS=<SAFE_ADDRESS>
TREASURY_ADDRESS=<SAFE_ADDRESS>

# Optional
NEXT_PUBLIC_AUDIT_ARCHIVE_ENABLED=true
NEXT_PUBLIC_ANALYTICS_ENDPOINT=<YOUR_ANALYTICS_ENDPOINT>
```

### 5. Update Admin Dashboard

Edit `src/components/AdminDashboard.tsx`:
```typescript
const ADMIN_ADDRESSES = [
  '0xcaA2dC702DdF5625296d42aa13B37458d29d2e49', // Your address
  '0xAnotherAdminAddress...',
];
```

## 🔐 Security Best Practices

### Implemented Safeguards

✅ **Gnosis Safe Multisig**
- DEFAULT_ADMIN_ROLE transferred to Safe
- All critical actions require multiple approvals
- Timelock recommended for upgrades/large withdrawals

✅ **Role-Based Access Control**
- Granular permissions (5 distinct roles)
- Least privilege principle
- Events for all role changes

✅ **Audit Logging**
- Tamper-evident append-only logs
- Every admin action tracked
- IP address and user agent captured
- Automatic archiving to immutable storage

✅ **Analytics & Monitoring**
- All actions tracked (Segment/Amplitude)
- Sentry integration for error monitoring
- Real-time alerts on critical actions

✅ **Contract Security**
- OpenZeppelin contracts (audited)
- ReentrancyGuard on financial functions
- Pausable for emergency situations
- UUPS upgradeable (with UPGRADER_ROLE guard)

### Recommended Configurations

**Multisig Setup:**
- **2-of-3** for small teams
- **3-of-5** for production (recommended)
- **5-of-9** for large organizations

**Signers Distribution:**
- 1-2 founders
- 1-2 trusted advisors
- 1 cold storage backup

**Timelock Settings:**
- 24 hours for upgrades
- 48-72 hours for large withdrawals (>10 ETH)
- No timelock for emergency pause

## 📊 Analytics Events

All admin actions emit events to your analytics platform:

```typescript
// Minting
admin.mint { tokenId, to, txHash, userId }
admin.batch_mint { tokenIds[], to, txHash, userId, count }

// Collections
admin.create_collection { collectionId, name, userId }
admin.update_collection { collectionId, userId }
admin.set_royalty { collectionId, royaltyBps, userId }

// NFT Management
admin.set_price { tokenId, price, userId }
admin.delist { tokenId, reason?, userId }
admin.remove_nft { tokenId, reason?, userId }

// Finance
admin.withdraw_proposed { amount, to, proposalId, userId }
admin.withdraw_executed { amount, to, txHash, userId }

// Roles
admin.grant_role { role, to, txHash?, userId }
admin.revoke_role { role, from, txHash?, userId }

// Emergency
admin.pause { userId, reason?, txHash }
admin.unpause { userId, txHash }
```

## 🧪 Testing

### Run Tests
```bash
npx hardhat test
```

### Mainnet Fork Testing
```bash
# In hardhat.config.ts, enable forking
npx hardhat test --network hardhat
```

### Manual Testing Checklist

- [ ] Deploy contract to testnet
- [ ] Mint NFT (single)
- [ ] Mint NFTs (batch)
- [ ] Create collection
- [ ] Set NFT price
- [ ] Purchase NFT
- [ ] Create withdrawal proposal
- [ ] Approve proposal (via Safe UI)
- [ ] Execute proposal
- [ ] Grant role
- [ ] Revoke role
- [ ] Pause marketplace
- [ ] Unpause marketplace
- [ ] Verify all events emitted
- [ ] Check audit logs
- [ ] Verify analytics tracked

## 🛠️ Troubleshooting

### Contract Deployment Fails
- Check gas fees and account balance
- Verify RPC endpoint is working
- Ensure network is correct (Base vs Base Sepolia)

### Admin Dashboard Not Showing
- Verify wallet address in `ADMIN_ADDRESSES` array
- Check wallet connection (RainbowKit)
- Inspect browser console for errors

### Gnosis Safe Proposal Fails
- Ensure Safe has enough signers
- Verify Safe address is correct
- Check transaction data encoding
- Use Safe UI as fallback

### Audit Logs Not Saving
- Check API endpoint `/api/admin/audit-logs`
- Verify database connection (if using DB)
- Check browser network tab for failed requests

## 📝 Quick Reference

### Role Hashes
```typescript
DEFAULT_ADMIN_ROLE = 0x0000000000000000000000000000000000000000000000000000000000000000
MINTER_ROLE = keccak256("MINTER_ROLE")
CURATOR_ROLE = keccak256("CURATOR_ROLE")
FINANCE_ROLE = keccak256("FINANCE_ROLE")
PAUSER_ROLE = keccak256("PAUSER_ROLE")
UPGRADER_ROLE = keccak256("UPGRADER_ROLE")
```

### Key Contract Functions
```solidity
// Check if address has role
hasRole(bytes32 role, address account) returns (bool)

// Grant role (requires DEFAULT_ADMIN_ROLE)
grantRole(bytes32 role, address account)

// Revoke role (requires DEFAULT_ADMIN_ROLE)
revokeRole(bytes32 role, address account)

// Check current treasury
treasury() returns (address)

// Check if paused
paused() returns (bool)

// Get collection info
collections(bytes32 collectionId) returns (Collection)

// Get token price
listingPrice(uint256 tokenId) returns (uint256)
```

## 🎯 Next Steps

1. **Production Deployment**
   - Deploy to Base mainnet
   - Transfer admin to production Safe
   - Set up monitoring (Sentry, Datadog)

2. **Database Integration**
   - Replace in-memory audit logs with PostgreSQL/MongoDB
   - Add Redis caching for stats
   - Implement backup strategy

3. **Enhanced Features**
   - Scheduled actions (cron jobs)
   - Bulk import from CSV
   - Analytics dashboard (Metabase/Grafana)
   - Email notifications for proposals
   - Telegram/Discord bot for alerts

4. **Security Audit**
   - Contract audit (OpenZeppelin, Trail of Bits)
   - Penetration testing
   - Bug bounty program (Immunefi)

## 📚 Documentation

- [OpenZeppelin AccessControl](https://docs.openzeppelin.com/contracts/4.x/access-control)
- [Gnosis Safe](https://docs.safe.global/learn/safe-core)
- [Hardhat](https://hardhat.org/getting-started/)
- [Base Network](https://docs.base.org/)

## 🆘 Support

For issues or questions:
1. Check troubleshooting section above
2. Review contract events on Basescan
3. Check audit logs in admin dashboard
4. Open GitHub issue with full error details

---

**Admin System Version:** 1.0.0  
**Last Updated:** 2024  
**Maintainer:** FarcastMints Team
