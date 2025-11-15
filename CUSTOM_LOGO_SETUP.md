# 🎨 Custom Logo Setup Guide

Your marketplace now uses **centralized branding configuration** for consistent logo and brand identity across all portals.

## ✅ What Was Implemented

### 1. Centralized Branding Config
Created `/src/config/branding.ts` - single source of truth for all branding elements.

### 2. Updated Components
All components now use centralized branding:
- ✅ **Header.tsx** - Main navigation logo
- ✅ **ProSidebar.tsx** - Sidebar logo and brand name
- ✅ **Event Page** - Event portal logo
- ✅ **Footer.tsx** - Copyright and credits

### 3. Dynamic Logo Display
Logos automatically adapt based on configuration with toggles for:
- Show/hide icon
- Show/hide brand text
- Custom icon sizes
- Fallback icon initials

## 📍 How to Set Your Own Logo

### Option 1: Replace Logo Files (Recommended)
Simply replace these files in `/public` folder:

```bash
public/
├── icon.svg      # Main logo (1024x1024 recommended)
├── logo.svg      # Small logo (100x100)
└── favicon.svg   # Browser favicon
```

**That's it!** Your logo will automatically appear everywhere.

### Option 2: Use External CDN URL
Edit `/src/config/branding.ts`:

```typescript
export const BRANDING = {
  logo: {
    main: 'https://your-cdn.com/logo.svg',
    small: 'https://your-cdn.com/logo-small.svg',
    favicon: 'https://your-cdn.com/favicon.svg',
  },
}
```

### Option 3: Customize Everything
Edit `/src/config/branding.ts` to customize:

```typescript
export const BRANDING = {
  // Brand Identity
  name: 'YourBrand',              // Change marketplace name
  tagline: 'Your Tagline',        // Change tagline
  
  // Logo Files
  logo: {
    main: '/your-logo.svg',
    small: '/your-logo-small.svg',
    favicon: '/your-favicon.svg',
  },
  
  // Display Settings
  display: {
    showIcon: true,               // Toggle logo icon
    showText: true,               // Toggle brand name text
    iconSize: 40,                 // Default icon size
    iconInitial: 'Y',             // Fallback letter
  },
  
  // Brand Colors
  colors: {
    primary: '#YOUR_COLOR',
    accent: '#YOUR_COLOR',
    bg1: '#YOUR_COLOR',
    bg2: '#YOUR_COLOR',
    text: '#YOUR_COLOR',
    muted: '#YOUR_COLOR',
  },
  
  // Social Links
  links: {
    website: 'https://yourbrand.com',
    base: 'https://www.base.org',
    tamber: 'https://tamberfoundation.org',
    github: 'https://github.com/yourname',
  },
  
  // Footer Credits
  footer: {
    copyright: '© 2025 YourBrand',
    builtOn: 'Base',
    poweredBy: 'Your Foundation',
    author: 'yourname',
  },
}
```

## 📱 Where Your Logo Appears

### 1. **Main Header** (`Header.tsx`)
- Top-left of every page
- Hoverable with scale animation
- Links to homepage

### 2. **Sidebar Navigation** (`ProSidebar.tsx`)
- Desktop navigation sidebar
- Collapses to icon-only mode
- Shows logo + brand name + tagline

### 3. **Event Page** (`/event`)
- Genesis SBT claim page
- XP earning interface
- Themed with your brand colors

### 4. **Footer** (`Footer.tsx`)
- Copyright notice with your brand name
- Customizable links and credits

### 5. **Browser Tab**
- Favicon in browser tab
- Bookmark icon
- App icon on mobile devices

### 6. **PWA/Mobile**
- Home screen icon (via manifest.json)
- Splash screen (splash.svg)
- App launch screen

## 🎨 Logo Best Practices

### Recommended Formats
- **SVG** - Scalable, sharp at any size (preferred)
- **PNG** - Use for complex graphics with transparency
- **WebP** - Modern format, best compression

### Recommended Sizes
| File | Size | Usage |
|------|------|-------|
| `icon.svg` | 1024x1024 | Main logo, PWA icon |
| `logo.svg` | 100x100 | Compact logo, sidebar |
| `favicon.svg` | 32x32 | Browser tab icon |

### Design Tips
- ✅ Use transparent background
- ✅ Include padding (safe area)
- ✅ Test in light & dark mode
- ✅ Keep it simple for small sizes
- ✅ Use vector format (SVG) when possible

### Dark Mode Consideration
Your logo should work on both light and dark backgrounds. Options:
1. **Adaptive SVG** - Use `currentColor` in SVG
2. **Separate variants** - light-logo.svg, dark-logo.svg
3. **Safe colors** - White/light logo on dark BG, dark logo on light BG

## 🔧 Helper Functions

The branding config includes utility functions:

```typescript
import { BRANDING, getLogoUrl, getBrandColor } from '@/config/branding'

// Get logo URL
const mainLogo = getLogoUrl('main')      // '/icon.svg'
const smallLogo = getLogoUrl('small')    // '/logo.svg'
const favicon = getLogoUrl('favicon')    // '/favicon.svg'

// Get brand color
const primary = getBrandColor('primary')  // '#6E4BFF'
const accent = getBrandColor('accent')    // '#FF6BA6'

// Access branding values
const brandName = BRANDING.name           // 'FarcastMints'
const tagline = BRANDING.tagline          // 'NFT Marketplace'
```

## 🚀 Quick Start Examples

### Example 1: Upload Your Logo
1. Prepare your logo as `my-logo.svg` (1024x1024)
2. Copy to `/public/icon.svg`
3. Refresh your app
4. Done! Logo appears everywhere

### Example 2: Use Different Logo Per Portal
Edit component imports:
```typescript
// In Header.tsx - use main logo
<img src={getLogoUrl('main')} />

// In ProSidebar.tsx - use small logo
<img src={getLogoUrl('small')} />
```

### Example 3: Hide Brand Text, Show Only Icon
Edit `/src/config/branding.ts`:
```typescript
display: {
  showIcon: true,
  showText: false,  // Hide "FarcastMints" text
}
```

## 🔄 Testing Checklist

After updating your logo, verify it appears correctly:

- [ ] Main header (top-left on all pages)
- [ ] Sidebar navigation (desktop)
- [ ] Mobile navigation menu
- [ ] Event page header
- [ ] Browser tab favicon
- [ ] PWA home screen icon
- [ ] Dark mode (logo visible on dark background)
- [ ] Light mode (logo visible on light background)
- [ ] Hover animations work
- [ ] Logo scales properly on different screen sizes

## 🐛 Troubleshooting

### Logo not updating?
```bash
# Clear Next.js cache
Remove-Item -Recurse -Force .next
npm run dev
```

### Logo pixelated?
- Use SVG format instead of raster images
- Ensure PNG is at least 1024x1024px
- Check image optimization in next.config.js

### Logo wrong size?
Edit icon size in branding config:
```typescript
display: {
  iconSize: 50,  // Change from default 40
}
```

### Logo not visible in dark mode?
- Use logo with transparent background
- Ensure logo colors have good contrast
- Consider separate light/dark variants

## 📚 File Structure

```
src/
├── config/
│   └── branding.ts           ← Main branding configuration
├── components/
│   ├── Header.tsx            ← Uses BRANDING config
│   ├── ProSidebar.tsx        ← Uses BRANDING config
│   └── Footer.tsx            ← Uses BRANDING config
└── app/
    └── event/
        └── page.tsx          ← Uses BRANDING config

public/
├── icon.svg                  ← Your main logo
├── logo.svg                  ← Your small logo
└── favicon.svg               ← Your favicon
```

## 🎉 What's Next?

Your logo is now configured! Consider customizing:

1. **Brand Colors** - Update color scheme in branding.ts
2. **Typography** - Change BRAND_FONT to your preferred font
3. **Animations** - Customize hover effects in components
4. **OG Images** - Update social media share images in /public

---

**Need help?** Check the code comments in `/src/config/branding.ts` for detailed explanations.

**Made changes?** Run `npm run build` to verify everything compiles correctly.

🚀 Your marketplace now has consistent branding across all portals!
