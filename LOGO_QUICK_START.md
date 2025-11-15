# 🎯 Quick Logo Setup - 3 Steps

## Step 1: Prepare Your Logo Files

Create 3 logo files:

```
my-logo.svg       (1024x1024px) - Main logo
my-logo-small.svg (100x100px)   - Compact logo  
my-favicon.svg    (32x32px)     - Browser icon
```

**Design Tips:**
- Use transparent background
- SVG format recommended (scales perfectly)
- Should look good on both dark and light backgrounds

---

## Step 2: Replace Files in /public Folder

Copy your logo files to `/public/` and rename:

```bash
# In your project folder
cp my-logo.svg public/icon.svg
cp my-logo-small.svg public/logo.svg
cp my-favicon.svg public/favicon.svg
```

Or manually:
1. Open `/public` folder in your project
2. Replace `icon.svg` with your main logo
3. Replace `logo.svg` with your small logo
4. Replace `favicon.svg` with your favicon

---

## Step 3: Restart Dev Server

```bash
# Clear cache and restart
Remove-Item -Recurse -Force .next
npm run dev
```

---

## ✅ That's It!

Your custom logo now appears in:
- ✅ Header (all pages)
- ✅ Sidebar navigation
- ✅ Event page
- ✅ Browser tab
- ✅ Mobile home screen

---

## 🎨 Optional: Customize Brand Name

Edit `/src/config/branding.ts`:

```typescript
export const BRANDING = {
  name: 'YourBrand',          // ← Change this
  tagline: 'Your Tagline',    // ← Change this
  // ...
}
```

---

## 🔧 Optional: Use External CDN

Instead of replacing files, you can use external URLs:

Edit `/src/config/branding.ts`:

```typescript
export const BRANDING = {
  logo: {
    main: 'https://your-cdn.com/logo.svg',
    small: 'https://your-cdn.com/logo-small.svg',
    favicon: 'https://your-cdn.com/favicon.svg',
  },
  // ...
}
```

---

## 📱 Where Files Go

```
your-project/
│
├── public/               ← PLACE YOUR LOGOS HERE
│   ├── icon.svg         ← Your main logo (1024x1024)
│   ├── logo.svg         ← Your small logo (100x100)
│   └── favicon.svg      ← Your favicon (32x32)
│
└── src/
    └── config/
        └── branding.ts  ← Edit to customize brand name/colors
```

---

## 🚀 Example Logo Setup

**If you have a logo called "my-brand.png":**

1. Convert to SVG (use online tool if needed)
2. Rename to different sizes:
   - `my-brand-1024.svg` → copy as `public/icon.svg`
   - `my-brand-100.svg` → copy as `public/logo.svg`
   - `my-brand-32.svg` → copy as `public/favicon.svg`
3. Restart: `npm run dev`
4. Visit http://localhost:3000
5. See your logo! 🎉

---

**Need more customization?** See `CUSTOM_LOGO_SETUP.md` for advanced options.
