/**
 * Validation Schemas for FarcastSea
 * Uses Zod for runtime type validation and sanitization
 */

import { z } from 'zod';

// Ethereum Address Schema
export const ethereumAddressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address')
  .transform(addr => addr.toLowerCase());

// Token ID Schema
export const tokenIdSchema = z
  .string()
  .regex(/^[a-zA-Z0-9-]+$/, 'Invalid token ID format')
  .min(1)
  .max(100);

// Farcaster FID Schema
export const fidSchema = z
  .number()
  .int()
  .positive()
  .max(999999999);

// URL Schema
export const urlSchema = z
  .string()
  .url()
  .refine(url => {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  }, 'URL must use http or https protocol');

// IPFS CID Schema
export const ipfsCIDSchema = z
  .string()
  .regex(/^(Qm[1-9A-HJ-NP-Za-km-z]{44}|[a-z0-9]{59})$/, 'Invalid IPFS CID');

// Price Schema (ETH)
export const priceSchema = z
  .string()
  .regex(/^\d+(\.\d{1,18})?$/, 'Invalid price format')
  .refine(price => {
    const num = parseFloat(price);
    return num >= 0 && num <= 1000000;
  }, 'Price must be between 0 and 1,000,000 ETH');

// NFT Name Schema
export const nftNameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name must be 100 characters or less')
  .regex(/^[a-zA-Z0-9\s#@&._-]+$/, 'Name contains invalid characters');

// NFT Description Schema
export const nftDescriptionSchema = z
  .string()
  .max(1000, 'Description must be 1000 characters or less')
  .optional();

// Frame Button Index Schema
export const frameButtonSchema = z
  .number()
  .int()
  .min(1)
  .max(4);

// Farcaster Frame Request Body Schema
export const farcasterFrameSchema = z.object({
  untrustedData: z.object({
    fid: fidSchema,
    url: urlSchema,
    messageHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid message hash'),
    timestamp: z.number().int().positive(),
    network: z.number().int(),
    buttonIndex: frameButtonSchema,
    inputText: z.string().max(256).optional(),
    castId: z.object({
      fid: fidSchema,
      hash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid cast hash'),
    }),
  }),
  trustedData: z.object({
    messageBytes: z.string(),
  }),
});

// NFT Creation Schema
export const nftCreationSchema = z.object({
  name: nftNameSchema,
  description: nftDescriptionSchema.optional(),
  image: z.string().url('Invalid image URL'),
  price: priceSchema,
  creator: ethereumAddressSchema,
  externalUrl: z.string().url('Invalid external URL').optional(),
  creatorAddress: ethereumAddressSchema.optional(),
  attributes: z.array(z.object({
    trait_type: z.string().max(50),
    value: z.union([z.string().max(100), z.number()]),
  })).max(20).optional(),
});

// NFT Listing Schema
export const nftListingSchema = z.object({
  tokenId: tokenIdSchema,
  price: priceSchema,
  seller: ethereumAddressSchema,
});

// NFT Purchase Schema
export const nftPurchaseSchema = z.object({
  tokenId: tokenIdSchema,
  buyer: ethereumAddressSchema,
  price: priceSchema,
});

// Transaction Schema
export const transactionSchema = z.object({
  to: ethereumAddressSchema,
  data: z.string().regex(/^0x[a-fA-F0-9]*$/, 'Invalid transaction data'),
  value: z.string().regex(/^0x[a-fA-F0-9]+$/, 'Invalid value').optional(),
});

// Admin Authentication Schema
export const adminAuthSchema = z.object({
  address: ethereumAddressSchema,
  signature: z.string().regex(/^0x[a-fA-F0-9]+$/, 'Invalid signature'),
  message: z.string().min(1).max(500),
  timestamp: z.number().int().positive(),
});

// File Upload Schema
export const fileUploadSchema = z.object({
  name: z.string().max(255),
  type: z.enum([
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ]),
  size: z.number().int().positive().max(10 * 1024 * 1024), // 10MB max
});

// Metadata Schema
export const metadataSchema = z.object({
  name: nftNameSchema,
  description: nftDescriptionSchema,
  image: z.string().url(),
  external_url: urlSchema.optional(),
  attributes: z.array(z.object({
    trait_type: z.string().max(50),
    value: z.union([z.string().max(100), z.number()]),
  })).max(20).optional(),
});

// Chain ID Schema
export const chainIdSchema = z.union([
  z.literal(1), // Mainnet
  z.literal(8453), // Base
  z.literal(84532), // Base Sepolia
]);

// Pagination Schema
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

// Sort Schema
export const sortSchema = z.object({
  field: z.enum(['price', 'timestamp', 'name', 'tokenId']),
  order: z.enum(['asc', 'desc']),
});

// Search/Filter Schema
export const nftFilterSchema = z.object({
  minPrice: priceSchema.optional(),
  maxPrice: priceSchema.optional(),
  creator: ethereumAddressSchema.optional(),
  owner: ethereumAddressSchema.optional(),
  search: z.string().max(100).optional(),
  category: z.string().max(50).optional(),
}).merge(paginationSchema).merge(sortSchema.partial());

// API Response Schema
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  timestamp: z.number().int().positive(),
});

// Export type inference helpers
export type EthereumAddress = z.infer<typeof ethereumAddressSchema>;
export type TokenId = z.infer<typeof tokenIdSchema>;
export type FID = z.infer<typeof fidSchema>;
export type FarcasterFrameRequest = z.infer<typeof farcasterFrameSchema>;
export type NFTCreation = z.infer<typeof nftCreationSchema>;
export type NFTListing = z.infer<typeof nftListingSchema>;
export type NFTPurchase = z.infer<typeof nftPurchaseSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
export type AdminAuth = z.infer<typeof adminAuthSchema>;
export type FileUpload = z.infer<typeof fileUploadSchema>;
export type Metadata = z.infer<typeof metadataSchema>;
export type ChainId = z.infer<typeof chainIdSchema>;
export type NFTFilter = z.infer<typeof nftFilterSchema>;
export type APIResponse = z.infer<typeof apiResponseSchema>;

// Validation helper functions
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return { 
        success: false, 
        error: `${firstError.path.join('.')}: ${firstError.message}` 
      };
    }
    return { success: false, error: 'Validation failed' };
  }
}

export function validateInputSafe<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T | null {
  try {
    return schema.parse(data);
  } catch {
    return null;
  }
}
