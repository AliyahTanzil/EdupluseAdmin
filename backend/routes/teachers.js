const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database/local');
const syncService = require('../services/syncService');

// Get all teachers with optional filtering by subject
router.get('/', (req, res) => {
  try {
    const { subject_id, class_filter, limit = 50, offset = 0 } = req.query;
    
    const database = db.getDatabase();
    let query = 'SELECT * FROM teachers WHERE is_deleted = 0';
    const params = [];

    if (subject_id) {
      query += ' AND subject_id = ?';
      params.push(subject_id);
    }

    if (class_filter) {
      query += ' AND classes_assigned LIKE ?';
      params.push(`%${class_filter}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const teachers = database.prepare(query).all(...params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as count FROM teachers WHERE is_deleted = 0';
    const countParams = [];
    if (subject_id) {
      countQuery += ' AND subject_id = ?';
      countParams.push(subject_id);
    }
    if (class_filter) {
      countQuery += ' AND classes_assigned LIKE ?';
      countParams.push(`%${class_filter}%`);
    }

    const { count } = database.prepare(countQuery).get(...countParams);

    res.status(200).json({
      success: true,
      data: teachers,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ success: false, message: 'Error fetching teachers' });
  }
});

// Get single teacher by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const teacher = db.getTeacher(id);

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ success: false, message: 'Error fetching teacher' });
  }
});

// Create new teacher
router.post('/', (req, res) => {
  try {
    const { name, email, phone, subject_id, qualification, experience, classes_assigned, hire_date, status } = req.body;

    // Validation
    if (!name || !email || !phone || !subject_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: name, email, phone, subject_id' 
      });
    }

    const id = uuidv4();
    const now = new Date().toISOString();

    const newTeacher = {
      id,
      name,
      email,
      phone,
      subject_id,
      qualification: qualification || '',
      experience: experience || 0,
      classes_assigned: classes_assigned || '',
      hire_date: hire_date || now,
      status: status || 'active',
      created_at: now,
      updated_at: now,
      synced_at: null,
      is_deleted: 0
    };

    db.insertTeacher(newTeacher);

    // Add to sync queue
    syncService.addToSyncQueue('teachers', 'INSERT', id);

    res.status(201).json({
      success: true,
      data: newTeacher,
      message: 'Teacher created successfully'
    });
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(500).json({ success: false, message: 'Error creating teacher' });
  }
});

// Update teacher
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, subject_id, qualification, experience, classes_assigned, hire_date, status } = req.body;

    const existing = db.getTeacher(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    const now = new Date().toISOString();

    const updated = {
      ...existing,
      name: name !== undefined ? name : existing.name,
      email: email !== undefined ? email : existing.email,
      phone: phone !== undefined ? phone : existing.phone,
      subject_id: subject_id !== undefined ? subject_id : existing.subject_id,
      qualification: qualification !== undefined ? qualification : existing.qualification,
      experience: experience !== undefined ? experience : existing.experience,
      classes_assigned: classes_assigned !== undefined ? classes_assigned : existing.classes_assigned,
      hire_date: hire_date !== undefined ? hire_date : existing.hire_date,
      status: status !== undefined ? status : existing.status,
      updated_at: now,
      synced_at: null
    };

    db.updateTeacher(id, updated);

    // Add to sync queue
    syncService.addToSyncQueue('teachers', 'UPDATE', id);

    res.status(200).json({
      success: true,
      data: updated,
      message: 'Teacher updated successfully'
    });
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ success: false, message: 'Error updating teacher' });
  }
});

// Delete teacher (soft delete)
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const existing = db.getTeacher(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    db.deleteTeacher(id);

    // Add to sync queue
    syncService.addToSyncQueue('teachers', 'DELETE', id);

    res.status(200).json({
      success: true,
      message: 'Teacher deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ success: false, message: 'Error deleting teacher' });
  }
});

module.exports = router;
