# Base Sepolia Testnet Configuration - Complete ✅

## Changes Applied

### 1. Environment Configuration (.env.local)
✅ Set `NEXT_PUBLIC_NETWORK=baseSepolia`
✅ Set `NEXT_PUBLIC_MARKETPLACE_CONTRACT=0x665Cf11D9B9A427c7c0ae410B7A7E6F629f5cAc5`
✅ Set `NEXT_PUBLIC_BASE_RPC_URL=https://sepolia.base.org`
✅ Removed duplicate conflicting values

### 2. Wagmi Configuration (src/lib/wagmi.ts)
✅ Added `baseSepolia` chain import from `wagmi/chains`
✅ Configured conditional chain selection based on `NEXT_PUBLIC_NETWORK` env var
✅ Added Base Sepolia RPC transports:
   - Primary: https://sepolia.base.org
   - Alchemy: https://base-sepolia.g.alchemy.com/v2/[KEY]
   - BlockPI: https://base-sepolia.blockpi.network/v1/rpc/public
✅ Updated both `config` and `farcasterFrameConfig` to support testnet

### 3. Provider Configuration (src/app/providers.tsx)
✅ Added `baseSepolia` import
✅ Set `initialChain` dynamically based on environment
✅ Updated `OnchainKitProvider` and `RainbowKitProvider` to use correct chain

### 4. Network Switcher Component (NEW)
✅ Created `src/components/NetworkSwitcher.tsx`
✅ Automatically detects wrong network and shows warning banner
✅ One-click network switching
✅ Auto-adds Base Sepolia to wallet if not configured
✅ Shows link to Coinbase Faucet for testnet ETH
✅ Added to `src/app/layout.tsx` for global availability

## How to Use

### Step 1: Connect Your Wallet
1. Open http://localhost:3000
2. Click "Connect Wallet" button (top right)
3. Select your wallet (MetaMask, Coinbase Wallet, etc.)
4. Approve the connection

### Step 2: Switch to Base Sepolia Network
**Option A: Automatic (Recommended)**
- If you're on the wrong network, a yellow banner will appear at the bottom
- Click "Switch Network" button
- Approve in your wallet popup

**Option B: Manual in MetaMask**
1. Open MetaMask
2. Click network dropdown (top left)
3. Click "Add Network" → "Add a network manually"
4. Enter these details:
   - **Network Name**: Base Sepolia Testnet
   - **RPC URL**: https://sepolia.base.org
   - **Chain ID**: 84532
   - **Currency Symbol**: ETH
   - **Block Explorer**: https://sepolia.basescan.org
5. Click "Save"
6. Select "Base Sepolia Testnet" from network dropdown

### Step 3: Get Testnet ETH
You need Base Sepolia ETH to interact with the marketplace:
1. Visit Coinbase Faucet: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
2. Connect your wallet
3. Request testnet ETH (free, instant)
4. Alternative faucets:
   - https://www.alchemy.com/faucets/base-sepolia
   - https://faucet.quicknode.com/base/sepolia

### Step 4: Test Marketplace Functions
Now you can test all marketplace features:

**Mint an NFT:**
1. Go to "Mint" page
2. Upload image/metadata
3. Set royalty percentage (0-10%)
4. Click "Mint NFT"
5. Approve transaction in wallet
6. Wait for confirmation

**List NFT for Sale:**
1. Go to "My NFTs" page
2. Select an NFT you own
3. Click "List for Sale"
4. Enter price in ETH
5. Approve transaction
6. NFT appears in marketplace

**Buy an NFT:**
1. Browse marketplace
2. Find an NFT you want
3. Click "Buy Now"
4. Approve transaction
5. NFT transfers to your wallet

## Network Details

### Base Sepolia Testnet
- **Chain ID**: 84532 (0x14a34 in hex)
- **Currency**: Sepolia ETH (test ETH, no real value)
- **RPC URL**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org
- **Faucet**: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

### Your Deployed Contract
- **Address**: 0x665Cf11D9B9A427c7c0ae410B7A7E6F629f5cAc5
- **Network**: Base Sepolia Testnet
- **Block Explorer**: https://sepolia.basescan.org/address/0x665Cf11D9B9A427c7c0ae410B7A7E6F629f5cAc5
- **View on BaseScan**: [Click here](https://sepolia.basescan.org/address/0x665Cf11D9B9A427c7c0ae410B7A7E6F629f5cAc5)

## Troubleshooting

### "Network Switcher doesn't appear"
- Refresh the page (Ctrl+R or Cmd+R)
- Make sure you're connected to a wallet
- Check browser console for errors (F12)

### "Transaction fails immediately"
- Make sure you have testnet ETH (check balance in wallet)
- Get more from faucet if balance is 0
- Try increasing gas limit in wallet settings

### "Can't see my minted NFTs"
- Wait 30 seconds for blockchain confirmation
- Refresh the "My NFTs" page
- Check transaction on BaseScan to verify it succeeded

### "Wrong network keeps appearing"
- Make sure `.env.local` has `NEXT_PUBLIC_NETWORK=baseSepolia`
- Restart dev server: Ctrl+C, then `npm run dev`
- Clear browser cache and refresh

## For Mainnet Deployment (Later)

When you're ready to deploy to mainnet:

1. **Update .env.local:**
   ```bash
   NEXT_PUBLIC_NETWORK=base
   NEXT_PUBLIC_MARKETPLACE_CONTRACT=<mainnet-contract-address>
   NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
   ```

2. **Deploy contract to mainnet:**
   ```bash
   npm run deploy:mainnet
   ```

3. **Update contract address in .env.local**

4. **Restart server:**
   ```bash
   npm run dev
   ```

The app will automatically switch to Base mainnet (Chain ID: 8453)

## Security Notes

✅ All API keys are in `.env.local` (git-ignored)
✅ Contract has security features enabled:
   - Reentrancy protection
   - Max price limit (1M ETH)
   - Pausable (emergency stop)
   - Metadata URI validation
✅ Private key is only used for deployment (never exposed to frontend)

## Current Status

🎯 **READY FOR TESTING**
- ✅ Dev server running at http://localhost:3000
- ✅ Base Sepolia testnet configured
- ✅ Contract deployed and verified
- ✅ Network switcher active
- ✅ All environment variables set
- ✅ Ready for wallet connection

**Next Action**: Open http://localhost:3000 in your browser and connect your wallet!
