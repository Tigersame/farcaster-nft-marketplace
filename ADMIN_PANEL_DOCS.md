# Admin Panel Documentation

## Overview

The Farcaster NFT Marketplace now includes a comprehensive admin control panel with full marketplace management capabilities.

## Features

### 1. Admin Authentication
- Admins are identified by wallet address
- For demo purposes, any connected wallet is considered admin
- In production, set `NEXT_PUBLIC_ADMIN_ADDRESS` environment variable to specific admin wallet

### 2. Admin Access
- **Admin Button**: Red floating button in bottom-left corner when admin wallet is connected
- **Admin Badge**: Shows "ADMIN" status indicator below the button
- **Tooltip**: Hover over button to see "Open Admin Panel" or "Close Admin Panel"
- **Pulse Animation**: Button has animated pulse effect to indicate admin status

### 3. Admin Panel Features

#### Overview Tab
- **Real-time Statistics**:
  - Total Users: 1,247
  - Total NFTs: 5,834
  - Trading Volume: 2,456.7 ETH
  - Active Listings: 342
  - Pending Transactions: 23
  - Reported Items: 7

- **Quick Actions**:
  - Refresh Data
  - Export Reports
  - Bulk Import
  - System Settings

#### NFT Management Tab
- **NFT Listing**: View all NFTs with details (name, creator, price, status)
- **Actions per NFT**:
  - 👁️ View Details
  - ✏️ Edit NFT
  - 🔒 Ban/Unban NFT
  - 🗑️ Remove NFT
- **Bulk Operations**: Import/Export NFT lists
- **Status Management**: Active, Pending, Reported, Banned states

#### User Management Tab
- **Ban User**: Ban users by wallet address
- **Verify Creator**: Verify creator status for users
- **Grant Admin**: Promote users to admin status
- **User Actions**: Manage user permissions and status

#### Financial Management Tab
- **Platform Fees**: Configure marketplace and royalty fees
  - Marketplace Fee: 2.5% (adjustable)
  - Creator Royalty: 5.0% (adjustable)
- **Fund Management**:
  - View available balance: 15.2 ETH
  - Withdraw funds to admin wallet
  - Real-time balance tracking

#### Settings Tab
- **Marketplace Settings**:
  - Maintenance Mode toggle
  - New Registrations toggle
  - Auto-approve NFTs toggle
- **Danger Zone**:
  - Clear All Cache
  - Emergency Stop
  - Database Backup

## Usage Instructions

### Accessing Admin Panel
1. Connect your wallet to the marketplace
2. Look for the red admin button in the bottom-left corner
3. Click the button to open the admin panel modal
4. Navigate between tabs using the top navigation

### Managing NFTs
1. Go to "NFT Management" tab
2. View all NFTs in the table format
3. Use action buttons to manage individual NFTs:
   - View: See detailed NFT information
   - Edit: Modify NFT properties
   - Ban/Unban: Control NFT visibility
   - Remove: Delete NFT from marketplace

### Managing Users
1. Go to "User Management" tab
2. Enter wallet addresses in the respective input fields
3. Use action buttons to:
   - Ban problematic users
   - Verify legitimate creators
   - Grant admin privileges

### Financial Operations
1. Go to "Financial" tab
2. Adjust platform fees as needed
3. Monitor available funds
4. Withdraw earnings to admin wallet

### System Configuration
1. Go to "Settings" tab
2. Toggle marketplace features on/off
3. Use danger zone features for maintenance
4. Backup data before major changes

## Security Features

- **Admin-only Access**: Panel only visible to admin wallets
- **Secure Actions**: All actions require admin authentication
- **Audit Trail**: All admin actions can be tracked
- **Emergency Controls**: Emergency stop and maintenance mode available

## Technical Implementation

- **React Components**: Built with TypeScript and Tailwind CSS
- **Wallet Integration**: Uses Wagmi for wallet connection
- **State Management**: Local state with React hooks
- **Responsive Design**: Works on desktop and mobile
- **Modal Interface**: Overlay modal for clean UX
- **Icon System**: Feather icons for consistency

## Environment Variables

```env
# Set specific admin wallet address (optional)
NEXT_PUBLIC_ADMIN_ADDRESS=0xYourAdminWalletAddress
```

If not set, any connected wallet will have admin access (for development only).