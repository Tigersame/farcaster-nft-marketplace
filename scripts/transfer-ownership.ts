const { ethers } = require("hardhat");

async function main() {
  // ⚠️ PASTE YOUR DEPLOYED CONTRACT ADDRESS HERE
  const contractAddress = "0xE4241917A3B75C761C87BE335F392e220F67afCf";
  
  // New owner address (Base Builder address)
  const newOwner = "0xEaFE5088BCd7eb27fa1e4AA417a55eD5ea2dab8B";
  
  console.log("🔄 Transferring Ownership...\n");
  console.log("📝 Contract Address:", contractAddress);
  console.log("👤 New Owner:", newOwner);
  
  // Get the deployed contract
  const marketplace = await ethers.getContractAt("FarcasterNFTMarketplace", contractAddress);
  
  // Get current owner
  const currentOwner = await marketplace.owner();
  console.log("🔍 Current Owner:", currentOwner);
  
  if (currentOwner.toLowerCase() === newOwner.toLowerCase()) {
    console.log("✅ Already owned by the correct address!");
    return;
  }
  
  // Transfer ownership
  console.log("\n⏳ Transferring ownership...");
  const tx = await marketplace.transferOwnership(newOwner);
  console.log("📤 Transaction sent:", tx.hash);
  
  // Wait for confirmation
  await tx.wait();
  console.log("✅ Transaction confirmed!");
  
  // Verify new owner
  const verifyOwner = await marketplace.owner();
  console.log("🎉 New Owner:", verifyOwner);
  
  console.log("\n🔗 View on Basescan:");
  console.log(`   https://basescan.org/tx/${tx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
