# Base Chain Swap Miniapp

A Uniswap-like swap and liquidity management miniapp built for Base chain, designed as a Farcaster miniapp.

## Features

### 🔄 Swap Interface
- Token-to-token swapping with real-time quotes
- Price impact calculation
- Slippage tolerance settings
- Token selector with favorites
- Balance display and MAX button
- Exchange rate display

### 💧 Liquidity Management
- Add liquidity to pools (token pairs)
- Remove liquidity from pools
- LP token management
- Pool share calculation
- Automatic ratio calculation

### 📋 Token List Manager
- Browse Base chain tokens
- Search by name, symbol, or address
- Favorite tokens
- Sort by name, symbol, or balance
- View token details and balances
- Link to BaseScan explorer

## Base Chain Integration

### Token List
The app includes popular Base chain tokens:
- **ETH** - Native Ethereum
- **WETH** - Wrapped Ether (0x4200000000000000000000000000000000000006)
- **USDC** - USD Coin (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)
- **DAI** - Dai Stablecoin (0x50c5725949A6F0c72E6C4a641F24049A917E0eB6)
- **USDT** - Tether USD (0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2)
- **cbETH** - Coinbase Wrapped Staked ETH (0x2Ae3F1Ec7F1F5012CFEab0185bfC7aa3cf0DEc22)
- **AERO** - Aerodrome Finance (0x940181a94A35A4569E4529A3CDfB74e38FD98631)
- **VELO** - Velodrome Finance (0x9560e827aF36c94D2Ac33a39bCE1Fe78631088Db)

### Uniswap V3 Integration
- Router: `0x2626664c2603336E57B271c5C0b26F421741e481`
- Factory: `0x33128a8fC17869897dcE68Ed026d694621f6FDfD`

Reference: [Uniswap V3 Base Deployments](https://docs.uniswap.org/contracts/v3/reference/deployments)

## Usage

### Access the Miniapp
Navigate to `/swap-miniapp` in your application.

### Swap Tokens
1. Select "Swap" tab
2. Choose token to sell (From)
3. Choose token to buy (To)
4. Enter amount or click MAX
5. Review exchange rate and price impact
6. Click "Swap" and confirm transaction

### Add Liquidity
1. Select "Liquidity" tab
2. Choose "Add" mode
3. Select token pair (Token 0 and Token 1)
4. Enter amounts (ratio calculated automatically)
5. Review pool share
6. Click "Add Liquidity" and confirm

### Remove Liquidity
1. Select "Liquidity" tab
2. Choose "Remove" mode
3. Enter LP token amount to remove
4. Review tokens you'll receive
5. Click "Remove Liquidity" and confirm

### Manage Token List
1. Select "Tokens" tab
2. Search tokens by name, symbol, or address
3. Toggle favorites filter
4. Sort by name, symbol, or balance
5. Click star to favorite/unfavorite
6. Click external link icon to view on BaseScan

## Components

### Core Components
- `SwapInterface` - Main swap UI with token selection and amount input
- `LiquidityInterface` - Add/remove liquidity interface
- `TokenListManager` - Token browsing and management
- `TokenSelector` - Modal for selecting tokens

### Utilities
- `baseTokens.ts` - Token definitions and helper functions
- Base chain configuration via Wagmi

## Configuration

### Environment Variables
```env
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_ALCHEMY_API_KEY=your_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### Slippage Settings
Default slippage tolerance: 0.5%
- Can be adjusted in settings (0.1%, 0.5%, 1.0%, or custom)
- Higher slippage = more tolerance for price changes
- Lower slippage = stricter price requirements

## Base Chain Documentation

- [Base Official Docs](https://docs.base.org)
- [Base Contracts](https://docs.base.org/tools/contracts)
- [Base Explorer](https://basescan.org)
- [Uniswap V3 on Base](https://docs.uniswap.org/contracts/v3/reference/deployments)

## Implementation Notes

### Current Status
- ✅ UI/UX complete
- ✅ Token list with Base chain tokens
- ✅ Swap interface with mock quotes
- ✅ Liquidity add/remove interface
- ✅ Token list management
- ⚠️ Mock swap execution (needs Uniswap V3 integration)
- ⚠️ Mock liquidity calculations (needs pool data)

### Next Steps for Production
1. Integrate Uniswap V3 Quoter contract for real quotes
2. Integrate Uniswap V3 Router for swap execution
3. Integrate Uniswap V3 Pool contracts for liquidity
4. Add real-time price feeds
5. Implement transaction history
6. Add pool analytics and charts
7. Gas optimization and batch transactions

## Security Considerations

- Always verify token addresses before swapping
- Check price impact before large swaps
- Review slippage tolerance settings
- Verify contract interactions on BaseScan
- Use reputable token lists

## Mobile Optimization

The miniapp is optimized for mobile devices and Farcaster miniapp environment:
- Responsive design
- Touch-friendly interfaces
- Mobile-first layout
- Safe area insets support

## License

Part of the FarcastMints project.
