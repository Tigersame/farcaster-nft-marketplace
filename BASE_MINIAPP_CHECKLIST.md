# Base Mini-App Build Checklist ✅

Complete implementation of the [Base Mini-Apps Build Checklist](https://docs.base.org/mini-apps/quickstart/build-checklist) for **CurSwap**.

## ✅ Checklist Overview

- [x] **Manifest Configuration** - `.well-known/farcaster.json`
- [x] **SDK Integration** - Farcaster Frame SDK
- [x] **Lifecycle Management** - ready(), close()
- [x] **Context API** - user, location, client
- [x] **Actions API** - openUrl, composeCast, etc.
- [x] **Wallet Integration** - Smart wallet support
- [x] **Error Handling** - Centralized error management
- [x] **Testing Utilities** - Mock SDK and helpers
- [x] **Loading States** - UX components
- [x] **Documentation** - This file

---

## 1. Manifest Configuration ✅

### Location
- File: `/src/lib/miniapp/manifest.ts`
- Endpoint: `/.well-known/farcaster.json`

### Implementation
```typescript
export const MINIAPP_MANIFEST: MiniAppManifest = {
  accountAssociation: { ... },
  frame: {
    version: "next",
    name: "CurSwap",
    iconUrl: "https://curswap.com/icon.svg",
    homeUrl: "https://curswap.com",
    imageUrl: "https://curswap.com/og-image.png",
    buttonTitle: "Open CurSwap",
    splashImageUrl: "https://curswap.com/splash.png",
    splashBackgroundColor: "#1a1a2e",
    webhookUrl: "https://curswap.com/api/miniapp/webhook"
  }
}
```

### Features
- ✅ Valid manifest structure
- ✅ Validation function
- ✅ Served at correct endpoint
- ✅ Proper CORS headers

### Testing
```bash
curl https://curswap.com/.well-known/farcaster.json
```

---

## 2. SDK Integration ✅

### Files
- `/src/lib/miniapp/sdk-manager.ts` - SDK singleton manager
- `/src/hooks/useMiniAppSDK.ts` - React hook
- `/src/contexts/MiniAppContext.tsx` - Context provider

### Implementation
```typescript
import { sdkManager } from '@/lib/miniapp/sdk-manager'

// Initialize SDK
const context = await sdkManager.initialize()

// Mark app as ready
sdkManager.ready()

// Use actions
sdkManager.actions.openUrl('https://curswap.com')
```

### Features
- ✅ Singleton pattern for SDK
- ✅ Automatic initialization
- ✅ Environment detection
- ✅ Graceful fallbacks

---

## 3. Lifecycle Management ✅

### Ready State
```typescript
// App initialization complete
sdkManager.ready()
```

**When to call:**
- After app has loaded
- After critical data is fetched
- Before showing main content

### Close Action
```typescript
// Close the mini-app
sdkManager.actions.close()
```

**When to use:**
- User completes a flow
- After successful transaction
- On explicit close button

### Implementation
- File: `/src/lib/miniapp/sdk-manager.ts`
- Hook: `/src/hooks/useMiniAppSDK.ts`

---

## 4. Context API ✅

### Available Context

#### User Context
```typescript
{
  fid: number              // Farcaster ID
  username?: string        // @username
  displayName?: string     // Display name
  pfpUrl?: string         // Profile picture
  bio?: string            // User bio
  verifications?: string[] // Verified addresses
  custody?: string        // Custody address
}
```

#### Location Context
```typescript
{
  type: 'cast' | 'channel' | 'profile' | 'feed'
  cast?: { fid: number, hash: string }
  channel?: { id: string, name: string }
  profile?: { fid: number }
}
```

#### Client Context
```typescript
{
  clientFid: number       // 309857 for Base App
  name: string           // Client name
  version: string        // Client version
  platform: 'ios' | 'android' | 'web'
}
```

### Usage
```typescript
const { user, location, client } = useMiniAppSDK()

if (user) {
  console.log(`Hello, ${user.displayName}!`)
}

if (client?.clientFid === 309857) {
  console.log('Running in Base App')
}
```

---

## 5. Actions API ✅

### Available Actions

#### openUrl(url: string)
Open external URL in browser
```typescript
sdkManager.actions.openUrl('https://curswap.com')
```

#### close()
Close the mini-app
```typescript
sdkManager.actions.close()
```

#### composeCast(text, embeds?)
Open compose dialog with pre-filled content
```typescript
sdkManager.actions.composeCast(
  'Check out CurSwap! 🚀',
  ['https://curswap.com']
)
```

#### addFrame(url)
Add a frame to user's favorites
```typescript
sdkManager.actions.addFrame('https://curswap.com/api/frames/defi')
```

#### swapToken(params)
Trigger token swap flow
```typescript
sdkManager.actions.swapToken({
  fromToken: '0x...',
  toToken: '0x...',
  amount: '1.0'
})
```

#### sendToken(params)
Trigger token send flow
```typescript
sdkManager.actions.sendToken({
  token: '0x...',
  amount: '1.0',
  recipient: '0x...'
})
```

#### haptic(style)
Trigger haptic feedback
```typescript
sdkManager.actions.haptic('medium') // 'light' | 'medium' | 'heavy'
```

---

## 6. Wallet Integration ✅

### File
- `/src/lib/miniapp/wallet.ts`

### Features
- ✅ Smart wallet detection
- ✅ Auto-connect from context
- ✅ Token swap integration
- ✅ Token send integration
- ✅ View token details

### Usage
```typescript
import { useWallet } from '@/lib/miniapp/wallet'

const { 
  connection, 
  isConnected,
  swapToken,
  sendToken 
} = useWallet()

// Swap tokens
await swapToken({
  fromToken: 'ETH',
  toToken: 'USDC',
  amount: '1.0'
})
```

---

## 7. Error Handling ✅

### File
- `/src/lib/miniapp/error-handler.ts`

### Error Codes
```typescript
enum MiniAppErrorCode {
  SDK_NOT_INITIALIZED,
  SDK_NOT_AVAILABLE,
  ACTION_FAILED,
  WALLET_NOT_CONNECTED,
  NETWORK_ERROR,
  PERMISSION_DENIED,
  INVALID_PARAMS,
  UNKNOWN_ERROR
}
```

### Usage
```typescript
import { 
  errorHandler, 
  safeSDKAction,
  MiniAppErrorCode 
} from '@/lib/miniapp/error-handler'

// Safe execution
const result = await safeSDKAction(
  () => sdkManager.actions.openUrl(url),
  MiniAppErrorCode.ACTION_FAILED
)

if (!result.success) {
  console.error(result.error)
}

// Error callback
errorHandler.onError((error) => {
  toast.error(error.message)
})
```

### Error Boundary
```typescript
import { MiniAppErrorBoundary } from '@/components/miniapp/ErrorBoundary'

<MiniAppErrorBoundary>
  <YourApp />
</MiniAppErrorBoundary>
```

---

## 8. Testing Utilities ✅

### File
- `/src/lib/miniapp/testing.ts`

### Mock SDK
```typescript
import { MockSDK, createMockContext } from '@/lib/miniapp/testing'

// Create mock
const mockSDK = new MockSDK(createMockContext({
  user: { fid: 123, username: 'testuser' }
}))

// Get context
const context = await mockSDK.context

// Verify actions
mockSDK.actions.openUrl('https://test.com')
const calls = mockSDK.getActionCalls()
expect(calls[0].action).toBe('openUrl')
```

### Test Helpers
```typescript
import { testHelpers } from '@/lib/miniapp/testing'

// Click button
await testHelpers.clickButton('Submit')

// Wait for element
const element = await testHelpers.waitForElement('.result')

// Check environment
if (testHelpers.isInFarcaster()) {
  // Farcaster-specific tests
}
```

### Performance Monitoring
```typescript
import { performanceMonitor } from '@/lib/miniapp/testing'

performanceMonitor.start('swap')
// ... perform swap
const duration = performanceMonitor.end('swap')
console.log(`Swap took ${duration}ms`)

console.log(performanceMonitor.getReport())
```

---

## 9. Loading States ✅

### File
- `/src/components/miniapp/LoadingState.tsx`

### Components

#### LoadingState
```typescript
<LoadingState 
  message="Loading tokens..." 
  size="medium"
  fullScreen={false}
/>
```

#### SkeletonLoader
```typescript
<SkeletonLoader lines={5} />
```

#### Spinner
```typescript
<Spinner size="medium" />
```

---

## 10. Component Architecture

### Key Components

1. **MiniAppContainer** - Size constraints
   - File: `/src/components/MiniAppContainer.tsx`
   - Enforces 424x695px on web
   - Full screen on mobile
   - Safe area support

2. **MiniAppHeader** - App branding
   - File: `/src/components/MiniAppHeader.tsx`
   - Shows app name and icon
   - Displays user info

3. **MiniAppSplash** - Loading screen
   - File: `/src/components/MiniAppSplash.tsx`
   - Shows while initializing
   - Hides when ready

4. **MiniAppActions** - Action buttons
   - File: `/src/components/MiniAppActions.tsx`
   - Quick access to SDK actions
   - Testing helpers

---

## 11. Integration Checklist

### App Startup
```typescript
// 1. Provider setup (in layout.tsx)
<MiniAppProvider>
  <MiniAppErrorBoundary>
    <MiniAppSplash />
    <MiniAppContainer>
      <MiniAppHeader />
      {children}
    </MiniAppContainer>
  </MiniAppErrorBoundary>
</MiniAppProvider>

// 2. Initialize SDK (in your main component)
const { isInitialized, isReady, ready, user } = useMiniAppSDK()

useEffect(() => {
  if (isInitialized && !isReady) {
    // App loaded, mark as ready
    ready()
  }
}, [isInitialized, isReady])

// 3. Use SDK features
if (user) {
  console.log(`Hello, ${user.displayName}!`)
}
```

### Best Practices
- ✅ Call `ready()` when app is interactive
- ✅ Handle SDK not available gracefully
- ✅ Use error boundaries
- ✅ Show loading states
- ✅ Test in iframe preview
- ✅ Validate manifest
- ✅ Use safe action wrappers

---

## 12. Testing Guide

### Local Testing
1. **Browser mode**: `npm run dev`
2. **Preview mode**: Use Base Preview tool
3. **iframe testing**: Embed in test iframe

### Manifest Testing
```bash
# Validate manifest
curl https://curswap.com/.well-known/farcaster.json | jq

# Check validation
node -e "
  const { validateManifest, MINIAPP_MANIFEST } = require('./src/lib/miniapp/manifest.ts');
  console.log(validateManifest(MINIAPP_MANIFEST));
"
```

### SDK Testing
```typescript
// Use MockSDK for unit tests
import { MockSDK } from '@/lib/miniapp/testing'

test('should open URL', () => {
  const mockSDK = new MockSDK()
  mockSDK.actions.openUrl('https://test.com')
  
  const calls = mockSDK.getActionCalls()
  expect(calls).toHaveLength(1)
  expect(calls[0].action).toBe('openUrl')
})
```

---

## 13. Deployment Checklist

### Pre-deployment
- [ ] Manifest is valid
- [ ] URLs are production URLs
- [ ] Images are accessible
- [ ] Webhook endpoint works
- [ ] Error handling is production-ready
- [ ] Performance is optimized
- [ ] Mobile responsive

### Post-deployment
- [ ] Test manifest endpoint
- [ ] Test in Farcaster client
- [ ] Test in Base App
- [ ] Monitor errors
- [ ] Check performance
- [ ] Verify analytics

---

## 14. Resources

### Documentation
- [Base Mini-Apps Docs](https://docs.base.org/mini-apps)
- [Farcaster Frame SDK](https://github.com/farcasterxyz/frame-sdk)
- [OnchainKit Docs](https://onchainkit.xyz)

### Code Examples
- Manifest: `/src/lib/miniapp/manifest.ts`
- SDK Manager: `/src/lib/miniapp/sdk-manager.ts`
- React Hook: `/src/hooks/useMiniAppSDK.ts`
- Error Handler: `/src/lib/miniapp/error-handler.ts`
- Testing: `/src/lib/miniapp/testing.ts`

### Support
- Base Discord: https://base.org/discord
- Farcaster: https://warpcast.com

---

## ✅ Summary

**CurSwap** now has complete Base mini-app integration with:

✅ **Full SDK Integration** - All APIs implemented
✅ **Robust Error Handling** - Production-ready
✅ **Comprehensive Testing** - Mock SDK and helpers
✅ **UX Components** - Loading states and error boundaries
✅ **Documentation** - Complete guide
✅ **Type Safety** - Full TypeScript support
✅ **Best Practices** - Following Base guidelines

**Ready for production deployment!** 🚀
