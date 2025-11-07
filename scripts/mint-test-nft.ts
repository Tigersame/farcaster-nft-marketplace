import { ethers } from "hardhat";

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
  
  // Test metadata URI (replace with your actual IPFS URI)
  const metadataURI = "ipfs://QmTest123/metadata.json";
  const royaltyPercentage = 500; // 5%

  console.log("\n⏳ Minting NFT...");
  console.log("   Metadata URI:", metadataURI);
  console.log("   Royalty: 5%");

  const tx = await marketplace.mintNFT(metadataURI, royaltyPercentage);
  const receipt = await tx.wait();

  // Get the tokenId from the NFTMinted event
  const event = receipt?.logs.find((log: any) => {
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
    console.log("\n✅ NFT Minted Successfully!");
    console.log("   Token ID:", tokenId.toString());
    console.log("   Transaction:", receipt?.hash);
    console.log("\n🎉 You can now list this NFT for sale:");
    console.log(`   npx hardhat run scripts/list-nft.ts --network baseSepolia`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Minting failed:", error);
    process.exit(1);
  });
