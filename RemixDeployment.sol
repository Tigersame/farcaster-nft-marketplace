// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarcasterNFTMarketplace
 * @dev Complete NFT marketplace with minting, listing, buying, and royalties
 * Optimized for Base Network and Farcaster integration
 */
contract FarcasterNFTMarketplace is ERC721URIStorage, ReentrancyGuard, Ownable {
    
    uint256 private _nextTokenId = 1;
    uint256 private _itemsSold = 0;
    
    // Platform fee (2.5% = 250 basis points)
    uint256 public platformFeePercent = 250;
    uint256 public constant FEE_DENOMINATOR = 10000;
    uint256 public constant maxRoyaltyPercent = 1000; // Max 10%
    
    // Marketplace listing structure
    struct Listing {
        uint256 tokenId;
        address payable seller;
        uint256 price;
        bool isActive;
        uint256 listedAt;
    }
    
    // NFT metadata structure
    struct NFTMetadata {
        address creator;
        uint256 royaltyPercentage; // 500 = 5%
        string metadataURI;
        uint256 mintedAt;
    }
    
    // Mappings
    mapping(uint256 => Listing) public listings;
    mapping(uint256 => NFTMetadata) public nftMetadata;
    mapping(address => uint256) public pendingWithdrawals;
    
    // Events
    event NFTMinted(uint256 indexed tokenId, address indexed creator, string metadataURI);
    event NFTListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event NFTSold(uint256 indexed tokenId, address indexed buyer, address indexed seller, uint256 price);
    event ListingCancelled(uint256 indexed tokenId, address indexed seller);
    event PriceUpdated(uint256 indexed tokenId, uint256 oldPrice, uint256 newPrice);
    event RoyaltyPaid(uint256 indexed tokenId, address indexed creator, uint256 amount);
    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);
    
    /**
     * @dev Constructor sets deployer as initial owner
     */
    constructor() ERC721("Farcaster NFT", "FNFT") Ownable(msg.sender) {}
    
    /**
     * @dev Mint a new NFT with metadata URI
     * @param metadataURI IPFS URI pointing to NFT metadata
     * @param royaltyPercentage Creator royalty (500 = 5%)
     */
    function mintNFT(
        string memory metadataURI,
        uint256 royaltyPercentage
    ) public returns (uint256) {
        require(royaltyPercentage <= maxRoyaltyPercent, "Royalty too high"); // Max 10%
        
        uint256 newTokenId = _nextTokenId++;
        
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, metadataURI);
        
        nftMetadata[newTokenId] = NFTMetadata({
            creator: msg.sender,
            royaltyPercentage: royaltyPercentage,
            metadataURI: metadataURI,
            mintedAt: block.timestamp
        });
        
        emit NFTMinted(newTokenId, msg.sender, metadataURI);
        
        return newTokenId;
    }
    
    /**
     * @dev List NFT for sale
     * @param tokenId Token ID to list
     * @param price Sale price in wei
     */
    function listNFT(uint256 tokenId, uint256 price) public {
        require(tokenId > 0 && tokenId < _nextTokenId, "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        require(price > 0, "Price must be greater than 0");
        require(!listings[tokenId].isActive, "Already listed");
        
        // Transfer NFT to marketplace contract
        _transfer(msg.sender, address(this), tokenId);
        
        listings[tokenId] = Listing({
            tokenId: tokenId,
            seller: payable(msg.sender),
            price: price,
            isActive: true,
            listedAt: block.timestamp
        });
        
        emit NFTListed(tokenId, msg.sender, price);
    }
    
    /**
     * @dev Buy a listed NFT
     * @param tokenId Token ID to buy
     */
    function buyNFT(uint256 tokenId) public payable nonReentrant {
        Listing memory listing = listings[tokenId];
        require(listing.isActive, "NFT not listed");
        require(msg.value >= listing.price, "Insufficient payment");
        require(msg.sender != listing.seller, "Cannot buy own NFT");
        
        listings[tokenId].isActive = false;
        
        // Calculate fees and royalties
        uint256 platformFeeAmount = (listing.price * platformFeePercent) / FEE_DENOMINATOR;
        uint256 royaltyAmount = (listing.price * nftMetadata[tokenId].royaltyPercentage) / FEE_DENOMINATOR;
        uint256 sellerAmount = listing.price - platformFeeAmount - royaltyAmount;
        
        // Transfer NFT to buyer
        _transfer(address(this), msg.sender, tokenId);
        
        // Distribute payments
        pendingWithdrawals[listing.seller] += sellerAmount;
        pendingWithdrawals[owner()] += platformFeeAmount;
        
        if (royaltyAmount > 0) {
            address creator = nftMetadata[tokenId].creator;
            pendingWithdrawals[creator] += royaltyAmount;
            emit RoyaltyPaid(tokenId, creator, royaltyAmount);
        }
        
        // Refund excess payment
        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }
        
        _itemsSold++;
        emit NFTSold(tokenId, msg.sender, listing.seller, listing.price);
    }
    
    /**
     * @dev Cancel listing and return NFT to seller
     * @param tokenId Token ID to cancel listing
     */
    function cancelListing(uint256 tokenId) public {
        Listing memory listing = listings[tokenId];
        require(listing.isActive, "NFT not listed");
        require(listing.seller == msg.sender, "Not the seller");
        
        listings[tokenId].isActive = false;
        
        // Return NFT to seller
        _transfer(address(this), msg.sender, tokenId);
        
        emit ListingCancelled(tokenId, msg.sender);
    }
    
    /**
     * @dev Update listing price
     * @param tokenId Token ID to update
     * @param newPrice New price in wei
     */
    function updatePrice(uint256 tokenId, uint256 newPrice) public {
        Listing memory listing = listings[tokenId];
        require(listing.isActive, "NFT not listed");
        require(listing.seller == msg.sender, "Not the seller");
        require(newPrice > 0, "Price must be greater than 0");
        
        uint256 oldPrice = listing.price;
        listings[tokenId].price = newPrice;
        
        emit PriceUpdated(tokenId, oldPrice, newPrice);
    }
    
    /**
     * @dev Withdraw accumulated funds
     */
    function withdraw() public nonReentrant {
        uint256 amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "No funds to withdraw");
        
        pendingWithdrawals[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
    
    /**
     * @dev Update platform fee (only owner)
     * @param newFee New fee in basis points (250 = 2.5%)
     */
    function setPlatformFee(uint256 newFee) public onlyOwner {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        uint256 oldFee = platformFeePercent;
        platformFeePercent = newFee;
        emit PlatformFeeUpdated(oldFee, newFee);
    }
    
    /**
     * @dev Get all active listings
     */
    function getActiveListings() public view returns (Listing[] memory) {
        uint256 totalTokens = _nextTokenId - 1;
        uint256 activeCount = 0;
        
        // Count active listings
        for (uint256 i = 1; i <= totalTokens; i++) {
            if (listings[i].isActive) {
                activeCount++;
            }
        }
        
        // Create array of active listings
        Listing[] memory activeListings = new Listing[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= totalTokens; i++) {
            if (listings[i].isActive) {
                activeListings[index] = listings[i];
                index++;
            }
        }
        
        return activeListings;
    }
    
    /**
     * @dev Get NFT metadata
     * @param tokenId Token ID to query
     */
    function getNFTMetadata(uint256 tokenId) public view returns (NFTMetadata memory) {
        require(tokenId > 0 && tokenId < _nextTokenId, "Token does not exist");
        return nftMetadata[tokenId];
    }
    
    /**
     * @dev Get marketplace stats
     */
    function getMarketplaceStats() public view returns (
        uint256 totalNFTs,
        uint256 totalSold,
        uint256 activeListings
    ) {
        totalNFTs = _nextTokenId - 1;
        totalSold = _itemsSold;
        
        uint256 active = 0;
        for (uint256 i = 1; i <= totalNFTs; i++) {
            if (listings[i].isActive) {
                active++;
            }
        }
        activeListings = active;
    }
    
    /**
     * @dev Get total supply
     */
    function totalSupply() public view returns (uint256) {
        return _nextTokenId - 1;
    }
}
