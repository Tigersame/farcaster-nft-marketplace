const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const initDatabase = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Initializing database...');
    
    // Create tables
    await client.query(`
      -- Users table for XP tracking
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        wallet_address VARCHAR(42) UNIQUE NOT NULL,
        username VARCHAR(100),
        total_xp INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        badges JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Events table for marketplace activities
      CREATE TABLE IF NOT EXISTS marketplace_events (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(50) NOT NULL,
        tx_hash VARCHAR(66) UNIQUE NOT NULL,
        block_number BIGINT NOT NULL,
        user_address VARCHAR(42) NOT NULL,
        token_id VARCHAR(100),
        price VARCHAR(100),
        xp_awarded INTEGER DEFAULT 0,
        processed BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- XP transactions table for history
      CREATE TABLE IF NOT EXISTS xp_transactions (
        id SERIAL PRIMARY KEY,
        user_address VARCHAR(42) NOT NULL,
        amount INTEGER NOT NULL,
        reason VARCHAR(255),
        event_id INTEGER REFERENCES marketplace_events(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Badges definition table
      CREATE TABLE IF NOT EXISTS badges (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        icon VARCHAR(255),
        requirement_type VARCHAR(50),
        requirement_value INTEGER,
        xp_reward INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Leaderboard view
      CREATE OR REPLACE VIEW leaderboard AS
      SELECT 
        u.wallet_address,
        u.username,
        u.total_xp,
        u.level,
        u.badges,
        RANK() OVER (ORDER BY u.total_xp DESC) as rank,
        COUNT(DISTINCT me.id) as total_transactions
      FROM users u
      LEFT JOIN marketplace_events me ON me.user_address = u.wallet_address
      GROUP BY u.wallet_address, u.username, u.total_xp, u.level, u.badges
      ORDER BY u.total_xp DESC;

      -- Indexes for performance
      CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
      CREATE INDEX IF NOT EXISTS idx_users_xp ON users(total_xp DESC);
      CREATE INDEX IF NOT EXISTS idx_events_user ON marketplace_events(user_address);
      CREATE INDEX IF NOT EXISTS idx_events_block ON marketplace_events(block_number);
      CREATE INDEX IF NOT EXISTS idx_events_processed ON marketplace_events(processed);
      CREATE INDEX IF NOT EXISTS idx_xp_user ON xp_transactions(user_address);
    `);

    // Insert default badges
    await client.query(`
      INSERT INTO badges (name, description, icon, requirement_type, requirement_value, xp_reward)
      VALUES 
        ('First Purchase', 'Made your first NFT purchase', '🎉', 'purchases', 1, 100),
        ('First Sale', 'Sold your first NFT', '💰', 'sales', 1, 100),
        ('Collector', 'Purchased 10 NFTs', '🏆', 'purchases', 10, 500),
        ('Trader', 'Completed 25 transactions', '📈', 'transactions', 25, 750),
        ('Whale', 'Spent over 10 ETH', '🐋', 'volume', 10, 1000),
        ('Early Adopter', 'Joined in the first month', '🌟', 'early_user', 1, 250),
        ('Market Maker', 'Listed 50 NFTs', '🎨', 'listings', 50, 800)
      ON CONFLICT (name) DO NOTHING;
    `);

    console.log('✅ Database initialized successfully!');
    console.log('📊 Tables created: users, marketplace_events, xp_transactions, badges');
    console.log('🎖️ Default badges inserted');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

initDatabase();
