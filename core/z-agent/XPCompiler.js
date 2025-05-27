/**
 * XPCompiler.js
 * 
 * Tracks and compiles user experience points across platform services in the Birlik Platform.
 * This component is responsible for:
 * - Tracking user XP across all platform services
 * - Compiling XP into rewards and achievements
 * - Managing XP transactions and history
 * - Providing XP analytics and insights
 */

const { v4: uuidv4 } = require('uuid');
const winston = require('winston');
const axios = require('axios');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'xp-compiler' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: 'xp-compiler.log' }),
  ],
});

class XPCompiler {
  constructor() {
    this.userXP = new Map();
    this.xpTransactions = [];
    this.xpRules = {
      'bank': {
        'transfer': 5,
        'deposit': 3,
        'withdrawal': 2,
        'loan_payment': 10,
      },
      'exchange': {
        'buy': 5,
        'sell': 5,
        'trade': 8,
        'stake': 15,
      },
      'real_estate': {
        'view_property': 1,
        'contact_seller': 3,
        'make_offer': 10,
        'complete_purchase': 50,
      },
      'vehicles': {
        'view_vehicle': 1,
        'contact_seller': 3,
        'test_drive': 10,
        'complete_purchase': 40,
      },
      'logistics': {
        'create_shipment': 8,
        'track_shipment': 2,
        'complete_delivery': 15,
      },
      'marketplace': {
        'view_item': 1,
        'add_to_cart': 2,
        'purchase': 10,
        'leave_review': 5,
      },
      'islamic_banking': {
        'halal_check': 3,
        'zakat_calculation': 5,
        'islamic_investment': 10,
      },
      'delivery': {
        'place_order': 5,
        'track_order': 2,
        'receive_order': 8,
      },
      'taxi': {
        'book_ride': 5,
        'complete_ride': 10,
        'rate_driver': 3,
      },
      'dao': {
        'vote': 15,
        'propose': 25,
        'delegate': 10,
      },
      'identity': {
        'verify_document': 10,
        'complete_kyc': 30,
        'update_profile': 5,
      },
      'workforce': {
        'post_job': 10,
        'apply_job': 5,
        'complete_job': 30,
      },
      'mission': {
        'start': 5,
        'progress': 10,
        'complete': 50,
      },
    };
    
    this.achievementLevels = [
      { name: 'Novice', threshold: 0 },
      { name: 'Apprentice', threshold: 100 },
      { name: 'Adept', threshold: 500 },
      { name: 'Expert', threshold: 1000 },
      { name: 'Master', threshold: 5000 },
      { name: 'Grandmaster', threshold: 10000 },
      { name: 'Legend', threshold: 50000 },
    ];
  }

  /**
   * Add XP for a user action
   * @param {string} userId - The user ID
   * @param {string} service - The service name
   * @param {string} action - The action name
   * @param {Object} context - Additional context for the action
   * @returns {Object} - The XP transaction
   */
  addXP(userId, service, action, context = {}) {
    try {
      const xpAmount = this.getXPAmount(service, action);
      
      const transaction = {
        id: uuidv4(),
        user_id: userId,
        amount: xpAmount,
        source: `${service}.${action}`,
        description: `Earned ${xpAmount} XP for ${action} in ${service}`,
        created_at: new Date().toISOString(),
        context,
      };
      
      this.updateUserXP(userId, xpAmount);
      
      this.xpTransactions.push(transaction);
      
      logger.info(`Added ${xpAmount} XP to user ${userId} for ${action} in ${service}`);
      
      return transaction;
    } catch (error) {
      logger.error(`Error adding XP: ${error.message}`);
      throw new Error(`Failed to add XP: ${error.message}`);
    }
  }

  /**
   * Get XP amount for a service action
   * @param {string} service - The service name
   * @param {string} action - The action name
   * @returns {number} - The XP amount
   */
  getXPAmount(service, action) {
    const serviceRules = this.xpRules[service];
    if (!serviceRules) {
      return 1; // Default XP for unknown service
    }
    
    const actionXP = serviceRules[action];
    if (!actionXP) {
      return 1; // Default XP for unknown action
    }
    
    return actionXP;
  }

  /**
   * Update user XP
   * @param {string} userId - The user ID
   * @param {number} amount - The XP amount to add
   */
  updateUserXP(userId, amount) {
    const currentXP = this.userXP.get(userId) || 0;
    const newXP = currentXP + amount;
    this.userXP.set(userId, newXP);
    
    const previousLevel = this.getUserLevel(currentXP);
    const newLevel = this.getUserLevel(newXP);
    
    if (newLevel.name !== previousLevel.name) {
      logger.info(`User ${userId} leveled up to ${newLevel.name}!`);
    }
  }

  /**
   * Get user's current XP
   * @param {string} userId - The user ID
   * @returns {number} - The user's XP
   */
  getUserXP(userId) {
    return this.userXP.get(userId) || 0;
  }

  /**
   * Get user's level based on XP
   * @param {number} xp - The user's XP
   * @returns {Object} - The user's level
   */
  getUserLevel(xp) {
    let userLevel = this.achievementLevels[0];
    
    for (const level of this.achievementLevels) {
      if (xp >= level.threshold) {
        userLevel = level;
      } else {
        break;
      }
    }
    
    return userLevel;
  }

  /**
   * Get user's XP transactions
   * @param {string} userId - The user ID
   * @param {number} limit - The maximum number of transactions to return
   * @returns {Array} - The user's XP transactions
   */
  getUserTransactions(userId, limit = 10) {
    return this.xpTransactions
      .filter(tx => tx.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);
  }

  /**
   * Get user's XP summary
   * @param {string} userId - The user ID
   * @returns {Object} - The user's XP summary
   */
  getUserXPSummary(userId) {
    const xp = this.getUserXP(userId);
    const level = this.getUserLevel(xp);
    const nextLevel = this.achievementLevels.find(l => l.threshold > xp) || level;
    const progress = nextLevel.threshold > level.threshold 
      ? (xp - level.threshold) / (nextLevel.threshold - level.threshold) * 100
      : 100;
    
    return {
      user_id: userId,
      xp,
      level: level.name,
      next_level: nextLevel.name,
      progress: Math.min(progress, 100),
      transactions_count: this.xpTransactions.filter(tx => tx.user_id === userId).length,
    };
  }

  /**
   * Get leaderboard
   * @param {number} limit - The maximum number of users to return
   * @returns {Array} - The leaderboard
   */
  getLeaderboard(limit = 10) {
    const leaderboard = [];
    
    for (const [userId, xp] of this.userXP.entries()) {
      leaderboard.push({
        user_id: userId,
        xp,
        level: this.getUserLevel(xp).name,
      });
    }
    
    return leaderboard
      .sort((a, b) => b.xp - a.xp)
      .slice(0, limit);
  }

  /**
   * Update XP rules
   * @param {Object} newRules - The new XP rules
   * @returns {boolean} - Whether the update was successful
   */
  updateXPRules(newRules) {
    try {
      this.xpRules = { ...this.xpRules, ...newRules };
      logger.info('XP rules updated successfully');
      return true;
    } catch (error) {
      logger.error(`Error updating XP rules: ${error.message}`);
      return false;
    }
  }

  /**
   * Get XP analytics for a user
   * @param {string} userId - The user ID
   * @returns {Object} - The user's XP analytics
   */
  getUserXPAnalytics(userId) {
    const transactions = this.xpTransactions.filter(tx => tx.user_id === userId);
    
    const serviceBreakdown = {};
    transactions.forEach(tx => {
      const service = tx.source.split('.')[0];
      serviceBreakdown[service] = (serviceBreakdown[service] || 0) + tx.amount;
    });
    
    const now = new Date();
    const last7Days = Array(7).fill().map((_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });
    
    const dailyXP = {};
    last7Days.forEach(day => {
      dailyXP[day] = 0;
    });
    
    transactions.forEach(tx => {
      const day = tx.created_at.split('T')[0];
      if (dailyXP[day] !== undefined) {
        dailyXP[day] += tx.amount;
      }
    });
    
    return {
      user_id: userId,
      total_xp: this.getUserXP(userId),
      service_breakdown: serviceBreakdown,
      daily_xp: dailyXP,
      transaction_count: transactions.length,
    };
  }

  /**
   * Run XP learning mode to optimize XP distribution
   * @returns {Object} - The learning results
   */
  async runLearningMode() {
    try {
      logger.info('Starting XP learning mode');
      
      const serviceUsage = {};
      this.xpTransactions.forEach(tx => {
        const service = tx.source.split('.')[0];
        serviceUsage[service] = (serviceUsage[service] || 0) + 1;
      });
      
      const totalTransactions = this.xpTransactions.length;
      const serviceDistribution = {};
      Object.entries(serviceUsage).forEach(([service, count]) => {
        serviceDistribution[service] = (count / totalTransactions) * 100;
      });
      
      const adjustedRules = { ...this.xpRules };
      Object.entries(serviceDistribution).forEach(([service, percentage]) => {
        if (percentage < 5 && this.xpRules[service]) {
          Object.keys(this.xpRules[service]).forEach(action => {
            adjustedRules[service][action] = Math.ceil(this.xpRules[service][action] * 1.2);
          });
        }
      });
      
      this.updateXPRules(adjustedRules);
      
      logger.info('XP learning mode completed');
      
      return {
        service_distribution: serviceDistribution,
        adjusted_rules: adjustedRules,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error(`Error in XP learning mode: ${error.message}`);
      throw new Error(`Failed to run XP learning mode: ${error.message}`);
    }
  }
}

const xpCompiler = new XPCompiler();
module.exports = xpCompiler;
