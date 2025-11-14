# 🚀 Mint Portal Implementation - Complete Guide

## Overview
A modern, futuristic NFT minting portal with glassmorphism design, 3D hover effects, and smooth animations. Built with Next.js 14, Framer Motion, and integrated with wagmi for on-chain minting on Base network.

---

## 🎨 Design Features

### Visual Style
- **Theme**: Dark mode default with glassmorphism effects
- **Color Palette**:
  - Background: `#0a0a0a` → `#141414` gradient
  - Accent gradient: `#7A5AF8` (purple) → `#00D2FF` (cyan)
  - Text: `#FFFFFF` (white) and `#B0B0B0` (muted gray)
  - Buttons: Gradient with neon glow shadows
- **Effects**:
  - Glassmorphism: `backdrop-blur-xl` with `from-white/5 to-white/[0.02]` gradients
  - 3D hover: Cards lift and rotate slightly on hover
  - Animated borders: Gradient borders on hover
  - Smooth transitions: All animations use Framer Motion

### Layout Structure
```
┌─────────────────────────────────────────────────┐
│ Header: Logo + Nav + Connect Wallet             │
├─────────────────────────────────────────────────┤
│ Main Content (2/3 width)    │ Sidebar (1/3)     │
│ ┌──────────────────────┐    │ ┌──────────────┐ │
│ │ Hero: Mint Your NFT  │    │ │ Stats Card   │ │
│ │ ┌────────┬─────────┐ │    │ └──────────────┘ │
│ │ │Preview │ Form    │ │    │ ┌──────────────┐ │
│ │ │(3D img)│-Name    │ │    │ │ Activity Feed│ │
│ │ │        │-Desc    │ │    │ └──────────────┘ │
│ │ │        │-Price   │ │    │ ┌──────────────┐ │
│ │ │        │-Upload  │ │    │ │ Quick Help   │ │
│ │ │        │-Props   │ │    │ └──────────────┘ │
│ │ │        │[MINT]   │ │    │                   │
│ │ └────────┴─────────┘ │    │                   │
│ │ Gallery Grid (6 NFTs)│    │                   │
│ └──────────────────────┘    │                   │
└─────────────────────────────────────────────────┘
│ Footer: Built with ❤️                            │
└─────────────────────────────────────────────────┘
```

---

## 🧱 Component Structure

### File Location
- **Component**: `src/components/MintPortal.tsx`
- **Route**: `src/app/mint/page.tsx`
- **Navigation**: Already integrated in `Header.tsx`

### Key Sections

#### 1. Header
```tsx
- Logo: "FM" badge with gradient background
- Navigation: Explore, Collections, My NFTs
- Connect Wallet: Gradient button with glow effect
```

#### 2. Mint Form (Left Panel)
```tsx
Fields:
- Name* (required)
- Description (textarea)
- Price (ETH, step 0.001)
- Supply (number)
- Upload Image* (file input with custom button)
- Properties (dynamic trait_type/value pairs)

Fee Breakdown:
- Listing Price
- Platform Fee (2.5%)
- Gas Fee (est. $0.50)
- You'll receive (calculated)

Status:
- Minted count: 122 / 500
- Mint button with loading spinner
- Success/error messages
```

#### 3. NFT Preview (Left Panel)
```tsx
- 3D hoverable card (rotateY on hover)
- Shows uploaded image OR gradient SVG placeholder
- Glowing border effect on hover
- File name display below preview
```

#### 4. Gallery Preview (Below Form)
```tsx
- 6 sample NFT cards in responsive grid
- Each card:
  - Gradient SVG image
  - Token name (Genesis #001)
  - Creator address (0x...)
  - Price in ETH
  - View button
- 3D hover animation (lift + scale)
```

#### 5. Sidebar (Right)

**Collection Stats Card**:
- Total Supply: 500
- Floor Price: 0.05 Ξ
- Owners: 78
- Volume: 12.4 Ξ

**Recent Activity Feed**:
- Real-time activity list
- Minted, transferred, listed events
- Timestamps (2m ago, 5m ago)
- Emoji icons (✓, ↗, 🏷️)

**Quick Help Card**:
- Guide link
- Gradient purple/cyan background
- Call to action button

---

## ⚙️ Technical Implementation

### State Management
```typescript
const [name, setName] = useState('')
const [description, setDescription] = useState('')
const [price, setPrice] = useState('0.05')
const [supply, setSupply] = useState('1')
const [properties, setProperties] = useState<Property[]>([])
const [filePreview, setFilePreview] = useState<string | null>(null)
const [fileName, setFileName] = useState('')
```

### Blockchain Integration

**Hooks Used**:
- `useMintNFT()` from `@/lib/contracts/useMarketplace`
- `useGetPlatformFee()` for fee calculation

**Mint Function**:
```typescript
async function handleMint() {
  // Validation
  if (!name || !filePreview) {
    alert('Please fill in name and upload an image')
    return
  }

  // Create metadata (in production: upload to IPFS)
  const metadata = {
    name,
    description,
    image: filePreview,
    attributes: properties.filter(p => p.trait_type && p.value)
  }
  const metadataURI = `ipfs://QmExample${Date.now()}`

  // Mint with 5% royalty (500 basis points)
  mintNFT(metadataURI, 500)
}
```

**Dual-Mode Operation**:
- **Demo Mode**: When contract = `0x5FbDB...` (Hardhat local)
  - Shows success message after 2 seconds
  - No blockchain interaction
  - Increments mock minted count
- **Live Mode**: When contract deployed to Base
  - Real MetaMask transaction
  - Gas fees apply
  - On-chain NFT creation

### File Upload
```typescript
function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0]
  if (!file) return
  
  setFileName(file.name)
  const reader = new FileReader()
  reader.onload = () => setFilePreview(reader.result as string)
  reader.readAsDataURL(file)
}
```

### Properties Management
```typescript
interface Property {
  trait_type: string
  value: string
}

// Add new property row
function addProperty() {
  setProperties([...properties, { trait_type: '', value: '' }])
}

// Update existing property
function updateProperty(index: number, field: 'trait_type' | 'value', value: string) {
  const updated = [...properties]
  updated[index][field] = value
  setProperties(updated)
}

// Remove property
function removeProperty(index: number) {
  setProperties(properties.filter((_, i) => i !== index))
}
```

---

## 🎨 Animations & Effects

### Framer Motion Usage

**Page Load**:
```tsx
<motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
```

**Button Interactions**:
```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
```

**3D Card Hover**:
```tsx
<motion.div 
  whileHover={{ y: -8, scale: 1.05 }}
  className="group"
>
```

**Loading Spinner**:
```tsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
/>
```

### CSS Effects

**Glassmorphism**:
```css
bg-gradient-to-br from-white/5 to-white/[0.02]
backdrop-blur-xl
border border-white/10
```

**Glowing Shadows**:
```css
shadow-2xl shadow-purple-500/30
hover:shadow-purple-500/50
```

**Gradient Text**:
```css
bg-gradient-to-r from-white via-purple-200 to-cyan-200
bg-clip-text text-transparent
```

---

## 📱 Responsive Design

### Breakpoints
- **Mobile** (< 640px): Single column, stacked layout
- **Tablet** (640px - 1024px): 2-column grid
- **Desktop** (> 1024px): 3-column layout (2 main + 1 sidebar)

### Mobile Optimizations
```tsx
// Navigation hidden on mobile
<nav className="hidden md:flex">

// Grid adjusts columns
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">

// Gallery responsive
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
```

### Mobile-Specific Features
- Touch-friendly buttons (min 44px height)
- Larger tap targets for file upload
- Simplified navigation (hamburger menu ready)
- Sticky header with backdrop blur
- Bottom-aligned mint button on mobile

---

## 🖼️ SVG Components

### Sample NFT Preview (Placeholder)
```tsx
function SampleNFTPreview() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 200">
      <defs>
        <linearGradient id="preview-gradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#7A5AF8" />
          <stop offset="100%" stopColor="#00D2FF" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" rx="18" fill="url(#preview-gradient)" />
      <g transform="translate(18,18)">
        <circle cx="70" cy="60" r="34" fill="rgba(255,255,255,0.12)" />
        <rect x="12" y="120" width="120" height="24" rx="8" fill="rgba(0,0,0,0.18)" />
      </g>
      <text x="20" y="190" fontSize="14" fill="rgba(255,255,255,0.95)">
        FarcastMint Preview
      </text>
    </svg>
  )
}
```

### Gallery NFT Cards (Dynamic Colors)
```tsx
function SampleGalleryNFT({ index }: { index: number }) {
  const colors = ['#7A5AF8', '#00D2FF', '#FF6B6B', '#FFD166', '#4ADE80', '#C084FC']
  const color = colors[index % colors.length]
  
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 200">
      <defs>
        <linearGradient id={`gallery-gradient-${index}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      <rect width="200" height="200" rx="14" fill={`url(#gallery-gradient-${index})`} />
      {/* ... shapes ... */}
      <text x="14" y="180" fontSize="12" fill="rgba(255,255,255,0.9)">
        Token #{index}
      </text>
    </svg>
  )
}
```

---

## 🔧 Customization Guide

### Change Color Scheme
```typescript
// Update gradient colors
from-[#7A5AF8] to-[#00D2FF]  // Purple to Cyan (default)

// Alternative schemes:
from-[#FF6B6B] to-[#FFD166]  // Red to Yellow (warm)
from-[#4ADE80] to-[#06B6D4]  // Green to Teal (fresh)
from-[#F59E0B] to-[#EF4444]  // Orange to Red (bold)
```

### Adjust Platform Fee
```typescript
// Currently uses hook from useMarketplace.ts
const { platformFee } = useGetPlatformFee()  // Returns 2.5

// To override locally:
const platformFee = 5.0  // 5% fee
```

### Change Default Royalty
```typescript
// Current: 5% royalty (500 basis points)
mintNFT(metadataURI, 500)

// Change to 10%:
mintNFT(metadataURI, 1000)

// Change to 2.5%:
mintNFT(metadataURI, 250)
```

### Modify Gallery Size
```typescript
// Current: 6 sample NFTs
const sampleGallery = Array.from({length: 6}, ...)

// Change to 8:
const sampleGallery = Array.from({length: 8}, ...)

// Update grid:
grid-cols-6  →  grid-cols-8
```

---

## 🚀 Usage Instructions

### For Users

**1. Navigate to Mint Portal**:
- Click "Mint" in header navigation
- Or visit `/mint` directly

**2. Fill in NFT Details**:
- Enter name (required)
- Add description (optional)
- Set price in ETH
- Set supply (default 1)

**3. Upload Image**:
- Click "Choose file" button
- Select PNG, JPG, or GIF
- Preview appears in left panel

**4. Add Properties** (optional):
- Click "+ Add" button
- Enter trait type (e.g. "Background")
- Enter value (e.g. "Blue")
- Add multiple properties
- Remove with × button

**5. Review Fees**:
- Check fee breakdown
- Platform fee: 2.5%
- Gas fee estimate: ~$0.50
- See amount you'll receive

**6. Mint NFT**:
- Click "Mint NFT 🔥" button
- Confirm MetaMask transaction (live mode)
- Wait for confirmation
- Success message appears
- Form resets automatically

### For Developers

**1. Test Locally**:
```bash
npm run dev -- -p 3001
# Visit http://localhost:3001/mint
```

**2. Enable Live Mode**:
```bash
# Deploy contract to Base
npx hardhat run scripts/deploy.ts --network base

# Update .env.local
NEXT_PUBLIC_MARKETPLACE_CONTRACT=0xYourDeployedAddress
```

**3. Customize Design**:
- Edit `MintPortal.tsx`
- Update color gradients
- Modify layout structure
- Add new fields

**4. IPFS Integration** (Production):
```typescript
// Replace mock metadata URI
import { create } from 'ipfs-http-client'

const client = create({ url: 'https://ipfs.infura.io:5001/api/v0' })

async function uploadToIPFS(file: File) {
  const added = await client.add(file)
  return `ipfs://${added.path}`
}

// In handleMint:
const imageURI = await uploadToIPFS(filePreview)
const metadataURI = await uploadToIPFS(JSON.stringify(metadata))
mintNFT(metadataURI, 500)
```

---

## 🎯 Features Checklist

✅ **Design**:
- [x] Futuristic glassmorphism UI
- [x] Dark mode default
- [x] Gradient color scheme (purple → cyan)
- [x] 3D hover effects on cards
- [x] Smooth Framer Motion animations
- [x] Glowing button shadows

✅ **Functionality**:
- [x] NFT name and description input
- [x] Price and supply configuration
- [x] Image upload with preview
- [x] Dynamic properties (traits)
- [x] Platform fee calculation
- [x] On-chain minting via wagmi
- [x] Dual-mode (demo/live)
- [x] Success/error messages

✅ **Layout**:
- [x] Header with logo and navigation
- [x] Hero mint section (2/3 width)
- [x] Sidebar stats and activity (1/3 width)
- [x] Gallery preview grid
- [x] Responsive mobile design
- [x] Sticky header with blur

✅ **Integration**:
- [x] wagmi hooks (useMintNFT)
- [x] Platform fee hook
- [x] Framer Motion animations
- [x] React Icons
- [x] Next.js 14 App Router
- [x] TypeScript types

✅ **Polish**:
- [x] Loading states
- [x] Form validation
- [x] Auto-reset on success
- [x] Minted count tracking
- [x] Transaction hash display
- [x] File name display

---

## 🐛 Troubleshooting

### Image preview not showing
**Problem**: Preview stays as placeholder after upload
**Solution**: Check browser console for FileReader errors, ensure file is valid image format

### Mint button disabled
**Problem**: Button won't enable
**Solution**: Ensure both name AND image are filled. Check console for validation errors.

### Transaction fails
**Problem**: MetaMask rejects or transaction reverts
**Solution**:
- Check wallet has enough ETH for gas
- Verify contract address is correct
- Ensure contract is deployed to Base network
- Check network in MetaMask matches Base (chain ID 8453)

### Properties not saving
**Problem**: Traits don't appear in metadata
**Solution**: Ensure both trait_type AND value are filled. Empty properties are filtered out.

### Styling broken
**Problem**: Glassmorphism or gradients not showing
**Solution**:
- Verify Tailwind CSS is configured
- Check `tailwind.config.ts` includes backdrop-blur utilities
- Ensure dark mode is enabled

---

## 📊 Performance Optimization

### Image Optimization
```typescript
// Compress images before upload (recommended)
import imageCompression from 'browser-image-compression'

async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0]
  if (!file) return
  
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true
  }
  
  const compressedFile = await imageCompression(file, options)
  // ... continue with compressed file
}
```

### Lazy Loading Gallery
```tsx
// Use React.lazy for gallery images
import { Suspense, lazy } from 'react'

const GalleryGrid = lazy(() => import('./GalleryGrid'))

<Suspense fallback={<LoadingSpinner />}>
  <GalleryGrid items={sampleGallery} />
</Suspense>
```

### Debounce Fee Calculation
```typescript
import { useDebouncedValue } from '@/hooks/useDebounce'

const debouncedPrice = useDebouncedValue(price, 300)
const platformFeeAmount = parseFloat(debouncedPrice) * (platformFee / 100)
```

---

## 🎓 Learning Resources

- **Framer Motion Docs**: https://www.framer.com/motion/
- **wagmi Documentation**: https://wagmi.sh
- **Base Network**: https://base.org
- **IPFS**: https://docs.ipfs.tech
- **Tailwind CSS**: https://tailwindcss.com
- **Next.js 14**: https://nextjs.org/docs

---

## 📝 Future Enhancements

### Planned Features
- [ ] **Batch Minting**: Mint multiple NFTs at once
- [ ] **Collections**: Create and manage collections
- [ ] **IPFS Direct Upload**: Real Pinata/NFT.Storage integration
- [ ] **AI Generation**: Integrate AI image generation
- [ ] **Rarity Calculator**: Auto-calculate trait rarity
- [ ] **Preview Modes**: Light/Dark theme preview
- [ ] **Social Share**: Share minted NFT to Farcaster/X
- [ ] **Mint History**: Track user's minted NFTs
- [ ] **Templates**: Pre-made NFT templates
- [ ] **Video/Audio**: Support for video/audio NFTs

### Advanced Ideas
- **Generative Art**: On-the-fly art generation
- **Collaborative Minting**: Multi-sig minting
- **Lazy Minting**: Gasless minting until first sale
- **Staking Integration**: Stake to mint discounts
- **Allowlist**: Whitelist-based minting
- **Dutch Auction**: Dynamic pricing

---

## 📄 License & Credits

**Built with**:
- Next.js 14
- Framer Motion
- wagmi + viem
- RainbowKit
- OnchainKit
- Tailwind CSS
- React Icons

**Designed for**: Farcaster NFT Marketplace
**Network**: Base (Ethereum L2)
**Author**: FarcastMint Team

---

*Last Updated: November 2025*
