const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const eventWatcher = require('./services/eventWatcher');
const xpService = require('./services/xpService');
const { pool } = require('./db/pool');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://farcastmints.com', 'https://www.farcastmints.com']
    : ['http://localhost:3000']
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==================== USER ENDPOINTS ====================

// Get user profile with XP and badges
app.get('/api/users/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM users WHERE wallet_address = $1',
      [address.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create or update user
app.post('/api/users', async (req, res) => {
  try {
    const { wallet_address, username } = req.body;
    
    if (!wallet_address) {
      return res.status(400).json({ error: 'Wallet address required' });
    }

    const result = await pool.query(
      `INSERT INTO users (wallet_address, username)
       VALUES ($1, $2)
       ON CONFLICT (wallet_address) 
       DO UPDATE SET username = $2, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [wallet_address.toLowerCase(), username]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user XP history
app.get('/api/users/:address/xp-history', async (req, res) => {
  try {
    const { address } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    
    const result = await pool.query(
      `SELECT * FROM xp_transactions 
       WHERE user_address = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [address.toLowerCase(), limit]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching XP history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== LEADERBOARD ENDPOINTS ====================

// Get global leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const result = await pool.query(
      `SELECT * FROM leaderboard 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user rank
app.get('/api/leaderboard/:address/rank', async (req, res) => {
  try {
    const { address } = req.params;
    
    const result = await pool.query(
      `SELECT rank, total_xp FROM leaderboard 
       WHERE wallet_address = $1`,
      [address.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user rank:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== BADGES ENDPOINTS ====================

// Get all available badges
app.get('/api/badges', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM badges ORDER BY requirement_value ASC'
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user badges
app.get('/api/users/:address/badges', async (req, res) => {
  try {
    const { address } = req.params;
    
    const result = await pool.query(
      'SELECT badges FROM users WHERE wallet_address = $1',
      [address.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.json([]);
    }

    res.json(result.rows[0].badges || []);
  } catch (error) {
    console.error('Error fetching user badges:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== EVENTS ENDPOINTS ====================

// Get recent events
app.get('/api/events', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const eventType = req.query.type;
    
    let query = 'SELECT * FROM marketplace_events WHERE processed = true';
    let params = [];
    
    if (eventType) {
      query += ' AND event_type = $1';
      params.push(eventType);
    }
    
    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1);
    params.push(limit);
    
    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user events
app.get('/api/users/:address/events', async (req, res) => {
  try {
    const { address } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    
    const result = await pool.query(
      `SELECT * FROM marketplace_events 
       WHERE user_address = $1 AND processed = true
       ORDER BY created_at DESC 
       LIMIT $2`,
      [address.toLowerCase(), limit]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== STATS ENDPOINTS ====================

// Get global stats
app.get('/api/stats', async (req, res) => {
  try {
    const [totalUsers, totalEvents, totalXp] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query('SELECT COUNT(*) FROM marketplace_events WHERE processed = true'),
      pool.query('SELECT SUM(total_xp) FROM users')
    ]);

    res.json({
      totalUsers: parseInt(totalUsers.rows[0].count),
      totalEvents: parseInt(totalEvents.rows[0].count),
      totalXpAwarded: parseInt(totalXp.rows[0].sum) || 0
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 FarcastMints Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Start event watcher
  try {
    await eventWatcher.start();
    console.log('👀 Event watcher started');
  } catch (error) {
    console.error('❌ Failed to start event watcher:', error);
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  await eventWatcher.stop();
  await pool.end();
  process.exit(0);
});
