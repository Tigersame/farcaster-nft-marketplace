# 🔒 UI LOCKED - DO NOT MODIFY

**Date Locked:** November 10, 2025  
**Status:** ✅ PRODUCTION READY - UI FROZEN

---

## 🎨 Current UI Configuration

### **Layout Structure**
- **Vertical Sidebar**: Fixed left sidebar (80px width)
- **Main Content**: Left margin offset for sidebar
- **Theme**: Pure dark theme (bg-gray-900)
- **Header**: Full-width with wallet integration
- **Footer**: Standard footer with copyright

### **Vertical Sidebar - 16 Navigation Options**
All icons are interactive and functional:

1. 🔲 **All NFTs** - Grid view of all NFTs
2. 🔄 **Swap** - Token swap interface
3. ⚡ **Mint** - NFT minting page
4. 🛒 **Buy** - Browse NFTs to purchase
5. 💵 **Sell** - List NFTs for sale
6. 📈 **Trending** - Hot trending NFTs
7. 🛍️ **Collections** - Browse collections
8. ➕ **Create** - Create new NFT form
9. 📦 **Portfolio** - User portfolio with stats
10. 📊 **Activity** - Activity feed
11. ❤️ **Favorites** - Favorite NFTs
12. 🔍 **Search** - Search interface
13. ⭐ **Featured** - Featured NFTs
14. 📊 **Analytics** - Market analytics
15. 🕐 **Recent** - Recent activity timeline
16. 👤 **Profile** - User profile with Basename integration

### **Color Scheme**
```css
Background: bg-gray-900 (main), bg-gray-950 (sidebar)
Text: text-white (primary), text-gray-400 (secondary)
Accent: bg-blue-600 (active state)
Borders: border-gray-700, border-gray-800
Cards: bg-gray-800
Hover: hover:bg-gray-700, hover:bg-gray-800
Shadow: shadow-blue-500/50 (active state glow)
```

### **NFT Collection Data**
8 Custom NFTs with unique names and prices:
- Cosmic Explorer #001 (3.2 ETH)
- Digital Dreamer #042 (2.8 ETH)
- Neon Nights #099 (1.9 ETH)
- Abstract Vision #156 (2.5 ETH)
- Ethereal Dreams #203 (4.1 ETH)
- Quantum Flux #377 (1.6 ETH)
- Crystal Cascade #445 (2.2 ETH)
- Midnight Mirage #512 (3.5 ETH)

### **Profile Page Integration**
✅ **Basename Integration Complete**
- Avatar display from OnchainKit
- Basename (.base.eth) resolution
- Full wallet address with copy function
- Real-time balance display
- Network info (Base chain)
- Connection status indicator
- External links (BaseScan, OpenSea)
- Portfolio stats cards
- NFT grid display

### **Hero Banner**
- Gradient background: `from-gray-800 to-gray-900`
- Collection info with emoji avatar 🎨
- Title: "My NFT Collection"
- Description: "Your unique digital art collection on Base chain"
- Live stats: items, volume, floor price, owners

### **Responsive Grid**
- Mobile: 1 column
- Tablet: 2 columns
- Laptop: 3 columns
- Desktop: 4 columns

### **Animations**
- Framer Motion animations on all views
- Scale effect on sidebar icons (1.1x on hover)
- Fade-in transitions for content
- Staggered NFT card animations

---

## 🔧 Technical Stack

### **Dependencies**
```json
{
  "@coinbase/onchainkit": "0.28.7",
  "wagmi": "^2.x",
  "viem": "^2.x",
  "@rainbow-me/rainbowkit": "^2.x",
  "framer-motion": "^11.x",
  "react-icons": "^5.x"
}
```

### **Key Files**
- `src/app/marketplace.tsx` - Main marketplace component
- `src/components/Header.tsx` - Header with wallet
- `src/components/Footer.tsx` - Footer component
- `src/components/NFTCard.tsx` - NFT display cards
- `src/lib/wagmi.ts` - Wallet configuration
- `src/app/providers.tsx` - Provider setup

### **Hooks Used**
- `useAccount` - Wallet account data
- `useBalance` - ETH balance on Base
- `useState` - View state management
- `useEffect` - NFT data loading

### **OnchainKit Components**
- `Name` - Basename display
- `Avatar` - User avatar
- `Address` - Wallet address display
- `Identity` - Full identity component

---

## 🚫 DO NOT CHANGE

### **Protected Elements**
1. ✅ Sidebar icon order and styling
2. ✅ Dark theme color scheme
3. ✅ NFT collection data (8 items)
4. ✅ Grid responsive breakpoints
5. ✅ Profile page layout
6. ✅ Basename integration
7. ✅ Hero banner design
8. ✅ Navigation structure
9. ✅ Animation timings
10. ✅ Component hierarchy

### **Layout Dimensions**
```
Sidebar: 80px width, fixed left
Content padding: px-4 sm:px-6 lg:px-8
Content max-width: max-w-7xl (profile: max-w-5xl)
Hero padding: py-12
Grid gap: gap-6
Icon size: w-6 h-6
Button padding: p-3 (sidebar)
```

### **Border Styles**
```
Sidebar: border-r border-gray-800
Cards: border border-gray-700
Active: shadow-lg shadow-blue-500/50
Hover: hover:bg-gray-800
```

---

## ✅ Build Configuration

### **Last Successful Build**
- **Date**: November 10, 2025
- **Status**: ✅ SUCCESS
- **Bundle Size**: 90.1 kB shared JS
- **Routes**: 27 total
- **Build Time**: ~30-40 seconds

### **Production Server**
```bash
npm run build  # Build for production
npm start      # Start production server on :3000
```

### **Development Server**
```bash
npm run dev    # Start dev server on :3000 (or :3001)
```

---

## 📝 Maintenance Notes

### **Safe to Modify**
- ✅ NFT data content (names, prices, descriptions)
- ✅ Collection stats (items count, volume)
- ✅ Text content and copy
- ✅ External links URLs

### **DO NOT MODIFY**
- ❌ Sidebar structure
- ❌ Color scheme
- ❌ Layout dimensions
- ❌ Component hierarchy
- ❌ Animation setup
- ❌ Basename integration
- ❌ Provider configuration

---

## 🔐 Lock Status

**This UI configuration is LOCKED and approved for production.**

Any changes to the core UI structure, layout, or design system must be approved and documented here.

---

**Last Updated:** November 10, 2025  
**Locked By:** User Approval  
**Version:** 1.0.0 - Production
