// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title AdminNFTMarketplace
 * @notice Production-grade NFT marketplace with granular role-based access control
 * @dev Implements OpenZeppelin AccessControl for role management
 */
contract AdminNFTMarketplace is 
    ERC721URIStorage, 
    ERC721Enumerable,
    AccessControl, 
    Pausable, 
    ReentrancyGuard,
    UUPSUpgradeable 
{
    // ============ Roles ============
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant CURATOR_ROLE = keccak256("CURATOR_ROLE");
    bytes32 public constant FINANCE_ROLE = keccak256("FINANCE_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // ============ State Variables ============
    uint256 public nextTokenId;
    address public treasury; // Gnosis Safe multisig
    string public metadataProxy;
    
    // Collection management
    struct Collection {
        string name;
        string slug;
        string description;
        string coverImage;
        uint256 royaltyBps; // basis points (100 = 1%)
        address royaltyRecipient;
        bool active;
    }
    
    mapping(bytes32 => Collection) public collections;
    mapping(uint256 => bytes32) public tokenCollection;
    mapping(uint256 => uint256) public listingPrice;
    mapping(uint256 => bool) public delisted;
    
    // Revenue tracking
    uint256 public totalRevenue;
    uint256 public withdrawnRevenue;
    
    // Whitelist for pre-mint
    mapping(address => bool) public whitelist;
    
    // ============ Events ============
    event NFTMinted(address indexed to, uint256 indexed tokenId, string uri, address indexed operator);
    event NFTBatchMinted(address indexed to, uint256[] tokenIds, string[] uris, address indexed operator);
    event NFTAdded(uint256 indexed tokenId, string uri, address indexed operator);
    event NFTRemoved(uint256 indexed tokenId, address indexed operator);
    event NFTDelisted(uint256 indexed tokenId, address indexed operator);
    event PriceSet(uint256 indexed tokenId, uint256 price, address indexed operator);
    event CollectionCreated(bytes32 indexed collectionId, string name, address indexed operator);
    event CollectionUpdated(bytes32 indexed collectionId, string name, address indexed operator);
    event ThemeUpdated(string key, string value, address indexed operator);
    event RevenueWithdrawn(address indexed to, uint256 amount, address indexed operator);
    event MetadataProxyUpdated(string oldUrl, string newUrl, address indexed operator);
    event RoyaltySet(bytes32 indexed collectionId, uint256 bps, address recipient, address indexed operator);
    event WhitelistUpdated(address indexed account, bool status, address indexed operator);
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury, address operator);
    event AdminTransferred(address indexed oldAdmin, address indexed newAdmin);

    // ============ Constructor ============
    constructor(
        string memory name_, 
        string memory symbol_, 
        address initialAdmin, 
        address treasury_
    ) ERC721(name_, symbol_) {
        require(initialAdmin != address(0), "Invalid admin");
        require(treasury_ != address(0), "Invalid treasury");
        
        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        _grantRole(MINTER_ROLE, initialAdmin);
        _grantRole(CURATOR_ROLE, initialAdmin);
        _grantRole(FINANCE_ROLE, initialAdmin);
        _grantRole(PAUSER_ROLE, initialAdmin);
        _grantRole(UPGRADER_ROLE, initialAdmin);
        
        treasury = treasury_;
    }

    // ============ Minting Functions ============
    
    /**
     * @notice Mint single NFT (MINTER_ROLE only)
     */
    function mintTo(
        address to, 
        string calldata uri
    ) external onlyRole(MINTER_ROLE) whenNotPaused returns (uint256) {
        require(to != address(0), "Invalid recipient");
        uint256 id = ++nextTokenId;
        _safeMint(to, id);
        _setTokenURI(id, uri);
        emit NFTMinted(to, id, uri, msg.sender);
        return id;
    }
    
    /**
     * @notice Batch mint NFTs (MINTER_ROLE only)
     */
    function batchMint(
        address to,
        string[] calldata uris
    ) external onlyRole(MINTER_ROLE) whenNotPaused returns (uint256[] memory) {
        require(to != address(0), "Invalid recipient");
        require(uris.length > 0 && uris.length <= 100, "Invalid batch size");
        
        uint256[] memory tokenIds = new uint256[](uris.length);
        
        for (uint256 i = 0; i < uris.length; i++) {
            uint256 id = ++nextTokenId;
            _safeMint(to, id);
            _setTokenURI(id, uris[i]);
            tokenIds[i] = id;
        }
        
        emit NFTBatchMinted(to, tokenIds, uris, msg.sender);
        return tokenIds;
    }
    
    /**
     * @notice Whitelist-only minting
     */
    function whitelistMint(string calldata uri) external whenNotPaused returns (uint256) {
        require(whitelist[msg.sender], "Not whitelisted");
        uint256 id = ++nextTokenId;
        _safeMint(msg.sender, id);
        _setTokenURI(id, uri);
        emit NFTMinted(msg.sender, id, uri, msg.sender);
        return id;
    }

    // ============ Collection Management ============
    
    /**
     * @notice Create new collection (CURATOR_ROLE)
     */
    function createCollection(
        bytes32 collectionId,
        string calldata name,
        string calldata slug,
        string calldata description,
        string calldata coverImage,
        uint256 royaltyBps,
        address royaltyRecipient
    ) external onlyRole(CURATOR_ROLE) {
        require(collectionId != bytes32(0), "Invalid ID");
        require(!collections[collectionId].active, "Collection exists");
        require(royaltyBps <= 1000, "Royalty too high"); // max 10%
        
        collections[collectionId] = Collection({
            name: name,
            slug: slug,
            description: description,
            coverImage: coverImage,
            royaltyBps: royaltyBps,
            royaltyRecipient: royaltyRecipient,
            active: true
        });
        
        emit CollectionCreated(collectionId, name, msg.sender);
    }
    
    /**
     * @notice Update collection metadata (CURATOR_ROLE)
     */
    function updateCollection(
        bytes32 collectionId,
        string calldata name,
        string calldata description,
        string calldata coverImage
    ) external onlyRole(CURATOR_ROLE) {
        require(collections[collectionId].active, "Collection not found");
        
        Collection storage collection = collections[collectionId];
        collection.name = name;
        collection.description = description;
        collection.coverImage = coverImage;
        
        emit CollectionUpdated(collectionId, name, msg.sender);
    }
    
    /**
     * @notice Set collection royalty (CURATOR_ROLE)
     */
    function setRoyalty(
        bytes32 collectionId,
        uint256 royaltyBps,
        address royaltyRecipient
    ) external onlyRole(CURATOR_ROLE) {
        require(collections[collectionId].active, "Collection not found");
        require(royaltyBps <= 1000, "Royalty too high");
        
        collections[collectionId].royaltyBps = royaltyBps;
        collections[collectionId].royaltyRecipient = royaltyRecipient;
        
        emit RoyaltySet(collectionId, royaltyBps, royaltyRecipient, msg.sender);
    }
    
    /**
     * @notice Add NFT to collection (CURATOR_ROLE)
     */
    function addToCollection(
        uint256 tokenId,
        bytes32 collectionId
    ) external onlyRole(CURATOR_ROLE) {
        require(_exists(tokenId), "Token doesn't exist");
        require(collections[collectionId].active, "Collection not found");
        
        tokenCollection[tokenId] = collectionId;
        emit NFTAdded(tokenId, tokenURI(tokenId), msg.sender);
    }

    // ============ Marketplace Functions ============
    
    /**
     * @notice Set listing price (CURATOR_ROLE)
     */
    function setPrice(uint256 tokenId, uint256 price) external onlyRole(CURATOR_ROLE) {
        require(_exists(tokenId), "Token doesn't exist");
        listingPrice[tokenId] = price;
        emit PriceSet(tokenId, price, msg.sender);
    }
    
    /**
     * @notice Batch set prices (CURATOR_ROLE)
     */
    function batchSetPrice(
        uint256[] calldata tokenIds,
        uint256[] calldata prices
    ) external onlyRole(CURATOR_ROLE) {
        require(tokenIds.length == prices.length, "Length mismatch");
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(_exists(tokenIds[i]), "Token doesn't exist");
            listingPrice[tokenIds[i]] = prices[i];
            emit PriceSet(tokenIds[i], prices[i], msg.sender);
        }
    }
    
    /**
     * @notice Delist NFT from marketplace (CURATOR_ROLE)
     */
    function delistNFT(uint256 tokenId) external onlyRole(CURATOR_ROLE) {
        require(_exists(tokenId), "Token doesn't exist");
        delisted[tokenId] = true;
        emit NFTDelisted(tokenId, msg.sender);
    }
    
    /**
     * @notice Remove/burn NFT (CURATOR_ROLE - use carefully)
     */
    function removeNFT(uint256 tokenId) external onlyRole(CURATOR_ROLE) {
        require(_exists(tokenId), "Token doesn't exist");
        _burn(tokenId);
        emit NFTRemoved(tokenId, msg.sender);
    }
    
    /**
     * @notice Purchase NFT
     */
    function purchase(uint256 tokenId) external payable whenNotPaused nonReentrant {
        require(_exists(tokenId), "Token doesn't exist");
        require(!delisted[tokenId], "NFT delisted");
        require(listingPrice[tokenId] > 0, "Not for sale");
        require(msg.value >= listingPrice[tokenId], "Insufficient payment");
        
        address seller = ownerOf(tokenId);
        uint256 price = listingPrice[tokenId];
        
        // Calculate royalty if in collection
        bytes32 collectionId = tokenCollection[tokenId];
        uint256 royaltyAmount = 0;
        
        if (collectionId != bytes32(0) && collections[collectionId].active) {
            Collection memory collection = collections[collectionId];
            royaltyAmount = (price * collection.royaltyBps) / 10000;
            
            if (royaltyAmount > 0 && collection.royaltyRecipient != address(0)) {
                payable(collection.royaltyRecipient).transfer(royaltyAmount);
            }
        }
        
        // Transfer to seller
        uint256 sellerAmount = price - royaltyAmount;
        payable(seller).transfer(sellerAmount);
        
        // Track revenue
        totalRevenue += price;
        
        // Transfer NFT
        _transfer(seller, msg.sender, tokenId);
        
        // Clear listing
        listingPrice[tokenId] = 0;
        
        // Refund excess
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
    }

    // ============ Finance Functions ============
    
    /**
     * @notice Withdraw revenue to treasury (FINANCE_ROLE)
     */
    function withdraw(address to, uint256 amount) external onlyRole(FINANCE_ROLE) nonReentrant {
        require(to != address(0), "Invalid recipient");
        require(address(this).balance >= amount, "Insufficient balance");
        
        withdrawnRevenue += amount;
        payable(to).transfer(amount);
        
        emit RevenueWithdrawn(to, amount, msg.sender);
    }
    
    /**
     * @notice Withdraw all to treasury (FINANCE_ROLE)
     */
    function withdrawAll() external onlyRole(FINANCE_ROLE) nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance");
        
        withdrawnRevenue += balance;
        payable(treasury).transfer(balance);
        
        emit RevenueWithdrawn(treasury, balance, msg.sender);
    }
    
    /**
     * @notice Update treasury address (DEFAULT_ADMIN_ROLE)
     */
    function setTreasury(address newTreasury) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newTreasury != address(0), "Invalid treasury");
        address oldTreasury = treasury;
        treasury = newTreasury;
        emit TreasuryUpdated(oldTreasury, newTreasury, msg.sender);
    }

    // ============ Admin Functions ============
    
    /**
     * @notice Pause marketplace (PAUSER_ROLE)
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }
    
    /**
     * @notice Unpause marketplace (PAUSER_ROLE)
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }
    
    /**
     * @notice Set metadata proxy URL (DEFAULT_ADMIN_ROLE)
     */
    function setMetadataProxy(string calldata url) external onlyRole(DEFAULT_ADMIN_ROLE) {
        string memory old = metadataProxy;
        metadataProxy = url;
        emit MetadataProxyUpdated(old, url, msg.sender);
    }
    
    /**
     * @notice Update whitelist (CURATOR_ROLE)
     */
    function setWhitelist(address account, bool status) external onlyRole(CURATOR_ROLE) {
        whitelist[account] = status;
        emit WhitelistUpdated(account, status, msg.sender);
    }
    
    /**
     * @notice Batch whitelist (CURATOR_ROLE)
     */
    function batchWhitelist(
        address[] calldata accounts,
        bool status
    ) external onlyRole(CURATOR_ROLE) {
        for (uint256 i = 0; i < accounts.length; i++) {
            whitelist[accounts[i]] = status;
            emit WhitelistUpdated(accounts[i], status, msg.sender);
        }
    }
    
    /**
     * @notice Transfer admin to multisig (DEFAULT_ADMIN_ROLE - ONE TIME ONLY)
     */
    function transferAdmin(address newAdmin) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newAdmin != address(0), "Invalid admin");
        _grantRole(DEFAULT_ADMIN_ROLE, newAdmin);
        _revokeRole(DEFAULT_ADMIN_ROLE, msg.sender);
        emit AdminTransferred(msg.sender, newAdmin);
    }

    // ============ UUPS Upgrade Authorization ============
    
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADER_ROLE) {}

    // ============ View Functions ============
    
    function getCollectionRoyalty(bytes32 collectionId) external view returns (uint256, address) {
        Collection memory collection = collections[collectionId];
        return (collection.royaltyBps, collection.royaltyRecipient);
    }
    
    function isListed(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId) && !delisted[tokenId] && listingPrice[tokenId] > 0;
    }
    
    function getAvailableRevenue() external view returns (uint256) {
        return address(this).balance;
    }

    // ============ Required Overrides ============
    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // ============ Fallback ============
    
    receive() external payable {
        totalRevenue += msg.value;
    }
}
