/**
 * Transaction Metadata for Custom Transaction Trays
 * Provides agent branding and information for wallet send calls
 */

export interface TransactionMetadata {
  description: string;
  hostname: string;
  faviconUrl: string;
  title: string;
}

/**
 * Get transaction metadata for the FarcastMints NFT Marketplace
 */
export function getTransactionMetadata(description: string): TransactionMetadata {
  return {
    description,
    hostname: "farcastmints.com",
    faviconUrl: "https://farcastmints.com/favicon.svg",
    title: "FarcastMints NFT Marketplace"
  };
}

/**
 * Create wallet send calls data with custom transaction tray metadata
 */
export function createWalletSendCallsData(
  from: `0x${string}`,
  chainId: string,
  calls: Array<{
    to: `0x${string}`;
    data?: `0x${string}`;
    value?: string;
  }>,
  description: string
) {
  return {
    version: "1.0" as const,
    from,
    chainId,
    calls,
    metadata: getTransactionMetadata(description)
  };
}

/**
 * Transaction metadata for common NFT marketplace actions
 */
export const TRANSACTION_DESCRIPTIONS = {
  buyNFT: (nftName: string, price: string) => 
    `Purchase ${nftName} for ${price} ETH`,
  
  listNFT: (nftName: string, price: string) => 
    `List ${nftName} for sale at ${price} ETH`,
  
  cancelListing: (nftName: string) => 
    `Cancel listing for ${nftName}`,
  
  makeOffer: (nftName: string, price: string) => 
    `Make offer on ${nftName} for ${price} ETH`,
  
  acceptOffer: (nftName: string) => 
    `Accept offer on ${nftName}`,
  
  transferNFT: (nftName: string, to: string) => 
    `Transfer ${nftName} to ${to.slice(0, 6)}...${to.slice(-4)}`,
  
  mintNFT: (nftName: string) => 
    `Mint ${nftName}`,
  
  approveMarketplace: () => 
    `Approve FarcasterSea marketplace to manage your NFTs`,
};
