/**
 * Deploy AdminNFTMarketplace to Base Sepolia
 * Usage: npx hardhat run scripts/deploy-admin-marketplace.ts --network base-sepolia
 */

import { ethers } from 'hardhat';
import { formatEther, keccak256, toUtf8Bytes, ZeroHash } from 'ethers';

async function main() {
  console.log('🚀 Deploying AdminNFTMarketplace to Base Sepolia...\n');

  const [deployer] = await ethers.getSigners();
  console.log('Deploying with account:', deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log('Account balance:', formatEther(balance), 'ETH\n');

  // Set admin and treasury addresses
  const ADMIN_ADDRESS = deployer.address; // Will transfer to multisig after deployment
  const TREASURY_ADDRESS = process.env.TREASURY_ADDRESS || deployer.address;
  
  console.log('Admin address:', ADMIN_ADDRESS);
  console.log('Treasury address:', TREASURY_ADDRESS);
  console.log('');

  // Deploy contract
  const AdminNFTMarketplace = await ethers.getContractFactory('AdminNFTMarketplace');
  const marketplace = await AdminNFTMarketplace.deploy(
    'FarcastMints', // Name
    'FMINT', // Symbol
    ADMIN_ADDRESS,
    TREASURY_ADDRESS
  );

  await marketplace.deployed();

  console.log('✅ AdminNFTMarketplace deployed to:', marketplace.address);
  console.log('');

  // Grant initial roles
  console.log('📝 Setting up initial roles...');
  
  const MINTER_ROLE = keccak256(toUtf8Bytes('MINTER_ROLE'));
  const CURATOR_ROLE = keccak256(toUtf8Bytes('CURATOR_ROLE'));
  const FINANCE_ROLE = keccak256(toUtf8Bytes('FINANCE_ROLE'));
  const PAUSER_ROLE = keccak256(toUtf8Bytes('PAUSER_ROLE'));
  const UPGRADER_ROLE = keccak256(toUtf8Bytes('UPGRADER_ROLE'));

  // Roles are already granted in constructor
  console.log('✅ All roles granted to deployer');
  console.log('');

  // Verify role setup
  console.log('🔍 Verifying role setup...');
  const hasAdminRole = await marketplace.hasRole(ZeroHash, ADMIN_ADDRESS);
  const hasMinterRole = await marketplace.hasRole(MINTER_ROLE, ADMIN_ADDRESS);
  const hasCuratorRole = await marketplace.hasRole(CURATOR_ROLE, ADMIN_ADDRESS);
  const hasFinanceRole = await marketplace.hasRole(FINANCE_ROLE, ADMIN_ADDRESS);
  const hasPauserRole = await marketplace.hasRole(PAUSER_ROLE, ADMIN_ADDRESS);
  const hasUpgraderRole = await marketplace.hasRole(UPGRADER_ROLE, ADMIN_ADDRESS);

  console.log('DEFAULT_ADMIN_ROLE:', hasAdminRole ? '✅' : '❌');
  console.log('MINTER_ROLE:', hasMinterRole ? '✅' : '❌');
  console.log('CURATOR_ROLE:', hasCuratorRole ? '✅' : '❌');
  console.log('FINANCE_ROLE:', hasFinanceRole ? '✅' : '❌');
  console.log('PAUSER_ROLE:', hasPauserRole ? '✅' : '❌');
  console.log('UPGRADER_ROLE:', hasUpgraderRole ? '✅' : '❌');
  console.log('');

  // Save deployment info
  const deploymentInfo = {
    network: 'base-sepolia',
    contract: 'AdminNFTMarketplace',
    address: marketplace.address,
    deployer: deployer.address,
    treasury: TREASURY_ADDRESS,
    deployedAt: new Date().toISOString(),
    roles: {
      DEFAULT_ADMIN_ROLE: ZeroHash,
      MINTER_ROLE,
      CURATOR_ROLE,
      FINANCE_ROLE,
      PAUSER_ROLE,
      UPGRADER_ROLE,
    },
  };

  console.log('📄 Deployment Summary:');
  console.log(JSON.stringify(deploymentInfo, null, 2));
  console.log('');

  // Next steps
  console.log('📋 NEXT STEPS:');
  console.log('1. Verify contract on Basescan:');
  console.log(`   npx hardhat verify --network base-sepolia ${marketplace.address} "FarcastMints" "FMINT" "${ADMIN_ADDRESS}" "${TREASURY_ADDRESS}"`);
  console.log('');
  console.log('2. Create Gnosis Safe multisig');
  console.log('');
  console.log('3. Transfer DEFAULT_ADMIN_ROLE to Safe:');
  console.log(`   await marketplace.transferAdmin("<SAFE_ADDRESS>")`);
  console.log('');
  console.log('4. Update environment variables:');
  console.log(`   NEXT_PUBLIC_MARKETPLACE_ADDRESS=${marketplace.address}`);
  console.log(`   NEXT_PUBLIC_GNOSIS_SAFE_ADDRESS=<YOUR_SAFE_ADDRESS>`);
  console.log('');

  // Save to file
  const fs = require('fs');
  fs.writeFileSync(
    './deployment-admin-marketplace.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log('💾 Deployment info saved to deployment-admin-marketplace.json');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
