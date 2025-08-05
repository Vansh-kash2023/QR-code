const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Register faculty
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, department, office_location, phone } = req.body;

    // Validation
    if (!name || !email || !password || !department) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'email', 'password', 'department']
      });
    }

    // Check if email already exists
    const existingFaculty = await db.getFacultyByEmail(email);
    if (existingFaculty) {
      return res.status(409).json({
        error: 'Faculty with this email already exists'
      });
    }

    // Create faculty
    const faculty = await db.createFaculty({
      name,
      email,
      password,
      department,
      office_location,
      phone
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: faculty.id, email: faculty.email },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Faculty registered successfully',
      faculty: {
        id: faculty.id,
        name: faculty.name,
        email: faculty.email,
        department: faculty.department,
        office_location: faculty.office_location,
        phone: faculty.phone
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Failed to register faculty',
      details: error.message
    });
  }
});

// Login faculty
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Get faculty by email
    const faculty = await db.getFacultyByEmail(email);
    if (!faculty) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, faculty.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: faculty.id, email: faculty.email },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      faculty: {
        id: faculty.id,
        name: faculty.name,
        email: faculty.email,
        department: faculty.department,
        office_location: faculty.office_location,
        phone: faculty.phone,
        status: faculty.status,
        status_message: faculty.status_message,
        status_updated_at: faculty.status_updated_at
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Failed to login',
      details: error.message
    });
  }
});

// Get faculty profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const faculty = await db.getFacultyById(req.user.id);
    if (!faculty) {
      return res.status(404).json({
        error: 'Faculty not found'
      });
    }

    res.json({
      faculty: {
        id: faculty.id,
        name: faculty.name,
        email: faculty.email,
        department: faculty.department,
        office_location: faculty.office_location,
        phone: faculty.phone,
        status: faculty.status,
        status_message: faculty.status_message,
        status_updated_at: faculty.status_updated_at
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch profile',
      details: error.message
    });
  }
});

// Get faculty by ID (public endpoint for QR code access)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const faculty = await db.getFacultyById(id);
    
    if (!faculty) {
      return res.status(404).json({
        error: 'Faculty not found'
      });
    }

    // Return public information only
    res.json({
      faculty: {
        id: faculty.id,
        name: faculty.name,
        department: faculty.department,
        office_location: faculty.office_location,
        status: faculty.status,
        status_message: faculty.status_message,
        status_updated_at: faculty.status_updated_at
      }
    });

  } catch (error) {
    console.error('Faculty fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch faculty information',
      details: error.message
    });
  }
});

// Get all faculty (public endpoint)
router.get('/', async (req, res) => {
  try {
    const faculty = await db.getAllFaculty();
    
    // Return public information only
    const publicFaculty = faculty.map(f => ({
      id: f.id,
      name: f.name,
      department: f.department,
      office_location: f.office_location,
      status: f.status,
      status_message: f.status_message,
      status_updated_at: f.status_updated_at
    }));

    res.json({
      faculty: publicFaculty,
      count: publicFaculty.length
    });

  } catch (error) {
    console.error('Faculty list fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch faculty list',
      details: error.message
    });
  }
});

// Get status history
router.get('/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    
    const history = await db.getStatusHistory(id, limit);
    
    res.json({
      history,
      count: history.length
    });

  } catch (error) {
    console.error('Status history fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch status history',
      details: error.message
    });
  }
});

module.exports = router;
