const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { 
  getStudent, 
  getAllStudents, 
  insertStudent, 
  updateStudent, 
  deleteStudent,
  getDatabase
} = require('../database/local');
const SyncService = require('../services/syncService');
const { requirePermission, requireSchoolFilter } = require('../middleware/permissions');

// Get all students with filtering and search
router.get('/', requireSchoolFilter, (req, res) => {
  try {
    const { 
      class: className, 
      roll, 
      search, 
      limit = 100, 
      offset = 0,
      school_id: requestedSchoolId 
    } = req.query;
    
    const schoolFilter = req.schoolFilter; // Array of allowed school IDs from middleware
    const db = getDatabase();

    let query = 'SELECT * FROM students WHERE is_deleted = 0';
    let countQuery = 'SELECT COUNT(*) as total FROM students WHERE is_deleted = 0';
    const params = [];
    const countParams = [];

    // Apply school filtering
    if (requestedSchoolId) {
      // Check if user has access to requested school
      if (schoolFilter && !schoolFilter.includes(requestedSchoolId) && !req.user.isSuperUser && req.user.adminType !== 'ceo') {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You do not have access to this school'
        });
      }
      query += ' AND school_id = ?';
      countQuery += ' AND school_id = ?';
      params.push(requestedSchoolId);
      countParams.push(requestedSchoolId);
    } else if (schoolFilter && Array.isArray(schoolFilter) && schoolFilter.length > 0) {
      const placeholders = schoolFilter.map(() => '?').join(',');
      query += ` AND school_id IN (${placeholders})`;
      countQuery += ` AND school_id IN (${placeholders})`;
      params.push(...schoolFilter);
      countParams.push(...schoolFilter);
    }

    // Apply class filtering
    if (className) {
      query += ' AND class = ?';
      countQuery += ' AND class = ?';
      params.push(className);
      countParams.push(className);
    }

    // Apply roll filtering
    if (roll) {
      query += ' AND roll = ?';
      countQuery += ' AND roll = ?';
      params.push(roll);
      countParams.push(roll);
    }

    // Apply search (name or email)
    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR roll LIKE ?)';
      countQuery += ' AND (name LIKE ? OR email LIKE ? OR roll LIKE ?)';
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
      countParams.push(searchParam, searchParam, searchParam);
    }

    // Add pagination
    query += ' ORDER BY name ASC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const students = db.prepare(query).all(...params);
    const totalCount = db.prepare(countQuery).get(...countParams).total;

    res.json({
      success: true,
      data: students,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: totalCount
      }
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single student
router.get('/:id', requireSchoolFilter, (req, res) => {
  try {
    const student = getStudent(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Security check: Ensure student belongs to user's assigned schools
    const schoolFilter = req.schoolFilter;
    if (schoolFilter && !schoolFilter.includes(student.school_id) && !req.user.isSuperUser && req.user.adminType !== 'ceo') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have access to this student data'
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create new student
router.post('/', requirePermission('manage_students'), requireSchoolFilter, (req, res) => {
  try {
    const studentId = uuidv4();
    const { name, roll, class: studentClass, school_id, email, phone, parent_phone, address, date_of_birth, photo_url } = req.body;

    if (!name || !roll || !studentClass) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, roll, class'
      });
    }

    // Enforce school_id from middleware if not provided or to override
    const finalSchoolId = school_id || (req.schoolFilter?.[0]);

    if (!finalSchoolId) {
       return res.status(400).json({
        success: false,
        message: 'School ID is required'
      });
    }

    const student = {
      id: studentId,
      name,
      roll,
      class: studentClass,
      school_id: finalSchoolId,
      email,
      phone,
      parent_phone,
      address,
      date_of_birth,
      photo_url
    };

    insertStudent(student);
    
    // Add to sync queue
    SyncService.addToSyncQueue('students', 'INSERT', studentId);

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: { id: studentId, ...student }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update student
router.put('/:id', requirePermission('manage_students'), (req, res) => {
  try {
    const student = getStudent(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // B-14 fix: Use !== undefined pattern so fields can be cleared to empty
    const updates = {
      name: req.body.name !== undefined ? req.body.name : student.name,
      roll: req.body.roll !== undefined ? req.body.roll : student.roll,
      class: req.body.class !== undefined ? req.body.class : student.class,
      email: req.body.email !== undefined ? req.body.email : student.email,
      phone: req.body.phone !== undefined ? req.body.phone : student.phone,
      parent_phone: req.body.parent_phone !== undefined ? req.body.parent_phone : student.parent_phone,
      address: req.body.address !== undefined ? req.body.address : student.address,
      date_of_birth: req.body.date_of_birth !== undefined ? req.body.date_of_birth : student.date_of_birth,
      photo_url: req.body.photo_url !== undefined ? req.body.photo_url : student.photo_url
    };

    updateStudent(req.params.id, updates);

    // Add to sync queue
    SyncService.addToSyncQueue('students', 'UPDATE', req.params.id);

    res.json({
      success: true,
      message: 'Student updated successfully',
      data: { id: req.params.id, ...student, ...updates }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete student
router.delete('/:id', requirePermission('manage_students'), (req, res) => {
  try {
    const student = getStudent(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    deleteStudent(req.params.id);

    // Add to sync queue
    SyncService.addToSyncQueue('students', 'DELETE', req.params.id);

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
