# Custom Domain Setup Guide: farcastmints.com

## Overview
This guide walks you through configuring your custom domain `farcastmints.com` to work with your Farcaster NFT Marketplace deployed on Vercel.

---

## Step 1: Configure DNS Records at Your Domain Registrar

Go to your domain registrar (e.g., GoDaddy, Namecheap, Cloudflare, etc.) and add these DNS records:

### Option A: Using Root Domain (farcastmints.com)
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600 (or Auto)
```

### Option B: Using www Subdomain (recommended for flexibility)
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)

Type: A (for root domain redirect)
Name: @
Value: 76.76.21.21
TTL: 3600 (or Auto)
```

**Note**: DNS propagation can take 24-48 hours, but often completes within 1-2 hours.

---

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Option B: Using Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository: `Tigersame/farcaster-nft-marketplace`
4. Configure environment variables (see Step 3)
5. Click "Deploy"

---

## Step 3: Add Custom Domain in Vercel

1. Go to your project dashboard on Vercel
2. Click "Settings" → "Domains"
3. Add `farcastmints.com` (and optionally `www.farcastmints.com`)
4. Vercel will verify DNS configuration
5. Enable automatic HTTPS (Vercel does this automatically)

---

## Step 4: Configure Environment Variables on Vercel

**CRITICAL**: Set these environment variables in Vercel Dashboard → Settings → Environment Variables:

### Required Variables
```env
# Base Network RPC (Use QuickNode or Alchemy Production Key)
NEXT_PUBLIC_BASE_RPC_URL=https://divine-distinguished-sheet.base-mainnet.quiknode.pro/YOUR_KEY

# Marketplace Contract Address (Deploy to Base Mainnet first!)
NEXT_PUBLIC_MARKETPLACE_CONTRACT=0xYourMainnetContractAddress

# WalletConnect
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id

# Farcaster Hub
NEXT_PUBLIC_FARCASTER_HUB_URL=https://hub.pinata.cloud
FARCASTER_HUB_API_KEY=your_pinata_hub_key

# Pinata (IPFS)
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt
PINATA_API_KEY=your_pinata_api_key
PINATA_API_SECRET=your_pinata_api_secret

# Optional: Additional RPC Providers (for fallback)
ALCHEMY_API_KEY=your_alchemy_key
CHAINSTACK_API_KEY=your_chainstack_key
OPENSEA_API_KEY=your_opensea_key
```

### Production-Specific Settings
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://farcastmints.com
NEXT_TELEMETRY_DISABLED=1
```

---

## Step 5: Deploy Marketplace Contract to Base Mainnet

**IMPORTANT**: Before going live, deploy your contract to Base Mainnet (not local testnet).

```bash
# Ensure you have mainnet deployer wallet funded with ETH
# Update hardhat.config.ts with your private key or use hardware wallet

# Deploy to Base Mainnet
npx hardhat run scripts/deploy.ts --network base

# Save the deployed contract address
# Update NEXT_PUBLIC_MARKETPLACE_CONTRACT in Vercel env vars
```

**Security Note**: NEVER commit your private key. Use environment variables or hardware wallets.

---

## Step 6: Verify Deployment

### DNS Verification
```bash
# Check DNS propagation
nslookup farcastmints.com

# Should show Vercel IP: 76.76.21.21
```

### Site Verification
1. Visit `https://farcastmints.com`
2. Check SSL certificate (should be valid)
3. Test wallet connection
4. Test NFT minting/listing/buying
5. Verify Farcaster frames work (share a frame link)

### Monitor Logs
```bash
# View deployment logs
vercel logs farcastmints.com

# View function logs in real-time
vercel logs --follow
```

---

## Step 7: Post-Deployment Checklist

- [ ] DNS records configured and propagated
- [ ] Custom domain added in Vercel dashboard
- [ ] HTTPS/SSL certificate active
- [ ] All environment variables set in Vercel
- [ ] Marketplace contract deployed to Base Mainnet
- [ ] Contract address updated in env vars
- [ ] Wallet connection working
- [ ] NFT minting working
- [ ] NFT listing/buying working
- [ ] Farcaster frames rendering correctly
- [ ] XMTP chat functional
- [ ] Social proof feed showing activity
- [ ] Dark mode toggle working
- [ ] Mobile responsive layout verified

---

## Troubleshooting

### Domain Not Resolving
- Wait 24-48 hours for DNS propagation
- Use `nslookup farcastmints.com` to check DNS status
- Verify DNS records match Vercel's requirements
- Check for conflicting CNAME/A records

### 404 Errors
- Ensure `vercel.json` rewrites are configured
- Check that build completed successfully
- Verify `outputDirectory` is `.next`

### Environment Variables Not Loading
- Restart deployment after adding env vars
- Check variable names match exactly (case-sensitive)
- Verify variables are set for "Production" environment

### Contract Interactions Failing
- Verify `NEXT_PUBLIC_MARKETPLACE_CONTRACT` is correct mainnet address
- Check RPC URL is working (not rate-limited)
- Ensure wallet has ETH for gas
- Check Base network status: https://status.base.org

### Frames Not Rendering
- Verify frame meta tags in HTML source
- Test with Farcaster Frame Validator: https://warpcast.com/~/developers/frames
- Check image URLs are absolute (not relative)
- Ensure frame routes return HTML (not JSON)

---

## Maintenance

### Update Deployment
```bash
# Push changes to GitHub (auto-deploys if connected)
git add .
git commit -m "Update marketplace features"
git push origin main

# Or manual deploy
vercel --prod
```

### Monitor Performance
- Vercel Dashboard → Analytics
- Check function execution times
- Monitor RPC rate limits
- Review error logs

### Rotate API Keys
When rotating API keys:
1. Add new key to Vercel env vars
2. Trigger redeployment
3. Verify new key works
4. Remove old key

---

## Security Recommendations

1. **Enable Vercel Protection**: Settings → Protection → Enable password or Vercel Auth
2. **Monitor Rate Limits**: Set up alerts for RPC/API rate limits
3. **Regular Audits**: Review contract interactions and user activity
4. **Backup Keys**: Store API keys securely (1Password, etc.)
5. **Update Dependencies**: Regularly update packages for security patches

---

## Support Resources

- Vercel Docs: https://vercel.com/docs
- Base Network Docs: https://docs.base.org
- Farcaster Frames: https://docs.farcaster.xyz/reference/frames/spec
- Project Issues: https://github.com/Tigersame/farcaster-nft-marketplace/issues

---

## Quick Command Reference

```bash
# Deploy to production
vercel --prod

# View logs
vercel logs

# Pull environment variables
vercel env pull

# Add environment variable
vercel env add VARIABLE_NAME

# List domains
vercel domains ls

# Remove domain
vercel domains rm farcastmints.com
```

---

**Your site will be live at**: https://farcastmints.com

Once DNS propagates and deployment completes! 🚀
