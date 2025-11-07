/**
 * API Route: Test Pinata connection and upload capability
 * GET /api/test/pinata
 */

import { NextRequest, NextResponse } from 'next/server';
import { testPinataConnection, uploadJSONToPinata } from '@/lib/pinata';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing Pinata connection...');

    // Test 1: Authentication
    const isConnected = await testPinataConnection();
    
    if (!isConnected) {
      return NextResponse.json({
        success: false,
        error: 'Pinata authentication failed',
        details: 'Unable to connect to Pinata API'
      }, { status: 503 });
    }

    // Test 2: Small JSON upload
    const testData = {
      name: 'Test Upload',
      description: 'Testing Pinata upload functionality',
      image: 'https://example.com/test-image.png', // Required field for NFTMetadata
      timestamp: new Date().toISOString(),
      test: true,
      attributes: [
        {
          trait_type: 'Test',
          value: 'true'
        }
      ]
    };

    try {
      const uploadResult = await uploadJSONToPinata(testData, 'test-upload.json');
      
      return NextResponse.json({
        success: true,
        message: 'Pinata is working correctly!',
        data: {
          authentication: 'success',
          upload: 'success',
          ipfsHash: uploadResult.IpfsHash,
          ipfsUrl: `https://gateway.pinata.cloud/ipfs/${uploadResult.IpfsHash}`,
          testData
        }
      });
      
    } catch (uploadError: any) {
      return NextResponse.json({
        success: false,
        error: 'Upload failed',
        details: uploadError.message,
        data: {
          authentication: 'success',
          upload: 'failed'
        }
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Pinata test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Pinata test failed',
      details: error.message
    }, { status: 500 });
  }
}