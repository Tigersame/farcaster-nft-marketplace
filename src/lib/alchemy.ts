import { Alchemy, Network } from 'alchemy-sdk';

// Configure Alchemy
const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(config);

export interface LiveNFTData {
  tokenId: string;
  contract: {
    address: string;
    name: string;
    symbol: string;
    totalSupply?: string;
  };
  tokenType: string;
  title: string;
  description?: string;
  timeLastUpdated: string;
  rawMetadata?: any;
  tokenUri?: string;
  media?: any[];
  balance?: string;
  acquiredAt?: any;
  // Additional fields for display
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface CollectionMetadata {
  address: string;
  name: string;
  symbol: string;
  totalSupply?: string;
  tokenType: string;
  contractDeployer?: string;
  deployedBlockNumber?: number;
  openSea?: {
    floorPrice?: number;
    collectionName?: string;
    safelistRequestStatus?: string;
    imageUrl?: string;
    description?: string;
    externalUrl?: string;
    twitterUsername?: string;
    discordUrl?: string;
    lastIngestedAt?: string;
  };
}

export interface NFTSaleData {
  marketplace: string;
  contractAddress: string;
  tokenId: string;
  quantity: string;
  buyerAddress: string;
  sellerAddress: string;
  taker: string;
  sellerFee: {
    amount: string;
    tokenAddress: string;
    symbol: string;
    decimals: number;
  };
  protocolFee: {
    amount: string;
    tokenAddress: string;
    symbol: string;
    decimals: number;
  };
  royaltyFee: {
    amount: string;
    tokenAddress: string;
    symbol: string;
    decimals: number;
  };
  blockNumber: number;
  logIndex: number;
  bundleIndex: number;
  transactionHash: string;
}

export class AlchemyNFTService {
  private alchemy: Alchemy;

  constructor() {
    this.alchemy = alchemy;
  }

  /**
   * Extract image URL from NFT data
   */
  private extractImageFromNFT(nft: any): string {
    // Try media first
    if (nft.media && Array.isArray(nft.media) && nft.media.length > 0) {
      return nft.media[0].gateway || nft.media[0].raw || nft.media[0];
    }
    
    // Try raw metadata
    if (nft.rawMetadata?.image) {
      return nft.rawMetadata.image;
    }
    
    // Fallback to contract name
    const name = nft.title || nft.contract?.name || 'NFT';
    return `https://via.placeholder.com/400x400/000000/FFFFFF?text=${encodeURIComponent(name)}`;
  }

  /**
   * Extract attributes from NFT data
   */
  private extractAttributesFromNFT(nft: any): Array<{ trait_type: string; value: string | number }> {
    if (!nft.rawMetadata?.attributes || !Array.isArray(nft.rawMetadata.attributes)) {
      return [];
    }
    
    return nft.rawMetadata.attributes.map((attr: any) => ({
      trait_type: attr.trait_type || attr.name || 'Property',
      value: attr.value || attr.value || 'N/A',
    }));
  }

  /**
   * Get NFTs owned by a specific address
   */
  async getNFTsForOwner(owner: string, pageSize: number = 100): Promise<LiveNFTData[]> {
    try {
      const response = await this.alchemy.nft.getNftsForOwner(owner, {
        pageSize,
        excludeFilters: [],
      });

      return response.ownedNfts.map(nft => ({
        tokenId: nft.tokenId,
        contract: {
          address: nft.contract.address,
          name: nft.contract.name || 'Unknown',
          symbol: nft.contract.symbol || '',
          totalSupply: nft.contract.totalSupply,
        },
        tokenType: nft.tokenType,
        title: (nft as any).title || nft.contract.name || 'Untitled',
        description: nft.description,
        timeLastUpdated: nft.timeLastUpdated,
        rawMetadata: (nft as any).rawMetadata,
        tokenUri: nft.tokenUri,
        media: (nft as any).media,
        balance: nft.balance,
        acquiredAt: (nft as any).acquiredAt,
        image: this.extractImageFromNFT(nft as any),
        attributes: this.extractAttributesFromNFT(nft as any),
      }));
    } catch (error) {
      console.error('Error fetching NFTs for owner:', error);
      throw new Error(`Failed to fetch NFTs for owner: ${error}`);
    }
  }

  /**
   * Get NFT metadata by contract address and token ID
   */
  async getNFTMetadata(contractAddress: string, tokenId: string): Promise<LiveNFTData | null> {
    try {
      const nft = await this.alchemy.nft.getNftMetadata(contractAddress, tokenId);
      
      return {
        tokenId: nft.tokenId,
        contract: {
          address: nft.contract.address,
          name: nft.contract.name || 'Unknown',
          symbol: nft.contract.symbol || '',
          totalSupply: nft.contract.totalSupply,
        },
        tokenType: nft.tokenType,
        title: (nft as any).title || nft.contract.name || 'Untitled',
        description: nft.description,
        timeLastUpdated: nft.timeLastUpdated,
        rawMetadata: (nft as any).rawMetadata,
        tokenUri: nft.tokenUri,
        media: (nft as any).media,
        image: this.extractImageFromNFT(nft as any),
        attributes: this.extractAttributesFromNFT(nft as any),
      };
    } catch (error) {
      console.error('Error fetching NFT metadata:', error);
      return null;
    }
  }

  /**
   * Get collection metadata
   */
  async getCollectionMetadata(contractAddress: string): Promise<CollectionMetadata | null> {
    try {
      const metadata = await this.alchemy.nft.getContractMetadata(contractAddress);
      
      return {
        address: metadata.address,
        name: metadata.name || 'Unknown Collection',
        symbol: metadata.symbol || '',
        totalSupply: metadata.totalSupply,
        tokenType: metadata.tokenType,
        contractDeployer: metadata.contractDeployer,
        deployedBlockNumber: metadata.deployedBlockNumber,
        openSea: (metadata as any).openSea,
      };
    } catch (error) {
      console.error('Error fetching collection metadata:', error);
      return null;
    }
  }

  /**
   * Get trending NFT collections
   */
  async getTrendingCollections(): Promise<CollectionMetadata[]> {
    try {
      // Popular NFT collection addresses
      const popularCollections = [
        '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', // Bored Ape Yacht Club
        '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb', // CryptoPunks
        '0x8a90cab2b38dba80c64b7734e58ee1db38b8992e', // Doodles
        '0x23581767a106ae21c074b2276d25e5c3e136a68b', // Moonbirds
        '0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b', // CloneX
        '0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258', // Otherdeeds for Otherland
        '0xa3aee8bce55beea1951ef834b99f3ac60d1abeeb', // VeeFriends
        '0xed5af388653567af2f388e6224dc7c4b3241c544', // Azuki
      ];

      const collections = await Promise.all(
        popularCollections.map(address => this.getCollectionMetadata(address))
      );

      return collections.filter(Boolean) as CollectionMetadata[];
    } catch (error) {
      console.error('Error fetching trending collections:', error);
      return [];
    }
  }

  /**
   * Get recent NFT sales data
   */
  async getRecentSales(contractAddress?: string, limit: number = 50): Promise<NFTSaleData[]> {
    try {
      // Note: This would require Alchemy's enhanced API plan for real sales data
      // For now, we'll return mock data structure
      console.warn('Real sales data requires Alchemy Enhanced API plan');
      return [];
    } catch (error) {
      console.error('Error fetching recent sales:', error);
      return [];
    }
  }

  /**
   * Search NFTs by collection name or address
   */
  async searchNFTs(query: string, limit: number = 20): Promise<LiveNFTData[]> {
    try {
      // First try to get collection metadata if query looks like an address
      const isAddress = /^0x[a-fA-F0-9]{40}$/.test(query);
      
      if (isAddress) {
        const collection = await this.getCollectionMetadata(query);
        if (collection) {
          // Get some NFTs from this collection
          const response = await this.alchemy.nft.getNftsForContract(query, {
            pageSize: limit,
          });
          
          return response.nfts.map(nft => ({
            tokenId: nft.tokenId,
            contract: {
              address: nft.contract.address,
              name: nft.contract.name || collection.name,
              symbol: nft.contract.symbol || collection.symbol,
              totalSupply: nft.contract.totalSupply,
            },
            tokenType: nft.tokenType,
            title: (nft as any).title || `${collection.name} #${nft.tokenId}`,
            description: nft.description,
            timeLastUpdated: nft.timeLastUpdated,
            rawMetadata: (nft as any).rawMetadata,
            tokenUri: nft.tokenUri,
            media: (nft as any).media,
            image: this.extractImageFromNFT(nft as any),
            attributes: this.extractAttributesFromNFT(nft as any),
          }));
        }
      }

      return [];
    } catch (error) {
      console.error('Error searching NFTs:', error);
      return [];
    }
  }

  /**
   * Get NFT floor prices (mock implementation)
   */
  async getFloorPrices(contractAddresses: string[]): Promise<Record<string, number>> {
    try {
      // This would require integration with OpenSea API or similar
      // For now, return mock data
      const floorPrices: Record<string, number> = {};
      
      contractAddresses.forEach(address => {
        // Mock floor prices
        floorPrices[address] = Math.random() * 10 + 0.1; // Random price between 0.1 and 10 ETH
      });

      return floorPrices;
    } catch (error) {
      console.error('Error fetching floor prices:', error);
      return {};
    }
  }
}

// Export singleton instance
export const alchemyService = new AlchemyNFTService();

// Export utility functions
export const formatTokenId = (tokenId: string): string => {
  const id = parseInt(tokenId, 16).toString();
  return id.length > 6 ? `${id.slice(0, 6)}...` : id;
};

export const getImageUrl = (nft: LiveNFTData): string => {
  // Priority: media gateway > raw metadata image > direct image field
  if (nft.image) {
    return nft.image;
  }

  if (nft.media && nft.media.length > 0) {
    const media = nft.media[0];
    if (typeof media === 'object' && media.gateway) {
      return media.gateway;
    }
    if (typeof media === 'string') {
      return media;
    }
  }
  
  if (nft.rawMetadata?.image) {
    return nft.rawMetadata.image;
  }
  
  if (typeof nft.tokenUri === 'string') {
    return nft.tokenUri;
  }
  
  // Fallback placeholder
  return `https://via.placeholder.com/400x400/000000/FFFFFF?text=${encodeURIComponent(nft.title || 'NFT')}`;
};

export const formatAttributes = (nft: LiveNFTData): Array<{ trait_type: string; value: string }> => {
  if (nft.attributes) {
    return nft.attributes.map(attr => ({
      trait_type: attr.trait_type,
      value: attr.value.toString(),
    }));
  }

  if (!nft.rawMetadata?.attributes || !Array.isArray(nft.rawMetadata.attributes)) {
    return [];
  }
  
  return nft.rawMetadata.attributes.map((attr: any) => ({
    trait_type: attr.trait_type || 'Property',
    value: attr.value ? attr.value.toString() : 'N/A',
  }));
};