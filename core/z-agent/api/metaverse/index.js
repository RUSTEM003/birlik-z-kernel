const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const logger = require('../../utils/logger');
const { authenticateToken, authorizeRole } = require('../../middleware/auth');
const { validateRequest } = require('../../middleware/validation');

let virtualSpaces = [
  {
    id: 'vs-001',
    name: 'Executive Virtual Office',
    type: 'business',
    capacity: 50,
    features: ['video-conferencing', 'document-sharing', 'whiteboard', '3d-models'],
    owner: 'user-123',
    access: 'private',
    created_at: new Date().toISOString(),
    last_accessed: new Date().toISOString(),
    coordinates: { x: 120, y: 45, z: 10 },
    active_users: 0
  },
  {
    id: 'vs-002',
    name: 'Virtual Exhibition Hall',
    type: 'business',
    capacity: 500,
    features: ['product-showcase', '3d-models', 'live-presentations', 'analytics'],
    owner: 'company-456',
    access: 'public',
    created_at: new Date().toISOString(),
    last_accessed: new Date().toISOString(),
    coordinates: { x: 300, y: 100, z: 5 },
    active_users: 23
  },
  {
    id: 'vs-003',
    name: 'Entertainment Plaza',
    type: 'entertainment',
    capacity: 1000,
    features: ['games', 'concerts', 'social-networking', 'avatar-customization'],
    owner: 'company-789',
    access: 'public',
    created_at: new Date().toISOString(),
    last_accessed: new Date().toISOString(),
    coordinates: { x: 500, y: 200, z: 0 },
    active_users: 342
  }
];

let digitalAssets = [
  {
    id: 'nft-001',
    name: 'Premium Office Space',
    type: 'real-estate',
    token_id: 'token-123456',
    blockchain: 'ethereum',
    owner: 'user-123',
    price: 5.2,
    currency: 'ETH',
    created_at: new Date().toISOString(),
    metadata: {
      size: '500 sq m',
      location: 'Business District',
      amenities: ['reception', 'meeting-rooms', 'lounge']
    },
    image_url: 'https://assets.birlik.io/metaverse/nft-001.jpg'
  },
  {
    id: 'nft-002',
    name: 'Luxury Virtual Apartment',
    type: 'real-estate',
    token_id: 'token-789012',
    blockchain: 'solana',
    owner: 'user-456',
    price: 120,
    currency: 'SOL',
    created_at: new Date().toISOString(),
    metadata: {
      size: '200 sq m',
      location: 'Residential Zone',
      amenities: ['balcony', 'smart-home', 'private-access']
    },
    image_url: 'https://assets.birlik.io/metaverse/nft-002.jpg'
  }
];

let iotDevices = [
  {
    id: 'iot-001',
    name: 'Smart Office Controller',
    type: 'controller',
    connected_to: 'vs-001',
    owner: 'user-123',
    status: 'online',
    last_ping: new Date().toISOString(),
    capabilities: ['climate-control', 'lighting', 'security'],
    physical_location: {
      address: '123 Business Ave, New York',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    }
  },
  {
    id: 'iot-002',
    name: 'Exhibition Display System',
    type: 'display',
    connected_to: 'vs-002',
    owner: 'company-456',
    status: 'online',
    last_ping: new Date().toISOString(),
    capabilities: ['product-display', 'interactive-demo', 'visitor-tracking'],
    physical_location: {
      address: '456 Expo Center, Las Vegas',
      coordinates: { lat: 36.1699, lng: -115.1398 }
    }
  }
];

router.get('/spaces', authenticateToken, async (req, res) => {
  try {
    logger.info('Fetching all virtual spaces');
    
    const { type, access } = req.query;
    let filteredSpaces = [...virtualSpaces];
    
    if (type) {
      filteredSpaces = filteredSpaces.filter(space => space.type === type);
    }
    
    if (access) {
      filteredSpaces = filteredSpaces.filter(space => space.access === access);
    }
    
    res.status(200).json({
      success: true,
      count: filteredSpaces.length,
      data: filteredSpaces
    });
  } catch (error) {
    logger.error(`Error fetching virtual spaces: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching virtual spaces'
    });
  }
});

router.get('/spaces/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching virtual space with ID: ${id}`);
    
    const space = virtualSpaces.find(s => s.id === id);
    
    if (!space) {
      return res.status(404).json({
        success: false,
        error: 'Virtual space not found'
      });
    }
    
    space.last_accessed = new Date().toISOString();
    
    res.status(200).json({
      success: true,
      data: space
    });
  } catch (error) {
    logger.error(`Error fetching virtual space: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching virtual space'
    });
  }
});

router.post('/spaces', authenticateToken, validateRequest, async (req, res) => {
  try {
    const { name, type, capacity, features, access } = req.body;
    logger.info(`Creating new virtual space: ${name}`);
    
    const newSpace = {
      id: `vs-${uuidv4().substring(0, 8)}`,
      name,
      type,
      capacity: parseInt(capacity),
      features: features || [],
      owner: req.user.id,
      access: access || 'private',
      created_at: new Date().toISOString(),
      last_accessed: new Date().toISOString(),
      coordinates: { 
        x: Math.floor(Math.random() * 1000), 
        y: Math.floor(Math.random() * 500), 
        z: Math.floor(Math.random() * 20)
      },
      active_users: 0
    };
    
    virtualSpaces.push(newSpace);
    
    res.status(201).json({
      success: true,
      data: newSpace
    });
  } catch (error) {
    logger.error(`Error creating virtual space: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while creating virtual space'
    });
  }
});

router.put('/spaces/:id', authenticateToken, validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    logger.info(`Updating virtual space with ID: ${id}`);
    
    const spaceIndex = virtualSpaces.findIndex(s => s.id === id);
    
    if (spaceIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Virtual space not found'
      });
    }
    
    if (virtualSpaces[spaceIndex].owner !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this virtual space'
      });
    }
    
    virtualSpaces[spaceIndex] = {
      ...virtualSpaces[spaceIndex],
      ...updates,
      last_accessed: new Date().toISOString()
    };
    
    res.status(200).json({
      success: true,
      data: virtualSpaces[spaceIndex]
    });
  } catch (error) {
    logger.error(`Error updating virtual space: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while updating virtual space'
    });
  }
});

router.delete('/spaces/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Deleting virtual space with ID: ${id}`);
    
    const spaceIndex = virtualSpaces.findIndex(s => s.id === id);
    
    if (spaceIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Virtual space not found'
      });
    }
    
    if (virtualSpaces[spaceIndex].owner !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this virtual space'
      });
    }
    
    virtualSpaces.splice(spaceIndex, 1);
    
    res.status(200).json({
      success: true,
      message: 'Virtual space deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting virtual space: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting virtual space'
    });
  }
});

router.get('/assets', authenticateToken, async (req, res) => {
  try {
    logger.info('Fetching all digital assets');
    
    const { type, blockchain } = req.query;
    let filteredAssets = [...digitalAssets];
    
    if (type) {
      filteredAssets = filteredAssets.filter(asset => asset.type === type);
    }
    
    if (blockchain) {
      filteredAssets = filteredAssets.filter(asset => asset.blockchain === blockchain);
    }
    
    res.status(200).json({
      success: true,
      count: filteredAssets.length,
      data: filteredAssets
    });
  } catch (error) {
    logger.error(`Error fetching digital assets: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching digital assets'
    });
  }
});

router.get('/assets/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching digital asset with ID: ${id}`);
    
    const asset = digitalAssets.find(a => a.id === id);
    
    if (!asset) {
      return res.status(404).json({
        success: false,
        error: 'Digital asset not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: asset
    });
  } catch (error) {
    logger.error(`Error fetching digital asset: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching digital asset'
    });
  }
});

router.post('/assets', authenticateToken, validateRequest, async (req, res) => {
  try {
    const { name, type, blockchain, price, currency, metadata } = req.body;
    logger.info(`Creating new digital asset: ${name}`);
    
    const newAsset = {
      id: `nft-${uuidv4().substring(0, 8)}`,
      name,
      type,
      token_id: `token-${Math.floor(Math.random() * 1000000)}`,
      blockchain,
      owner: req.user.id,
      price: parseFloat(price),
      currency,
      created_at: new Date().toISOString(),
      metadata,
      image_url: req.body.image_url || `https://assets.birlik.io/metaverse/nft-${uuidv4().substring(0, 8)}.jpg`
    };
    
    digitalAssets.push(newAsset);
    
    res.status(201).json({
      success: true,
      data: newAsset
    });
  } catch (error) {
    logger.error(`Error creating digital asset: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while creating digital asset'
    });
  }
});

router.post('/assets/:id/transfer', authenticateToken, validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const { new_owner } = req.body;
    logger.info(`Transferring ownership of digital asset with ID: ${id}`);
    
    const assetIndex = digitalAssets.findIndex(a => a.id === id);
    
    if (assetIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Digital asset not found'
      });
    }
    
    if (digitalAssets[assetIndex].owner !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to transfer this digital asset'
      });
    }
    
    digitalAssets[assetIndex].owner = new_owner;
    
    res.status(200).json({
      success: true,
      data: digitalAssets[assetIndex],
      message: 'Asset transferred successfully'
    });
  } catch (error) {
    logger.error(`Error transferring digital asset: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while transferring digital asset'
    });
  }
});

router.get('/iot-devices', authenticateToken, async (req, res) => {
  try {
    logger.info('Fetching all IoT devices');
    
    const { type, status } = req.query;
    let filteredDevices = [...iotDevices];
    
    if (type) {
      filteredDevices = filteredDevices.filter(device => device.type === type);
    }
    
    if (status) {
      filteredDevices = filteredDevices.filter(device => device.status === status);
    }
    
    res.status(200).json({
      success: true,
      count: filteredDevices.length,
      data: filteredDevices
    });
  } catch (error) {
    logger.error(`Error fetching IoT devices: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching IoT devices'
    });
  }
});

router.get('/iot-devices/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching IoT device with ID: ${id}`);
    
    const device = iotDevices.find(d => d.id === id);
    
    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'IoT device not found'
      });
    }
    
    device.last_ping = new Date().toISOString();
    
    res.status(200).json({
      success: true,
      data: device
    });
  } catch (error) {
    logger.error(`Error fetching IoT device: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching IoT device'
    });
  }
});

router.post('/iot-devices', authenticateToken, validateRequest, async (req, res) => {
  try {
    const { name, type, connected_to, capabilities, physical_location } = req.body;
    logger.info(`Registering new IoT device: ${name}`);
    
    const newDevice = {
      id: `iot-${uuidv4().substring(0, 8)}`,
      name,
      type,
      connected_to,
      owner: req.user.id,
      status: 'online',
      last_ping: new Date().toISOString(),
      capabilities: capabilities || [],
      physical_location
    };
    
    iotDevices.push(newDevice);
    
    res.status(201).json({
      success: true,
      data: newDevice
    });
  } catch (error) {
    logger.error(`Error registering IoT device: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while registering IoT device'
    });
  }
});

router.put('/iot-devices/:id/status', authenticateToken, validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    logger.info(`Updating status of IoT device with ID: ${id}`);
    
    const deviceIndex = iotDevices.findIndex(d => d.id === id);
    
    if (deviceIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'IoT device not found'
      });
    }
    
    if (iotDevices[deviceIndex].owner !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this IoT device'
      });
    }
    
    iotDevices[deviceIndex].status = status;
    iotDevices[deviceIndex].last_ping = new Date().toISOString();
    
    res.status(200).json({
      success: true,
      data: iotDevices[deviceIndex]
    });
  } catch (error) {
    logger.error(`Error updating IoT device status: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while updating IoT device status'
    });
  }
});

router.post('/iot-devices/:id/command', authenticateToken, validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const { command, parameters } = req.body;
    logger.info(`Sending command to IoT device with ID: ${id}`);
    
    const device = iotDevices.find(d => d.id === id);
    
    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'IoT device not found'
      });
    }
    
    if (device.owner !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to control this IoT device'
      });
    }
    
    if (device.status !== 'online') {
      return res.status(400).json({
        success: false,
        error: 'IoT device is offline'
      });
    }
    
    const commandResult = {
      device_id: id,
      command,
      parameters,
      timestamp: new Date().toISOString(),
      status: 'executed',
      result: {
        success: true,
        message: `Command ${command} executed successfully`
      }
    };
    
    res.status(200).json({
      success: true,
      data: commandResult
    });
  } catch (error) {
    logger.error(`Error sending command to IoT device: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while sending command to IoT device'
    });
  }
});

module.exports = router;
