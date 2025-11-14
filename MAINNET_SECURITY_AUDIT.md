# 🔒 Mainnet Launch Security Audit Report
**Generated:** November 13, 2025  
**Project:** Farcaster NFT Marketplace (FarcastSea)  
**Auditor:** Pre-Launch Automated Security Review  
**Status:** ⚠️ REQUIRES ATTENTION BEFORE MAINNET DEPLOYMENT

---

## 📋 Executive Summary

This comprehensive security audit identifies **CRITICAL**, **HIGH**, **MEDIUM**, and **LOW** risk issues that must be addressed before deploying to mainnet.

### Risk Summary
- 🔴 **CRITICAL**: 3 issues
- 🟠 **HIGH**: 5 issues  
- 🟡 **MEDIUM**: 4 issues
- 🟢 **LOW**: 3 issues
- ℹ️ **INFO**: 7 items

**Overall Risk Level:** 🔴 **HIGH** - DO NOT DEPLOY TO MAINNET WITHOUT FIXES

---

## 🔴 CRITICAL ISSUES (Must Fix Immediately)

### C1: Hardcoded API Keys in Source Code
**Severity:** 🔴 CRITICAL  
**Location:** Multiple files

**Issue:**
Production API keys are hardcoded in source code with fallback values:

```typescript
// src/lib/wagmi.ts:12-13
const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'skI70Usmhsnf0GDuGdYqj'
const tatumApiKey = process.env.NEXT_PUBLIC_TATUM_API_KEY || 't-69148b6d19acc082e210cef0-d24ea3dd27e34b1180b1e14d'

// hardhat.config.ts:38
apiKey: process.env.NEXT_PUBLIC_BASE_API_KEY || "IM6NVT4S5QHBX15YXBM274QF27GFG1DSUI"

// src/lib/farcaster.ts:170
const webhookSecret = process.env.FARCASTER_WEBHOOK_SECRET || 'default-secret'
```

**Risk:**
- API keys exposed in client-side bundles
- Rate limiting can be abused
- Potential unauthorized access to services
- GitHub scanning will flag these keys

**Fix:**
```typescript
// Remove all fallback API keys
const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
if (!alchemyApiKey) {
  throw new Error('NEXT_PUBLIC_ALCHEMY_API_KEY is required')
}

// For webhook secrets, NEVER have fallbacks
const webhookSecret = process.env.FARCASTER_WEBHOOK_SECRET
if (!webhookSecret) {
  throw new Error('FARCASTER_WEBHOOK_SECRET must be configured')
}
```

---

### C2: Missing Private Key Security in Deployment
**Severity:** 🔴 CRITICAL  
**Location:** `hardhat.config.ts:23,29`

**Issue:**
```typescript
accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
```

**Risk:**
- Empty accounts array prevents deployment
- No validation that PRIVATE_KEY is actually a valid private key
- Could accidentally commit private key to git

**Fix:**
```typescript
// Add validation
const getAccounts = () => {
  const privateKey = process.env.PRIVATE_KEY
  if (!privateKey) {
    console.warn('⚠️ PRIVATE_KEY not set - deployment will fail')
    return []
  }
  
  // Validate format (starts with 0x, 66 chars total)
  if (!/^0x[0-9a-fA-F]{64}$/.test(privateKey)) {
    throw new Error('Invalid PRIVATE_KEY format. Must be 0x followed by 64 hex characters')
  }
  
  return [privateKey]
}

// In config
base: {
  accounts: getAccounts(),
}
```

---

### C3: No Rate Limiting on API Endpoints
**Severity:** 🔴 CRITICAL  
**Location:** All API routes in `src/app/api/`

**Issue:**
No rate limiting implemented on any API endpoints. Attackers can:
- DDoS the server
- Scrape all NFT data
- Abuse frame endpoints
- Generate excessive RPC calls

**Fix:**
Install and configure rate limiting:
```bash
npm install @upstash/ratelimit @upstash/redis
```

```typescript
// Create middleware: src/middleware.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})

export async function middleware(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success } = await ratelimit.limit(ip)
  
  if (!success) {
    return new Response('Too Many Requests', { status: 429 })
  }
}

export const config = {
  matcher: '/api/:path*',
}
```

---

## 🟠 HIGH RISK ISSUES

### H1: Reentrancy Vulnerability in Smart Contract (Unlikely but Possible)
**Severity:** 🟠 HIGH  
**Location:** `contracts/FarcasterNFTMarketplace.sol:113-145`

**Issue:**
While `nonReentrant` modifier is used, the withdrawal pattern uses `pendingWithdrawals` but the actual `withdraw()` function performs state update BEFORE transfer:

```solidity
function withdraw() public nonReentrant {
    uint256 amount = pendingWithdrawals[msg.sender];
    require(amount > 0, "No funds to withdraw");
    
    pendingWithdrawals[msg.sender] = 0;  // ✅ GOOD: State before transfer
    payable(msg.sender).transfer(amount); // ✅ Uses transfer (2300 gas)
}
```

**Status:** ✅ SECURE - Follows checks-effects-interactions pattern correctly.

**However**, in `buyNFT()`:
```solidity
// Transfer NFT to buyer
_transfer(address(this), msg.sender, tokenId);  // ⚠️ External call

// Distribute payments
pendingWithdrawals[listing.seller] += sellerAmount;
```

**Risk:** 
If `_transfer` triggers a callback (ERC721Receiver), state changes happen after.

**Fix:**
Reorder to follow checks-effects-interactions:
```solidity
function buyNFT(uint256 tokenId) public payable nonReentrant {
    // ... validation ...
    
    // EFFECTS: Update all state FIRST
    listings[tokenId].isActive = false;
    pendingWithdrawals[listing.seller] += sellerAmount;
    pendingWithdrawals[owner()] += platformFeeAmount;
    if (royaltyAmount > 0) {
        pendingWithdrawals[creator] += royaltyAmount;
    }
    _itemsSold++;
    
    // INTERACTIONS: External calls LAST
    _transfer(address(this), msg.sender, tokenId);
    
    // Refund
    if (msg.value > listing.price) {
        payable(msg.sender).transfer(msg.value - listing.price);
    }
    
    // Events
    emit NFTSold(tokenId, msg.sender, listing.seller, listing.price);
}
```

---

### H2: Integer Overflow in Fee Calculations
**Severity:** 🟠 HIGH  
**Location:** `FarcasterNFTMarketplace.sol:125-127`

**Issue:**
```solidity
uint256 platformFeeAmount = (listing.price * platformFee) / FEE_DENOMINATOR;
uint256 royaltyAmount = (listing.price * nftMetadata[tokenId].royaltyPercentage) / FEE_DENOMINATOR;
uint256 sellerAmount = listing.price - platformFeeAmount - royaltyAmount;
```

**Risk:**
While Solidity 0.8+ has overflow protection, if `platformFee + royaltyPercentage > FEE_DENOMINATOR`, seller gets negative amount (reverts).

**Fix:**
Add explicit validation:
```solidity
uint256 totalFeePercentage = platformFee + nftMetadata[tokenId].royaltyPercentage;
require(totalFeePercentage <= FEE_DENOMINATOR, "Total fees exceed 100%");

uint256 totalFees = (listing.price * totalFeePercentage) / FEE_DENOMINATOR;
require(listing.price >= totalFees, "Price too low for fees");
```

---

### H3: No Maximum Price Validation
**Severity:** 🟠 HIGH  
**Location:** `FarcasterNFTMarketplace.sol:95,172`

**Issue:**
```solidity
function listNFT(uint256 tokenId, uint256 price) public {
    require(price > 0, "Price must be greater than 0");
    // No maximum price check!
}
```

**Risk:**
- Listing at `type(uint256).max` causes payment issues
- Front-end display breaks with huge numbers
- Overflow in fee calculations

**Fix:**
```solidity
uint256 public constant MAX_PRICE = 1000000 ether; // 1M ETH max

function listNFT(uint256 tokenId, uint256 price) public {
    require(price > 0, "Price must be greater than 0");
    require(price <= MAX_PRICE, "Price exceeds maximum");
    // ...
}
```

---

### H4: Missing Input Validation on Metadata URI
**Severity:** 🟠 HIGH  
**Location:** `FarcasterNFTMarketplace.sol:60-78`

**Issue:**
```solidity
function mintNFT(string memory metadataURI, uint256 royaltyPercentage) public {
    require(royaltyPercentage <= 1000, "Royalty too high");
    // No validation on metadataURI!
}
```

**Risk:**
- Empty string URIs
- Malicious/phishing URIs
- Non-IPFS URIs
- Front-end injection attacks

**Fix:**
```solidity
function mintNFT(string memory metadataURI, uint256 royaltyPercentage) public {
    require(bytes(metadataURI).length > 0, "URI cannot be empty");
    require(bytes(metadataURI).length <= 256, "URI too long");
    require(royaltyPercentage <= 1000, "Royalty too high");
    // Optional: require IPFS format
    // require(startsWith(metadataURI, "ipfs://"), "Must be IPFS URI");
    //...
}
```

---

### H5: Front-Running Vulnerability in NFT Purchases
**Severity:** 🟠 HIGH  
**Location:** `FarcasterNFTMarketplace.sol:113-145`

**Issue:**
Buyers can be front-run:
1. Alice sees NFT listed for 1 ETH
2. Alice submits buyNFT transaction
3. Bob sees Alice's transaction in mempool
4. Bob frontruns with higher gas, buying the NFT
5. Alice's transaction fails

**Risk:**
Poor UX, gas wasted, buyer frustration

**Fix:**
Add price protection:
```solidity
function buyNFT(uint256 tokenId, uint256 maxPrice) public payable nonReentrant {
    Listing memory listing = listings[tokenId];
    require(listing.isActive, "NFT not listed");
    require(listing.price <= maxPrice, "Price increased");
    require(msg.value >= listing.price, "Insufficient payment");
    // ...
}
```

---

## 🟡 MEDIUM RISK ISSUES

### M1: Dependency Vulnerabilities
**Severity:** 🟡 MEDIUM  
**CVE Count:** 22 vulnerabilities (19 low, 3 moderate)

**Affected Packages:**
- `esbuild` <=0.24.2 - Development server request vulnerability
- `fast-redact` - Prototype pollution
- `@walletconnect/*` - Multiple packages with transitive vulnerabilities

**Fix:**
```bash
# Review and update dependencies
npm audit fix

# For breaking changes, update manually:
npm update @walletconnect/ethereum-provider@latest
npm update @reown/appkit@latest
npm update wagmi@latest
```

**Note:** Most vulnerabilities are in dev dependencies and don't affect production.

---

### M2: Unlimited Token Minting
**Severity:** 🟡 MEDIUM  
**Location:** `FarcasterNFTMarketplace.sol:60-78`

**Issue:**
No limit on how many NFTs can be minted by a single user or globally.

**Risk:**
- Spam/abuse
- Storage bloat
- Gas griefing in `getActiveListings()`

**Fix:**
```solidity
uint256 public constant MAX_SUPPLY = 100000;
mapping(address => uint256) public userMintCount;
uint256 public constant MAX_PER_USER = 100;

function mintNFT(...) public returns (uint256) {
    require(_nextTokenId <= MAX_SUPPLY, "Max supply reached");
    require(userMintCount[msg.sender] < MAX_PER_USER, "User mint limit reached");
    
    userMintCount[msg.sender]++;
    // ...
}
```

---

### M3: Gas Limit DoS in getActiveListings()
**Severity:** 🟡 MEDIUM  
**Location:** `FarcasterNFTMarketplace.sol:206-229`

**Issue:**
```solidity
function getActiveListings() public view returns (Listing[] memory) {
    for (uint256 i = 1; i <= totalTokens; i++) {
        if (listings[i].isActive) activeCount++;
    }
    // Loops again!
    for (uint256 i = 1; i <= totalTokens; i++) {
        if (listings[i].isActive) {
            activeListings[index] = listings[i];
            index++;
        }
    }
}
```

**Risk:**
With 10,000+ NFTs, this function will exceed block gas limit and revert.

**Fix:**
Implement pagination:
```solidity
function getActiveListings(uint256 offset, uint256 limit) 
    public view returns (Listing[] memory, uint256 total) 
{
    require(limit <= 100, "Limit too high");
    
    // Count total active
    uint256 activeCount = 0;
    for (uint256 i = 1; i < _nextTokenId; i++) {
        if (listings[i].isActive) activeCount++;
    }
    
    // Get paginated results
    uint256 returned = 0;
    uint256 seen = 0;
    Listing[] memory result = new Listing[](limit);
    
    for (uint256 i = 1; i < _nextTokenId && returned < limit; i++) {
        if (listings[i].isActive) {
            if (seen >= offset) {
                result[returned] = listings[i];
                returned++;
            }
            seen++;
        }
    }
    
    return (result, activeCount);
}
```

---

### M4: No Emergency Pause Mechanism
**Severity:** 🟡 MEDIUM  
**Location:** Entire contract

**Issue:**
No way to pause contract in case of:
- Discovered vulnerability
- Market manipulation
- Emergency situations

**Fix:**
```solidity
import "@openzeppelin/contracts/utils/Pausable.sol";

contract FarcasterNFTMarketplace is ... Pausable {
    function listNFT(...) public whenNotPaused {
        // ...
    }
    
    function buyNFT(...) public payable whenNotPaused {
        // ...
    }
    
    function pause() public onlyOwner {
        _pause();
    }
    
    function unpause() public onlyOwner {
        _unpause();
    }
}
```

---

## 🟢 LOW RISK ISSUES

### L1: Deprecated Next.js Image Configuration
**Severity:** 🟢 LOW  
**Location:** Next.js configuration

**Issue:**
```
⚠ The "images.domains" configuration is deprecated. 
Please use "images.remotePatterns" configuration instead.
```

**Fix:**
In `next.config.js`:
```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
    },
    {
      protocol: 'https',
      hostname: '*.ipfs.io',
    },
  ],
}
```

---

### L2: Multiple WalletConnect Initializations
**Severity:** 🟢 LOW  
**Location:** Browser console warnings

**Issue:**
```
WalletConnect Core is already initialized. Init() was called 6 times.
```

**Risk:**
Memory leaks, connection issues

**Fix:**
Ensure WagmiProvider is only mounted once at root level. Check for duplicate providers in component tree.

---

### L3: Missing Event Indexing
**Severity:** 🟢 LOW  
**Location:** Smart contract events

**Issue:**
Events could benefit from more indexed parameters for efficient filtering.

**Current:**
```solidity
event NFTListed(uint256 indexed tokenId, address indexed seller, uint256 price);
```

**Better:**
```solidity
event NFTListed(
    uint256 indexed tokenId, 
    address indexed seller, 
    uint256 indexed price,  // Add indexed for price filtering
    uint256 timestamp
);
```

---

## ℹ️ INFORMATIONAL FINDINGS

### I1: No Contract Verification Setup
**Recommendation:** Add Etherscan verification to Hardhat config:
```typescript
etherscan: {
  apiKey: {
    base: process.env.BASESCAN_API_KEY,
  },
  customChains: [
    {
      network: "base",
      chainId: 8453,
      urls: {
        apiURL: "https://api.basescan.org/api",
        browserURL: "https://basescan.org"
      }
    }
  ]
}
```

### I2: Missing Contract Tests
**Recommendation:** Add comprehensive test suite:
```bash
npm install --save-dev @nomicfoundation/hardhat-chai-matchers
```

Create `test/FarcasterNFTMarketplace.test.ts`:
- Test all functions
- Test edge cases
- Test access controls
- Test re-entrancy protection
- Gas usage tests

### I3: No Multi-sig Wallet for Ownership
**Recommendation:** Transfer ownership to Gnosis Safe multi-sig before mainnet launch.

### I4: Missing OpenZeppelin Contracts v5 Upgrade
**Current:** Using older patterns  
**Recommendation:** Upgrade to latest OpenZeppelin contracts

### I5: No Circuit Breaker for Abnormal Activity
**Recommendation:** Implement monitoring for:
- Unusual listing volumes
- Suspicious price changes
- Rapid-fire transactions

### I6: Missing Transaction Simulation
**Recommendation:** Add Tenderly integration for transaction simulation before signing

### I7: No IPFS Pinning Verification
**Recommendation:** Verify metadata is actually pinned and accessible before minting

---

## ✅ RECOMMENDED FIXES PRIORITY

### Pre-Mainnet Deployment Checklist

#### Must Fix (Blocker):
- [ ] C1: Remove all hardcoded API keys
- [ ] C2: Add private key validation
- [ ] C3: Implement rate limiting
- [ ] H2: Add fee overflow protection
- [ ] H3: Add maximum price validation
- [ ] H4: Validate metadata URIs

#### Should Fix (High Priority):
- [ ] H1: Reorder buyNFT() state changes
- [ ] H5: Add front-running protection
- [ ] M1: Update vulnerable dependencies
- [ ] M2: Implement minting limits
- [ ] M3: Paginate getActiveListings()
- [ ] M4: Add emergency pause

#### Nice to Have:
- [ ] L1: Update Next.js image config
- [ ] L2: Fix WalletConnect initialization
- [ ] I1: Add contract verification
- [ ] I2: Write comprehensive tests
- [ ] I3: Set up multi-sig ownership

---

## 🔐 Environment Variables Checklist

### Required for Production:
```bash
# ✅ Must be set (no fallbacks)
NEXT_PUBLIC_ALCHEMY_API_KEY=
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=
NEXT_PUBLIC_ONCHAINKIT_API_KEY=
PRIVATE_KEY=  # For deployment only, never commit!
FARCASTER_WEBHOOK_SECRET=

# ✅ Recommended
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=  # For contract verification
```

### Security Rules:
1. ❌ NEVER commit `.env` or `.env.local`
2. ❌ NEVER use default/fallback API keys
3. ✅ Use Vercel/deployment platform secret management
4. ✅ Rotate all keys before mainnet launch
5. ✅ Use separate keys for dev/staging/production

---

## 📊 Final Security Score

| Category | Score | Status |
|----------|-------|--------|
| Smart Contract Security | 6/10 | ⚠️ Needs Improvement |
| Frontend Security | 7/10 | 🟡 Acceptable |
| API Security | 4/10 | 🔴 Critical Issues |
| Dependency Security | 5/10 | ⚠️ Vulnerabilities Present |
| Environment Security | 3/10 | 🔴 Hardcoded Secrets |
| **Overall** | **5/10** | 🔴 **NOT READY FOR MAINNET** |

---

## 🚀 Post-Fix Deployment Steps

1. **Fix all CRITICAL and HIGH issues**
2. **Update dependencies:** `npm audit fix`
3. **Run full test suite:** Create and run comprehensive tests
4. **Deploy to testnet:** Test all functions end-to-end
5. **Professional audit:** Consider hiring third-party auditor for smart contract
6. **Bug bounty:** Set up bug bounty program
7. **Gradual rollout:** Start with limited features, expand gradually
8. **Monitor:** Set up real-time monitoring and alerts

---

## 📞 Recommendations for Professional Audit

Consider hiring professional auditors:
- **OpenZeppelin** - Smart contract audits
- **Trail of Bits** - Comprehensive security review
- **ConsenSys Diligence** - Ethereum security
- **Certik** - Full stack audit

Estimated cost: $15,000 - $50,000  
Timeline: 2-4 weeks

---

**Audit Completed:** November 13, 2025  
**Next Review:** After fixes implemented  
**Contact:** Security team for questions

⚠️ **DO NOT DEPLOY TO MAINNET UNTIL ALL CRITICAL AND HIGH ISSUES ARE RESOLVED**
