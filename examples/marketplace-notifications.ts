// Example: Integrating notifications into marketplace actions
// Add these snippets to your existing marketplace code

import { sendMiniAppNotification } from "@/lib/sendNotification";

// ============================================================================
// 1. NFT LISTING NOTIFICATIONS
// ============================================================================

// When a user lists an NFT for sale
async function onNFTListed(nft: NFT, seller: User) {
  // Notify the seller
  await sendMiniAppNotification({
    fid: seller.fid,
    appFid: 309857, // Base app
    title: "NFT Listed! 🎨",
    body: `${nft.name} is now live on the marketplace`,
    targetUrl: `https://farcastmints.com/marketplace/${nft.tokenId}`,
  });

  // Notify followers/watchers
  const watchers = await getUsersWatchingCollection(nft.collectionId);
  for (const watcher of watchers) {
    await sendMiniAppNotification({
      fid: watcher.fid,
      appFid: 309857,
      title: "New Listing! 🆕",
      body: `${nft.name} just listed in ${nft.collectionName}`,
      targetUrl: `https://farcastmints.com/marketplace/${nft.tokenId}`,
    });
  }
}

// ============================================================================
// 2. NFT PURCHASE NOTIFICATIONS
// ============================================================================

// When an NFT is purchased
async function onNFTPurchased(nft: NFT, buyer: User, seller: User, price: string) {
  // Notify the buyer
  await sendMiniAppNotification({
    fid: buyer.fid,
    appFid: 309857,
    title: "Purchase Complete! ✨",
    body: `You now own ${nft.name}`,
    targetUrl: `https://farcastmints.com/my-nfts`,
  });

  // Notify the seller
  await sendMiniAppNotification({
    fid: seller.fid,
    appFid: 309857,
    title: "NFT Sold! 🎉",
    body: `${nft.name} sold for ${price} ETH`,
    targetUrl: `https://farcastmints.com/my-nfts`,
  });
}

// ============================================================================
// 3. OFFER NOTIFICATIONS
// ============================================================================

// When someone makes an offer on an NFT
async function onOfferMade(nft: NFT, offeror: User, owner: User, offerAmount: string) {
  await sendMiniAppNotification({
    fid: owner.fid,
    appFid: 309857,
    title: "New Offer! 💰",
    body: `${offeror.name} offered ${offerAmount} ETH for ${nft.name}`,
    targetUrl: `https://farcastmints.com/my-nfts/${nft.tokenId}/offers`,
  });
}

// When offer is accepted
async function onOfferAccepted(nft: NFT, offeror: User, owner: User) {
  // Notify offeror
  await sendMiniAppNotification({
    fid: offeror.fid,
    appFid: 309857,
    title: "Offer Accepted! ✅",
    body: `Your offer for ${nft.name} was accepted`,
    targetUrl: `https://farcastmints.com/my-nfts`,
  });

  // Notify owner
  await sendMiniAppNotification({
    fid: owner.fid,
    appFid: 309857,
    title: "Offer Accepted! 💫",
    body: `You accepted the offer for ${nft.name}`,
    targetUrl: `https://farcastmints.com/my-nfts`,
  });
}

// ============================================================================
// 4. PRICE DROP NOTIFICATIONS
// ============================================================================

// When NFT price is reduced
async function onPriceReduced(nft: NFT, oldPrice: string, newPrice: string) {
  const watchers = await getUsersWatchingNFT(nft.tokenId);
  
  for (const watcher of watchers) {
    await sendMiniAppNotification({
      fid: watcher.fid,
      appFid: 309857,
      title: "Price Drop! 📉",
      body: `${nft.name} reduced to ${newPrice} ETH (was ${oldPrice} ETH)`,
      targetUrl: `https://farcastmints.com/marketplace/${nft.tokenId}`,
    });
  }
}

// ============================================================================
// 5. COLLECTION DROP NOTIFICATIONS
// ============================================================================

// When new collection launches
async function onCollectionLaunched(collection: Collection) {
  const subscribers = await getAllNotificationSubscribers();
  
  // Send batch notification to all subscribers
  await sendBatchNotifications({
    recipients: subscribers.map(user => ({
      fid: user.fid,
      appFid: 309857,
    })),
    title: "New Collection Drop! 🔥",
    body: `${collection.name} - ${collection.itemCount} items now available`,
    targetUrl: `https://farcastmints.com/collections/${collection.id}`,
  });
}

// ============================================================================
// 6. AUCTION NOTIFICATIONS
// ============================================================================

// When auction ends soon
async function onAuctionEndingSoon(nft: NFT, timeLeft: string) {
  const bidders = await getAuctionBidders(nft.tokenId);
  
  for (const bidder of bidders) {
    await sendMiniAppNotification({
      fid: bidder.fid,
      appFid: 309857,
      title: "Auction Ending Soon! ⏰",
      body: `${nft.name} auction ends in ${timeLeft}`,
      targetUrl: `https://farcastmints.com/marketplace/${nft.tokenId}`,
    });
  }
}

// When auction won
async function onAuctionWon(nft: NFT, winner: User, finalBid: string) {
  await sendMiniAppNotification({
    fid: winner.fid,
    appFid: 309857,
    title: "Auction Won! 🏆",
    body: `You won ${nft.name} with a bid of ${finalBid} ETH`,
    targetUrl: `https://farcastmints.com/my-nfts`,
  });
}

// When outbid
async function onOutbid(nft: NFT, previousBidder: User, newBid: string) {
  await sendMiniAppNotification({
    fid: previousBidder.fid,
    appFid: 309857,
    title: "Outbid! 🔔",
    body: `Someone bid ${newBid} ETH on ${nft.name}`,
    targetUrl: `https://farcastmints.com/marketplace/${nft.tokenId}`,
  });
}

// ============================================================================
// 7. SOCIAL ACTIVITY NOTIFICATIONS
// ============================================================================

// When someone follows you
async function onNewFollower(user: User, follower: User) {
  await sendMiniAppNotification({
    fid: user.fid,
    appFid: 309857,
    title: "New Follower! 👥",
    body: `${follower.name} started following you`,
    targetUrl: `https://farcastmints.com/profile/${user.id}`,
  });
}

// When your NFT gets liked
async function onNFTLiked(nft: NFT, owner: User, liker: User) {
  await sendMiniAppNotification({
    fid: owner.fid,
    appFid: 309857,
    title: "NFT Liked! ❤️",
    body: `${liker.name} liked ${nft.name}`,
    targetUrl: `https://farcastmints.com/marketplace/${nft.tokenId}`,
  });
}

// ============================================================================
// 8. SCHEDULED NOTIFICATIONS
// ============================================================================

// Daily digest (run via cron job)
async function sendDailyDigest(user: User) {
  const activity = await getUserDailyActivity(user.fid);
  
  if (activity.hasActivity) {
    await sendMiniAppNotification({
      fid: user.fid,
      appFid: 309857,
      title: "Your Daily NFT Digest 📊",
      body: `${activity.newListings} new listings, ${activity.sales} sales in your collections`,
      targetUrl: "https://farcastmints.com/activity",
    });
  }
}

// Weekly summary
async function sendWeeklySummary(user: User) {
  const summary = await getUserWeeklySummary(user.fid);
  
  await sendMiniAppNotification({
    fid: user.fid,
    appFid: 309857,
    title: "Weekly NFT Summary 📈",
    body: `You made ${summary.sales} sales worth ${summary.totalValue} ETH`,
    targetUrl: "https://farcastmints.com/analytics",
  });
}

// ============================================================================
// 9. ERROR RECOVERY & RATE LIMITING
// ============================================================================

// Notification with retry logic
async function sendNotificationWithRetry(
  fid: number,
  appFid: number,
  title: string,
  body: string,
  maxRetries = 3
) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await sendMiniAppNotification({
      fid,
      appFid,
      title,
      body,
    });

    if (result.state === "success") {
      return true;
    }

    if (result.state === "no_token") {
      console.log(`No notification token for FID ${fid}`);
      return false;
    }

    if (result.state === "rate_limit") {
      console.log(`Rate limited for FID ${fid}, retrying in ${attempt * 5}s...`);
      await new Promise(resolve => setTimeout(resolve, attempt * 5000));
      continue;
    }

    if (result.state === "error") {
      console.error(`Notification error for FID ${fid}:`, result.error);
      if (attempt === maxRetries) {
        return false;
      }
      await new Promise(resolve => setTimeout(resolve, attempt * 2000));
    }
  }

  return false;
}

// ============================================================================
// 10. NOTIFICATION PREFERENCES
// ============================================================================

// Check if user wants specific notification type
async function shouldSendNotification(
  fid: number,
  notificationType: string
): Promise<boolean> {
  // Check user preferences (implement based on your preference storage)
  const preferences = await getUserNotificationPreferences(fid);
  return preferences?.[notificationType] ?? true; // Default to enabled
}

// Send notification respecting preferences
async function sendSmartNotification(
  fid: number,
  notificationType: string,
  title: string,
  body: string
) {
  const shouldSend = await shouldSendNotification(fid, notificationType);
  
  if (shouldSend) {
    return sendMiniAppNotification({
      fid,
      appFid: 309857,
      title,
      body,
    });
  } else {
    console.log(`Notification ${notificationType} disabled for FID ${fid}`);
    return { state: "skipped" as const };
  }
}

// ============================================================================
// HELPER FUNCTIONS (implement based on your database schema)
// ============================================================================

async function getUsersWatchingCollection(collectionId: string): Promise<User[]> {
  // Query your database for users watching this collection
  return [];
}

async function getUsersWatchingNFT(tokenId: string): Promise<User[]> {
  // Query your database for users watching this NFT
  return [];
}

async function getAllNotificationSubscribers(): Promise<User[]> {
  // Get all users who have enabled notifications
  return [];
}

async function getAuctionBidders(tokenId: string): Promise<User[]> {
  // Get all users who bid on this auction
  return [];
}

async function getUserDailyActivity(fid: number) {
  // Aggregate daily activity for user
  return { hasActivity: false, newListings: 0, sales: 0 };
}

async function getUserWeeklySummary(fid: number) {
  // Aggregate weekly summary for user
  return { sales: 0, totalValue: "0" };
}

async function getUserNotificationPreferences(fid: number) {
  // Get user's notification preferences
  return {};
}

// Types
interface NFT {
  tokenId: string;
  name: string;
  collectionId?: string;
  collectionName?: string;
}

interface User {
  fid: number;
  id: string;
  name: string;
}

interface Collection {
  id: string;
  name: string;
  itemCount: number;
}
