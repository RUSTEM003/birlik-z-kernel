/**
 * Islam API Block
 * 
 * This module provides functionality for:
 * - Halal compliance: Verification of halal compliance for products and services
 * - Zakat calculator: Calculation of zakat obligations
 * - Sharia audit: Audit of financial transactions for Sharia compliance
 * - Islamic finance: Islamic financial products and services
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'api-islam' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: 'api-islam.log' }),
  ],
});

const router = express.Router();

router.post('/compliance/verify', (req, res) => {
  try {
    const { product_id, product_type, ingredients, manufacturing_process, certifications } = req.body;
    
    if (!product_id || !product_type) {
      return res.status(400).json({ error: 'Missing required fields: product_id and product_type' });
    }
    
    let complianceScore = 0;
    let status = 'pending';
    let issues = [];
    
    if (ingredients && ingredients.length > 0) {
      const prohibitedIngredients = ['alcohol', 'pork', 'blood', 'carrion'];
      const foundProhibited = ingredients.filter(ing => 
        prohibitedIngredients.some(prohibited => 
          ing.name.toLowerCase().includes(prohibited.toLowerCase())
        )
      );
      
      if (foundProhibited.length > 0) {
        issues.push({
          type: 'prohibited_ingredients',
          description: 'Product contains prohibited ingredients',
          items: foundProhibited.map(ing => ing.name),
        });
      } else {
        complianceScore += 40;
      }
    } else {
      issues.push({
        type: 'missing_ingredients',
        description: 'Ingredient information not provided',
      });
    }
    
    if (manufacturing_process) {
      if (manufacturing_process.cross_contamination_prevention) {
        complianceScore += 20;
      } else {
        issues.push({
          type: 'cross_contamination',
          description: 'No measures to prevent cross-contamination with non-halal products',
        });
      }
      
      if (manufacturing_process.halal_standards_compliance) {
        complianceScore += 20;
      } else {
        issues.push({
          type: 'standards_compliance',
          description: 'Manufacturing process does not comply with halal standards',
        });
      }
    } else {
      issues.push({
        type: 'missing_manufacturing_info',
        description: 'Manufacturing process information not provided',
      });
    }
    
    if (certifications && certifications.length > 0) {
      const validCertifications = certifications.filter(cert => 
        cert.issuer && cert.expiry_date && new Date(cert.expiry_date) > new Date()
      );
      
      if (validCertifications.length > 0) {
        complianceScore += 20;
      } else {
        issues.push({
          type: 'invalid_certifications',
          description: 'No valid halal certifications provided',
        });
      }
    } else {
      issues.push({
        type: 'missing_certifications',
        description: 'Certification information not provided',
      });
    }
    
    if (complianceScore >= 80) {
      status = 'compliant';
    } else if (complianceScore >= 50) {
      status = 'partially_compliant';
    } else {
      status = 'non_compliant';
    }
    
    const verificationResult = {
      id: uuidv4(),
      product_id,
      product_type,
      compliance_score: complianceScore,
      status,
      issues,
      verified_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 31536000000).toISOString(), // +1 year
    };
    
    logger.info(`Verified halal compliance for product: ${product_id}`);
    
    res.status(201).json(verificationResult);
  } catch (error) {
    logger.error(`Error verifying halal compliance: ${error.message}`);
    res.status(500).json({ error: 'Failed to verify halal compliance' });
  }
});

router.get('/compliance/product/:product_id', (req, res) => {
  try {
    const { product_id } = req.params;
    
    const complianceInfo = {
      product_id,
      product_name: 'Organic Chicken',
      product_type: 'food',
      manufacturer: 'Halal Farms Inc.',
      compliance_status: 'compliant',
      compliance_score: 95,
      certification: {
        id: 'cert123',
        issuer: 'International Halal Authority',
        issue_date: '2023-01-01T00:00:00Z',
        expiry_date: '2024-01-01T00:00:00Z',
        certificate_url: 'https://example.com/certificates/cert123.pdf',
      },
      ingredients: [
        {
          name: 'Organic Chicken',
          source: 'Halal Farms Inc.',
          halal_status: 'compliant',
        },
        {
          name: 'Sea Salt',
          source: 'Natural Minerals Ltd.',
          halal_status: 'compliant',
        },
        {
          name: 'Organic Spices',
          source: 'Spice World Co.',
          halal_status: 'compliant',
        },
      ],
      manufacturing_process: {
        facility_certification: 'Halal Certified',
        cross_contamination_prevention: true,
        halal_standards_compliance: true,
      },
      last_verified: '2023-04-01T00:00:00Z',
      verification_expires: '2024-04-01T00:00:00Z',
    };
    
    logger.info(`Retrieved halal compliance info for product: ${product_id}`);
    
    res.json(complianceInfo);
  } catch (error) {
    logger.error(`Error retrieving halal compliance info: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve halal compliance info' });
  }
});

router.get('/compliance/standards', (req, res) => {
  try {
    const standards = [
      {
        id: 'std1',
        name: 'International Halal Standard',
        organization: 'International Halal Authority',
        version: '2.1',
        published_date: '2022-01-01T00:00:00Z',
        categories: ['food', 'cosmetics', 'pharmaceuticals'],
        description: 'Comprehensive standard for halal certification across multiple product categories',
        requirements_url: 'https://example.com/standards/iha_2.1.pdf',
      },
      {
        id: 'std2',
        name: 'Global Halal Food Standard',
        organization: 'Global Halal Certification Body',
        version: '3.0',
        published_date: '2022-03-15T00:00:00Z',
        categories: ['food'],
        description: 'Specialized standard for halal food products and ingredients',
        requirements_url: 'https://example.com/standards/ghfb_3.0.pdf',
      },
      {
        id: 'std3',
        name: 'Islamic Finance Compliance Standard',
        organization: 'Islamic Financial Services Board',
        version: '1.5',
        published_date: '2022-06-10T00:00:00Z',
        categories: ['finance'],
        description: 'Standard for Sharia compliance in financial products and services',
        requirements_url: 'https://example.com/standards/ifsb_1.5.pdf',
      },
    ];
    
    logger.info('Retrieved halal compliance standards');
    
    res.json(standards);
  } catch (error) {
    logger.error(`Error retrieving halal compliance standards: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve halal compliance standards' });
  }
});

router.post('/zakat/calculate', (req, res) => {
  try {
    const { assets, liabilities, zakat_method, currency } = req.body;
    
    if (!assets) {
      return res.status(400).json({ error: 'Missing required field: assets' });
    }
    
    let totalAssets = 0;
    if (assets.cash) totalAssets += parseFloat(assets.cash);
    if (assets.gold) totalAssets += parseFloat(assets.gold);
    if (assets.silver) totalAssets += parseFloat(assets.silver);
    if (assets.stocks) totalAssets += parseFloat(assets.stocks);
    if (assets.business_assets) totalAssets += parseFloat(assets.business_assets);
    if (assets.property_for_sale) totalAssets += parseFloat(assets.property_for_sale);
    if (assets.other_investments) totalAssets += parseFloat(assets.other_investments);
    
    let totalLiabilities = 0;
    if (liabilities) {
      if (liabilities.debts) totalLiabilities += parseFloat(liabilities.debts);
      if (liabilities.loans) totalLiabilities += parseFloat(liabilities.loans);
      if (liabilities.taxes) totalLiabilities += parseFloat(liabilities.taxes);
      if (liabilities.other_liabilities) totalLiabilities += parseFloat(liabilities.other_liabilities);
    }
    
    const zakatableAmount = totalAssets - totalLiabilities;
    
    const goldPricePerGram = 60; // Mock gold price in USD
    const nisabThreshold = 85 * goldPricePerGram;
    
    if (zakatableAmount < nisabThreshold) {
      return res.json({
        zakatable_amount: zakatableAmount,
        nisab_threshold: nisabThreshold,
        zakat_payable: 0,
        meets_nisab: false,
        currency: currency || 'USD',
        calculation_date: new Date().toISOString(),
      });
    }
    
    const zakatPayable = zakatableAmount * 0.025;
    
    const calculationResult = {
      id: uuidv4(),
      total_assets: totalAssets,
      total_liabilities: totalLiabilities,
      zakatable_amount: zakatableAmount,
      nisab_threshold: nisabThreshold,
      meets_nisab: true,
      zakat_payable: zakatPayable,
      zakat_method: zakat_method || 'standard',
      currency: currency || 'USD',
      calculation_date: new Date().toISOString(),
      breakdown: {
        assets: assets,
        liabilities: liabilities || {},
      },
    };
    
    logger.info('Calculated zakat');
    
    res.status(201).json(calculationResult);
  } catch (error) {
    logger.error(`Error calculating zakat: ${error.message}`);
    res.status(500).json({ error: 'Failed to calculate zakat' });
  }
});

router.get('/zakat/history/:user_id', (req, res) => {
  try {
    const { user_id } = req.params;
    const { year } = req.query;
    
    const zakatHistory = [
      {
        id: 'zakat1',
        user_id,
        calculation_date: '2023-04-01T00:00:00Z',
        total_assets: 100000,
        total_liabilities: 20000,
        zakatable_amount: 80000,
        nisab_threshold: 5100,
        meets_nisab: true,
        zakat_payable: 2000,
        zakat_method: 'standard',
        currency: 'USD',
        payment_status: 'paid',
        payment_date: '2023-04-05T00:00:00Z',
      },
      {
        id: 'zakat2',
        user_id,
        calculation_date: '2022-04-01T00:00:00Z',
        total_assets: 90000,
        total_liabilities: 25000,
        zakatable_amount: 65000,
        nisab_threshold: 4800,
        meets_nisab: true,
        zakat_payable: 1625,
        zakat_method: 'standard',
        currency: 'USD',
        payment_status: 'paid',
        payment_date: '2022-04-10T00:00:00Z',
      },
    ];
    
    let filteredHistory = zakatHistory;
    if (year) {
      filteredHistory = filteredHistory.filter(zh => 
        new Date(zh.calculation_date).getFullYear() === parseInt(year)
      );
    }
    
    logger.info(`Retrieved zakat history for user: ${user_id}`);
    
    res.json(filteredHistory);
  } catch (error) {
    logger.error(`Error retrieving zakat history: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve zakat history' });
  }
});

router.post('/zakat/payment', (req, res) => {
  try {
    const { user_id, amount, currency, payment_method, calculation_id, recipient } = req.body;
    
    if (!user_id || !amount || !payment_method) {
      return res.status(400).json({ error: 'Missing required fields: user_id, amount, and payment_method' });
    }
    
    const payment = {
      id: uuidv4(),
      user_id,
      amount: parseFloat(amount),
      currency: currency || 'USD',
      payment_method,
      calculation_id,
      recipient: recipient || 'Zakat Foundation',
      status: 'completed',
      payment_date: new Date().toISOString(),
      transaction_id: `tx-${Math.random().toString(36).substr(2, 9)}`,
      receipt_url: `https://example.com/receipts/zakat-${Math.random().toString(36).substr(2, 9)}.pdf`,
    };
    
    logger.info(`Processed zakat payment: ${payment.id}`);
    
    res.status(201).json(payment);
  } catch (error) {
    logger.error(`Error processing zakat payment: ${error.message}`);
    res.status(500).json({ error: 'Failed to process zakat payment' });
  }
});

router.post('/audit/transaction', (req, res) => {
  try {
    const { transaction_id, transaction_type, parties, amount, currency, description, contract_terms } = req.body;
    
    if (!transaction_id || !transaction_type || !amount) {
      return res.status(400).json({ error: 'Missing required fields: transaction_id, transaction_type, and amount' });
    }
    
    let complianceScore = 0;
    let status = 'pending';
    let issues = [];
    
    const compliantTypes = ['murabaha', 'ijara', 'musharaka', 'mudaraba', 'sukuk', 'takaful', 'qard_hasan'];
    const nonCompliantTypes = ['interest_loan', 'conventional_insurance', 'gambling', 'speculation'];
    
    if (compliantTypes.includes(transaction_type.toLowerCase())) {
      complianceScore += 40;
    } else if (nonCompliantTypes.includes(transaction_type.toLowerCase())) {
      issues.push({
        type: 'prohibited_transaction',
        description: 'Transaction type is prohibited under Sharia law',
      });
    } else {
      complianceScore += 20;
      issues.push({
        type: 'unverified_transaction',
        description: 'Transaction type requires further verification',
      });
    }
    
    if (contract_terms) {
      if (contract_terms.interest_free) {
        complianceScore += 20;
      } else {
        issues.push({
          type: 'interest',
          description: 'Contract includes interest (riba)',
        });
      }
      
      if (contract_terms.risk_sharing) {
        complianceScore += 20;
      } else {
        issues.push({
          type: 'risk_transfer',
          description: 'Contract does not include appropriate risk sharing',
        });
      }
      
      if (contract_terms.asset_backed) {
        complianceScore += 20;
      } else {
        issues.push({
          type: 'not_asset_backed',
          description: 'Transaction is not backed by real assets',
        });
      }
    } else {
      issues.push({
        type: 'missing_contract_terms',
        description: 'Contract terms not provided for audit',
      });
    }
    
    if (complianceScore >= 80) {
      status = 'compliant';
    } else if (complianceScore >= 50) {
      status = 'partially_compliant';
    } else {
      status = 'non_compliant';
    }
    
    const auditResult = {
      id: uuidv4(),
      transaction_id,
      transaction_type,
      amount: parseFloat(amount),
      currency: currency || 'USD',
      compliance_score: complianceScore,
      status,
      issues,
      audited_at: new Date().toISOString(),
      auditor: 'Sharia Compliance System',
    };
    
    logger.info(`Audited transaction: ${transaction_id}`);
    
    res.status(201).json(auditResult);
  } catch (error) {
    logger.error(`Error auditing transaction: ${error.message}`);
    res.status(500).json({ error: 'Failed to audit transaction' });
  }
});

router.get('/audit/transaction/:transaction_id', (req, res) => {
  try {
    const { transaction_id } = req.params;
    
    const auditResult = {
      id: 'audit123',
      transaction_id,
      transaction_type: 'murabaha',
      amount: 10000,
      currency: 'USD',
      compliance_score: 95,
      status: 'compliant',
      issues: [],
      audited_at: '2023-04-01T00:00:00Z',
      auditor: 'Sharia Compliance System',
      details: {
        transaction_date: '2023-03-30T00:00:00Z',
        parties: [
          {
            role: 'buyer',
            id: 'user1',
          },
          {
            role: 'seller',
            id: 'bank1',
          },
        ],
        contract_terms: {
          interest_free: true,
          risk_sharing: true,
          asset_backed: true,
          profit_margin: 5,
          payment_schedule: 'monthly',
          term: 12, // months
        },
        asset: {
          type: 'vehicle',
          id: 'asset123',
          description: 'Toyota Camry 2023',
          value: 25000,
        },
        compliance_notes: [
          'Transaction follows murabaha structure correctly',
          'Asset ownership properly transferred before sale',
          'Profit margin clearly disclosed and agreed upon',
        ],
      },
    };
    
    logger.info(`Retrieved audit result for transaction: ${transaction_id}`);
    
    res.json(auditResult);
  } catch (error) {
    logger.error(`Error retrieving audit result: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve audit result' });
  }
});

router.post('/audit/portfolio', (req, res) => {
  try {
    const { user_id, portfolio_type, assets } = req.body;
    
    if (!user_id || !portfolio_type || !assets || !assets.length) {
      return res.status(400).json({ error: 'Missing required fields: user_id, portfolio_type, and assets' });
    }
    
    const compliantAssets = [];
    const nonCompliantAssets = [];
    let totalValue = 0;
    
    assets.forEach(asset => {
      totalValue += parseFloat(asset.value);
      
      if (asset.type === 'stock') {
        const compliantSectors = ['technology', 'healthcare', 'consumer_goods', 'real_estate'];
        const nonCompliantSectors = ['conventional_banking', 'alcohol', 'tobacco', 'gambling', 'weapons'];
        
        if (nonCompliantSectors.includes(asset.sector)) {
          nonCompliantAssets.push({
            ...asset,
            issue: 'Prohibited business activity',
          });
        } else if (compliantSectors.includes(asset.sector)) {
          compliantAssets.push(asset);
        } else {
          if (asset.debt_ratio && asset.debt_ratio > 0.33) {
            nonCompliantAssets.push({
              ...asset,
              issue: 'Excessive debt ratio',
            });
          } else if (asset.interest_income_ratio && asset.interest_income_ratio > 0.05) {
            nonCompliantAssets.push({
              ...asset,
              issue: 'Excessive interest income',
            });
          } else {
            compliantAssets.push(asset);
          }
        }
      } else if (asset.type === 'sukuk' || asset.type === 'islamic_fund') {
        compliantAssets.push(asset);
      } else if (asset.type === 'bond' || asset.type === 'interest_bearing') {
        nonCompliantAssets.push({
          ...asset,
          issue: 'Interest-bearing instrument',
        });
      } else {
        compliantAssets.push(asset);
      }
    });
    
    const compliantValue = compliantAssets.reduce((sum, asset) => sum + parseFloat(asset.value), 0);
    const compliancePercentage = (compliantValue / totalValue) * 100;
    
    const portfolioAudit = {
      id: uuidv4(),
      user_id,
      portfolio_type,
      total_assets: assets.length,
      total_value: totalValue,
      compliant_assets: compliantAssets.length,
      compliant_value: compliantValue,
      compliance_percentage: compliancePercentage,
      status: compliancePercentage >= 95 ? 'compliant' : 
              compliancePercentage >= 70 ? 'partially_compliant' : 'non_compliant',
      compliant_assets: compliantAssets,
      non_compliant_assets: nonCompliantAssets,
      purification_amount: (totalValue - compliantValue) * 0.025, // 2.5% of non-compliant value
      audited_at: new Date().toISOString(),
      recommendations: [
        'Consider replacing non-compliant assets with Sharia-compliant alternatives',
        'Donate purification amount to charity to cleanse portfolio',
        'Regular portfolio screening is recommended to maintain compliance',
      ],
    };
    
    logger.info(`Audited portfolio for user: ${user_id}`);
    
    res.status(201).json(portfolioAudit);
  } catch (error) {
    logger.error(`Error auditing portfolio: ${error.message}`);
    res.status(500).json({ error: 'Failed to audit portfolio' });
  }
});

router.get('/finance/products', (req, res) => {
  try {
    const { category, institution } = req.query;
    
    const products = [
      {
        id: 'prod1',
        name: 'Home Financing Murabaha',
        category: 'home_financing',
        type: 'murabaha',
        institution: 'Islamic Bank A',
        description: 'Sharia-compliant home financing using murabaha (cost-plus) structure',
        profit_rate: 5.5,
        term_range: {
          min: 5,
          max: 25,
          unit: 'years',
        },
        financing_range: {
          min: 100000,
          max: 1000000,
          currency: 'USD',
        },
        features: [
          'Fixed profit rate',
          'No early settlement penalties',
          'Flexible payment options',
        ],
        requirements: [
          'Minimum income of $50,000',
          'Good credit history',
          'Property must meet bank\'s criteria',
        ],
      },
      {
        id: 'prod2',
        name: 'Business Musharaka',
        category: 'business_financing',
        type: 'musharaka',
        institution: 'Islamic Bank B',
        description: 'Partnership-based business financing with profit and loss sharing',
        profit_sharing_ratio: '60:40', // bank:customer
        term_range: {
          min: 1,
          max: 10,
          unit: 'years',
        },
        financing_range: {
          min: 50000,
          max: 5000000,
          currency: 'USD',
        },
        features: [
          'Equity partnership structure',
          'Profit and loss sharing',
          'Flexible exit options',
        ],
        requirements: [
          'Viable business plan',
          'Minimum 2 years in business',
          'Financial statements',
        ],
      },
      {
        id: 'prod3',
        name: 'Takaful Family Protection',
        category: 'insurance',
        type: 'takaful',
        institution: 'Takaful Operator C',
        description: 'Islamic alternative to life insurance based on mutual cooperation',
        contribution_range: {
          min: 100,
          max: 1000,
          frequency: 'monthly',
          currency: 'USD',
        },
        coverage_range: {
          min: 100000,
          max: 1000000,
          currency: 'USD',
        },
        features: [
          'Death and disability coverage',
          'Investment portion in Sharia-compliant assets',
          'Surplus sharing among participants',
        ],
        requirements: [
          'Health declaration',
          'Age between 18-60 years',
          'Identity verification',
        ],
      },
    ];
    
    let filteredProducts = products;
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    if (institution) {
      filteredProducts = filteredProducts.filter(p => p.institution === institution);
    }
    
    logger.info('Retrieved Islamic finance products');
    
    res.json(filteredProducts);
  } catch (error) {
    logger.error(`Error retrieving Islamic finance products: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve Islamic finance products' });
  }
});

router.post('/finance/application', (req, res) => {
  try {
    const { user_id, product_id, amount, term, purpose, income, assets, liabilities } = req.body;
    
    if (!user_id || !product_id || !amount || !term) {
      return res.status(400).json({ error: 'Missing required fields: user_id, product_id, amount, and term' });
    }
    
    const application = {
      id: uuidv4(),
      user_id,
      product_id,
      amount: parseFloat(amount),
      term: parseInt(term),
      purpose: purpose || '',
      income: income ? parseFloat(income) : null,
      assets: assets || [],
      liabilities: liabilities || [],
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      reference_number: `FIN-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    };
    
    logger.info(`Created finance application: ${application.id}`);
    
    res.status(201).json(application);
  } catch (error) {
    logger.error(`Error creating finance application: ${error.message}`);
    res.status(500).json({ error: 'Failed to create finance application' });
  }
});

router.get('/finance/calculator', (req, res) => {
  try {
    const { product_type, amount, term, profit_rate } = req.query;
    
    if (!product_type || !amount || !term) {
      return res.status(400).json({ error: 'Missing required parameters: product_type, amount, and term' });
    }
    
    const parsedAmount = parseFloat(amount);
    const parsedTerm = parseInt(term);
    const parsedProfitRate = profit_rate ? parseFloat(profit_rate) : 5.0; // Default to 5%
    
    let calculationResult = {};
    
    if (product_type === 'murabaha') {
      const totalProfit = parsedAmount * (parsedProfitRate / 100) * parsedTerm;
      const totalAmount = parsedAmount + totalProfit;
      const monthlyPayment = totalAmount / (parsedTerm * 12);
      
      calculationResult = {
        product_type,
        principal: parsedAmount,
        term: parsedTerm,
        profit_rate: parsedProfitRate,
        total_profit: totalProfit,
        total_amount: totalAmount,
        monthly_payment: monthlyPayment,
        payment_schedule: generatePaymentSchedule(parsedTerm, monthlyPayment, totalAmount),
      };
    } else if (product_type === 'ijara') {
      const monthlyRent = (parsedAmount * (parsedProfitRate / 100)) / 12;
      const totalRent = monthlyRent * parsedTerm * 12;
      const totalAmount = parsedAmount + totalRent;
      
      calculationResult = {
        product_type,
        asset_value: parsedAmount,
        term: parsedTerm,
        profit_rate: parsedProfitRate,
        monthly_rent: monthlyRent,
        total_rent: totalRent,
        total_amount: totalAmount,
        payment_schedule: generatePaymentSchedule(parsedTerm, monthlyRent, totalRent),
      };
    } else if (product_type === 'musharaka') {
      const bankShare = 0.7; // 70% bank, 30% customer
      const bankInvestment = parsedAmount * bankShare;
      const customerInvestment = parsedAmount * (1 - bankShare);
      const expectedProfit = parsedAmount * (parsedProfitRate / 100) * parsedTerm;
      const bankProfit = expectedProfit * bankShare;
      const customerProfit = expectedProfit * (1 - bankShare);
      
      calculationResult = {
        product_type,
        total_investment: parsedAmount,
        term: parsedTerm,
        expected_profit_rate: parsedProfitRate,
        bank_investment: bankInvestment,
        customer_investment: customerInvestment,
        bank_share_percentage: bankShare * 100,
        customer_share_percentage: (1 - bankShare) * 100,
        expected_total_profit: expectedProfit,
        bank_profit: bankProfit,
        customer_profit: customerProfit,
      };
    } else {
      return res.status(400).json({ error: 'Unsupported product type' });
    }
    
    logger.info(`Performed Islamic finance calculation for ${product_type}`);
    
    res.json(calculationResult);
  } catch (error) {
    logger.error(`Error performing finance calculation: ${error.message}`);
    res.status(500).json({ error: 'Failed to perform finance calculation' });
  }
});

router.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

function generatePaymentSchedule(term, monthlyPayment, totalAmount) {
  const schedule = [];
  let remainingBalance = totalAmount;
  
  for (let i = 1; i <= Math.min(term * 12, 12); i++) { // Show max 12 months for brevity
    remainingBalance -= monthlyPayment;
    
    schedule.push({
      payment_number: i,
      payment_amount: monthlyPayment,
      remaining_balance: Math.max(0, remainingBalance),
      payment_date: new Date(Date.now() + (i * 30 * 24 * 60 * 60 * 1000)).toISOString(), // +i months
    });
  }
  
  return schedule;
}

module.exports = router;
