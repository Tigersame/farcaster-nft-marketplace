# Custom Transaction Trays Implementation

## Overview
This guide explains how to implement custom transaction trays with agent branding for your FarcasterSea NFT Marketplace.

## Transaction Metadata Structure

When making wallet send calls, include metadata to display custom branding in the transaction tray:

```typescript
// Transaction data structure with custom metadata
const walletSendCallsData = {
  version: "1.0",
  from: userAddress as `0x${string}`,
  chainId: "8453", // Base mainnet
  calls: [
    {
      to: contractAddress as `0x${string}`,
      data: encodedData as `0x${string}`,
      value: ethValue
    }
  ],
  metadata: {
    description: "Purchase NFT - Base Genesis #001 for 0.005 ETH",
    hostname: "farcastmints.com",
    faviconUrl: "https://farcastmints.com/favicon.ico",
    title: "FarcasterSea NFT Marketplace"
  }
}
```

## Implementation Files

### 1. Transaction Metadata Utility (`src/lib/transactionMetadata.ts`)
✅ Created - Provides helper functions for generating transaction metadata

### 2. Transaction Descriptions
Pre-defined descriptions for common marketplace actions:
- Buy NFT
- List NFT for sale  
- Cancel listing
- Make offer
- Accept offer
- Transfer NFT
- Mint NFT
- Approve marketplace

## Usage Example

```typescript
import { createWalletSendCallsData, TRANSACTION_DESCRIPTIONS } from '@/lib/transactionMetadata';

// When purchasing an NFT
const purchaseData = createWalletSendCallsData(
  userAddress,
  "8453", // Base chainId
  [{
    to: marketplaceContract,
    data: encodedBuyFunction,
    value: nftPrice
  }],
  TRANSACTION_DESCRIPTIONS.buyNFT("Base Genesis #001", "0.005")
);

// Send to wallet
await wallet.sendCalls(purchaseData);
```

## Benefits

1. **Branded Experience**: Users see your marketplace name and icon in their wallet
2. **Clear Descriptions**: Transaction purpose is immediately clear
3. **Trust Building**: Professional appearance increases user confidence
4. **Better UX**: Users know exactly what they're approving

## Customization

Update the metadata in `src/lib/transactionMetadata.ts`:

```typescript
export function getTransactionMetadata(description: string): TransactionMetadata {
  return {
    description,
    hostname: "farcastmints.com", // Your domain
    faviconUrl: "https://farcastmints.com/favicon.ico", // Your favicon
    title: "FarcasterSea NFT Marketplace" // Your marketplace name
  };
}
```

## Next Steps

To fully implement custom transaction trays:

1. Upgrade to latest OnchainKit version that supports transaction metadata
2. Update wallet send calls to include metadata
3. Test transaction flow in Base wallet or compatible wallets
4. Verify branding appears correctly in transaction tray

## References

- Base documentation: https://docs.base.org
- OnchainKit transaction docs: https://onchainkit.xyz/transaction/transaction
- Base Agent example: https://github.com/siwan-cb/tba-chat-example-bot
