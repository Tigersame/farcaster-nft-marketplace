# 🚨 Alchemy API Key Fix Guide

## Problem
Your Alchemy API key is **blocked** (returning 403 Forbidden). This prevents all NFT data from loading in the marketplace.

**Current blocked key**: `skI70Usmhsnf0GDuGdYqj`

## Quick Fix Steps

### 1. Get New Alchemy API Key
1. Visit https://dashboard.alchemy.com
2. Sign in (or create free account)
3. Click **"Create new app"**
4. Configure:
   - **Chain**: Base
   - **Network**: Base Mainnet
   - **Name**: Farcaster NFT Marketplace
5. Click **"Create app"**
6. Copy the **API key** from your app dashboard

### 2. Update Environment Variables
Open `.env.local` and update line 5:

```env
# Replace this line:
NEXT_PUBLIC_ALCHEMY_API_KEY=skI70Usmhsnf0GDuGdYqj

# With your new key:
NEXT_PUBLIC_ALCHEMY_API_KEY=your_new_api_key_here
```

Also update line 9 (RPC URL):
```env
NEXT_PUBLIC_BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2/your_new_api_key_here
```

### 3. Restart Development Server
```bash
# Kill existing server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

### 4. Verify Fix
1. Open http://localhost:3000
2. Check browser console - no more 403 errors
3. NFT cards should load in marketplace
4. Navigate to Collections page (`/collections`)
5. Click any collection - NFTs should display

## What Was Blocked?
All Alchemy NFT API endpoints:
- `getNFTsForContract` - Fetch NFTs by collection
- `getNFTMetadata` - Individual NFT data
- `getContractMetadata` - Collection info

**Error pattern**: All requests to `https://base-mainnet.g.alchemy.com/nft/v3/skI70Usmhsnf0GDuGdYqj/*` returned **403 Forbidden**

## Why Did This Happen?
Possible reasons:
- Free tier rate limits exceeded
- API key deactivated/revoked
- Account suspended
- Key exposed publicly (in git repo)

## Prevention
1. **Never commit API keys** - always use `.env.local`
2. **Add to .gitignore** - ensure `.env.local` is listed
3. **Use separate keys** for dev/prod
4. **Monitor usage** in Alchemy dashboard
5. **Set up alerts** for rate limit warnings

## Alternative: Use Public RPC (Limited)
If you can't get Alchemy key immediately:

```env
# Fallback to public RPC (slower, rate limited)
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
```

**Note**: Public RPC doesn't support NFT API endpoints. You'll need Alchemy for full marketplace functionality.

## Deployment Note
After fixing locally, **update Vercel environment variables**:
1. Visit https://vercel.com/devsminiapp/farcaster-nft-marketplace/settings/environment-variables
2. Update `NEXT_PUBLIC_ALCHEMY_API_KEY` with new key
3. Redeploy: `git push origin main`

## Current Status
✅ Collection page navigation - **WORKING**
✅ Collections grid - **WORKING**
✅ Dynamic routing - **WORKING**
✅ Event-driven navigation - **WORKING**
❌ NFT data loading - **BLOCKED** (needs new API key)
❌ Collection catalogs - **EMPTY** (needs new API key)

**Everything is built and ready** - just needs a valid API key to load NFT data!

## Support
- Alchemy Docs: https://docs.alchemy.com/reference/nft-api-quickstart
- Rate Limits: https://docs.alchemy.com/reference/throughput
- Dashboard: https://dashboard.alchemy.com

---

**TL;DR**: Get new API key from dashboard.alchemy.com → Update `.env.local` line 5 → Restart `npm run dev` → NFTs will load! 🎉
