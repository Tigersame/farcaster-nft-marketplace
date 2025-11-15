# 🔔 Mini App Notifications - Quick Start

## ✅ What's Been Implemented

Your Farcaster NFT Marketplace now has **full notification support** for Base app and other Farcaster clients!

### Core Features

1. **Webhook Handler** - `/api/miniapp/webhook`
   - Receives and verifies events from Farcaster clients
   - Handles add/remove Mini App, enable/disable notifications
   - Sends welcome & confirmation messages

2. **Notification System**
   - Send single or batch notifications
   - Automatic token management
   - Rate limit handling
   - Error recovery

3. **User Interface**
   - "Add Mini App" button component
   - Full notification preferences manager
   - Dark mode support
   - Responsive design

4. **Admin Tools**
   - Manual notification API at `/api/notifications/send`
   - Testing and debugging utilities

## 🚀 Quick Usage

### 1. Add Button to Any Page

```tsx
import AddMiniAppButton from "@/components/AddMiniAppButton";

export default function MyPage() {
  return <AddMiniAppButton />;
}
```

### 2. Full Notifications Page

Already created at `/notifications` - visit:
https://farcastmints.com/notifications

### 3. Send Notifications from Code

```typescript
import { sendMiniAppNotification } from "@/lib/sendNotification";

await sendMiniAppNotification({
  fid: 123456,
  appFid: 309857,
  title: "NFT Sold! 🎉",
  body: "Your NFT sold for 2.5 ETH",
});
```

## 🎯 Next Steps

### Before Deployment

1. **Set Environment Variable in Vercel**
   ```
   NEYNAR_API_KEY=wc_secret_27c1ee7851ac6206831d3f54213d01b945a3eaffaa4e1abbeceb391a_464ffa60
   NEXT_PUBLIC_APP_URL=https://farcastmints.com
   ```

2. **Deploy to Vercel**
   ```bash
   git add .
   git commit -m "Add Mini App notifications support"
   git push
   ```

3. **Verify Deployment**
   - Visit https://farcastmints.com/api/miniapp/webhook
   - Should return 405 (Method Not Allowed) - this is correct

### After Deployment

1. **Test in Farcaster Client**
   - Open your Mini App in Base app or Warpcast
   - Click "Add Mini App" button
   - Enable notifications when prompted
   - You should receive a welcome notification

2. **Send Test Notification**
   ```bash
   curl -X POST https://farcastmints.com/api/notifications/send \
     -H "Content-Type: application/json" \
     -d '{
       "fid": YOUR_FID,
       "title": "Test",
       "body": "This is a test notification"
     }'
   ```

## 📦 Files Created

```
✅ src/lib/notifications.ts               # Token storage
✅ src/lib/sendNotification.ts            # Send notifications
✅ src/app/api/miniapp/webhook/route.ts   # Webhook handler
✅ src/app/api/notifications/send/route.ts # Manual send API
✅ src/app/notifications/page.tsx         # Notifications UI page
✅ src/components/AddMiniAppButton.tsx    # Add Mini App button
✅ src/components/NotificationManager.tsx # Full preferences UI
✅ public/.well-known/farcaster.json      # Updated with webhook URL
✅ NOTIFICATIONS_IMPLEMENTATION.md        # Full documentation
```

## ⚙️ Configuration Updated

- ✅ Manifest webhook URL: `https://farcastmints.com/api/miniapp/webhook`
- ✅ All URLs updated to farcastmints.com domain
- ✅ Environment variables configured
- ✅ Package installed: `@farcaster/miniapp-node`

## 🎨 Where to Add Notifications

### Marketplace Events

Add to your existing marketplace code:

```typescript
// When NFT is listed
await sendMiniAppNotification({
  fid: sellerFid,
  appFid: 309857,
  title: "Listed! 🎨",
  body: `${nftName} is now on sale`,
});

// When NFT sells
await sendMiniAppNotification({
  fid: buyerFid,
  appFid: 309857,
  title: "Purchase Complete! ✨",
  body: `You now own ${nftName}`,
});
```

### User Actions

```typescript
// When user receives an offer
await sendMiniAppNotification({
  fid: ownerFid,
  appFid: 309857,
  title: "New Offer! 💰",
  body: `${offerAmount} ETH for ${nftName}`,
});
```

## 📊 Database Migration (Future)

Currently using in-memory storage. For production scale:

1. Add Prisma schema:
   ```prisma
   model NotificationToken {
     id        String   @id @default(cuid())
     fid       Int
     appFid    Int
     url       String
     token     String
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
     
     @@unique([fid, appFid])
   }
   ```

2. Replace functions in `src/lib/notifications.ts` with database calls

## ✨ Features Ready to Use

- ✅ Webhook verification with Neynar
- ✅ Automatic token management
- ✅ Welcome notifications
- ✅ Confirmation notifications
- ✅ Single & batch sending
- ✅ Rate limit handling
- ✅ Error recovery
- ✅ Dark mode UI
- ✅ Responsive design
- ✅ Testing API
- ✅ Full documentation

## 🔗 Resources

- Full docs: `NOTIFICATIONS_IMPLEMENTATION.md`
- Test page: https://farcastmints.com/notifications
- Webhook: https://farcastmints.com/api/miniapp/webhook
- Send API: https://farcastmints.com/api/notifications/send

---

**Ready to go!** Just deploy and start engaging your users with real-time notifications! 🚀
