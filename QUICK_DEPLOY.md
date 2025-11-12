# Quick Deployment to farcastmints.com

## Pre-Deployment Checklist

Before deploying, ensure you have:

1. ✅ **Domain registered**: farcastmints.com
2. ✅ **Vercel account**: https://vercel.com
3. ✅ **GitHub repo connected**: Tigersame/farcaster-nft-marketplace
4. ✅ **Production API keys ready** (QuickNode, WalletConnect, Pinata, etc.)
5. ⏳ **Marketplace contract deployed to Base Mainnet** (or use testnet for now)

---

## Quick Start: 3 Commands

```powershell
# 1. Test build locally
npm run build

# 2. Deploy to Vercel
vercel --prod

# 3. Add custom domain in Vercel Dashboard
# Go to: Project Settings > Domains > Add farcastmints.com
```

---

## Detailed Steps

### 1. Build and Test Locally
```powershell
# Clean build
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run build

# Test production build
npm run start
# Visit http://localhost:3000 and test all features
```

### 2. Commit Latest Changes
```powershell
git add .
git commit -m "Configure custom domain farcastmints.com"
git push origin main
```

### 3. Deploy with Vercel CLI
```powershell
# Login (first time only)
vercel login

# Deploy to production
vercel --prod

# Or use interactive deployment script
.\deploy-production.ps1
```

### 4. Configure DNS at Domain Registrar

Add these records at your domain registrar (GoDaddy, Namecheap, etc.):

**For Root Domain (farcastmints.com):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**For www Subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### 5. Add Domain in Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Domains**
4. Click **Add Domain**
5. Enter: `farcastmints.com`
6. Vercel will verify DNS configuration
7. (Optional) Add `www.farcastmints.com` as well

### 6. Set Environment Variables in Vercel

Go to **Settings** → **Environment Variables** and add:

```env
# === REQUIRED ===
NEXT_PUBLIC_APP_URL=https://farcastmints.com
NEXT_PUBLIC_BASE_RPC_URL=your_quiknode_or_alchemy_url
NEXT_PUBLIC_MARKETPLACE_CONTRACT=0xYourMainnetContractAddress
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

# === FARCASTER ===
NEXT_PUBLIC_FARCASTER_HUB_URL=https://hub.pinata.cloud
FARCASTER_HUB_API_KEY=your_pinata_key

# === IPFS ===
NEXT_PUBLIC_PINATA_JWT=your_jwt
PINATA_API_KEY=your_api_key
PINATA_API_SECRET=your_secret

# === OPTIONAL FALLBACKS ===
ALCHEMY_API_KEY=your_key
CHAINSTACK_API_KEY=your_key
OPENSEA_API_KEY=your_key
```

**Tip**: Copy from `.env.production.template` for a complete list.

### 7. Deploy Marketplace Contract to Base Mainnet

**CRITICAL**: Deploy your contract to Base Mainnet before going live!

```powershell
# Ensure deployer wallet has ETH on Base Mainnet
# Update hardhat.config.ts with your deployment key

npx hardhat run scripts/deploy.ts --network base

# Copy the deployed contract address
# Update NEXT_PUBLIC_MARKETPLACE_CONTRACT in Vercel
```

### 8. Redeploy to Apply Environment Variables

After adding environment variables:

```powershell
# Trigger redeployment
vercel --prod

# Or in dashboard: Deployments > ... > Redeploy
```

---

## Verification

### Check DNS Propagation
```powershell
nslookup farcastmints.com
# Should return: 76.76.21.21
```

### Check SSL Certificate
Visit https://farcastmints.com - should show valid certificate (🔒 icon)

### Test Functionality
- [ ] Homepage loads
- [ ] Wallet connects (MetaMask, Coinbase Wallet, etc.)
- [ ] NFT marketplace shows listings
- [ ] Can mint NFTs
- [ ] Can list NFTs for sale
- [ ] Can buy NFTs
- [ ] Farcaster frames render
- [ ] XMTP chat works
- [ ] Dark mode toggles
- [ ] Mobile responsive

---

## Monitoring & Logs

### View Deployment Logs
```powershell
vercel logs farcastmints.com

# Or follow in real-time
vercel logs --follow
```

### Check Function Execution
Go to Vercel Dashboard → Project → **Functions** tab

### Monitor Performance
Go to Vercel Dashboard → Project → **Analytics** tab

---

## Troubleshooting

### "Domain Not Found"
- Wait 1-2 hours for DNS propagation
- Check DNS records are correct
- Use `nslookup farcastmints.com` to verify

### "404 Not Found"
- Ensure build completed successfully
- Check `vercel.json` configuration
- Verify routes are correct

### "Environment Variables Not Working"
- Variables must be set for **Production** environment
- Redeploy after adding variables
- Check variable names (case-sensitive)

### "Contract Calls Failing"
- Verify contract address is correct
- Check RPC URL is working
- Ensure wallet has ETH for gas
- Confirm contract is deployed to correct network

---

## Production Maintenance

### Update Code
```powershell
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel auto-deploys (if connected to GitHub)
# Or manual: vercel --prod
```

### Rotate API Keys
1. Add new key to Vercel env vars
2. Trigger redeployment
3. Test with new key
4. Remove old key

### Monitor Costs
- QuickNode: Check API usage
- Alchemy: Check compute units
- Vercel: Check bandwidth/function executions
- Pinata: Check storage/bandwidth

---

## Support

- **Full Setup Guide**: See `DOMAIN_SETUP.md`
- **Vercel Docs**: https://vercel.com/docs
- **Base Network**: https://docs.base.org
- **GitHub Issues**: https://github.com/Tigersame/farcaster-nft-marketplace/issues

---

## Quick Command Reference

```powershell
# Build
npm run build

# Deploy production
vercel --prod

# View logs
vercel logs

# Add domain
vercel domains add farcastmints.com

# List domains
vercel domains ls

# Pull env vars
vercel env pull

# Add env var
vercel env add VARIABLE_NAME
```

---

**Your site will be live at**: 🌐 https://farcastmints.com

Good luck with your launch! 🚀
