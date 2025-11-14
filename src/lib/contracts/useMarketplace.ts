import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseEther } from 'viem';
import { MARKETPLACE_ABI } from './marketplaceABI';

const MARKETPLACE_ADDRESS = (process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT || '0x5FbDB2315678afecb367f032d93F642f64180aa3') as `0x${string}`;

/**
 * Hook to buy an NFT from the marketplace
 */
export function useBuyNFT() {
  const { data: hash, writeContract, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const buyNFT = (tokenId: string, price: string) => {
    writeContract({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: 'buyNFT',
      args: [BigInt(tokenId)],
      value: parseEther(price),
    });
  };

  return {
    buyNFT,
    isLoading: isPending || isConfirming,
    isSuccess,
    txHash: hash,
  };
}

/**
 * Hook to list an NFT for sale
 */
export function useListNFT() {
  const { data: hash, writeContract, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const listNFT = (tokenId: string, price: string) => {
    writeContract({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: 'listNFT',
      args: [BigInt(tokenId), parseEther(price)],
    });
  };

  return {
    listNFT,
    isLoading: isPending || isConfirming,
    isSuccess,
    txHash: hash,
  };
}

/**
 * Hook to mint an NFT
 */
export function useMintNFT() {
  const { data: hash, writeContract, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const mintNFT = (metadataURI: string, royaltyPercentage: number = 500) => {
    writeContract({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: 'mintNFT',
      args: [metadataURI, BigInt(royaltyPercentage)],
    });
  };

  return {
    mintNFT,
    isLoading: isPending || isConfirming,
    isSuccess,
    txHash: hash,
  };
}

/**
 * Hook to cancel an NFT listing
 */
export function useCancelListing() {
  const { data: hash, writeContract, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const cancelListing = (tokenId: string) => {
    writeContract({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: 'cancelListing',
      args: [BigInt(tokenId)],
    });
  };

  return {
    cancelListing,
    isLoading: isPending || isConfirming,
    isSuccess,
    txHash: hash,
  };
}

/**
 * Hook to get listing details
 */
export function useGetListing(tokenId: string) {
  const { data, isLoading, isError } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'listings',
    args: [BigInt(tokenId)],
  });

  return {
    listing: data as any,
    isLoading,
    isError,
  };
}

/**
 * Hook to get platform fee
 */
export function useGetPlatformFee() {
  const { data, isLoading } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'platformFee',
  });

  return {
    platformFee: data ? Number(data) / 100 : 2.5, // Convert basis points to percentage
    isLoading,
  };
}
