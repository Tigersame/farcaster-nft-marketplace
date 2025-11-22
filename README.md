# CurSwap 🚀

**DeFi on Base** - Swap, Earn, Grow

A comprehensive DeFi platform built on Base network featuring token swapping, liquidity pools, and token listings. Fully integrated with Farcaster for social engagement.

## 🌟 Features

### 💱 Token Swap
- Powered by OnchainKit Swap component
- 8+ Base chain tokens (ETH, USDC, DAI, WETH, cbETH, wstETH, rETH, USDbC)
- Configurable slippage tolerance
- Real-time price quotes
- Low fees and fast transactions

### 💎 Token List
- Live token prices and 24h changes
- Market cap and volume data
- Search and category filters
- Direct trading from token list

### 💧 Liquidity Pools
- 5 major liquidity pools
- APR ranging from 8.7% to 18.2%
- Pool composition and statistics
- Add/remove liquidity interface
- Total TVL: $118M+

### 🎯 Farcaster Integration
- Interactive Farcaster Frames
- Share trading activity
- Dynamic frame images
- Social engagement features

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: TailwindCSS + Framer Motion
- **Web3**: Wagmi + RainbowKit + OnchainKit
- **Network**: Base (Chain ID: 8453)
- **Identity**: Basename resolution
- **State**: React Query
- **UI**: Custom components + Lucide icons

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- A Web3 wallet (MetaMask, Coinbase Wallet, etc.)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd curswap

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app.

### Environment Variables

```env
NEXT_PUBLIC_BASE_URL=https://curswap.com
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_TATUM_API_KEY=your_tatum_api_key
```

## 📁 Project Structure

```
curswap/
├── src/
│   ├── app/
│   │   ├── defi/              # Main DeFi page
│   │   └── api/
│   │       └── frames/        # Farcaster Frames
│   ├── components/
│   │   └── defi/              # DeFi components
│   │       ├── EnhancedSwapWidget.tsx
│   │       ├── TokenList.tsx
│   │       ├── LiquidityPools.tsx
│   │       └── ShareDeFi.tsx
│   ├── lib/
│   │   ├── baseTokens.ts      # Token & pool data
│   │   └── wagmi.ts           # Web3 configuration
│   └── config/
│       └── branding.ts        # App branding
├── public/                    # Static assets
└── package.json
```

## 📖 Key Pages

- **`/`** - Homepage with feature cards
- **`/defi`** - Main DeFi hub with tabs:
  - Swap - Token swapping interface
  - Tokens - Token list and prices
  - Pools - Liquidity pool management

## 🎨 Customization

### Update Branding
Edit `/src/config/branding.ts`:
```typescript
export const BRANDING = {
  name: 'CurSwap',
  tagline: 'DeFi on Base',
  colors: { ... },
  links: { ... }
}
```

### Add New Tokens
Edit `/src/lib/baseTokens.ts`:
```typescript
export const BASE_TOKENS: Token[] = [
  {
    address: '0x...',
    chainId: 8453,
    decimals: 18,
    name: 'Your Token',
    symbol: 'TKN',
    image: 'https://...'
  }
]
```

### Add New Pools
Edit `/src/lib/baseTokens.ts`:
```typescript
export const MOCK_LIQUIDITY_POOLS: LiquidityPool[] = [
  {
    id: 'new-pool',
    name: 'TKN/USDC',
    token0: yourToken,
    token1: USDC,
    tvl: '$...',
    apr: '...',
    // ...
  }
]
```

## 🔗 API Endpoints

### Farcaster Frames
- `GET /api/frames/defi` - Main DeFi frame
- `GET /api/frames/defi/image` - Frame OG image
- `POST /api/frames/defi/pools` - Pools frame
- `POST /api/frames/defi/tokens` - Tokens frame

## 📊 Statistics

- **Total TVL**: $507M+
- **24h Volume**: $56M+
- **Tokens**: 8+
- **Liquidity Pools**: 5
- **Average APR**: 13.1%

## 🧪 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Setup
Make sure to set all environment variables in your deployment platform:
- `NEXT_PUBLIC_BASE_URL`
- `NEXT_PUBLIC_ONCHAINKIT_API_KEY`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- Other API keys as needed

## 📚 Documentation

- [DeFi Features Guide](./DEFI_FEATURES.md)
- [OnchainKit Docs](https://onchainkit.xyz)
- [Base Network](https://base.org)
- [Wagmi Docs](https://wagmi.sh)
- [RainbowKit](https://rainbowkit.com)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built on [Base](https://base.org) network
- Powered by [OnchainKit](https://onchainkit.xyz)
- Farcaster integration
- RainbowKit for wallet connections

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check the [documentation](./DEFI_FEATURES.md)
- Visit [Base Discord](https://base.org/discord)

---

**CurSwap** - Made with ❤️ for the Base ecosystem
