const { pool } = require('../db/pool');

class XPService {
  // XP required for each level (exponential growth)
  getLevelFromXP(xp) {
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  }

  getXPForLevel(level) {
    return Math.pow(level - 1, 2) * 100;
  }

  async awardXP(walletAddress, amount, reason, eventId = null) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Ensure user exists
      await client.query(
        `INSERT INTO users (wallet_address) 
         VALUES ($1) 
         ON CONFLICT (wallet_address) DO NOTHING`,
        [walletAddress]
      );

      // Add XP transaction
      await client.query(
        `INSERT INTO xp_transactions (user_address, amount, reason, event_id)
         VALUES ($1, $2, $3, $4)`,
        [walletAddress, amount, reason, eventId]
      );

      // Update user's total XP and level
      const result = await client.query(
        `UPDATE users 
         SET total_xp = total_xp + $1,
             level = $2,
             updated_at = CURRENT_TIMESTAMP
         WHERE wallet_address = $3
         RETURNING total_xp, level`,
        [amount, this.getLevelFromXP((await this.getUserXP(walletAddress)) + amount), walletAddress]
      );

      await client.query('COMMIT');

      console.log(`✨ Awarded ${amount} XP to ${walletAddress.slice(0, 8)}... (${reason})`);
      
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error awarding XP:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getUserXP(walletAddress) {
    const result = await pool.query(
      'SELECT total_xp FROM users WHERE wallet_address = $1',
      [walletAddress]
    );
    return result.rows.length > 0 ? result.rows[0].total_xp : 0;
  }

  async checkAndAwardBadges(walletAddress) {
    try {
      // Get user's current badges
      const userResult = await pool.query(
        'SELECT badges FROM users WHERE wallet_address = $1',
        [walletAddress]
      );

      if (userResult.rows.length === 0) return;

      const currentBadges = userResult.rows[0].badges || [];
      const currentBadgeNames = currentBadges.map(b => b.name);

      // Get user stats
      const stats = await this.getUserStats(walletAddress);

      // Get all available badges
      const badgesResult = await pool.query('SELECT * FROM badges');
      const allBadges = badgesResult.rows;

      const newBadges = [];

      for (const badge of allBadges) {
        // Skip if user already has this badge
        if (currentBadgeNames.includes(badge.name)) continue;

        let earned = false;

        switch (badge.requirement_type) {
          case 'purchases':
            earned = stats.purchases >= badge.requirement_value;
            break;
          case 'sales':
            earned = stats.sales >= badge.requirement_value;
            break;
          case 'transactions':
            earned = stats.total_transactions >= badge.requirement_value;
            break;
          case 'volume':
            earned = stats.total_volume >= badge.requirement_value;
            break;
          case 'listings':
            earned = stats.listings >= badge.requirement_value;
            break;
          case 'early_user':
            // Award to users who joined within first 30 days
            const daysSinceJoin = (Date.now() - new Date(stats.created_at).getTime()) / (1000 * 60 * 60 * 24);
            earned = daysSinceJoin <= 30;
            break;
        }

        if (earned) {
          newBadges.push({
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            earned_at: new Date().toISOString()
          });

          // Award badge XP
          if (badge.xp_reward > 0) {
            await this.awardXP(walletAddress, badge.xp_reward, `Earned badge: ${badge.name}`);
          }
        }
      }

      if (newBadges.length > 0) {
        // Update user's badges
        const updatedBadges = [...currentBadges, ...newBadges];
        await pool.query(
          'UPDATE users SET badges = $1, updated_at = CURRENT_TIMESTAMP WHERE wallet_address = $2',
          [JSON.stringify(updatedBadges), walletAddress]
        );

        console.log(`🎖️ Awarded ${newBadges.length} new badge(s) to ${walletAddress.slice(0, 8)}...`);
      }

      return newBadges;
    } catch (error) {
      console.error('Error checking badges:', error);
      return [];
    }
  }

  async getUserStats(walletAddress) {
    const result = await pool.query(
      `SELECT 
        u.created_at,
        COUNT(CASE WHEN me.event_type = 'NFTSold' THEN 1 END) as purchases,
        COUNT(CASE WHEN me.event_type = 'NFTListed' THEN 1 END) as listings,
        COUNT(DISTINCT CASE WHEN me.event_type = 'NFTSold' THEN me.id END) as sales,
        COUNT(me.id) as total_transactions,
        COALESCE(SUM(CAST(me.price AS NUMERIC)), 0) as total_volume
      FROM users u
      LEFT JOIN marketplace_events me ON me.user_address = u.wallet_address
      WHERE u.wallet_address = $1
      GROUP BY u.wallet_address, u.created_at`,
      [walletAddress]
    );

    return result.rows[0] || {
      purchases: 0,
      sales: 0,
      listings: 0,
      total_transactions: 0,
      total_volume: 0,
      created_at: new Date()
    };
  }
}

module.exports = new XPService();
