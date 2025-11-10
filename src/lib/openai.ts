// OpenAI integration for AI agent
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// System prompt for the AI agent
export const SYSTEM_PROMPT = `You are a helpful AI agent that assists users with buying Zora creator coins on Base network.

Your capabilities:
- Buy Zora creator coins for specific user handles
- Provide information about creator coins and pricing
- Help users understand spend permissions and daily limits

Guidelines:
- Be friendly, concise, and helpful
- When users ask to buy coins, extract the handle and amount
- Confirm transactions clearly
- Explain gas sponsorship (transactions are gasless)
- Stay focused on Zora creator coin purchases

Always extract:
- zoraHandle: The @handle or username of the creator
- amountUSD: The dollar amount to spend (between $1-$2 for safety)`;

// Function definition for buying Zora creator coins
export const ZORA_BUY_FUNCTION = {
  type: 'function' as const,
  function: {
    name: 'buy_zora_coin',
    description: 'Buy a Zora creator coin for a specific user handle and amount in USD',
    parameters: {
      type: 'object',
      properties: {
        zoraHandle: {
          type: 'string',
          description: 'The Zora user handle or identifier (without @ symbol)',
        },
        amountUSD: {
          type: 'number',
          description: 'The amount in USD to spend on the creator coin (between 0.1 and 2.0)',
        },
      },
      required: ['zoraHandle', 'amountUSD'],
    },
  },
};

// Chat message interface
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Generate a chat response using OpenAI
 * @param messages - Array of chat messages
 * @param tools - Array of tool definitions (defaults to Zora buy function)
 * @returns OpenAI chat completion response
 */
export async function generateChatResponse(
  messages: ChatMessage[],
  tools: any[] = [ZORA_BUY_FUNCTION]
) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      tools,
      tool_choice: 'auto',
      max_tokens: 1000,
      temperature: 0.7,
    });

    return response;
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
}

/**
 * Parse Zora handle from user input
 * Handles formats: @handle, handle, @handle.eth
 */
export function parseZoraHandle(input: string): string {
  // Remove @ symbol and .eth suffix if present
  return input.replace(/^@/, '').replace(/\.eth$/, '').trim();
}

/**
 * Validate USD amount for creator coin purchase
 * @param amount - Amount in USD
 * @returns true if valid, error message if invalid
 */
export function validatePurchaseAmount(amount: number): { valid: boolean; error?: string } {
  if (amount < 0.1) {
    return { valid: false, error: 'Minimum purchase amount is $0.10' };
  }
  if (amount > 2.0) {
    return { valid: false, error: 'Maximum purchase amount is $2.00 per transaction' };
  }
  return { valid: true };
}
