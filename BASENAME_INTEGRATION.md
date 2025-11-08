# Basename Integration Guide

## Overview
The Farcaster NFT Marketplace now includes comprehensive Basename support using OnchainKit, providing enhanced user identity resolution on the Base network.

## Features Implemented

### 🔗 **OnchainKit + Basename Integration**
- **Base Chain Priority**: All identity components prioritize Base chain over Ethereum mainnet
- **Automatic Fallback**: Falls back to ENS if no Basename is found
- **Real-time Resolution**: Uses React hooks for efficient data fetching

### 🎨 **Enhanced Components**

#### 1. **OnchainKitDemo Component** (`/src/components/OnchainKitDemo.tsx`)
- Showcases OnchainKit wallet and identity components
- Demonstrates Basename resolution with example address
- Live user identity display when connected
- Interactive wallet dropdown with Base-specific features

#### 2. **Enhanced Wallet Button** (`/src/components/EnhancedWalletButton.tsx`)
- Combines RainbowKit wallet management with OnchainKit identity
- Shows Basename in wallet display when available
- Chain switching and account management
- Hover effects and responsive design

#### 3. **Basename Address Component** (`/src/components/BasenameAddress.tsx`)
- Reusable component for displaying addresses with Basename resolution
- Two variants: `BasenameAddress` (full) and `SimpleBasenameAddress` (compact)
- Automatic truncation and formatting
- TypeScript-safe address handling

#### 4. **Updated NFT Cards** (`/src/components/NFTCard.tsx`)
- Owner addresses now show Basenames when available
- Consistent identity display across grid and list views
- Improved user experience with human-readable names

#### 5. **Enhanced Header** (`/src/components/Header.tsx`)
- Integrated enhanced wallet button with Basename support
- Base chain integration throughout navigation
- Responsive wallet connection states

### 🎯 **Base Chain Configuration**

#### Provider Setup (`/src/app/providers.tsx`)
```tsx
<OnchainKitProvider
  apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
  chain={base}
>
```

#### Theming Integration (`/src/app/globals.css`)
- Custom OnchainKit themes for light and dark modes
- 100+ CSS variables for complete customization
- Seamless integration with existing Tailwind theme

### 📚 **Usage Examples**

#### Basic Basename Display
```tsx
import { Name, Avatar } from '@coinbase/onchainkit/identity'
import { base } from 'viem/chains'

<Avatar address={userAddress} chain={base} />
<Name address={userAddress} chain={base} />
```

#### Using Hooks for Custom Components
```tsx
import { useName, useAvatar } from '@coinbase/onchainkit/identity'

const { data: basename } = useName({ address, chain: base })
const { data: avatar } = useAvatar({ ensName: basename, chain: base })
```

#### Reusable Address Component
```tsx
import { SimpleBasenameAddress } from '@/components/BasenameAddress'

<SimpleBasenameAddress 
  address="0x..." 
  className="text-blue-600" 
/>
```

### 🔧 **Configuration**

#### Environment Variables (Optional)
```env
# OnchainKit API Key for enhanced performance
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your-api-key-here
```

#### Key Dependencies
- `@coinbase/onchainkit`: Core identity and wallet components
- `viem/chains`: Base chain configuration
- `wagmi`: Web3 React hooks integration

### 🎨 **Theming**

#### Custom OnchainKit Theme Variables
The integration includes custom CSS variables that automatically adapt to your app's light/dark mode:

- **Font & Shape**: `--ock-font-family`, `--ock-border-radius`
- **Text Colors**: `--ock-text-primary`, `--ock-text-foreground`
- **Background Colors**: `--ock-bg-default`, `--ock-bg-primary`
- **Icon Colors**: `--ock-icon-color-primary`
- **Border Colors**: `--ock-border-line-default`

#### Auto Theme Switching
```css
.custom-light { /* Light mode variables */ }
.custom-dark { /* Dark mode variables */ }
```

### 🚀 **Benefits**

1. **User Experience**: Human-readable names instead of hex addresses
2. **Base Ecosystem**: Native integration with Base network identity
3. **Performance**: Efficient caching and automatic fallbacks
4. **Accessibility**: Better screen reader support with real names
5. **Branding**: Consistent Base ecosystem experience

### 🔍 **Testing**

1. **Connect Wallet**: Test wallet connection with Base network
2. **Basename Resolution**: Try addresses with known Basenames
3. **Fallback Behavior**: Test addresses without Basenames
4. **Theme Switching**: Verify components adapt to light/dark mode
5. **Responsive Design**: Test on different screen sizes

### 📱 **Example Addresses for Testing**

- `0x02feeb0AdE57b6adEEdE5A4EEea6Cf8c21BeB6B1` - Known Basename: `zizzamia.base.eth`
- Use any Base address to test automatic resolution

### 🎯 **Next Steps**

1. **API Key**: Add OnchainKit API key for production performance
2. **Custom Styling**: Adjust CSS variables for brand alignment
3. **More Components**: Extend Basename support to additional components
4. **Error Handling**: Add custom error states for resolution failures

## Implementation Notes

- All components gracefully handle resolution failures
- Basename resolution is cached for performance
- Components work offline with address fallbacks
- TypeScript support throughout for type safety
- Mobile-responsive design patterns maintained

The integration maintains backward compatibility while providing enhanced Base ecosystem features!