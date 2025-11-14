# ⚡ Gasless Transactions - Quick Start (5 Minutes)

Get up and running with gas-free NFT transactions in 5 minutes!

## Step 1: Get Paymaster RPC URL (2 min)

1. Go to → https://portal.cdp.coinbase.com/
2. Sign in (or create account)
3. Click **"Paymaster"** in sidebar
4. Go to **"Configuration"** tab
5. **Copy the RPC URL** (looks like: `https://api.developer.coinbase.com/rpc/v1/base/abc123...`)

## Step 2: Add to Environment (30 sec)

```bash
# Create .env.local file (or edit existing)
echo "NEXT_PUBLIC_PAYMASTER_RPC_URL=https://api.developer.coinbase.com/rpc/v1/base/YOUR_KEY_HERE" > .env.local

# For Base Mainnet (optional, defaults to testnet)
echo "NEXT_PUBLIC_NETWORK=mainnet" >> .env.local
```

## Step 3: Configure Allowlist (1 min)

In CDP Portal → Paymaster → **Allowlist** tab:

1. Click **"Add Contract"**
2. Paste your NFT contract address: `0x...`
3. Select functions to sponsor:
   - ✅ `mintTo` (NFT minting)
   - ✅ `buy` (NFT purchasing)
   - ✅ `list` (NFT listing)
4. Click **"Save"**

## Step 4: Set Limits (1 min)

In CDP Portal → Paymaster → **Limits** tab:

### Per-User Limits
- Amount: `$0.05` per cycle
- Operations: `1` per cycle
- Reset: `Monthly`

### Global Limits
- **Testnet**: Leave unlimited (for testing)
- **Mainnet**: Set `$15,000` per month (or your budget)

## Step 5: Enable & Test (30 sec)

1. In CDP Portal → Configuration tab → Toggle **"Enable Paymaster"** to ON
2. Restart your dev server:
   ```bash
   npm run dev
   ```
3. Open http://localhost:3000
4. Connect wallet
5. Look for green **"Gas Free"** badge on buttons ✅

## ✅ Done!

You should now see:
- ✨ Green "Gas Free" badges on transaction buttons
- Smart Account address in header
- "Gas-Free Transactions Enabled" banner

## Test It Out

Try these actions (all gas-free!):

1. **Mint NFT** → Go to `/create` → Click "Mint NFT"
2. **Buy NFT** → Go to collections → Click "Buy Now"
3. **List NFT** → Go to `/my-nfts` → Click "List for Sale"

All gas fees are sponsored by your Paymaster! 🎉

---

## Troubleshooting

**❌ Badge not showing?**
- Check `.env.local` has `NEXT_PUBLIC_PAYMASTER_RPC_URL`
- Restart dev server: `npm run dev`
- Connect wallet and wait 5 seconds

**❌ Transaction fails?**
- Verify contract is allowlisted in CDP
- Check function is allowlisted
- Ensure Paymaster is enabled (toggle in CDP)

**❌ "Paymaster not configured" error?**
- Double-check RPC URL in `.env.local`
- Make sure it starts with `https://api.developer.coinbase.com/`

---

## What's Next?

1. **Monitor Usage** → CDP Portal → Analytics → View gas fees paid
2. **Adjust Limits** → Increase/decrease based on traffic
3. **Deploy** → When ready, switch to mainnet in `.env.local`

---

## Need Help?

- 📖 [Full Documentation](./GASLESS_TRANSACTIONS.md)
- 📝 [Implementation Summary](./GASLESS_IMPLEMENTATION_SUMMARY.md)
- 🔧 [Base Paymaster Docs](https://docs.base.org/docs/tools/paymaster)
- 💬 [CDP Support](https://portal.cdp.coinbase.com/)

---

**That's it! Your users can now transact without paying gas fees.** 🚀
