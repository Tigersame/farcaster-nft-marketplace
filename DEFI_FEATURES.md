# Base Chain DeFi Hub - Feature Documentation

## Overview
A comprehensive DeFi miniapp built on Base network featuring token swapping, liquidity pools, and token listings. Fully integrated with Farcaster for social sharing and frames.

## Features

### 1. Token Swap (`/defi` - Swap Tab)
- **OnchainKit Integration**: Uses Coinbase's OnchainKit Swap component
- **Supported Tokens**: ETH, USDC, DAI, WETH, USDbC, wstETH, cbETH, rETH
- **Features**:
  - Real-time price quotes
  - Slippage tolerance configuration (0.1%, 0.5%, 1.0%, custom)
  - Transaction preview
  - Recent swaps display
  - Low fees powered by Base network

### 2. Token List (`/defi` - Tokens Tab)
- **Market Data**: Live prices and 24h changes
- **Token Information**:
  - Current price
  - 24h price change percentage
  - Market capitalization
  - 24h trading volume
- **Features**:
  - Search functionality
  - Category filters (All, Stablecoins, ETH Variants)
  - Direct trade button for each token
  - Responsive table design

### 3. Liquidity Pools (`/defi` - Pools Tab)
- **Pool Listings**: 5 major liquidity pools
  - ETH/USDC (12.5% APR)
  - WETH/USDC (18.2% APR)
  - DAI/USDC (8.7% APR)
  - cbETH/ETH (15.3% APR)
  - wstETH/WETH (10.8% APR)
- **Pool Details**:
  - Total Value Locked (TVL)
  - 24h trading volume
  - Annual Percentage Rate (APR)
  - Fee tier
  - Pool composition (50/50 split)
  - Contract address with Basescan link
- **Actions**:
  - Add liquidity
  - Remove liquidity
  - View pool details

## Technical Implementation

### Components

#### `/src/components/defi/EnhancedSwapWidget.tsx`
- Main swap interface with OnchainKit integration
- Settings panel for slippage configuration
- Connected wallet detection
- Transaction toast notifications

#### `/src/components/defi/TokenList.tsx`
- Token listing with search and filters
- Price display with 24h changes
- Market cap and volume statistics
- Responsive table layout

#### `/src/components/defi/LiquidityPools.tsx`
- Pool cards with expandable details
- Stats overview dashboard
- Interactive pool selection
- Add/remove liquidity interface

#### `/src/components/defi/ShareDeFi.tsx`
- Social sharing component
- Farcaster and Twitter integration
- Frame URL copying

### Data Sources

#### `/src/lib/baseTokens.ts`
- Token definitions with contract addresses
- Liquidity pool configurations
- Helper functions for token lookups

### Farcaster Frames

#### Frame Routes
- `/api/frames/defi/route.ts` - Main DeFi frame
- `/api/frames/defi/image/route.ts` - Frame image generator
- `/api/frames/defi/pools/route.ts` - Pools frame
- `/api/frames/defi/tokens/route.ts` - Tokens frame

#### Frame Features
- Interactive buttons for navigation
- Dynamic SVG image generation
- Post actions for frame interactions
- Deep linking to DeFi page

## Usage

### Accessing DeFi Hub
1. Navigate to homepage (`/`)
2. Click the highlighted "DeFi Hub - NEW!" card
3. Or directly visit `/defi`

### Swapping Tokens
1. Connect wallet using RainbowKit
2. Select "Swap" tab
3. Choose tokens to swap
4. Enter amount
5. Adjust slippage if needed (settings icon)
6. Review and confirm transaction

### Viewing Tokens
1. Navigate to "Tokens" tab
2. Search for specific tokens
3. Filter by category (All/Stablecoins/ETH Variants)
4. Click "Trade" to swap a token

### Managing Liquidity
1. Navigate to "Liquidity" tab
2. Browse available pools
3. Click a pool to expand details
4. View APR, TVL, and volume
5. Add or remove liquidity

### Sharing on Farcaster
1. Use the "Share" button (available on various components)
2. Choose Farcaster, Twitter, or copy Frame URL
3. Frame will display DeFi stats in Farcaster feed

## Configuration

### Environment Variables
```env
NEXT_PUBLIC_BASE_URL=https://farcastmints.com
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### Base Chain Configuration
- Network: Base Mainnet (Chain ID: 8453)
- RPC: Configured in `/src/lib/wagmi.ts`
- OnchainKit Provider: Set in `/src/app/providers.tsx`

## Statistics (Mock Data)

### Overview
- Total Value Locked: $507M+
- 24h Volume: $56M+
- Total Tokens: 8+
- Liquidity Pools: 5

### Top Pools
1. ETH/USDC - $45.2M TVL, 12.5% APR
2. WETH/USDC - $32.4M TVL, 18.2% APR
3. DAI/USDC - $12.3M TVL, 8.7% APR

## Future Enhancements

### Planned Features
- [ ] Real-time price feeds integration
- [ ] Live transaction history
- [ ] Pool analytics and charts
- [ ] Portfolio tracking
- [ ] Price alerts and notifications
- [ ] Advanced trading features (limit orders, stop loss)
- [ ] Governance token integration
- [ ] Staking mechanisms
- [ ] Yield farming opportunities
- [ ] Cross-chain bridging

### Integrations
- [ ] CoinGecko API for real prices
- [ ] The Graph for on-chain data
- [ ] Uniswap V3 protocol integration
- [ ] Base chain block explorer
- [ ] Wallet analytics

## Security Considerations

### Smart Contract Interactions
- Always verify contract addresses
- Use OnchainKit's secure swap implementation
- Enable transaction simulation before execution
- Monitor slippage settings

### User Safety
- Display transaction previews
- Show estimated gas fees
- Warn about high slippage
- Verify token approvals
- Enable multi-step confirmations

## Support & Resources

### Documentation
- OnchainKit Docs: https://onchainkit.xyz
- Base Network: https://base.org
- Wagmi: https://wagmi.sh
- RainbowKit: https://rainbowkit.com

### Base Chain Resources
- Base Scan: https://basescan.org
- Base Bridge: https://bridge.base.org
- Base Discord: https://base.org/discord

## Contributing

To add new tokens:
1. Update `BASE_TOKENS` array in `/src/lib/baseTokens.ts`
2. Include token contract address, decimals, and metadata
3. Add token image URL

To add new pools:
1. Update `MOCK_LIQUIDITY_POOLS` in `/src/lib/baseTokens.ts`
2. Include both token references
3. Set TVL, APR, volume, and fee tier

## License

This DeFi Hub is part of the FarcastMints project and follows the same licensing terms.
