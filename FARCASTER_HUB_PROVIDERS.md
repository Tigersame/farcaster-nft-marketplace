# Farcaster Hub Providers Reference Guide 🌐

## Overview
This guide provides comprehensive information about Farcaster Hub providers available for your NFT marketplace, including setup instructions, features, and migration guidance.

## Current Status ⚠️
Your marketplace is currently using **nemes.farcaster.xyz:2283** which is **DEPRECATED**. Migration to a modern provider is recommended for reliability and feature access.

## Available Hub Providers

### 1. **Pinata Hub** (Recommended for Getting Started)
| Property | Value |
|----------|-------|
| **URL** | `https://hub.pinata.cloud` |
| **Cost** | Free with rate limits |
| **Authentication** | None required |
| **Reliability** | High (99.9% uptime) |
| **Setup Difficulty** | Easy |
| **Best For** | Development, small-scale production |

#### Features
- ✅ Free tier with generous limits
- ✅ No API key required
- ✅ High reliability and uptime
- ✅ Easy setup - just change URL
- ✅ IPFS integration included
- ❌ Limited advanced features
- ❌ Rate limiting on free tier

#### Setup Instructions
```bash
# Update your .env.local file
NEXT_PUBLIC_FARCASTER_HUB_URL=https://hub.pinata.cloud
# Remove any existing API key lines for basic usage
```

#### Documentation
- [Pinata Farcaster API Docs](https://docs.pinata.cloud/farcaster/farcaster-api)
- [Rate Limits & Pricing](https://pinata.cloud/pricing)

---

### 2. **Neynar Hub** (Recommended for Production)
| Property | Value |
|----------|-------|
| **URL** | `https://hub-api.neynar.com/v1` |
| **Cost** | Freemium (paid plans available) |
| **Authentication** | API Key required |
| **Reliability** | Very High |
| **Setup Difficulty** | Medium |
| **Best For** | Production apps, advanced features |

#### Features
- ✅ Rich API with advanced features
- ✅ User authentication & profiles
- ✅ Social graph analytics
- ✅ Higher rate limits
- ✅ Professional support
- ✅ Real-time webhooks
- ❌ Requires API key signup
- ❌ Paid plans for heavy usage

#### Setup Instructions
```bash
# 1. Sign up at https://neynar.com
# 2. Get your API key from dashboard
# 3. Update your .env.local file
NEXT_PUBLIC_FARCASTER_HUB_URL=https://hub-api.neynar.com/v1
NEXT_PUBLIC_FARCASTER_API_KEY=your_neynar_api_key_here
```

#### Documentation
- [Neynar API Documentation](https://docs.neynar.com/)
- [Authentication Guide](https://docs.neynar.com/docs/authentication)

---

### 3. **Warpcast API** (Official Integration)
| Property | Value |
|----------|-------|
| **URL** | `https://api.warpcast.com/v2` |
| **Cost** | Free with limits |
| **Authentication** | API Key required |
| **Reliability** | High |
| **Setup Difficulty** | Medium |
| **Best For** | Direct Warpcast integration |

#### Features
- ✅ Official Warpcast API
- ✅ Direct access to Warpcast data
- ✅ User profiles and social features
- ✅ Cast creation and management
- ❌ Limited to Warpcast ecosystem
- ❌ Requires developer approval

#### Setup Instructions
```bash
# 1. Apply for API access at https://warpcast.com/~/developers
# 2. Get approved and receive API key
# 3. Update your .env.local file
NEXT_PUBLIC_FARCASTER_HUB_URL=https://api.warpcast.com/v2
NEXT_PUBLIC_FARCASTER_API_KEY=your_warpcast_api_key_here
```

---

### 4. **Custom Hub** (Self-Hosted)
| Property | Value |
|----------|-------|
| **URL** | `https://your-domain.com` |
| **Cost** | Infrastructure costs |
| **Authentication** | Custom |
| **Reliability** | Depends on setup |
| **Setup Difficulty** | Hard |
| **Best For** | Full control, privacy |

#### Features
- ✅ Complete control over data
- ✅ Custom features and modifications
- ✅ No external dependencies
- ✅ Private data handling
- ❌ High maintenance overhead
- ❌ Requires technical expertise
- ❌ Infrastructure management

#### Setup Instructions
```bash
# 1. Deploy your own Farcaster Hub instance
# 2. Configure authentication if needed
# 3. Update your .env.local file
NEXT_PUBLIC_FARCASTER_HUB_URL=https://your-domain.com
NEXT_PUBLIC_FARCASTER_API_KEY=your_custom_api_key_here
```

---

## Migration Guide 🚀

### From Legacy Nemes Hub to Pinata (Recommended)

1. **Update Environment Variables**
   ```bash
   # Replace in .env.local
   NEXT_PUBLIC_FARCASTER_HUB_URL=https://hub.pinata.cloud
   # Remove API key line (not needed for basic usage)
   ```

2. **Test Connection**
   - Use the Hub Provider Manager in admin panel
   - Test connection to ensure it works
   - Verify Frame functionality

3. **Update Code (if needed)**
   - Most endpoints are compatible
   - Check for any hardcoded URLs
   - Update error handling if necessary

4. **Deploy Changes**
   - Update production environment variables
   - Test thoroughly in staging first
   - Monitor for any issues

### Migration Checklist ✅

- [ ] Choose new hub provider
- [ ] Sign up for API key (if required)
- [ ] Update environment variables
- [ ] Test connection in admin panel
- [ ] Verify Frame functionality works
- [ ] Update any hardcoded URLs in code
- [ ] Test in staging environment
- [ ] Deploy to production
- [ ] Monitor for errors
- [ ] Update documentation

## Comparison Table

| Feature | Pinata | Neynar | Warpcast | Custom |
|---------|--------|--------|----------|--------|
| **Free Tier** | ✅ | ✅ | ✅ | ❌ |
| **No Auth Required** | ✅ | ❌ | ❌ | Depends |
| **High Rate Limits** | ❌ | ✅ | ❌ | ✅ |
| **Advanced Features** | ❌ | ✅ | ✅ | ✅ |
| **Easy Setup** | ✅ | ❌ | ❌ | ❌ |
| **Production Ready** | ✅ | ✅ | ✅ | Depends |
| **Support** | Community | Professional | Official | Self |

## Recommendations by Use Case

### 🚀 **Getting Started / Development**
**Choose: Pinata Hub**
- No signup required
- Works immediately
- Free and reliable
- Perfect for testing

### 🏢 **Small Production App**
**Choose: Pinata Hub (Paid Plan)**
- Affordable scaling
- Good reliability
- Simple to maintain
- Professional support available

### 🏭 **Large Production App**
**Choose: Neynar Hub**
- Advanced features
- High rate limits
- Professional support
- Rich analytics

### 🔒 **Privacy-Focused / Enterprise**
**Choose: Custom Hub**
- Full data control
- Custom features
- Private infrastructure
- Compliance friendly

## Troubleshooting Common Issues

### Connection Errors
1. Check URL format and spelling
2. Verify API key if required
3. Check network connectivity
4. Review rate limiting

### Frame Issues
1. Ensure hub supports Frame specifications
2. Check image URLs are accessible
3. Verify metadata format
4. Test Frame validation

### Rate Limiting
1. Implement request caching
2. Add retry logic with backoff
3. Consider upgrading plan
4. Monitor usage patterns

## Testing Your Hub Configuration

Use the built-in Hub Provider Manager in your admin panel:

1. **Connect Admin Wallet**: `0xcaA2dC702DdF5625296d42aa13B37458d29d2e49`
2. **Access Admin Panel**: Click admin icon when connected
3. **Go to Hub Config Tab**: Test different providers
4. **Run Connection Tests**: Verify latency and reliability
5. **Copy Configuration**: Get ready-to-use .env settings

## Support & Resources

### Pinata
- 📖 [Documentation](https://docs.pinata.cloud/farcaster)
- 💬 [Discord Community](https://discord.gg/pinata)
- 📧 [Support Email](mailto:support@pinata.cloud)

### Neynar
- 📖 [Documentation](https://docs.neynar.com/)
- 💬 [Discord Community](https://discord.gg/neynar)
- 🐦 [Twitter Support](https://twitter.com/neynarxyz)

### Warpcast
- 📖 [Developer Docs](https://warpcast.com/~/developers)
- 💬 [Warpcast Channel](https://warpcast.com/~/channel/dev)

---

## ⚡ Quick Start Commands

### Test Current Configuration
```bash
# Check what hub you're currently using
grep FARCASTER_HUB_URL .env.local
```

### Switch to Pinata (Recommended)
```bash
# Backup current config
cp .env.local .env.local.backup

# Update to Pinata
sed -i 's|NEXT_PUBLIC_FARCASTER_HUB_URL=.*|NEXT_PUBLIC_FARCASTER_HUB_URL=https://hub.pinata.cloud|' .env.local

# Remove API key line if exists (Pinata doesn't need it for basic usage)
sed -i '/NEXT_PUBLIC_FARCASTER_API_KEY/d' .env.local
```

### Restart Development Server
```bash
npm run dev
```

---

**✨ Your marketplace now has comprehensive Farcaster Hub provider management with migration tools and admin controls!**