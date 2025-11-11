# Frame Button Auto-Population Feature

## Overview
All frame button interactions automatically collect, populate, and save user interaction data without manual configuration. Every button click triggers comprehensive data logging.

## Features

### ✅ Automatic Data Collection
When any button is clicked in a Farcaster Frame, the system automatically captures:
- **User ID** (Farcaster FID)
- **NFT Information** (Token ID, Name, Price, Seller)
- **Timestamp** (Exact time of interaction)
- **Transaction Hash** (Frame message hash)
- **Platform Details** (Farcaster Frame, Base Network)
- **Action Type** (BUY, LIKE, VIEW, SHARE)

### 🔄 Button Actions with Auto-Population

#### Button 1: Buy NFT 💎
**Automatically Captures:**
```typescript
{
  action: 'BUY',
  status: 'pending',
  purchaseDetails: {
    nftTokenId: '1',
    priceETH: '2.5',
    priceWei: '2500000000000000000',
    buyer: 'fid:12345',
    seller: '0x742d35Cc...',
    initiatedAt: '2024-11-08T10:30:00Z',
    transactionStatus: 'pending'
  }
}
```

#### Button 2: Like NFT ❤️
**Automatically Captures:**
```typescript
{
  action: 'LIKE',
  status: 'completed',
  likeDetails: {
    nftTokenId: '1',
    likedBy: 'fid:12345',
    likedAt: '2024-11-08T10:30:00Z',
    likeCount: 47
  }
}
```

#### Button 3: View Details 🔗
**Automatically Captures:**
```typescript
{
  action: 'VIEW',
  status: 'completed',
  viewDetails: {
    nftTokenId: '1',
    viewedBy: 'fid:12345',
    viewedAt: '2024-11-08T10:30:00Z',
    referrer: 'farcaster_frame',
    viewCount: 234
  }
}
```

#### Button 4: Share NFT 📤
**Automatically Captures:**
```typescript
{
  action: 'SHARE',
  status: 'completed',
  shareDetails: {
    nftTokenId: '1',
    sharedBy: 'fid:12345',
    sharedAt: '2024-11-08T10:30:00Z',
    shareUrl: 'https://your-app.com/api/frames/nft/1',
    shareCount: 15,
    platform: 'Farcaster'
  }
}
```

## Implementation

### Frame Route Handler
Location: `src/app/api/frames/nft/[tokenId]/route.ts`

```typescript
// POST handler automatically processes all button clicks
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { buttonIndex, fid, messageHash, timestamp } = body.untrustedData
  
  // Auto-populate base data
  const baseData = autoPopulateInteractionData(untrustedData, nft)
  
  // Create specific record based on button
  switch (buttonIndex) {
    case 1:
      const purchaseRecord = createPurchaseRecord(baseData, nft)
      await saveInteractionRecord(purchaseRecord)
      break
    // ... other cases
  }
}
```

### Utility Functions
Location: `src/lib/frameInteractions.ts`

**Available Functions:**
- `autoPopulateInteractionData()` - Creates base interaction object
- `createPurchaseRecord()` - Auto-fills purchase details
- `createLikeRecord()` - Auto-fills like details
- `createViewRecord()` - Auto-fills view details
- `createShareRecord()` - Auto-fills share details
- `saveInteractionRecord()` - Persists data (logs + storage)
- `logButtonClick()` - Tracks button click analytics
- `getNFTInteractions()` - Retrieves all interactions for an NFT
- `getNFTAnalytics()` - Gets aggregated analytics

## Data Flow

```
User Clicks Button in Frame
         ↓
Frame POST Request Sent
         ↓
Auto-Populate Base Data
         ↓
Create Action-Specific Record
         ↓
Save to Console Logs
         ↓
Save to LocalStorage (Mock DB)
         ↓
Return Updated Frame
```

## Console Output Examples

### Purchase Button (Button 1)
```bash
🖱️ Button 1 clicked: {
  buttonIndex: 1,
  buttonLabel: 'Buy',
  userId: 12345,
  nftId: '1',
  timestamp: '2024-11-08T10:30:00Z'
}

🛒 Purchase initiated by user 12345: {
  userId: 12345,
  nftId: '1',
  nftName: 'Farcaster Genesis #001',
  nftPrice: '2.5',
  action: 'BUY',
  status: 'pending',
  purchaseDetails: { ... }
}

📝 Auto-saving interaction record: {
  type: 'BUY',
  userId: 12345,
  nftId: '1',
  timestamp: '2024-11-08T10:30:00Z'
}
```

### Like Button (Button 2)
```bash
🖱️ Button 2 clicked: { ... }
❤️ Like recorded for user 12345: { ... }
📝 Auto-saving interaction record: { type: 'LIKE', ... }
```

### View Button (Button 3)
```bash
🖱️ Button 3 clicked: { ... }
👁️ View details accessed by user 12345: { ... }
📝 Auto-saving interaction record: { type: 'VIEW', ... }
```

### Share Button (Button 4)
```bash
🖱️ Button 4 clicked: { ... }
📤 Share action by user 12345: { ... }
📝 Auto-saving interaction record: { type: 'SHARE', ... }
```

## Storage Mechanism

### Development/Mock Storage
Currently using **localStorage** and **console logs**:
```typescript
// Saved keys format
localStorage.setItem('frame_interaction_buy_1699437000000', JSON.stringify(record))
localStorage.setItem('frame_interaction_like_1699437001000', JSON.stringify(record))
localStorage.setItem('button_click_1699437002000', JSON.stringify(clickData))
```

### Production Database (To Implement)
Replace mock implementation with real database:
```typescript
// In saveInteractionRecord()
await db.frameInteractions.create({
  data: {
    userId: record.userId,
    nftId: record.nftId,
    action: record.action,
    timestamp: record.timestamp,
    details: record.purchaseDetails || record.likeDetails || ...
  }
})
```

## Analytics Retrieval

### Get All Interactions for NFT
```typescript
const interactions = await getNFTInteractions('1')
// Returns array of all interactions for NFT #1
```

### Get Analytics Summary
```typescript
const analytics = await getNFTAnalytics('1')
// Returns:
{
  totalViews: 234,
  totalLikes: 47,
  totalShares: 15,
  totalPurchaseAttempts: 8,
  lastInteraction: '2024-11-08T10:30:00Z'
}
```

## Testing

### Local Testing
1. Start dev server: `npm run dev`
2. Open frame URL: `http://localhost:3000/api/frames/nft/1`
3. Click any button
4. Check console for auto-populated data logs
5. Open DevTools → Application → LocalStorage to see saved records

### Production Testing
1. Deploy frame to production
2. Share frame URL in Farcaster
3. Click buttons in Farcaster client
4. Check server logs for interaction records
5. Query database for saved interactions

## Customization

### Add Custom Fields
Edit `frameInteractions.ts` to add custom fields:
```typescript
export interface CustomPurchaseData {
  userId: number
  nftId: string
  customField: string // Add your field
  // ... other fields
}
```

### Modify Button Actions
Edit button handlers in `route.ts`:
```typescript
case 1: // Buy button
  const purchaseRecord = createPurchaseRecord(baseData, nft)
  
  // Add custom logic
  purchaseRecord.customField = 'custom value'
  
  await saveInteractionRecord(purchaseRecord)
  break
```

## Benefits

✅ **Zero Manual Configuration** - All data auto-collected  
✅ **Comprehensive Tracking** - Every interaction logged  
✅ **Real-time Logging** - Instant console feedback  
✅ **Type-Safe** - Full TypeScript support  
✅ **Extensible** - Easy to add custom fields  
✅ **Production Ready** - Ready for database integration  

## Next Steps

1. **Database Integration**: Replace localStorage with PostgreSQL/MongoDB
2. **Analytics Dashboard**: Create UI to visualize interaction data
3. **Real Transactions**: Integrate with Base smart contracts for actual purchases
4. **User Profiles**: Link FID to user profiles and purchase history
5. **Webhooks**: Send notifications when interactions occur

## Files Modified

- ✅ `src/app/api/frames/nft/[tokenId]/route.ts` - Frame handler with auto-population
- ✅ `src/lib/frameInteractions.ts` - Utility functions for data management
- ✅ `FRAME_AUTO_POPULATION.md` - This documentation

---

**All button interactions now automatically capture and save complete data!** 🎉
