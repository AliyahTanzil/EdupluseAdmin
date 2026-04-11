// Grades API Endpoints
// File: backend/routes/grades.js

const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const router = express.Router();

const gradesDB = require('../database/grades');
const { requireRole, requirePermission } = require('../middleware/auth');

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
  requireRole(['admin', 'teacher']),
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
 * GET /api/grades/student/:studentId/report-card
 * Get a full report card for a student with CA1, CA2, Exam breakdown per subject
 */
router.get(
  '/student/:studentId/report-card',
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
      const db = require('../database/local').getDatabase();

      // Get student info
      const student = db.prepare('SELECT * FROM students WHERE id = ? AND is_deleted = 0').get(req.params.studentId);
      if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }

      // Build grades query with subject names — get ALL grade rows (each exam_type is a row)
      let gradesQuery = `
        SELECT g.id, g.student_id, g.subject_id, g.score, g.grade, g.term, 
               g.academic_year, g.exam_type, g.remarks, g.graded_by,
               COALESCE(sub.name, 'Unknown Subject') as subject_name,
               COALESCE(sub.code, '') as subject_code,
               COALESCE(sub.category, 'General') as subject_category
        FROM grades g
        LEFT JOIN subjects sub ON g.subject_id = sub.id
        WHERE g.student_id = ? AND g.is_deleted = 0
      `;
      const params = [req.params.studentId];

      if (term) {
        gradesQuery += ' AND g.term = ?';
        params.push(term);
      }
      if (academic_year) {
        gradesQuery += ' AND g.academic_year = ?';
        params.push(academic_year);
      }

      gradesQuery += ' ORDER BY sub.name ASC, g.exam_type ASC';
      const rawGrades = db.prepare(gradesQuery).all(...params);

      // Pivot grades: group by subject_id, merge CA1/CA2/Exam into one row per subject
      const subjectMap = {};
      rawGrades.forEach(g => {
        const key = g.subject_id;
        if (!subjectMap[key]) {
          subjectMap[key] = {
            subject_id: g.subject_id,
            subject_name: g.subject_name,
            subject_code: g.subject_code,
            subject_category: g.subject_category,
            ca1: null,
            ca2: null,
            exam: null,
            total: 0,
            grade: '',
            remarks: g.remarks || '',
          };
        }
        const entry = subjectMap[key];
        const type = (g.exam_type || '').toLowerCase();
        if (type === 'ca1' || type === 'test') {
          entry.ca1 = g.score;
        } else if (type === 'ca2') {
          entry.ca2 = g.score;
        } else if (type === 'exam' || type === 'final') {
          entry.exam = g.score;
        } else {
          // Default: treat single score as total
          entry.ca1 = null;
          entry.ca2 = null;
          entry.exam = null;
          entry.total = g.score;
          entry.grade = g.grade;
        }
        if (g.remarks) entry.remarks = g.remarks;
      });

      // Calculate totals and grades for each subject
      const grades = Object.values(subjectMap).map(s => {
        if (s.ca1 !== null || s.ca2 !== null || s.exam !== null) {
          s.total = (s.ca1 || 0) + (s.ca2 || 0) + (s.exam || 0);
        }
        // Calculate grade from total
        const t = s.total;
        if (t >= 90) s.grade = 'A';
        else if (t >= 80) s.grade = 'B';
        else if (t >= 70) s.grade = 'C';
        else if (t >= 60) s.grade = 'D';
        else if (t > 0) s.grade = 'F';
        else s.grade = '-';

        // Interpretation
        if (t >= 90) s.interpretation = 'Excellent';
        else if (t >= 80) s.interpretation = 'Very Good';
        else if (t >= 70) s.interpretation = 'Good';
        else if (t >= 60) s.interpretation = 'Satisfactory';
        else if (t >= 50) s.interpretation = 'Fair';
        else if (t > 0) s.interpretation = 'Needs Improvement';
        else s.interpretation = '-';

        return s;
      });

      // Sort by category then name
      grades.sort((a, b) => {
        if (a.subject_category !== b.subject_category) return a.subject_category.localeCompare(b.subject_category);
        return a.subject_name.localeCompare(b.subject_name);
      });

      // Calculate summary statistics
      const subjectCount = grades.length;
      const totalScore = grades.reduce((sum, g) => sum + (g.total || 0), 0);
      const averageScore = subjectCount > 0 ? (totalScore / subjectCount).toFixed(1) : 0;
      const highestScore = subjectCount > 0 ? Math.max(...grades.map(g => g.total || 0)) : 0;
      const lowestScore = subjectCount > 0 ? Math.min(...grades.map(g => g.total || 0)) : 0;

      // Overall grade
      let overallGrade = 'N/A';
      if (subjectCount > 0) {
        const avg = parseFloat(averageScore);
        if (avg >= 90) overallGrade = 'A';
        else if (avg >= 80) overallGrade = 'B';
        else if (avg >= 70) overallGrade = 'C';
        else if (avg >= 60) overallGrade = 'D';
        else overallGrade = 'F';
      }

      // Grade distribution
      const gradeDistribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
      grades.forEach(g => {
        if (g.grade && gradeDistribution.hasOwnProperty(g.grade)) {
          gradeDistribution[g.grade]++;
        }
      });

      // Class position (rank) based on total marks
      let classPosition = null;
      let totalInClass = 0;
      if (subjectCount > 0 && student.class) {
        const termFilter = term ? 'AND g.term = ?' : '';
        const yearFilter = academic_year ? 'AND g.academic_year = ?' : '';
        const rankParams = [student.class];
        if (term) rankParams.push(term);
        if (academic_year) rankParams.push(academic_year);

        const classAverages = db.prepare(`
          SELECT g.student_id, SUM(g.score) as total_score, AVG(g.score) as avg_score
          FROM grades g
          JOIN students s ON g.student_id = s.id
          WHERE s.class = ? AND g.is_deleted = 0 ${termFilter} ${yearFilter}
          GROUP BY g.student_id
          ORDER BY total_score DESC
        `).all(...rankParams);

        totalInClass = classAverages.length;
        const position = classAverages.findIndex(ca => ca.student_id === req.params.studentId);
        classPosition = position >= 0 ? position + 1 : null;
      }

      // Attendance summary
      let attendanceSummary = { totalDays: 0, present: 0, absent: 0, late: 0, attendanceRate: '0%' };
      try {
        const attendance = db.prepare(`
          SELECT 
            COUNT(*) as totalDays,
            SUM(CASE WHEN morning_status = 'present' THEN 1 ELSE 0 END) as present,
            SUM(CASE WHEN morning_status = 'absent' THEN 1 ELSE 0 END) as absent,
            SUM(CASE WHEN morning_status = 'late' THEN 1 ELSE 0 END) as late
          FROM attendance
          WHERE student_id = ? AND is_deleted = 0
        `).get(req.params.studentId);

        if (attendance && attendance.totalDays > 0) {
          attendanceSummary = {
            totalDays: attendance.totalDays,
            present: attendance.present || 0,
            absent: attendance.absent || 0,
            late: attendance.late || 0,
            attendanceRate: ((attendance.present / attendance.totalDays) * 100).toFixed(1) + '%'
          };
        }
      } catch (e) { /* ignore */ }

      // School info
      let schoolInfo = { name: 'EduPlus Academy', motto: 'Excellence in Education', address: '' };
      try {
        const school = db.prepare('SELECT * FROM schools WHERE is_deleted = 0 LIMIT 1').get();
        if (school) {
          schoolInfo = {
            name: school.name || schoolInfo.name,
            motto: school.motto || schoolInfo.motto,
            address: school.address || '',
            phone: school.phone || '',
            email: school.email || '',
            logo_url: school.logo_url || '',
          };
        }
      } catch (e) { /* ignore */ }

      res.json({
        success: true,
        data: {
          school: schoolInfo,
          student: {
            id: student.id,
            name: student.name,
            roll: student.roll,
            class: student.class,
            email: student.email,
            phone: student.phone,
            date_of_birth: student.date_of_birth,
            photo_url: student.photo_url,
            parent_phone: student.parent_phone,
            address: student.address,
            gender: student.gender,
          },
          term: term || '1',
          academic_year: academic_year || '2025/2026',
          grades,
          summary: {
            totalSubjects: subjectCount,
            totalScore,
            maxPossibleScore: subjectCount * 100,
            averageScore: parseFloat(averageScore),
            highestScore,
            lowestScore,
            overallGrade,
            gradeDistribution,
            classPosition,
            totalInClass,
          },
          attendance: attendanceSummary,
          generatedAt: new Date().toISOString()
        }
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
  requireRole(['admin', 'teacher']),
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
  requireRole(['admin', 'teacher']),
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
  requireRole(['admin', 'teacher']),
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
