// Contract ABI will be generated after compilation
// This file exports the marketplace contract ABI and address

export const MARKETPLACE_ABI = [
  // Read functions
  "function totalSupply() view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function listings(uint256 tokenId) view returns (tuple(uint256 tokenId, address seller, uint256 price, bool isActive, uint256 listedAt))",
  "function nftMetadata(uint256 tokenId) view returns (tuple(address creator, uint256 royaltyPercentage, string metadataURI, uint256 mintedAt))",
  "function getActiveListings() view returns (tuple(uint256 tokenId, address seller, uint256 price, bool isActive, uint256 listedAt)[])",
  "function getNFTMetadata(uint256 tokenId) view returns (tuple(address creator, uint256 royaltyPercentage, string metadataURI, uint256 mintedAt))",
  "function getMarketplaceStats() view returns (uint256 totalNFTs, uint256 totalSold, uint256 activeListings)",
  "function pendingWithdrawals(address) view returns (uint256)",
  "function platformFee() view returns (uint256)",
  
  // Write functions
  "function mintNFT(string metadataURI, uint256 royaltyPercentage) returns (uint256)",
  "function listNFT(uint256 tokenId, uint256 price)",
  "function buyNFT(uint256 tokenId) payable",
  "function cancelListing(uint256 tokenId)",
  "function updatePrice(uint256 tokenId, uint256 newPrice)",
  "function withdraw()",
  
  // Events
  "event NFTMinted(uint256 indexed tokenId, address indexed creator, string metadataURI)",
  "event NFTListed(uint256 indexed tokenId, address indexed seller, uint256 price)",
  "event NFTSold(uint256 indexed tokenId, address indexed buyer, address indexed seller, uint256 price)",
  "event ListingCancelled(uint256 indexed tokenId, address indexed seller)",
  "event PriceUpdated(uint256 indexed tokenId, uint256 oldPrice, uint256 newPrice)",
] as const;

// Contract address - update after deployment
export const MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT || "0x0000000000000000000000000000000000000000";

// Network configuration
export const MARKETPLACE_NETWORK = process.env.NEXT_PUBLIC_NETWORK || "base";

export const SUPPORTED_NETWORKS = {
  base: {
    chainId: 8453,
    name: "Base",
    rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL || `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || ''}` || 'https://mainnet.base.org',
    blockExplorer: "https://basescan.org",
  },
  baseSepolia: {
    chainId: 84532,
    name: "Base Sepolia",
    rpcUrl: "https://sepolia.base.org",
    blockExplorer: "https://sepolia.basescan.org",
  },
} as const;
