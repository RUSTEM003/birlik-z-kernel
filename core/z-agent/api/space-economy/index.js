const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const logger = require('../../utils/logger');
const { authenticateToken, authorizeRole } = require('../../middleware/auth');
const { validateRequest } = require('../../middleware/validation');

let spaceResources = [
  {
    id: 'sr-001',
    name: 'Lunar Regolith',
    type: 'mineral',
    location: 'Moon',
    coordinates: { latitude: 0.89, longitude: 23.45 },
    quantity: 1500,
    unit: 'tons',
    owner: 'company-123',
    token_id: 'token-456789',
    blockchain: 'ethereum',
    estimated_value: 75000000,
    currency: 'USD',
    extraction_status: 'planned',
    extraction_date: '2026-07-15T00:00:00Z',
    last_updated: new Date().toISOString()
  },
  {
    id: 'sr-002',
    name: 'Asteroid Water Ice',
    type: 'water',
    location: 'Asteroid Belt - Ceres',
    coordinates: { latitude: -15.22, longitude: 78.91 },
    quantity: 800,
    unit: 'cubic meters',
    owner: 'company-456',
    token_id: 'token-123456',
    blockchain: 'solana',
    estimated_value: 120000000,
    currency: 'USD',
    extraction_status: 'in-progress',
    extraction_date: '2025-11-30T00:00:00Z',
    last_updated: new Date().toISOString()
  },
  {
    id: 'sr-003',
    name: 'Helium-3',
    type: 'gas',
    location: 'Moon - Mare Tranquillitatis',
    coordinates: { latitude: 8.5, longitude: 31.4 },
    quantity: 50,
    unit: 'kilograms',
    owner: 'company-789',
    token_id: 'token-789012',
    blockchain: 'ethereum',
    estimated_value: 250000000,
    currency: 'USD',
    extraction_status: 'completed',
    extraction_date: '2025-03-10T00:00:00Z',
    last_updated: new Date().toISOString()
  }
];

let satelliteData = [
  {
    id: 'sat-001',
    name: 'LogTrack-1',
    type: 'logistics',
    orbit: 'LEO',
    altitude: 550,
    inclination: 53.0,
    owner: 'company-123',
    launch_date: '2024-06-15T00:00:00Z',
    status: 'operational',
    capabilities: ['gps-tracking', 'weather-monitoring', 'communication-relay'],
    coverage_area: 'Northern Hemisphere',
    last_ping: new Date().toISOString(),
    data_feeds: [
      {
        id: 'feed-001',
        name: 'GPS Tracking Feed',
        type: 'location',
        update_frequency: '5s',
        subscribers: 15,
        status: 'active'
      },
      {
        id: 'feed-002',
        name: 'Weather Data Feed',
        type: 'meteorological',
        update_frequency: '30m',
        subscribers: 8,
        status: 'active'
      }
    ]
  },
  {
    id: 'sat-002',
    name: 'ResourceScan-1',
    type: 'resource-monitoring',
    orbit: 'GEO',
    altitude: 35786,
    inclination: 0.0,
    owner: 'company-456',
    launch_date: '2023-11-20T00:00:00Z',
    status: 'operational',
    capabilities: ['multispectral-imaging', 'resource-detection', 'terrain-mapping'],
    coverage_area: 'Global',
    last_ping: new Date().toISOString(),
    data_feeds: [
      {
        id: 'feed-003',
        name: 'Resource Detection Feed',
        type: 'spectral',
        update_frequency: '1h',
        subscribers: 23,
        status: 'active'
      }
    ]
  }
];

let spaceProjects = [
  {
    id: 'proj-001',
    name: 'Lunar Mining Base Alpha',
    type: 'infrastructure',
    location: 'Moon - South Pole',
    status: 'funding',
    start_date: '2026-01-01T00:00:00Z',
    estimated_completion: '2029-12-31T00:00:00Z',
    total_budget: 1500000000,
    currency: 'USD',
    funding_secured: 450000000,
    funding_goal: 1500000000,
    owner: 'company-123',
    investors: [
      {
        id: 'inv-001',
        name: 'Space Ventures LLC',
        investment_amount: 250000000,
        investment_date: '2024-10-15T00:00:00Z',
        equity_percentage: 15
      },
      {
        id: 'inv-002',
        name: 'Lunar Resources Fund',
        investment_amount: 200000000,
        investment_date: '2024-11-30T00:00:00Z',
        equity_percentage: 12
      }
    ],
    milestones: [
      {
        id: 'ms-001',
        name: 'Site Selection',
        status: 'completed',
        completion_date: '2024-05-20T00:00:00Z'
      },
      {
        id: 'ms-002',
        name: 'Initial Equipment Delivery',
        status: 'planned',
        target_date: '2026-06-30T00:00:00Z'
      }
    ]
  },
  {
    id: 'proj-002',
    name: 'Orbital Manufacturing Platform',
    type: 'manufacturing',
    location: 'LEO',
    status: 'in-progress',
    start_date: '2024-03-15T00:00:00Z',
    estimated_completion: '2027-08-31T00:00:00Z',
    total_budget: 850000000,
    currency: 'USD',
    funding_secured: 850000000,
    funding_goal: 850000000,
    owner: 'company-789',
    investors: [
      {
        id: 'inv-003',
        name: 'Orbital Industries',
        investment_amount: 500000000,
        investment_date: '2023-12-01T00:00:00Z',
        equity_percentage: 40
      },
      {
        id: 'inv-004',
        name: 'Space Manufacturing Fund',
        investment_amount: 350000000,
        investment_date: '2024-01-15T00:00:00Z',
        equity_percentage: 25
      }
    ],
    milestones: [
      {
        id: 'ms-003',
        name: 'Core Module Launch',
        status: 'completed',
        completion_date: '2024-07-10T00:00:00Z'
      },
      {
        id: 'ms-004',
        name: 'Manufacturing Equipment Installation',
        status: 'in-progress',
        target_date: '2025-03-31T00:00:00Z'
      }
    ]
  }
];

router.get('/resources', authenticateToken, async (req, res) => {
  try {
    logger.info('Fetching all space resources');
    
    const { type, location, extraction_status } = req.query;
    let filteredResources = [...spaceResources];
    
    if (type) {
      filteredResources = filteredResources.filter(resource => resource.type === type);
    }
    
    if (location) {
      filteredResources = filteredResources.filter(resource => resource.location.includes(location));
    }
    
    if (extraction_status) {
      filteredResources = filteredResources.filter(resource => resource.extraction_status === extraction_status);
    }
    
    res.status(200).json({
      success: true,
      count: filteredResources.length,
      data: filteredResources
    });
  } catch (error) {
    logger.error(`Error fetching space resources: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching space resources'
    });
  }
});

router.get('/resources/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching space resource with ID: ${id}`);
    
    const resource = spaceResources.find(r => r.id === id);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Space resource not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: resource
    });
  } catch (error) {
    logger.error(`Error fetching space resource: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching space resource'
    });
  }
});

router.post('/resources', authenticateToken, validateRequest, async (req, res) => {
  try {
    const { name, type, location, coordinates, quantity, unit, blockchain } = req.body;
    logger.info(`Registering new space resource: ${name}`);
    
    const newResource = {
      id: `sr-${uuidv4().substring(0, 8)}`,
      name,
      type,
      location,
      coordinates,
      quantity: parseFloat(quantity),
      unit,
      owner: req.user.id,
      token_id: `token-${Math.floor(Math.random() * 1000000)}`,
      blockchain,
      estimated_value: req.body.estimated_value || 0,
      currency: req.body.currency || 'USD',
      extraction_status: req.body.extraction_status || 'planned',
      extraction_date: req.body.extraction_date || null,
      last_updated: new Date().toISOString()
    };
    
    spaceResources.push(newResource);
    
    res.status(201).json({
      success: true,
      data: newResource
    });
  } catch (error) {
    logger.error(`Error registering space resource: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while registering space resource'
    });
  }
});

router.put('/resources/:id', authenticateToken, validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    logger.info(`Updating space resource with ID: ${id}`);
    
    const resourceIndex = spaceResources.findIndex(r => r.id === id);
    
    if (resourceIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Space resource not found'
      });
    }
    
    if (spaceResources[resourceIndex].owner !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this space resource'
      });
    }
    
    spaceResources[resourceIndex] = {
      ...spaceResources[resourceIndex],
      ...updates,
      last_updated: new Date().toISOString()
    };
    
    res.status(200).json({
      success: true,
      data: spaceResources[resourceIndex]
    });
  } catch (error) {
    logger.error(`Error updating space resource: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while updating space resource'
    });
  }
});

router.post('/resources/:id/transfer', authenticateToken, validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const { new_owner } = req.body;
    logger.info(`Transferring ownership of space resource with ID: ${id}`);
    
    const resourceIndex = spaceResources.findIndex(r => r.id === id);
    
    if (resourceIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Space resource not found'
      });
    }
    
    if (spaceResources[resourceIndex].owner !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to transfer this space resource'
      });
    }
    
    spaceResources[resourceIndex].owner = new_owner;
    spaceResources[resourceIndex].last_updated = new Date().toISOString();
    
    res.status(200).json({
      success: true,
      data: spaceResources[resourceIndex],
      message: 'Resource ownership transferred successfully'
    });
  } catch (error) {
    logger.error(`Error transferring space resource: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while transferring space resource'
    });
  }
});

router.get('/satellites', authenticateToken, async (req, res) => {
  try {
    logger.info('Fetching all satellite data');
    
    const { type, status, orbit } = req.query;
    let filteredSatellites = [...satelliteData];
    
    if (type) {
      filteredSatellites = filteredSatellites.filter(satellite => satellite.type === type);
    }
    
    if (status) {
      filteredSatellites = filteredSatellites.filter(satellite => satellite.status === status);
    }
    
    if (orbit) {
      filteredSatellites = filteredSatellites.filter(satellite => satellite.orbit === orbit);
    }
    
    res.status(200).json({
      success: true,
      count: filteredSatellites.length,
      data: filteredSatellites
    });
  } catch (error) {
    logger.error(`Error fetching satellite data: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching satellite data'
    });
  }
});

router.get('/satellites/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching satellite with ID: ${id}`);
    
    const satellite = satelliteData.find(s => s.id === id);
    
    if (!satellite) {
      return res.status(404).json({
        success: false,
        error: 'Satellite not found'
      });
    }
    
    satellite.last_ping = new Date().toISOString();
    
    res.status(200).json({
      success: true,
      data: satellite
    });
  } catch (error) {
    logger.error(`Error fetching satellite: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching satellite'
    });
  }
});

router.post('/satellites', authenticateToken, validateRequest, async (req, res) => {
  try {
    const { name, type, orbit, altitude, inclination, capabilities, coverage_area } = req.body;
    logger.info(`Registering new satellite: ${name}`);
    
    const newSatellite = {
      id: `sat-${uuidv4().substring(0, 8)}`,
      name,
      type,
      orbit,
      altitude: parseFloat(altitude),
      inclination: parseFloat(inclination),
      owner: req.user.id,
      launch_date: req.body.launch_date || new Date().toISOString(),
      status: req.body.status || 'planned',
      capabilities: capabilities || [],
      coverage_area,
      last_ping: new Date().toISOString(),
      data_feeds: []
    };
    
    satelliteData.push(newSatellite);
    
    res.status(201).json({
      success: true,
      data: newSatellite
    });
  } catch (error) {
    logger.error(`Error registering satellite: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while registering satellite'
    });
  }
});

router.post('/satellites/:id/feeds', authenticateToken, validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, update_frequency } = req.body;
    logger.info(`Adding data feed to satellite with ID: ${id}`);
    
    const satelliteIndex = satelliteData.findIndex(s => s.id === id);
    
    if (satelliteIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Satellite not found'
      });
    }
    
    if (satelliteData[satelliteIndex].owner !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to modify this satellite'
      });
    }
    
    if (satelliteData[satelliteIndex].status !== 'operational') {
      return res.status(400).json({
        success: false,
        error: 'Cannot add data feeds to non-operational satellites'
      });
    }
    
    const newFeed = {
      id: `feed-${uuidv4().substring(0, 8)}`,
      name,
      type,
      update_frequency,
      subscribers: 0,
      status: 'active'
    };
    
    satelliteData[satelliteIndex].data_feeds.push(newFeed);
    
    res.status(201).json({
      success: true,
      data: newFeed
    });
  } catch (error) {
    logger.error(`Error adding data feed to satellite: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while adding data feed to satellite'
    });
  }
});

router.post('/satellites/:satelliteId/feeds/:feedId/subscribe', authenticateToken, async (req, res) => {
  try {
    const { satelliteId, feedId } = req.params;
    logger.info(`Subscribing to satellite data feed: ${feedId}`);
    
    const satellite = satelliteData.find(s => s.id === satelliteId);
    
    if (!satellite) {
      return res.status(404).json({
        success: false,
        error: 'Satellite not found'
      });
    }
    
    const feedIndex = satellite.data_feeds.findIndex(f => f.id === feedId);
    
    if (feedIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Data feed not found'
      });
    }
    
    if (satellite.data_feeds[feedIndex].status !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'Cannot subscribe to inactive data feed'
      });
    }
    
    satellite.data_feeds[feedIndex].subscribers += 1;
    
    const subscription = {
      id: `sub-${uuidv4().substring(0, 8)}`,
      user_id: req.user.id,
      satellite_id: satelliteId,
      feed_id: feedId,
      created_at: new Date().toISOString(),
      status: 'active'
    };
    
    res.status(200).json({
      success: true,
      data: subscription,
      message: 'Successfully subscribed to data feed'
    });
  } catch (error) {
    logger.error(`Error subscribing to data feed: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while subscribing to data feed'
    });
  }
});

router.get('/projects', authenticateToken, async (req, res) => {
  try {
    logger.info('Fetching all space projects');
    
    const { type, status, location } = req.query;
    let filteredProjects = [...spaceProjects];
    
    if (type) {
      filteredProjects = filteredProjects.filter(project => project.type === type);
    }
    
    if (status) {
      filteredProjects = filteredProjects.filter(project => project.status === status);
    }
    
    if (location) {
      filteredProjects = filteredProjects.filter(project => project.location.includes(location));
    }
    
    res.status(200).json({
      success: true,
      count: filteredProjects.length,
      data: filteredProjects
    });
  } catch (error) {
    logger.error(`Error fetching space projects: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching space projects'
    });
  }
});

router.get('/projects/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching space project with ID: ${id}`);
    
    const project = spaceProjects.find(p => p.id === id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Space project not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    logger.error(`Error fetching space project: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching space project'
    });
  }
});

router.post('/projects', authenticateToken, validateRequest, async (req, res) => {
  try {
    const { name, type, location, total_budget, currency, funding_goal, start_date, estimated_completion } = req.body;
    logger.info(`Creating new space project: ${name}`);
    
    const newProject = {
      id: `proj-${uuidv4().substring(0, 8)}`,
      name,
      type,
      location,
      status: 'funding',
      start_date,
      estimated_completion,
      total_budget: parseFloat(total_budget),
      currency,
      funding_secured: 0,
      funding_goal: parseFloat(funding_goal),
      owner: req.user.id,
      investors: [],
      milestones: []
    };
    
    spaceProjects.push(newProject);
    
    res.status(201).json({
      success: true,
      data: newProject
    });
  } catch (error) {
    logger.error(`Error creating space project: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while creating space project'
    });
  }
});

router.post('/projects/:id/investors', authenticateToken, validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, investment_amount, equity_percentage } = req.body;
    logger.info(`Adding investor to space project with ID: ${id}`);
    
    const projectIndex = spaceProjects.findIndex(p => p.id === id);
    
    if (projectIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Space project not found'
      });
    }
    
    if (spaceProjects[projectIndex].owner !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to modify this space project'
      });
    }
    
    const newInvestor = {
      id: `inv-${uuidv4().substring(0, 8)}`,
      name,
      investment_amount: parseFloat(investment_amount),
      investment_date: new Date().toISOString(),
      equity_percentage: parseFloat(equity_percentage)
    };
    
    spaceProjects[projectIndex].investors.push(newInvestor);
    
    spaceProjects[projectIndex].funding_secured += newInvestor.investment_amount;
    
    if (spaceProjects[projectIndex].funding_secured >= spaceProjects[projectIndex].funding_goal) {
      spaceProjects[projectIndex].status = 'funded';
    }
    
    res.status(201).json({
      success: true,
      data: {
        investor: newInvestor,
        project_funding: {
          total_budget: spaceProjects[projectIndex].total_budget,
          funding_secured: spaceProjects[projectIndex].funding_secured,
          funding_goal: spaceProjects[projectIndex].funding_goal,
          funding_percentage: (spaceProjects[projectIndex].funding_secured / spaceProjects[projectIndex].funding_goal) * 100
        }
      }
    });
  } catch (error) {
    logger.error(`Error adding investor to space project: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while adding investor to space project'
    });
  }
});

router.post('/projects/:id/milestones', authenticateToken, validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, target_date } = req.body;
    logger.info(`Adding milestone to space project with ID: ${id}`);
    
    const projectIndex = spaceProjects.findIndex(p => p.id === id);
    
    if (projectIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Space project not found'
      });
    }
    
    if (spaceProjects[projectIndex].owner !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to modify this space project'
      });
    }
    
    const newMilestone = {
      id: `ms-${uuidv4().substring(0, 8)}`,
      name,
      status: status || 'planned',
      target_date,
      completion_date: status === 'completed' ? new Date().toISOString() : null
    };
    
    spaceProjects[projectIndex].milestones.push(newMilestone);
    
    res.status(201).json({
      success: true,
      data: newMilestone
    });
  } catch (error) {
    logger.error(`Error adding milestone to space project: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while adding milestone to space project'
    });
  }
});

router.put('/projects/:projectId/milestones/:milestoneId', authenticateToken, validateRequest, async (req, res) => {
  try {
    const { projectId, milestoneId } = req.params;
    const { status } = req.body;
    logger.info(`Updating milestone status for project ID: ${projectId}, milestone ID: ${milestoneId}`);
    
    const projectIndex = spaceProjects.findIndex(p => p.id === projectId);
    
    if (projectIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Space project not found'
      });
    }
    
    if (spaceProjects[projectIndex].owner !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to modify this space project'
      });
    }
    
    const milestoneIndex = spaceProjects[projectIndex].milestones.findIndex(m => m.id === milestoneId);
    
    if (milestoneIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Milestone not found'
      });
    }
    
    spaceProjects[projectIndex].milestones[milestoneIndex].status = status;
    
    if (status === 'completed') {
      spaceProjects[projectIndex].milestones[milestoneIndex].completion_date = new Date().toISOString();
    } else {
      spaceProjects[projectIndex].milestones[milestoneIndex].completion_date = null;
    }
    
    const allCompleted = spaceProjects[projectIndex].milestones.every(m => m.status === 'completed');
    
    if (allCompleted && spaceProjects[projectIndex].milestones.length > 0) {
      spaceProjects[projectIndex].status = 'completed';
    }
    
    res.status(200).json({
      success: true,
      data: spaceProjects[projectIndex].milestones[milestoneIndex]
    });
  } catch (error) {
    logger.error(`Error updating milestone status: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while updating milestone status'
    });
  }
});

module.exports = router;
