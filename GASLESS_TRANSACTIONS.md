# Gasless Transactions Setup - Base Paymaster

This guide explains how to configure Base Paymaster for gasless (sponsored) transactions in the Farcaster NFT Marketplace.

## Overview

Base Paymaster allows you to sponsor gas fees for your users, making transactions completely free for them. This implementation uses:

- **Base Paymaster** via Coinbase Developer Platform (CDP)
- **ERC-4337 Smart Accounts** for user wallets
- **permissionless.js** library for Smart Account functionality

## Quick Start

### 1. Get Your Paymaster RPC URL

1. Go to [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
2. Sign in or create an account
3. Navigate to **Paymaster** tool
4. Go to **Configuration** tab
5. Copy your **RPC URL** (format: `https://api.developer.coinbase.com/rpc/v1/base/YOUR_KEY`)

### 2. Configure Environment Variables

Create or update `.env.local` in the project root:

```bash
# Base Paymaster RPC URL (required for gasless transactions)
NEXT_PUBLIC_PAYMASTER_RPC_URL=https://api.developer.coinbase.com/rpc/v1/base/YOUR_KEY

# Optional: Network selection (defaults to Base Sepolia testnet)
NEXT_PUBLIC_NETWORK=mainnet  # or omit for testnet
```

### 3. Allowlist Your NFT Contract

In the CDP Paymaster dashboard:

1. Click **Allowlist** tab
2. Add your NFT contract address
3. Select specific functions to sponsor:
   - `mintTo(address)` - NFT minting
   - `buy(uint256)` - NFT purchasing  
   - `list(uint256, uint256)` - NFT listing

### 4. Configure Spending Limits

**Per-User Limits** (recommended):
- Amount: `$0.05` per cycle
- Operations: `1` UserOperation per cycle
- Reset cycle: `Monthly`

**Global Limits**:
- Testnet (Base Sepolia): Unlimited (for testing)
- Mainnet (Base): `$15,000` per month (or your budget)

### 5. Enable Paymaster

Toggle the "Enable Paymaster" switch in the Configuration tab.

## How It Works

### Architecture

```
User Wallet (EOA)
    ↓
Smart Account (ERC-4337)
    ↓
Paymaster Middleware
    ↓
Base Bundler → Base Network
```

1. **User connects wallet** (MetaMask, Coinbase Wallet, etc.)
2. **Smart Account created** automatically using `useSmartAccount` hook
3. **Transactions sponsored** by Paymaster (gas fees paid by you)
4. **User pays nothing** - completely gasless experience

### Code Integration

The implementation consists of three main components:

#### 1. Paymaster Configuration (`src/lib/paymaster.ts`)

```typescript
import { getPaymasterConfig } from '@/lib/paymaster';

const config = getPaymasterConfig();
// Returns: { entrypoint, factoryAddress, paymasterUrl, chain }
```

#### 2. Smart Account Hook (`src/hooks/useSmartAccount.ts`)

```typescript
import { useSmartAccount } from '@/hooks/useSmartAccount';

const { 
  smartAccount, 
  smartAccountAddress, 
  isReady, 
  sendGaslessTransaction 
} = useSmartAccount();
```

#### 3. Transaction Execution

```typescript
// Example: Mint NFT with sponsored gas
const result = await sendGaslessTransaction({
  to: nftContractAddress,
  data: encodeFunctionData({
    abi: nftAbi,
    functionName: 'mintTo',
    args: [userAddress],
  }),
  value: BigInt(0), // No ETH sent
});

console.log('Transaction hash:', result.hash);
```

## Usage in Components

### Minting NFTs (Gasless)

```tsx
import { useSmartAccount } from '@/hooks/useSmartAccount';
import { encodeFunctionData } from 'viem';

const MintButton = () => {
  const { sendGaslessTransaction, isReady } = useSmartAccount();
  
  const handleMint = async () => {
    if (!isReady) {
      alert('Smart Account not ready');
      return;
    }
    
    const txData = encodeFunctionData({
      abi: NFT_ABI,
      functionName: 'mintTo',
      args: [userAddress],
    });
    
    const result = await sendGaslessTransaction({
      to: NFT_CONTRACT_ADDRESS,
      data: txData,
    });
    
    toast.success(`Minted! Hash: ${result.hash}`);
  };
  
  return (
    <button onClick={handleMint} disabled={!isReady}>
      {isReady ? '✨ Mint (Free!)' : 'Initializing...'}
    </button>
  );
};
```

### Purchasing NFTs (Gasless)

```tsx
const BuyButton = ({ tokenId, price }: { tokenId: number; price: bigint }) => {
  const { sendGaslessTransaction } = useSmartAccount();
  
  const handleBuy = async () => {
    const txData = encodeFunctionData({
      abi: NFT_ABI,
      functionName: 'buy',
      args: [BigInt(tokenId)],
    });
    
    const result = await sendGaslessTransaction({
      to: NFT_CONTRACT_ADDRESS,
      data: txData,
      value: price, // Send ETH for purchase (gas still sponsored)
    });
    
    toast.success(`Purchased NFT #${tokenId}!`);
  };
  
  return <button onClick={handleBuy}>Buy Now (No Gas Fee)</button>;
};
```

## Testing

### Local Testing (Base Sepolia)

1. Use Base Sepolia testnet (default)
2. Get test ETH from [Base faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
3. Set unlimited budget in CDP Paymaster
4. Test all transaction types

### Production Deployment (Base Mainnet)

1. Change `NEXT_PUBLIC_NETWORK=mainnet` in `.env.local`
2. Set appropriate spending limits
3. Monitor usage in CDP dashboard
4. Adjust limits based on traffic

## Monitoring & Analytics

### CDP Dashboard

View real-time stats:
- Total UserOperations sponsored
- Gas fees paid (in USD)
- Per-user spending
- Failed transactions
- Allowlist violations

### Access Dashboard

1. Go to [CDP Portal](https://portal.cdp.coinbase.com/)
2. Click **Paymaster** → **Analytics**
3. View charts and metrics

## Troubleshooting

### "Paymaster not configured" Error

**Solution**: Ensure `NEXT_PUBLIC_PAYMASTER_RPC_URL` is set in `.env.local`

### "Smart Account not ready" Error

**Solutions**:
- User must connect wallet first
- Wait for Smart Account initialization (2-5 seconds)
- Check browser console for errors

### "Transaction rejected by Paymaster" Error

**Possible causes**:
1. Contract not allowlisted → Add to CDP allowlist
2. Function not sponsored → Allow specific function
3. User exceeded per-cycle limit → Increase limit or wait for reset
4. Global budget exceeded → Increase global limit

### "Insufficient funds" Error

This can happen if:
- User needs ETH for transaction value (e.g., buying NFT)
- Gas is still sponsored, but NFT price must be paid by user

**Solution**: User needs ETH for NFT price, not for gas fees

## Cost Estimation

### Base Network Gas Costs (Typical)

- Mint NFT: ~$0.01 - $0.05 per transaction
- Buy NFT: ~$0.02 - $0.08 per transaction
- List NFT: ~$0.01 - $0.03 per transaction

### Monthly Budget Examples

**100 users, 10 transactions each** = 1,000 operations
- Estimated cost: $20 - $50/month

**1,000 users, 5 transactions each** = 5,000 operations
- Estimated cost: $100 - $250/month

**10,000 users, 3 transactions each** = 30,000 operations
- Estimated cost: $600 - $1,500/month

## Security Best Practices

1. **Allowlist specific functions** - Don't sponsor all contract functions
2. **Set per-user limits** - Prevent abuse (e.g., $0.05 per month per user)
3. **Monitor usage** - Check CDP dashboard daily
4. **Set budget alerts** - Get notified when approaching limits
5. **Review transactions** - Investigate unusual patterns

## Advanced Configuration

### Custom Gas Estimation

Modify `src/lib/paymaster.ts` to customize gas estimation:

```typescript
export const customGasConfig = {
  maxFeePerGas: BigInt(1000000000), // 1 gwei
  maxPriorityFeePerGas: BigInt(1000000000), // 1 gwei
};
```

### Multiple Paymasters

For different user tiers:

```typescript
const premiumPaymasterUrl = process.env.NEXT_PUBLIC_PREMIUM_PAYMASTER_RPC_URL;
const freePaymasterUrl = process.env.NEXT_PUBLIC_FREE_PAYMASTER_RPC_URL;

// Use different paymaster based on user tier
const paymasterUrl = isPremiumUser ? premiumPaymasterUrl : freePaymasterUrl;
```

### Conditional Sponsorship

Sponsor only for specific users or conditions:

```typescript
const shouldSponsor = (user: Address) => {
  // Example: Only sponsor for new users
  return isNewUser(user);
};
```

## Resources

- [Base Paymaster Documentation](https://docs.base.org/docs/tools/paymaster)
- [ERC-4337 Specification](https://eips.ethereum.org/EIPS/eip-4337)
- [permissionless.js Docs](https://docs.pimlico.io/permissionless)
- [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)

## Support

For issues or questions:
1. Check CDP Paymaster [troubleshooting guide](https://docs.base.org/docs/tools/paymaster#troubleshooting)
2. Review [ERC-4337 best practices](https://docs.base.org/docs/tools/account-abstraction)
3. Contact Coinbase Support via CDP Portal

---

**Status**: ✅ Implementation Complete
**Last Updated**: 2024
**Network**: Base (Mainnet & Sepolia Testnet)
