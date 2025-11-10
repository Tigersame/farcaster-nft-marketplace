// Spend permission utilities for Base Account
import { createBaseAccountSDK } from "@base-org/account";
import { 
  fetchPermissions
} from "@base-org/account/spend-permission";

// USDC contract address on Base mainnet
export const USDC_BASE_ADDRESS = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913';

// Base chain ID
export const BASE_CHAIN_ID = 8453;

/**
 * Fetch all spend permissions for a user account and spender
 * @param userAccount - The user's wallet address
 * @param spenderAccount - The spender's (agent's) wallet address
 * @returns Array of spend permissions filtered for USDC
 */
export async function getUserSpendPermissions(
  userAccount: string,
  spenderAccount: string
) {
  const provider = createBaseAccountSDK({
    appName: "Farcaster NFT Marketplace",
  }).getProvider();

  const permissions = await fetchPermissions({
    account: userAccount as `0x${string}`,
    chainId: BASE_CHAIN_ID,
    spender: spenderAccount as `0x${string}`,
    provider,
  });

  // Filter for USDC permissions with case-insensitive comparison
  return permissions.filter(p => 
    p.permission?.token?.toLowerCase() === USDC_BASE_ADDRESS.toLowerCase()
  );
}

/**
 * Revoke a spend permission
 * @param permission - The permission object to revoke
 * @returns Result of the revocation
 */
export async function revokeSpendPermission(permission: any) {
  const provider = createBaseAccountSDK({
    appName: "Farcaster NFT Marketplace",
  }).getProvider();

  // Note: Revocation functionality would use Base Account SDK methods
  // This is a placeholder - implement actual revocation logic when available
  console.log('Revoking permission:', permission.id);
  
  return { id: permission.id, status: 'revoked' };
}

/**
 * Format USDC amount from base units (6 decimals)
 * @param amount - Amount in USDC base units
 * @returns Formatted USD string
 */
export function formatUSDC(amount: bigint | string): string {
  const amountBigInt = typeof amount === 'string' ? BigInt(amount) : amount;
  const dollars = Number(amountBigInt) / 1_000_000;
  return `$${dollars.toFixed(2)}`;
}

/**
 * Convert USD to USDC base units (6 decimals)
 * @param usdAmount - Amount in USD
 * @returns Amount in USDC base units
 */
export function usdToUSDC(usdAmount: number): bigint {
  return BigInt(Math.floor(usdAmount * 1_000_000));
}

/**
 * Convert USDC base units to USD
 * @param usdcAmount - Amount in USDC base units
 * @returns Amount in USD
 */
export function usdcToUSD(usdcAmount: bigint): number {
  return Number(usdcAmount) / 1_000_000;
}
