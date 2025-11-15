// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title FarcasterNFTMarketplace
 * @dev Complete NFT marketplace with minting, listing, buying, and royalties
 * Optimized for Base Network and Farcaster integration
 */
contract FarcasterNFTMarketplace is ERC721URIStorage, ReentrancyGuard, Ownable, Pausable {
    
    uint256 private _nextTokenId = 1;
    uint256 private _itemsSold = 0;
    
    // Platform fee (2.5% = 250 basis points)
    uint256 public platformFee = 250;
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    // Maximum price protection (1,000,000 ETH - prevents accidental or malicious overpricing)
    uint256 public constant MAX_PRICE = 1000000 ether;
    
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
    
    // Offer system
    struct Offer {
        address offeror;
        uint256 amount;
        uint256 expiresAt;
        bool isActive;
    }
    mapping(uint256 => Offer[]) public tokenOffers;
    
    // Social tracking (off-chain indexed, on-chain logged)
    mapping(uint256 => uint256) public favoriteCounts;
    mapping(uint256 => mapping(address => bool)) public hasFavorited;
    
    // Events - Enhanced for Mini App notifications
    event NFTMinted(uint256 indexed tokenId, address indexed creator, string metadataURI, uint256 timestamp);
    event NFTListed(uint256 indexed tokenId, address indexed seller, uint256 price, uint256 timestamp);
    event NFTSold(uint256 indexed tokenId, address indexed buyer, address indexed seller, uint256 price, uint256 timestamp);
    event ListingCancelled(uint256 indexed tokenId, address indexed seller, uint256 timestamp);
    event PriceUpdated(uint256 indexed tokenId, uint256 oldPrice, uint256 newPrice, uint256 timestamp);
    event RoyaltyPaid(uint256 indexed tokenId, address indexed creator, uint256 amount);
    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);
    
    // New events for trading and social features
    event NFTTraded(uint256 indexed fromTokenId, uint256 indexed toTokenId, address indexed trader, address counterparty, uint256 timestamp);
    event OfferMade(uint256 indexed tokenId, address indexed offeror, uint256 offerAmount, uint256 timestamp);
    event OfferAccepted(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 offerAmount, uint256 timestamp);
    event OfferRejected(uint256 indexed tokenId, address indexed seller, address indexed offeror, uint256 timestamp);
    event NFTFavorited(uint256 indexed tokenId, address indexed user, uint256 timestamp);
    event NFTShared(uint256 indexed tokenId, address indexed sharer, string platform, uint256 timestamp);
    
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
        require(bytes(metadataURI).length > 0, "Metadata URI cannot be empty");
        require(bytes(metadataURI).length <= 256, "Metadata URI too long");
        require(royaltyPercentage <= 1000, "Royalty too high"); // Max 10%
        
        uint256 newTokenId = _nextTokenId++;
        
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, metadataURI);
        
        nftMetadata[newTokenId] = NFTMetadata({
            creator: msg.sender,
            royaltyPercentage: royaltyPercentage,
            metadataURI: metadataURI,
            mintedAt: block.timestamp
        });
        
        emit NFTMinted(newTokenId, msg.sender, metadataURI, block.timestamp);
        
        return newTokenId;
    }
    
    /**
     * @dev List NFT for sale
     * @param tokenId Token ID to list
     * @param price Sale price in wei
     */
    function listNFT(uint256 tokenId, uint256 price) public whenNotPaused {
        require(tokenId > 0 && tokenId < _nextTokenId, "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        require(price > 0, "Price must be greater than 0");
        require(price <= MAX_PRICE, "Price exceeds maximum allowed");
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
        
        emit NFTListed(tokenId, msg.sender, price, block.timestamp);
    }
    
    /**
     * @dev Buy a listed NFT
     * @param tokenId Token ID to buy
     */
    function buyNFT(uint256 tokenId) public payable nonReentrant whenNotPaused {
        Listing memory listing = listings[tokenId];
        require(listing.isActive, "NFT not listed");
        require(msg.value >= listing.price, "Insufficient payment");
        require(msg.sender != listing.seller, "Cannot buy own NFT");
        
        // Calculate fees and royalties
        uint256 platformFeeAmount = (listing.price * platformFee) / FEE_DENOMINATOR;
        uint256 royaltyAmount = (listing.price * nftMetadata[tokenId].royaltyPercentage) / FEE_DENOMINATOR;
        uint256 sellerAmount = listing.price - platformFeeAmount - royaltyAmount;
        
        // EFFECTS: Update all state before external calls
        listings[tokenId].isActive = false;
        _itemsSold++;
        
        pendingWithdrawals[listing.seller] += sellerAmount;
        pendingWithdrawals[owner()] += platformFeeAmount;
        
        if (royaltyAmount > 0) {
            address creator = nftMetadata[tokenId].creator;
            pendingWithdrawals[creator] += royaltyAmount;
            emit RoyaltyPaid(tokenId, creator, royaltyAmount);
        }
        
        // INTERACTIONS: External calls last
        _transfer(address(this), msg.sender, tokenId);
        
        // Refund excess payment
        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }
        
        emit NFTSold(tokenId, msg.sender, listing.seller, listing.price, block.timestamp);
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
        
        emit ListingCancelled(tokenId, msg.sender, block.timestamp);
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
        require(newPrice <= MAX_PRICE, "Price exceeds maximum allowed");
        
        uint256 oldPrice = listing.price;
        listings[tokenId].price = newPrice;
        
        emit PriceUpdated(tokenId, oldPrice, newPrice, block.timestamp);
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
    function updatePlatformFee(uint256 newFee) public onlyOwner {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        uint256 oldFee = platformFee;
        platformFee = newFee;
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
    
    /**
     * @dev Pause the marketplace (emergency use only)
     * Only owner can pause
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause the marketplace
     * Only owner can unpause
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // ========================================================================
    // OFFER SYSTEM
    // ========================================================================
    
    /**
     * @dev Make an offer on an NFT
     * @param tokenId Token ID to make offer on
     * @param expiresIn Seconds until offer expires
     */
    function makeOffer(uint256 tokenId, uint256 expiresIn) public payable whenNotPaused {
        require(tokenId > 0 && tokenId < _nextTokenId, "Token does not exist");
        require(msg.value > 0, "Offer amount must be greater than 0");
        require(expiresIn >= 3600, "Offer must last at least 1 hour"); // Minimum 1 hour
        require(expiresIn <= 30 days, "Offer cannot last more than 30 days");
        require(ownerOf(tokenId) != msg.sender, "Cannot offer on own NFT");
        
        tokenOffers[tokenId].push(Offer({
            offeror: msg.sender,
            amount: msg.value,
            expiresAt: block.timestamp + expiresIn,
            isActive: true
        }));
        
        emit OfferMade(tokenId, msg.sender, msg.value, block.timestamp);
    }
    
    /**
     * @dev Accept an offer on your NFT
     * @param tokenId Token ID
     * @param offerIndex Index of the offer in the array
     */
    function acceptOffer(uint256 tokenId, uint256 offerIndex) public nonReentrant whenNotPaused {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        require(offerIndex < tokenOffers[tokenId].length, "Invalid offer index");
        
        Offer storage offer = tokenOffers[tokenId][offerIndex];
        require(offer.isActive, "Offer not active");
        require(block.timestamp <= offer.expiresAt, "Offer expired");
        
        uint256 offerAmount = offer.amount;
        address offeror = offer.offeror;
        
        // Calculate fees
        uint256 platformFeeAmount = (offerAmount * platformFee) / FEE_DENOMINATOR;
        uint256 royaltyAmount = (offerAmount * nftMetadata[tokenId].royaltyPercentage) / FEE_DENOMINATOR;
        uint256 sellerAmount = offerAmount - platformFeeAmount - royaltyAmount;
        
        // Mark offer as inactive
        offer.isActive = false;
        
        // If NFT is listed, delist it
        if (listings[tokenId].isActive) {
            listings[tokenId].isActive = false;
        }
        
        // Update balances
        pendingWithdrawals[msg.sender] += sellerAmount;
        pendingWithdrawals[owner()] += platformFeeAmount;
        
        if (royaltyAmount > 0) {
            address creator = nftMetadata[tokenId].creator;
            pendingWithdrawals[creator] += royaltyAmount;
            emit RoyaltyPaid(tokenId, creator, royaltyAmount);
        }
        
        // Transfer NFT (from owner or from marketplace if listed)
        address currentOwner = ownerOf(tokenId);
        if (currentOwner == address(this)) {
            _transfer(address(this), offeror, tokenId);
        } else {
            _transfer(msg.sender, offeror, tokenId);
        }
        
        emit OfferAccepted(tokenId, msg.sender, offeror, offerAmount, block.timestamp);
    }
    
    /**
     * @dev Cancel your own offer
     * @param tokenId Token ID
     * @param offerIndex Index of the offer
     */
    function cancelOffer(uint256 tokenId, uint256 offerIndex) public nonReentrant {
        require(offerIndex < tokenOffers[tokenId].length, "Invalid offer index");
        
        Offer storage offer = tokenOffers[tokenId][offerIndex];
        require(offer.offeror == msg.sender, "Not your offer");
        require(offer.isActive, "Offer not active");
        
        uint256 refundAmount = offer.amount;
        offer.isActive = false;
        
        // Refund the offer amount
        payable(msg.sender).transfer(refundAmount);
        
        emit OfferRejected(tokenId, ownerOf(tokenId), msg.sender, block.timestamp);
    }
    
    /**
     * @dev Reject an offer (NFT owner only)
     * @param tokenId Token ID
     * @param offerIndex Index of the offer
     */
    function rejectOffer(uint256 tokenId, uint256 offerIndex) public nonReentrant {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        require(offerIndex < tokenOffers[tokenId].length, "Invalid offer index");
        
        Offer storage offer = tokenOffers[tokenId][offerIndex];
        require(offer.isActive, "Offer not active");
        
        address offeror = offer.offeror;
        uint256 refundAmount = offer.amount;
        offer.isActive = false;
        
        // Refund the offeror
        payable(offeror).transfer(refundAmount);
        
        emit OfferRejected(tokenId, msg.sender, offeror, block.timestamp);
    }
    
    /**
     * @dev Get all offers for a token
     * @param tokenId Token ID
     */
    function getOffers(uint256 tokenId) public view returns (Offer[] memory) {
        return tokenOffers[tokenId];
    }
    
    /**
     * @dev Get active offers for a token
     * @param tokenId Token ID
     */
    function getActiveOffers(uint256 tokenId) public view returns (Offer[] memory) {
        Offer[] memory allOffers = tokenOffers[tokenId];
        uint256 activeCount = 0;
        
        // Count active offers
        for (uint256 i = 0; i < allOffers.length; i++) {
            if (allOffers[i].isActive && block.timestamp <= allOffers[i].expiresAt) {
                activeCount++;
            }
        }
        
        // Create array of active offers
        Offer[] memory activeOffers = new Offer[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < allOffers.length; i++) {
            if (allOffers[i].isActive && block.timestamp <= allOffers[i].expiresAt) {
                activeOffers[index] = allOffers[i];
                index++;
            }
        }
        
        return activeOffers;
    }
    
    // ========================================================================
    // SOCIAL FEATURES (for Mini App integration)
    // ========================================================================
    
    /**
     * @dev Favorite/like an NFT (gas-efficient social feature)
     * @param tokenId Token ID to favorite
     */
    function favoriteNFT(uint256 tokenId) public {
        require(tokenId > 0 && tokenId < _nextTokenId, "Token does not exist");
        require(!hasFavorited[tokenId][msg.sender], "Already favorited");
        
        hasFavorited[tokenId][msg.sender] = true;
        favoriteCounts[tokenId]++;
        
        emit NFTFavorited(tokenId, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Unfavorite an NFT
     * @param tokenId Token ID to unfavorite
     */
    function unfavoriteNFT(uint256 tokenId) public {
        require(hasFavorited[tokenId][msg.sender], "Not favorited");
        
        hasFavorited[tokenId][msg.sender] = false;
        favoriteCounts[tokenId]--;
    }
    
    /**
     * @dev Log a share event (for analytics and notifications)
     * @param tokenId Token ID being shared
     * @param platform Platform name (e.g., "farcaster", "twitter")
     */
    function shareNFT(uint256 tokenId, string memory platform) public {
        require(tokenId > 0 && tokenId < _nextTokenId, "Token does not exist");
        require(bytes(platform).length > 0 && bytes(platform).length <= 32, "Invalid platform");
        
        emit NFTShared(tokenId, msg.sender, platform, block.timestamp);
    }
    
    /**
     * @dev Get favorite count for an NFT
     * @param tokenId Token ID
     */
    function getFavoriteCount(uint256 tokenId) public view returns (uint256) {
        return favoriteCounts[tokenId];
    }
    
    /**
     * @dev Check if user has favorited an NFT
     * @param tokenId Token ID
     * @param user User address
     */
    function hasUserFavorited(uint256 tokenId, address user) public view returns (bool) {
        return hasFavorited[tokenId][user];
    }
}
