const express = require('express');
const QRCode = require('qrcode');
const db = require('../models/database');

const router = express.Router();

// Generate QR code for faculty
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { format = 'png', size = 200 } = req.query;

    // Verify faculty exists
    const faculty = await db.getFacultyById(id);
    if (!faculty) {
      return res.status(404).json({
        error: 'Faculty not found'
      });
    }

    // Create QR code data (URL to check faculty status)
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const qrData = `${baseUrl}/check/${id}`;

    // Generate QR code based on format
    if (format === 'svg') {
      const qrSvg = await QRCode.toString(qrData, {
        type: 'svg',
        width: parseInt(size),
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(qrSvg);

    } else if (format === 'png' || format === 'jpg') {
      const qrBuffer = await QRCode.toBuffer(qrData, {
        type: 'png',
        width: parseInt(size),
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      res.setHeader('Content-Type', `image/${format === 'jpg' ? 'jpeg' : 'png'}`);
      res.send(qrBuffer);

    } else if (format === 'data') {
      // Return QR code as data URL
      const qrDataUrl = await QRCode.toDataURL(qrData, {
        width: parseInt(size),
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      res.json({
        facultyId: id,
        faculty: {
          name: faculty.name,
          department: faculty.department
        },
        qrCode: {
          data: qrData,
          dataUrl: qrDataUrl,
          size: parseInt(size)
        }
      });

    } else {
      return res.status(400).json({
        error: 'Invalid format',
        supportedFormats: ['png', 'svg', 'jpg', 'data']
      });
    }

  } catch (error) {
    console.error('QR generation error:', error);
    res.status(500).json({
      error: 'Failed to generate QR code',
      details: error.message
    });
  }
});

// Generate QR code with custom styling and branding
router.get('/:id/branded', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      size = 300, 
      darkColor = '#1976D2', 
      lightColor = '#FFFFFF',
      includeText = 'true',
      format = 'png'
    } = req.query;

    // Verify faculty exists
    const faculty = await db.getFacultyById(id);
    if (!faculty) {
      return res.status(404).json({
        error: 'Faculty not found'
      });
    }

    const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const qrData = `${baseUrl}/check/${id}`;

    if (format === 'data') {
      const qrDataUrl = await QRCode.toDataURL(qrData, {
        width: parseInt(size),
        margin: 3,
        color: {
          dark: darkColor,
          light: lightColor
        },
        errorCorrectionLevel: 'M'
      });

      res.json({
        facultyId: id,
        faculty: {
          name: faculty.name,
          department: faculty.department,
          office_location: faculty.office_location
        },
        qrCode: {
          data: qrData,
          dataUrl: qrDataUrl,
          size: parseInt(size),
          colors: {
            dark: darkColor,
            light: lightColor
          }
        },
        instructions: 'Scan this QR code to check faculty availability status',
        timestamp: new Date().toISOString()
      });

    } else {
      const qrBuffer = await QRCode.toBuffer(qrData, {
        type: 'png',
        width: parseInt(size),
        margin: 3,
        color: {
          dark: darkColor,
          light: lightColor
        },
        errorCorrectionLevel: 'M'
      });

      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', `inline; filename="faculty_${id}_qr.png"`);
      res.send(qrBuffer);
    }

  } catch (error) {
    console.error('Branded QR generation error:', error);
    res.status(500).json({
      error: 'Failed to generate branded QR code',
      details: error.message
    });
  }
});

// Batch generate QR codes for multiple faculty
router.post('/batch', async (req, res) => {
  try {
    const { facultyIds, format = 'data', size = 200 } = req.body;

    if (!Array.isArray(facultyIds) || facultyIds.length === 0) {
      return res.status(400).json({
        error: 'Faculty IDs must be provided as a non-empty array'
      });
    }

    const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const results = [];

    for (const id of facultyIds) {
      try {
        const faculty = await db.getFacultyById(id);
        if (!faculty) {
          results.push({
            facultyId: id,
            success: false,
            error: 'Faculty not found'
          });
          continue;
        }

        const qrData = `${baseUrl}/check/${id}`;
        const qrDataUrl = await QRCode.toDataURL(qrData, {
          width: parseInt(size),
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });

        results.push({
          facultyId: id,
          success: true,
          faculty: {
            name: faculty.name,
            department: faculty.department
          },
          qrCode: {
            data: qrData,
            dataUrl: qrDataUrl,
            size: parseInt(size)
          }
        });

      } catch (error) {
        results.push({
          facultyId: id,
          success: false,
          error: error.message
        });
      }
    }

    res.json({
      message: 'Batch QR generation completed',
      results,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Batch QR generation error:', error);
    res.status(500).json({
      error: 'Failed to generate batch QR codes',
      details: error.message
    });
  }
});

// Get QR code information without generating image
router.get('/:id/info', async (req, res) => {
  try {
    const { id } = req.params;

    // Verify faculty exists
    const faculty = await db.getFacultyById(id);
    if (!faculty) {
      return res.status(404).json({
        error: 'Faculty not found'
      });
    }

    const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const qrData = `${baseUrl}/check/${id}`;

    res.json({
      facultyId: id,
      faculty: {
        name: faculty.name,
        department: faculty.department,
        office_location: faculty.office_location
      },
      qrCode: {
        data: qrData,
        url: `${req.protocol}://${req.get('host')}/api/qr/${id}`,
        formats: ['png', 'svg', 'jpg', 'data'],
        sizesAvailable: [100, 150, 200, 250, 300, 400, 500]
      },
      currentStatus: {
        code: faculty.status,
        name: faculty.status_message,
        updated_at: faculty.status_updated_at
      }
    });

  } catch (error) {
    console.error('QR info error:', error);
    res.status(500).json({
      error: 'Failed to get QR code information',
      details: error.message
    });
  }
});

module.exports = router;
