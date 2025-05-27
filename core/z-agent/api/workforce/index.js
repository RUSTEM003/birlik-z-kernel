/**
 * Workforce API Block
 * 
 * This module provides functionality for:
 * - Job marketplace: Platform for job listings and applications
 * - Skills verification: Verification of skills and qualifications
 * - DAO governance: Decentralized governance for workforce management
 * - Freelance management: Tools for managing freelance work
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'api-workforce' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: 'api-workforce.log' }),
  ],
});

const router = express.Router();

router.get('/jobs', (req, res) => {
  try {
    const { category, location, skills, experience_level, job_type, salary_min, salary_max, page = 1, limit = 20 } = req.query;
    
    const jobs = [
      {
        id: 'job1',
        title: 'Senior Software Engineer',
        company: {
          id: 'company1',
          name: 'Tech Innovations Inc.',
          logo_url: 'https://example.com/logos/tech_innovations.png',
          verified: true,
        },
        category: 'software_development',
        location: {
          city: 'Almaty',
          country: 'Kazakhstan',
          remote: true,
        },
        description: 'We are looking for an experienced software engineer to join our team...',
        requirements: [
          'At least 5 years of experience in software development',
          'Strong knowledge of JavaScript and React',
          'Experience with Node.js and Express',
          'Good communication skills',
        ],
        skills: ['javascript', 'react', 'node.js', 'express', 'mongodb'],
        experience_level: 'senior',
        job_type: 'full_time',
        salary: {
          min: 80000,
          max: 120000,
          currency: 'USD',
          period: 'year',
        },
        benefits: [
          'Health insurance',
          'Flexible working hours',
          'Remote work options',
          'Professional development budget',
        ],
        posted_at: '2023-04-01T00:00:00Z',
        expires_at: '2023-05-01T00:00:00Z',
        applications_count: 15,
      },
      {
        id: 'job2',
        title: 'UX/UI Designer',
        company: {
          id: 'company2',
          name: 'Creative Solutions',
          logo_url: 'https://example.com/logos/creative_solutions.png',
          verified: true,
        },
        category: 'design',
        location: {
          city: 'Nur-Sultan',
          country: 'Kazakhstan',
          remote: false,
        },
        description: 'We are seeking a talented UX/UI Designer to create amazing user experiences...',
        requirements: [
          'At least 3 years of experience in UX/UI design',
          'Proficiency in Figma and Adobe Creative Suite',
          'Portfolio of design projects',
          'Experience with design systems',
        ],
        skills: ['ui_design', 'ux_design', 'figma', 'adobe_xd', 'sketch'],
        experience_level: 'mid',
        job_type: 'full_time',
        salary: {
          min: 60000,
          max: 90000,
          currency: 'USD',
          period: 'year',
        },
        benefits: [
          'Health insurance',
          'Creative work environment',
          'Team building activities',
          'Professional development opportunities',
        ],
        posted_at: '2023-04-05T00:00:00Z',
        expires_at: '2023-05-05T00:00:00Z',
        applications_count: 8,
      },
      {
        id: 'job3',
        title: 'Blockchain Developer',
        company: {
          id: 'company3',
          name: 'Crypto Innovations',
          logo_url: 'https://example.com/logos/crypto_innovations.png',
          verified: true,
        },
        category: 'blockchain',
        location: {
          city: 'Remote',
          country: null,
          remote: true,
        },
        description: 'Looking for an experienced blockchain developer to work on cutting-edge projects...',
        requirements: [
          'Experience with Ethereum and Solidity',
          'Understanding of blockchain principles',
          'Smart contract development experience',
          'Knowledge of web3.js or ethers.js',
        ],
        skills: ['blockchain', 'ethereum', 'solidity', 'smart_contracts', 'web3'],
        experience_level: 'senior',
        job_type: 'contract',
        salary: {
          min: 100,
          max: 150,
          currency: 'USD',
          period: 'hour',
        },
        benefits: [
          'Flexible working hours',
          'Remote work',
          'Cryptocurrency payments',
          'Cutting-edge projects',
        ],
        posted_at: '2023-04-10T00:00:00Z',
        expires_at: '2023-05-10T00:00:00Z',
        applications_count: 12,
      },
    ];
    
    let filteredJobs = jobs;
    
    if (category) {
      filteredJobs = filteredJobs.filter(job => job.category === category);
    }
    
    if (location) {
      filteredJobs = filteredJobs.filter(job => 
        job.location.city.toLowerCase().includes(location.toLowerCase()) || 
        (job.location.country && job.location.country.toLowerCase().includes(location.toLowerCase()))
      );
    }
    
    if (skills) {
      const skillsList = skills.split(',');
      filteredJobs = filteredJobs.filter(job => 
        skillsList.some(skill => job.skills.includes(skill))
      );
    }
    
    if (experience_level) {
      filteredJobs = filteredJobs.filter(job => job.experience_level === experience_level);
    }
    
    if (job_type) {
      filteredJobs = filteredJobs.filter(job => job.job_type === job_type);
    }
    
    if (salary_min) {
      filteredJobs = filteredJobs.filter(job => job.salary.min >= parseFloat(salary_min));
    }
    
    if (salary_max) {
      filteredJobs = filteredJobs.filter(job => job.salary.max <= parseFloat(salary_max));
    }
    
    logger.info('Retrieved job listings');
    
    res.json({
      data: filteredJobs,
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredJobs.length,
      total_pages: Math.ceil(filteredJobs.length / parseInt(limit)),
    });
  } catch (error) {
    logger.error(`Error retrieving job listings: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve job listings' });
  }
});

router.get('/jobs/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const job = {
      id,
      title: 'Senior Software Engineer',
      company: {
        id: 'company1',
        name: 'Tech Innovations Inc.',
        logo_url: 'https://example.com/logos/tech_innovations.png',
        verified: true,
        description: 'A leading technology company specializing in innovative solutions',
        website: 'https://example.com/tech_innovations',
        founded_year: 2010,
        size: '50-200 employees',
        industry: 'Information Technology',
      },
      category: 'software_development',
      location: {
        city: 'Almaty',
        country: 'Kazakhstan',
        remote: true,
        address: '123 Tech Street, Almaty, Kazakhstan',
      },
      description: 'We are looking for an experienced software engineer to join our team...',
      responsibilities: [
        'Design and develop high-quality software solutions',
        'Collaborate with cross-functional teams',
        'Write clean, maintainable code',
        'Troubleshoot and debug applications',
        'Implement security and data protection measures',
      ],
      requirements: [
        'At least 5 years of experience in software development',
        'Strong knowledge of JavaScript and React',
        'Experience with Node.js and Express',
        'Good communication skills',
        'Bachelor\'s degree in Computer Science or related field',
      ],
      skills: ['javascript', 'react', 'node.js', 'express', 'mongodb'],
      experience_level: 'senior',
      job_type: 'full_time',
      salary: {
        min: 80000,
        max: 120000,
        currency: 'USD',
        period: 'year',
        negotiable: true,
      },
      benefits: [
        'Health insurance',
        'Flexible working hours',
        'Remote work options',
        'Professional development budget',
        '401(k) matching',
        'Paid time off',
      ],
      posted_at: '2023-04-01T00:00:00Z',
      expires_at: '2023-05-01T00:00:00Z',
      applications_count: 15,
      interview_process: [
        'Initial screening call',
        'Technical assessment',
        'Technical interview',
        'Cultural fit interview',
        'Final interview with leadership',
      ],
      similar_jobs: [
        {
          id: 'job4',
          title: 'Full Stack Developer',
          company: 'Web Solutions Ltd.',
          location: {
            city: 'Almaty',
            country: 'Kazakhstan',
          },
          salary: {
            min: 70000,
            max: 100000,
            currency: 'USD',
          },
        },
        {
          id: 'job5',
          title: 'Frontend Engineer',
          company: 'Digital Products Inc.',
          location: {
            city: 'Remote',
            country: null,
          },
          salary: {
            min: 75000,
            max: 110000,
            currency: 'USD',
          },
        },
      ],
    };
    
    logger.info(`Retrieved job: ${id}`);
    
    res.json(job);
  } catch (error) {
    logger.error(`Error retrieving job: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve job' });
  }
});

router.post('/jobs', (req, res) => {
  try {
    const { title, company_id, category, location, description, responsibilities, requirements, skills, experience_level, job_type, salary, benefits, expires_at } = req.body;
    
    if (!title || !company_id || !category || !description || !requirements || !skills || !experience_level || !job_type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const job = {
      id: uuidv4(),
      title,
      company_id,
      category,
      location: location || {
        city: 'Remote',
        country: null,
        remote: true,
      },
      description,
      responsibilities: responsibilities || [],
      requirements: Array.isArray(requirements) ? requirements : [requirements],
      skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()),
      experience_level,
      job_type,
      salary: salary || null,
      benefits: benefits || [],
      posted_at: new Date().toISOString(),
      expires_at: expires_at || new Date(Date.now() + 2592000000).toISOString(), // +30 days by default
      applications_count: 0,
      status: 'active',
    };
    
    logger.info(`Created job listing: ${job.id}`);
    
    res.status(201).json(job);
  } catch (error) {
    logger.error(`Error creating job listing: ${error.message}`);
    res.status(500).json({ error: 'Failed to create job listing' });
  }
});

router.post('/applications', (req, res) => {
  try {
    const { job_id, user_id, resume_url, cover_letter, answers } = req.body;
    
    if (!job_id || !user_id || !resume_url) {
      return res.status(400).json({ error: 'Missing required fields: job_id, user_id, and resume_url' });
    }
    
    const application = {
      id: uuidv4(),
      job_id,
      user_id,
      resume_url,
      cover_letter: cover_letter || '',
      answers: answers || {},
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    logger.info(`Created job application: ${application.id}`);
    
    res.status(201).json(application);
  } catch (error) {
    logger.error(`Error creating job application: ${error.message}`);
    res.status(500).json({ error: 'Failed to create job application' });
  }
});

router.post('/skills/verify', (req, res) => {
  try {
    const { user_id, skill_id, verification_type, evidence_url } = req.body;
    
    if (!user_id || !skill_id || !verification_type) {
      return res.status(400).json({ error: 'Missing required fields: user_id, skill_id, and verification_type' });
    }
    
    if (!['credential', 'assessment', 'endorsement', 'portfolio', 'experience'].includes(verification_type)) {
      return res.status(400).json({ error: 'Invalid verification type' });
    }
    
    const verificationRequest = {
      id: uuidv4(),
      user_id,
      skill_id,
      verification_type,
      evidence_url: evidence_url || null,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    logger.info(`Created skill verification request: ${verificationRequest.id}`);
    
    res.status(201).json(verificationRequest);
  } catch (error) {
    logger.error(`Error creating skill verification request: ${error.message}`);
    res.status(500).json({ error: 'Failed to create skill verification request' });
  }
});

router.get('/skills/verifications/:user_id', (req, res) => {
  try {
    const { user_id } = req.params;
    
    const verifications = [
      {
        id: 'ver1',
        user_id,
        skill: {
          id: 'skill1',
          name: 'JavaScript',
          category: 'programming',
        },
        verification_type: 'assessment',
        evidence_url: 'https://example.com/certificates/js_assessment.pdf',
        status: 'verified',
        score: 92,
        verified_at: '2023-03-01T00:00:00Z',
        expires_at: '2025-03-01T00:00:00Z',
        verifier: {
          id: 'verifier1',
          name: 'Tech Skills Assessment Inc.',
          type: 'organization',
          verified: true,
        },
      },
      {
        id: 'ver2',
        user_id,
        skill: {
          id: 'skill2',
          name: 'React',
          category: 'programming',
        },
        verification_type: 'credential',
        evidence_url: 'https://example.com/certificates/react_certification.pdf',
        status: 'verified',
        score: 88,
        verified_at: '2023-02-15T00:00:00Z',
        expires_at: '2025-02-15T00:00:00Z',
        verifier: {
          id: 'verifier2',
          name: 'React Certification Board',
          type: 'organization',
          verified: true,
        },
      },
      {
        id: 'ver3',
        user_id,
        skill: {
          id: 'skill3',
          name: 'Project Management',
          category: 'management',
        },
        verification_type: 'endorsement',
        evidence_url: null,
        status: 'verified',
        endorsements_count: 12,
        verified_at: '2023-01-20T00:00:00Z',
        expires_at: null,
        top_endorsers: [
          {
            id: 'user2',
            name: 'Jane Smith',
            title: 'Senior Project Manager',
            relationship: 'worked_together',
          },
          {
            id: 'user3',
            name: 'Bob Johnson',
            title: 'CTO',
            relationship: 'managed',
          },
        ],
      },
    ];
    
    logger.info(`Retrieved skill verifications for user: ${user_id}`);
    
    res.json(verifications);
  } catch (error) {
    logger.error(`Error retrieving skill verifications: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve skill verifications' });
  }
});

router.post('/skills/endorse', (req, res) => {
  try {
    const { user_id, skill_id, endorser_id, relationship, comment } = req.body;
    
    if (!user_id || !skill_id || !endorser_id || !relationship) {
      return res.status(400).json({ error: 'Missing required fields: user_id, skill_id, endorser_id, and relationship' });
    }
    
    const endorsement = {
      id: uuidv4(),
      user_id,
      skill_id,
      endorser_id,
      relationship,
      comment: comment || '',
      created_at: new Date().toISOString(),
    };
    
    logger.info(`Created skill endorsement: ${endorsement.id}`);
    
    res.status(201).json(endorsement);
  } catch (error) {
    logger.error(`Error creating skill endorsement: ${error.message}`);
    res.status(500).json({ error: 'Failed to create skill endorsement' });
  }
});

router.get('/dao/proposals', (req, res) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    
    const proposals = [
      {
        id: 'prop1',
        title: 'Implement Skill Verification Standards',
        description: 'Proposal to establish standardized skill verification processes across the platform',
        category: 'standards',
        status: 'active',
        created_by: {
          id: 'user1',
          name: 'John Doe',
          reputation: 95,
        },
        created_at: '2023-04-01T00:00:00Z',
        voting_ends_at: '2023-04-15T00:00:00Z',
        votes: {
          yes: 120,
          no: 30,
          abstain: 15,
        },
        quorum: 100,
        threshold: 0.66, // 66% required to pass
        discussion_url: 'https://forum.birlik.io/proposals/prop1',
        documents: [
          {
            title: 'Skill Verification Standards Draft',
            url: 'https://example.com/documents/skill_standards_draft.pdf',
          },
          {
            title: 'Implementation Timeline',
            url: 'https://example.com/documents/implementation_timeline.pdf',
          },
        ],
      },
      {
        id: 'prop2',
        title: 'Freelancer Protection Fund',
        description: 'Proposal to establish a fund to protect freelancers from non-payment and disputes',
        category: 'finance',
        status: 'active',
        created_by: {
          id: 'user4',
          name: 'Sarah Williams',
          reputation: 88,
        },
        created_at: '2023-04-05T00:00:00Z',
        voting_ends_at: '2023-04-20T00:00:00Z',
        votes: {
          yes: 200,
          no: 50,
          abstain: 25,
        },
        quorum: 150,
        threshold: 0.6, // 60% required to pass
        discussion_url: 'https://forum.birlik.io/proposals/prop2',
        documents: [
          {
            title: 'Fund Structure Proposal',
            url: 'https://example.com/documents/fund_structure.pdf',
          },
          {
            title: 'Financial Projections',
            url: 'https://example.com/documents/financial_projections.pdf',
          },
        ],
      },
      {
        id: 'prop3',
        title: 'Remote Work Certification Program',
        description: 'Proposal to create a certification program for remote workers',
        category: 'education',
        status: 'completed',
        created_by: {
          id: 'user5',
          name: 'Michael Chen',
          reputation: 92,
        },
        created_at: '2023-03-15T00:00:00Z',
        voting_ends_at: '2023-03-30T00:00:00Z',
        votes: {
          yes: 180,
          no: 40,
          abstain: 10,
        },
        quorum: 100,
        threshold: 0.6, // 60% required to pass
        result: 'passed',
        implementation_status: 'in_progress',
        implementation_details: {
          start_date: '2023-04-15T00:00:00Z',
          estimated_completion: '2023-07-15T00:00:00Z',
          milestones: [
            {
              title: 'Curriculum Development',
              status: 'in_progress',
              due_date: '2023-05-15T00:00:00Z',
            },
            {
              title: 'Platform Integration',
              status: 'pending',
              due_date: '2023-06-15T00:00:00Z',
            },
            {
              title: 'Launch',
              status: 'pending',
              due_date: '2023-07-15T00:00:00Z',
            },
          ],
        },
        discussion_url: 'https://forum.birlik.io/proposals/prop3',
      },
    ];
    
    let filteredProposals = proposals;
    
    if (status) {
      filteredProposals = filteredProposals.filter(p => p.status === status);
    }
    
    if (category) {
      filteredProposals = filteredProposals.filter(p => p.category === category);
    }
    
    logger.info('Retrieved DAO proposals');
    
    res.json({
      data: filteredProposals,
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredProposals.length,
      total_pages: Math.ceil(filteredProposals.length / parseInt(limit)),
    });
  } catch (error) {
    logger.error(`Error retrieving DAO proposals: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve DAO proposals' });
  }
});

router.post('/dao/proposals', (req, res) => {
  try {
    const { title, description, category, created_by, voting_period_days, quorum, threshold, documents } = req.body;
    
    if (!title || !description || !category || !created_by || !quorum || !threshold) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const proposal = {
      id: uuidv4(),
      title,
      description,
      category,
      status: 'pending_review',
      created_by,
      created_at: new Date().toISOString(),
      voting_starts_at: null,
      voting_ends_at: null,
      voting_period_days: voting_period_days || 14,
      votes: {
        yes: 0,
        no: 0,
        abstain: 0,
      },
      quorum: parseInt(quorum),
      threshold: parseFloat(threshold),
      documents: documents || [],
    };
    
    logger.info(`Created DAO proposal: ${proposal.id}`);
    
    res.status(201).json(proposal);
  } catch (error) {
    logger.error(`Error creating DAO proposal: ${error.message}`);
    res.status(500).json({ error: 'Failed to create DAO proposal' });
  }
});

router.post('/dao/vote', (req, res) => {
  try {
    const { proposal_id, user_id, vote, comment } = req.body;
    
    if (!proposal_id || !user_id || !vote) {
      return res.status(400).json({ error: 'Missing required fields: proposal_id, user_id, and vote' });
    }
    
    if (!['yes', 'no', 'abstain'].includes(vote)) {
      return res.status(400).json({ error: 'Invalid vote value. Must be "yes", "no", or "abstain"' });
    }
    
    const voteRecord = {
      id: uuidv4(),
      proposal_id,
      user_id,
      vote,
      comment: comment || '',
      created_at: new Date().toISOString(),
      weight: 1, // Default weight, could be based on reputation or token holdings
    };
    
    logger.info(`Recorded vote on proposal: ${proposal_id}`);
    
    res.status(201).json(voteRecord);
  } catch (error) {
    logger.error(`Error recording vote: ${error.message}`);
    res.status(500).json({ error: 'Failed to record vote' });
  }
});

router.get('/freelance/projects', (req, res) => {
  try {
    const { category, skills, budget_min, budget_max, status, page = 1, limit = 20 } = req.query;
    
    const projects = [
      {
        id: 'proj1',
        title: 'Develop E-commerce Website',
        client: {
          id: 'client1',
          name: 'Retail Solutions Inc.',
          verified: true,
          rating: 4.8,
        },
        category: 'web_development',
        description: 'We need an experienced developer to build an e-commerce website for our retail business...',
        requirements: [
          'Experience with React and Node.js',
          'E-commerce platform development experience',
          'Payment gateway integration',
          'Responsive design',
        ],
        skills: ['react', 'node.js', 'e-commerce', 'payment_integration'],
        budget: {
          min: 3000,
          max: 5000,
          currency: 'USD',
          type: 'fixed',
        },
        timeline: {
          duration: 30, // days
          deadline: '2023-05-30T00:00:00Z',
        },
        status: 'open',
        posted_at: '2023-04-01T00:00:00Z',
        proposals_count: 8,
      },
      {
        id: 'proj2',
        title: 'Mobile App UI Design',
        client: {
          id: 'client2',
          name: 'HealthTech Startup',
          verified: true,
          rating: 4.5,
        },
        category: 'design',
        description: 'Looking for a UI/UX designer to create a modern and intuitive interface for our health tracking mobile app...',
        requirements: [
          'Experience designing mobile applications',
          'Knowledge of iOS and Android design guidelines',
          'Portfolio of previous UI/UX work',
          'Ability to create interactive prototypes',
        ],
        skills: ['ui_design', 'ux_design', 'mobile_design', 'figma', 'prototyping'],
        budget: {
          min: 2000,
          max: 3500,
          currency: 'USD',
          type: 'fixed',
        },
        timeline: {
          duration: 20, // days
          deadline: '2023-05-15T00:00:00Z',
        },
        status: 'open',
        posted_at: '2023-04-05T00:00:00Z',
        proposals_count: 12,
      },
      {
        id: 'proj3',
        title: 'Content Writing for Blog',
        client: {
          id: 'client3',
          name: 'Digital Marketing Agency',
          verified: true,
          rating: 4.7,
        },
        category: 'writing',
        description: 'We need a content writer to create engaging blog posts on various technology topics...',
        requirements: [
          'Excellent English writing skills',
          'Knowledge of SEO principles',
          'Ability to research technical topics',
          'Experience writing blog content',
        ],
        skills: ['content_writing', 'seo', 'blogging', 'research'],
        budget: {
          min: 50,
          max: 100,
          currency: 'USD',
          type: 'per_article',
        },
        timeline: {
          duration: 90, // days
          deadline: '2023-07-01T00:00:00Z',
        },
        status: 'open',
        posted_at: '2023-04-10T00:00:00Z',
        proposals_count: 15,
      },
    ];
    
    let filteredProjects = projects;
    
    if (category) {
      filteredProjects = filteredProjects.filter(p => p.category === category);
    }
    
    if (skills) {
      const skillsList = skills.split(',');
      filteredProjects = filteredProjects.filter(p => 
        skillsList.some(skill => p.skills.includes(skill))
      );
    }
    
    if (budget_min) {
      filteredProjects = filteredProjects.filter(p => p.budget.max >= parseFloat(budget_min));
    }
    
    if (budget_max) {
      filteredProjects = filteredProjects.filter(p => p.budget.min <= parseFloat(budget_max));
    }
    
    if (status) {
      filteredProjects = filteredProjects.filter(p => p.status === status);
    }
    
    logger.info('Retrieved freelance projects');
    
    res.json({
      data: filteredProjects,
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredProjects.length,
      total_pages: Math.ceil(filteredProjects.length / parseInt(limit)),
    });
  } catch (error) {
    logger.error(`Error retrieving freelance projects: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve freelance projects' });
  }
});

router.post('/freelance/projects', (req, res) => {
  try {
    const { title, client_id, category, description, requirements, skills, budget, timeline } = req.body;
    
    if (!title || !client_id || !category || !description || !budget) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const project = {
      id: uuidv4(),
      title,
      client_id,
      category,
      description,
      requirements: requirements || [],
      skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()),
      budget,
      timeline: timeline || {
        duration: 30, // default 30 days
        deadline: new Date(Date.now() + 2592000000).toISOString(), // +30 days
      },
      status: 'open',
      posted_at: new Date().toISOString(),
      proposals_count: 0,
    };
    
    logger.info(`Created freelance project: ${project.id}`);
    
    res.status(201).json(project);
  } catch (error) {
    logger.error(`Error creating freelance project: ${error.message}`);
    res.status(500).json({ error: 'Failed to create freelance project' });
  }
});

router.post('/freelance/proposals', (req, res) => {
  try {
    const { project_id, freelancer_id, cover_letter, price, timeline, milestones } = req.body;
    
    if (!project_id || !freelancer_id || !price || !timeline) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const proposal = {
      id: uuidv4(),
      project_id,
      freelancer_id,
      cover_letter: cover_letter || '',
      price: {
        amount: parseFloat(price.amount),
        currency: price.currency || 'USD',
        type: price.type || 'fixed',
      },
      timeline: {
        duration: parseInt(timeline.duration),
        start_date: timeline.start_date || new Date().toISOString(),
      },
      milestones: milestones || [],
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    logger.info(`Created freelance proposal: ${proposal.id}`);
    
    res.status(201).json(proposal);
  } catch (error) {
    logger.error(`Error creating freelance proposal: ${error.message}`);
    res.status(500).json({ error: 'Failed to create freelance proposal' });
  }
});

router.post('/freelance/contracts', (req, res) => {
  try {
    const { project_id, client_id, freelancer_id, proposal_id, terms } = req.body;
    
    if (!project_id || !client_id || !freelancer_id || !terms) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const contract = {
      id: uuidv4(),
      project_id,
      client_id,
      freelancer_id,
      proposal_id: proposal_id || null,
      terms: {
        price: {
          amount: parseFloat(terms.price.amount),
          currency: terms.price.currency || 'USD',
          type: terms.price.type || 'fixed',
        },
        timeline: {
          start_date: terms.timeline.start_date || new Date().toISOString(),
          end_date: terms.timeline.end_date,
          duration: parseInt(terms.timeline.duration),
        },
        milestones: terms.milestones || [],
        payment_terms: terms.payment_terms || 'on_completion',
        deliverables: terms.deliverables || [],
        revisions: terms.revisions || 2,
      },
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      signed_by_client: false,
      signed_by_freelancer: false,
    };
    
    logger.info(`Created freelance contract: ${contract.id}`);
    
    res.status(201).json(contract);
  } catch (error) {
    logger.error(`Error creating freelance contract: ${error.message}`);
    res.status(500).json({ error: 'Failed to create freelance contract' });
  }
});

router.post('/freelance/milestones/:milestone_id/complete', (req, res) => {
  try {
    const { milestone_id } = req.params;
    const { contract_id, user_id, deliverables, comments } = req.body;
    
    if (!contract_id || !user_id) {
      return res.status(400).json({ error: 'Missing required fields: contract_id and user_id' });
    }
    
    const milestoneCompletion = {
      milestone_id,
      contract_id,
      user_id,
      deliverables: deliverables || [],
      comments: comments || '',
      status: 'completed',
      completed_at: new Date().toISOString(),
    };
    
    logger.info(`Completed milestone: ${milestone_id}`);
    
    res.status(200).json(milestoneCompletion);
  } catch (error) {
    logger.error(`Error completing milestone: ${error.message}`);
    res.status(500).json({ error: 'Failed to complete milestone' });
  }
});

router.post('/freelance/payments', (req, res) => {
  try {
    const { contract_id, milestone_id, payer_id, payee_id, amount, currency } = req.body;
    
    if (!contract_id || !payer_id || !payee_id || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const payment = {
      id: uuidv4(),
      contract_id,
      milestone_id: milestone_id || null,
      payer_id,
      payee_id,
      amount: parseFloat(amount),
      currency: currency || 'USD',
      status: 'processing',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      completed_at: null,
      transaction_id: null,
    };
    
    payment.status = 'completed';
    payment.completed_at = new Date().toISOString();
    payment.transaction_id = `tx-${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info(`Processed freelance payment: ${payment.id}`);
    
    res.status(201).json(payment);
  } catch (error) {
    logger.error(`Error processing freelance payment: ${error.message}`);
    res.status(500).json({ error: 'Failed to process freelance payment' });
  }
});

router.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

module.exports = router;
