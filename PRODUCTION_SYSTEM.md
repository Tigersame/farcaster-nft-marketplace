# Production System Implementation Guide

Complete implementation of production-ready features for the Farcaster NFT Marketplace.

## ✅ Completed Features

### 1. Design Token System
**Location**: `src/styles/theme.js`

Centralized design tokens for consistent styling:
- **Colors**: Primary (#6D28D9), Accent (#06B6D4), backgrounds, neutrals
- **Spacing**: xs(4px), sm(8px), md(16px), lg(24px)
- **Border Radius**: sm(8px), md(14px), lg(20px)
- **Shadows**: subtle, pop effects
- **Fonts**: Inter system stack

**Usage in Tailwind**:
```tsx
<div className="bg-primary text-neutral100 rounded-md shadow-subtle" />
```

**Integration**: `tailwind.config.ts` imports and extends with design tokens.

---

### 2. Responsive Breakpoints
**Location**: `tailwind.config.ts`

Custom breakpoints optimized for NFT marketplace:
- **sm**: 640px (mobile)
- **md**: 900px (tablet - custom)
- **lg**: 1200px (desktop - custom)
- **xl**: 1600px (large desktop - custom)

**Usage**:
```tsx
<div className="px-4 md:px-6 lg:px-8 xl:px-12">
  <h1 className="text-xl md:text-2xl lg:text-3xl">NFT Title</h1>
</div>
```

---

### 3. Polished Components

#### RefinedHeader.tsx
**Location**: `src/components/RefinedHeader.tsx`

Production-ready header with:
- Sticky positioning with backdrop blur
- Gradient logo (primary → accent)
- Search input with icon
- Responsive layout (text hidden on mobile)
- Touch-friendly buttons (44px minimum)
- Dark mode support

**Usage**:
```tsx
<RefinedHeader 
  onToggleView={() => setView('grid')}
  onSearch={(query) => filterNFTs(query)}
/>
```

#### RefinedNftCard.tsx
**Location**: `src/components/RefinedNftCard.tsx`

NFT card with optimistic UI:
- Next/Image with lazy loading
- Responsive srcset for performance
- Collection and chain badges
- Pending state overlay
- Owner and mint date metadata
- Shadow transitions on hover
- Motion-reduce support
- Touch-friendly (44px buttons)
- Full ARIA accessibility

**Usage**:
```tsx
<RefinedNftCard
  nft={{
    id: '1',
    image: '/nft.jpg',
    title: 'Cool NFT #1',
    collection: 'Farcaster Genesis',
    price: '2.5 ETH'
  }}
  onBuy={(nft) => buyNFT(nft)}
  pending={isPurchasing}
/>
```

---

### 4. Image Optimization
**Location**: `next.config.js`

Configured for performance:
- **Domains**: Cloudinary, IPFS gateways (Cloudflare, Pinata, NFT.storage)
- **Formats**: AVIF, WebP for modern browsers
- **Responsive sizes**: 640px → 3840px device sizes
- **Cache TTL**: 30 days for static assets

**Features**:
- Automatic format conversion
- Lazy loading by default
- Responsive srcset generation
- CDN-ready configuration

---

### 5. Metadata Proxy API
**Location**: `src/app/api/metadata/[cid]/route.ts`

Caches IPFS metadata for reliability:
- **IPFS Gateway Fallbacks**: Cloudflare, IPFS.io, Pinata, NFT.storage
- **In-memory caching**: 7-day TTL (use Redis in production)
- **Metadata normalization**: Handles different NFT standards
- **Cache invalidation**: DELETE endpoint for updates

**Endpoints**:
```bash
# Fetch metadata
GET /api/metadata/QmXxxx...

# Invalidate cache
DELETE /api/metadata/QmXxxx...
```

**Response**:
```json
{
  "name": "NFT Title",
  "description": "...",
  "image": "ipfs://...",
  "attributes": [],
  "cached": true
}
```

**IPFS Gateway Fallback**: Tries 4 gateways with 5s timeout each.

---

### 6. Wallet UX Components
**Location**: `src/components/EnhancedWallet.tsx`

Network detection and switching:
- **EnhancedWallet**: Connect button with network warning
- **useNetworkCheck**: Hook for network validation
- **RequireNetwork**: Wrapper that blocks until correct network

**Features**:
- Auto-detect wrong network
- One-click switch to Base
- Network indicator badge
- Responsive mobile/desktop views
- Touch-friendly buttons

**Usage**:
```tsx
// In header
<EnhancedWallet 
  showBalance={true}
  showNetwork={true}
  compactOnMobile={true}
/>

// Require network for features
<RequireNetwork>
  <NFTMarketplace />
</RequireNetwork>
```

---

### 7. Analytics & Tracking
**Location**: `src/lib/analytics.ts`

Multi-platform analytics:
- **Segment** integration
- **Google Analytics 4** events
- **Custom endpoint** support
- **Development logging**

**Predefined Events**:
```typescript
import { trackNFTView, trackBuyClick, trackTxSubmitted } from '@/lib/analytics'

// Track NFT view
trackNFTView('1', 'Farcaster Genesis', 'marketplace')

// Track buy click
trackBuyClick('1', '2.5 ETH', 'Farcaster Genesis')

// Track transaction
trackTxSubmitted('0x123...', '1', 'buy')
```

**Custom Events**:
```typescript
import { track, AnalyticsEvents } from '@/lib/analytics'

track(AnalyticsEvents.SEARCH, { query: 'farcaster', resultsCount: 42 })
```

---

### 8. Optimistic UI System
**Location**: `src/lib/optimistic-ui.ts`

Transaction state management:
- **useOptimisticUI**: Hook for managing pending states
- **optimisticBuy**: Helper for buy flow
- **Action states**: pending, confirming, confirmed, failed

**Usage**:
```tsx
import { useOptimisticUI, optimisticBuy, generateActionId } from '@/lib/optimistic-ui'

function NFTCard({ nft }) {
  const { startAction, confirmAction, failAction, isPending } = useOptimisticUI()
  
  const handleBuy = async () => {
    await optimisticBuy(
      nft.tokenId,
      () => contractWrite({ args: [nft.tokenId] }),
      (id) => startAction(id, 'buy', nft.tokenId),
      (id, txHash) => confirmAction(id, txHash),
      (id) => failAction(id)
    )
  }
  
  return (
    <RefinedNftCard
      nft={nft}
      onBuy={handleBuy}
      pending={isPending(nft.tokenId)}
    />
  )
}
```

---

### 9. CI/CD Pipeline
**Location**: `.github/workflows/ci.yml`

Automated testing and deployment:
- **Lint**: ESLint checks
- **Type check**: TypeScript validation
- **Build**: Next.js production build
- **E2E tests**: Playwright integration
- **Deploy**: Vercel preview + production

**Workflow**:
1. **PR**: Lint → Test → Build → E2E → Deploy Preview
2. **Main push**: Full pipeline → Deploy Production

**Required Secrets** (GitHub Settings):
```bash
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
WALLET_CONNECT_PROJECT_ID
BASE_RPC_URL
```

---

## 🚧 Implementation Checklist

### Immediate Setup (Required)

- [x] Design tokens created
- [x] Tailwind configured
- [x] Polished components (header, card)
- [x] Image optimization configured
- [x] Metadata proxy API created
- [x] Wallet UX components
- [x] Analytics utilities
- [x] Optimistic UI system
- [x] CI/CD workflow

### Production Deployment (Before Launch)

- [ ] **Redis**: Replace in-memory cache with Redis for metadata proxy
- [ ] **Environment Variables**: Set all secrets in Vercel
- [ ] **Analytics Keys**: Add Segment/GA4 tracking IDs
- [ ] **Sentry**: Initialize error tracking
- [ ] **Testing**: Write unit tests (Jest) and E2E tests (Playwright)
- [ ] **Performance**: Run Lighthouse audits (target 90+ scores)
- [ ] **Security**: Enable rate limiting on API routes
- [ ] **Monitoring**: Set up Vercel Analytics

### Optional Enhancements

- [ ] **Image CDN**: Switch to Cloudinary for advanced transformations
- [ ] **Metadata Proxy**: Deploy as separate service (Docker container)
- [ ] **Wallet Analytics**: Track connection/disconnection events
- [ ] **A/B Testing**: Experiment with card layouts
- [ ] **PWA**: Add service worker for offline support

---

## 📝 Usage Examples

### Complete NFT Buy Flow with Optimistic UI

```tsx
import { useState } from 'react'
import { RefinedNftCard } from '@/components/RefinedNftCard'
import { useOptimisticUI, optimisticBuy } from '@/lib/optimistic-ui'
import { trackBuyClick, trackTxSubmitted, trackTxConfirmed } from '@/lib/analytics'
import { useContractWrite } from 'wagmi'

function NFTMarketplace() {
  const { startAction, confirmAction, failAction, isPending } = useOptimisticUI()
  const { writeAsync: buyNFT } = useContractWrite({
    address: '0x...',
    abi: marketplaceABI,
    functionName: 'buyNFT'
  })
  
  const handleBuy = async (nft: NFT) => {
    // Track buy click
    trackBuyClick(nft.id, nft.price, nft.collection)
    
    try {
      await optimisticBuy(
        nft.id,
        () => buyNFT({ args: [nft.id] }),
        (id) => startAction(id, 'buy', nft.id),
        (id, txHash) => {
          confirmAction(id, txHash)
          trackTxSubmitted(txHash, nft.id, 'buy')
          trackTxConfirmed(txHash, nft.id, 1)
        },
        (id) => failAction(id)
      )
    } catch (error) {
      console.error('Buy failed:', error)
    }
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {nfts.map(nft => (
        <RefinedNftCard
          key={nft.id}
          nft={nft}
          onBuy={handleBuy}
          pending={isPending(nft.id)}
        />
      ))}
    </div>
  )
}
```

### Network-Gated Feature

```tsx
import { RequireNetwork } from '@/components/EnhancedWallet'

function MintNFTPage() {
  return (
    <RequireNetwork>
      <div className="p-6 md:p-8 lg:p-12">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
          Mint NFT
        </h1>
        {/* Minting interface - only shown on Base network */}
      </div>
    </RequireNetwork>
  )
}
```

### Cached Metadata Fetching

```tsx
async function fetchNFTMetadata(tokenURI: string) {
  // Extract CID from IPFS URI
  const cid = tokenURI.replace('ipfs://', '')
  
  // Fetch through proxy (with caching)
  const response = await fetch(`/api/metadata/${cid}`)
  const metadata = await response.json()
  
  return {
    ...metadata,
    // Image URL optimization
    image: metadata.image.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/')
  }
}
```

---

## 🔧 Configuration Files

### Environment Variables (.env.local)

```bash
# Wallet Connect
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

# RPC URLs
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# Analytics
NEXT_PUBLIC_SEGMENT_WRITE_KEY=your_segment_key
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# Sentry (optional)
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_AUTH_TOKEN=your_auth_token

# Redis (for production metadata proxy)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Custom analytics endpoint (optional)
NEXT_PUBLIC_ANALYTICS_ENDPOINT=https://your-api.com/events
```

### Vercel Environment Variables

Set these in Vercel dashboard under Settings → Environment Variables:
1. `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`
2. `NEXT_PUBLIC_BASE_RPC_URL`
3. `NEXT_PUBLIC_SEGMENT_WRITE_KEY`
4. `NEXT_PUBLIC_GA4_MEASUREMENT_ID`
5. `NEXT_PUBLIC_SENTRY_DSN`

---

## 🚀 Deployment Checklist

### Pre-Deployment

1. **Test build locally**: `npm run build`
2. **Run type checks**: `npx tsc --noEmit`
3. **Test all features**: Wallet connect, NFT views, buying flow
4. **Check mobile responsiveness**: Use Chrome DevTools
5. **Lighthouse audit**: Aim for 90+ on all metrics

### Vercel Setup

1. Import GitHub repository
2. Set environment variables
3. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `.next`
   - Install command: `npm ci`
4. Enable Vercel Analytics (recommended)
5. Set up custom domain (optional)

### Post-Deployment

1. **Test preview deployment**: Check all features work
2. **Monitor errors**: Check Vercel logs
3. **Verify analytics**: Confirm events are tracked
4. **Performance check**: Run Lighthouse on live site
5. **Social sharing**: Test Farcaster frames

---

## 📊 Performance Targets

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices, SEO)

---

## 🛠️ Development Workflow

```bash
# Start dev server
npm run dev

# Type check
npm run type-check

# Build for production
npm run build

# Start production server
npm start

# Run tests (when configured)
npm test

# E2E tests (when configured)
npx playwright test
```

---

## 📚 Additional Resources

- [Next.js Image Optimization](https://nextjs.org/docs/app/api-reference/components/image)
- [Tailwind Custom Configuration](https://tailwindcss.com/docs/configuration)
- [RainbowKit Documentation](https://www.rainbowkit.com/docs/introduction)
- [Vercel Deployment](https://vercel.com/docs/deployments/overview)
- [GitHub Actions](https://docs.github.com/en/actions)
