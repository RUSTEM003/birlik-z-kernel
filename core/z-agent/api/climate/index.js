const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const logger = require('../../utils/logger');
const { authenticateToken, authorizeRole } = require('../../middleware/auth');
const { validateRequest } = require('../../middleware/validation');

let carbonCredits = [
  {
    id: 'cc-001',
    name: 'Reforestation Project Alpha',
    type: 'reforestation',
    location: 'Amazon Rainforest, Brazil',
    coordinates: { latitude: -3.4653, longitude: -62.2159 },
    total_credits: 50000,
    available_credits: 35000,
    price_per_credit: 12.5,
    currency: 'USD',
    verification_standard: 'Gold Standard',
    verification_date: '2024-03-15T00:00:00Z',
    project_start: '2023-01-01T00:00:00Z',
    project_end: '2033-01-01T00:00:00Z',
    owner: 'company-123',
    blockchain_id: 'eth-0x1234567890abcdef1234567890abcdef12345678',
    status: 'active',
    impact_metrics: {
      co2_reduction: 50000,
      trees_planted: 100000,
      area_restored: 500,
      area_unit: 'hectares'
    },
    last_updated: new Date().toISOString()
  },
  {
    id: 'cc-002',
    name: 'Solar Farm Initiative',
    type: 'renewable-energy',
    location: 'Rajasthan, India',
    coordinates: { latitude: 27.0238, longitude: 74.2179 },
    total_credits: 75000,
    available_credits: 60000,
    price_per_credit: 10.75,
    currency: 'USD',
    verification_standard: 'Verified Carbon Standard',
    verification_date: '2024-02-20T00:00:00Z',
    project_start: '2022-06-15T00:00:00Z',
    project_end: '2042-06-15T00:00:00Z',
    owner: 'company-456',
    blockchain_id: 'sol-So11111111111111111111111111111111111111112',
    status: 'active',
    impact_metrics: {
      co2_reduction: 75000,
      energy_generated: 120000,
      energy_unit: 'MWh',
      households_powered: 15000
    },
    last_updated: new Date().toISOString()
  }
];

let esgRatings = [
  {
    id: 'esg-001',
    company_name: 'Green Future Corp',
    company_id: 'company-123',
    industry: 'Energy',
    overall_score: 85,
    environmental_score: 92,
    social_score: 78,
    governance_score: 84,
    rating_agency: 'Sustainable Analytics',
    rating_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    next_review_date: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(),
    key_strengths: [
      'Renewable energy transition',
      'Carbon neutrality commitment',
      'Diverse board composition'
    ],
    improvement_areas: [
      'Supply chain transparency',
      'Water usage efficiency'
    ],
    verification_status: 'verified',
    blockchain_proof: 'eth-0xabcdef1234567890abcdef1234567890abcdef12',
    historical_ratings: [
      {
        date: new Date(Date.now() - 395 * 24 * 60 * 60 * 1000).toISOString(),
        overall_score: 79
      },
      {
        date: new Date(Date.now() - 760 * 24 * 60 * 60 * 1000).toISOString(),
        overall_score: 72
      }
    ]
  },
  {
    id: 'esg-002',
    company_name: 'Sustainable Logistics Inc',
    company_id: 'company-456',
    industry: 'Transportation',
    overall_score: 76,
    environmental_score: 68,
    social_score: 82,
    governance_score: 79,
    rating_agency: 'ESG Global Ratings',
    rating_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    next_review_date: new Date(Date.now() + 320 * 24 * 60 * 60 * 1000).toISOString(),
    key_strengths: [
      'Electric vehicle fleet transition',
      'Employee welfare programs',
      'Transparent governance structure'
    ],
    improvement_areas: [
      'Scope 3 emissions reduction',
      'Packaging waste management'
    ],
    verification_status: 'verified',
    blockchain_proof: 'sol-So11111111111111111111111111111111111111113',
    historical_ratings: [
      {
        date: new Date(Date.now() - 410 * 24 * 60 * 60 * 1000).toISOString(),
        overall_score: 71
      },
      {
        date: new Date(Date.now() - 775 * 24 * 60 * 60 * 1000).toISOString(),
        overall_score: 65
      }
    ]
  }
];

let environmentalProjects = [
  {
    id: 'ep-001',
    name: 'Ocean Cleanup Initiative',
    type: 'conservation',
    location: 'Pacific Ocean',
    coordinates: { latitude: 28.5011, longitude: -145.0300 },
    status: 'active',
    start_date: '2023-05-10T00:00:00Z',
    estimated_completion: '2026-05-10T00:00:00Z',
    total_budget: 12000000,
    currency: 'USD',
    funding_secured: 8500000,
    funding_goal: 12000000,
    lead_organization: 'Ocean Health Foundation',
    partners: ['Marine Conservation Alliance', 'Global Plastics Initiative'],
    impact_goals: {
      plastic_removed: 5000,
      plastic_unit: 'tons',
      marine_life_protected: 'Multiple endangered species',
      area_protected: 100000,
      area_unit: 'square kilometers'
    },
    blockchain_verification: 'eth-0x7890abcdef1234567890abcdef1234567890abcd',
    milestones: [
      {
        id: 'ms-001',
        name: 'Initial Deployment',
        status: 'completed',
        completion_date: '2023-08-15T00:00:00Z'
      },
      {
        id: 'ms-002',
        name: 'First 1000 Tons Removed',
        status: 'in-progress',
        target_date: '2024-12-31T00:00:00Z'
      }
    ],
    last_updated: new Date().toISOString()
  },
  {
    id: 'ep-002',
    name: 'Urban Reforestation Program',
    type: 'reforestation',
    location: 'Multiple Cities, Global',
    coordinates: null, // Multiple locations
    status: 'active',
    start_date: '2022-09-01T00:00:00Z',
    estimated_completion: '2027-09-01T00:00:00Z',
    total_budget: 8500000,
    currency: 'USD',
    funding_secured: 5200000,
    funding_goal: 8500000,
    lead_organization: 'Green Cities Initiative',
    partners: ['Urban Planning Institute', 'Community Gardens Network'],
    impact_goals: {
      trees_planted: 1000000,
      cities_involved: 50,
      co2_reduction: 250000,
      co2_unit: 'tons',
      green_spaces_created: 500,
      green_space_unit: 'hectares'
    },
    blockchain_verification: 'sol-So11111111111111111111111111111111111111114',
    milestones: [
      {
        id: 'ms-003',
        name: 'First 100,000 Trees',
        status: 'completed',
        completion_date: '2023-06-30T00:00:00Z'
      },
      {
        id: 'ms-004',
        name: 'Expansion to 25 Cities',
        status: 'completed',
        completion_date: '2024-02-15T00:00:00Z'
      },
      {
        id: 'ms-005',
        name: 'Reach 500,000 Trees',
        status: 'planned',
        target_date: '2025-12-31T00:00:00Z'
      }
    ],
    last_updated: new Date().toISOString()
  }
];

let carbonFootprints = [
  {
    id: 'cf-001',
    entity_id: 'user-123',
    entity_type: 'individual',
    total_emissions: 12.5,
    emission_unit: 'tons CO2e',
    calculation_period: {
      start_date: '2024-01-01T00:00:00Z',
      end_date: '2024-12-31T00:00:00Z'
    },
    calculation_method: 'consumption-based',
    verification_status: 'verified',
    verification_date: '2024-04-15T00:00:00Z',
    breakdown: {
      transportation: 5.2,
      housing: 3.8,
      food: 2.1,
      goods_services: 1.4
    },
    reduction_targets: {
      target_year: 2025,
      target_reduction_percentage: 15,
      current_progress_percentage: 5
    },
    offset_credits_purchased: 5,
    offset_credits_remaining: 5,
    last_updated: new Date().toISOString()
  },
  {
    id: 'cf-002',
    entity_id: 'company-456',
    entity_type: 'organization',
    total_emissions: 75000,
    emission_unit: 'tons CO2e',
    calculation_period: {
      start_date: '2023-01-01T00:00:00Z',
      end_date: '2023-12-31T00:00:00Z'
    },
    calculation_method: 'GHG Protocol',
    verification_status: 'verified',
    verification_date: '2024-03-20T00:00:00Z',
    breakdown: {
      scope_1: 15000,
      scope_2: 25000,
      scope_3: 35000
    },
    reduction_targets: {
      target_year: 2030,
      target_reduction_percentage: 50,
      current_progress_percentage: 12
    },
    offset_credits_purchased: 30000,
    offset_credits_remaining: 30000,
    last_updated: new Date().toISOString()
  }
];

router.get('/carbon-credits', authenticateToken, async (req, res) => {
  try {
    logger.info('Fetching all carbon credits');
    
    const { type, status, verification_standard } = req.query;
    let filteredCredits = [...carbonCredits];
    
    if (type) {
      filteredCredits = filteredCredits.filter(credit => credit.type === type);
    }
    
    if (status) {
      filteredCredits = filteredCredits.filter(credit => credit.status === status);
    }
    
    if (verification_standard) {
      filteredCredits = filteredCredits.filter(credit => credit.verification_standard === verification_standard);
    }
    
    res.status(200).json({
      success: true,
      count: filteredCredits.length,
      data: filteredCredits
    });
  } catch (error) {
    logger.error(`Error fetching carbon credits: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching carbon credits'
    });
  }
});

router.get('/carbon-credits/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching carbon credit with ID: ${id}`);
    
    const credit = carbonCredits.find(c => c.id === id);
    
    if (!credit) {
      return res.status(404).json({
        success: false,
        error: 'Carbon credit not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: credit
    });
  } catch (error) {
    logger.error(`Error fetching carbon credit: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching carbon credit'
    });
  }
});

router.post('/carbon-credits', authenticateToken, validateRequest, async (req, res) => {
  try {
    const { name, type, location, coordinates, total_credits, price_per_credit, currency, verification_standard, project_start, project_end, impact_metrics } = req.body;
    logger.info(`Registering new carbon credit project: ${name}`);
    
    const newCredit = {
      id: `cc-${uuidv4().substring(0, 8)}`,
      name,
      type,
      location,
      coordinates,
      total_credits: parseInt(total_credits),
      available_credits: parseInt(total_credits), // Initially all credits are available
      price_per_credit: parseFloat(price_per_credit),
      currency,
      verification_standard,
      verification_date: new Date().toISOString(),
      project_start,
      project_end,
      owner: req.user.id,
      blockchain_id: `eth-0x${uuidv4().replace(/-/g, '')}`,
      status: 'pending_verification',
      impact_metrics,
      last_updated: new Date().toISOString()
    };
    
    carbonCredits.push(newCredit);
    
    res.status(201).json({
      success: true,
      data: newCredit
    });
  } catch (error) {
    logger.error(`Error registering carbon credit project: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while registering carbon credit project'
    });
  }
});

router.post('/carbon-credits/:id/purchase', authenticateToken, validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    logger.info(`Purchasing ${amount} carbon credits from project ID: ${id}`);
    
    const creditIndex = carbonCredits.findIndex(c => c.id === id);
    
    if (creditIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Carbon credit project not found'
      });
    }
    
    const credit = carbonCredits[creditIndex];
    
    if (credit.available_credits < amount) {
      return res.status(400).json({
        success: false,
        error: 'Not enough carbon credits available for purchase'
      });
    }
    
    const totalCost = amount * credit.price_per_credit;
    
    carbonCredits[creditIndex].available_credits -= amount;
    carbonCredits[creditIndex].last_updated = new Date().toISOString();
    
    const purchase = {
      id: `purchase-${uuidv4().substring(0, 8)}`,
      credit_id: id,
      buyer_id: req.user.id,
      amount: parseInt(amount),
      total_cost: totalCost,
      currency: credit.currency,
      purchase_date: new Date().toISOString(),
      blockchain_transaction: `tx-${uuidv4().replace(/-/g, '')}`
    };
    
    const footprintIndex = carbonFootprints.findIndex(cf => cf.entity_id === req.user.id);
    if (footprintIndex !== -1) {
      carbonFootprints[footprintIndex].offset_credits_purchased += parseInt(amount);
      carbonFootprints[footprintIndex].offset_credits_remaining += parseInt(amount);
      carbonFootprints[footprintIndex].last_updated = new Date().toISOString();
    }
    
    res.status(200).json({
      success: true,
      data: {
        purchase,
        remaining_credits: carbonCredits[creditIndex].available_credits
      }
    });
  } catch (error) {
    logger.error(`Error purchasing carbon credits: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while purchasing carbon credits'
    });
  }
});

router.get('/esg-ratings', authenticateToken, async (req, res) => {
  try {
    logger.info('Fetching all ESG ratings');
    
    const { industry, company_id, min_score } = req.query;
    let filteredRatings = [...esgRatings];
    
    if (industry) {
      filteredRatings = filteredRatings.filter(rating => rating.industry === industry);
    }
    
    if (company_id) {
      filteredRatings = filteredRatings.filter(rating => rating.company_id === company_id);
    }
    
    if (min_score) {
      const minScoreValue = parseInt(min_score);
      filteredRatings = filteredRatings.filter(rating => rating.overall_score >= minScoreValue);
    }
    
    res.status(200).json({
      success: true,
      count: filteredRatings.length,
      data: filteredRatings
    });
  } catch (error) {
    logger.error(`Error fetching ESG ratings: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching ESG ratings'
    });
  }
});

router.get('/esg-ratings/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching ESG rating with ID: ${id}`);
    
    const rating = esgRatings.find(r => r.id === id);
    
    if (!rating) {
      return res.status(404).json({
        success: false,
        error: 'ESG rating not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: rating
    });
  } catch (error) {
    logger.error(`Error fetching ESG rating: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching ESG rating'
    });
  }
});

router.post('/esg-ratings', authenticateToken, authorizeRole(['admin', 'rating_agency']), validateRequest, async (req, res) => {
  try {
    const { company_name, company_id, industry, environmental_score, social_score, governance_score, key_strengths, improvement_areas } = req.body;
    logger.info(`Creating new ESG rating for company: ${company_name}`);
    
    const overall_score = Math.round((environmental_score * 0.4) + (social_score * 0.3) + (governance_score * 0.3));
    
    const newRating = {
      id: `esg-${uuidv4().substring(0, 8)}`,
      company_name,
      company_id,
      industry,
      overall_score,
      environmental_score,
      social_score,
      governance_score,
      rating_agency: req.user.organization || 'Independent Analyst',
      rating_date: new Date().toISOString(),
      next_review_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      key_strengths: key_strengths || [],
      improvement_areas: improvement_areas || [],
      verification_status: 'pending',
      blockchain_proof: null,
      historical_ratings: []
    };
    
    const existingRatingIndex = esgRatings.findIndex(r => r.company_id === company_id);
    if (existingRatingIndex !== -1) {
      const existingRating = esgRatings[existingRatingIndex];
      
      newRating.historical_ratings = [
        {
          date: existingRating.rating_date,
          overall_score: existingRating.overall_score
        },
        ...existingRating.historical_ratings
      ];
      
      esgRatings.splice(existingRatingIndex, 1);
    }
    
    esgRatings.push(newRating);
    
    res.status(201).json({
      success: true,
      data: newRating
    });
  } catch (error) {
    logger.error(`Error creating ESG rating: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while creating ESG rating'
    });
  }
});

router.post('/esg-ratings/:id/verify', authenticateToken, authorizeRole(['admin', 'verifier']), async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Verifying ESG rating with ID: ${id}`);
    
    const ratingIndex = esgRatings.findIndex(r => r.id === id);
    
    if (ratingIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'ESG rating not found'
      });
    }
    
    esgRatings[ratingIndex].verification_status = 'verified';
    esgRatings[ratingIndex].blockchain_proof = `eth-0x${uuidv4().replace(/-/g, '')}`;
    
    res.status(200).json({
      success: true,
      data: esgRatings[ratingIndex]
    });
  } catch (error) {
    logger.error(`Error verifying ESG rating: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while verifying ESG rating'
    });
  }
});

router.get('/projects', authenticateToken, async (req, res) => {
  try {
    logger.info('Fetching all environmental projects');
    
    const { type, status } = req.query;
    let filteredProjects = [...environmentalProjects];
    
    if (type) {
      filteredProjects = filteredProjects.filter(project => project.type === type);
    }
    
    if (status) {
      filteredProjects = filteredProjects.filter(project => project.status === status);
    }
    
    res.status(200).json({
      success: true,
      count: filteredProjects.length,
      data: filteredProjects
    });
  } catch (error) {
    logger.error(`Error fetching environmental projects: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching environmental projects'
    });
  }
});

router.get('/projects/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching environmental project with ID: ${id}`);
    
    const project = environmentalProjects.find(p => p.id === id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Environmental project not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    logger.error(`Error fetching environmental project: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching environmental project'
    });
  }
});

router.post('/projects', authenticateToken, validateRequest, async (req, res) => {
  try {
    const { name, type, location, coordinates, start_date, estimated_completion, total_budget, currency, funding_goal, lead_organization, partners, impact_goals } = req.body;
    logger.info(`Creating new environmental project: ${name}`);
    
    const newProject = {
      id: `ep-${uuidv4().substring(0, 8)}`,
      name,
      type,
      location,
      coordinates,
      status: 'planning',
      start_date,
      estimated_completion,
      total_budget: parseFloat(total_budget),
      currency,
      funding_secured: 0,
      funding_goal: parseFloat(funding_goal),
      lead_organization,
      partners: partners || [],
      impact_goals,
      blockchain_verification: null,
      milestones: [],
      last_updated: new Date().toISOString()
    };
    
    environmentalProjects.push(newProject);
    
    res.status(201).json({
      success: true,
      data: newProject
    });
  } catch (error) {
    logger.error(`Error creating environmental project: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while creating environmental project'
    });
  }
});

router.post('/projects/:id/fund', authenticateToken, validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, funder_name } = req.body;
    logger.info(`Adding funding to environmental project with ID: ${id}`);
    
    const projectIndex = environmentalProjects.findIndex(p => p.id === id);
    
    if (projectIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Environmental project not found'
      });
    }
    
    const project = environmentalProjects[projectIndex];
    const fundingAmount = parseFloat(amount);
    
    environmentalProjects[projectIndex].funding_secured += fundingAmount;
    environmentalProjects[projectIndex].last_updated = new Date().toISOString();
    
    if (environmentalProjects[projectIndex].funding_secured >= environmentalProjects[projectIndex].funding_goal) {
      if (environmentalProjects[projectIndex].status === 'planning') {
        environmentalProjects[projectIndex].status = 'funded';
      }
    }
    
    const funding = {
      id: `fund-${uuidv4().substring(0, 8)}`,
      project_id: id,
      funder_id: req.user.id,
      funder_name: funder_name || req.user.name,
      amount: fundingAmount,
      currency: project.currency,
      funding_date: new Date().toISOString(),
      blockchain_transaction: `tx-${uuidv4().replace(/-/g, '')}`
    };
    
    res.status(200).json({
      success: true,
      data: {
        funding,
        project_funding: {
          total_budget: project.total_budget,
          funding_secured: environmentalProjects[projectIndex].funding_secured,
          funding_goal: project.funding_goal,
          funding_percentage: (environmentalProjects[projectIndex].funding_secured / project.funding_goal) * 100
        }
      }
    });
  } catch (error) {
    logger.error(`Error adding funding to environmental project: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while adding funding to environmental project'
    });
  }
});

router.post('/projects/:id/milestones', authenticateToken, validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, target_date } = req.body;
    logger.info(`Adding milestone to environmental project with ID: ${id}`);
    
    const projectIndex = environmentalProjects.findIndex(p => p.id === id);
    
    if (projectIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Environmental project not found'
      });
    }
    
    const newMilestone = {
      id: `ms-${uuidv4().substring(0, 8)}`,
      name,
      status: status || 'planned',
      target_date,
      completion_date: status === 'completed' ? new Date().toISOString() : null
    };
    
    environmentalProjects[projectIndex].milestones.push(newMilestone);
    environmentalProjects[projectIndex].last_updated = new Date().toISOString();
    
    res.status(201).json({
      success: true,
      data: newMilestone
    });
  } catch (error) {
    logger.error(`Error adding milestone to environmental project: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while adding milestone to environmental project'
    });
  }
});

router.get('/carbon-footprints', authenticateToken, async (req, res) => {
  try {
    logger.info('Fetching all carbon footprints');
    
    const { entity_type, entity_id } = req.query;
    let filteredFootprints = [...carbonFootprints];
    
    if (entity_type) {
      filteredFootprints = filteredFootprints.filter(footprint => footprint.entity_type === entity_type);
    }
    
    if (entity_id) {
      filteredFootprints = filteredFootprints.filter(footprint => footprint.entity_id === entity_id);
    }
    
    res.status(200).json({
      success: true,
      count: filteredFootprints.length,
      data: filteredFootprints
    });
  } catch (error) {
    logger.error(`Error fetching carbon footprints: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching carbon footprints'
    });
  }
});

router.get('/carbon-footprints/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching carbon footprint with ID: ${id}`);
    
    const footprint = carbonFootprints.find(cf => cf.id === id);
    
    if (!footprint) {
      return res.status(404).json({
        success: false,
        error: 'Carbon footprint not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: footprint
    });
  } catch (error) {
    logger.error(`Error fetching carbon footprint: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching carbon footprint'
    });
  }
});

router.post('/carbon-footprints', authenticateToken, validateRequest, async (req, res) => {
  try {
    const { entity_type, total_emissions, emission_unit, calculation_period, calculation_method, breakdown } = req.body;
    logger.info(`Creating/updating carbon footprint for entity: ${req.user.id}`);
    
    const footprintIndex = carbonFootprints.findIndex(cf => cf.entity_id === req.user.id);
    
    if (footprintIndex !== -1) {
      const existingFootprint = carbonFootprints[footprintIndex];
      
      carbonFootprints[footprintIndex] = {
        ...existingFootprint,
        total_emissions: parseFloat(total_emissions),
        emission_unit,
        calculation_period,
        calculation_method,
        verification_status: 'pending',
        breakdown,
        last_updated: new Date().toISOString()
      };
      
      res.status(200).json({
        success: true,
        data: carbonFootprints[footprintIndex]
      });
    } else {
      const newFootprint = {
        id: `cf-${uuidv4().substring(0, 8)}`,
        entity_id: req.user.id,
        entity_type,
        total_emissions: parseFloat(total_emissions),
        emission_unit,
        calculation_period,
        calculation_method,
        verification_status: 'pending',
        verification_date: null,
        breakdown,
        reduction_targets: req.body.reduction_targets || {
          target_year: new Date().getFullYear() + 1,
          target_reduction_percentage: 10,
          current_progress_percentage: 0
        },
        offset_credits_purchased: 0,
        offset_credits_remaining: 0,
        last_updated: new Date().toISOString()
      };
      
      carbonFootprints.push(newFootprint);
      
      res.status(201).json({
        success: true,
        data: newFootprint
      });
    }
  } catch (error) {
    logger.error(`Error creating/updating carbon footprint: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while creating/updating carbon footprint'
    });
  }
});

router.post('/carbon-footprints/:id/verify', authenticateToken, authorizeRole(['admin', 'verifier']), async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Verifying carbon footprint with ID: ${id}`);
    
    const footprintIndex = carbonFootprints.findIndex(cf => cf.id === id);
    
    if (footprintIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Carbon footprint not found'
      });
    }
    
    carbonFootprints[footprintIndex].verification_status = 'verified';
    carbonFootprints[footprintIndex].verification_date = new Date().toISOString();
    carbonFootprints[footprintIndex].last_updated = new Date().toISOString();
    
    res.status(200).json({
      success: true,
      data: carbonFootprints[footprintIndex]
    });
  } catch (error) {
    logger.error(`Error verifying carbon footprint: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while verifying carbon footprint'
    });
  }
});

router.post('/carbon-footprints/:id/apply-offsets', authenticateToken, validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const { offset_amount } = req.body;
    logger.info(`Applying ${offset_amount} carbon offsets to footprint ID: ${id}`);
    
    const footprintIndex = carbonFootprints.findIndex(cf => cf.id === id);
    
    if (footprintIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Carbon footprint not found'
      });
    }
    
    const footprint = carbonFootprints[footprintIndex];
    
    if (footprint.offset_credits_remaining < offset_amount) {
      return res.status(400).json({
        success: false,
        error: 'Not enough offset credits available'
      });
    }
    
    carbonFootprints[footprintIndex].offset_credits_remaining -= parseFloat(offset_amount);
    
    const totalEmissions = footprint.total_emissions;
    const totalOffsetsApplied = footprint.offset_credits_purchased - carbonFootprints[footprintIndex].offset_credits_remaining;
    const newProgressPercentage = Math.min(100, Math.round((totalOffsetsApplied / totalEmissions) * 100));
    
    carbonFootprints[footprintIndex].reduction_targets.current_progress_percentage = newProgressPercentage;
    carbonFootprints[footprintIndex].last_updated = new Date().toISOString();
    
    res.status(200).json({
      success: true,
      data: {
        footprint_id: id,
        offsets_applied: parseFloat(offset_amount),
        remaining_offsets: carbonFootprints[footprintIndex].offset_credits_remaining,
        current_progress_percentage: newProgressPercentage
      }
    });
  } catch (error) {
    logger.error(`Error applying carbon offsets: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while applying carbon offsets'
    });
  }
});

module.exports = router;
