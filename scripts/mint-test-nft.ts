const { ethers } = require("hardhat");
require('dotenv').config({ path: '.env.local' });

async function main() {
  const contractAddress = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT;
  
  if (!contractAddress) {
    console.error("❌ Please set NEXT_PUBLIC_MARKETPLACE_CONTRACT in .env.local");
    process.exit(1);
  }

  console.log("🎨 Minting test NFT on FarcasterNFTMarketplace\n");

  const [minter] = await ethers.getSigners();
  console.log("👤 Minting with account:", minter.address);

  // Connect to deployed contract
  const marketplace = await ethers.getContractAt("FarcasterNFTMarketplace", contractAddress);
  
  // Use a working test metadata URI (IPFS gateway)
  // This points to a test JSON metadata file
  const metadataURI = "https://gateway.pinata.cloud/ipfs/QmNX8hwzkN6dUaB7giQhudWeqyLNgQZhRRYy6K7d5CR1J4";
  const royaltyPercentage = 500; // 5%

  console.log("\n⏳ Minting NFT...");
  console.log("   Metadata URI:", metadataURI);
  console.log("   Royalty: 5%");

  try {
    const tx = await marketplace.mintNFT(metadataURI, royaltyPercentage);
    console.log("\n📄 Transaction sent:", tx.hash);
    console.log("⏳ Waiting for confirmation...");
    
    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed!");

    // Get the tokenId from the NFTMinted event
    const event = receipt.logs.find((log) => {
      try {
        const parsed = marketplace.interface.parseLog(log);
        return parsed?.name === "NFTMinted";
      } catch {
        return false;
      }
    });

    if (event) {
      const parsed = marketplace.interface.parseLog(event);
      const tokenId = parsed?.args[0];
      console.log("\n🎉 NFT Minted Successfully!");
      console.log("   Token ID:", tokenId.toString());
      console.log("   Transaction:", receipt.hash);
      console.log("   Block:", receipt.blockNumber);
      
      console.log("\n🔗 View on BaseScan:");
      console.log(`   https://sepolia.basescan.org/tx/${receipt.hash}`);
      
      console.log("\n📈 Next Steps:");
      console.log("   1. List this NFT for sale:");
      console.log(`      marketplace.listNFT(${tokenId}, ethers.parseEther("0.1"))`);
      console.log("\n   2. Check your NFT:");
      console.log(`      marketplace.getNFTMetadata(${tokenId})`);
    } else {
      console.log("✅ NFT minted but couldn't parse token ID from events");
    }
  } catch (error) {
    console.error("❌ Minting failed:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("\n💡 Solution: Add more ETH to your wallet");
      console.log("   Get testnet ETH: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Minting failed:", error);
    process.exit(1);
  });
