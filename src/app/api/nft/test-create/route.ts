/**
 * API Route: Test NFT creation without IPFS
 * POST /api/nft/test-create
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Test NFT creation request received');

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

    // Add creator and timestamp attributes
    attributes.push({
      trait_type: 'Creator',
      value: creatorAddress || 'Unknown',
    });

    attributes.push({
      trait_type: 'Created',
      value: new Date().toISOString(),
    });

    // Create mock IPFS hashes for testing
    const mockImageHash = 'QmTestImage' + Date.now();
    const mockMetadataHash = 'QmTestMetadata' + Date.now();

    // Create mock metadata
    const metadata = {
      name,
      description,
      image: `https://gateway.pinata.cloud/ipfs/${mockImageHash}`,
      attributes,
      external_url: externalUrl || undefined,
    };

    // Return success response with mock data
    return NextResponse.json({
      success: true,
      data: {
        name,
        description,
        metadataHash: mockMetadataHash,
        imageHash: mockImageHash,
        metadataUrl: `https://gateway.pinata.cloud/ipfs/${mockMetadataHash}`,
        imageUrl: `https://gateway.pinata.cloud/ipfs/${mockImageHash}`,
        attributes,
        metadata,
        note: 'This is a test creation without actual IPFS upload'
      },
    });

  } catch (error: any) {
    console.error('Test NFT creation error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}