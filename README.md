# 🖼️ FarcastMints - NFT Marketplace

<div align="center">

![Farcaster](https://img.shields.io/badge/Farcaster-Framework-8B5CF6)
![Base](https://img.shields.io/badge/Base-Network-0052FF)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4)
![License](https://img.shields.io/badge/License-MIT-green)

**A complete NFT marketplace built for the Farcaster ecosystem with MiniKit integration and Base network optimization**

[🚀 Live Demo](https://farcastmints.com) • [📖 Documentation](#documentation) • [🎯 Features](#features) • [🛠️ Setup](#quick-start)

</div>

## 🎯 Features

### 🖼️ **Farcaster Native Experience**
- **Interactive Frames** - Share NFTs directly in Farcaster feeds with purchase buttons
- **MiniKit Integration** - Seamless wallet connection and social authentication
- **Frame Discovery** - Browse and test all available NFT frames
- **Viral Sharing** - One-click sharing to Warpcast and Farcaster clients

### 🌙 **Modern UI/UX** 
- **Dark Mode System** - Complete light/dark theme with persistence
- **Responsive Design** - Perfect experience on mobile and desktop
- **Smooth Animations** - 60fps transitions with Framer Motion
- **Real-time Updates** - Live marketplace activity and user counters

### ⚡ **Base Network Optimized**
- **Gasless Transactions** - FREE gas fees sponsored by Base Paymaster (NEW!)
- **Smart Accounts** - ERC-4337 Account Abstraction for seamless UX
- **Low Fees** - Leveraging Base L2 for affordable transactions
- **Fast Confirmations** - Quick NFT purchases and listings
- **Wallet Integration** - RainbowKit with Base network support
- **Chain Validation** - Automatic Base network detection and switching

### 🎮 **Advanced Engagement**
- **Social Proof** - Live user counters and trending items
- **Activity Feed** - Real-time marketplace transactions and interactions  
- **XMTP Chat** - Base App Quick Actions integration
- **Progress Tracking** - User engagement and achievement system

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git for version control
- A Farcaster account for testing frames

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/farcaster-nft-marketplace.git
cd farcaster-nft-marketplace

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the marketplace in action!

### Environment Setup

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_FARCASTER_HUB_URL=https://nemes.farcaster.xyz:2283
MINIKIT_APP_ID=your-minikit-app-id
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id
```

## 🏗️ Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org)** - Type-safe development
- **[TailwindCSS](https://tailwindcss.com)** - Utility-first styling
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations

### Web3 Integration  
- **[Wagmi v2](https://wagmi.sh)** - React hooks for Ethereum
- **[RainbowKit](https://www.rainbowkit.com)** - Wallet connection UI
- **[Viem](https://viem.sh)** - TypeScript Ethereum library
- **[Base Network](https://base.org)** - Ethereum L2 for low fees

### Farcaster Ecosystem
- **[@farcaster/core](https://github.com/farcasterxyz/hub-monorepo)** - Core Farcaster SDK
- **[@farcaster/hub-nodejs](https://github.com/farcasterxyz/hub-monorepo)** - Hub integration
- **[Farcaster Frames](https://docs.farcaster.xyz/developers/frames)** - Interactive social content
- **[MiniKit SDK](https://docs.farcaster.xyz/developers/minikit)** - Native app integration

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Main application entry
│   ├── marketplace.tsx          # Core marketplace component  
│   ├── providers.tsx            # Web3 and context providers
│   ├── globals.css              # Global styles + dark mode
│   └── api/
│       ├── frames/              # Farcaster Frame endpoints
│       └── test-frame/          # Frame testing utilities
├── components/
│   ├── Header.tsx              # Navigation with dark mode
│   ├── NFTCard.tsx             # Enhanced NFT display cards
│   ├── DarkModeToggle.tsx      # Theme switching components
│   ├── FrameShare.tsx          # Frame sharing modal
│   ├── SocialProof.tsx         # Activity feed & social widgets
│   ├── GaslessUI.tsx           # Gasless transaction UI components
│   └── ...                     # Additional UI components
├── contexts/
│   └── ThemeContext.tsx        # Dark mode state management
├── hooks/
│   └── useSmartAccount.ts      # Smart Account & gasless transactions
└── lib/
    ├── wagmi.ts                # Web3 configuration
    └── paymaster.ts            # Base Paymaster configuration
```

## ✨ Gasless Transactions (NEW!)

**Zero gas fees for your users!** All transaction costs are sponsored by Base Paymaster.

### Quick Setup (5 minutes)

1. **Get Paymaster RPC URL**
   - Visit [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
   - Go to Paymaster → Configuration
   - Copy your RPC URL

2. **Add to Environment**
   ```bash
   # .env.local
   NEXT_PUBLIC_PAYMASTER_RPC_URL=https://api.developer.coinbase.com/rpc/v1/base/YOUR_KEY
   ```

3. **Configure Allowlist**
   - Add your NFT contract address in CDP
   - Allowlist functions: `mintTo`, `buy`, `list`

4. **Set Spending Limits**
   - Per-user: $0.05/month, 1 operation
   - Global: $15,000/month (or your budget)

5. **Done!** 🎉 Users can now mint, buy, and list NFTs **completely free**.

📖 **Full Guide**: [GASLESS_QUICKSTART.md](./GASLESS_QUICKSTART.md)  
📚 **Documentation**: [GASLESS_TRANSACTIONS.md](./GASLESS_TRANSACTIONS.md)  
📝 **Implementation**: [GASLESS_IMPLEMENTATION_SUMMARY.md](./GASLESS_IMPLEMENTATION_SUMMARY.md)

## 🌐 API Endpoints

### Farcaster Frames
- `GET /api/frames` - Frame discovery page
- `GET /api/frames/nft/[tokenId]` - Interactive NFT frame
- `GET /api/frames/nft/[tokenId]/image` - Dynamic frame image
- `GET /api/test-frame` - Frame testing endpoint

### Features Available
- **Browse NFTs** - Complete marketplace interface
- **Dark Mode** - Toggle in header (moon/sun icon)  
- **Frame Sharing** - Click "Share Frame" on NFT cards
- **Live Activity** - Real-time marketplace updates
- **Wallet Connect** - RainbowKit integration

## 🎨 Screenshots

### Light Mode
![Light Mode Screenshot](docs/images/light-mode.png)

### Dark Mode  
![Dark Mode Screenshot](docs/images/dark-mode.png)

### Farcaster Frame
![Frame Screenshot](docs/images/farcaster-frame.png)

## 🧪 Testing Frames

### Local Testing
```bash
# Start the development server
npm run dev

# Test frame endpoints
curl http://localhost:3000/api/frames/nft/1
curl http://localhost:3000/api/frames/nft/1/image
```

### Farcaster Integration
1. Share frame URL in a Farcaster cast
2. View in Warpcast or other Farcaster clients
3. Test interactive buttons and purchasing flow

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configure environment variables in Vercel dashboard
# Set up custom domain and SSL
```

### Manual Deployment
```bash
# Build for production
npm run build

# Start production server  
npm start
```

See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for complete deployment guide.

## 📖 Documentation

- **[Implementation Summary](IMPLEMENTATION_SUMMARY.md)** - Complete feature overview
- **[Dark Mode Guide](DARK_MODE_IMPLEMENTATION.md)** - Theme system documentation  
- **[Activity Feed Guide](ACTIVITY_FEED_FIX.md)** - Real-time updates system
- **[Deployment Checklist](DEPLOYMENT_CHECKLIST.md)** - Production deployment
- **[Project Snapshot](PROJECT_SNAPSHOT.md)** - Current status and features

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`  
5. Open a Pull Request

### Code Standards
- TypeScript for type safety
- ESLint + Prettier for code formatting
- Conventional commits for commit messages
- Component documentation with JSDoc

## 🐛 Issues & Support

- **Bug Reports**: [Create an issue](https://github.com/YOUR_USERNAME/farcaster-nft-marketplace/issues)
- **Feature Requests**: [Request a feature](https://github.com/YOUR_USERNAME/farcaster-nft-marketplace/issues)
- **Documentation**: Check our [docs folder](./docs)
- **Community**: Join our [Farcaster channel](https://warpcast.com/~/channel/nft-marketplace)

## 🎯 Roadmap

### ✅ Completed (v1.0)
- [x] Complete marketplace interface with dark mode
- [x] Farcaster Frame integration with sharing
- [x] Real-time activity feed with emoji avatars
- [x] Base network integration with wallet support
- [x] XMTP chat and Base App Quick Actions

### 🚧 In Progress (v1.1)  
- [ ] NFT creation and minting flow
- [ ] Smart contract integration for real transactions
- [ ] User authentication with Farcaster profiles
- [ ] WebSocket real-time updates

### 🔮 Future (v2.0)
- [ ] Multi-chain support (Ethereum, Polygon)
- [ ] Advanced filtering and search
- [ ] Auction and bidding system
- [ ] Creator royalties and revenue sharing
- [ ] Mobile app with MiniKit

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Farcaster](https://farcaster.xyz)** for the decentralized social protocol
- **[Base](https://base.org)** for the fast, low-cost L2 network  
- **[Coinbase](https://coinbase.com)** for MiniKit and developer tools
- **[Vercel](https://vercel.com)** for excellent Next.js hosting
- **Community** contributors and testers

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=YOUR_USERNAME/farcaster-nft-marketplace&type=Date)](https://star-history.com/#YOUR_USERNAME/farcaster-nft-marketplace&Date)

---

<div align="center">

**Built with ❤️ for the Farcaster and Base ecosystem**

[🐦 Follow Updates](https://warpcast.com/YOUR_USERNAME) • [🌐 Website](https://your-domain.com) • [📧 Contact](mailto:your-email@domain.com)

</div>