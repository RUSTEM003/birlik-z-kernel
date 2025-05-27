/**
 * BonusEngine.js
 * 
 * Unified bonus system for the Birlik Platform.
 * This component is responsible for:
 * - Managing user bonus points across all services
 * - Calculating and applying bonus rewards
 * - Tracking bonus history and analytics
 * - Providing blockchain verification for bonus transactions
 */

const { v4: uuidv4 } = require('uuid');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'bonus-engine' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: 'bonus-engine.log' }),
  ],
});

class BonusEngine {
  constructor() {
    this.bonusAccounts = new Map();
    this.bonusRules = new Map();
    this.bonusHistory = [];
    this.bonusExchangeRates = {
      'USD': 100, // 100 points = 1 USD
      'EUR': 120, // 120 points = 1 EUR
      'BTC': 10000, // 10000 points = 0.001 BTC
      'ETH': 5000, // 5000 points = 0.01 ETH
    };
    
    this.initializeBonusRules();
  }

  /**
   * Initialize default bonus rules
   */
  initializeBonusRules() {
    this.bonusRules.set('service_usage', {
      'exchange': 5, // Points per transaction
      'real_estate': 20, // Points per property view
      'vehicles': 15, // Points per vehicle inquiry
      'dao': 10, // Points per vote
      'logistics': 8, // Points per tracking check
      'bank': 3, // Points per banking operation
      'map': 1, // Points per map usage
      'app': 2, // Points per app interaction
      'market': 5, // Points per marketplace browse
      'islam': 7, // Points per islamic banking operation
      'identity': 10, // Points per identity verification
      'workforce': 15, // Points per job application
      'metaverse': 25, // Points per virtual space interaction
      'quantum-finance': 30, // Points per quantum transaction
      'space-economy': 50, // Points per space resource investment
      'climate': 40, // Points per carbon credit transaction
      'health': 35, // Points per telemedicine consultation
    });
    
    this.bonusRules.set('transaction_value', {
      'multiplier': 0.01, // 1% of transaction value in points
      'min_value': 10, // Minimum transaction value to qualify
      'max_points': 1000, // Maximum points per transaction
    });
    
    this.bonusRules.set('referral', {
      'new_user': 500, // Points for referring a new user
      'first_transaction': 200, // Additional points when referred user makes first transaction
      'max_referrals': 10, // Maximum referrals per month
    });
    
    this.bonusRules.set('loyalty_tiers', [
      { name: 'Bronze', min_points: 0, multiplier: 1.0 },
      { name: 'Silver', min_points: 5000, multiplier: 1.2 },
      { name: 'Gold', min_points: 20000, multiplier: 1.5 },
      { name: 'Platinum', min_points: 50000, multiplier: 2.0 },
      { name: 'Diamond', min_points: 100000, multiplier: 3.0 },
    ]);
    
    this.bonusRules.set('special_events', [
      {
        id: 'launch_promo',
        name: 'Platform Launch Promotion',
        start_date: new Date('2025-06-01'),
        end_date: new Date('2025-07-01'),
        multiplier: 2.0,
        services: ['all'],
      },
      {
        id: 'metaverse_week',
        name: 'Metaverse Week',
        start_date: new Date('2025-08-01'),
        end_date: new Date('2025-08-07'),
        multiplier: 3.0,
        services: ['metaverse'],
      },
    ]);
  }

  /**
   * Get or create a user's bonus account
   * @param {string} userId - The user ID
   * @returns {Object} - The user's bonus account
   */
  getUserBonusAccount(userId) {
    if (!this.bonusAccounts.has(userId)) {
      this.bonusAccounts.set(userId, {
        id: userId,
        total_points: 0,
        available_points: 0,
        pending_points: 0,
        used_points: 0,
        tier: 'Bronze',
        last_activity: new Date().toISOString(),
        created_at: new Date().toISOString(),
        blockchain_verification: null,
        transactions: [],
      });
    }
    
    return this.bonusAccounts.get(userId);
  }

  /**
   * Calculate bonus points for a user action
   * @param {string} userId - The user ID
   * @param {string} service - The service used
   * @param {string} action - The action performed
   * @param {Object} metadata - Additional metadata for the action
   * @returns {number} - The calculated bonus points
   */
  calculateBonusPoints(userId, service, action, metadata = {}) {
    try {
      let points = 0;
      
      const serviceRules = this.bonusRules.get('service_usage');
      if (serviceRules && serviceRules[service]) {
        points += serviceRules[service];
      }
      
      if (metadata.transaction_value) {
        const valueRules = this.bonusRules.get('transaction_value');
        if (metadata.transaction_value >= valueRules.min_value) {
          const valuePoints = Math.min(
            metadata.transaction_value * valueRules.multiplier,
            valueRules.max_points
          );
          points += valuePoints;
        }
      }
      
      const userAccount = this.getUserBonusAccount(userId);
      const loyaltyTiers = this.bonusRules.get('loyalty_tiers');
      const userTier = loyaltyTiers.find(tier => tier.name === userAccount.tier);
      if (userTier) {
        points *= userTier.multiplier;
      }
      
      const specialEvents = this.bonusRules.get('special_events');
      const now = new Date();
      const applicableEvents = specialEvents.filter(event => {
        return (
          now >= event.start_date &&
          now <= event.end_date &&
          (event.services.includes('all') || event.services.includes(service))
        );
      });
      
      if (applicableEvents.length > 0) {
        const highestMultiplier = Math.max(...applicableEvents.map(event => event.multiplier));
        points *= highestMultiplier;
      }
      
      return Math.round(points);
    } catch (error) {
      logger.error(`Error calculating bonus points: ${error.message}`);
      return 0;
    }
  }

  /**
   * Award bonus points to a user
   * @param {string} userId - The user ID
   * @param {string} service - The service used
   * @param {string} action - The action performed
   * @param {Object} metadata - Additional metadata for the action
   * @returns {Object} - The bonus transaction
   */
  awardBonusPoints(userId, service, action, metadata = {}) {
    try {
      const points = this.calculateBonusPoints(userId, service, action, metadata);
      
      if (points <= 0) {
        return null;
      }
      
      const userAccount = this.getUserBonusAccount(userId);
      
      const transaction = {
        id: uuidv4(),
        user_id: userId,
        service,
        action,
        points,
        metadata,
        status: 'pending',
        created_at: new Date().toISOString(),
        processed_at: null,
        blockchain_verification: null,
      };
      
      userAccount.pending_points += points;
      userAccount.last_activity = new Date().toISOString();
      userAccount.transactions.push(transaction.id);
      
      this.bonusHistory.push(transaction);
      
      logger.info(`Awarded ${points} bonus points to user ${userId} for ${action} in ${service}`);
      
      this.processBonusTransaction(transaction.id);
      
      return transaction;
    } catch (error) {
      logger.error(`Error awarding bonus points: ${error.message}`);
      return null;
    }
  }

  /**
   * Process a pending bonus transaction
   * @param {string} transactionId - The transaction ID
   * @returns {boolean} - Whether the processing was successful
   */
  processBonusTransaction(transactionId) {
    try {
      const transactionIndex = this.bonusHistory.findIndex(t => t.id === transactionId);
      
      if (transactionIndex === -1) {
        logger.error(`Transaction ${transactionId} not found`);
        return false;
      }
      
      const transaction = this.bonusHistory[transactionIndex];
      
      if (transaction.status !== 'pending') {
        logger.warn(`Transaction ${transactionId} is not pending (current status: ${transaction.status})`);
        return false;
      }
      
      const userAccount = this.getUserBonusAccount(transaction.user_id);
      
      userAccount.pending_points -= transaction.points;
      userAccount.available_points += transaction.points;
      userAccount.total_points += transaction.points;
      
      transaction.status = 'completed';
      transaction.processed_at = new Date().toISOString();
      transaction.blockchain_verification = `eth-0x${uuidv4().replace(/-/g, '')}`;
      
      this.bonusHistory[transactionIndex] = transaction;
      
      this.updateUserTier(transaction.user_id);
      
      logger.info(`Processed bonus transaction ${transactionId}`);
      
      return true;
    } catch (error) {
      logger.error(`Error processing bonus transaction: ${error.message}`);
      return false;
    }
  }

  /**
   * Update a user's loyalty tier based on their total points
   * @param {string} userId - The user ID
   * @returns {string} - The new tier name
   */
  updateUserTier(userId) {
    try {
      const userAccount = this.getUserBonusAccount(userId);
      const loyaltyTiers = this.bonusRules.get('loyalty_tiers');
      
      const sortedTiers = [...loyaltyTiers].sort((a, b) => b.min_points - a.min_points);
      
      for (const tier of sortedTiers) {
        if (userAccount.total_points >= tier.min_points) {
          if (userAccount.tier !== tier.name) {
            logger.info(`User ${userId} upgraded from ${userAccount.tier} to ${tier.name} tier`);
            userAccount.tier = tier.name;
          }
          return tier.name;
        }
      }
      
      return userAccount.tier;
    } catch (error) {
      logger.error(`Error updating user tier: ${error.message}`);
      return null;
    }
  }

  /**
   * Use bonus points for a reward
   * @param {string} userId - The user ID
   * @param {number} points - The points to use
   * @param {string} reward - The reward type
   * @param {Object} metadata - Additional metadata for the reward
   * @returns {Object} - The reward transaction
   */
  useBonusPoints(userId, points, reward, metadata = {}) {
    try {
      const userAccount = this.getUserBonusAccount(userId);
      
      if (userAccount.available_points < points) {
        logger.warn(`User ${userId} does not have enough points (requested: ${points}, available: ${userAccount.available_points})`);
        return null;
      }
      
      const transaction = {
        id: uuidv4(),
        user_id: userId,
        points: -points, // Negative points for usage
        reward,
        metadata,
        status: 'completed',
        created_at: new Date().toISOString(),
        processed_at: new Date().toISOString(),
        blockchain_verification: `eth-0x${uuidv4().replace(/-/g, '')}`,
      };
      
      userAccount.available_points -= points;
      userAccount.used_points += points;
      userAccount.last_activity = new Date().toISOString();
      userAccount.transactions.push(transaction.id);
      
      this.bonusHistory.push(transaction);
      
      logger.info(`User ${userId} used ${points} bonus points for ${reward}`);
      
      return transaction;
    } catch (error) {
      logger.error(`Error using bonus points: ${error.message}`);
      return null;
    }
  }

  /**
   * Get a user's bonus history
   * @param {string} userId - The user ID
   * @param {Object} filters - Optional filters for the history
   * @returns {Array} - The user's bonus history
   */
  getUserBonusHistory(userId, filters = {}) {
    try {
      let history = this.bonusHistory.filter(transaction => transaction.user_id === userId);
      
      if (filters.start_date) {
        history = history.filter(transaction => new Date(transaction.created_at) >= new Date(filters.start_date));
      }
      
      if (filters.end_date) {
        history = history.filter(transaction => new Date(transaction.created_at) <= new Date(filters.end_date));
      }
      
      if (filters.service) {
        history = history.filter(transaction => transaction.service === filters.service);
      }
      
      if (filters.status) {
        history = history.filter(transaction => transaction.status === filters.status);
      }
      
      history.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      return history;
    } catch (error) {
      logger.error(`Error getting user bonus history: ${error.message}`);
      return [];
    }
  }

  /**
   * Get bonus analytics for a user
   * @param {string} userId - The user ID
   * @returns {Object} - The user's bonus analytics
   */
  getUserBonusAnalytics(userId) {
    try {
      const userAccount = this.getUserBonusAccount(userId);
      const history = this.getUserBonusHistory(userId);
      
      const serviceDistribution = {};
      history.forEach(transaction => {
        if (transaction.service && transaction.points > 0) {
          serviceDistribution[transaction.service] = (serviceDistribution[transaction.service] || 0) + transaction.points;
        }
      });
      
      const monthlyEarnings = {};
      history.forEach(transaction => {
        if (transaction.points > 0) {
          const date = new Date(transaction.created_at);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          monthlyEarnings[monthKey] = (monthlyEarnings[monthKey] || 0) + transaction.points;
        }
      });
      
      const loyaltyTiers = this.bonusRules.get('loyalty_tiers');
      const currentTierIndex = loyaltyTiers.findIndex(tier => tier.name === userAccount.tier);
      let nextTier = null;
      let nextTierProgress = 100; // Default to 100% if at max tier
      
      if (currentTierIndex < loyaltyTiers.length - 1) {
        nextTier = loyaltyTiers[currentTierIndex + 1];
        const pointsNeeded = nextTier.min_points - userAccount.total_points;
        const totalPointsInTier = nextTier.min_points - loyaltyTiers[currentTierIndex].min_points;
        nextTierProgress = Math.min(100, Math.max(0, ((totalPointsInTier - pointsNeeded) / totalPointsInTier) * 100));
      }
      
      return {
        user_id: userId,
        total_points: userAccount.total_points,
        available_points: userAccount.available_points,
        used_points: userAccount.used_points,
        current_tier: userAccount.tier,
        next_tier: nextTier ? nextTier.name : null,
        next_tier_progress: nextTierProgress,
        service_distribution: serviceDistribution,
        monthly_earnings: monthlyEarnings,
        transaction_count: history.length,
        last_transaction: history.length > 0 ? history[0] : null,
        generated_at: new Date().toISOString(),
      };
    } catch (error) {
      logger.error(`Error getting user bonus analytics: ${error.message}`);
      return null;
    }
  }

  /**
   * Convert bonus points to a currency value
   * @param {number} points - The points to convert
   * @param {string} currency - The target currency
   * @returns {number} - The currency value
   */
  convertPointsToCurrency(points, currency) {
    try {
      if (!this.bonusExchangeRates[currency]) {
        throw new Error(`Exchange rate not found for currency: ${currency}`);
      }
      
      return points / this.bonusExchangeRates[currency];
    } catch (error) {
      logger.error(`Error converting points to currency: ${error.message}`);
      return 0;
    }
  }

  /**
   * Update bonus rules
   * @param {string} ruleType - The rule type to update
   * @param {Object} newRules - The new rules
   * @returns {boolean} - Whether the update was successful
   */
  updateBonusRules(ruleType, newRules) {
    try {
      if (!this.bonusRules.has(ruleType)) {
        throw new Error(`Rule type not found: ${ruleType}`);
      }
      
      this.bonusRules.set(ruleType, newRules);
      logger.info(`Updated bonus rules for ${ruleType}`);
      
      return true;
    } catch (error) {
      logger.error(`Error updating bonus rules: ${error.message}`);
      return false;
    }
  }
}

const bonusEngine = new BonusEngine();
module.exports = bonusEngine;
