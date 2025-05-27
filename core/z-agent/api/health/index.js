const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const logger = require('../../utils/logger');
const { authenticateToken, authorizeRole } = require('../../middleware/auth');
const { validateRequest } = require('../../middleware/validation');

let telemedConsultations = [
  {
    id: 'tc-001',
    patient_id: 'user-123',
    doctor_id: 'doctor-456',
    specialty: 'cardiology',
    status: 'scheduled',
    scheduled_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    duration_minutes: 30,
    symptoms: ['chest pain', 'shortness of breath'],
    patient_history_access: true,
    payment_status: 'paid',
    payment_amount: 75.00,
    payment_currency: 'USD',
    blockchain_verification: 'eth-0x1234567890abcdef1234567890abcdef12345678',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'tc-002',
    patient_id: 'user-789',
    doctor_id: 'doctor-123',
    specialty: 'dermatology',
    status: 'completed',
    scheduled_time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    duration_minutes: 15,
    symptoms: ['skin rash', 'itching'],
    patient_history_access: true,
    payment_status: 'paid',
    payment_amount: 50.00,
    payment_currency: 'USD',
    blockchain_verification: 'eth-0xabcdef1234567890abcdef1234567890abcdef12',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    diagnosis: 'Contact dermatitis',
    prescription: [
      {
        medication: 'Hydrocortisone cream',
        dosage: '1% strength',
        instructions: 'Apply to affected area twice daily',
        duration_days: 7
      }
    ],
    follow_up_recommended: true,
    follow_up_days: 14
  }
];

let medicalRecords = [
  {
    id: 'mr-001',
    patient_id: 'user-123',
    record_type: 'comprehensive',
    blockchain_id: 'eth-0x2345678901abcdef2345678901abcdef23456789',
    is_encrypted: true,
    access_control: {
      owner_access: true,
      authorized_doctors: ['doctor-456', 'doctor-789'],
      authorized_institutions: ['hospital-001'],
      temporary_access: []
    },
    metadata: {
      created_at: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      last_accessed: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      record_format: 'FHIR',
      record_size_kb: 1240
    },
    vital_statistics: {
      height_cm: 175,
      weight_kg: 70,
      blood_type: 'A+',
      allergies: ['penicillin', 'peanuts'],
      chronic_conditions: ['hypertension']
    },
    immunization_history: [
      {
        vaccine: 'COVID-19',
        date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        manufacturer: 'Pfizer',
        batch_number: 'PZ12345',
        administered_by: 'doctor-789',
        location: 'Central Hospital'
      },
      {
        vaccine: 'Influenza',
        date: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString(),
        manufacturer: 'GlaxoSmithKline',
        batch_number: 'GSK67890',
        administered_by: 'doctor-456',
        location: 'Community Clinic'
      }
    ]
  },
  {
    id: 'mr-002',
    patient_id: 'user-789',
    record_type: 'comprehensive',
    blockchain_id: 'eth-0x3456789012abcdef3456789012abcdef34567890',
    is_encrypted: true,
    access_control: {
      owner_access: true,
      authorized_doctors: ['doctor-123'],
      authorized_institutions: [],
      temporary_access: [
        {
          doctor_id: 'doctor-456',
          granted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          purpose: 'Second opinion'
        }
      ]
    },
    metadata: {
      created_at: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      last_accessed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      record_format: 'FHIR',
      record_size_kb: 980
    },
    vital_statistics: {
      height_cm: 162,
      weight_kg: 58,
      blood_type: 'O-',
      allergies: ['sulfa drugs'],
      chronic_conditions: ['asthma', 'eczema']
    },
    immunization_history: [
      {
        vaccine: 'COVID-19',
        date: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
        manufacturer: 'Moderna',
        batch_number: 'MD54321',
        administered_by: 'doctor-123',
        location: 'University Hospital'
      }
    ]
  }
];

let aiDiagnostics = [
  {
    id: 'aid-001',
    patient_id: 'user-123',
    diagnostic_type: 'image-analysis',
    image_type: 'x-ray',
    body_part: 'chest',
    ai_model: 'MedVision-X1',
    ai_model_version: '2.3.0',
    confidence_score: 0.92,
    findings: [
      {
        condition: 'pneumonia',
        confidence: 0.87,
        location: 'right lower lobe',
        severity: 'moderate'
      }
    ],
    doctor_verification: {
      verified_by: 'doctor-456',
      verification_time: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      doctor_assessment: 'Agree with AI findings',
      additional_notes: 'Recommend follow-up in 2 weeks'
    },
    blockchain_verification: 'eth-0x4567890123abcdef4567890123abcdef45678901',
    created_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'aid-002',
    patient_id: 'user-789',
    diagnostic_type: 'lab-analysis',
    test_type: 'blood-panel',
    ai_model: 'LabInsight-B2',
    ai_model_version: '1.7.5',
    confidence_score: 0.95,
    findings: [
      {
        marker: 'white blood cell count',
        value: 11500,
        unit: 'cells/μL',
        reference_range: '4500-11000',
        interpretation: 'elevated',
        confidence: 0.98
      },
      {
        marker: 'C-reactive protein',
        value: 15,
        unit: 'mg/L',
        reference_range: '0-10',
        interpretation: 'elevated',
        confidence: 0.96
      }
    ],
    suggested_diagnosis: 'Possible bacterial infection',
    doctor_verification: {
      verified_by: 'doctor-123',
      verification_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      doctor_assessment: 'Agree with AI findings',
      additional_notes: 'Prescribed antibiotics and recommended rest'
    },
    blockchain_verification: 'eth-0x5678901234abcdef5678901234abcdef56789012',
    created_at: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString()
  }
];

let medicalNFTPassports = [
  {
    id: 'mnft-001',
    patient_id: 'user-123',
    blockchain_id: 'eth-0x6789012345abcdef6789012345abcdef67890123',
    token_id: 'token-123456',
    blockchain: 'ethereum',
    status: 'active',
    creation_date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    last_updated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    version: 2,
    access_control: {
      public_info: ['blood_type', 'allergies', 'emergency_contact'],
      private_info: ['medical_history', 'prescriptions', 'genetic_data'],
      emergency_access: true
    },
    verification: {
      issuer: 'National Health Authority',
      issuer_id: 'nha-001',
      verification_date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    },
    public_data: {
      blood_type: 'A+',
      allergies: ['penicillin', 'peanuts'],
      emergency_contact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '+1-555-123-4567'
      }
    }
  },
  {
    id: 'mnft-002',
    patient_id: 'user-789',
    blockchain_id: 'eth-0x7890123456abcdef7890123456abcdef78901234',
    token_id: 'token-789012',
    blockchain: 'ethereum',
    status: 'active',
    creation_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    last_updated: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    version: 1,
    access_control: {
      public_info: ['blood_type', 'allergies', 'emergency_contact'],
      private_info: ['medical_history', 'prescriptions'],
      emergency_access: true
    },
    verification: {
      issuer: 'National Health Authority',
      issuer_id: 'nha-001',
      verification_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      valid_until: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000).toISOString()
    },
    public_data: {
      blood_type: 'O-',
      allergies: ['sulfa drugs'],
      emergency_contact: {
        name: 'John Smith',
        relationship: 'Brother',
        phone: '+1-555-987-6543'
      }
    }
  }
];

router.get('/consultations', authenticateToken, async (req, res) => {
  try {
    logger.info('Fetching all telemedicine consultations');
    
    const { status, patient_id, doctor_id, specialty } = req.query;
    let filteredConsultations = [...telemedConsultations];
    
    if (status) {
      filteredConsultations = filteredConsultations.filter(consultation => consultation.status === status);
    }
    
    if (patient_id) {
      filteredConsultations = filteredConsultations.filter(consultation => consultation.patient_id === patient_id);
    }
    
    if (doctor_id) {
      filteredConsultations = filteredConsultations.filter(consultation => consultation.doctor_id === doctor_id);
    }
    
    if (specialty) {
      filteredConsultations = filteredConsultations.filter(consultation => consultation.specialty === specialty);
    }
    
    if (req.user.role === 'patient') {
      filteredConsultations = filteredConsultations.filter(consultation => consultation.patient_id === req.user.id);
    }
    
    if (req.user.role === 'doctor') {
      filteredConsultations = filteredConsultations.filter(consultation => consultation.doctor_id === req.user.id);
    }
    
    res.status(200).json({
      success: true,
      count: filteredConsultations.length,
      data: filteredConsultations
    });
  } catch (error) {
    logger.error(`Error fetching telemedicine consultations: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching telemedicine consultations'
    });
  }
});

router.get('/consultations/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching telemedicine consultation with ID: ${id}`);
    
    const consultation = telemedConsultations.find(c => c.id === id);
    
    if (!consultation) {
      return res.status(404).json({
        success: false,
        error: 'Telemedicine consultation not found'
      });
    }
    
    if (req.user.role === 'patient' && consultation.patient_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this consultation'
      });
    }
    
    if (req.user.role === 'doctor' && consultation.doctor_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this consultation'
      });
    }
    
    res.status(200).json({
      success: true,
      data: consultation
    });
  } catch (error) {
    logger.error(`Error fetching telemedicine consultation: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching telemedicine consultation'
    });
  }
});

router.post('/consultations', authenticateToken, validateRequest, async (req, res) => {
  try {
    const { doctor_id, specialty, scheduled_time, duration_minutes, symptoms, patient_history_access } = req.body;
    logger.info(`Scheduling new telemedicine consultation with doctor: ${doctor_id}`);
    
    const newConsultation = {
      id: `tc-${uuidv4().substring(0, 8)}`,
      patient_id: req.user.id,
      doctor_id,
      specialty,
      status: 'scheduled',
      scheduled_time,
      duration_minutes: parseInt(duration_minutes),
      symptoms: symptoms || [],
      patient_history_access: patient_history_access || false,
      payment_status: 'pending',
      payment_amount: 0, // Will be set after doctor confirms
      payment_currency: 'USD',
      blockchain_verification: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    telemedConsultations.push(newConsultation);
    
    res.status(201).json({
      success: true,
      data: newConsultation
    });
  } catch (error) {
    logger.error(`Error scheduling telemedicine consultation: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while scheduling telemedicine consultation'
    });
  }
});

router.put('/consultations/:id/status', authenticateToken, validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    logger.info(`Updating status of telemedicine consultation with ID: ${id}`);
    
    const consultationIndex = telemedConsultations.findIndex(c => c.id === id);
    
    if (consultationIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Telemedicine consultation not found'
      });
    }
    
    const consultation = telemedConsultations[consultationIndex];
    
    if (req.user.role === 'patient' && consultation.patient_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this consultation'
      });
    }
    
    if (req.user.role === 'doctor' && consultation.doctor_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this consultation'
      });
    }
    
    telemedConsultations[consultationIndex].status = status;
    telemedConsultations[consultationIndex].updated_at = new Date().toISOString();
    
    if (status === 'completed' && req.user.role === 'doctor') {
      telemedConsultations[consultationIndex].blockchain_verification = `eth-0x${uuidv4().replace(/-/g, '')}`;
    }
    
    res.status(200).json({
      success: true,
      data: telemedConsultations[consultationIndex]
    });
  } catch (error) {
    logger.error(`Error updating telemedicine consultation status: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while updating telemedicine consultation status'
    });
  }
});

router.post('/consultations/:id/diagnosis', authenticateToken, authorizeRole(['doctor']), validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const { diagnosis, prescription, follow_up_recommended, follow_up_days } = req.body;
    logger.info(`Adding diagnosis to telemedicine consultation with ID: ${id}`);
    
    const consultationIndex = telemedConsultations.findIndex(c => c.id === id);
    
    if (consultationIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Telemedicine consultation not found'
      });
    }
    
    const consultation = telemedConsultations[consultationIndex];
    
    if (consultation.doctor_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to add diagnosis to this consultation'
      });
    }
    
    if (consultation.status !== 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Cannot add diagnosis to a consultation that is not completed'
      });
    }
    
    telemedConsultations[consultationIndex].diagnosis = diagnosis;
    telemedConsultations[consultationIndex].prescription = prescription;
    telemedConsultations[consultationIndex].follow_up_recommended = follow_up_recommended || false;
    telemedConsultations[consultationIndex].follow_up_days = follow_up_days || null;
    telemedConsultations[consultationIndex].updated_at = new Date().toISOString();
    
    res.status(200).json({
      success: true,
      data: telemedConsultations[consultationIndex]
    });
  } catch (error) {
    logger.error(`Error adding diagnosis to telemedicine consultation: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while adding diagnosis to telemedicine consultation'
    });
  }
});

router.get('/records', authenticateToken, async (req, res) => {
  try {
    logger.info('Fetching medical records');
    
    let filteredRecords = [];
    
    if (req.user.role === 'patient') {
      filteredRecords = medicalRecords.filter(record => record.patient_id === req.user.id);
    }
    
    else if (req.user.role === 'doctor') {
      filteredRecords = medicalRecords.filter(record => {
        if (record.access_control.authorized_doctors.includes(req.user.id)) {
          return true;
        }
        
        const tempAccess = record.access_control.temporary_access.find(
          access => access.doctor_id === req.user.id && new Date(access.expires_at) > new Date()
        );
        
        return !!tempAccess;
      });
    }
    
    else if (req.user.role === 'admin') {
      filteredRecords = [...medicalRecords];
    }
    
    res.status(200).json({
      success: true,
      count: filteredRecords.length,
      data: filteredRecords
    });
  } catch (error) {
    logger.error(`Error fetching medical records: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching medical records'
    });
  }
});

router.get('/records/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching medical record with ID: ${id}`);
    
    const record = medicalRecords.find(r => r.id === id);
    
    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Medical record not found'
      });
    }
    
    let hasAccess = false;
    
    if (req.user.role === 'patient' && record.patient_id === req.user.id) {
      hasAccess = true;
    }
    
    else if (req.user.role === 'doctor' && record.access_control.authorized_doctors.includes(req.user.id)) {
      hasAccess = true;
    }
    
    else if (req.user.role === 'doctor') {
      const tempAccess = record.access_control.temporary_access.find(
        access => access.doctor_id === req.user.id && new Date(access.expires_at) > new Date()
      );
      
      if (tempAccess) {
        hasAccess = true;
      }
    }
    
    else if (req.user.role === 'admin') {
      hasAccess = true;
    }
    
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this medical record'
      });
    }
    
    const recordIndex = medicalRecords.findIndex(r => r.id === id);
    medicalRecords[recordIndex].metadata.last_accessed = new Date().toISOString();
    
    res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    logger.error(`Error fetching medical record: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching medical record'
    });
  }
});

router.post('/records', authenticateToken, authorizeRole(['doctor', 'admin']), validateRequest, async (req, res) => {
  try {
    const { patient_id, record_type, vital_statistics, immunization_history } = req.body;
    logger.info(`Creating new medical record for patient: ${patient_id}`);
    
    const newRecord = {
      id: `mr-${uuidv4().substring(0, 8)}`,
      patient_id,
      record_type,
      blockchain_id: `eth-0x${uuidv4().replace(/-/g, '')}`,
      is_encrypted: true,
      access_control: {
        owner_access: true,
        authorized_doctors: [req.user.id], // Initially, only the creating doctor has access
        authorized_institutions: [],
        temporary_access: []
      },
      metadata: {
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_accessed: new Date().toISOString(),
        record_format: 'FHIR',
        record_size_kb: req.body.record_size_kb || 0
      },
      vital_statistics,
      immunization_history: immunization_history || []
    };
    
    medicalRecords.push(newRecord);
    
    res.status(201).json({
      success: true,
      data: newRecord
    });
  } catch (error) {
    logger.error(`Error creating medical record: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while creating medical record'
    });
  }
});

router.post('/records/:id/grant-access', authenticateToken, validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const { doctor_id, duration_days, purpose } = req.body;
    logger.info(`Granting temporary access to medical record with ID: ${id}`);
    
    const recordIndex = medicalRecords.findIndex(r => r.id === id);
    
    if (recordIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Medical record not found'
      });
    }
    
    if (req.user.role !== 'admin' && req.user.id !== medicalRecords[recordIndex].patient_id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to grant access to this medical record'
      });
    }
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(duration_days));
    
    const tempAccess = {
      doctor_id,
      granted_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      purpose
    };
    
    medicalRecords[recordIndex].access_control.temporary_access.push(tempAccess);
    medicalRecords[recordIndex].metadata.updated_at = new Date().toISOString();
    
    res.status(200).json({
      success: true,
      data: {
        record_id: id,
        temporary_access: tempAccess
      }
    });
  } catch (error) {
    logger.error(`Error granting temporary access to medical record: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while granting temporary access to medical record'
    });
  }
});

router.get('/ai-diagnostics', authenticateToken, async (req, res) => {
  try {
    logger.info('Fetching AI diagnostics');
    
    let filteredDiagnostics = [];
    
    if (req.user.role === 'patient') {
      filteredDiagnostics = aiDiagnostics.filter(diagnostic => diagnostic.patient_id === req.user.id);
    }
    
    else if (req.user.role === 'doctor') {
      filteredDiagnostics = aiDiagnostics.filter(
        diagnostic => diagnostic.doctor_verification && diagnostic.doctor_verification.verified_by === req.user.id
      );
    }
    
    else if (req.user.role === 'admin') {
      filteredDiagnostics = [...aiDiagnostics];
    }
    
    res.status(200).json({
      success: true,
      count: filteredDiagnostics.length,
      data: filteredDiagnostics
    });
  } catch (error) {
    logger.error(`Error fetching AI diagnostics: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching AI diagnostics'
    });
  }
});

router.get('/ai-diagnostics/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching AI diagnostic with ID: ${id}`);
    
    const diagnostic = aiDiagnostics.find(d => d.id === id);
    
    if (!diagnostic) {
      return res.status(404).json({
        success: false,
        error: 'AI diagnostic not found'
      });
    }
    
    let hasAccess = false;
    
    if (req.user.role === 'patient' && diagnostic.patient_id === req.user.id) {
      hasAccess = true;
    }
    
    else if (req.user.role === 'doctor' && 
             diagnostic.doctor_verification && 
             diagnostic.doctor_verification.verified_by === req.user.id) {
      hasAccess = true;
    }
    
    else if (req.user.role === 'admin') {
      hasAccess = true;
    }
    
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this AI diagnostic'
      });
    }
    
    res.status(200).json({
      success: true,
      data: diagnostic
    });
  } catch (error) {
    logger.error(`Error fetching AI diagnostic: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching AI diagnostic'
    });
  }
});

router.post('/ai-diagnostics', authenticateToken, authorizeRole(['doctor', 'admin']), validateRequest, async (req, res) => {
  try {
    const { patient_id, diagnostic_type, findings, ai_model, ai_model_version, confidence_score } = req.body;
    logger.info(`Creating new AI diagnostic for patient: ${patient_id}`);
    
    const newDiagnostic = {
      id: `aid-${uuidv4().substring(0, 8)}`,
      patient_id,
      diagnostic_type,
      ...req.body, // Include all other fields from request
      ai_model,
      ai_model_version,
      confidence_score: parseFloat(confidence_score),
      findings,
      doctor_verification: {
        verified_by: req.user.id,
        verification_time: new Date().toISOString(),
        doctor_assessment: req.body.doctor_assessment || 'Pending review',
        additional_notes: req.body.additional_notes || ''
      },
      blockchain_verification: `eth-0x${uuidv4().replace(/-/g, '')}`,
      created_at: new Date().toISOString()
    };
    
    aiDiagnostics.push(newDiagnostic);
    
    res.status(201).json({
      success: true,
      data: newDiagnostic
    });
  } catch (error) {
    logger.error(`Error creating AI diagnostic: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while creating AI diagnostic'
    });
  }
});

router.put('/ai-diagnostics/:id/verify', authenticateToken, authorizeRole(['doctor']), validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const { doctor_assessment, additional_notes } = req.body;
    logger.info(`Updating doctor verification for AI diagnostic with ID: ${id}`);
    
    const diagnosticIndex = aiDiagnostics.findIndex(d => d.id === id);
    
    if (diagnosticIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'AI diagnostic not found'
      });
    }
    
    aiDiagnostics[diagnosticIndex].doctor_verification = {
      verified_by: req.user.id,
      verification_time: new Date().toISOString(),
      doctor_assessment,
      additional_notes: additional_notes || ''
    };
    
    res.status(200).json({
      success: true,
      data: aiDiagnostics[diagnosticIndex]
    });
  } catch (error) {
    logger.error(`Error updating doctor verification for AI diagnostic: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while updating doctor verification for AI diagnostic'
    });
  }
});

router.get('/nft-passports', authenticateToken, async (req, res) => {
  try {
    logger.info('Fetching medical NFT passports');
    
    let filteredPassports = [];
    
    if (req.user.role === 'patient') {
      filteredPassports = medicalNFTPassports.filter(passport => passport.patient_id === req.user.id);
    }
    
    else if (req.user.role === 'admin') {
      filteredPassports = [...medicalNFTPassports];
    }
    
    else if (req.user.role === 'doctor') {
      filteredPassports = medicalNFTPassports.map(passport => {
        return {
          id: passport.id,
          patient_id: passport.patient_id,
          blockchain_id: passport.blockchain_id,
          status: passport.status,
          creation_date: passport.creation_date,
          last_updated: passport.last_updated,
          version: passport.version,
          verification: passport.verification,
          public_data: passport.public_data
        };
      });
    }
    
    res.status(200).json({
      success: true,
      count: filteredPassports.length,
      data: filteredPassports
    });
  } catch (error) {
    logger.error(`Error fetching medical NFT passports: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching medical NFT passports'
    });
  }
});

router.get('/nft-passports/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching medical NFT passport with ID: ${id}`);
    
    const passport = medicalNFTPassports.find(p => p.id === id);
    
    if (!passport) {
      return res.status(404).json({
        success: false,
        error: 'Medical NFT passport not found'
      });
    }
    
    let responseData;
    
    if (req.user.role === 'patient' && passport.patient_id === req.user.id) {
      responseData = passport;
    }
    
    else if (req.user.role === 'admin') {
      responseData = passport;
    }
    
    else {
      responseData = {
        id: passport.id,
        patient_id: passport.patient_id,
        blockchain_id: passport.blockchain_id,
        status: passport.status,
        creation_date: passport.creation_date,
        last_updated: passport.last_updated,
        version: passport.version,
        verification: passport.verification,
        public_data: passport.public_data
      };
    }
    
    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    logger.error(`Error fetching medical NFT passport: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching medical NFT passport'
    });
  }
});

router.post('/nft-passports', authenticateToken, validateRequest, async (req, res) => {
  try {
    const { blockchain, access_control, public_data } = req.body;
    logger.info(`Creating new medical NFT passport for patient: ${req.user.id}`);
    
    const existingPassport = medicalNFTPassports.find(p => p.patient_id === req.user.id);
    
    if (existingPassport) {
      return res.status(400).json({
        success: false,
        error: 'Patient already has a medical NFT passport'
      });
    }
    
    const newPassport = {
      id: `mnft-${uuidv4().substring(0, 8)}`,
      patient_id: req.user.id,
      blockchain_id: `eth-0x${uuidv4().replace(/-/g, '')}`,
      token_id: `token-${Math.floor(Math.random() * 1000000)}`,
      blockchain: blockchain || 'ethereum',
      status: 'pending_verification',
      creation_date: new Date().toISOString(),
      last_updated: new Date().toISOString(),
      version: 1,
      access_control: access_control || {
        public_info: ['blood_type', 'allergies', 'emergency_contact'],
        private_info: ['medical_history', 'prescriptions'],
        emergency_access: true
      },
      verification: {
        issuer: null,
        issuer_id: null,
        verification_date: null,
        valid_until: null
      },
      public_data: public_data || {}
    };
    
    medicalNFTPassports.push(newPassport);
    
    res.status(201).json({
      success: true,
      data: newPassport
    });
  } catch (error) {
    logger.error(`Error creating medical NFT passport: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while creating medical NFT passport'
    });
  }
});

router.post('/nft-passports/:id/verify', authenticateToken, authorizeRole(['admin']), validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const { issuer, issuer_id, valid_months } = req.body;
    logger.info(`Verifying medical NFT passport with ID: ${id}`);
    
    const passportIndex = medicalNFTPassports.findIndex(p => p.id === id);
    
    if (passportIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Medical NFT passport not found'
      });
    }
    
    const validUntil = new Date();
    validUntil.setMonth(validUntil.getMonth() + parseInt(valid_months || 12));
    
    medicalNFTPassports[passportIndex].verification = {
      issuer,
      issuer_id,
      verification_date: new Date().toISOString(),
      valid_until: validUntil.toISOString()
    };
    
    medicalNFTPassports[passportIndex].status = 'active';
    medicalNFTPassports[passportIndex].last_updated = new Date().toISOString();
    
    res.status(200).json({
      success: true,
      data: medicalNFTPassports[passportIndex]
    });
  } catch (error) {
    logger.error(`Error verifying medical NFT passport: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while verifying medical NFT passport'
    });
  }
});

router.put('/nft-passports/:id/public-data', authenticateToken, validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const { public_data } = req.body;
    logger.info(`Updating public data in medical NFT passport with ID: ${id}`);
    
    const passportIndex = medicalNFTPassports.findIndex(p => p.id === id);
    
    if (passportIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Medical NFT passport not found'
      });
    }
    
    if (medicalNFTPassports[passportIndex].patient_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this medical NFT passport'
      });
    }
    
    medicalNFTPassports[passportIndex].public_data = {
      ...medicalNFTPassports[passportIndex].public_data,
      ...public_data
    };
    
    medicalNFTPassports[passportIndex].version += 1;
    medicalNFTPassports[passportIndex].last_updated = new Date().toISOString();
    
    res.status(200).json({
      success: true,
      data: medicalNFTPassports[passportIndex]
    });
  } catch (error) {
    logger.error(`Error updating public data in medical NFT passport: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while updating public data in medical NFT passport'
    });
  }
});

module.exports = router;
