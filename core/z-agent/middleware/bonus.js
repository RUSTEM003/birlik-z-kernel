/**
 * Bonus Middleware
 * 
 * Middleware for integrating the BonusEngine with API routes.
 * This middleware tracks user actions and awards bonus points.
 */

const bonusEngine = require('../utils/BonusEngine');
const logger = require('../utils/logger');

/**
 * Middleware to track and award bonus points for API actions
 * @param {string} service - The service name
 * @param {string} action - The action name
 * @returns {Function} - Express middleware function
 */
const trackBonusPoints = (service, action) => {
  return (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(body) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const userId = req.user ? req.user.id : null;
          
          if (userId) {
            const metadata = {
              transaction_value: req.body.amount || req.body.value || 0,
              endpoint: req.originalUrl,
              method: req.method,
              timestamp: new Date().toISOString(),
            };
            
            const transaction = bonusEngine.awardBonusPoints(userId, service, action, metadata);
            
            if (transaction) {
              logger.info(`Awarded ${transaction.points} bonus points to user ${userId} for ${action} in ${service}`);
              
              if (typeof body === 'string' && body.startsWith('{')) {
                try {
                  const jsonBody = JSON.parse(body);
                  jsonBody.bonus = {
                    points_awarded: transaction.points,
                    transaction_id: transaction.id,
                    total_points: bonusEngine.getUserBonusAccount(userId).available_points,
                  };
                  body = JSON.stringify(jsonBody);
                } catch (error) {
                  logger.error(`Error adding bonus info to response: ${error.message}`);
                }
              }
            }
          }
        } catch (error) {
          logger.error(`Error in bonus middleware: ${error.message}`);
        }
      }
      
      return originalSend.call(this, body);
    };
    
    next();
  };
};

/**
 * Middleware to get a user's bonus information
 */
const getBonusInfo = (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    
    if (userId) {
      const bonusAccount = bonusEngine.getUserBonusAccount(userId);
      
      req.bonusAccount = bonusAccount;
    }
  } catch (error) {
    logger.error(`Error getting bonus info: ${error.message}`);
  }
  
  next();
};

/**
 * Middleware to use bonus points for a reward
 * @param {string} reward - The reward type
 * @returns {Function} - Express middleware function
 */
const useBonusPoints = (reward) => {
  return (req, res, next) => {
    try {
      const userId = req.user ? req.user.id : null;
      const points = req.body.points || 0;
      
      if (userId && points > 0) {
        const metadata = {
          endpoint: req.originalUrl,
          method: req.method,
          timestamp: new Date().toISOString(),
          ...req.body,
        };
        
        const transaction = bonusEngine.useBonusPoints(userId, points, reward, metadata);
        
        if (transaction) {
          logger.info(`User ${userId} used ${points} bonus points for ${reward}`);
          
          req.bonusTransaction = transaction;
        } else {
          req.bonusError = 'Insufficient bonus points';
        }
      }
    } catch (error) {
      logger.error(`Error using bonus points: ${error.message}`);
      req.bonusError = error.message;
    }
    
    next();
  };
};

module.exports = {
  trackBonusPoints,
  getBonusInfo,
  useBonusPoints,
};
