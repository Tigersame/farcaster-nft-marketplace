# Deploy to Production - farcastmints.com
# Quick deployment guide

Write-Host "🚀 Deploying Farcaster NFT Marketplace to farcastmints.com" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build check
Write-Host "Step 1: Running production build test..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Fix errors before deploying." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful!" -ForegroundColor Green
Write-Host ""

# Step 2: Git status
Write-Host "Step 2: Checking git status..." -ForegroundColor Yellow
git status
Write-Host ""
Write-Host "Commit your changes? (Y/N)" -ForegroundColor Yellow
$commit = Read-Host
if ($commit -eq "Y" -or $commit -eq "y") {
    git add .
    Write-Host "Enter commit message:" -ForegroundColor Yellow
    $message = Read-Host
    git commit -m "$message"
    git push origin main
    Write-Host "✅ Changes pushed to GitHub!" -ForegroundColor Green
}
Write-Host ""

# Step 3: Deploy
Write-Host "Step 3: Deploying to Vercel..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Choose deployment method:" -ForegroundColor Cyan
Write-Host "1. Deploy to production (--prod)" -ForegroundColor White
Write-Host "2. Deploy preview" -ForegroundColor White
Write-Host "3. Skip deployment (configure manually)" -ForegroundColor White
$choice = Read-Host "Enter choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host "🚀 Deploying to PRODUCTION..." -ForegroundColor Cyan
        vercel --prod
    }
    "2" {
        Write-Host "🔍 Deploying PREVIEW..." -ForegroundColor Cyan
        vercel
    }
    "3" {
        Write-Host "⏭️  Skipping deployment." -ForegroundColor Yellow
        Write-Host "Deploy manually: vercel --prod" -ForegroundColor White
    }
    default {
        Write-Host "❌ Invalid choice. Run script again." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Configure DNS: See DOMAIN_SETUP.md" -ForegroundColor White
Write-Host "2. Add domain in Vercel Dashboard: farcastmints.com" -ForegroundColor White
Write-Host "3. Set environment variables in Vercel" -ForegroundColor White
Write-Host "4. Deploy marketplace contract to Base Mainnet" -ForegroundColor White
Write-Host "5. Update NEXT_PUBLIC_MARKETPLACE_CONTRACT in Vercel" -ForegroundColor White
Write-Host ""
Write-Host "✅ Deployment script complete!" -ForegroundColor Green
