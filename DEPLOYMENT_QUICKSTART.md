# Quick Deployment Guide 🚀

**Current Status:** ✅ All security fixes complete, ready for testnet deployment

---

## Prerequisites Checklist

Before deploying, ensure you have:

- [ ] Created `.env.local` file in project root
- [ ] Obtained Alchemy API key
- [ ] Obtained WalletConnect Project ID
- [ ] Obtained BaseScan API key
- [ ] Generated secure webhook secret
- [ ] Have deployer wallet with private key
- [ ] Have test ETH on Base Sepolia (for testnet)
- [ ] Have real ETH on Base (for mainnet)

---

## Step 1: Create .env.local File

Create a file named `.env.local` in your project root:

```bash
# API Keys (get from respective services)
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key_here
NEXT_PUBLIC_TATUM_API_KEY=your_tatum_key_here
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_id_here
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_coinbase_cdp_key_here
BASESCAN_API_KEY=your_basescan_key_here

# Security
FARCASTER_WEBHOOK_SECRET=generate_random_string_here

# Deployment (NEVER share this!)
PRIVATE_KEY=your_deployer_wallet_private_key
```

**Generate Webhook Secret:**
```powershell
# PowerShell command to generate secure random string
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

---

## Step 2: Get API Keys

### Alchemy (Required)
1. Visit https://dashboard.alchemy.com/
2. Sign up for free account
3. Create new app, select "Base" network
4. Copy API key to `.env.local`

### WalletConnect (Required)
1. Visit https://cloud.walletconnect.com/
2. Create free account
3. Create new project
4. Copy Project ID to `.env.local`

### BaseScan (Required for verification)
1. Visit https://basescan.org/myapikey
2. Sign up and create API key
3. Copy to `.env.local`

### OnchainKit/CDP (Optional but recommended)
1. Visit https://portal.cdp.coinbase.com/
2. Create API key
3. Copy to `.env.local`

---

## Step 3: Test on Sepolia Testnet (Recommended)

### 3.1 Get Test ETH
Visit Base Sepolia faucet:
- https://www.alchemy.com/faucets/base-sepolia
- Connect your wallet
- Request test ETH (free)

### 3.2 Deploy to Sepolia
```powershell
# Deploy contract
npx hardhat run scripts/deploy-sepolia.ts --network baseSepolia

# Note the deployed contract address
```

### 3.3 Verify Contract on BaseScan
```powershell
# Replace CONTRACT_ADDRESS with your deployed address
npx hardhat verify --network baseSepolia CONTRACT_ADDRESS
```

### 3.4 Test All Functions
Test in this order:
1. ✅ Mint an NFT
2. ✅ List NFT for sale
3. ✅ Buy NFT (from different wallet)
4. ✅ Test pause/unpause (owner only)
5. ✅ Withdraw funds
6. ✅ Update price
7. ✅ Cancel listing

---

## Step 4: Deploy to Base Mainnet

⚠️ **Only proceed after successful Sepolia testing!**

### 4.1 Ensure Mainnet Readiness
- [ ] All Sepolia tests passed
- [ ] Have ~0.01 ETH on Base mainnet (~$30-50 for gas)
- [ ] Double-checked `.env.local` has mainnet keys
- [ ] Backed up deployer private key securely

### 4.2 Deploy to Mainnet
```powershell
# Deploy to Base mainnet
npx hardhat run scripts/deploy.ts --network base

# SAVE THIS ADDRESS! You'll need it for frontend
```

### 4.3 Verify on BaseScan
```powershell
# Replace CONTRACT_ADDRESS with deployed address
npx hardhat verify --network base CONTRACT_ADDRESS
```

### 4.4 Update Frontend
Update contract address in frontend:
```typescript
// src/lib/contracts/marketplaceContract.ts
export const MARKETPLACE_ADDRESS = '0xYOUR_DEPLOYED_ADDRESS_HERE'
```

---

## Step 5: Frontend Deployment

### 5.1 Update Vercel Environment Variables
In Vercel dashboard, add these environment variables:
- `NEXT_PUBLIC_ALCHEMY_API_KEY`
- `NEXT_PUBLIC_TATUM_API_KEY`
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`
- `NEXT_PUBLIC_ONCHAINKIT_API_KEY`
- `BASESCAN_API_KEY`
- `FARCASTER_WEBHOOK_SECRET`

⚠️ **Never add `PRIVATE_KEY` to Vercel!**

### 5.2 Deploy to Vercel
```powershell
# If not already deployed
npm i -g vercel
vercel

# If already deployed, redeploy
vercel --prod
```

---

## Step 6: Post-Deployment Checklist

### Immediate Testing (First 30 minutes)
- [ ] Visit deployed site, connect wallet
- [ ] Mint a test NFT
- [ ] List NFT for sale
- [ ] Buy NFT from different wallet
- [ ] Test withdrawal
- [ ] Verify all transactions on BaseScan

### Security Checks (First 24 hours)
- [ ] Test pause function works
- [ ] Test unpause function works
- [ ] Verify only owner can pause
- [ ] Check max price validation (try listing >1M ETH)
- [ ] Monitor contract for unexpected activity

### Monitoring Setup
- [ ] Set up BaseScan watch on contract address
- [ ] Enable email alerts for contract transactions
- [ ] Monitor error logs in Vercel
- [ ] Check wallet balances regularly

---

## Common Issues & Solutions

### Issue: "Insufficient funds for gas"
**Solution:** Add more ETH to deployer wallet

### Issue: "Invalid API key"
**Solution:** Check `.env.local` has correct keys without quotes

### Issue: "Contract verification failed"
**Solution:** Make sure you're using same compiler version (0.8.22)

### Issue: "Transaction failed"
**Solution:** Check BaseScan for error message, likely validation issue

### Issue: "Frontend can't connect to contract"
**Solution:** Verify contract address is correct in `marketplaceContract.ts`

---

## Emergency Procedures

### If Contract Has Issues
1. **PAUSE IMMEDIATELY**
   ```typescript
   // Call pause() function from owner wallet
   await contract.pause()
   ```

2. **Investigate Issue**
   - Check BaseScan for failed transactions
   - Review error messages
   - Check if exploit or just bug

3. **If Funds at Risk**
   - Keep contract paused
   - Contact users via social media
   - Consider deploying fixed version

### If API Keys Compromised
1. **Immediately rotate all keys**
2. **Revoke old keys from service dashboards**
3. **Update `.env.local` and Vercel env vars**
4. **Monitor for unauthorized usage**

---

## Cost Breakdown

### One-Time Costs
- Contract deployment on Base: ~$30-50
- Domain name (optional): ~$10-15/year
- Professional audit (optional): $15K-$50K

### Monthly Costs
- Alchemy API: FREE (up to 300M compute units)
- WalletConnect: FREE
- BaseScan API: FREE
- Vercel hosting: FREE (hobby plan)
- **Total: $0/month** 🎉

---

## Timeline Estimate

| Task | Duration |
|------|----------|
| Get API keys | 30 min |
| Create .env.local | 5 min |
| Deploy to Sepolia | 10 min |
| Test on Sepolia | 1-2 hours |
| Deploy to mainnet | 15 min |
| Deploy frontend to Vercel | 10 min |
| Post-deployment testing | 30 min |
| **TOTAL** | **2.5-3.5 hours** |

---

## Success Checklist

Your marketplace is ready when:
- ✅ Contract deployed and verified on BaseScan
- ✅ All test transactions successful
- ✅ Frontend connected to mainnet contract
- ✅ Pause/unpause tested and working
- ✅ No errors in Vercel logs
- ✅ Wallets can connect via RainbowKit
- ✅ NFTs mint, list, and sell successfully
- ✅ Withdrawals work correctly
- ✅ Royalties distributed properly

---

## Need Help?

### Documentation
- Hardhat: https://hardhat.org/
- OpenZeppelin: https://docs.openzeppelin.com/
- Base Network: https://docs.base.org/
- RainbowKit: https://www.rainbowkit.com/

### Support
- Base Discord: https://discord.gg/buildonbase
- Farcaster: https://warpcast.com/~/developers
- Hardhat Discord: https://discord.gg/hardhat

---

**Ready to deploy? Start with Step 1! 🚀**
