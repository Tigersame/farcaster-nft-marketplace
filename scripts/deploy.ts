const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying FarcasterNFTMarketplace to Base network...\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");

  // Deploy the contract
  console.log("⏳ Deploying contract...");
  const FarcasterNFTMarketplace = await ethers.getContractFactory("FarcasterNFTMarketplace");
  const marketplace = await FarcasterNFTMarketplace.deploy();
  
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();

  console.log("✅ FarcasterNFTMarketplace deployed to:", marketplaceAddress);
  console.log("\n📋 Contract Details:");
  console.log("   - Name: Farcaster NFT");
  console.log("   - Symbol: FNFT");
  console.log("   - Platform Fee: 2.5%");
  console.log("   - Max Royalty: 10%");
  
  console.log("\n🔗 Block Explorer:");
  console.log(`   https://basescan.org/address/${marketplaceAddress}`);
  
  console.log("\n⚙️  Next Steps:");
  console.log("   1. Verify contract on BaseScan:");
  console.log(`      npx hardhat verify --network base ${marketplaceAddress}`);
  console.log("\n   2. Update .env.local:");
  console.log(`      NEXT_PUBLIC_MARKETPLACE_CONTRACT=${marketplaceAddress}`);
  console.log("\n   3. Test the contract:");
  console.log("      npx hardhat test --network base");
  
  // Save deployment info
  const deploymentInfo = {
    network: "base",
    contractAddress: marketplaceAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber()
  };
  
  console.log("\n💾 Deployment Info:", JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
