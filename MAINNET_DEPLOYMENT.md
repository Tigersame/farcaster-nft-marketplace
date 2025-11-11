# 🚀 Mainnet Deployment Checklist

## ✅ Configuration Updates Completed

### Network Configuration
- ✅ Removed Base Sepolia testnet from wagmi config
- ✅ Set Base Mainnet as primary chain
- ✅ Updated all RPC endpoints to mainnet
- ✅ Configured proper RPC fallbacks (Alchemy, LlamaRPC, BlockPi, Base public)

### Environment Variables
- ✅ Set `NODE_ENV=production`
- ✅ Set `NEXT_PUBLIC_NETWORK=base` (mainnet)
- ✅ Added OnchainKit API key for Basename support
- ✅ Removed private keys from .env.local (security)
- ✅ Updated all API endpoints to production URLs

---

## 📋 Before Deployment

### 1. Smart Contract Deployment
**⚠️ REQUIRED: Deploy your NFT marketplace contract to Base Mainnet**

```bash
# Option 1: Using Hardhat
npx hardhat run scripts/deploy.ts --network base

# Option 2: Using Foundry
forge create --rpc-url https://mainnet.base.org \
  --private-key YOUR_PRIVATE_KEY \
  contracts/FarcasterNFTMarketplace.sol:FarcasterNFTMarketplace
```

After deployment:
1. Copy the contract address
2. Update `.env.local`:
   ```bash
   NEXT_PUBLIC_MARKETPLACE_CONTRACT=0xYourContractAddressHere
   ```
3. Verify contract on Basescan:
   ```bash
   npx hardhat verify --network base YOUR_CONTRACT_ADDRESS
   ```

### 2. Update Contract References
Search and replace any hardcoded testnet addresses:
```bash
# Find testnet references
grep -r "baseSepolia" src/
grep -r "sepolia" src/
grep -r "0xE4241917A3B75C761C87BE335F392e220F67afCf" src/
```

### 3. Security Checks

**Critical: Remove all private keys**
- ❌ Never commit `.env.local` to git
- ❌ Never hardcode private keys in code
- ✅ Use environment variables only
- ✅ Add `.env.local` to `.gitignore`

**Verify .gitignore includes:**
```
.env.local
.env*.local
*.key
*.pem
hardhat.config.ts (if contains keys)
```

### 4. API Keys Verification

**Required API Keys:**
- ✅ Alchemy API Key: `skI70Usmhsnf0GDuGdYqj` (configured)
- ✅ OnchainKit API Key: `HuxtJLcVLQ5ixxzXFDRKtvKrUr6ZuMBT` (configured)
- ✅ Neynar/Farcaster API Key: `A2FB36E9-3C4E-48AA-8018-BC03613CB5CD` (configured)
- ✅ WalletConnect Project ID: `e3877a06886f08ffd144013611c152d1` (configured)
- ✅ Pinata IPFS API configured

**Check API Rate Limits:**
- Alchemy: [Dashboard](https://dashboard.alchemy.com/)
- OnchainKit: [Portal](https://portal.cdp.coinbase.com/)
- Pinata: [Account](https://app.pinata.cloud/)

---

## 🌐 Deployment Steps

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables in Vercel Dashboard:**
   - Go to: Project Settings → Environment Variables
   - Add all variables from `.env.local`
   - Mark sensitive keys as "Encrypted"

4. **Configure Domain:**
   - Add custom domain in Vercel dashboard
   - Update DNS records as shown

### Option 2: Manual Deployment

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Test build locally:**
   ```bash
   npm run start
   ```

3. **Deploy build folder to hosting:**
   ```bash
   # Deploy .next folder + public folder + package.json
   ```

---

## ✅ Post-Deployment Verification

### 1. Network Checks
- [ ] Wallet connects to Base Mainnet (not Sepolia)
- [ ] Transaction explorer links point to basescan.org (not sepolia.basescan.org)
- [ ] Gas estimates show mainnet prices
- [ ] Chain ID is 8453 (Base Mainnet)

### 2. Feature Testing
- [ ] Connect wallet (Coinbase Wallet, MetaMask)
- [ ] View Basename profile in wallet dropdown
- [ ] NFT minting works on mainnet
- [ ] NFT listing/buying works
- [ ] Token swap works (if implemented)
- [ ] Farcaster frames render correctly
- [ ] XMTP chat works (if implemented)
- [ ] Dark mode persists
- [ ] All links in footer work

### 3. Performance Checks
- [ ] Page load time < 3 seconds
- [ ] Images load from IPFS/Pinata
- [ ] RPC calls don't fail (check fallbacks)
- [ ] No console errors
- [ ] Mobile responsive works

### 4. Security Audit
- [ ] No private keys in source code
- [ ] No API keys exposed in client-side code
- [ ] HTTPS enabled
- [ ] CSP headers configured
- [ ] Rate limiting on API routes

---

## 🔧 Maintenance

### Monitor These:
1. **Alchemy RPC Usage**: https://dashboard.alchemy.com/
2. **Vercel Analytics**: Check performance
3. **Basescan**: Monitor contract transactions
4. **Error Logs**: Check Vercel logs for issues

### Update Contract Address:
If you redeploy the contract, update:
1. `.env.local` → `NEXT_PUBLIC_MARKETPLACE_CONTRACT`
2. Redeploy frontend
3. Update Farcaster frame metadata

---

## 📞 Support Resources

- **Base Docs**: https://docs.base.org
- **OnchainKit**: https://onchainkit.xyz
- **Farcaster Docs**: https://docs.farcaster.xyz
- **Vercel Support**: https://vercel.com/support
- **Basescan**: https://basescan.org

---

## 🚨 Emergency Rollback

If issues occur after deployment:

1. **Pause contract (if implemented):**
   ```solidity
   marketplace.pause()
   ```

2. **Rollback Vercel deployment:**
   ```bash
   vercel rollback
   ```

3. **Switch back to testnet** (temporary):
   - Update `.env.local`: `NEXT_PUBLIC_NETWORK=baseSepolia`
   - Redeploy

---

## 📈 Production Checklist Summary

### Configuration ✅
- [x] Base Mainnet configured
- [x] Testnet removed
- [x] Production environment variables
- [x] API keys configured
- [x] Private keys removed

### Smart Contracts ⚠️
- [ ] Deploy marketplace contract to Base Mainnet
- [ ] Update contract address in `.env.local`
- [ ] Verify contract on Basescan
- [ ] Test contract functions

### Deployment 🚀
- [ ] Build passes without errors
- [ ] Deploy to Vercel/hosting
- [ ] Configure custom domain
- [ ] Set environment variables
- [ ] Test live site

### Verification ✓
- [ ] All features work on mainnet
- [ ] No console errors
- [ ] Mobile works
- [ ] Performance acceptable
- [ ] Security audit passed

---

**Ready to deploy! 🎉**

Your FarcasterSea NFT Marketplace is configured for Base Mainnet production deployment.

**Next Step:** Deploy your smart contract to Base Mainnet and update the contract address.
