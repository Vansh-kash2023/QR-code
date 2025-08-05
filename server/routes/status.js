const express = require('express');
const db = require('../models/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Status constants for binary encoding
const STATUS_CODES = {
  AVAILABLE: 0,    // Binary: 00
  BUSY: 1,         // Binary: 01
  AWAY: 2,         // Binary: 10
  OFFLINE: 3       // Binary: 11
};

const STATUS_NAMES = {
  0: 'Available',
  1: 'Busy',
  2: 'Away',
  3: 'Offline'
};

const STATUS_COLORS = {
  0: '#4CAF50',  // Green
  1: '#F44336',  // Red
  2: '#FF9800',  // Orange
  3: '#9E9E9E'   // Gray
};

// Get faculty status by ID (public endpoint)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const status = await db.getFacultyStatus(id);
    
    if (!status) {
      return res.status(404).json({
        error: 'Faculty not found'
      });
    }

    // Convert binary status to readable format
    const binaryStatus = status.status.toString(2).padStart(2, '0');
    
    res.json({
      facultyId: status.faculty_id,
      faculty: {
        name: status.name,
        department: status.department,
        office_location: status.office_location
      },
      status: {
        code: status.status,
        binary: binaryStatus,
        name: STATUS_NAMES[status.status],
        color: STATUS_COLORS[status.status],
        message: status.message,
        updated_at: status.updated_at
      }
    });

  } catch (error) {
    console.error('Status fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch status',
      details: error.message
    });
  }
});

// Update faculty status (authenticated endpoint)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, message } = req.body;

    // Verify faculty ownership
    if (parseInt(id) !== req.user.id) {
      return res.status(403).json({
        error: 'Unauthorized to update this faculty status'
      });
    }

    // Validate status code
    if (typeof status !== 'number' || status < 0 || status > 3) {
      return res.status(400).json({
        error: 'Invalid status code',
        validCodes: STATUS_CODES
      });
    }

    // Update status
    const updatedStatus = await db.updateFacultyStatus(id, status, message);
    
    // Emit real-time update via socket.io
    const { io } = require('../index');
    if (io) {
      io.emit('faculty_status_update', {
        facultyId: id,
        status: {
          code: status,
          binary: status.toString(2).padStart(2, '0'),
          name: STATUS_NAMES[status],
          color: STATUS_COLORS[status],
          message,
          updated_at: updatedStatus.timestamp
        }
      });
    }

    res.json({
      message: 'Status updated successfully',
      status: {
        code: status,
        binary: status.toString(2).padStart(2, '0'),
        name: STATUS_NAMES[status],
        color: STATUS_COLORS[status],
        message,
        updated_at: updatedStatus.timestamp
      }
    });

  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({
      error: 'Failed to update status',
      details: error.message
    });
  }
});

// Get all status codes (helper endpoint)
router.get('/codes/all', (req, res) => {
  res.json({
    statusCodes: STATUS_CODES,
    statusNames: STATUS_NAMES,
    statusColors: STATUS_COLORS,
    binaryEncoding: {
      '00': 'Available',
      '01': 'Busy',
      '10': 'Away',
      '11': 'Offline'
    }
  });
});

// Bulk status update (for testing/admin purposes)
router.post('/bulk-update', authenticateToken, async (req, res) => {
  try {
    const { updates } = req.body; // Array of {facultyId, status, message}
    
    if (!Array.isArray(updates)) {
      return res.status(400).json({
        error: 'Updates must be an array'
      });
    }

    const results = [];
    const { io } = require('../index');

    for (const update of updates) {
      const { facultyId, status, message } = update;
      
      // Validate status
      if (typeof status !== 'number' || status < 0 || status > 3) {
        results.push({
          facultyId,
          success: false,
          error: 'Invalid status code'
        });
        continue;
      }

      try {
        const updatedStatus = await db.updateFacultyStatus(facultyId, status, message);
        
        // Emit real-time update
        if (io) {
          io.emit('faculty_status_update', {
            facultyId,
            status: {
              code: status,
              binary: status.toString(2).padStart(2, '0'),
              name: STATUS_NAMES[status],
              color: STATUS_COLORS[status],
              message,
              updated_at: updatedStatus.timestamp
            }
          });
        }

        results.push({
          facultyId,
          success: true,
          status: {
            code: status,
            name: STATUS_NAMES[status],
            message,
            updated_at: updatedStatus.timestamp
          }
        });

      } catch (error) {
        results.push({
          facultyId,
          success: false,
          error: error.message
        });
      }
    }

    res.json({
      message: 'Bulk update completed',
      results,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    });

  } catch (error) {
    console.error('Bulk status update error:', error);
    res.status(500).json({
      error: 'Failed to perform bulk update',
      details: error.message
    });
  }
});

module.exports = router;
