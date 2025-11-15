/**
 * Base Network Utilities
 * Handles wallet network switching and chain management
 */

export const baseChain = {
  chainId: "0x2105", // 8453 in hex
  chainIdDecimal: 8453,
  chainName: "Base Mainnet",
  nativeCurrency: { 
    name: "Ether", 
    symbol: "ETH", 
    decimals: 18 
  },
  rpcUrls: ["https://mainnet.base.org"],
  blockExplorerUrls: ["https://basescan.org"]
};

export const baseSepoliaChain = {
  chainId: "0x14a34", // 84532 in hex
  chainIdDecimal: 84532,
  chainName: "Base Sepolia",
  nativeCurrency: { 
    name: "Ether", 
    symbol: "ETH", 
    decimals: 18 
  },
  rpcUrls: ["https://sepolia.base.org"],
  blockExplorerUrls: ["https://sepolia.basescan.org"]
};

/**
 * Ensures wallet is connected to Base network
 * Automatically adds network if not present
 */
export async function ensureBase(testnet = false): Promise<boolean> {
  if (!window.ethereum) {
    throw new Error("No wallet detected. Please install MetaMask or Coinbase Wallet.");
  }

  const targetChain = testnet ? baseSepoliaChain : baseChain;

  try {
    // Try to switch to Base
    await window.ethereum.request({ 
      method: "wallet_switchEthereumChain", 
      params: [{ chainId: targetChain.chainId }] 
    });
    return true;
  } catch (switchError: any) {
    // Error code 4902: chain not found in wallet
    if (switchError?.code === 4902) {
      try {
        // Ask user to add Base network
        await window.ethereum.request({ 
          method: "wallet_addEthereumChain", 
          params: [targetChain] 
        });
        return true;
      } catch (addError) {
        console.error("Failed to add Base network:", addError);
        throw new Error("Failed to add Base network to wallet");
      }
    } else if (switchError?.code === 4001) {
      // User rejected the request
      throw new Error("User rejected network switch");
    } else {
      throw switchError;
    }
  }
}

/**
 * Check if currently on Base network
 */
export async function isOnBase(testnet = false): Promise<boolean> {
  if (!window.ethereum) return false;

  try {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    const targetChainId = testnet ? baseSepoliaChain.chainId : baseChain.chainId;
    return chainId === targetChainId;
  } catch (error) {
    console.error("Failed to check network:", error);
    return false;
  }
}

/**
 * Get current chain ID
 */
export async function getCurrentChainId(): Promise<string | null> {
  if (!window.ethereum) return null;

  try {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    return chainId;
  } catch (error) {
    console.error("Failed to get chain ID:", error);
    return null;
  }
}

/**
 * Listen for network changes
 */
export function onNetworkChange(callback: (chainId: string) => void): () => void {
  if (!window.ethereum) return () => {};

  const handler = (chainId: string) => {
    callback(chainId);
  };

  window.ethereum.on("chainChanged", handler);

  // Return cleanup function
  return () => {
    if (window.ethereum) {
      window.ethereum.removeListener("chainChanged", handler);
    }
  };
}

/**
 * Format chain ID for display
 */
export function formatChainId(chainId: string): number {
  return parseInt(chainId, 16);
}

/**
 * Get network name from chain ID
 */
export function getNetworkName(chainId: string): string {
  const chainIdNum = formatChainId(chainId);
  
  switch (chainIdNum) {
    case 8453:
      return "Base Mainnet";
    case 84532:
      return "Base Sepolia";
    case 1:
      return "Ethereum Mainnet";
    case 5:
      return "Goerli Testnet";
    default:
      return `Unknown Network (${chainIdNum})`;
  }
}
