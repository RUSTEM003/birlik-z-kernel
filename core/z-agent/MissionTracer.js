/**
 * MissionTracer.js
 * 
 * Tracks user missions and progress in the Birlik Platform.
 * This component is responsible for:
 * - Creating and managing user missions
 * - Tracking mission progress
 * - Awarding XP for mission completion
 * - Providing mission analytics and insights
 */

const { v4: uuidv4 } = require('uuid');
const winston = require('winston');
const xpCompiler = require('./XPCompiler');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'mission-tracer' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: 'mission-tracer.log' }),
  ],
});

class MissionTracer {
  constructor() {
    this.missions = new Map();
    this.userMissions = new Map();
    this.missionTemplates = new Map();
    
    this.initializeMissionTemplates();
  }

  /**
   * Initialize default mission templates
   */
  initializeMissionTemplates() {
    this.addMissionTemplate('banking_starter', {
      title: 'Banking Starter',
      description: 'Complete your first banking transactions',
      actions: [
        { service: 'bank', operation: 'create_account', count: 1 },
        { service: 'bank', operation: 'deposit', count: 1 },
        { service: 'bank', operation: 'transfer', count: 1 },
      ],
      xp_reward: 50,
      category: 'banking',
      difficulty: 'easy',
    });
    
    this.addMissionTemplate('property_explorer', {
      title: 'Property Explorer',
      description: 'Explore the real estate marketplace',
      actions: [
        { service: 'real_estate', operation: 'view_property', count: 5 },
        { service: 'real_estate', operation: 'save_favorite', count: 2 },
        { service: 'real_estate', operation: 'contact_seller', count: 1 },
      ],
      xp_reward: 75,
      category: 'real_estate',
      difficulty: 'easy',
    });
    
    this.addMissionTemplate('crypto_trader', {
      title: 'Crypto Trader',
      description: 'Start your journey in cryptocurrency trading',
      actions: [
        { service: 'exchange', operation: 'view_market', count: 3 },
        { service: 'exchange', operation: 'buy', count: 1 },
        { service: 'exchange', operation: 'sell', count: 1 },
      ],
      xp_reward: 100,
      category: 'exchange',
      difficulty: 'medium',
    });
    
    this.addMissionTemplate('car_enthusiast', {
      title: 'Car Enthusiast',
      description: 'Explore the automotive marketplace',
      actions: [
        { service: 'vehicles', operation: 'view_vehicle', count: 5 },
        { service: 'vehicles', operation: 'save_favorite', count: 2 },
        { service: 'vehicles', operation: 'contact_seller', count: 1 },
      ],
      xp_reward: 75,
      category: 'automotive',
      difficulty: 'easy',
    });
    
    this.addMissionTemplate('logistics_manager', {
      title: 'Logistics Manager',
      description: 'Manage your first shipment',
      actions: [
        { service: 'logistics', operation: 'create_shipment', count: 1 },
        { service: 'logistics', operation: 'track_shipment', count: 3 },
        { service: 'logistics', operation: 'complete_delivery', count: 1 },
      ],
      xp_reward: 125,
      category: 'logistics',
      difficulty: 'medium',
    });
    
    this.addMissionTemplate('smart_shopper', {
      title: 'Smart Shopper',
      description: 'Make your first purchases in the marketplace',
      actions: [
        { service: 'marketplace', operation: 'view_item', count: 10 },
        { service: 'marketplace', operation: 'add_to_cart', count: 3 },
        { service: 'marketplace', operation: 'purchase', count: 1 },
      ],
      xp_reward: 75,
      category: 'marketplace',
      difficulty: 'easy',
    });
    
    this.addMissionTemplate('halal_investor', {
      title: 'Halal Investor',
      description: 'Explore Islamic banking options',
      actions: [
        { service: 'islamic_banking', operation: 'halal_check', count: 3 },
        { service: 'islamic_banking', operation: 'zakat_calculation', count: 1 },
        { service: 'islamic_banking', operation: 'islamic_investment', count: 1 },
      ],
      xp_reward: 100,
      category: 'islamic_banking',
      difficulty: 'medium',
    });
    
    this.addMissionTemplate('food_explorer', {
      title: 'Food Explorer',
      description: 'Order food from different restaurants',
      actions: [
        { service: 'delivery', operation: 'browse_restaurant', count: 5 },
        { service: 'delivery', operation: 'place_order', count: 2 },
        { service: 'delivery', operation: 'rate_order', count: 2 },
      ],
      xp_reward: 75,
      category: 'delivery',
      difficulty: 'easy',
    });
    
    this.addMissionTemplate('city_explorer', {
      title: 'City Explorer',
      description: 'Explore the city using taxi services',
      actions: [
        { service: 'taxi', operation: 'book_ride', count: 3 },
        { service: 'taxi', operation: 'complete_ride', count: 3 },
        { service: 'taxi', operation: 'rate_driver', count: 3 },
      ],
      xp_reward: 100,
      category: 'taxi',
      difficulty: 'medium',
    });
    
    this.addMissionTemplate('dao_participant', {
      title: 'DAO Participant',
      description: 'Participate in DAO governance',
      actions: [
        { service: 'dao', operation: 'view_proposal', count: 5 },
        { service: 'dao', operation: 'vote', count: 3 },
        { service: 'dao', operation: 'delegate', count: 1 },
      ],
      xp_reward: 150,
      category: 'dao',
      difficulty: 'hard',
    });
    
    this.addMissionTemplate('verified_user', {
      title: 'Verified User',
      description: 'Complete your identity verification',
      actions: [
        { service: 'identity', operation: 'update_profile', count: 1 },
        { service: 'identity', operation: 'verify_document', count: 2 },
        { service: 'identity', operation: 'complete_kyc', count: 1 },
      ],
      xp_reward: 125,
      category: 'identity',
      difficulty: 'medium',
    });
    
    this.addMissionTemplate('job_seeker', {
      title: 'Job Seeker',
      description: 'Start your journey in the workforce marketplace',
      actions: [
        { service: 'workforce', operation: 'view_job', count: 10 },
        { service: 'workforce', operation: 'update_resume', count: 1 },
        { service: 'workforce', operation: 'apply_job', count: 3 },
      ],
      xp_reward: 100,
      category: 'workforce',
      difficulty: 'medium',
    });
  }

  /**
   * Add a mission template
   * @param {string} templateId - The template ID
   * @param {Object} template - The mission template
   * @returns {boolean} - Whether the addition was successful
   */
  addMissionTemplate(templateId, template) {
    try {
      this.missionTemplates.set(templateId, template);
      logger.info(`Added mission template: ${templateId}`);
      return true;
    } catch (error) {
      logger.error(`Error adding mission template: ${error.message}`);
      return false;
    }
  }

  /**
   * Create a mission for a user
   * @param {string} userId - The user ID
   * @param {string} templateId - The mission template ID
   * @returns {Object} - The created mission
   */
  createMission(userId, templateId) {
    try {
      const template = this.missionTemplates.get(templateId);
      if (!template) {
        throw new Error(`Mission template not found: ${templateId}`);
      }
      
      const missionId = uuidv4();
      const mission = {
        id: missionId,
        user_id: userId,
        title: template.title,
        description: template.description,
        actions: template.actions.map(action => ({
          ...action,
          completed: 0,
        })),
        xp_reward: template.xp_reward,
        status: 'pending',
        progress: 0.0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed_at: null,
        category: template.category,
        difficulty: template.difficulty,
      };
      
      this.missions.set(missionId, mission);
      
      if (!this.userMissions.has(userId)) {
        this.userMissions.set(userId, []);
      }
      this.userMissions.get(userId).push(missionId);
      
      logger.info(`Created mission ${missionId} for user ${userId}`);
      
      xpCompiler.addXP(userId, 'mission', 'start', { mission_id: missionId });
      
      return mission;
    } catch (error) {
      logger.error(`Error creating mission: ${error.message}`);
      throw new Error(`Failed to create mission: ${error.message}`);
    }
  }

  /**
   * Update mission progress
   * @param {string} userId - The user ID
   * @param {string} service - The service name
   * @param {string} operation - The operation name
   * @returns {Array} - Updated missions
   */
  updateMissionProgress(userId, service, operation) {
    try {
      const userMissionIds = this.userMissions.get(userId) || [];
      const updatedMissions = [];
      
      userMissionIds.forEach(missionId => {
        const mission = this.missions.get(missionId);
        if (!mission || mission.status !== 'pending') {
          return;
        }
        
        let updated = false;
        
        mission.actions.forEach(action => {
          if (action.service === service && action.operation === operation && action.completed < action.count) {
            action.completed += 1;
            updated = true;
          }
        });
        
        if (updated) {
          const totalActions = mission.actions.reduce((sum, action) => sum + action.count, 0);
          const completedActions = mission.actions.reduce((sum, action) => sum + Math.min(action.completed, action.count), 0);
          mission.progress = (completedActions / totalActions) * 100;
          
          if (mission.progress >= 100) {
            mission.status = 'completed';
            mission.completed_at = new Date().toISOString();
            
            xpCompiler.addXP(userId, 'mission', 'complete', { mission_id: mission.id, xp_reward: mission.xp_reward });
            
            logger.info(`Mission ${mission.id} completed by user ${userId}`);
          } else {
            xpCompiler.addXP(userId, 'mission', 'progress', { mission_id: mission.id });
          }
          
          mission.updated_at = new Date().toISOString();
          this.missions.set(missionId, mission);
          updatedMissions.push(mission);
        }
      });
      
      return updatedMissions;
    } catch (error) {
      logger.error(`Error updating mission progress: ${error.message}`);
      throw new Error(`Failed to update mission progress: ${error.message}`);
    }
  }

  /**
   * Get user missions
   * @param {string} userId - The user ID
   * @param {string} status - Filter by status (optional)
   * @returns {Array} - The user's missions
   */
  getUserMissions(userId, status = null) {
    try {
      const userMissionIds = this.userMissions.get(userId) || [];
      let missions = userMissionIds.map(id => this.missions.get(id)).filter(Boolean);
      
      if (status) {
        missions = missions.filter(mission => mission.status === status);
      }
      
      return missions.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    } catch (error) {
      logger.error(`Error getting user missions: ${error.message}`);
      throw new Error(`Failed to get user missions: ${error.message}`);
    }
  }

  /**
   * Get mission by ID
   * @param {string} missionId - The mission ID
   * @returns {Object|null} - The mission or null if not found
   */
  getMission(missionId) {
    return this.missions.get(missionId) || null;
  }

  /**
   * Get recommended missions for a user
   * @param {string} userId - The user ID
   * @param {number} limit - The maximum number of missions to return
   * @returns {Array} - The recommended missions
   */
  getRecommendedMissions(userId, limit = 3) {
    try {
      const userMissionIds = this.userMissions.get(userId) || [];
      const completedMissions = userMissionIds
        .map(id => this.missions.get(id))
        .filter(mission => mission && mission.status === 'completed');
      
      const userCategories = new Set(completedMissions.map(mission => mission.category));
      
      const availableTemplates = [];
      for (const [templateId, template] of this.missionTemplates.entries()) {
        const alreadyCompleted = completedMissions.some(mission => mission.title === template.title);
        if (!alreadyCompleted) {
          availableTemplates.push({ id: templateId, ...template });
        }
      }
      
      availableTemplates.sort((a, b) => {
        const aRelevance = userCategories.has(a.category) ? 1 : 0;
        const bRelevance = userCategories.has(b.category) ? 1 : 0;
        
        if (aRelevance !== bRelevance) {
          return bRelevance - aRelevance;
        }
        
        const difficultyOrder = { 'easy': 0, 'medium': 1, 'hard': 2 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      });
      
      return availableTemplates.slice(0, limit);
    } catch (error) {
      logger.error(`Error getting recommended missions: ${error.message}`);
      throw new Error(`Failed to get recommended missions: ${error.message}`);
    }
  }

  /**
   * Get mission analytics for a user
   * @param {string} userId - The user ID
   * @returns {Object} - The mission analytics
   */
  getUserMissionAnalytics(userId) {
    try {
      const missions = this.getUserMissions(userId);
      
      const analytics = {
        total_missions: missions.length,
        completed_missions: missions.filter(m => m.status === 'completed').length,
        pending_missions: missions.filter(m => m.status === 'pending').length,
        total_xp_earned: missions
          .filter(m => m.status === 'completed')
          .reduce((sum, m) => sum + m.xp_reward, 0),
        category_breakdown: {},
        difficulty_breakdown: {},
      };
      
      missions.forEach(mission => {
        analytics.category_breakdown[mission.category] = (analytics.category_breakdown[mission.category] || 0) + 1;
      });
      
      missions.forEach(mission => {
        analytics.difficulty_breakdown[mission.difficulty] = (analytics.difficulty_breakdown[mission.difficulty] || 0) + 1;
      });
      
      return analytics;
    } catch (error) {
      logger.error(`Error getting user mission analytics: ${error.message}`);
      throw new Error(`Failed to get user mission analytics: ${error.message}`);
    }
  }

  /**
   * Create custom mission
   * @param {string} userId - The user ID
   * @param {Object} missionData - The mission data
   * @returns {Object} - The created mission
   */
  createCustomMission(userId, missionData) {
    try {
      const missionId = uuidv4();
      const mission = {
        id: missionId,
        user_id: userId,
        title: missionData.title,
        description: missionData.description,
        actions: missionData.actions,
        xp_reward: missionData.xp_reward,
        status: 'pending',
        progress: 0.0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed_at: null,
        category: missionData.category,
        difficulty: missionData.difficulty,
        custom: true,
      };
      
      this.missions.set(missionId, mission);
      
      if (!this.userMissions.has(userId)) {
        this.userMissions.set(userId, []);
      }
      this.userMissions.get(userId).push(missionId);
      
      logger.info(`Created custom mission ${missionId} for user ${userId}`);
      
      xpCompiler.addXP(userId, 'mission', 'start', { mission_id: missionId });
      
      return mission;
    } catch (error) {
      logger.error(`Error creating custom mission: ${error.message}`);
      throw new Error(`Failed to create custom mission: ${error.message}`);
    }
  }
}

const missionTracer = new MissionTracer();
module.exports = missionTracer;
