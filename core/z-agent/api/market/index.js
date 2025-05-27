/**
 * Market API Block
 * 
 * This module provides functionality for:
 * - Marketplace: General marketplace for goods and services
 * - Import: Integration with Temu/Alibaba for product import
 * - P2P Trading: Peer-to-peer trading platform
 * - Auctions: Online auction system
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'api-market' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: 'api-market.log' }),
  ],
});

const router = express.Router();

router.get('/products', (req, res) => {
  try {
    const { category, subcategory, price_min, price_max, condition, seller_type, search, page = 1, limit = 20 } = req.query;
    
    const products = [
      {
        id: 'prod1',
        title: 'Smartphone XYZ Pro',
        description: 'Latest model with advanced features',
        category: 'electronics',
        subcategory: 'smartphones',
        price: 799.99,
        currency: 'USD',
        condition: 'new',
        seller: {
          id: 'seller1',
          name: 'TechStore',
          type: 'business',
          rating: 4.8,
          verified: true,
        },
        location: {
          country: 'Kazakhstan',
          city: 'Almaty',
        },
        images: [
          'https://example.com/products/smartphone1.jpg',
          'https://example.com/products/smartphone2.jpg',
        ],
        stock: 15,
        created_at: '2023-03-01T00:00:00Z',
        updated_at: '2023-04-15T00:00:00Z',
        shipping_options: [
          {
            method: 'standard',
            price: 5.99,
            estimated_days: '3-5',
          },
          {
            method: 'express',
            price: 15.99,
            estimated_days: '1-2',
          },
        ],
      },
      {
        id: 'prod2',
        title: 'Laptop ABC Ultra',
        description: 'Powerful laptop for professionals',
        category: 'electronics',
        subcategory: 'laptops',
        price: 1299.99,
        currency: 'USD',
        condition: 'new',
        seller: {
          id: 'seller1',
          name: 'TechStore',
          type: 'business',
          rating: 4.8,
          verified: true,
        },
        location: {
          country: 'Kazakhstan',
          city: 'Almaty',
        },
        images: [
          'https://example.com/products/laptop1.jpg',
          'https://example.com/products/laptop2.jpg',
        ],
        stock: 8,
        created_at: '2023-03-05T00:00:00Z',
        updated_at: '2023-04-10T00:00:00Z',
        shipping_options: [
          {
            method: 'standard',
            price: 9.99,
            estimated_days: '3-5',
          },
          {
            method: 'express',
            price: 19.99,
            estimated_days: '1-2',
          },
        ],
      },
      {
        id: 'prod3',
        title: 'Vintage Watch',
        description: 'Elegant vintage watch in excellent condition',
        category: 'fashion',
        subcategory: 'watches',
        price: 299.99,
        currency: 'USD',
        condition: 'used',
        seller: {
          id: 'seller2',
          name: 'VintageCollector',
          type: 'individual',
          rating: 4.6,
          verified: true,
        },
        location: {
          country: 'Kazakhstan',
          city: 'Nur-Sultan',
        },
        images: [
          'https://example.com/products/watch1.jpg',
          'https://example.com/products/watch2.jpg',
        ],
        stock: 1,
        created_at: '2023-04-01T00:00:00Z',
        updated_at: '2023-04-01T00:00:00Z',
        shipping_options: [
          {
            method: 'standard',
            price: 4.99,
            estimated_days: '3-5',
          },
          {
            method: 'express',
            price: 12.99,
            estimated_days: '1-2',
          },
        ],
      },
    ];
    
    let filteredProducts = products;
    
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    if (subcategory) {
      filteredProducts = filteredProducts.filter(p => p.subcategory === subcategory);
    }
    
    if (price_min) {
      filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(price_min));
    }
    
    if (price_max) {
      filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(price_max));
    }
    
    if (condition) {
      filteredProducts = filteredProducts.filter(p => p.condition === condition);
    }
    
    if (seller_type) {
      filteredProducts = filteredProducts.filter(p => p.seller.type === seller_type);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.title.toLowerCase().includes(searchLower) || 
        p.description.toLowerCase().includes(searchLower)
      );
    }
    
    logger.info('Retrieved marketplace products');
    
    res.json({
      data: filteredProducts,
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredProducts.length,
      total_pages: Math.ceil(filteredProducts.length / parseInt(limit)),
    });
  } catch (error) {
    logger.error(`Error retrieving marketplace products: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve marketplace products' });
  }
});

router.get('/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const product = {
      id,
      title: 'Smartphone XYZ Pro',
      description: 'Latest model with advanced features',
      category: 'electronics',
      subcategory: 'smartphones',
      price: 799.99,
      currency: 'USD',
      condition: 'new',
      seller: {
        id: 'seller1',
        name: 'TechStore',
        type: 'business',
        rating: 4.8,
        verified: true,
        joined_at: '2022-01-01T00:00:00Z',
        total_sales: 1250,
      },
      location: {
        country: 'Kazakhstan',
        city: 'Almaty',
      },
      images: [
        'https://example.com/products/smartphone1.jpg',
        'https://example.com/products/smartphone2.jpg',
        'https://example.com/products/smartphone3.jpg',
        'https://example.com/products/smartphone4.jpg',
      ],
      stock: 15,
      created_at: '2023-03-01T00:00:00Z',
      updated_at: '2023-04-15T00:00:00Z',
      shipping_options: [
        {
          method: 'standard',
          price: 5.99,
          estimated_days: '3-5',
        },
        {
          method: 'express',
          price: 15.99,
          estimated_days: '1-2',
        },
      ],
      specifications: {
        brand: 'XYZ',
        model: 'Pro',
        dimensions: '150 x 75 x 8 mm',
        weight: '180g',
        display: '6.5 inch AMOLED',
        processor: 'Octa-core 2.8 GHz',
        ram: '8 GB',
        storage: '256 GB',
        camera: '48 MP + 12 MP + 8 MP',
        battery: '4500 mAh',
        os: 'Android 12',
      },
      warranty: '1 year manufacturer warranty',
      return_policy: '30 days return policy',
      ratings: {
        average: 4.7,
        count: 120,
        distribution: {
          '5': 90,
          '4': 20,
          '3': 5,
          '2': 3,
          '1': 2,
        },
      },
      reviews: [
        {
          id: 'review1',
          user_id: 'user1',
          username: 'John D.',
          rating: 5,
          title: 'Excellent smartphone',
          comment: 'This is the best smartphone I have ever used. Great camera and battery life.',
          created_at: '2023-03-15T00:00:00Z',
          helpful_votes: 25,
        },
        {
          id: 'review2',
          user_id: 'user2',
          username: 'Sarah M.',
          rating: 4,
          title: 'Very good but expensive',
          comment: 'Great phone overall but a bit on the expensive side.',
          created_at: '2023-03-20T00:00:00Z',
          helpful_votes: 15,
        },
      ],
      similar_products: [
        {
          id: 'prod4',
          title: 'Smartphone XYZ Standard',
          price: 599.99,
          currency: 'USD',
          image: 'https://example.com/products/smartphone_standard.jpg',
        },
        {
          id: 'prod5',
          title: 'Smartphone ABC Premium',
          price: 849.99,
          currency: 'USD',
          image: 'https://example.com/products/smartphone_abc.jpg',
        },
      ],
    };
    
    logger.info(`Retrieved product: ${id}`);
    
    res.json(product);
  } catch (error) {
    logger.error(`Error retrieving product: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve product' });
  }
});

router.post('/products', (req, res) => {
  try {
    const { title, description, category, subcategory, price, currency, condition, seller_id, location, images, stock, specifications, shipping_options } = req.body;
    
    if (!title || !description || !category || !price || !seller_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const product = {
      id: uuidv4(),
      title,
      description,
      category,
      subcategory: subcategory || '',
      price: parseFloat(price),
      currency: currency || 'USD',
      condition: condition || 'new',
      seller_id,
      seller: null, // Would be populated from database in a real implementation
      location: location || {},
      images: images || [],
      stock: parseInt(stock) || 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      specifications: specifications || {},
      shipping_options: shipping_options || [],
    };
    
    logger.info(`Created product: ${product.id}`);
    
    res.status(201).json(product);
  } catch (error) {
    logger.error(`Error creating product: ${error.message}`);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.post('/orders', (req, res) => {
  try {
    const { user_id, products, shipping_address, billing_address, shipping_method, payment_method } = req.body;
    
    if (!user_id || !products || !products.length || !shipping_address || !payment_method) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    let subtotal = 0;
    let shipping = 0;
    
    products.forEach(product => {
      subtotal += product.price * product.quantity;
      
      if (product.shipping_method === 'express') {
        shipping += 15.99;
      } else {
        shipping += 5.99;
      }
    });
    
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;
    
    const order = {
      id: uuidv4(),
      user_id,
      products,
      shipping_address,
      billing_address: billing_address || shipping_address,
      shipping_method: shipping_method || 'standard',
      payment_method,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      totals: {
        subtotal,
        shipping,
        tax,
        total,
      },
      estimated_delivery: new Date(Date.now() + 432000000).toISOString(), // +5 days
    };
    
    logger.info(`Created order: ${order.id}`);
    
    res.status(201).json(order);
  } catch (error) {
    logger.error(`Error creating order: ${error.message}`);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.get('/import/sources', (req, res) => {
  try {
    const sources = [
      {
        id: 'source1',
        name: 'Temu',
        description: 'Import products from Temu marketplace',
        logo_url: 'https://example.com/logos/temu.png',
        categories: [
          'electronics',
          'fashion',
          'home',
          'beauty',
          'toys',
        ],
        status: 'active',
        integration_type: 'api',
      },
      {
        id: 'source2',
        name: 'Alibaba',
        description: 'Import products from Alibaba marketplace',
        logo_url: 'https://example.com/logos/alibaba.png',
        categories: [
          'electronics',
          'fashion',
          'home',
          'beauty',
          'industrial',
        ],
        status: 'active',
        integration_type: 'api',
      },
      {
        id: 'source3',
        name: 'AliExpress',
        description: 'Import products from AliExpress marketplace',
        logo_url: 'https://example.com/logos/aliexpress.png',
        categories: [
          'electronics',
          'fashion',
          'home',
          'beauty',
          'automotive',
        ],
        status: 'active',
        integration_type: 'api',
      },
    ];
    
    logger.info('Retrieved import sources');
    
    res.json(sources);
  } catch (error) {
    logger.error(`Error retrieving import sources: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve import sources' });
  }
});

router.post('/import/search', (req, res) => {
  try {
    const { source_id, query, category, price_min, price_max, page = 1, limit = 20 } = req.body;
    
    if (!source_id || !query) {
      return res.status(400).json({ error: 'Missing required fields: source_id and query' });
    }
    
    const results = [
      {
        id: 'ext1',
        source_id,
        external_id: 'temu12345',
        title: 'Wireless Earbuds',
        description: 'Bluetooth 5.0 Wireless Earbuds with Charging Case',
        category: 'electronics',
        subcategory: 'audio',
        price: 25.99,
        currency: 'USD',
        original_price: 39.99,
        discount_percentage: 35,
        rating: 4.3,
        reviews_count: 1250,
        image_url: 'https://example.com/products/earbuds.jpg',
        shipping: {
          price: 2.99,
          estimated_days: '10-15',
        },
        seller: {
          name: 'AudioTech Store',
          rating: 4.7,
        },
      },
      {
        id: 'ext2',
        source_id,
        external_id: 'temu67890',
        title: 'Portable Bluetooth Speaker',
        description: 'Waterproof Portable Bluetooth Speaker with 20H Playtime',
        category: 'electronics',
        subcategory: 'audio',
        price: 35.99,
        currency: 'USD',
        original_price: 49.99,
        discount_percentage: 28,
        rating: 4.5,
        reviews_count: 850,
        image_url: 'https://example.com/products/speaker.jpg',
        shipping: {
          price: 3.99,
          estimated_days: '10-15',
        },
        seller: {
          name: 'SoundGear Official',
          rating: 4.8,
        },
      },
    ];
    
    logger.info(`Performed import search on source: ${source_id}`);
    
    res.json({
      source_id,
      query,
      results,
      page: parseInt(page),
      limit: parseInt(limit),
      total: results.length,
      total_pages: Math.ceil(results.length / parseInt(limit)),
    });
  } catch (error) {
    logger.error(`Error performing import search: ${error.message}`);
    res.status(500).json({ error: 'Failed to perform import search' });
  }
});

router.post('/import/product', (req, res) => {
  try {
    const { source_id, external_id, seller_id, markup_percentage, custom_title, custom_description } = req.body;
    
    if (!source_id || !external_id || !seller_id) {
      return res.status(400).json({ error: 'Missing required fields: source_id, external_id, and seller_id' });
    }
    
    const importedProduct = {
      id: uuidv4(),
      source_id,
      external_id,
      seller_id,
      original_data: {
        title: 'Wireless Earbuds',
        description: 'Bluetooth 5.0 Wireless Earbuds with Charging Case',
        category: 'electronics',
        subcategory: 'audio',
        price: 25.99,
        currency: 'USD',
        original_price: 39.99,
        discount_percentage: 35,
        rating: 4.3,
        reviews_count: 1250,
        image_url: 'https://example.com/products/earbuds.jpg',
        shipping: {
          price: 2.99,
          estimated_days: '10-15',
        },
        seller: {
          name: 'AudioTech Store',
          rating: 4.7,
        },
      },
      marketplace_data: {
        title: custom_title || 'Wireless Earbuds',
        description: custom_description || 'Bluetooth 5.0 Wireless Earbuds with Charging Case',
        category: 'electronics',
        subcategory: 'audio',
        price: 25.99 * (1 + (markup_percentage || 20) / 100), // Apply markup
        currency: 'USD',
        condition: 'new',
        images: ['https://example.com/products/earbuds.jpg'],
        shipping_options: [
          {
            method: 'standard',
            price: 5.99,
            estimated_days: '15-20',
          },
        ],
      },
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    logger.info(`Imported product: ${importedProduct.id}`);
    
    res.status(201).json(importedProduct);
  } catch (error) {
    logger.error(`Error importing product: ${error.message}`);
    res.status(500).json({ error: 'Failed to import product' });
  }
});

router.get('/p2p/listings', (req, res) => {
  try {
    const { category, subcategory, price_min, price_max, condition, location, page = 1, limit = 20 } = req.query;
    
    const listings = [
      {
        id: 'p2p1',
        title: 'Gaming Laptop',
        description: 'High-performance gaming laptop, barely used',
        category: 'electronics',
        subcategory: 'laptops',
        price: 800,
        currency: 'USD',
        condition: 'used',
        seller: {
          id: 'user1',
          username: 'john_doe',
          rating: 4.8,
          verified: true,
          joined_at: '2022-01-15T00:00:00Z',
        },
        location: {
          country: 'Kazakhstan',
          city: 'Almaty',
        },
        images: [
          'https://example.com/p2p/laptop1.jpg',
          'https://example.com/p2p/laptop2.jpg',
        ],
        created_at: '2023-04-01T00:00:00Z',
        updated_at: '2023-04-01T00:00:00Z',
        status: 'active',
        exchange_options: {
          cash: true,
          trade: true,
          trade_preferences: ['electronics', 'photography'],
        },
        meetup_preferences: ['in_person', 'shipping'],
      },
      {
        id: 'p2p2',
        title: 'Mountain Bike',
        description: 'Professional mountain bike in excellent condition',
        category: 'sports',
        subcategory: 'cycling',
        price: 500,
        currency: 'USD',
        condition: 'used',
        seller: {
          id: 'user2',
          username: 'bike_enthusiast',
          rating: 4.9,
          verified: true,
          joined_at: '2022-02-10T00:00:00Z',
        },
        location: {
          country: 'Kazakhstan',
          city: 'Nur-Sultan',
        },
        images: [
          'https://example.com/p2p/bike1.jpg',
          'https://example.com/p2p/bike2.jpg',
        ],
        created_at: '2023-04-05T00:00:00Z',
        updated_at: '2023-04-05T00:00:00Z',
        status: 'active',
        exchange_options: {
          cash: true,
          trade: false,
          trade_preferences: [],
        },
        meetup_preferences: ['in_person'],
      },
    ];
    
    let filteredListings = listings;
    
    if (category) {
      filteredListings = filteredListings.filter(l => l.category === category);
    }
    
    if (subcategory) {
      filteredListings = filteredListings.filter(l => l.subcategory === subcategory);
    }
    
    if (price_min) {
      filteredListings = filteredListings.filter(l => l.price >= parseFloat(price_min));
    }
    
    if (price_max) {
      filteredListings = filteredListings.filter(l => l.price <= parseFloat(price_max));
    }
    
    if (condition) {
      filteredListings = filteredListings.filter(l => l.condition === condition);
    }
    
    if (location) {
      filteredListings = filteredListings.filter(l => 
        l.location.city.toLowerCase() === location.toLowerCase() || 
        l.location.country.toLowerCase() === location.toLowerCase()
      );
    }
    
    logger.info('Retrieved P2P listings');
    
    res.json({
      data: filteredListings,
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredListings.length,
      total_pages: Math.ceil(filteredListings.length / parseInt(limit)),
    });
  } catch (error) {
    logger.error(`Error retrieving P2P listings: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve P2P listings' });
  }
});

router.post('/p2p/listings', (req, res) => {
  try {
    const { title, description, category, subcategory, price, currency, condition, seller_id, location, images, exchange_options, meetup_preferences } = req.body;
    
    if (!title || !description || !category || !price || !seller_id || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const listing = {
      id: uuidv4(),
      title,
      description,
      category,
      subcategory: subcategory || '',
      price: parseFloat(price),
      currency: currency || 'USD',
      condition: condition || 'used',
      seller_id,
      seller: null, // Would be populated from database in a real implementation
      location,
      images: images || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      exchange_options: exchange_options || {
        cash: true,
        trade: false,
        trade_preferences: [],
      },
      meetup_preferences: meetup_preferences || ['in_person'],
    };
    
    logger.info(`Created P2P listing: ${listing.id}`);
    
    res.status(201).json(listing);
  } catch (error) {
    logger.error(`Error creating P2P listing: ${error.message}`);
    res.status(500).json({ error: 'Failed to create P2P listing' });
  }
});

router.post('/p2p/offers', (req, res) => {
  try {
    const { listing_id, buyer_id, offer_type, offer_amount, trade_items, message } = req.body;
    
    if (!listing_id || !buyer_id || !offer_type) {
      return res.status(400).json({ error: 'Missing required fields: listing_id, buyer_id, and offer_type' });
    }
    
    if (!['cash', 'trade', 'cash_and_trade'].includes(offer_type)) {
      return res.status(400).json({ error: 'Invalid offer type' });
    }
    
    if ((offer_type === 'cash' || offer_type === 'cash_and_trade') && !offer_amount) {
      return res.status(400).json({ error: 'Missing offer amount for cash offer' });
    }
    
    if ((offer_type === 'trade' || offer_type === 'cash_and_trade') && (!trade_items || !trade_items.length)) {
      return res.status(400).json({ error: 'Missing trade items for trade offer' });
    }
    
    const offer = {
      id: uuidv4(),
      listing_id,
      buyer_id,
      offer_type,
      offer_amount: offer_type === 'trade' ? null : parseFloat(offer_amount),
      trade_items: (offer_type === 'trade' || offer_type === 'cash_and_trade') ? trade_items : [],
      message: message || '',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    logger.info(`Created P2P offer: ${offer.id}`);
    
    res.status(201).json(offer);
  } catch (error) {
    logger.error(`Error creating P2P offer: ${error.message}`);
    res.status(500).json({ error: 'Failed to create P2P offer' });
  }
});

router.get('/auctions', (req, res) => {
  try {
    const { category, price_min, price_max, status, page = 1, limit = 20 } = req.query;
    
    const auctions = [
      {
        id: 'auction1',
        title: 'Vintage Camera Collection',
        description: 'Collection of rare vintage cameras from the 1950s',
        category: 'collectibles',
        subcategory: 'cameras',
        starting_price: 500,
        current_price: 750,
        currency: 'USD',
        seller: {
          id: 'user3',
          username: 'vintage_collector',
          rating: 4.9,
          verified: true,
        },
        images: [
          'https://example.com/auctions/cameras1.jpg',
          'https://example.com/auctions/cameras2.jpg',
        ],
        start_time: '2023-04-01T00:00:00Z',
        end_time: '2023-04-15T00:00:00Z',
        status: 'active',
        bids_count: 5,
        watchers_count: 25,
        highest_bidder: {
          id: 'user4',
          username: 'camera_enthusiast',
        },
        bid_increment: 50,
        reserve_price: 1000,
        reserve_met: false,
      },
      {
        id: 'auction2',
        title: 'Signed Sports Memorabilia',
        description: 'Signed jersey from championship team',
        category: 'sports',
        subcategory: 'memorabilia',
        starting_price: 200,
        current_price: 450,
        currency: 'USD',
        seller: {
          id: 'user5',
          username: 'sports_fan',
          rating: 4.7,
          verified: true,
        },
        images: [
          'https://example.com/auctions/jersey1.jpg',
          'https://example.com/auctions/jersey2.jpg',
        ],
        start_time: '2023-04-05T00:00:00Z',
        end_time: '2023-04-20T00:00:00Z',
        status: 'active',
        bids_count: 8,
        watchers_count: 42,
        highest_bidder: {
          id: 'user6',
          username: 'memorabilia_collector',
        },
        bid_increment: 25,
        reserve_price: 400,
        reserve_met: true,
      },
    ];
    
    let filteredAuctions = auctions;
    
    if (category) {
      filteredAuctions = filteredAuctions.filter(a => a.category === category);
    }
    
    if (price_min) {
      filteredAuctions = filteredAuctions.filter(a => a.current_price >= parseFloat(price_min));
    }
    
    if (price_max) {
      filteredAuctions = filteredAuctions.filter(a => a.current_price <= parseFloat(price_max));
    }
    
    if (status) {
      filteredAuctions = filteredAuctions.filter(a => a.status === status);
    }
    
    logger.info('Retrieved auctions');
    
    res.json({
      data: filteredAuctions,
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredAuctions.length,
      total_pages: Math.ceil(filteredAuctions.length / parseInt(limit)),
    });
  } catch (error) {
    logger.error(`Error retrieving auctions: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve auctions' });
  }
});

router.post('/auctions', (req, res) => {
  try {
    const { title, description, category, subcategory, starting_price, currency, seller_id, images, start_time, end_time, bid_increment, reserve_price } = req.body;
    
    if (!title || !description || !category || !starting_price || !seller_id || !end_time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const auction = {
      id: uuidv4(),
      title,
      description,
      category,
      subcategory: subcategory || '',
      starting_price: parseFloat(starting_price),
      current_price: parseFloat(starting_price),
      currency: currency || 'USD',
      seller_id,
      seller: null, // Would be populated from database in a real implementation
      images: images || [],
      start_time: start_time || new Date().toISOString(),
      end_time,
      status: 'scheduled',
      bids_count: 0,
      watchers_count: 0,
      highest_bidder: null,
      bid_increment: parseFloat(bid_increment) || 10,
      reserve_price: reserve_price ? parseFloat(reserve_price) : null,
      reserve_met: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    logger.info(`Created auction: ${auction.id}`);
    
    res.status(201).json(auction);
  } catch (error) {
    logger.error(`Error creating auction: ${error.message}`);
    res.status(500).json({ error: 'Failed to create auction' });
  }
});

router.post('/auctions/:id/bid', (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, bid_amount, auto_bid_limit } = req.body;
    
    if (!user_id || !bid_amount) {
      return res.status(400).json({ error: 'Missing required fields: user_id and bid_amount' });
    }
    
    const auction = {
      id,
      current_price: 750,
      bid_increment: 50,
      highest_bidder: {
        id: 'user4',
        username: 'camera_enthusiast',
      },
      status: 'active',
    };
    
    if (parseFloat(bid_amount) < auction.current_price + auction.bid_increment) {
      return res.status(400).json({ 
        error: 'Bid amount too low', 
        minimum_bid: auction.current_price + auction.bid_increment 
      });
    }
    
    if (auction.status !== 'active') {
      return res.status(400).json({ error: 'Auction is not active' });
    }
    
    const bid = {
      id: uuidv4(),
      auction_id: id,
      user_id,
      amount: parseFloat(bid_amount),
      auto_bid_limit: auto_bid_limit ? parseFloat(auto_bid_limit) : null,
      status: 'accepted',
      created_at: new Date().toISOString(),
    };
    
    const updatedAuction = {
      ...auction,
      current_price: parseFloat(bid_amount),
      highest_bidder: {
        id: user_id,
        username: 'new_bidder', // Would be fetched from database in a real implementation
      },
      bids_count: 6, // Incremented
      updated_at: new Date().toISOString(),
    };
    
    logger.info(`Placed bid on auction: ${id}`);
    
    res.status(201).json({
      bid,
      auction: updatedAuction,
    });
  } catch (error) {
    logger.error(`Error placing bid: ${error.message}`);
    res.status(500).json({ error: 'Failed to place bid' });
  }
});

router.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

module.exports = router;
