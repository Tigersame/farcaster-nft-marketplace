const { ethers } = require("hardhat");

async function main() {
  const txHash = "0x3d0172918e44fdbe59387dffd2700bd20d3502fbe9ac9e719a4f753c921f57d4";
  
  console.log("🔍 Fetching transaction receipt...");
  console.log("Transaction Hash:", txHash);
  
  const receipt = await ethers.provider.getTransactionReceipt(txHash);
  
  if (!receipt) {
    console.log("⏳ Transaction not yet confirmed. Please wait and try again.");
    process.exit(0);
  }
  
  if (receipt.contractAddress) {
    console.log("\n✅ Contract Deployed Successfully!");
    console.log("📝 Contract Address:", receipt.contractAddress);
    console.log("\n🔗 View on Basescan:");
    console.log(`   https://basescan.org/address/${receipt.contractAddress}`);
    console.log("\n📋 Next Steps:");
    console.log("   1. Update .env.local with this contract address");
    console.log("   2. Transfer ownership to:", "0xEaFE5088BCd7eb27fa1e4AA417a55eD5ea2dab8B");
    console.log("   3. Verify contract on Basescan");
  } else {
    console.log("❌ Contract deployment failed or transaction reverted");
    console.log("Status:", receipt.status === 1 ? "Success" : "Failed");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
