/**
 * API Route: Create NFT with IPFS metadata
 * POST /api/nft/create
 */

import { NextRequest, NextResponse } from 'next/server';
import { createNFTMetadata, testPinataConnection } from '@/lib/pinata';
import { SecurityUtils } from '@/lib/security';
import { addSecurityHeaders } from '@/lib/middleware';
import { validateInputSafe, nftCreationSchema, ethereumAddressSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  const ip = request.ip || 'unknown'
  
  try {
    console.log('🚀 NFT creation request received');
    
    // Very strict rate limiting for NFT creation (2 per minute)
    SecurityUtils.checkRateLimit(ip, 2, 60000)
    
    // Check Pinata connection (but don't fail if it's slow)
    const isConnected = await testPinataConnection();
    if (!isConnected) {
      console.warn('⚠️ Pinata connection test failed, but continuing anyway...');
    }

    const formData = await request.formData();
    
    // Extract and validate form fields
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const imageFile = formData.get('image') as File;
    const attributesString = formData.get('attributes') as string;
    const externalUrl = formData.get('externalUrl') as string;
    const creatorAddress = formData.get('creatorAddress') as string;

    // Validate required fields
    if (!name || !description || !imageFile) {
      console.warn(`Missing required fields from ${ip}`);
      const response = NextResponse.json(
        { error: 'Name, description, and image are required' },
        { status: 400 }
      );
      addSecurityHeaders(response);
      return response;
    }

    // Validate NFT creation data
    const nftData = {
      name: SecurityUtils.sanitizeString(name),
      description: SecurityUtils.sanitizeString(description),
      externalUrl: externalUrl ? SecurityUtils.sanitizeString(externalUrl) : undefined,
      creatorAddress: creatorAddress ? SecurityUtils.sanitizeAddress(creatorAddress) : undefined
    };

    const validatedNftData = validateInputSafe(nftCreationSchema, nftData);
    if (!validatedNftData) {
      console.warn(`Invalid NFT data from ${ip}:`, nftData);
      const response = NextResponse.json(
        { error: 'Invalid NFT data format' },
        { status: 400 }
      );
      addSecurityHeaders(response);
      return response;
    }

    // Validate creator address if provided
    if (creatorAddress) {
      const validatedAddress = validateInputSafe(ethereumAddressSchema, creatorAddress);
      if (!validatedAddress) {
        console.warn(`Invalid creator address from ${ip}: ${creatorAddress}`);
        const response = NextResponse.json(
          { error: 'Invalid creator address format' },
          { status: 400 }
        );
        addSecurityHeaders(response);
        return response;
      }
    }

    // Validate image file
    if (!imageFile.type.startsWith('image/')) {
      console.warn(`Invalid file type from ${ip}: ${imageFile.type}`);
      const response = NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
      addSecurityHeaders(response);
      return response;
    }

    // Check file size (limit to 10MB)
    if (imageFile.size > 10 * 1024 * 1024) {
      console.warn(`File too large from ${ip}: ${imageFile.size} bytes`);
      const response = NextResponse.json(
        { error: 'Image file too large (max 10MB)' },
        { status: 400 }
      );
      addSecurityHeaders(response);
      return response;
    }

    // Parse and validate attributes
    let attributes: Array<{ trait_type: string; value: string | number }> = [];
    if (attributesString) {
      try {
        const parsedAttributes = JSON.parse(attributesString);
        if (!Array.isArray(parsedAttributes)) {
          throw new Error('Attributes must be an array');
        }
        
        // Validate each attribute
        attributes = parsedAttributes.map(attr => {
          if (!attr.trait_type || !attr.value) {
            throw new Error('Each attribute must have trait_type and value');
          }
          return {
            trait_type: SecurityUtils.sanitizeString(attr.trait_type),
            value: SecurityUtils.sanitizeString(attr.value)
          };
        });
      } catch (error) {
        console.warn(`Invalid attributes from ${ip}:`, attributesString);
        const response = NextResponse.json(
          { error: 'Invalid attributes format' },
          { status: 400 }
        );
        addSecurityHeaders(response);
        return response;
      }
    }

    // Add creator attribute
    if (validatedNftData.creatorAddress) {
      attributes.push({
        trait_type: 'Creator',
        value: validatedNftData.creatorAddress,
      });
    }

    // Add creation timestamp
    attributes.push({
      trait_type: 'Created',
      value: new Date().toISOString(),
    });

    console.log(`Creating NFT for ${ip}: ${validatedNftData.name}`);

    // Upload to IPFS (with automatic fallback for network issues)
    const result = await createNFTMetadata(
      validatedNftData.name,
      validatedNftData.description || '',
      imageFile,
      attributes,
      validatedNftData.externalUrl
    );

    // Return success response
    const response = NextResponse.json({
      success: true,
      data: {
        name: validatedNftData.name,
        description: validatedNftData.description || '',
        metadataHash: result.metadataHash,
        imageHash: result.imageHash,
        metadataUrl: result.metadataUrl,
        imageUrl: result.imageUrl,
        attributes,
      },
    });
    addSecurityHeaders(response);
    return response;

  } catch (error) {
    console.error('NFT creation error:', error);
    
    // Handle rate limit errors
    if (error instanceof Error && error.message.includes('Rate limit exceeded')) {
      const response = NextResponse.json({ error: 'Too many NFT creation requests' }, { status: 429 });
      addSecurityHeaders(response);
      return response;
    }
    
    // Don't leak error details in production
    const errorMessage = process.env.NODE_ENV === 'development'
      ? (error instanceof Error ? error.message : 'Unknown error')
      : 'Failed to create NFT';
    
    const response = NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
    addSecurityHeaders(response);
    return response;
  }
}

export async function GET(request: NextRequest) {
  const ip = request.ip || 'unknown'
  
  try {
    // Rate limit health check requests
    SecurityUtils.checkRateLimit(ip, 20, 60000)
    
    // Test endpoint to verify Pinata connection
    const isConnected = await testPinataConnection();
    
    const response = NextResponse.json({
      status: 'ok',
      ipfsConnected: isConnected,
      timestamp: new Date().toISOString(),
    });
    addSecurityHeaders(response);
    return response;
  } catch (error) {
    // Handle rate limit errors
    if (error instanceof Error && error.message.includes('Rate limit exceeded')) {
      const response = NextResponse.json({ error: 'Too many requests' }, { status: 429 });
      addSecurityHeaders(response);
      return response;
    }
    
    const response = NextResponse.json(
      { error: 'Service unavailable' },
      { status: 503 }
    );
    addSecurityHeaders(response);
    return response;
  }
}