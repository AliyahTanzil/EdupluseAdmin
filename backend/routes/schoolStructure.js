const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/rbac');
const schoolStructure = require('../config/schoolStructure');

/**
 * School Structure API Routes
 * Provides endpoints for accessing the school hierarchy
 */

// ============ SCHOOL LEVELS ============

/**
 * GET /api/school-structure/levels
 * Get all available school levels
 */
router.get('/levels', (req, res) => {
  try {
    const levels = schoolStructure.getSchoolLevels();
    res.json({
      success: true,
      data: levels
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ============ SECTIONS ============

/**
 * GET /api/school-structure/sections/:schoolLevel
 * Get sections for a specific school level
 */
router.get('/sections/:schoolLevel', (req, res) => {
  try {
    const { schoolLevel } = req.params;
    const sections = schoolStructure.getSectionsForLevel(schoolLevel);

    if (!sections) {
      return res.status(400).json({
        success: false,
        message: `Invalid school level: ${schoolLevel}`
      });
    }

    res.json({
      success: true,
      data: sections,
      schoolLevel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ============ CLASSES ============

/**
 * GET /api/school-structure/classes/:schoolLevel/:section
 * Get classes for a specific section
 */
router.get('/classes/:schoolLevel/:section', (req, res) => {
  try {
    const { schoolLevel, section } = req.params;
    const classes = schoolStructure.getClassesForSection(schoolLevel, section);

    if (!classes || classes.length === 0) {
      return res.status(400).json({
        success: false,
        message: `No classes found for section: ${section}`
      });
    }

    res.json({
      success: true,
      data: classes,
      schoolLevel,
      section
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ============ STREAMS ============

/**
 * GET /api/school-structure/streams/:schoolLevel/:section
 * Get streams for a specific section (if applicable)
 */
router.get('/streams/:schoolLevel/:section', (req, res) => {
  try {
    const { schoolLevel, section } = req.params;
    const streams = schoolStructure.getStreamsForSection(schoolLevel, section);

    res.json({
      success: true,
      data: streams,
      schoolLevel,
      section,
      requiresStream: streams.length > 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ============ SUBJECTS ============

/**
 * GET /api/school-structure/subjects/:schoolLevel/:section/:stream?
 * Get subjects for a specific class/stream
 */
router.get('/subjects/:schoolLevel/:section/:className', (req, res) => {
  try {
    const { schoolLevel, section, className } = req.params;
    const stream = req.query.stream || null;

    const subjects = schoolStructure.getSubjectsForClass(
      schoolLevel,
      section,
      className,
      stream
    );

    if (!subjects || subjects.length === 0) {
      return res.status(400).json({
        success: false,
        message: `No subjects found for class: ${className}`
      });
    }

    res.json({
      success: true,
      data: subjects,
      schoolLevel,
      section,
      className,
      stream: stream || null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ============ CLASS VALIDATION ============

/**
 * POST /api/school-structure/validate-assignment
 * Validate if a student/teacher can be assigned to a class
 */
router.post('/validate-assignment', (req, res) => {
  try {
    const { schoolLevel, section, className, stream } = req.body;

    if (!schoolLevel || !section || !className) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: schoolLevel, section, className'
      });
    }

    const isValid = schoolStructure.isValidClassAssignment(
      schoolLevel,
      section,
      className,
      stream
    );

    res.json({
      success: true,
      isValid,
      schoolLevel,
      section,
      className,
      stream: stream || null,
      message: isValid 
        ? 'Assignment is valid'
        : 'Invalid class assignment'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ============ FULL STRUCTURE ============

/**
 * GET /api/school-structure/full
 * Get the complete school structure
 */
router.get('/full', (req, res) => {
  try {
    res.json({
      success: true,
      data: schoolStructure.SCHOOL_STRUCTURE
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ============ SUMMARY ============

/**
 * GET /api/school-structure/summary
 * Get a summary of the school structure
 */
router.get('/summary', (req, res) => {
  try {
    const levels = schoolStructure.getSchoolLevels();
    const summary = {
      totalLevels: levels.length,
      levels: levels.map(level => ({
        id: level.id,
        name: level.name,
        sections: schoolStructure.getSectionsForLevel(level.id).length
      }))
    };

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
