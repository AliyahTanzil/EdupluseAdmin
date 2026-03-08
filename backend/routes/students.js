const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { 
  getStudent, 
  getAllStudents, 
  insertStudent, 
  updateStudent, 
  deleteStudent 
} = require('../database/local');
const SyncService = require('../services/syncService');

// Get all students
router.get('/', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const students = getAllStudents(limit, offset);

    res.json({
      success: true,
      data: students,
      pagination: {
        limit,
        offset,
        total: students.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single student
router.get('/:id', (req, res) => {
  try {
    const student = getStudent(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
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
router.post('/', (req, res) => {
  try {
    const studentId = uuidv4();
    const { name, roll, class: studentClass, email, phone, parent_phone, address, date_of_birth, photo_url } = req.body;

    if (!name || !roll || !studentClass) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, roll, class'
      });
    }

    const student = {
      id: studentId,
      name,
      roll,
      class: studentClass,
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
router.put('/:id', (req, res) => {
  try {
    const student = getStudent(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const updates = {
      name: req.body.name || student.name,
      email: req.body.email || student.email,
      phone: req.body.phone || student.phone,
      parent_phone: req.body.parent_phone || student.parent_phone,
      address: req.body.address || student.address,
      date_of_birth: req.body.date_of_birth || student.date_of_birth,
      photo_url: req.body.photo_url || student.photo_url
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
router.delete('/:id', (req, res) => {
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
