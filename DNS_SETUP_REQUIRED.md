# DNS Configuration Required for farcastmints.com

## Current Status

✅ **Vercel Project Deployed**: https://farcaster-nft-marketplace-4b20jiqy3-devsminiapp.vercel.app
⏳ **Custom Domain**: farcastmints.com (DNS configuration needed)
⏳ **SSL Certificate**: Being generated (requires DNS verification)

---

## ⚠️ Action Required: Configure DNS

You need to configure DNS records at your domain registrar to point `farcastmints.com` to Vercel.

### Where to Configure DNS

Go to where you purchased/manage `farcastmints.com`:
- **GoDaddy**: DNS Management → Add Records
- **Namecheap**: Domain List → Manage → Advanced DNS
- **Cloudflare**: DNS → Records → Add Record
- **Google Domains**: DNS → Custom Records
- **Other registrars**: Look for DNS Settings or DNS Management

---

## DNS Records to Add

### Option 1: Point Root Domain to Vercel (Recommended)

**Add A Record:**
```
Type: A
Name: @ (or leave blank for root domain)
Value: 76.76.21.21
TTL: 3600 (or Auto)
```

**Add CNAME Record for www:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com.
TTL: 3600 (or Auto)
```

### Option 2: Alternative (If A Record Doesn't Work)

**Add ALIAS or ANAME Record:**
```
Type: ALIAS (or ANAME)
Name: @
Value: cname.vercel-dns.com.
TTL: 3600
```

---

## Step-by-Step DNS Configuration

### For GoDaddy:
1. Login to GoDaddy.com
2. Go to **My Products** → **Domains**
3. Click **DNS** next to farcastmints.com
4. Click **Add** and select **A** record
   - Name: `@`
   - Value: `76.76.21.21`
   - TTL: `1 Hour`
5. Click **Add** again and select **CNAME** record
   - Name: `www`
   - Value: `cname.vercel-dns.com`
   - TTL: `1 Hour`
6. Save changes

### For Namecheap:
1. Login to Namecheap.com
2. Go to **Domain List**
3. Click **Manage** next to farcastmints.com
4. Go to **Advanced DNS** tab
5. Add **A Record**:
   - Host: `@`
   - Value: `76.76.21.21`
   - TTL: Automatic
6. Add **CNAME Record**:
   - Host: `www`
   - Value: `cname.vercel-dns.com`
   - TTL: Automatic
7. Save All Changes

### For Cloudflare:
1. Login to Cloudflare.com
2. Select farcastmints.com domain
3. Go to **DNS** → **Records**
4. Click **Add record**
   - Type: `A`
   - Name: `@`
   - IPv4 address: `76.76.21.21`
   - Proxy status: **DNS only** (turn off proxy)
5. Add another record:
   - Type: `CNAME`
   - Name: `www`
   - Target: `cname.vercel-dns.com`
   - Proxy status: **DNS only**
6. Save

---

## Verify DNS Configuration

### Check DNS Propagation

**Using PowerShell:**
```powershell
# Check A record
nslookup farcastmints.com

# Should show:
# Non-authoritative answer:
# Name:    farcastmints.com
# Address: 76.76.21.21

# Check CNAME record
nslookup www.farcastmints.com

# Should show:
# www.farcastmints.com canonical name = cname.vercel-dns.com
```

**Using Online Tools:**
- https://dnschecker.org - Enter `farcastmints.com`
- https://www.whatsmydns.net - Enter `farcastmints.com`

---

## Timeline

- **DNS Configuration**: 5-10 minutes (your side)
- **DNS Propagation**: 1-48 hours (usually 1-2 hours)
- **SSL Certificate**: Generated automatically after DNS verification
- **Site Live**: After DNS propagates and SSL generates

---

## Troubleshooting

### Problem: "Nothing shows on farcastmints.com"

**Causes:**
1. DNS records not configured yet → **Configure DNS as shown above**
2. DNS not propagated yet → **Wait 1-2 hours, check with nslookup**
3. Old DNS cached → **Clear browser cache, use incognito mode**

### Problem: "SSL Certificate Error"

**Solution:**
- Wait for DNS to propagate fully
- SSL certificates auto-generate within 24 hours
- Check Vercel dashboard for certificate status

### Problem: "Domain shows 404"

**Solution:**
- Ensure DNS A record points to 76.76.21.21
- Clear browser cache
- Try accessing with https://farcastmints.com (not http://)

---

## Check Domain Status in Vercel Dashboard

1. Go to: https://vercel.com/devsminiapp/farcaster-nft-marketplace
2. Click **Settings** → **Domains**
3. You should see `farcastmints.com` listed
4. Status will show:
   - ⏳ "Pending" - DNS not configured/propagated yet
   - ⚠️ "Invalid Configuration" - DNS records incorrect
   - ✅ "Valid Configuration" - DNS correct and propagated

---

## Current Temporary URLs (Working Now)

Your site IS live at these Vercel URLs:

**Latest Production Deployment:**
- https://farcaster-nft-marketplace-4b20jiqy3-devsminiapp.vercel.app

**Main Production URL:**
- https://farcaster-nft-marketplace.vercel.app (should also work)

**You can use these URLs while DNS propagates!**

---

## What Happens Next

1. **You configure DNS** (5-10 minutes)
2. **DNS propagates** (1-48 hours, usually 1-2 hours)
3. **Vercel detects DNS** (automatic)
4. **SSL certificate generated** (automatic)
5. **https://farcastmints.com goes live** (fully automatic)

---

## Need Help?

### Check Your Current DNS
```powershell
nslookup farcastmints.com
```

If it shows:
- `76.76.21.21` → ✅ Correct! Wait for propagation
- Anything else → ⚠️ DNS not configured correctly
- `can't find` → ❌ DNS not configured yet

### Force DNS Check
```powershell
# Clear DNS cache
ipconfig /flushdns

# Check again
nslookup farcastmints.com
```

---

## Quick Test

**Right now, visit your working site:**
- https://farcaster-nft-marketplace-4b20jiqy3-devsminiapp.vercel.app

**This is your site! It's working!**

Once DNS is configured and propagates, the same site will be available at:
- https://farcastmints.com

---

**Summary:**
- ✅ Your site is deployed and working
- ⏳ You need to configure DNS at your domain registrar
- ⏳ After DNS propagates (1-2 hours), farcastmints.com will work
- 🌐 Use the Vercel URLs in the meantime

**Configure DNS now at your domain registrar!** 👆
