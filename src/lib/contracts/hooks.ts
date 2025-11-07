import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { MARKETPLACE_ABI, MARKETPLACE_ADDRESS } from './marketplaceContract';

// Hook to get marketplace stats
export function useMarketplaceStats() {
  return useContractRead({
    address: MARKETPLACE_ADDRESS as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'getMarketplaceStats',
  });
}

// Hook to get active listings
export function useActiveListings() {
  return useContractRead({
    address: MARKETPLACE_ADDRESS as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'getActiveListings',
  });
}

// Hook to get NFT metadata
export function useNFTMetadata(tokenId: number) {
  return useContractRead({
    address: MARKETPLACE_ADDRESS as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'getNFTMetadata',
    args: [BigInt(tokenId)],
    enabled: tokenId > 0,
  });
}

// Hook to mint NFT
export function useMintNFT() {
  const { config } = usePrepareContractWrite({
    address: MARKETPLACE_ADDRESS as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'mintNFT',
  });

  const { data, write, isLoading: isWriting } = useContractWrite(config);
  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return {
    mintNFT: write,
    isLoading: isWriting || isConfirming,
    isSuccess,
    data,
  };
}

// Hook to list NFT
export function useListNFT(tokenId: number, priceInEth: string) {
  const { config } = usePrepareContractWrite({
    address: MARKETPLACE_ADDRESS as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'listNFT',
    args: [BigInt(tokenId), parseEther(priceInEth)],
    enabled: tokenId > 0 && parseFloat(priceInEth) > 0,
  });

  const { data, write, isLoading: isWriting } = useContractWrite(config);
  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return {
    listNFT: write,
    isLoading: isWriting || isConfirming,
    isSuccess,
    data,
  };
}

// Hook to buy NFT
export function useBuyNFT(tokenId: number, priceInEth: string) {
  const { config } = usePrepareContractWrite({
    address: MARKETPLACE_ADDRESS as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'buyNFT',
    args: [BigInt(tokenId)],
    value: parseEther(priceInEth),
    enabled: tokenId > 0 && parseFloat(priceInEth) > 0,
  });

  const { data, write, isLoading: isWriting } = useContractWrite(config);
  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return {
    buyNFT: write,
    isLoading: isWriting || isConfirming,
    isSuccess,
    data,
  };
}

// Hook to cancel listing
export function useCancelListing(tokenId: number) {
  const { config } = usePrepareContractWrite({
    address: MARKETPLACE_ADDRESS as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'cancelListing',
    args: [BigInt(tokenId)],
    enabled: tokenId > 0,
  });

  const { data, write, isLoading: isWriting } = useContractWrite(config);
  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return {
    cancelListing: write,
    isLoading: isWriting || isConfirming,
    isSuccess,
    data,
  };
}

// Hook to withdraw funds
export function useWithdraw() {
  const { config } = usePrepareContractWrite({
    address: MARKETPLACE_ADDRESS as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'withdraw',
  });

  const { data, write, isLoading: isWriting } = useContractWrite(config);
  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return {
    withdraw: write,
    isLoading: isWriting || isConfirming,
    isSuccess,
    data,
  };
}

// Hook to check pending withdrawals
export function usePendingWithdrawals(address: string) {
  return useContractRead({
    address: MARKETPLACE_ADDRESS as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'pendingWithdrawals',
    args: [address as `0x${string}`],
    enabled: !!address,
  });
}
