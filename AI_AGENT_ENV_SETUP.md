# Environment Variables for AI Agent with Spend Permissions

## Required Environment Variables

### OpenAI API Key (Required for AI Agent)
```env
OPENAI_API_KEY=your_openai_api_key_here
```
Get your API key from: https://platform.openai.com/api-keys

### Coinbase CDP Paymaster (Optional - for gas sponsorship)
```env
PAYMASTER_URL=https://api.developer.coinbase.com/rpc/v1/base/your_paymaster_key
```
Sign up at: https://portal.cdp.coinbase.com/

### Zora API (Optional - for creator coin data)
```env
ZORA_API_KEY=your_zora_api_key_here
```
Get from: https://docs.zora.co/

### Session Secret (Recommended for Production)
```env
SESSION_SECRET=your_random_secure_session_secret
```
Generate with: `openssl rand -base64 32`

### Site URL (Required for Production)
```env
NEXT_PUBLIC_SITE_URL=https://your-app-domain.com
```
For local development: `http://localhost:3000`

## Environment Setup

### Development (.env.local)
```env
# Development environment variables
NEXT_PUBLIC_SITE_URL=http://localhost:3000
OPENAI_API_KEY=sk-...your-openai-key...
PAYMASTER_URL=https://api.developer.coinbase.com/rpc/v1/base/your_key
SESSION_SECRET=your_dev_secret_here
```

### Production (.env.production)
```env
# Production environment variables
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
OPENAI_API_KEY=sk-...your-openai-key...
PAYMASTER_URL=https://api.developer.coinbase.com/rpc/v1/base/your_key
SESSION_SECRET=your_production_secret_here
NODE_ENV=production
```

## Vercel Deployment

Add these environment variables in your Vercel project settings:
1. Go to your project dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable with the appropriate value
4. Select environment (Production, Preview, Development)

## Security Notes

⚠️ **Never commit `.env.local` or `.env.production` to version control**

✅ Include `.env.example` for reference (without actual keys)

✅ Use different keys for development and production

✅ Rotate keys periodically for security

## Testing Without API Keys

The AI agent functionality requires:
- ✅ Base Account authentication works without keys
- ✅ Spend permission setup works without keys
- ❌ AI chat responses require OPENAI_API_KEY
- ✅ Mock transactions work without Paymaster (for testing)

If `OPENAI_API_KEY` is not set, the chat will show:
"I'm currently unable to process requests as the AI service is not configured."

## Troubleshooting

### OpenAI API Errors
- Verify key is correct: starts with `sk-`
- Check quota limits at https://platform.openai.com/usage
- Ensure billing is set up

### Base Account Connection Issues
- No special environment variables needed
- Uses Base mainnet (chainId: 8453)
- Works out of the box with @base-org/account

### Spend Permission Failures
- Ensure user has USDC on Base mainnet
- Check daily limit is within reasonable range ($1-$10)
- Verify wallet is connected to Base network

## Support

For issues with:
- OpenAI: https://help.openai.com/
- Coinbase CDP: https://docs.cdp.coinbase.com/
- Base Account: https://docs.base.org/
- Zora: https://docs.zora.co/
