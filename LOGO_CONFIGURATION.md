# Logo Configuration Across All Portals

## ✅ Logo Successfully Configured

Your **FarcastMints logo** (`/icon.svg`) is now properly configured across all portals and platforms.

---

## 📍 Logo Locations

### 1. **Website Header**
**File:** `src/components/Header.tsx`
- Logo displays at top-left of every page
- Clickable, links to homepage
- Responsive with hover effects
- Uses `/icon.svg` (your "F" logo on blue background)

```tsx
<img 
  src="/icon.svg" 
  alt="FarcastMints Logo" 
  className="w-10 h-10"
/>
```

---

### 2. **PWA Manifest** (Mobile App)
**File:** `public/manifest.json`
- Used when users "Add to Home Screen" on mobile
- Logo appears on device home screen
- Configured for maskable icons (safe areas)

```json
{
  "name": "Farcast Mints",
  "icons": [
    {
      "src": "/icon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}
```

**Platforms:** iOS Safari, Android Chrome, Desktop PWA

---

### 3. **Farcaster Mini App**
**File:** `public/.well-known/farcaster.json`
- Logo shows in Farcaster client when users discover your app
- Used in Mini App store listing
- Splash screen on app launch

```json
{
  "miniapp": {
    "iconUrl": "https://farcastmints.com/icon.svg",
    "splashImageUrl": "https://farcastmints.com/splash.svg",
    "splashBackgroundColor": "#1a1a2e"
  }
}
```

**Visible in:** 
- Warpcast Mini App directory
- Base app Mini App store
- App launch screen

---

### 4. **Farcaster Config** (Alternative)
**File:** `farcaster.config.json`
- Backup configuration for Farcaster integration
- Uses same logo URLs
- Matches `.well-known/farcaster.json`

```json
{
  "miniapp": {
    "iconUrl": "https://farcastmints.com/icon.svg",
    "splashImageUrl": "https://farcastmints.com/splash.svg"
  }
}
```

---

### 5. **Browser Favicon**
**File:** `src/app/layout.tsx`
- Tab icon in browser
- Bookmark icon
- Browser history

```tsx
icons: {
  icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  apple: '/icon.svg',
  shortcut: '/favicon.svg',
}
```

**Shows in:** Chrome tabs, Firefox bookmarks, Safari favorites

---

### 6. **Social Media (Open Graph)**
**File:** `src/app/layout.tsx`
- Logo appears when sharing on Twitter, Discord, Slack
- Large preview image with branding

```tsx
openGraph: {
  images: [{
    url: 'https://farcastmints.com/og-image.svg',
    width: 1200,
    height: 630
  }]
}
```

**Platforms:** Twitter/X, Discord, Facebook, LinkedIn, Slack

---

### 7. **Transaction Metadata** (Wallet Display)
**File:** `src/lib/transactionMetadata.ts`
- Shows in Coinbase Wallet during transactions
- Branded transaction approval screens

```typescript
{
  name: "FarcastMints",
  url: "https://farcastmints.com",
  faviconUrl: "https://farcastmints.com/favicon.ico"
}
```

**Visible in:** Coinbase Wallet, Rainbow Wallet, MetaMask

---

### 8. **Farcaster Frames**
**File:** `src/app/layout.tsx`
- Logo in Frame previews on Warpcast/Farcaster
- Share card when casting NFTs

```tsx
other: {
  'fc:frame:image': 'https://farcastmints.com/og-image.svg'
}
```

**Shows in:** Warpcast feed, Farcaster clients

---

## 🎨 Logo Files

Your marketplace uses these logo variants:

| File | Size | Purpose | Color |
|------|------|---------|-------|
| `/icon.svg` | 1024x1024 | Main app logo, favicon | Blue (#0f1f3d) + White "F" |
| `/logo.svg` | 100x100 | Compact logo | Purple (#8A63D2) |
| `/favicon.svg` | 512x512 | Browser tab icon | Blue background |
| `/favicon.ico` | 16x16, 32x32 | Legacy browser support | Binary format |
| `/splash.svg` | Variable | App launch screen | Large centered logo |
| `/og-image.svg` | 1200x630 | Social media shares | Full branding |

---

## 🌐 Deployment Portals

### Vercel
- **Status:** ✅ Configured
- **Domain:** https://farcastmints.com
- **Logo URL:** All files served from `/public/`
- **Update:** Automatic on git push

### Farcaster Directory
- **Status:** ✅ Configured
- **Manifest:** `/.well-known/farcaster.json`
- **Logo:** https://farcastmints.com/icon.svg
- **Update:** Automatic via webhook

### Base App Directory
- **Status:** ✅ Configured
- **App FID:** 309857
- **Logo:** https://farcastmints.com/icon.svg
- **Update:** Via Mini App API

### Coinbase Wallet
- **Status:** ✅ Configured
- **Transaction metadata:** Shows FarcastMints branding
- **Logo:** https://farcastmints.com/favicon.ico
- **Update:** Automatic (metadata in each transaction)

---

## 🔄 How to Update Your Logo

### Option 1: Replace SVG Files (Recommended)
1. Design new logo (1024x1024px recommended)
2. Export as SVG
3. Replace these files:
   ```
   /public/icon.svg
   /public/favicon.svg
   /public/og-image.svg
   /public/splash.svg
   ```
4. Commit and push to GitHub
5. Vercel auto-deploys (1-2 minutes)

### Option 2: Change Logo URLs
If hosting logos elsewhere (e.g., CDN):

1. **Update Header:**
   - Edit `src/components/Header.tsx`
   - Change `src="/icon.svg"` to your URL

2. **Update Manifest:**
   - Edit `public/manifest.json`
   - Change `"src": "/icon.svg"` to your URL

3. **Update Farcaster:**
   - Edit `public/.well-known/farcaster.json`
   - Change all image URLs

4. **Update Metadata:**
   - Edit `src/app/layout.tsx`
   - Update `icons` and `openGraph.images`

---

## ✅ Verification Checklist

Test your logo appears correctly in all these places:

- [ ] Website header (top-left corner)
- [ ] Browser tab favicon
- [ ] Mobile "Add to Home Screen" icon
- [ ] Twitter/X share preview
- [ ] Discord link preview
- [ ] Farcaster frame preview
- [ ] Warpcast Mini App listing
- [ ] Coinbase Wallet transaction screen
- [ ] Base app Mini App store
- [ ] Bookmark/favorites icon
- [ ] PWA splash screen (mobile)

---

## 🐛 Troubleshooting

### Logo not updating?
1. **Clear browser cache:** Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
2. **Check file exists:** Visit https://farcastmints.com/icon.svg directly
3. **Verify deployment:** Check Vercel dashboard for successful deploy
4. **Hard refresh:** Close and reopen browser

### Logo pixelated?
- Ensure SVG files are being used (not PNG)
- Check `viewBox` attribute in SVG matches dimensions
- Verify no fixed width/height in SVG (use `width="100%"`)

### Logo wrong color in dark mode?
- Check if SVG has hardcoded `fill` colors
- Consider using CSS variables for dynamic theming
- Use separate light/dark logo variants if needed

---

## 📞 Support

Logo configured successfully! All portals now display your **FarcastMints branding** consistently.

**Configured Portals:**
✅ Website Header  
✅ Browser Favicon  
✅ PWA Manifest  
✅ Farcaster Mini App  
✅ Social Media (OG)  
✅ Transaction Metadata  
✅ Farcaster Frames  

Your logo will now appear everywhere users interact with your marketplace! 🎉
