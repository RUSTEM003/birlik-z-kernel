/**
 * App API Block
 * 
 * This module provides functionality for:
 * - Taxi: Ride-hailing and taxi services
 * - Delivery: Food and package delivery services
 * - Payments: In-app payment processing
 * - Ratings: User and service ratings system
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'api-app' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: 'api-app.log' }),
  ],
});

const router = express.Router();

router.post('/taxi/estimate', (req, res) => {
  try {
    const { pickup_location, dropoff_location, service_type, scheduled_time } = req.body;
    
    if (!pickup_location || !dropoff_location) {
      return res.status(400).json({ error: 'Missing required fields: pickup_location and dropoff_location' });
    }
    
    const distance = calculateDistance(
      pickup_location.lat, 
      pickup_location.lng, 
      dropoff_location.lat, 
      dropoff_location.lng
    );
    
    const duration = Math.round(distance * 2 * 60); // Rough estimate: 2 min per km
    
    const baseFare = service_type === 'premium' ? 5.00 : 
                    service_type === 'business' ? 3.50 : 2.00;
    const ratePerKm = service_type === 'premium' ? 2.50 : 
                     service_type === 'business' ? 1.80 : 1.20;
    const ratePerMin = service_type === 'premium' ? 0.50 : 
                      service_type === 'business' ? 0.30 : 0.20;
    
    const fare = baseFare + (distance * ratePerKm) + (duration / 60 * ratePerMin);
    
    const estimate = {
      id: uuidv4(),
      pickup_location,
      dropoff_location,
      service_type: service_type || 'standard',
      scheduled_time: scheduled_time || new Date().toISOString(),
      distance: {
        value: distance,
        unit: 'km',
      },
      duration: {
        value: duration,
        unit: 'seconds',
      },
      fare: {
        currency: 'USD',
        amount: parseFloat(fare.toFixed(2)),
        breakdown: {
          base_fare: baseFare,
          distance_fare: parseFloat((distance * ratePerKm).toFixed(2)),
          time_fare: parseFloat(((duration / 60) * ratePerMin).toFixed(2)),
        },
      },
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 300000).toISOString(), // +5 minutes
    };
    
    logger.info(`Created taxi fare estimate: ${estimate.id}`);
    
    res.status(201).json(estimate);
  } catch (error) {
    logger.error(`Error creating taxi fare estimate: ${error.message}`);
    res.status(500).json({ error: 'Failed to create taxi fare estimate' });
  }
});

router.post('/taxi/request', (req, res) => {
  try {
    const { user_id, pickup_location, dropoff_location, service_type, scheduled_time, payment_method, estimate_id } = req.body;
    
    if (!user_id || !pickup_location || !dropoff_location) {
      return res.status(400).json({ error: 'Missing required fields: user_id, pickup_location, and dropoff_location' });
    }
    
    const rideRequest = {
      id: uuidv4(),
      user_id,
      pickup_location,
      dropoff_location,
      service_type: service_type || 'standard',
      scheduled_time: scheduled_time || new Date().toISOString(),
      payment_method: payment_method || 'wallet',
      estimate_id,
      status: 'searching',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      driver: null,
      vehicle: null,
      eta: null,
    };
    
    logger.info(`Created taxi ride request: ${rideRequest.id}`);
    
    res.status(201).json(rideRequest);
  } catch (error) {
    logger.error(`Error creating taxi ride request: ${error.message}`);
    res.status(500).json({ error: 'Failed to create taxi ride request' });
  }
});

router.get('/taxi/ride/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const ride = {
      id,
      user_id: 'user1',
      pickup_location: {
        lat: 43.2551,
        lng: 76.9457,
        address: '123 Main St, Almaty',
      },
      dropoff_location: {
        lat: 43.2651,
        lng: 76.9557,
        address: '456 Oak St, Almaty',
      },
      service_type: 'standard',
      scheduled_time: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
      payment_method: 'wallet',
      estimate_id: 'est123',
      status: 'in_progress',
      created_at: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
      updated_at: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
      driver: {
        id: 'driver1',
        name: 'John Doe',
        phone: '+1234567890',
        rating: 4.8,
        photo_url: 'https://example.com/drivers/john.jpg',
      },
      vehicle: {
        id: 'vehicle1',
        make: 'Toyota',
        model: 'Camry',
        color: 'Silver',
        license_plate: 'ABC123',
        photo_url: 'https://example.com/vehicles/camry.jpg',
      },
      eta: new Date(Date.now() + 300000).toISOString(), // +5 minutes
      current_location: {
        lat: 43.2601,
        lng: 76.9507,
        updated_at: new Date().toISOString(),
      },
      route: {
        polyline: 'mock_polyline_data',
        distance: {
          value: 3.5,
          unit: 'km',
        },
        duration: {
          value: 420,
          unit: 'seconds',
        },
      },
      fare: {
        currency: 'USD',
        amount: 8.50,
        breakdown: {
          base_fare: 2.00,
          distance_fare: 4.20,
          time_fare: 1.40,
          surge_multiplier: 1.0,
        },
      },
    };
    
    logger.info(`Retrieved taxi ride: ${id}`);
    
    res.json(ride);
  } catch (error) {
    logger.error(`Error retrieving taxi ride: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve taxi ride' });
  }
});

router.post('/taxi/ride/:id/cancel', (req, res) => {
  try {
    const { id } = req.params;
    const { reason, user_id } = req.body;
    
    if (!user_id) {
      return res.status(400).json({ error: 'Missing required field: user_id' });
    }
    
    const cancellation = {
      ride_id: id,
      user_id,
      reason: reason || 'user_requested',
      cancelled_at: new Date().toISOString(),
      cancellation_fee: {
        currency: 'USD',
        amount: 2.00,
      },
      status: 'completed',
    };
    
    logger.info(`Cancelled taxi ride: ${id}`);
    
    res.json(cancellation);
  } catch (error) {
    logger.error(`Error cancelling taxi ride: ${error.message}`);
    res.status(500).json({ error: 'Failed to cancel taxi ride' });
  }
});

router.post('/taxi/ride/:id/rate', (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, rating, comment, tip } = req.body;
    
    if (!user_id || !rating) {
      return res.status(400).json({ error: 'Missing required fields: user_id and rating' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    const rideRating = {
      ride_id: id,
      user_id,
      rating: parseFloat(rating),
      comment: comment || '',
      tip: tip ? {
        currency: 'USD',
        amount: parseFloat(tip),
      } : null,
      created_at: new Date().toISOString(),
    };
    
    logger.info(`Rated taxi ride: ${id}`);
    
    res.status(201).json(rideRating);
  } catch (error) {
    logger.error(`Error rating taxi ride: ${error.message}`);
    res.status(500).json({ error: 'Failed to rate taxi ride' });
  }
});

router.get('/delivery/services', (req, res) => {
  try {
    const services = [
      {
        id: 'service1',
        name: 'Food Delivery',
        description: 'Restaurant food delivery service',
        icon_url: 'https://example.com/icons/food.png',
        delivery_time_range: {
          min: 15,
          max: 45,
          unit: 'minutes',
        },
        base_fee: 2.50,
        currency: 'USD',
        available: true,
      },
      {
        id: 'service2',
        name: 'Grocery Delivery',
        description: 'Grocery store delivery service',
        icon_url: 'https://example.com/icons/grocery.png',
        delivery_time_range: {
          min: 30,
          max: 90,
          unit: 'minutes',
        },
        base_fee: 3.50,
        currency: 'USD',
        available: true,
      },
      {
        id: 'service3',
        name: 'Package Delivery',
        description: 'Package and document delivery service',
        icon_url: 'https://example.com/icons/package.png',
        delivery_time_range: {
          min: 60,
          max: 180,
          unit: 'minutes',
        },
        base_fee: 5.00,
        currency: 'USD',
        available: true,
      },
    ];
    
    logger.info('Retrieved delivery services');
    
    res.json(services);
  } catch (error) {
    logger.error(`Error retrieving delivery services: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve delivery services' });
  }
});

router.post('/delivery/estimate', (req, res) => {
  try {
    const { service_id, pickup_location, dropoff_location, items, scheduled_time } = req.body;
    
    if (!service_id || !pickup_location || !dropoff_location) {
      return res.status(400).json({ error: 'Missing required fields: service_id, pickup_location, and dropoff_location' });
    }
    
    const distance = calculateDistance(
      pickup_location.lat, 
      pickup_location.lng, 
      dropoff_location.lat, 
      dropoff_location.lng
    );
    
    const duration = Math.round(distance * 3 * 60); // Rough estimate: 3 min per km for delivery
    
    let baseFee = 0;
    let ratePerKm = 0;
    
    if (service_id === 'service1') { // Food Delivery
      baseFee = 2.50;
      ratePerKm = 1.00;
    } else if (service_id === 'service2') { // Grocery Delivery
      baseFee = 3.50;
      ratePerKm = 1.20;
    } else if (service_id === 'service3') { // Package Delivery
      baseFee = 5.00;
      ratePerKm = 1.50;
    } else {
      baseFee = 3.00;
      ratePerKm = 1.20;
    }
    
    const fee = baseFee + (distance * ratePerKm);
    
    const estimate = {
      id: uuidv4(),
      service_id,
      pickup_location,
      dropoff_location,
      items: items || [],
      scheduled_time: scheduled_time || new Date().toISOString(),
      distance: {
        value: distance,
        unit: 'km',
      },
      duration: {
        value: duration,
        unit: 'seconds',
      },
      fee: {
        currency: 'USD',
        amount: parseFloat(fee.toFixed(2)),
        breakdown: {
          base_fee: baseFee,
          distance_fee: parseFloat((distance * ratePerKm).toFixed(2)),
        },
      },
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 300000).toISOString(), // +5 minutes
    };
    
    logger.info(`Created delivery fee estimate: ${estimate.id}`);
    
    res.status(201).json(estimate);
  } catch (error) {
    logger.error(`Error creating delivery fee estimate: ${error.message}`);
    res.status(500).json({ error: 'Failed to create delivery fee estimate' });
  }
});

router.post('/delivery/request', (req, res) => {
  try {
    const { user_id, service_id, pickup_location, dropoff_location, items, scheduled_time, payment_method, estimate_id, instructions } = req.body;
    
    if (!user_id || !service_id || !pickup_location || !dropoff_location) {
      return res.status(400).json({ error: 'Missing required fields: user_id, service_id, pickup_location, and dropoff_location' });
    }
    
    const deliveryRequest = {
      id: uuidv4(),
      user_id,
      service_id,
      pickup_location,
      dropoff_location,
      items: items || [],
      scheduled_time: scheduled_time || new Date().toISOString(),
      payment_method: payment_method || 'wallet',
      estimate_id,
      instructions: instructions || '',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      courier: null,
      eta: null,
    };
    
    logger.info(`Created delivery request: ${deliveryRequest.id}`);
    
    res.status(201).json(deliveryRequest);
  } catch (error) {
    logger.error(`Error creating delivery request: ${error.message}`);
    res.status(500).json({ error: 'Failed to create delivery request' });
  }
});

router.get('/delivery/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const delivery = {
      id,
      user_id: 'user1',
      service_id: 'service1',
      pickup_location: {
        lat: 43.2551,
        lng: 76.9457,
        address: '123 Restaurant St, Almaty',
        name: 'Burger Place',
      },
      dropoff_location: {
        lat: 43.2651,
        lng: 76.9557,
        address: '456 Home St, Almaty',
        name: 'Home',
      },
      items: [
        {
          name: 'Burger Combo',
          quantity: 2,
          price: 15.99,
          notes: 'No onions',
        },
        {
          name: 'Fries',
          quantity: 1,
          price: 3.99,
          notes: '',
        },
      ],
      scheduled_time: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
      payment_method: 'wallet',
      estimate_id: 'est456',
      instructions: 'Please leave at the door',
      status: 'in_progress',
      created_at: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
      updated_at: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
      courier: {
        id: 'courier1',
        name: 'Jane Smith',
        phone: '+1234567890',
        rating: 4.9,
        photo_url: 'https://example.com/couriers/jane.jpg',
      },
      eta: new Date(Date.now() + 600000).toISOString(), // +10 minutes
      current_location: {
        lat: 43.2601,
        lng: 76.9507,
        updated_at: new Date().toISOString(),
      },
      route: {
        polyline: 'mock_polyline_data',
        distance: {
          value: 2.5,
          unit: 'km',
        },
        duration: {
          value: 600,
          unit: 'seconds',
        },
      },
      fee: {
        currency: 'USD',
        amount: 5.50,
        breakdown: {
          base_fee: 2.50,
          distance_fee: 3.00,
        },
      },
      timeline: [
        {
          status: 'pending',
          timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
        },
        {
          status: 'confirmed',
          timestamp: new Date(Date.now() - 840000).toISOString(), // 14 minutes ago
        },
        {
          status: 'preparing',
          timestamp: new Date(Date.now() - 780000).toISOString(), // 13 minutes ago
        },
        {
          status: 'ready_for_pickup',
          timestamp: new Date(Date.now() - 660000).toISOString(), // 11 minutes ago
        },
        {
          status: 'picked_up',
          timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
        },
        {
          status: 'in_progress',
          timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
        },
      ],
    };
    
    logger.info(`Retrieved delivery: ${id}`);
    
    res.json(delivery);
  } catch (error) {
    logger.error(`Error retrieving delivery: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve delivery' });
  }
});

router.post('/delivery/:id/cancel', (req, res) => {
  try {
    const { id } = req.params;
    const { reason, user_id } = req.body;
    
    if (!user_id) {
      return res.status(400).json({ error: 'Missing required field: user_id' });
    }
    
    const cancellation = {
      delivery_id: id,
      user_id,
      reason: reason || 'user_requested',
      cancelled_at: new Date().toISOString(),
      cancellation_fee: {
        currency: 'USD',
        amount: 2.50,
      },
      status: 'completed',
    };
    
    logger.info(`Cancelled delivery: ${id}`);
    
    res.json(cancellation);
  } catch (error) {
    logger.error(`Error cancelling delivery: ${error.message}`);
    res.status(500).json({ error: 'Failed to cancel delivery' });
  }
});

router.post('/delivery/:id/rate', (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, rating, comment, tip } = req.body;
    
    if (!user_id || !rating) {
      return res.status(400).json({ error: 'Missing required fields: user_id and rating' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    const deliveryRating = {
      delivery_id: id,
      user_id,
      rating: parseFloat(rating),
      comment: comment || '',
      tip: tip ? {
        currency: 'USD',
        amount: parseFloat(tip),
      } : null,
      created_at: new Date().toISOString(),
    };
    
    logger.info(`Rated delivery: ${id}`);
    
    res.status(201).json(deliveryRating);
  } catch (error) {
    logger.error(`Error rating delivery: ${error.message}`);
    res.status(500).json({ error: 'Failed to rate delivery' });
  }
});

router.post('/payments/process', (req, res) => {
  try {
    const { user_id, amount, currency, payment_method, service_type, reference_id, description } = req.body;
    
    if (!user_id || !amount || !currency || !payment_method || !service_type || !reference_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const payment = {
      id: uuidv4(),
      user_id,
      amount: parseFloat(amount),
      currency,
      payment_method,
      service_type,
      reference_id,
      description: description || '',
      status: 'processing',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      completed_at: null,
      transaction_id: null,
    };
    
    payment.status = 'completed';
    payment.completed_at = new Date().toISOString();
    payment.transaction_id = `tx-${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info(`Processed payment: ${payment.id}`);
    
    res.status(201).json(payment);
  } catch (error) {
    logger.error(`Error processing payment: ${error.message}`);
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

router.get('/payments/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const payment = {
      id,
      user_id: 'user1',
      amount: 25.99,
      currency: 'USD',
      payment_method: 'wallet',
      service_type: 'food_delivery',
      reference_id: 'delivery123',
      description: 'Food delivery payment',
      status: 'completed',
      created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      updated_at: new Date(Date.now() - 3590000).toISOString(), // 59 minutes 50 seconds ago
      completed_at: new Date(Date.now() - 3590000).toISOString(), // 59 minutes 50 seconds ago
      transaction_id: 'tx-abc123xyz',
      receipt_url: 'https://example.com/receipts/tx-abc123xyz',
    };
    
    logger.info(`Retrieved payment: ${id}`);
    
    res.json(payment);
  } catch (error) {
    logger.error(`Error retrieving payment: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve payment' });
  }
});

router.get('/payments/user/:user_id', (req, res) => {
  try {
    const { user_id } = req.params;
    const { service_type, status, page = 1, limit = 10 } = req.query;
    
    const payments = [
      {
        id: 'payment1',
        user_id,
        amount: 25.99,
        currency: 'USD',
        payment_method: 'wallet',
        service_type: 'food_delivery',
        reference_id: 'delivery123',
        description: 'Food delivery payment',
        status: 'completed',
        created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        updated_at: new Date(Date.now() - 3590000).toISOString(), // 59 minutes 50 seconds ago
        completed_at: new Date(Date.now() - 3590000).toISOString(), // 59 minutes 50 seconds ago
        transaction_id: 'tx-abc123xyz',
      },
      {
        id: 'payment2',
        user_id,
        amount: 15.50,
        currency: 'USD',
        payment_method: 'credit_card',
        service_type: 'taxi',
        reference_id: 'ride456',
        description: 'Taxi ride payment',
        status: 'completed',
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updated_at: new Date(Date.now() - 86390000).toISOString(), // 23 hours 59 minutes 50 seconds ago
        completed_at: new Date(Date.now() - 86390000).toISOString(), // 23 hours 59 minutes 50 seconds ago
        transaction_id: 'tx-def456uvw',
      },
    ];
    
    let filteredPayments = payments;
    if (service_type) {
      filteredPayments = filteredPayments.filter(p => p.service_type === service_type);
    }
    
    if (status) {
      filteredPayments = filteredPayments.filter(p => p.status === status);
    }
    
    logger.info(`Retrieved payments for user: ${user_id}`);
    
    res.json({
      data: filteredPayments,
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredPayments.length,
      total_pages: Math.ceil(filteredPayments.length / parseInt(limit)),
    });
  } catch (error) {
    logger.error(`Error retrieving user payments: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve user payments' });
  }
});

router.get('/ratings/user/:user_id', (req, res) => {
  try {
    const { user_id } = req.params;
    const { service_type, page = 1, limit = 10 } = req.query;
    
    const ratings = [
      {
        id: 'rating1',
        user_id,
        service_type: 'taxi',
        reference_id: 'ride123',
        rating: 4.5,
        comment: 'Great driver, very professional',
        created_at: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
      },
      {
        id: 'rating2',
        user_id,
        service_type: 'food_delivery',
        reference_id: 'delivery456',
        rating: 5.0,
        comment: 'Fast delivery, food was still hot',
        created_at: new Date(Date.now() - 1209600000).toISOString(), // 2 weeks ago
      },
    ];
    
    let filteredRatings = ratings;
    if (service_type) {
      filteredRatings = filteredRatings.filter(r => r.service_type === service_type);
    }
    
    logger.info(`Retrieved ratings for user: ${user_id}`);
    
    res.json({
      data: filteredRatings,
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredRatings.length,
      total_pages: Math.ceil(filteredRatings.length / parseInt(limit)),
    });
  } catch (error) {
    logger.error(`Error retrieving user ratings: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve user ratings' });
  }
});

router.get('/ratings/provider/:provider_id', (req, res) => {
  try {
    const { provider_id } = req.params;
    const { service_type, page = 1, limit = 10 } = req.query;
    
    const ratings = [
      {
        id: 'rating1',
        provider_id,
        provider_type: 'driver',
        service_type: 'taxi',
        reference_id: 'ride123',
        user_id: 'user1',
        rating: 4.5,
        comment: 'Great driver, very professional',
        created_at: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
      },
      {
        id: 'rating2',
        provider_id,
        provider_type: 'driver',
        service_type: 'taxi',
        reference_id: 'ride456',
        user_id: 'user2',
        rating: 5.0,
        comment: 'Excellent service, very friendly',
        created_at: new Date(Date.now() - 1209600000).toISOString(), // 2 weeks ago
      },
      {
        id: 'rating3',
        provider_id,
        provider_type: 'driver',
        service_type: 'taxi',
        reference_id: 'ride789',
        user_id: 'user3',
        rating: 4.0,
        comment: 'Good service',
        created_at: new Date(Date.now() - 1814400000).toISOString(), // 3 weeks ago
      },
    ];
    
    let filteredRatings = ratings;
    if (service_type) {
      filteredRatings = filteredRatings.filter(r => r.service_type === service_type);
    }
    
    const totalRating = filteredRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = filteredRatings.length > 0 ? totalRating / filteredRatings.length : 0;
    
    logger.info(`Retrieved ratings for provider: ${provider_id}`);
    
    res.json({
      provider_id,
      average_rating: parseFloat(averageRating.toFixed(1)),
      total_ratings: filteredRatings.length,
      data: filteredRatings,
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredRatings.length,
      total_pages: Math.ceil(filteredRatings.length / parseInt(limit)),
    });
  } catch (error) {
    logger.error(`Error retrieving provider ratings: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve provider ratings' });
  }
});

router.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  
  return parseFloat(distance.toFixed(1));
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

module.exports = router;
