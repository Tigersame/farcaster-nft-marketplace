"use client";

import { sdk } from "@farcaster/miniapp-sdk";
import { useState } from "react";

interface ShareNFTOptions {
  tokenId: string;
  name: string;
  price?: string;
  imageUrl?: string;
  action?: "minted" | "listed" | "sold" | "offer";
}

export function useNFTSharing() {
  const [isSharing, setIsSharing] = useState(false);

  /**
   * Share NFT to Farcaster feed
   */
  const shareToFarcaster = async ({
    tokenId,
    name,
    price,
    imageUrl,
    action = "listed",
  }: ShareNFTOptions) => {
    setIsSharing(true);

    try {
      // Create share text based on action
      let shareText = "";
      switch (action) {
        case "minted":
          shareText = `Just minted "${name}" on Farcast Mints! 🎨\n\nCheck it out:`;
          break;
        case "listed":
          shareText = `"${name}" is now listed for ${price} ETH on Farcast Mints! 💎\n\nBuy now:`;
          break;
        case "sold":
          shareText = `"${name}" just sold for ${price} ETH! 🎉\n\nView on:`;
          break;
        case "offer":
          shareText = `Made an offer on "${name}"! 💰\n\nPlace your offer:`;
          break;
      }

      const shareUrl = `https://farcastmints.com/marketplace/${tokenId}`;

      // Compose cast with embedded link
      // Note: This uses hypothetical Farcaster composer API
      // Actual implementation may vary based on available SDK methods
      const result = await sdk.actions.openUrl(
        `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(shareUrl)}`
      );

      // Log share event to smart contract
      await logShareEvent(tokenId, "farcaster");

      return { success: true, result };
    } catch (error) {
      console.error("Error sharing to Farcaster:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    } finally {
      setIsSharing(false);
    }
  };

  /**
   * Share NFT to Twitter/X
   */
  const shareToTwitter = async ({
    tokenId,
    name,
    price,
    action = "listed",
  }: ShareNFTOptions) => {
    setIsSharing(true);

    try {
      let shareText = "";
      switch (action) {
        case "minted":
          shareText = `Just minted "${name}" on @FarcastMints! 🎨`;
          break;
        case "listed":
          shareText = `"${name}" is now listed for ${price} ETH on @FarcastMints! 💎`;
          break;
        case "sold":
          shareText = `"${name}" just sold for ${price} ETH on @FarcastMints! 🎉`;
          break;
        case "offer":
          shareText = `Made an offer on "${name}" on @FarcastMints! 💰`;
          break;
      }

      const shareUrl = `https://farcastmints.com/marketplace/${tokenId}`;
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

      window.open(twitterUrl, "_blank", "width=550,height=420");

      // Log share event
      await logShareEvent(tokenId, "twitter");

      return { success: true };
    } catch (error) {
      console.error("Error sharing to Twitter:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    } finally {
      setIsSharing(false);
    }
  };

  /**
   * Copy share link to clipboard
   */
  const copyShareLink = async (tokenId: string) => {
    try {
      const shareUrl = `https://farcastmints.com/marketplace/${tokenId}`;
      await navigator.clipboard.writeText(shareUrl);

      // Log share event
      await logShareEvent(tokenId, "link");

      return { success: true };
    } catch (error) {
      console.error("Error copying link:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  /**
   * Log share event to smart contract (calls shareNFT function)
   */
  const logShareEvent = async (tokenId: string, platform: string) => {
    try {
      // This would call the smart contract's shareNFT function
      // Implementation depends on your contract interaction setup
      console.log(`Logging share event: NFT ${tokenId} on ${platform}`);
      
      // Example API call to log share
      await fetch("/api/nft/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId, platform }),
      });
    } catch (error) {
      console.error("Error logging share event:", error);
    }
  };

  return {
    shareToFarcaster,
    shareToTwitter,
    copyShareLink,
    isSharing,
  };
}

/**
 * Share button component
 */
export function NFTShareButton({
  tokenId,
  name,
  price,
  imageUrl,
  action = "listed",
  className = "",
}: ShareNFTOptions & { className?: string }) {
  const { shareToFarcaster, shareToTwitter, copyShareLink, isSharing } = useNFTSharing();
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const result = await copyShareLink(tokenId);
    if (result.success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isSharing}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg
          bg-gray-100 dark:bg-gray-800
          hover:bg-gray-200 dark:hover:bg-gray-700
          text-gray-700 dark:text-gray-300
          transition-colors duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        <span>Share</span>
      </button>

      {showMenu && (
        <div className="
          absolute top-full mt-2 right-0
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          rounded-lg shadow-lg
          min-w-[200px]
          z-50
        ">
          <button
            onClick={async () => {
              await shareToFarcaster({ tokenId, name, price, imageUrl, action });
              setShowMenu(false);
            }}
            className="
              w-full px-4 py-3 text-left
              hover:bg-gray-50 dark:hover:bg-gray-700
              flex items-center gap-3
              first:rounded-t-lg
              transition-colors duration-200
            "
          >
            <span className="text-xl">🟣</span>
            <span className="text-gray-700 dark:text-gray-300">Share to Farcaster</span>
          </button>

          <button
            onClick={async () => {
              await shareToTwitter({ tokenId, name, price, action });
              setShowMenu(false);
            }}
            className="
              w-full px-4 py-3 text-left
              hover:bg-gray-50 dark:hover:bg-gray-700
              flex items-center gap-3
              border-t border-gray-100 dark:border-gray-700
              transition-colors duration-200
            "
          >
            <span className="text-xl">🐦</span>
            <span className="text-gray-700 dark:text-gray-300">Share to Twitter</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="
              w-full px-4 py-3 text-left
              hover:bg-gray-50 dark:hover:bg-gray-700
              flex items-center gap-3
              border-t border-gray-100 dark:border-gray-700
              last:rounded-b-lg
              transition-colors duration-200
            "
          >
            <span className="text-xl">🔗</span>
            <span className="text-gray-700 dark:text-gray-300">
              {copied ? "Copied!" : "Copy Link"}
            </span>
          </button>
        </div>
      )}

      {/* Backdrop to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}
