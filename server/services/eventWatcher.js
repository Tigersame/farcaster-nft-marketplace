const { ethers } = require('ethers');
const { pool } = require('../db/pool');
const xpService = require('./xpService');

// Marketplace ABI (events only)
const MARKETPLACE_ABI = [
  "event NFTListed(uint256 indexed tokenId, address indexed seller, uint256 price)",
  "event NFTSold(uint256 indexed tokenId, address indexed buyer, address indexed seller, uint256 price)",
  "event NFTDelisted(uint256 indexed tokenId, address indexed seller)"
];

class EventWatcher {
  constructor() {
    this.provider = null;
    this.contract = null;
    this.isRunning = false;
    this.currentBlock = null;
  }

  async start() {
    try {
      // Determine which network to use
      const isTestnet = process.env.NODE_ENV !== 'production';
      const rpcUrl = isTestnet 
        ? process.env.BASE_SEPOLIA_RPC_URL 
        : process.env.BASE_RPC_URL;

      console.log(`🔗 Connecting to ${isTestnet ? 'Base Sepolia' : 'Base Mainnet'}...`);
      
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      this.contract = new ethers.Contract(
        process.env.MARKETPLACE_CONTRACT_ADDRESS,
        MARKETPLACE_ABI,
        this.provider
      );

      // Get latest block
      this.currentBlock = await this.provider.getBlockNumber();
      console.log(`📦 Starting from block: ${this.currentBlock}`);

      // Process historical events (last 1000 blocks)
      await this.processHistoricalEvents(this.currentBlock - 1000);

      // Start listening for new events
      this.isRunning = true;
      this.setupEventListeners();
      this.startPolling();

      console.log('✅ Event watcher initialized');
    } catch (error) {
      console.error('❌ Failed to start event watcher:', error);
      throw error;
    }
  }

  async stop() {
    this.isRunning = false;
    if (this.contract) {
      this.contract.removeAllListeners();
    }
    console.log('🛑 Event watcher stopped');
  }

  setupEventListeners() {
    // Listen for NFTListed events
    this.contract.on('NFTListed', async (tokenId, seller, price, event) => {
      await this.handleNFTListed(tokenId, seller, price, event);
    });

    // Listen for NFTSold events
    this.contract.on('NFTSold', async (tokenId, buyer, seller, price, event) => {
      await this.handleNFTSold(tokenId, buyer, seller, price, event);
    });

    // Listen for NFTDelisted events
    this.contract.on('NFTDelisted', async (tokenId, seller, event) => {
      await this.handleNFTDelisted(tokenId, seller, event);
    });

    console.log('👂 Event listeners registered');
  }

  async processHistoricalEvents(fromBlock) {
    try {
      console.log(`📜 Processing historical events from block ${fromBlock}...`);
      
      const listedFilter = this.contract.filters.NFTListed();
      const soldFilter = this.contract.filters.NFTSold();
      const delistedFilter = this.contract.filters.NFTDelisted();

      const [listedEvents, soldEvents, delistedEvents] = await Promise.all([
        this.contract.queryFilter(listedFilter, fromBlock),
        this.contract.queryFilter(soldFilter, fromBlock),
        this.contract.queryFilter(delistedFilter, fromBlock)
      ]);

      console.log(`📊 Found ${listedEvents.length} listings, ${soldEvents.length} sales, ${delistedEvents.length} delistings`);

      // Process all events
      for (const event of listedEvents) {
        await this.handleNFTListed(
          event.args.tokenId,
          event.args.seller,
          event.args.price,
          event
        );
      }

      for (const event of soldEvents) {
        await this.handleNFTSold(
          event.args.tokenId,
          event.args.buyer,
          event.args.seller,
          event.args.price,
          event
        );
      }

      for (const event of delistedEvents) {
        await this.handleNFTDelisted(
          event.args.tokenId,
          event.args.seller,
          event
        );
      }

      console.log('✅ Historical events processed');
    } catch (error) {
      console.error('Error processing historical events:', error);
    }
  }

  async handleNFTListed(tokenId, seller, price, event) {
    try {
      const txHash = event.log.transactionHash;
      const blockNumber = event.log.blockNumber;

      // Check if already processed
      const existing = await pool.query(
        'SELECT id FROM marketplace_events WHERE tx_hash = $1',
        [txHash]
      );

      if (existing.rows.length > 0) return;

      // Insert event
      const result = await pool.query(
        `INSERT INTO marketplace_events 
         (event_type, tx_hash, block_number, user_address, token_id, price)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        ['NFTListed', txHash, blockNumber, seller.toLowerCase(), tokenId.toString(), ethers.formatEther(price)]
      );

      // Award XP for listing (50 XP)
      await xpService.awardXP(seller.toLowerCase(), 50, 'Listed NFT', result.rows[0].id);

      // Mark as processed
      await pool.query(
        'UPDATE marketplace_events SET processed = true, xp_awarded = 50 WHERE id = $1',
        [result.rows[0].id]
      );

      console.log(`📝 Listed: Token #${tokenId} by ${seller.slice(0, 8)}...`);
    } catch (error) {
      console.error('Error handling NFTListed:', error);
    }
  }

  async handleNFTSold(tokenId, buyer, seller, price, event) {
    try {
      const txHash = event.log.transactionHash;
      const blockNumber = event.log.blockNumber;

      // Check if already processed
      const existing = await pool.query(
        'SELECT id FROM marketplace_events WHERE tx_hash = $1',
        [txHash]
      );

      if (existing.rows.length > 0) return;

      const priceInEth = ethers.formatEther(price);

      // Insert event
      const result = await pool.query(
        `INSERT INTO marketplace_events 
         (event_type, tx_hash, block_number, user_address, token_id, price)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        ['NFTSold', txHash, blockNumber, buyer.toLowerCase(), tokenId.toString(), priceInEth]
      );

      // Award XP (buyer gets 100 XP, seller gets 150 XP)
      await Promise.all([
        xpService.awardXP(buyer.toLowerCase(), 100, 'Purchased NFT', result.rows[0].id),
        xpService.awardXP(seller.toLowerCase(), 150, 'Sold NFT', result.rows[0].id)
      ]);

      // Check for badges
      await xpService.checkAndAwardBadges(buyer.toLowerCase());
      await xpService.checkAndAwardBadges(seller.toLowerCase());

      // Mark as processed
      await pool.query(
        'UPDATE marketplace_events SET processed = true, xp_awarded = 250 WHERE id = $1',
        [result.rows[0].id]
      );

      console.log(`💰 Sold: Token #${tokenId} for ${priceInEth} ETH`);
    } catch (error) {
      console.error('Error handling NFTSold:', error);
    }
  }

  async handleNFTDelisted(tokenId, seller, event) {
    try {
      const txHash = event.log.transactionHash;
      const blockNumber = event.log.blockNumber;

      // Check if already processed
      const existing = await pool.query(
        'SELECT id FROM marketplace_events WHERE tx_hash = $1',
        [txHash]
      );

      if (existing.rows.length > 0) return;

      // Insert event (no XP for delisting)
      await pool.query(
        `INSERT INTO marketplace_events 
         (event_type, tx_hash, block_number, user_address, token_id, processed)
         VALUES ($1, $2, $3, $4, $5, true)`,
        ['NFTDelisted', txHash, blockNumber, seller.toLowerCase(), tokenId.toString()]
      );

      console.log(`🚫 Delisted: Token #${tokenId}`);
    } catch (error) {
      console.error('Error handling NFTDelisted:', error);
    }
  }

  // Poll for new blocks every 12 seconds (Base block time)
  startPolling() {
    setInterval(async () => {
      if (!this.isRunning) return;

      try {
        const latestBlock = await this.provider.getBlockNumber();
        if (latestBlock > this.currentBlock) {
          this.currentBlock = latestBlock;
        }
      } catch (error) {
        console.error('Error polling for blocks:', error);
      }
    }, 12000);
  }
}

module.exports = new EventWatcher();
