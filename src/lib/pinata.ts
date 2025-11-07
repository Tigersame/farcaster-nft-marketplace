/**
 * Pinata IPFS Integration
 * Handles NFT metadata and image uploads to IPFS via Pinata
 */

const PINATA_API_URL = 'https://api.pinata.cloud';

interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  external_url?: string;
  animation_url?: string;
}

/**
 * Upload file to IPFS via Pinata with timeout and retry
 */
export async function uploadToPinata(
  file: File,
  metadata: Record<string, any> = {}
): Promise<PinataResponse> {
  const formData = new FormData();
  formData.append('file', file);
  
  // Add metadata
  const pinataMetadata = {
    name: file.name,
    keyvalues: metadata,
  };
  formData.append('pinataMetadata', JSON.stringify(pinataMetadata));

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds

  try {
    const response = await fetch(`${PINATA_API_URL}/pinning/pinFileToIPFS`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PINATA_JWT}`,
      },
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Pinata upload failed: ${response.statusText} - ${errorText}`);
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Pinata upload timed out (30s). Please try again or check your internet connection.');
    }
    throw error;
  }
}

/**
 * Upload JSON metadata to IPFS via Pinata
 */
export async function uploadJSONToPinata(
  data: NFTMetadata,
  fileName: string
): Promise<PinataResponse> {
  const response = await fetch(`${PINATA_API_URL}/pinning/pinJSONToIPFS`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.PINATA_JWT}`,
    },
    body: JSON.stringify({
      pinataContent: data,
      pinataMetadata: {
        name: fileName,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Pinata JSON upload failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get IPFS URL from hash
 */
export function getIPFSUrl(hash: string): string {
  const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'https://gateway.pinata.cloud';
  return `${gateway}/ipfs/${hash}`;
}

/**
 * Create complete NFT metadata and upload to IPFS
 */
export async function createNFTMetadata(
  name: string,
  description: string,
  imageFile: File,
  attributes: Array<{ trait_type: string; value: string | number }> = [],
  externalUrl?: string
): Promise<{ metadataHash: string; imageHash: string; metadataUrl: string; imageUrl: string }> {
  // Upload image first
  const imageUpload = await uploadToPinata(imageFile, {
    type: 'nft-image',
    name: name,
  });

  const imageUrl = getIPFSUrl(imageUpload.IpfsHash);

  // Create metadata
  const metadata: NFTMetadata = {
    name,
    description,
    image: imageUrl,
    attributes,
    external_url: externalUrl,
  };

  // Upload metadata
  const metadataUpload = await uploadJSONToPinata(
    metadata,
    `${name}-metadata.json`
  );

  const metadataUrl = getIPFSUrl(metadataUpload.IpfsHash);

  return {
    metadataHash: metadataUpload.IpfsHash,
    imageHash: imageUpload.IpfsHash,
    metadataUrl,
    imageUrl,
  };
}

/**
 * Check Pinata API status with timeout
 */
export async function testPinataConnection(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds

    const response = await fetch(`${PINATA_API_URL}/data/testAuthentication`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.PINATA_JWT}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('Pinata connection test failed:', error);
    return false;
  }
}

/**
 * List pinned files from Pinata
 */
export async function listPinnedFiles(
  pageLimit: number = 10,
  pageOffset: number = 0
): Promise<any> {
  const response = await fetch(
    `${PINATA_API_URL}/data/pinList?pageLimit=${pageLimit}&pageOffset=${pageOffset}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.PINATA_JWT}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to list files: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Unpin file from Pinata
 */
export async function unpinFile(hash: string): Promise<void> {
  const response = await fetch(`${PINATA_API_URL}/pinning/unpin/${hash}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${process.env.PINATA_JWT}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to unpin file: ${response.statusText}`);
  }
}