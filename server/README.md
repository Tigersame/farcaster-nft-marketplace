# FarcastMints Backend - XP & Event Tracking System

Complete backend server with event watchers for marketplace activities, XP system, and leaderboard.

## 🚀 Features

- ✅ Real-time blockchain event watching (NFT buys/sells/listings)
- ✅ Automatic XP rewards for marketplace activities
- ✅ Badges and achievements system
- ✅ Global leaderboard with rankings
- ✅ User profiles with XP history
- ✅ PostgreSQL database with optimized indexes
- ✅ Rate limiting and security (Helmet + CORS)
- ✅ RESTful API endpoints

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 14+

## 🔧 Setup (Without Docker)

### 1. Install PostgreSQL

**Windows:**
```powershell
# Download from https://www.postgresql.org/download/windows/
# Or use Chocolatey:
choco install postgresql

# Start PostgreSQL service
net start postgresql-x64-14
```

**Create Database:**
```powershell
psql -U postgres
CREATE DATABASE farcastmints;
\q
```

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your settings:
# DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/farcastmints
# MARKETPLACE_CONTRACT_ADDRESS=0x665Cf11D9B9A427c7c0ae410B7A7E6F629f5cAc5
# BASE_RPC_URL=https://mainnet.base.org
```

### 4. Initialize Database

```bash
npm run init-db
```

This creates all tables, indexes, and inserts default badges.

### 5. Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server runs on http://localhost:3001

## 📊 Database Schema

### Tables:
- `users` - User profiles with XP, level, and badges
- `marketplace_events` - All marketplace transactions
- `xp_transactions` - XP award history
- `badges` - Available badges and requirements
- `leaderboard` (VIEW) - Ranked users by XP

## 🎯 XP System

### XP Awards:
- **List NFT**: 50 XP
- **Buy NFT**: 100 XP  
- **Sell NFT**: 150 XP

### Levels:
Level = √(XP / 100) + 1

### Badges:
- 🎉 **First Purchase** - 1 purchase → +100 XP
- 💰 **First Sale** - 1 sale → +100 XP
- 🏆 **Collector** - 10 purchases → +500 XP
- 📈 **Trader** - 25 transactions → +750 XP
- 🐋 **Whale** - 10 ETH volume → +1000 XP
- 🌟 **Early Adopter** - Joined first 30 days → +250 XP
- 🎨 **Market Maker** - 50 listings → +800 XP

## 🔌 API Endpoints

### Users
- `GET /api/users/:address` - Get user profile
- `POST /api/users` - Create/update user
- `GET /api/users/:address/xp-history` - Get XP transaction history
- `GET /api/users/:address/badges` - Get user's badges
- `GET /api/users/:address/events` - Get user's marketplace events

### Leaderboard
- `GET /api/leaderboard?limit=100&offset=0` - Get global leaderboard
- `GET /api/leaderboard/:address/rank` - Get user's rank

### Badges
- `GET /api/badges` - Get all available badges

### Events
- `GET /api/events?type=NFTSold&limit=50` - Get recent events
- `GET /api/stats` - Get global statistics

### Health
- `GET /health` - Server health check

## 🔒 Security

- Helmet.js for HTTP headers security
- CORS configured for production domains
- Rate limiting (100 requests per 15 minutes)
- SQL injection protection via parameterized queries
- Environment variable validation

## 🎮 Event Watching

The event watcher:
1. Connects to Base network RPC
2. Processes historical events (last 1000 blocks)
3. Listens for new marketplace events in real-time
4. Awards XP automatically
5. Checks and awards badges
6. Updates leaderboard

Events tracked:
- `NFTListed` - User lists an NFT
- `NFTSold` - NFT purchase completed
- `NFTDelisted` - User removes listing

## 🐛 Troubleshooting

### Database Connection Failed
```bash
# Check PostgreSQL is running
Get-Service postgresql*

# Test connection
psql -U postgres -d farcastmints -c "SELECT 1"
```

### RPC Connection Issues
- Verify `BASE_RPC_URL` in .env
- Check network connectivity
- Try alternative RPC: `https://base.llamarpc.com`

### Event Watcher Not Starting
- Verify contract address matches deployed contract
- Check RPC endpoint is accessible
- Review server logs for errors

## 📈 Monitoring

Check logs for:
- `✅ Event watcher initialized` - Watcher started successfully
- `✨ Awarded X XP to...` - XP awarded
- `🎖️ Awarded N new badge(s)` - Badge earned
- `💰 Sold: Token #X` - Sale detected

## 🔄 Scaling

For production:
- Use connection pooling (already configured)
- Add Redis for caching
- Implement event queue (Bull/Bee-Queue)
- Use PM2 for process management:
  ```bash
  npm install -g pm2
  pm2 start server.js --name farcastmints-backend
  pm2 startup
  pm2 save
  ```

## 📝 License

MIT
