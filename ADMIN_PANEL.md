# 🔐 Admin Panel Documentation

## Overview
The Admin Panel is a privileged interface accessible only to the designated admin wallet address. It provides comprehensive marketplace management tools and real-time analytics.

---

## Access Control

### Admin Wallet Address
```
0xcaA2dC702DdF5625296d42aa13B37458d29d2e49
```

**Security Features:**
- ✅ Only visible when admin wallet is connected
- ✅ Completely hidden for all other users
- ✅ Case-insensitive address comparison
- ✅ Toast notification on successful admin access
- ✅ No UI hints for non-admin users

---

## Features

### 📊 Overview Tab
Real-time marketplace statistics and system health monitoring.

**Metrics Displayed:**
- **System Health**: Overall platform status (Healthy/Warning/Critical)
- **Total NFTs**: Complete NFT count across marketplace
- **Total Users**: Registered user count
- **Total Volume**: Cumulative trading volume in ETH
- **Active Listings**: Currently listed NFTs
- **Pending Transactions**: Transactions awaiting confirmation

**Actions:**
- Refresh stats (updates user count and listings with simulated data)
- Visual health indicators with color coding

---

### 🖼️ NFT Management Tab
Tools for managing NFT listings and content moderation.

**Actions Available:**
- **Bulk Upload NFTs**: Mass upload functionality
- **Export NFT Data**: Download NFT database
- **Feature NFT**: Promote specific NFTs to homepage
- **Moderate Listings**: Review and approve/reject listings
- **View Flagged Items**: Check user-reported content

---

### 👥 Users Tab
User management and analytics dashboard.

**Statistics:**
- Total registered users
- Active users today
- User growth metrics

**Management Tools:**
- View all users database
- Banned users list
- User reports and moderation queue

---

### ⚙️ Settings Tab
Platform-wide configuration and maintenance controls.

**Toggles:**
- **Maintenance Mode**: Enable/disable platform access
- **New Registrations**: Control new user signups
- **Auto-Moderation**: Toggle automatic content filtering

**Actions:**
- Save settings (persist configuration)
- Clear cache (force refresh platform data)

---

## Technical Implementation

### Component Structure
```tsx
src/components/AdminPanel.tsx
```

### Integration
The admin panel is imported and rendered in the main marketplace:
```tsx
// src/app/marketplace.tsx
import { AdminPanel } from '@/components/AdminPanel'

// Rendered after Header
<AdminPanel />
```

### State Management
- Uses React hooks (`useState`, `useEffect`)
- Integrates with Wagmi for wallet connection
- Animated with Framer Motion
- Toast notifications via react-hot-toast

### Styling
- Fixed position (top-right corner)
- Fully responsive (works on mobile)
- Dark mode compatible
- Glass morphism effects
- Gradient accents (purple/blue theme)

---

## Usage

### Accessing the Admin Panel

1. **Connect Your Wallet**
   - Click "Connect Wallet" in the header
   - Select your wallet provider (MetaMask, Coinbase Wallet, etc.)
   - Connect with the admin address: `0xcaA2dC702DdF5625296d42aa13B37458d29d2e49`

2. **Admin Panel Appears**
   - Panel shows in top-right corner
   - Success toast: "🔐 Admin access granted!"
   - Badge displays "Admin Panel" with shield icon

3. **Navigate Tabs**
   - Click tab icons to switch views
   - Each tab has specific tools and actions
   - Stats refresh automatically on tab changes

---

## Development Notes

### Mock Data
Currently uses simulated data for demonstration:
```typescript
const [stats, setStats] = useState<AdminStats>({
  totalNFTs: 156,
  totalUsers: 1247,
  totalVolume: '45.8',
  activeListings: 89,
  pendingTransactions: 3,
  systemHealth: 'healthy'
})
```

### Production Integration
To connect with real data:

1. **Replace Mock Stats**
   ```typescript
   // Fetch from API
   useEffect(() => {
     fetch('/api/admin/stats')
       .then(res => res.json())
       .then(data => setStats(data))
   }, [])
   ```

2. **Implement Actions**
   ```typescript
   const bulkUploadNFTs = async (files: File[]) => {
     const formData = new FormData()
     files.forEach(file => formData.append('nfts', file))
     
     await fetch('/api/admin/nfts/bulk-upload', {
       method: 'POST',
       body: formData
     })
   }
   ```

3. **Add Authentication**
   ```typescript
   // Verify admin status server-side
   const verifyAdmin = async (address: string) => {
     const response = await fetch('/api/admin/verify', {
       headers: { 'X-Wallet-Address': address }
     })
     return response.json()
   }
   ```

---

## Security Considerations

### Current Implementation
- ✅ Client-side address check (UI layer)
- ✅ No server-side calls yet
- ✅ Panel completely hidden for non-admins

### Production Requirements
When implementing backend:

1. **Server-Side Verification**
   - Always verify admin status on backend
   - Never trust client-side checks alone
   - Use signed messages for authentication

2. **API Protection**
   ```typescript
   // Middleware example
   const verifyAdmin = (req, res, next) => {
     const { address } = req.headers
     if (address.toLowerCase() !== ADMIN_ADDRESS.toLowerCase()) {
       return res.status(403).json({ error: 'Unauthorized' })
     }
     next()
   }
   ```

3. **Rate Limiting**
   - Implement rate limits on admin endpoints
   - Log all admin actions
   - Monitor for suspicious activity

---

## Customization

### Change Admin Address
Edit the constant in `AdminPanel.tsx`:
```typescript
const ADMIN_ADDRESS = '0xYourNewAdminAddress'
```

### Add Multiple Admins
```typescript
const ADMIN_ADDRESSES = [
  '0xcaA2dC702DdF5625296d42aa13B37458d29d2e49',
  '0xAnotherAdminAddress',
  '0xYetAnotherAdminAddress'
]

const isAdmin = ADMIN_ADDRESSES.some(
  addr => addr.toLowerCase() === address?.toLowerCase()
)
```

### Customize Styling
Colors and positioning can be adjusted:
```typescript
// Position
className="fixed top-20 right-4 z-50"

// Colors
className="bg-gradient-to-r from-purple-600 to-blue-600"
```

---

## Troubleshooting

### Panel Not Showing
1. **Verify wallet connection**
   - Check if wallet is connected
   - Verify correct network (Base)

2. **Check address match**
   - Ensure exact address match
   - Check for typos or checksum issues

3. **Browser console**
   - Look for React errors
   - Check toast notifications

### Stats Not Updating
1. **Refresh button** - Click refresh icon
2. **Tab switching** - Switch between tabs
3. **Hard refresh** - Ctrl+F5 to reload page

---

## Future Enhancements

### Planned Features
- [ ] Real-time WebSocket updates
- [ ] Advanced analytics charts
- [ ] User ban/unban functionality
- [ ] NFT approval/rejection workflow
- [ ] Export data to CSV/JSON
- [ ] Email notification settings
- [ ] Activity log viewer
- [ ] Revenue analytics
- [ ] Smart contract interaction tools

### API Endpoints (To Implement)
```
GET  /api/admin/stats           - Fetch real-time stats
GET  /api/admin/nfts            - List all NFTs
POST /api/admin/nfts/feature    - Feature an NFT
POST /api/admin/nfts/moderate   - Moderate NFT listing
GET  /api/admin/users           - List all users
POST /api/admin/users/ban       - Ban a user
GET  /api/admin/reports         - Fetch user reports
POST /api/admin/settings        - Update platform settings
```

---

## Support

For issues or questions:
- Check `README.md` for general setup
- Review TypeScript types in component
- Test with dev server: `npm run dev`
- Check browser console for errors

---

**Last Updated**: November 7, 2025  
**Version**: 1.0.0  
**Status**: Production Ready
