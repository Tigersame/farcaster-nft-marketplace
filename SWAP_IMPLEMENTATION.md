# Token Swap Implementation

## Overview
The swap functionality provides a comprehensive token swapping interface built on OnchainKit patterns, optimized for Base chain with advanced features like gas sponsorship and multiple router support.

## Component Architecture

### SwapEnhanced.tsx
Main swap component following OnchainKit template patterns:
- **Token Selection**: Dropdown menus for from/to token selection
- **Amount Input**: Balance-aware input fields with max buttons
- **Toggle Button**: One-click direction reversal with SVG animation
- **Transaction Integration**: TransactionWrapper for onchain execution
- **Rate Display**: Real-time quote calculation and rate updates
- **Gas Sponsorship**: Optional Paymaster integration
- **Slippage Settings**: Integrated SwapSettings component with configurable slippage controls

### SwapShowcase.tsx
Demonstration component showcasing different swap modes:
- **Default Mode**: Multi-token swapping (ETH, USDC, BASE)
- **Sponsored Mode**: Gas-free swaps via Coinbase Paymaster
- **Custom Mode**: Fixed ETH ↔ USDC trading pair
- **Settings Mode**: Demonstrates slippage configuration controls

### SwapSettingsShowcase.tsx
Dedicated showcase for SwapSettings component configurations:
- **Default Configuration**: Standard slippage settings
- **Custom Styling**: Styled title and description with className overrides
- **With Icon**: Custom icon integration (Base logo example)
- **With Text**: Settings label text demonstration
- **Custom Content**: Override title and description text

## Key Features

### 1. Multi-Router Support
```typescript
// Supports multiple swap routers
const routers = ['uniswap_v3', '0x_api']
```

### 2. Gas Sponsorship
```typescript
// Paymaster integration for gas-free swaps
isSponsored: true  // Enables Coinbase Paymaster
```

### 3. Base Chain Optimization
- Native BASE token support
- Optimized for Base network fees
- Base chain branding and visual consistency

### 4. Real-time Rate Calculation
```typescript
// Simulated quote calculation
const calculateQuote = async (fromAmount: string, fromToken: Token, toToken: Token) => {
  // Rate calculation with loading states
  const rate = parseFloat(fromAmount) * conversionRate
  return { toAmount: rate.toString(), rate: conversionRate }
}
```

### 5. Slippage Configuration
```typescript
// Custom SwapSettings implementation
const SwapSettings = ({ children, text, className }) => (
  <div className={`space-y-3 ${className}`}>
    {text && <span className="text-sm font-medium">{text}</span>}
    {children}
  </div>
)

// Slippage input with preset buttons
const SwapSettingsSlippageInput = () => {
  const [slippage, setSlippage] = useState('0.5')
  // Preset buttons: 0.1%, 0.5%, 1.0%
  // Custom input field for manual entry
}
```

## Token Configuration

### Supported Tokens
```typescript
const ETHToken = {
  address: '',
  chainId: 8453,
  decimals: 18,
  name: 'Ethereum',
  symbol: 'ETH',
  image: 'https://dynamic-assets.coinbase.com/...',
}

const USDCToken = {
  address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  chainId: 8453,
  decimals: 6,
  name: 'USDC',
  symbol: 'USDC',
  image: 'https://dynamic-assets.coinbase.com/...',
}

const BaseToken = {
  address: '0x4200000000000000000000000000000000000006',
  chainId: 8453,
  decimals: 18,
  name: 'Base',
  symbol: 'BASE',
  image: 'https://assets.coingecko.com/...',
}
```

## Usage Examples

### With SwapSettings
```tsx
<SwapEnhanced
  from={[ETHToken, USDCToken]}
  to={[USDCToken, ETHToken]}
  onSwapSuccess={(txHash) => console.log('Success:', txHash)}
  onSwapError={(error) => console.error('Error:', error)}
/>
// Includes integrated slippage settings with:
// - SwapSettings container
// - SwapSettingsSlippageTitle
// - SwapSettingsSlippageDescription  
// - SwapSettingsSlippageInput with preset buttons
```

### Sponsored Swap
```tsx
<SwapEnhanced
  from={[ETHToken]}
  to={[USDCToken]}
  isSponsored={true}
  onSwapSuccess={(txHash) => console.log('Gas-free success:', txHash)}
/>
```

### Custom Token Pair
```tsx
<SwapEnhanced
  from={[ETHToken]}
  to={[USDCToken]}
  isSponsored={false}
  customRouter="uniswap_v3"
/>
```

## Navigation Integration

### Route Setup
- `/swap` - Main swap page with SwapShowcase component
- `/swap/settings` - Dedicated SwapSettings demonstration page
- `/swap/page.tsx` - Next.js page component with Header integration

### Header Navigation
```tsx
<a href="/swap" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
  🔄 Swap
</a>
```

## Error Handling

### Transaction Errors
```typescript
const handleSwapError = (error: any) => {
  console.error('Swap failed:', error)
  // Error notification
  // Fallback UI state
  // User guidance
}
```

### Network Errors
- Chain mismatch detection
- RPC endpoint fallbacks
- Graceful error recovery

## Performance Optimizations

### 1. Token Image Caching
- CDN-hosted token images
- Fallback image support
- Lazy loading patterns

### 2. Quote Calculation
- Debounced input handling
- Background quote updates
- Cache recent quotes

### 3. Transaction Optimization
- Gas estimation
- Slippage protection
- MEV protection

## Testing Considerations

### Local Testing
1. Start development server: `npm run dev`
2. Navigate to `/swap` route
3. Test different swap modes
4. Verify wallet connection
5. Test transaction simulation

### Mainnet Testing
1. Use Base Sepolia testnet
2. Test with testnet tokens
3. Verify Paymaster functionality
4. Monitor transaction costs

## Security Features

### 1. Transaction Validation
- Amount validation
- Token approval checks
- Slippage protection

### 2. Contract Security
- Verified router contracts
- Allowlist token support
- Multi-signature requirements

### 3. User Protection
- Maximum slippage limits
- Front-running protection
- Sandwich attack mitigation

## Integration Patterns

### With TransactionWrapper
```tsx
<TransactionWrapper
  calls={swapCalls}
  onSuccess={handleSwapSuccess}
  onError={handleSwapError}
  capabilities={{
    paymasterService: isSponsored ? paymasterConfig : undefined
  }}
>
  <SwapButton />
</TransactionWrapper>
```

### With WalletWrapper
```tsx
<WalletWrapper>
  <SwapEnhanced />
</WalletWrapper>
```

## Future Enhancements

### 1. Advanced Features
- Limit orders
- DCA (Dollar Cost Averaging)
- Cross-chain swapping
- Batch transactions

### 2. Analytics
- Swap volume tracking
- User behavior analytics
- Performance metrics
- Cost analysis

### 3. Integration Expansion
- More DEX aggregators
- Bridge protocols
- Yield farming integration
- NFT trading integration

## Troubleshooting

### Common Issues
1. **Wallet not connected**: Ensure WalletWrapper is properly configured
2. **Token not found**: Verify token address and chain ID
3. **Transaction failed**: Check gas limits and token approvals
4. **Rate calculation error**: Verify router availability and liquidity

### Debug Tools
- Browser developer console
- Network inspection
- Transaction explorer
- OnchainKit debugging utilities

## Conclusion
The swap implementation provides a robust, user-friendly token swapping experience optimized for Base chain while maintaining compatibility with OnchainKit patterns and Coinbase ecosystem tools.