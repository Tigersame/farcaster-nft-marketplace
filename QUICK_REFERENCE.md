# 🚀 Quick Reference - OpenSea-Style Frames

## Start Development
```powershell
npm run dev
```
Server: `http://localhost:3000`

---

## Test Frames

### View Frame HTML
```powershell
curl http://localhost:3000/api/frames/nft/1
```

### Test Transaction Endpoint (Buy Button)
```powershell
curl -X POST http://localhost:3000/api/frames/nft/1/tx `
  -H "Content-Type: application/json" `
  -d '{"untrustedData":{"fid":12345}}'
```

### Test Like Button
```powershell
curl -X POST http://localhost:3000/api/frames/nft/1 `
  -H "Content-Type: application/json" `
  -d '{"untrustedData":{"fid":12345,"buttonIndex":2}}'
```

### Test Share Button
```powershell
curl -X POST http://localhost:3000/api/frames/nft/1 `
  -H "Content-Type: application/json" `
  -d '{"untrustedData":{"fid":12345,"buttonIndex":4}}'
```

---

## Button Actions

| Button | Emoji | Action | Type | Onchain |
|--------|-------|--------|------|---------|
| 1 | 💎 | Buy Now | `tx` | ✅ Yes |
| 2 | ❤️ | Like | `post` | ❌ No |
| 3 | 🔗 | View Details | `link` | ❌ No |
| 4 | 📤 | Share | `post` | ❌ No |

---

## NFT IDs Available

Test with any tokenId from 1-12:
- 1: Farcaster Genesis #001 (2.5 ETH)
- 2: Base Builder Badge (1.0 ETH)
- 3: Onchain Summer Vibes (0.75 ETH)
- 4: Crypto Punk Revival (5.0 ETH)
- 5: Neural Art Genesis (1.25 ETH)
- 6: Base Ecosystem Explorer (0.8 ETH)
- 7: Farcaster Frame Art (1.8 ETH)
- 8: Onchain Music Genesis (3.2 ETH)
- 9: Pixel Warriors #156 (0.65 ETH)
- 10: Base Degen Collection (0.42 ETH)
- 11: MetaVerse Land Plot (7.5 ETH)
- 12: Animated Cosmos #99 (2.1 ETH)

---

## Key Endpoints

```
GET  /api/frames/nft/[tokenId]     → Frame HTML
POST /api/frames/nft/[tokenId]     → Button handler
POST /api/frames/nft/[tokenId]/tx  → Transaction data
GET  /api/frames/image/[tokenId]   → Frame images
```

---

## Console Output Examples

### Buy Button
```
🖱️ Button 1 clicked: Buy
🔗 Generating transaction for user 12345
📤 Transaction data ready
```

### Like Button
```
🖱️ Button 2 clicked: Like
❤️ Like recorded for user 12345
```

### View Button
```
🖱️ Button 3 clicked: View Details
👁️ View details accessed by user 12345
```

### Share Button
```
🖱️ Button 4 clicked: Share
📤 Share action by user 12345
```

---

## Farcaster Validator

Test URL: https://warpcast.com/~/developers/frames

Enter: `http://localhost:3000/api/frames/nft/1`

---

## Transaction Format

Buy button returns:
```json
{
  "chainId": "eip155:8453",
  "method": "eth_sendTransaction",
  "params": {
    "abi": [...],
    "to": "0xb4703a3a73aec16e764cbd210b0fde9efdab8941",
    "value": "2500000000000000000"
  }
}
```

---

## Key Files

- `src/lib/frameInteractions.ts` - Auto-population logic
- `src/app/api/frames/nft/[tokenId]/route.ts` - Main frame
- `src/app/api/frames/nft/[tokenId]/tx/route.ts` - Transactions
- `OPENSEA_FRAME_REFERENCE.md` - Full docs
- `TESTING_GUIDE.md` - Testing instructions
- `IMPLEMENTATION_COMPLETE.md` - Complete summary

---

## Blockchain Config

- **Network**: Base Mainnet
- **Chain ID**: 8453
- **Contract**: `0xb4703a3a73aec16e764cbd210b0fde9efdab8941`
- **All NFTs**: Have contractAddress + chainId + attributes

---

## Auto-Populated Fields

Every interaction captures:
- ✅ User FID
- ✅ NFT Token ID
- ✅ Timestamp (ISO 8601)
- ✅ Action type (BUY/LIKE/VIEW/SHARE)
- ✅ Contract address (for purchases)
- ✅ Chain ID (8453)
- ✅ Price in ETH and Wei
- ✅ Seller/buyer addresses
- ✅ Message hash

---

## Status: ✅ COMPLETE

All buttons work with proper:
- ✅ Onchain transactions (Button 1)
- ✅ Auto-population (All buttons)
- ✅ OpenSea patterns (All)
- ✅ Type safety (TypeScript)
- ✅ Comprehensive logging
- ✅ Full documentation

**Ready to test and deploy!** 🎉
