import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { MARKETPLACE_ABI, MARKETPLACE_ADDRESS } from './marketplaceContract';

// Hook to get marketplace stats
export function useMarketplaceStats() {
  return useReadContract({
    address: MARKETPLACE_ADDRESS as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'getMarketplaceStats',
  });
}

// Hook to get active listings
export function useActiveListings() {
  return useReadContract({
    address: MARKETPLACE_ADDRESS as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'getActiveListings',
  });
}

// Hook to get NFT metadata
export function useNFTMetadata(tokenId: number) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'getNFTMetadata',
    args: [BigInt(tokenId)],
    query: {
      enabled: tokenId > 0,
    },
  });
}

// Hook to mint NFT
export function useMintNFT() {
  const { data: hash, writeContract, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const mintNFT = (metadataURI: string, royaltyPercentage: number) => {
    writeContract({
      address: MARKETPLACE_ADDRESS as `0x${string}`,
      abi: MARKETPLACE_ABI,
      functionName: 'mintNFT',
      args: [metadataURI, BigInt(royaltyPercentage)],
    });
  };

  return {
    mintNFT,
    isLoading: isPending || isConfirming,
    isSuccess,
    hash,
  };
}

// Hook to list NFT
export function useListNFT() {
  const { data: hash, writeContract, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const listNFT = (tokenId: number, priceInEth: string) => {
    writeContract({
      address: MARKETPLACE_ADDRESS as `0x${string}`,
      abi: MARKETPLACE_ABI,
      functionName: 'listNFT',
      args: [BigInt(tokenId), parseEther(priceInEth)],
    });
  };

  return {
    listNFT,
    isLoading: isPending || isConfirming,
    isSuccess,
    hash,
  };
}

// Hook to buy NFT
export function useBuyNFT() {
  const { data: hash, writeContract, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const buyNFT = (tokenId: number, priceInEth: string) => {
    writeContract({
      address: MARKETPLACE_ADDRESS as `0x${string}`,
      abi: MARKETPLACE_ABI,
      functionName: 'buyNFT',
      args: [BigInt(tokenId)],
      value: parseEther(priceInEth),
    });
  };

  return {
    buyNFT,
    isLoading: isPending || isConfirming,
    isSuccess,
    hash,
  };
}

// Hook to cancel listing
export function useCancelListing() {
  const { data: hash, writeContract, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const cancelListing = (tokenId: number) => {
    writeContract({
      address: MARKETPLACE_ADDRESS as `0x${string}`,
      abi: MARKETPLACE_ABI,
      functionName: 'cancelListing',
      args: [BigInt(tokenId)],
    });
  };

  return {
    cancelListing,
    isLoading: isPending || isConfirming,
    isSuccess,
    hash,
  };
}

// Hook to withdraw funds
export function useWithdraw() {
  const { data: hash, writeContract, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const withdraw = () => {
    writeContract({
      address: MARKETPLACE_ADDRESS as `0x${string}`,
      abi: MARKETPLACE_ABI,
      functionName: 'withdraw',
    });
  };

  return {
    withdraw,
    isLoading: isPending || isConfirming,
    isSuccess,
    hash,
  };
}

// Hook to check pending withdrawals
export function usePendingWithdrawals(address: string) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'pendingWithdrawals',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address,
    },
  });
}
