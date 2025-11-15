// Event listener for smart contract events
// Monitors blockchain events and triggers Mini App notifications

import { ethers } from "ethers";
import { sendMiniAppNotification, sendBatchNotifications } from "./sendNotification";

// Contract ABI for event listening (only events needed)
const MARKETPLACE_ABI = [
  "event NFTMinted(uint256 indexed tokenId, address indexed creator, string metadataURI, uint256 timestamp)",
  "event NFTListed(uint256 indexed tokenId, address indexed seller, uint256 price, uint256 timestamp)",
  "event NFTSold(uint256 indexed tokenId, address indexed buyer, address indexed seller, uint256 price, uint256 timestamp)",
  "event ListingCancelled(uint256 indexed tokenId, address indexed seller, uint256 timestamp)",
  "event PriceUpdated(uint256 indexed tokenId, uint256 oldPrice, uint256 newPrice, uint256 timestamp)",
  "event OfferMade(uint256 indexed tokenId, address indexed offeror, uint256 offerAmount, uint256 timestamp)",
  "event OfferAccepted(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 offerAmount, uint256 timestamp)",
  "event OfferRejected(uint256 indexed tokenId, address indexed seller, address indexed offeror, uint256 timestamp)",
  "event NFTFavorited(uint256 indexed tokenId, address indexed user, uint256 timestamp)",
  "event NFTShared(uint256 indexed tokenId, address indexed sharer, string platform, uint256 timestamp)",
];

// Get contract address and RPC URL from environment
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT!;
const RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL || "https://mainnet.base.org";
const APP_FID = 309857; // Base app FID

// Helper to get user FID from wallet address
// In production, maintain a mapping of wallet addresses to FIDs
async function getFIDFromAddress(address: string): Promise<number | null> {
  // TODO: Implement actual FID lookup
  // This could be:
  // 1. Database query of verified wallet-to-FID mappings
  // 2. Farcaster Hub API call
  // 3. Neynar API call
  console.log(`Looking up FID for address ${address}`);
  return null; // Return null if not found
}

// Format ETH amounts for display
function formatEth(wei: bigint): string {
  return ethers.formatEther(wei);
}

// Event handler for NFT minting
async function handleNFTMinted(
  tokenId: bigint,
  creator: string,
  metadataURI: string,
  timestamp: bigint,
  event: ethers.Log
) {
  console.log(`🎨 NFT Minted: Token #${tokenId} by ${creator}`);

  const creatorFid = await getFIDFromAddress(creator);
  if (!creatorFid) return;

  await sendMiniAppNotification({
    fid: creatorFid,
    appFid: APP_FID,
    title: "NFT Minted! 🎨",
    body: `Your NFT #${tokenId} has been successfully minted`,
    targetUrl: `https://farcastmints.com/marketplace/${tokenId}`,
  });
}

// Event handler for NFT listing
async function handleNFTListed(
  tokenId: bigint,
  seller: string,
  price: bigint,
  timestamp: bigint,
  event: ethers.Log
) {
  console.log(`📋 NFT Listed: Token #${tokenId} for ${formatEth(price)} ETH`);

  const sellerFid = await getFIDFromAddress(seller);
  if (!sellerFid) return;

  await sendMiniAppNotification({
    fid: sellerFid,
    appFid: APP_FID,
    title: "NFT Listed! 📋",
    body: `Your NFT #${tokenId} is now listed for ${formatEth(price)} ETH`,
    targetUrl: `https://farcastmints.com/marketplace/${tokenId}`,
  });

  // TODO: Notify followers/watchers of this collection
  // const watchers = await getCollectionWatchers(tokenId);
  // await notifyWatchers(watchers, tokenId, price);
}

// Event handler for NFT sale
async function handleNFTSold(
  tokenId: bigint,
  buyer: string,
  seller: string,
  price: bigint,
  timestamp: bigint,
  event: ethers.Log
) {
  console.log(`✅ NFT Sold: Token #${tokenId} for ${formatEth(price)} ETH`);

  const [buyerFid, sellerFid] = await Promise.all([
    getFIDFromAddress(buyer),
    getFIDFromAddress(seller),
  ]);

  // Notify buyer
  if (buyerFid) {
    await sendMiniAppNotification({
      fid: buyerFid,
      appFid: APP_FID,
      title: "Purchase Complete! ✨",
      body: `You now own NFT #${tokenId} for ${formatEth(price)} ETH`,
      targetUrl: `https://farcastmints.com/my-nfts`,
    });
  }

  // Notify seller
  if (sellerFid) {
    await sendMiniAppNotification({
      fid: sellerFid,
      appFid: APP_FID,
      title: "NFT Sold! 🎉",
      body: `Your NFT #${tokenId} sold for ${formatEth(price)} ETH`,
      targetUrl: `https://farcastmints.com/my-nfts`,
    });
  }
}

// Event handler for price updates
async function handlePriceUpdated(
  tokenId: bigint,
  oldPrice: bigint,
  newPrice: bigint,
  timestamp: bigint,
  event: ethers.Log
) {
  console.log(
    `💰 Price Updated: Token #${tokenId} from ${formatEth(oldPrice)} to ${formatEth(newPrice)} ETH`
  );

  // Only notify watchers if price dropped
  if (newPrice < oldPrice) {
    // TODO: Notify users watching this NFT
    // const watchers = await getNFTWatchers(tokenId);
    // await sendBatchNotifications({
    //   recipients: watchers,
    //   title: "Price Drop! 📉",
    //   body: `NFT #${tokenId} reduced to ${formatEth(newPrice)} ETH`,
    //   targetUrl: `https://farcastmints.com/marketplace/${tokenId}`,
    // });
  }
}

// Event handler for offers
async function handleOfferMade(
  tokenId: bigint,
  offeror: string,
  offerAmount: bigint,
  timestamp: bigint,
  event: ethers.Log
) {
  console.log(`💎 Offer Made: ${formatEth(offerAmount)} ETH on Token #${tokenId}`);

  // Get NFT owner from contract
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, MARKETPLACE_ABI, provider);
  
  try {
    const owner = await contract.ownerOf(tokenId);
    const ownerFid = await getFIDFromAddress(owner);

    if (ownerFid) {
      await sendMiniAppNotification({
        fid: ownerFid,
        appFid: APP_FID,
        title: "New Offer! 💰",
        body: `Someone offered ${formatEth(offerAmount)} ETH for NFT #${tokenId}`,
        targetUrl: `https://farcastmints.com/my-nfts/${tokenId}/offers`,
      });
    }
  } catch (error) {
    console.error("Error fetching NFT owner:", error);
  }
}

// Event handler for offer acceptance
async function handleOfferAccepted(
  tokenId: bigint,
  seller: string,
  buyer: string,
  offerAmount: bigint,
  timestamp: bigint,
  event: ethers.Log
) {
  console.log(`✅ Offer Accepted: Token #${tokenId} for ${formatEth(offerAmount)} ETH`);

  const [buyerFid, sellerFid] = await Promise.all([
    getFIDFromAddress(buyer),
    getFIDFromAddress(seller),
  ]);

  // Notify buyer (offeror)
  if (buyerFid) {
    await sendMiniAppNotification({
      fid: buyerFid,
      appFid: APP_FID,
      title: "Offer Accepted! ✅",
      body: `Your offer of ${formatEth(offerAmount)} ETH for NFT #${tokenId} was accepted`,
      targetUrl: `https://farcastmints.com/my-nfts`,
    });
  }

  // Notify seller
  if (sellerFid) {
    await sendMiniAppNotification({
      fid: sellerFid,
      appFid: APP_FID,
      title: "Offer Accepted! 💫",
      body: `You accepted an offer of ${formatEth(offerAmount)} ETH for NFT #${tokenId}`,
      targetUrl: `https://farcastmints.com/my-nfts`,
    });
  }
}

// Event handler for favorites
async function handleNFTFavorited(
  tokenId: bigint,
  user: string,
  timestamp: bigint,
  event: ethers.Log
) {
  console.log(`❤️ NFT Favorited: Token #${tokenId} by ${user}`);

  // Get NFT owner
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, MARKETPLACE_ABI, provider);
  
  try {
    const owner = await contract.ownerOf(tokenId);
    const ownerFid = await getFIDFromAddress(owner);
    const userFid = await getFIDFromAddress(user);

    // Don't notify if user favorited their own NFT
    if (ownerFid && userFid && ownerFid !== userFid) {
      await sendMiniAppNotification({
        fid: ownerFid,
        appFid: APP_FID,
        title: "NFT Liked! ❤️",
        body: `Someone favorited your NFT #${tokenId}`,
        targetUrl: `https://farcastmints.com/marketplace/${tokenId}`,
      });
    }
  } catch (error) {
    console.error("Error fetching NFT owner:", error);
  }
}

// Event handler for shares
async function handleNFTShared(
  tokenId: bigint,
  sharer: string,
  platform: string,
  timestamp: bigint,
  event: ethers.Log
) {
  console.log(`🔗 NFT Shared: Token #${tokenId} on ${platform}`);

  // Get NFT owner
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, MARKETPLACE_ABI, provider);
  
  try {
    const owner = await contract.ownerOf(tokenId);
    const ownerFid = await getFIDFromAddress(owner);
    const sharerFid = await getFIDFromAddress(sharer);

    // Don't notify if owner shared their own NFT
    if (ownerFid && sharerFid && ownerFid !== sharerFid) {
      await sendMiniAppNotification({
        fid: ownerFid,
        appFid: APP_FID,
        title: "NFT Shared! 🔗",
        body: `Your NFT #${tokenId} was shared on ${platform}`,
        targetUrl: `https://farcastmints.com/marketplace/${tokenId}`,
      });
    }
  } catch (error) {
    console.error("Error fetching NFT owner:", error);
  }
}

// Start event listener
export async function startEventListener() {
  if (!CONTRACT_ADDRESS) {
    console.error("❌ NEXT_PUBLIC_MARKETPLACE_CONTRACT not set");
    return;
  }

  console.log("🎧 Starting event listener for contract:", CONTRACT_ADDRESS);
  console.log("🌐 RPC URL:", RPC_URL);

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, MARKETPLACE_ABI, provider);

  // Listen to all events
  contract.on("NFTMinted", handleNFTMinted);
  contract.on("NFTListed", handleNFTListed);
  contract.on("NFTSold", handleNFTSold);
  contract.on("PriceUpdated", handlePriceUpdated);
  contract.on("OfferMade", handleOfferMade);
  contract.on("OfferAccepted", handleOfferAccepted);
  contract.on("NFTFavorited", handleNFTFavorited);
  contract.on("NFTShared", handleNFTShared);

  console.log("✅ Event listener started successfully");

  // Handle errors
  contract.on("error", (error) => {
    console.error("❌ Contract event error:", error);
  });

  provider.on("error", (error) => {
    console.error("❌ Provider error:", error);
  });
}

// Stop event listener
export async function stopEventListener() {
  console.log("🛑 Stopping event listener");
  // Implementation depends on how you manage the listener lifecycle
}

// Query past events (useful for backfilling notifications)
export async function queryPastEvents(fromBlock: number, toBlock: number | "latest" = "latest") {
  if (!CONTRACT_ADDRESS) {
    console.error("❌ NEXT_PUBLIC_MARKETPLACE_CONTRACT not set");
    return;
  }

  console.log(`📜 Querying past events from block ${fromBlock} to ${toBlock}`);

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, MARKETPLACE_ABI, provider);

  try {
    // Query each event type
    const nftMintedEvents = await contract.queryFilter(
      contract.filters.NFTMinted(),
      fromBlock,
      toBlock
    );

    const nftListedEvents = await contract.queryFilter(
      contract.filters.NFTListed(),
      fromBlock,
      toBlock
    );

    const nftSoldEvents = await contract.queryFilter(
      contract.filters.NFTSold(),
      fromBlock,
      toBlock
    );

    console.log(`Found ${nftMintedEvents.length} mint events`);
    console.log(`Found ${nftListedEvents.length} listing events`);
    console.log(`Found ${nftSoldEvents.length} sale events`);

    return {
      minted: nftMintedEvents,
      listed: nftListedEvents,
      sold: nftSoldEvents,
    };
  } catch (error) {
    console.error("Error querying past events:", error);
    return null;
  }
}
