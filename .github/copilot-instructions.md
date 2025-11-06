# Farcaster MiniKit NFT Marketplace - AI Coding Guidelines

## Project Overview

This is a Farcaster MiniKit NFT marketplace built with **Next.js + TypeScript**, designed to operate within the **Farcaster ecosystem** on **Base network**. The project enables NFT transactions through Farcaster frames and MiniKit SDK.

## Architecture

- **Frontend**: Next.js 14+ with TypeScript and TailwindCSS
- **Blockchain**: Base network (Ethereum L2) integration
- **Farcaster Integration**: Frames and MiniKit SDK for social interactions
- **Web3 Stack**: Wagmi v2 + Viem for blockchain interactions
- **NFT Standard**: ERC-721 with marketplace functionality

## Development Workflows

### Local Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # TypeScript validation
```

### Frame Development
```bash
npm run dev:frames   # Start with frame debugging
npm run test:frames  # Test frame responses
```

## Key Dependencies

- `@farcaster/core` - Core Farcaster SDK
- `@minikit/react` - MiniKit React components
- `wagmi` - Web3 React hooks
- `viem` - Ethereum library
- `@base-org/base-ui` - Base network UI components

## Farcaster-Specific Patterns

### Frame Structure
All frames follow the Farcaster spec and use MiniKit components:
```typescript
import { Frame } from '@minikit/react';

export default function NFTFrame({ nft }: { nft: NFT }) {
  return (
    <Frame>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content={nft.image} />
      <meta property="fc:frame:button:1" content="Buy Now" />
    </Frame>
  );
}
```

### MiniKit Integration
Use MiniKit hooks for Farcaster-specific functionality:
```typescript
import { useMiniKit } from '@minikit/react';

const { user, sendTransaction } = useMiniKit();
```

## Base Network Configuration

- **Chain ID**: 8453 (Base Mainnet) / 84532 (Base Sepolia Testnet)
- **RPC**: Base-specific endpoints
- **Explorer**: Basescan integration

## File Organization

- `app/` - Next.js 14 app router
- `components/frames/` - Farcaster frame components
- `lib/farcaster/` - Farcaster SDK utilities
- `lib/base/` - Base network utilities
- `hooks/` - Custom React hooks
- `types/` - TypeScript definitions

## Integration Points

### Farcaster Frames
All NFT interactions happen through frames that integrate with:
- MiniKit wallet connection
- Base network transactions
- Social sharing and engagement

### Base Network
Optimized for Base's low fees and fast transactions:
- Native ETH payments
- Base ecosystem token support
- Cross-chain bridging capabilities

## Environment Variables

Required for Farcaster/Base integration:
- `NEXT_PUBLIC_BASE_RPC_URL`
- `NEXT_PUBLIC_FARCASTER_HUB_URL`
- `MINIKIT_APP_ID`
- `FARCASTER_DEVELOPER_FID`