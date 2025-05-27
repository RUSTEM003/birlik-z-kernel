/**
 * DAOIntentRouter.js
 * 
 * Routes user intents to appropriate services based on DAO governance in the Birlik Platform.
 * This component is responsible for:
 * - Routing user intents to appropriate services
 * - Applying DAO governance rules to routing decisions
 * - Managing service priorities and load balancing
 * - Tracking routing metrics for governance optimization
 */

const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'dao-intent-router' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: 'dao-intent-router.log' }),
  ],
});

class DAOIntentRouter {
  constructor() {
    this.serviceEndpoints = new Map();
    this.governanceRules = new Map();
    this.routingMetrics = {
      totalRouted: 0,
      serviceUsage: {},
      averageResponseTime: {},
    };
    
    this.initializeServiceEndpoints();
    
    this.initializeGovernanceRules();
  }

  /**
   * Initialize default service endpoints
   */
  initializeServiceEndpoints() {
    const services = [
      'exchange', 'real_estate', 'vehicles', 'dao', 
      'logistics', 'bank', 'map', 'app',
      'market', 'islam', 'identity', 'workforce'
    ];
    
    services.forEach(service => {
      this.serviceEndpoints.set(service, {
        url: `http://localhost:8000/api/${service}`,
        health: 'healthy',
        priority: 1,
        lastChecked: new Date().toISOString(),
      });
      
      this.routingMetrics.serviceUsage[service] = 0;
      this.routingMetrics.averageResponseTime[service] = 0;
    });
  }

  /**
   * Initialize default governance rules
   */
  initializeGovernanceRules() {
    this.governanceRules.set('default', {
      priorityOrder: ['identity', 'bank', 'exchange', 'real_estate'],
      loadBalancing: true,
      failover: true,
      maxRetries: 3,
      timeout: 5000,
    });
    
    this.governanceRules.set('high_priority', {
      priorityOrder: ['identity', 'bank'],
      loadBalancing: false,
      failover: true,
      maxRetries: 5,
      timeout: 3000,
    });
  }

  /**
   * Route a user intent to the appropriate service
   * @param {Object} userIntent - The user intent object
   * @returns {Promise<Object>} - The routing result
   */
  async routeIntent(userIntent) {
    try {
      logger.info(`Routing intent: ${userIntent.id} of type: ${userIntent.intent_type}`);
      
      const targetService = this.determineTargetService(userIntent);
      
      const serviceEndpoint = this.serviceEndpoints.get(targetService);
      if (!serviceEndpoint) {
        throw new Error(`Service endpoint not found for: ${targetService}`);
      }
      
      const rules = this.getGovernanceRules(userIntent);
      
      const routingResult = {
        id: uuidv4(),
        intent_id: userIntent.id,
        target_service: targetService,
        service_url: serviceEndpoint.url,
        governance_applied: rules,
        routed_at: new Date().toISOString(),
        status: 'routed',
      };
      
      this.updateRoutingMetrics(targetService);
      
      logger.info(`Intent ${userIntent.id} routed to service: ${targetService}`);
      
      return routingResult;
    } catch (error) {
      logger.error(`Error routing intent: ${error.message}`);
      throw new Error(`Failed to route intent: ${error.message}`);
    }
  }

  /**
   * Determine which service should handle an intent
   * @param {Object} userIntent - The user intent object
   * @returns {string} - The target service name
   */
  determineTargetService(userIntent) {
    const intentTypeToService = {
      'banking': 'bank',
      'real_estate': 'real_estate',
      'automotive': 'vehicles',
      'logistics': 'logistics',
      'exchange': 'exchange',
      'marketplace': 'market',
      'islamic_banking': 'islam',
      'delivery': 'app',
      'taxi': 'app',
      'dao': 'dao',
      'identity': 'identity',
      'workforce': 'workforce',
      'system': 'system',
      'voice': 'system',
    };
    
    return intentTypeToService[userIntent.intent_type] || 'system';
  }

  /**
   * Get governance rules for an intent
   * @param {Object} userIntent - The user intent object
   * @returns {Object} - The governance rules
   */
  getGovernanceRules(userIntent) {
    const ruleSet = userIntent.priority > 5 ? 'high_priority' : 'default';
    
    return this.governanceRules.get(ruleSet);
  }

  /**
   * Update routing metrics for a service
   * @param {string} service - The service name
   */
  updateRoutingMetrics(service) {
    this.routingMetrics.totalRouted += 1;
    this.routingMetrics.serviceUsage[service] = (this.routingMetrics.serviceUsage[service] || 0) + 1;
  }

  /**
   * Check health of all service endpoints
   * @returns {Promise<Object>} - Health check results
   */
  async checkServiceHealth() {
    const results = {};
    
    for (const [service, endpoint] of this.serviceEndpoints.entries()) {
      try {
        const startTime = Date.now();
        const response = await axios.get(`${endpoint.url}/health`, { timeout: 5000 });
        const responseTime = Date.now() - startTime;
        
        endpoint.health = response.data.status || 'healthy';
        endpoint.lastChecked = new Date().toISOString();
        
        const currentAvg = this.routingMetrics.averageResponseTime[service] || 0;
        const totalRequests = this.routingMetrics.serviceUsage[service] || 1;
        this.routingMetrics.averageResponseTime[service] = 
          (currentAvg * (totalRequests - 1) + responseTime) / totalRequests;
        
        results[service] = {
          status: endpoint.health,
          responseTime,
        };
      } catch (error) {
        endpoint.health = 'unhealthy';
        endpoint.lastChecked = new Date().toISOString();
        
        results[service] = {
          status: 'unhealthy',
          error: error.message,
        };
      }
    }
    
    return results;
  }

  /**
   * Update governance rules based on DAO decisions
   * @param {Object} newRules - The new governance rules
   * @returns {boolean} - Whether the update was successful
   */
  updateGovernanceRules(newRules) {
    try {
      for (const [ruleSet, rules] of Object.entries(newRules)) {
        this.governanceRules.set(ruleSet, rules);
      }
      
      logger.info('Governance rules updated successfully');
      return true;
    } catch (error) {
      logger.error(`Error updating governance rules: ${error.message}`);
      return false;
    }
  }

  /**
   * Get current routing metrics
   * @returns {Object} - The routing metrics
   */
  getRoutingMetrics() {
    return {
      ...this.routingMetrics,
      timestamp: new Date().toISOString(),
    };
  }
}

const daoIntentRouter = new DAOIntentRouter();
module.exports = daoIntentRouter;
