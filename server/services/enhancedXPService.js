const { pool } = require('../db/pool');

/**
 * Enhanced XP Service for Launch Event
 * - Create NFT: 100 XP
 * - Swap: 100 XP
 * - Buy NFT: 100 XP  
 * - Sell NFT: 100 XP
 * - Daily Login: 100 XP
 * - Share Project: 100 XP
 * - Claim Genesis SBT: 500 XP
 * Total XP Pool: 100,000,000,000 XP
 */

const XP_REWARDS = {
  CREATE_NFT: 100,
  SWAP: 100,
  BUY_NFT: 100,
  SELL_NFT: 100,
  DAILY_LOGIN: 100,
  SHARE_PROJECT: 100,
  CLAIM_GENESIS_SBT: 500,
  LIST_NFT: 50,
};

const TOTAL_XP_POOL = 100000000000; // 100 billion XP total pool
const BADGE_XP_REWARDS = {
  GENESIS_HOLDER: 500,
  FIRST_NFT: 200,
  FIRST_SWAP: 200,
  STREAK_7_DAYS: 1000,
  STREAK_30_DAYS: 5000,
  SOCIAL_INFLUENCER: 1000,
};

class EnhancedXPService {
  /**
   * Award XP for marketplace events
   */
  async awardXP(userAddress, amount, reason, eventId = null) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Award XP
      await client.query(
        `INSERT INTO xp_transactions (user_address, amount, reason, event_id)
         VALUES ($1, $2, $3, $4)`,
        [userAddress.toLowerCase(), amount, reason, eventId]
      );

      // Update user total XP and level
      const result = await client.query(
        `INSERT INTO users (wallet_address, total_xp, level)
         VALUES ($1, $2, 1)
         ON CONFLICT (wallet_address) 
         DO UPDATE SET 
           total_xp = users.total_xp + $2,
           level = FLOOR(SQRT((users.total_xp + $2) / 100.0)) + 1,
           updated_at = CURRENT_TIMESTAMP
         RETURNING total_xp, level`,
        [userAddress.toLowerCase(), amount]
      );

      const { total_xp, level } = result.rows[0];

      // Check for badge achievements
      await this.checkBadges(client, userAddress, reason);

      await client.query('COMMIT');

      console.log(`✨ Awarded ${amount} XP to ${userAddress} for: ${reason}`);
      return { total_xp, level, xp_awarded: amount };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error awarding XP:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Award XP for creating NFT
   */
  async awardCreateNFTXP(userAddress, tokenId) {
    return this.awardXP(
      userAddress,
      XP_REWARDS.CREATE_NFT,
      `Created NFT #${tokenId}`
    );
  }

  /**
   * Award XP for swap transaction
   */
  async awardSwapXP(userAddress, txHash) {
    return this.awardXP(
      userAddress,
      XP_REWARDS.SWAP,
      `Completed swap transaction: ${txHash}`
    );
  }

  /**
   * Award XP for daily login (once per day)
   */
  async awardDailyLoginXP(userAddress) {
    const client = await pool.connect();
    
    try {
      // Check if user already logged in today
      const result = await client.query(
        `SELECT id FROM xp_transactions
         WHERE user_address = $1 
         AND reason LIKE 'Daily login%'
         AND created_at::date = CURRENT_DATE`,
        [userAddress.toLowerCase()]
      );

      if (result.rows.length > 0) {
        return { alreadyClaimed: true, message: 'Already claimed daily login XP today' };
      }

      // Check login streak
      const streakResult = await client.query(
        `SELECT COUNT(DISTINCT created_at::date) as streak
         FROM xp_transactions
         WHERE user_address = $1 
         AND reason LIKE 'Daily login%'
         AND created_at >= CURRENT_DATE - INTERVAL '30 days'`,
        [userAddress.toLowerCase()]
      );

      const streak = parseInt(streakResult.rows[0]?.streak || 0) + 1;

      return this.awardXP(
        userAddress,
        XP_REWARDS.DAILY_LOGIN,
        `Daily login (${streak} day streak)`
      );
    } finally {
      client.release();
    }
  }

  /**
   * Award XP for sharing project
   */
  async awardShareXP(userAddress, platform = 'social') {
    const client = await pool.connect();
    
    try {
      // Check if user already shared today
      const result = await client.query(
        `SELECT id FROM xp_transactions
         WHERE user_address = $1 
         AND reason LIKE 'Shared project%'
         AND created_at::date = CURRENT_DATE`,
        [userAddress.toLowerCase()]
      );

      if (result.rows.length > 0) {
        return { alreadyClaimed: true, message: 'Already claimed share XP today' };
      }

      return this.awardXP(
        userAddress,
        XP_REWARDS.SHARE_PROJECT,
        `Shared project on ${platform}`
      );
    } finally {
      client.release();
    }
  }

  /**
   * Award XP for claiming Genesis SBT
   */
  async awardGenesisSBTXP(userAddress, tokenId) {
    return this.awardXP(
      userAddress,
      XP_REWARDS.CLAIM_GENESIS_SBT,
      `Claimed Genesis SBT #${tokenId}`
    );
  }

  /**
   * Check and award badges
   */
  async checkBadges(client, userAddress, reason) {
    try {
      const userResult = await client.query(
        'SELECT badges FROM users WHERE wallet_address = $1',
        [userAddress.toLowerCase()]
      );

      if (userResult.rows.length === 0) return;

      const currentBadges = userResult.rows[0].badges || [];

      // Genesis Holder Badge
      if (reason.includes('Genesis SBT') && !currentBadges.includes('Genesis Holder')) {
        await this.awardBadge(client, userAddress, 'Genesis Holder', BADGE_XP_REWARDS.GENESIS_HOLDER);
      }

      // First NFT Badge
      if (reason.includes('Created NFT') && !currentBadges.includes('First NFT Creator')) {
        const nftCount = await client.query(
          `SELECT COUNT(*) FROM xp_transactions WHERE user_address = $1 AND reason LIKE 'Created NFT%'`,
          [userAddress.toLowerCase()]
        );
        if (nftCount.rows[0].count == 1) {
          await this.awardBadge(client, userAddress, 'First NFT Creator', BADGE_XP_REWARDS.FIRST_NFT);
        }
      }

      // First Swap Badge
      if (reason.includes('swap') && !currentBadges.includes('First Swap')) {
        const swapCount = await client.query(
          `SELECT COUNT(*) FROM xp_transactions WHERE user_address = $1 AND reason LIKE '%swap%'`,
          [userAddress.toLowerCase()]
        );
        if (swapCount.rows[0].count == 1) {
          await this.awardBadge(client, userAddress, 'First Swap', BADGE_XP_REWARDS.FIRST_SWAP);
        }
      }

      // Login Streak Badges
      if (reason.includes('Daily login')) {
        const streakResult = await client.query(
          `SELECT COUNT(DISTINCT created_at::date) as streak
           FROM xp_transactions
           WHERE user_address = $1 AND reason LIKE 'Daily login%'
           AND created_at >= CURRENT_DATE - INTERVAL '30 days'`,
          [userAddress.toLowerCase()]
        );
        const streak = parseInt(streakResult.rows[0].streak);

        if (streak >= 7 && !currentBadges.includes('7 Day Streak')) {
          await this.awardBadge(client, userAddress, '7 Day Streak', BADGE_XP_REWARDS.STREAK_7_DAYS);
        }
        if (streak >= 30 && !currentBadges.includes('30 Day Streak')) {
          await this.awardBadge(client, userAddress, '30 Day Streak', BADGE_XP_REWARDS.STREAK_30_DAYS);
        }
      }

      // Social Influencer Badge (5 shares)
      if (reason.includes('Shared project') && !currentBadges.includes('Social Influencer')) {
        const shareCount = await client.query(
          `SELECT COUNT(*) FROM xp_transactions WHERE user_address = $1 AND reason LIKE 'Shared project%'`,
          [userAddress.toLowerCase()]
        );
        if (shareCount.rows[0].count >= 5) {
          await this.awardBadge(client, userAddress, 'Social Influencer', BADGE_XP_REWARDS.SOCIAL_INFLUENCER);
        }
      }
    } catch (error) {
      console.error('Error checking badges:', error);
    }
  }

  /**
   * Award badge to user
   */
  async awardBadge(client, userAddress, badgeName, xpReward) {
    try {
      await client.query(
        `UPDATE users 
         SET badges = array_append(badges, $2::jsonb),
             total_xp = total_xp + $3,
             level = FLOOR(SQRT((total_xp + $3) / 100.0)) + 1
         WHERE wallet_address = $1`,
        [
          userAddress.toLowerCase(),
          JSON.stringify({ name: badgeName, earned_at: new Date().toISOString() }),
          xpReward
        ]
      );

      await client.query(
        `INSERT INTO xp_transactions (user_address, amount, reason)
         VALUES ($1, $2, $3)`,
        [userAddress.toLowerCase(), xpReward, `Earned badge: ${badgeName}`]
      );

      console.log(`🏆 Awarded badge "${badgeName}" (+${xpReward} XP) to ${userAddress}`);
    } catch (error) {
      console.error('Error awarding badge:', error);
    }
  }

  /**
   * Get user's XP stats
   */
  async getUserStats(userAddress) {
    const result = await pool.query(
      `SELECT 
        wallet_address,
        total_xp,
        level,
        badges,
        created_at,
        (SELECT COUNT(*) FROM xp_transactions WHERE user_address = $1) as total_transactions,
        (SELECT SUM(amount) FROM xp_transactions WHERE user_address = $1 AND created_at::date = CURRENT_DATE) as today_xp,
        (SELECT COUNT(DISTINCT created_at::date) FROM xp_transactions 
         WHERE user_address = $1 AND reason LIKE 'Daily login%'
         AND created_at >= CURRENT_DATE - INTERVAL '30 days') as login_streak
       FROM users 
       WHERE wallet_address = $1`,
      [userAddress.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  /**
   * Get global XP statistics
   */
  async getGlobalStats() {
    const result = await pool.query(`
      SELECT 
        COUNT(DISTINCT wallet_address) as total_users,
        SUM(total_xp) as total_xp_awarded,
        ${TOTAL_XP_POOL} as total_xp_pool,
        ${TOTAL_XP_POOL} - COALESCE(SUM(total_xp), 0) as remaining_xp_pool,
        AVG(level) as average_level,
        MAX(total_xp) as highest_xp
      FROM users
    `);

    return result.rows[0];
  }

  /**
   * Calculate token conversion rate
   */
  async calculateTokenConversion(userAddress) {
    const stats = await this.getUserStats(userAddress);
    if (!stats) return { xp: 0, tokens: 0, sbtBonus: 0 };

    // Check if user has Genesis SBT
    const sbtResult = await pool.query(
      `SELECT COUNT(*) as has_sbt FROM xp_transactions 
       WHERE user_address = $1 AND reason LIKE '%Genesis SBT%'`,
      [userAddress.toLowerCase()]
    );
    const hasSBT = parseInt(sbtResult.rows[0].has_sbt) > 0;

    // Conversion formula: 1000 XP = 1 Token
    // Genesis SBT holders get 20% bonus
    const baseTokens = stats.total_xp / 1000;
    const sbtBonus = hasSBT ? baseTokens * 0.2 : 0;
    const totalTokens = baseTokens + sbtBonus;

    return {
      xp: stats.total_xp,
      baseTokens,
      sbtBonus,
      totalTokens,
      hasSBT,
      level: stats.level,
      badges: stats.badges?.length || 0
    };
  }
}

module.exports = new EnhancedXPService();
