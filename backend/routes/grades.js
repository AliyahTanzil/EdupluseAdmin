// Grades API Endpoints
// File: backend/routes/grades.js

const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const router = express.Router();

const gradesDB = require('../database/grades');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { requirePermission } = require('../middleware/auth');

/**
 * Error handler middleware
 */
const handleErrors = (err, req, res, next) => {
  console.error('Grade Error:', err);
  
  if (err.message.includes('not found')) {
    return res.status(404).json({
      success: false,
      message: err.message
    });
  }
  
  if (err.message.includes('required') || err.message.includes('must')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  res.status(500).json({
    success: false,
    message: 'An error occurred while processing grades',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

/**
 * GET /api/grades
 * Get all grades (with optional filters)
 */
router.get(
  '/',
  authenticateToken,
  (req, res, next) => {
    try {
      const db = require('../database/local').getDatabase();
      const { term, academic_year, student_id, class_id, subject_id } = req.query;
      let sql = 'SELECT * FROM grades WHERE 1=1';
      const params = [];
      if (term) { sql += ' AND term = ?'; params.push(term); }
      if (academic_year) { sql += ' AND academic_year = ?'; params.push(academic_year); }
      if (student_id) { sql += ' AND student_id = ?'; params.push(student_id); }
      if (subject_id) { sql += ' AND subject_id = ?'; params.push(subject_id); }
      sql += ' ORDER BY created_at DESC';
      const grades = db.prepare(sql).all(...params);
      res.json({ success: true, data: grades, total: grades.length });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/grades
 * Create a new grade record
 */
router.post(
  '/',
  authenticateToken,
  authorizeRole(['ADMIN', 'TEACHER']),
  requirePermission('create_grades'),
  [
    body('student_id').notEmpty().withMessage('student_id is required'),
    body('subject_id').notEmpty().withMessage('subject_id is required'),
    body('score').isFloat({ min: 0, max: 100 }).withMessage('Score must be between 0 and 100'),
    body('term').notEmpty().withMessage('term is required'),
    body('academic_year').notEmpty().withMessage('academic_year is required')
  ],
  (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const grade = gradesDB.insertGrade(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Grade created successfully',
        data: grade
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/grades/:id
 * Get a single grade record
 */
router.get(
  '/:id',
  authenticateToken,
  [param('id').notEmpty().withMessage('ID is required')],
  (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const grade = gradesDB.getGrade(req.params.id);
      
      res.json({
        success: true,
        data: grade
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/grades/student/:studentId
 * Get all grades for a student
 */
router.get(
  '/student/:studentId',
  authenticateToken,
  [param('studentId').notEmpty().withMessage('studentId is required')],
  (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { term, academic_year } = req.query;
      const grades = gradesDB.getStudentGrades(req.params.studentId, term, academic_year);
      
      res.json({
        success: true,
        count: grades.length,
        data: grades
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/grades/class/:classId
 * Get all grades for a class
 */
router.get(
  '/class/:classId',
  authenticateToken,
  authorizeRole(['ADMIN', 'TEACHER']),
  [param('classId').notEmpty().withMessage('classId is required')],
  (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { subject_id, term } = req.query;
      const grades = gradesDB.getClassGrades(req.params.classId, subject_id, term);
      
      res.json({
        success: true,
        count: grades.length,
        data: grades
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /api/grades/:id
 * Update a grade record
 */
router.put(
  '/:id',
  authenticateToken,
  authorizeRole(['ADMIN', 'TEACHER']),
  [
    param('id').notEmpty().withMessage('ID is required'),
    body('score').optional().isFloat({ min: 0, max: 100 }).withMessage('Score must be between 0 and 100')
  ],
  (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const grade = gradesDB.updateGrade(req.params.id, req.body);
      
      res.json({
        success: true,
        message: 'Grade updated successfully',
        data: grade
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/grades/:id
 * Delete a grade record
 */
router.delete(
  '/:id',
  authenticateToken,
  authorizeRole(['ADMIN', 'TEACHER']),
  [param('id').notEmpty().withMessage('ID is required')],
  (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const result = gradesDB.deleteGrade(req.params.id);
      
      res.json({
        success: true,
        message: 'Grade deleted successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/grades/analytics/gpa/:studentId
 * Calculate GPA for a student
 */
router.get(
  '/analytics/gpa/:studentId',
  authenticateToken,
  [param('studentId').notEmpty().withMessage('studentId is required')],
  (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { term, academic_year } = req.query;
      const gpa = gradesDB.calculateStudentGPA(req.params.studentId, term, academic_year);
      
      res.json({
        success: true,
        data: gpa
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/grades/analytics/class-average/:subjectId/:classId
 * Get class average for a subject
 */
router.get(
  '/analytics/class-average/:subjectId/:classId',
  authenticateToken,
  [
    param('subjectId').notEmpty().withMessage('subjectId is required'),
    param('classId').notEmpty().withMessage('classId is required')
  ],
  (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { term } = req.query;
      const average = gradesDB.getSubjectClassAverage(req.params.subjectId, req.params.classId, term);
      
      res.json({
        success: true,
        data: average
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/grades/analytics/distribution/:subjectId
 * Get grade distribution for a subject
 */
router.get(
  '/analytics/distribution/:subjectId',
  authenticateToken,
  [param('subjectId').notEmpty().withMessage('subjectId is required')],
  (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { class_id, term } = req.query;
      const distribution = gradesDB.getGradeDistribution(req.params.subjectId, class_id, term);
      
      res.json({
        success: true,
        data: distribution
      });
    } catch (error) {
      next(error);
    }
  }
);

// Error handling middleware
router.use(handleErrors);

module.exports = router;
