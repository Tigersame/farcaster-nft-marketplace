# CurSwap - Quick Start Guide 🚀

Welcome to **CurSwap** - Your DeFi platform on Base Network!

## ✅ What's Been Set Up

Your project has been successfully rebranded to **CurSwap** with:
- ✅ DeFi Hub with token swap, liquidity pools, and token list
- ✅ OnchainKit integration for secure swapping
- ✅ Farcaster Frame support
- ✅ RainbowKit wallet connections
- ✅ Base network configuration
- ✅ Modern, responsive UI with dark mode
- ✅ Complete documentation

## 🏃 Run Your App Now

### 1. Install Dependencies (if not done)
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your API keys
# At minimum, you need:
# - NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
# - NEXT_PUBLIC_ALCHEMY_API_KEY (or NEXT_PUBLIC_TATUM_API_KEY)
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open Your Browser
Visit: **http://localhost:3000**

## 🎯 Test Your DeFi Platform

### Homepage
- See the new CurSwap branding
- Click "Launch DeFi Hub" button

### DeFi Hub (`/defi`)
Try all three tabs:

**Swap Tab:**
1. Connect your wallet (top right)
2. Select tokens to swap
3. Enter amount
4. Execute swap

**Tokens Tab:**
1. Browse 8+ Base chain tokens
2. Search for specific tokens
3. Filter by category
4. View prices and market data

**Pools Tab:**
1. View 5 liquidity pools
2. Click a pool to expand details
3. See APR, TVL, and volume
4. Add/remove liquidity (UI demo)

## 🔑 Required API Keys

### Essential (for full functionality)
1. **WalletConnect Project ID**
   - Get it: https://cloud.walletconnect.com
   - Free tier available
   - Needed for wallet connections

2. **Alchemy API Key**
   - Get it: https://alchemy.com
   - Free tier: 300M compute units/month
   - Needed for RPC access

### Optional (but recommended)
3. **OnchainKit API Key**
   - Get it: https://portal.cdp.coinbase.com
   - Improves swap performance
   - Better rate limits

4. **Tatum API Key**
   - Get it: https://tatum.io
   - Backup RPC provider
   - Improves reliability

## 📁 Key Files & Folders

```
curswap/
├── src/
│   ├── app/
│   │   ├── defi/page.tsx          # Main DeFi page
│   │   ├── page.tsx                # Homepage
│   │   └── layout.tsx              # App layout with metadata
│   ├── components/
│   │   └── defi/                   # DeFi components
│   │       ├── EnhancedSwapWidget.tsx
│   │       ├── TokenList.tsx
│   │       └── LiquidityPools.tsx
│   ├── lib/
│   │   ├── baseTokens.ts          # Token & pool data
│   │   └── wagmi.ts               # Web3 config
│   └── config/
│       └── branding.ts            # Branding config
├── README.md                       # Full documentation
├── DEFI_FEATURES.md               # Feature details
├── REBRANDING_SUMMARY.md          # What changed
└── .env.example                   # Environment template
```

## 🎨 Customize Your Brand

### Update Logo
Replace these files in `/public`:
- `icon.svg` - Main logo (1024x1024)
- `logo.svg` - Small logo (100x100)
- `favicon.svg` - Browser icon

### Update Colors
Edit `src/config/branding.ts`:
```typescript
colors: {
  primary: '#6E4BFF',  // Change to your primary color
  accent: '#FF6BA6',   // Change to your accent color
  // ...
}
```

### Update Domain
Edit `src/config/branding.ts`:
```typescript
links: {
  website: 'https://your-domain.com',
  // ...
}
```

## 🪙 Add More Tokens

Edit `src/lib/baseTokens.ts`:
```typescript
export const BASE_TOKENS: Token[] = [
  // Add your token
  {
    address: '0xYourTokenAddress',
    chainId: 8453,
    decimals: 18,
    name: 'Your Token',
    symbol: 'TKN',
    image: 'https://your-token-image.png'
  },
  // ... existing tokens
]
```

## 💧 Add More Pools

Edit `src/lib/baseTokens.ts`:
```typescript
export const MOCK_LIQUIDITY_POOLS: LiquidityPool[] = [
  // Add your pool
  {
    id: 'unique-id',
    name: 'TKN/USDC',
    token0: yourToken,
    token1: USDC,
    tvl: '$1,000,000',
    apr: '25.5%',
    volume24h: '$250,000',
    fee: '0.3%',
    poolAddress: '0xPoolAddress'
  },
  // ... existing pools
]
```

## 🚀 Deploy to Production

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Environment Variables for Production
Set these in your hosting platform:
- `NEXT_PUBLIC_BASE_URL=https://your-domain.com`
- `NEXT_PUBLIC_ONCHAINKIT_API_KEY=...`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...`
- `NEXT_PUBLIC_ALCHEMY_API_KEY=...`
- All other keys from `.env.example`

## 📱 Features Available

### ✅ Currently Working
- Token swapping with OnchainKit
- Token list with mock prices
- Liquidity pool displays
- Wallet connection (RainbowKit)
- Farcaster Frames
- Dark mode
- Mobile responsive
- Share on social media

### 🔄 Mock Data (Replace with Real Data)
- Token prices (currently hardcoded)
- Market cap and volume (currently mock)
- Liquidity pool stats (currently mock)

To connect real data, integrate:
- CoinGecko API for prices
- The Graph for on-chain data
- Your own backend for pool analytics

## 🐛 Troubleshooting

### Wallet won't connect?
- Check WalletConnect Project ID is set
- Try different wallet (MetaMask, Coinbase Wallet)
- Clear browser cache

### Swap not working?
- Make sure wallet is connected
- Check you're on Base network
- Verify OnchainKit API key (optional but helps)

### RPC errors?
- Check Alchemy/Tatum API keys
- Try switching to public RPC temporarily
- Check Base network status

## 📚 Learn More

- **Full Documentation**: See `README.md`
- **DeFi Features**: See `DEFI_FEATURES.md`
- **Rebranding Details**: See `REBRANDING_SUMMARY.md`

## 🆘 Getting Help

### Official Resources
- OnchainKit Docs: https://onchainkit.xyz
- Base Network: https://base.org
- Wagmi Docs: https://wagmi.sh
- RainbowKit: https://rainbowkit.com

### Community
- Base Discord: https://base.org/discord
- Farcaster: https://warpcast.com

## 🎉 You're All Set!

Your CurSwap DeFi platform is ready to go! 

**Next Steps:**
1. ✅ Run `npm run dev`
2. ✅ Test all features
3. ✅ Customize branding
4. ✅ Add your tokens/pools
5. ✅ Deploy to production

**Happy building! 🚀**

---

**CurSwap** - DeFi on Base Network
*Swap, Earn, Grow*
