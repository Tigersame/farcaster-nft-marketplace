# Farcaster NFT Marketplace - AI Coding Guidelines

## Project Overview
A **Farcaster-native NFT marketplace** on **Base network** with interactive frames, XMTP chat, and social engagement. Built with **Next.js 14 (App Router) + TypeScript + TailwindCSS**.

Key difference from typical marketplaces: **Farcaster Frames** enable NFT transactions directly in social feeds without leaving the Farcaster client.

## Architecture Components

### Provider Stack (Critical - Order Matters!)
`app/page.tsx` wraps components in this specific order:
```tsx
<ThemeProvider>              // Dark mode persistence (localStorage + system)
  <NotificationProvider>      // Toast notifications + celebration effects
    <WagmiProvider>           // Web3 hooks (defined in providers.tsx)
      <QueryClientProvider>   // React Query for async state
        <RainbowKitProvider>  // Wallet connection UI
```

**Why it matters**: Theme must be outermost for dark mode on wallet modals. Notifications need access to theme context.

### Farcaster Frames API Routes
All frame endpoints return **HTML with Open Graph meta tags** (not JSON):
- `GET /api/frames` - Discovery page listing all NFT frames
- `GET /api/frames/nft/[tokenId]` - Interactive NFT frame with 4 buttons
- `POST /api/frames/nft/[tokenId]` - Handle frame button interactions
- `GET /api/frames/image/[tokenId]` - Dynamic frame images

**Frame pattern** (see `src/app/api/frames/nft/[tokenId]/route.ts`):
```typescript
// Always return HTML with fc:frame meta tags
return new NextResponse(html, { 
  headers: { 'Content-Type': 'text/html' } 
})
```

Frame buttons map to actions: `buttonIndex` 1=Buy, 2=Like, 3=View, 4=Share.

## Development Workflows

### Local Development
```bash
npm install              # Install dependencies
npm run dev              # Start dev server on http://localhost:3000
npm run build            # Production build (test before deploying)
npm run type-check       # TypeScript validation (no emit)
```

### Testing Frames Locally
1. Start `npm run dev`
2. Visit `http://localhost:3000/api/frames/nft/1` to see frame HTML
3. Use [Farcaster Frame Validator](https://warpcast.com/~/developers/frames) to test
4. Frame images at `/api/frames/image/[tokenId]?action=view`

### Debugging Dark Mode Issues
- Check `ThemeContext` is wrapping component tree
- Verify `dark:` Tailwind classes on elements
- Test localStorage persistence: `localStorage.getItem('farcaster-marketplace-theme')`
- CSS transitions defined in `globals.css` (0.3s ease)

## Critical Patterns & Conventions

### Mock Data Pattern (No Backend Yet)
All NFT data is **hardcoded** in components. Pattern used everywhere:
```typescript
// In marketplace.tsx, frames/route.ts, etc.
const mockNFTs: Record<string, NFT> = {
  '1': { tokenId: '1', name: 'Farcaster Genesis #001', ethPrice: '2.5', ... },
  '2': { tokenId: '2', name: 'Base Builder Badge', ethPrice: '1.0', ... },
}
```
**When adding features**: Keep mock data consistent across files.

### TypeScript Interface Convention
No central `types/` folder. Interfaces defined where used:
- NFT types scattered across `marketplace.tsx`, frame routes, components
- `ActivityItem` in `SocialProof.tsx`
- `ChatMessage` in `XMTPChat.tsx`

**When refactoring**: Check `grep_search` for duplicate interfaces before creating shared types.

### Dark Mode Implementation
Every UI component uses Tailwind `dark:` classes:
```tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
```
**Standard dark colors**:
- Backgrounds: `dark:bg-gray-900`, `dark:bg-gray-800`, `dark:bg-slate-900`
- Text: `dark:text-white`, `dark:text-gray-300`, `dark:text-gray-400`
- Borders: `dark:border-gray-700`

Global transitions in `globals.css` handle smooth theme switching.

### XMTP Chat & Base Quick Actions
`XMTPChat.tsx` implements Base App's conversational UX:
- Uses `QuickActions` component for action buttons
- Content types: `ActionsContent` (coinbase.com/actions:1.0) and `IntentContent` (coinbase.com/intent:1.0)
- Agent-like responses use lowercase, emoji, friendly tone
- Pattern: User message → Agent typing indicator → Quick action buttons

**Quick Actions structure** (see `createNFTQuickActions` in `QuickActions.tsx`):
```typescript
{
  id: string,              // Unique action set ID
  description: string,     // Agent message
  actions: [               // Button array
    { id: string, label: string, style: 'primary'|'secondary'|'danger' }
  ]
}
```

### Animation Patterns
All animations use **Framer Motion** (not CSS animations):
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
```
**Standard transitions**: 0.3s for theme, 0.2s for hovers, 0.5s for page transitions.

### Social Proof System
`SocialProof.tsx` generates **fake real-time activity**:
- Uses `setInterval` to add new activities every 5-10 seconds
- Emoji avatars (🎨, 👩‍🎨, 💎) for users
- Pattern: Generate random combinations from predefined arrays

**When extending**: Keep activity generation logic centralized in `generateActivity()`.

## Key Files Reference

### Essential for Understanding Flow
- `src/app/page.tsx` - Entry point, provider setup
- `src/app/marketplace.tsx` - Main marketplace logic (551 lines, read 1-150 for state setup)
- `src/app/providers.tsx` - Web3 provider configuration
- `src/lib/wagmi.ts` - Chain configs (Base, Base Sepolia, Mainnet)

### Farcaster Integration
- `src/lib/farcaster.ts` - Frame metadata utilities (`generateFrameMetadata`, `createNFTFrame`)
- `src/app/api/frames/nft/[tokenId]/route.ts` - Frame implementation pattern

### UI Components with Complex Logic
- `src/components/SocialProof.tsx` - Activity feed generation (398 lines)
- `src/components/XMTPChat.tsx` - Chat + Quick Actions (359 lines)
- `src/components/NotificationSystem.tsx` - Toast + celebration animations
- `src/contexts/ThemeContext.tsx` - Dark mode state + localStorage persistence

## Common Pitfalls

1. **Frame routes must return HTML**, not JSON - use `NextResponse(html, {headers: {'Content-Type': 'text/html'}})`
2. **Dark mode requires both context AND Tailwind classes** - missing either breaks theming
3. **Mock data is duplicated** across marketplace, frame routes, components - keep in sync when editing
4. **No TypeScript type checking on frame button handling** - `buttonIndex` is just a number, manually map to actions
5. **RainbowKit theme hardcoded** in `providers.tsx` - doesn't auto-switch with dark mode (intentional purple theme)

## Environment Variables (Optional)
All features work without env vars using defaults:
```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=farcaster-nft-demo  # Falls back to demo ID
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org         # Default in wagmi.ts
```

## Documentation References
- `README.md` - Setup, features, deployment
- `IMPLEMENTATION_SUMMARY.md` - Complete feature list
- `DARK_MODE_IMPLEMENTATION.md` - Dark mode specifics
- `ACTIVITY_FEED_FIX.md` - Social proof implementation notes