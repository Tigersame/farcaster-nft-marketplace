const { ethers } = require("hardhat");
require('dotenv').config({ path: '.env.local' });

async function main() {
  console.log("🧪 Deploying FarcasterNFTMarketplace to Base Sepolia testnet...\n");

  // Check if private key is loaded
  if (!process.env.PRIVATE_KEY) {
    console.error("❌ No PRIVATE_KEY found in .env.local");
    console.log("Please add your wallet private key to .env.local:");
    console.log("PRIVATE_KEY=your_private_key_here");
    process.exit(1);
  }

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  
  if (!deployer) {
    console.error("❌ No deployer account found. Check your PRIVATE_KEY in .env.local");
    process.exit(1);
  }
  console.log("📝 Deploying with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");

  if (balance.toString() === "0") {
    console.log("⚠️  Warning: Account has no ETH!");
    console.log("   Get testnet ETH from: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet");
    return;
  }

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
  console.log("   - Network: Base Sepolia Testnet");
  
  console.log("\n🔗 Block Explorer:");
  console.log(`   https://sepolia.basescan.org/address/${marketplaceAddress}`);
  
  console.log("\n⚙️  Next Steps:");
  console.log("   1. Verify contract on BaseScan:");
  console.log(`      npx hardhat verify --network baseSepolia ${marketplaceAddress}`);
  console.log("\n   2. Update .env.local:");
  console.log(`      NEXT_PUBLIC_MARKETPLACE_CONTRACT=${marketplaceAddress}`);
  console.log(`      NEXT_PUBLIC_NETWORK=baseSepolia`);
  console.log("\n   3. Test minting an NFT:");
  console.log("      npx hardhat run scripts/mint-test-nft.ts --network baseSepolia");
  
  // Save deployment info
  const deploymentInfo = {
    network: "baseSepolia",
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
