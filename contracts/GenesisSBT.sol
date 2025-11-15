// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title GenesisSBT - Genesis Soul Bound Token for FarcastMints Marketplace Launch
 * @notice First 20,000 users can claim 1 Genesis SBT (non-transferable)
 * @dev SBT can be converted to tokens on launch day
 */
contract GenesisSBT is ERC721, Ownable {
    using Counters for Counters.Counter;
    
    // Constants
    uint256 public constant MAX_SUPPLY = 20000;
    uint256 public constant LAUNCH_BONUS_XP = 500; // Bonus XP for Genesis holders
    
    // State variables
    Counters.Counter private _tokenIdCounter;
    mapping(address => bool) public hasClaimed;
    mapping(uint256 => uint256) public tokenMintTime;
    
    bool public claimingEnabled = true;
    bool public canConvertToToken = false;
    uint256 public launchDate;
    
    string private _baseTokenURI;
    
    // Events
    event GenesisClaimed(address indexed user, uint256 tokenId);
    event ConversionEnabled(uint256 launchDate);
    event SBTConverted(address indexed user, uint256 tokenId);
    
    constructor(string memory baseURI) ERC721("FarcastMints Genesis", "FCMG") {
        _baseTokenURI = baseURI;
    }
    
    /**
     * @notice Claim Genesis SBT (1 per wallet, first 20k users)
     */
    function claimGenesisSBT() external {
        require(claimingEnabled, "Claiming is not enabled");
        require(!hasClaimed[msg.sender], "Already claimed Genesis SBT");
        require(_tokenIdCounter.current() < MAX_SUPPLY, "Max supply reached");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        hasClaimed[msg.sender] = true;
        tokenMintTime[tokenId] = block.timestamp;
        
        _safeMint(msg.sender, tokenId);
        
        emit GenesisClaimed(msg.sender, tokenId);
    }
    
    /**
     * @notice Check if user has claimed Genesis SBT
     */
    function hasClaimedSBT(address user) external view returns (bool) {
        return hasClaimed[user];
    }
    
    /**
     * @notice Get total claimed SBTs
     */
    function totalClaimed() external view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    /**
     * @notice Get remaining supply
     */
    function remainingSupply() external view returns (uint256) {
        return MAX_SUPPLY - _tokenIdCounter.current();
    }
    
    /**
     * @notice Owner: Enable token conversion on launch day
     */
    function enableTokenConversion() external onlyOwner {
        require(!canConvertToToken, "Already enabled");
        canConvertToToken = true;
        launchDate = block.timestamp;
        emit ConversionEnabled(launchDate);
    }
    
    /**
     * @notice Owner: Toggle claiming
     */
    function setClaimingEnabled(bool enabled) external onlyOwner {
        claimingEnabled = enabled;
    }
    
    /**
     * @notice Owner: Set base URI for metadata
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    /**
     * @notice Override: Make SBT non-transferable (Soul Bound)
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        require(from == address(0), "SBT: Token is non-transferable (Soul Bound)");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    /**
     * @notice Override: Disable approvals for SBT
     */
    function approve(address to, uint256 tokenId) public virtual override {
        revert("SBT: Token cannot be approved (Soul Bound)");
    }
    
    /**
     * @notice Override: Disable setApprovalForAll for SBT
     */
    function setApprovalForAll(address operator, bool approved) public virtual override {
        revert("SBT: Token cannot be approved (Soul Bound)");
    }
    
    /**
     * @notice Get token metadata URI
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }
    
    /**
     * @notice Check if user can convert SBT to token
     */
    function canConvert(address user) external view returns (bool) {
        return canConvertToToken && hasClaimed[user] && balanceOf(user) > 0;
    }
}
