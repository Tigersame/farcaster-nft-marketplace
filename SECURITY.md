# Security Policy

## 🔒 FarcastSea Security

Security is a top priority for FarcastSea. This document outlines our security practices and how to report vulnerabilities.

## ✅ Secure Practices

### Environment Variables
- **Never commit** `.env.local` or `.env` files
- Use `.env.example` as a template
- Keep API keys and secrets secure
- Rotate keys regularly

### Smart Contract Security
- All contract interactions go through verified contracts on Base
- Transaction data is validated before signing
- Users control their own wallets (non-custodial)

### Data Protection
- User data is stored client-side when possible
- No passwords are stored
- Wallet connections use industry-standard protocols (WalletConnect, RainbowKit)

### API Security
- Rate limiting on all endpoints
- Input validation on all user data
- CORS configured appropriately
- API keys kept server-side only

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability, please:

1. **Do NOT** open a public issue
2. Email: security@farcastsea.com (or your contact email)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will:
- Respond within 48 hours
- Provide updates on the fix progress
- Credit you for the discovery (if desired)

## 🛡️ Security Checklist for Deployment

Before deploying to production:

- [ ] All environment variables set correctly
- [ ] `.env.local` added to `.gitignore`
- [ ] API keys rotated from development
- [ ] Smart contract addresses verified on BaseScan
- [ ] CORS configured for production domain only
- [ ] Rate limiting enabled
- [ ] SSL/TLS certificate installed
- [ ] Security headers configured (CSP, HSTS, etc.)
- [ ] Dependencies updated to latest secure versions
- [ ] No sensitive data in client-side code
- [ ] Error messages don't leak sensitive information

## 🔐 Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## 📚 Security Resources

- [Base Network Security](https://docs.base.org/security)
- [WalletConnect Security](https://docs.walletconnect.com/2.0/advanced/security)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/data-fetching/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

## 🔄 Regular Security Updates

We regularly:
- Update dependencies
- Audit smart contract interactions
- Review access controls
- Test for common vulnerabilities
- Monitor for suspicious activity

---

**Stay Secure! 🌊**
