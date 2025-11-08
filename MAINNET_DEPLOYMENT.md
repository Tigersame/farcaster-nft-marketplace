# Mainnet Deployment Guide

## Prerequisites Checklist

Before deploying to Base mainnet, ensure you have:

- [ ] **WalletConnect Project ID** - Get from [WalletConnect Cloud](https://cloud.walletconnect.com/)
- [ ] **Base Mainnet RPC URL** - Use `https://mainnet.base.org` (default) or Alchemy/Infura
- [ ] **Pinata Account** - For IPFS storage ([pinata.cloud](https://pinata.cloud))
- [ ] **Deployment Wallet** - With ETH on Base mainnet for gas fees
- [ ] **Vercel Account** - For frontend hosting ([vercel.com](https://vercel.com))
- [ ] **Domain Name** (Optional) - For custom URL

## Step 1: Environment Configuration

### 1.1 Create Production Environment File

Create `.env.local` (never commit this file):

```bash
# Base Network Configuration
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_CHAIN_ID=8453

# WalletConnect Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here

# IPFS/Pinata Configuration
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_key
PINATA_JWT=your_pinata_jwt_token

# Application URLs
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# Farcaster Configuration (if applicable)
NEXT_PUBLIC_FARCASTER_HUB_URL=https://hub.farcaster.xyz

# Smart Contract Deployment (NEVER COMMIT)
PRIVATE_KEY=your_wallet_private_key_for_deployment
BASESCAN_API_KEY=your_basescan_api_key_for_verification
```

### 1.2 Get WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create new project
3. Copy Project ID
4. Add your production domain to allowed origins

### 1.3 Get Pinata Credentials

1. Sign up at [pinata.cloud](https://pinata.cloud)
2. Go to API Keys section
3. Create new API key with pinning permissions
4. Copy API Key, Secret, and JWT token

## Step 2: Smart Contract Deployment

### 2.1 Verify Hardhat Configuration

Check your `hardhat.config.ts` includes Base mainnet:

```typescript
networks: {
  base: {
    url: process.env.NEXT_PUBLIC_BASE_RPC_URL || "https://mainnet.base.org",
    accounts: [process.env.PRIVATE_KEY],
    chainId: 8453
  }
}
```

### 2.2 Deploy Contracts to Base Mainnet

```bash
# Ensure you have ETH on Base mainnet in your deployment wallet
npm run deploy:mainnet
```

This will:
- Deploy your NFT marketplace contract
- Output contract address
- Generate deployment artifacts

### 2.3 Verify Contract on BaseScan

```bash
npx hardhat verify --network base DEPLOYED_CONTRACT_ADDRESS
```

### 2.4 Update Frontend with Contract Address

After deployment, update contract addresses in your config:

1. If you have a `src/lib/contracts.ts` or similar, update addresses
2. Update any hardcoded contract references in components
3. Test contract interactions in production

## Step 3: Frontend Deployment to Vercel

### 3.1 Connect Repository to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

Or use Vercel web dashboard:
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables (see 3.2)
4. Deploy

### 3.2 Configure Vercel Environment Variables

In Vercel dashboard (Settings > Environment Variables), add:

```
NEXT_PUBLIC_BASE_RPC_URL = https://mainnet.base.org
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID = your_walletconnect_project_id
NEXT_PUBLIC_APP_URL = https://your-domain.vercel.app
PINATA_API_KEY = your_pinata_api_key
PINATA_SECRET_API_KEY = your_pinata_secret
PINATA_JWT = your_pinata_jwt
```

**Important**: Do NOT add `PRIVATE_KEY` to Vercel - only needed for local contract deployment.

### 3.3 Production Build Test (Local)

Before deploying, test production build locally:

```bash
npm run build
npm start
```

Visit `http://localhost:3000` and verify:
- [ ] Wallet connects successfully
- [ ] NFTs load correctly
- [ ] Sidebar navigation works
- [ ] Dark mode toggles
- [ ] Frame metadata renders
- [ ] No console errors

## Step 4: Post-Deployment Verification

### 4.1 Test Production Application

Visit your deployed URL and verify:

- [ ] **Wallet Connection**: RainbowKit connects to Base mainnet
- [ ] **Network Detection**: Prompts to switch to Base if on wrong network
- [ ] **NFT Loading**: Marketplace displays NFTs
- [ ] **Farcaster Frames**: Frame endpoints return correct metadata
- [ ] **XMTP Chat**: Chat functionality works
- [ ] **Dark Mode**: Theme persists across sessions
- [ ] **Mobile Responsive**: Sidebar works on mobile

### 4.2 Test Frame Endpoints

Test your Farcaster frames:

1. Visit `https://your-domain.vercel.app/api/frames/nft/1`
2. Should return HTML with `fc:frame` meta tags
3. Validate with [Warpcast Frame Validator](https://warpcast.com/~/developers/frames)

### 4.3 Monitor for Errors

Check Vercel deployment logs:
```bash
vercel logs your-deployment-url
```

Monitor for:
- API route errors
- RPC connection issues
- CORS problems
- Missing environment variables

## Step 5: Security & Optimization

### 5.1 Security Checklist

- [ ] Never commit `.env.local` or private keys
- [ ] Add `.env.local` to `.gitignore`
- [ ] Use environment variables for all sensitive data
- [ ] Enable Vercel password protection during testing (optional)
- [ ] Review WalletConnect allowed origins
- [ ] Verify smart contract on BaseScan for transparency

### 5.2 Performance Optimization

```bash
# Analyze bundle size
npm run build

# Check for large dependencies
npx depcheck
```

Consider:
- Image optimization (Next.js Image component)
- Code splitting for heavy components
- Lazy loading for chat/admin panels
- CDN for static assets

### 5.3 Configure Custom Domain (Optional)

In Vercel dashboard:
1. Go to Settings > Domains
2. Add custom domain
3. Configure DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` in environment variables
5. Update WalletConnect allowed origins

## Step 6: Maintenance

### 6.1 Update Deployment

```bash
# Commit changes
git add .
git commit -m "Update feature"
git push

# Vercel auto-deploys on push to main branch
```

Or manual deployment:
```bash
vercel --prod
```

### 6.2 Rollback Deployment

If issues arise:
```bash
vercel rollback
```

Or use Vercel dashboard to redeploy previous version.

### 6.3 Monitor Analytics

- **Vercel Analytics**: Enable in dashboard for performance metrics
- **BaseScan**: Monitor contract interactions
- **WalletConnect**: Check connection analytics in cloud dashboard

## Troubleshooting

### Issue: Wallet won't connect in production

**Solution**:
- Verify `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set
- Check WalletConnect allowed origins includes your domain
- Ensure Base mainnet RPC URL is correct

### Issue: Frame metadata not rendering

**Solution**:
- Check API route returns HTML (not JSON)
- Verify `NEXT_PUBLIC_APP_URL` matches your domain
- Test with Warpcast frame validator
- Check image URLs are absolute (not relative)

### Issue: SSL certificate errors

**Solution**:
- In production, these should not occur
- If persisting, check RPC provider status
- Consider using Alchemy or Infura RPC endpoints

### Issue: Environment variables not updating

**Solution**:
- Redeploy after changing env vars in Vercel
- Clear Vercel cache: Settings > Data Cache
- Verify variable names match code exactly (case-sensitive)

## Quick Reference Commands

```bash
# Local production test
npm run build && npm start

# Deploy to Vercel
vercel --prod

# Deploy contract to Base mainnet
npm run deploy:mainnet

# Verify contract
npx hardhat verify --network base <CONTRACT_ADDRESS>

# Check deployment logs
vercel logs <deployment-url>

# Rollback deployment
vercel rollback
```

## Support Resources

- **Base Network**: [docs.base.org](https://docs.base.org)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **WalletConnect**: [docs.walletconnect.com](https://docs.walletconnect.com)
- **Farcaster Frames**: [docs.farcaster.xyz/developers/frames](https://docs.farcaster.xyz/developers/frames)
- **Next.js Deployment**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)

---

**Ready to deploy!** Follow steps 1-4 in order for smooth mainnet deployment.
