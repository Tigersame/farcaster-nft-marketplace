# 🔧 Vercel Environment Variables Setup

## Quick Fix for Current Error

The error occurs because the vercel.json was referencing Vercel secrets that don't exist yet. I've updated it to remove the secret references.

## Set Environment Variables in Vercel Dashboard

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: `devsminiapp/farcaster-nft-marketplace`
3. **Go to Settings → Environment Variables**
4. **Add these variables**:

### Required Variables:
```bash
NEXT_PUBLIC_BASE_RPC_URL = https://mainnet.base.org
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID = farcaster-nft-demo
NEXT_PUBLIC_APP_URL = https://farcaster-nft-marketplace.vercel.app
```

### Optional Variables (for enhanced features):
```bash
PINATA_JWT = your_pinata_jwt_token_here
PINATA_GATEWAY_URL = https://gateway.pinata.cloud
SECURITY_HEADERS_ENABLED = true
```

## Alternative: Set via Vercel CLI

You can also set them via command line:

```powershell
# Set the required environment variables
vercel env add NEXT_PUBLIC_BASE_RPC_URL production
# Enter: https://mainnet.base.org

vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID production  
# Enter: farcaster-nft-demo

vercel env add NEXT_PUBLIC_APP_URL production
# Enter: https://farcaster-nft-marketplace.vercel.app
```

## Deploy Again

After setting the environment variables:

```powershell
vercel --prod

---

**Auto Deploy:**
Vercel will automatically deploy your project on every push to the main branch. Manual deployment with `vercel --prod` is only needed for immediate production updates.
```

## Default Values

The app will work with these minimal settings:
- **Base RPC**: Uses public Base mainnet RPC
- **WalletConnect**: Uses demo project ID (you can upgrade later)
- **App URL**: Will be auto-detected by Vercel

Your deployment should succeed after setting these! 🚀