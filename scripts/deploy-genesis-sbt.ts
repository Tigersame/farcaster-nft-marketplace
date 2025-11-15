const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying Genesis SBT Contract...\n");

  // Base URI for metadata (update with your IPFS/server URL)
  const baseURI = "https://api.farcastmints.com/genesis/metadata/";

  const GenesisSBT = await hre.ethers.getContractFactory("GenesisSBT");
  const genesisSBT = await GenesisSBT.deploy(baseURI);

  await genesisSBT.deployed();

  console.log("✅ Genesis SBT deployed to:", genesisSBT.address);
  console.log("\n📋 Contract Details:");
  console.log("- Network:", hre.network.name);
  console.log("- Base URI:", baseURI);
  console.log("- Max Supply: 20,000");
  console.log("- Genesis Bonus XP: 500");
  
  console.log("\n⏳ Waiting for block confirmations...");
  await genesisSBT.deployTransaction.wait(6);
  
  console.log("\n✅ Verified! Now verifying on Basescan...");
  
  try {
    await hre.run("verify:verify", {
      address: genesisSBT.address,
      constructorArguments: [baseURI],
    });
    console.log("✅ Contract verified on Basescan");
  } catch (error) {
    console.log("⚠️ Verification failed:", error.message);
  }

  console.log("\n🎉 Deployment Complete!");
  console.log("\n📝 Next Steps:");
  console.log("1. Update NEXT_PUBLIC_GENESIS_SBT_ADDRESS in .env.local");
  console.log("2. Upload metadata to IPFS or your server");
  console.log("3. Enable claiming on the contract if needed");
  console.log("\n💡 Contract Address:", genesisSBT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
