/**
 * API Route: Create NFT with IPFS metadata
 * POST /api/nft/create
 */

import { NextRequest, NextResponse } from 'next/server';
import { createNFTMetadata, testPinataConnection } from '@/lib/pinata';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 NFT creation request received');
    
    // Check Pinata connection (but don't fail if it's slow)
    const isConnected = await testPinataConnection();
    if (!isConnected) {
      console.warn('⚠️ Pinata connection test failed, but continuing anyway...');
    }

    const formData = await request.formData();
    
    // Extract form fields
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const imageFile = formData.get('image') as File;
    const attributesString = formData.get('attributes') as string;
    const externalUrl = formData.get('externalUrl') as string;
    const creatorAddress = formData.get('creatorAddress') as string;

    // Validation
    if (!name || !description || !imageFile) {
      return NextResponse.json(
        { error: 'Name, description, and image are required' },
        { status: 400 }
      );
    }

    // Parse attributes
    let attributes = [];
    if (attributesString) {
      try {
        attributes = JSON.parse(attributesString);
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid attributes format' },
          { status: 400 }
        );
      }
    }

    // Add creator attribute
    if (creatorAddress) {
      attributes.push({
        trait_type: 'Creator',
        value: creatorAddress,
      });
    }

    // Add creation timestamp
    attributes.push({
      trait_type: 'Created',
      value: new Date().toISOString(),
    });

    // Upload to IPFS (with automatic fallback for network issues)
    const result = await createNFTMetadata(
      name,
      description,
      imageFile,
      attributes,
      externalUrl
    );

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        name,
        description,
        metadataHash: result.metadataHash,
        imageHash: result.imageHash,
        metadataUrl: result.metadataUrl,
        imageUrl: result.imageUrl,
        attributes,
      },
    });

  } catch (error) {
    console.error('NFT creation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create NFT',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Test endpoint to verify Pinata connection
    const isConnected = await testPinataConnection();
    
    return NextResponse.json({
      status: 'ok',
      ipfsConnected: isConnected,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Service unavailable' },
      { status: 503 }
    );
  }
}