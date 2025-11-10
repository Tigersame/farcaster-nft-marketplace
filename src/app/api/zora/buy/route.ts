// Zora creator coin purchase API
import { NextRequest, NextResponse } from 'next/server';
import { usdToUSDC } from '@/lib/spend-permissions';
import { parseZoraHandle, validatePurchaseAmount } from '@/lib/openai';

/**
 * POST /api/zora/buy
 * Execute a Zora creator coin purchase using spend permissions
 */
export async function POST(request: NextRequest) {
  try {
    // Get session from cookie
    const session = request.cookies.get('session')?.value;
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { zoraHandle, amountUSD, permission } = await request.json();

    if (!zoraHandle || !amountUSD) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate purchase amount
    const validation = validatePurchaseAmount(amountUSD);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Parse and clean the Zora handle
    const cleanHandle = parseZoraHandle(zoraHandle);

    // Convert USD to USDC (6 decimals)
    const amountUSDC = usdToUSDC(amountUSD);

    console.log(`Processing purchase: ${amountUSD} USD (${amountUSDC} USDC) of @${cleanHandle}'s creator coin`);

    // In a real implementation, you would:
    // 1. Prepare spend calls using the permission
    // const spendCalls = await prepareSpendCallData(permission, amountUSDC);
    // 
    // 2. Get Zora creator coin contract address and prepare swap call
    // const zoraCreatorAddress = await getZoraCreatorAddress(cleanHandle);
    // 
    // 3. Execute with gas sponsorship via CDP Paymaster
    // const result = await sendCalls({
    //   calls: [...spendCalls, ...swapCalls],
    //   capabilities: {
    //     paymasterService: {
    //       url: process.env.PAYMASTER_URL,
    //     },
    //   },
    // });

    // For demonstration, simulate successful transaction
    const mockTransactionHash = `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;

    return NextResponse.json({ 
      success: true, 
      transactionHash: mockTransactionHash,
      message: `Successfully purchased $${amountUSD} worth of @${cleanHandle}'s creator coin! 🎉`,
      details: {
        handle: cleanHandle,
        amountUSD,
        amountUSDC: amountUSDC.toString(),
        gasSponsored: true,
        network: 'Base',
      }
    });
  } catch (error: any) {
    console.error('Purchase error:', error);
    return NextResponse.json(
      { 
        error: 'Purchase failed',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/zora/buy
 * Get information about a Zora creator (for preview/validation)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const handle = searchParams.get('handle');

    if (!handle) {
      return NextResponse.json(
        { error: 'Handle parameter required' },
        { status: 400 }
      );
    }

    const cleanHandle = parseZoraHandle(handle);

    // In a real implementation, fetch creator data from Zora API
    // const creatorData = await zoraClient.getCreator(cleanHandle);

    // Mock creator data
    return NextResponse.json({
      handle: cleanHandle,
      displayName: `@${cleanHandle}`,
      coinPrice: '0.001',
      coinSymbol: `${cleanHandle.toUpperCase()}`,
      verified: true,
      exists: true,
    });
  } catch (error: any) {
    console.error('Creator lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch creator info' },
      { status: 500 }
    );
  }
}
