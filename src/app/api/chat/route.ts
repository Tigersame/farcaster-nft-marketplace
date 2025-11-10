// AI Chat processing API
import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse, type ChatMessage } from '@/lib/openai';

/**
 * POST /api/chat
 * Process chat messages and execute AI agent functions
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

    const { messages, userAddress } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // Extract user address from session
    const sessionAddress = Buffer.from(session, 'base64').toString().split(':')[0];

    console.log(`Processing chat for user: ${sessionAddress}`);

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        message: "I'm currently unable to process requests as the AI service is not configured. Please contact the administrator.",
        toolCall: false,
        error: 'AI service not configured'
      });
    }

    // Generate AI response
    const response = await generateChatResponse(messages);
    const choice = response.choices[0];

    // Check if AI wants to call a function
    if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
      const toolCall = choice.message.tool_calls[0];
      
      if ('function' in toolCall && toolCall.function.name === 'buy_zora_coin') {
        try {
          const args = JSON.parse(toolCall.function.arguments);
          const { zoraHandle, amountUSD } = args;

          console.log(`AI agent executing: buy_zora_coin for @${zoraHandle} with $${amountUSD}`);

          // Get stored spend permission from request
          const permission = await getStoredPermission(sessionAddress);

          // Execute the purchase
          const purchaseResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/zora/buy`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Cookie': `session=${session}`
            },
            body: JSON.stringify({ 
              zoraHandle, 
              amountUSD, 
              permission,
              userAddress: sessionAddress 
            }),
          });

          const purchaseData = await purchaseResponse.json();

          if (purchaseData.success) {
            return NextResponse.json({
              message: purchaseData.message,
              toolCall: true,
              functionName: 'buy_zora_coin',
              details: purchaseData.details,
              transactionHash: purchaseData.transactionHash,
            });
          } else {
            return NextResponse.json({
              message: `Sorry, the purchase failed: ${purchaseData.error}`,
              toolCall: true,
              error: purchaseData.error,
            });
          }
        } catch (error: any) {
          console.error('Function execution error:', error);
          return NextResponse.json({
            message: `Sorry, I encountered an error while processing your request: ${error.message}`,
            toolCall: true,
            error: error.message,
          });
        }
      }
    }

    // Return regular text response
    return NextResponse.json({
      message: choice.message.content || 'I apologize, but I could not generate a response.',
      toolCall: false,
    });
  } catch (error: any) {
    console.error('Chat processing error:', error);
    return NextResponse.json(
      { 
        error: 'Chat processing failed',
        message: `Sorry, I encountered an error: ${error.message}`
      },
      { status: 500 }
    );
  }
}

/**
 * Helper function to retrieve stored spend permission
 * In production, store permissions in a database
 */
async function getStoredPermission(userAddress: string): Promise<any | null> {
  // In a real implementation, retrieve from database
  // For now, return null (frontend will need to provide permission)
  return null;
}
