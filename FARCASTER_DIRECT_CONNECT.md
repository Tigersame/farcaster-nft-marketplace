# Farcaster Direct Connect Integration - Complete Guide

## 🎯 Overview

Your FarcasterSea marketplace now has **direct Farcaster account integration** using the MiniKit SDK. Users can connect their Farcaster identity and access social features seamlessly.

## ✅ What's Implemented

### 1. **MiniKit SDK Integration** (`src/contexts/MiniAppContext.tsx`)
- Automatically detects when app runs in Farcaster
- Extracts user FID, username, displayName, and profile picture
- Provides `useMiniApp()` hook for accessing Farcaster user data

```typescript
const { 
  farcasterUser,        // { fid, username, displayName, pfpUrl }
  isFarcasterConnected, // true when in Farcaster
  viewProfile,          // Navigate to user profile
  composeCast,          // Create cast with content
} = useMiniApp()
```

### 2. **Enhanced Wagmi Configuration** (`src/lib/wagmi.ts`)
- Configured with Coinbase Smart Wallet for Farcaster users
- Optimized for Base network
- Multi-provider support (injected, WalletConnect, Coinbase Wallet)

### 3. **Farcaster Connect Button** (`src/components/FarcasterConnectButton.tsx`)
Two components:
- **FarcasterConnectButton**: Shows when user is in Farcaster (displays profile)
- **FarcasterPromptButton**: Shows in browser (link to open in Farcaster)

### 4. **Farcaster Manifest** (`public/.well-known/farcaster.json`)
- Already configured with domain verification
- Account association signed
- MiniApp metadata defined
- Screenshots and branding included

### 5. **Webhook Handler** (`src/app/api/webhook/route.ts`)
Handles Farcaster events:
- `frame.added` - User adds your app
- `frame.removed` - User removes your app
- `frame.notification` - Push notifications
- `cast.created` - Social engagement tracking

## 🚀 How It Works

### In Farcaster (Warpcast/Base App):
1. User opens FarcasterSea in Farcaster client
2. SDK automatically loads and extracts user identity
3. Purple **Farcaster Connect button** appears with user's profile
4. Click button to view profile or access Farcaster features

### In Regular Browser:
1. Shows **"Open in Farcaster"** button
2. Clicking opens the app in Warpcast
3. User gets full Farcaster integration

## 📦 User Context Available

```typescript
interface FarcasterUser {
  fid: number              // Farcaster ID (unique)
  username?: string        // @username
  displayName?: string     // Display name
  pfpUrl?: string         // Profile picture URL
}
```

### Access in Any Component:

```typescript
import { useMiniApp } from '@/contexts/MiniAppContext'

function MyComponent() {
  const { farcasterUser, isFarcasterConnected } = useMiniApp()
  
  if (isFarcasterConnected) {
    return <div>Welcome @{farcasterUser.username}!</div>
  }
  
  return <div>Open in Farcaster to connect</div>
}
```

## 🔐 Wallet Integration

When user connects wallet in Farcaster:
1. Coinbase Smart Wallet automatically available
2. Base network as default
3. Seamless transactions without manual network switching
4. Gas sponsored for qualifying transactions

## 🎨 UI Components

### Header Integration
```typescript
// Farcaster button automatically shows/hides based on context
<FarcasterConnectButton />  // In Farcaster
<FarcasterPromptButton />   // In browser
```

### Example Usage:
```typescript
// Show user-specific content
{farcasterUser && (
  <div>
    <img src={farcasterUser.pfpUrl} />
    <p>@{farcasterUser.username}</p>
    <p>FID: {farcasterUser.fid}</p>
  </div>
)}
```

## 🔗 Social Features

### Compose Cast
```typescript
const { composeCast } = useMiniApp()

composeCast(
  "Just bought an NFT on FarcasterSea! 🎨", 
  ["https://farcaster-nft-marketplace.vercel.app"]
)
```

### View Profile
```typescript
const { viewProfile } = useMiniApp()

viewProfile(farcasterUser.fid) // Open user's profile
```

### Share NFT
```typescript
const shareNFT = (nftId: string) => {
  const url = `https://farcaster-nft-marketplace.vercel.app/nft/${nftId}`
  composeCast(`Check out this NFT! 🖼️`, [url])
}
```

## 📱 Testing

### Local Testing (Limited):
```bash
npm run dev
# Visit http://localhost:3001
# You'll see "Open in Farcaster" button
```

### Full Testing in Farcaster:
1. Deploy to Vercel
2. Open in Warpcast: `https://warpcast.com/~/add-cast-action?url=YOUR_URL`
3. Full MiniKit features available
4. User identity automatically loaded

### Test in Base App:
1. Open Base app on mobile
2. Navigate to your marketplace URL
3. Full integration with Base features

## 🛠️ Configuration

### Environment Variables (Optional):
```env
# Already configured with defaults
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=e3877a06886f08ffd144013611c152d1
```

### Manifest Configuration:
File: `public/.well-known/farcaster.json`
- Already signed and verified
- Domain: farcaster-nft-marketplace.vercel.app
- FID: 639734
- Webhook: /api/webhook

## 📊 User Flow

1. **User opens app in Farcaster**
   ↓
2. **SDK loads automatically**
   ↓
3. **User context extracted (FID, username, pfp)**
   ↓
4. **Farcaster button appears in header**
   ↓
5. **User can:**
   - View profile
   - Share casts
   - Connect wallet
   - Access social features

## 🎯 Key Benefits

✅ **One-Click Identity**: No separate login needed  
✅ **Social Integration**: Share, cast, engage directly  
✅ **Smart Wallet**: Coinbase wallet pre-configured  
✅ **Base Optimized**: Native Base network support  
✅ **Mobile Ready**: Works in Warpcast & Base apps  
✅ **Progressive**: Gracefully falls back in browser  

## 📖 API Reference

### useMiniApp Hook
```typescript
{
  isSDKLoaded: boolean          // SDK ready
  farcasterUser?: FarcasterUser // User data
  isFarcasterConnected: boolean // In Farcaster?
  context: any                  // Full SDK context
  isReady: boolean             // App ready
  isBaseApp: boolean           // In Base app?
  
  // Actions
  openUrl: (url: string) => void
  composeCast: (text: string, embeds?: string[]) => void
  viewProfile: (fid: number) => void
  signIn: () => Promise<void>
  // ... more actions
}
```

## 🚀 Next Steps

1. **Test in Farcaster**: Deploy and test full integration
2. **Add Social Features**: Use composeCast for NFT sharing
3. **Track Engagement**: Monitor webhook events
4. **Customize UX**: Personalize based on Farcaster user data
5. **Enable Notifications**: Send updates to users

## 📝 Notes

- **Browser Mode**: Shows prompt to open in Farcaster
- **Farcaster Mode**: Full integration with user identity
- **Wallet**: Coinbase Smart Wallet automatically available
- **Network**: Base is default, seamless experience
- **Social**: Cast, share, and engage directly from app

---

**Everything is configured and ready to use!** 🎉

Just deploy to Vercel and open in Farcaster to see the full integration in action.
