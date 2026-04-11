const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database/local');
const syncService = require('../services/syncService');
const { requireRole } = require('../middleware/auth');

// Get all subjects
router.get('/', (req, res) => {
  try {
    const { category, limit = 100, offset = 0 } = req.query;

    const database = db.getDatabase();
    let query = 'SELECT * FROM subjects WHERE is_deleted = 0';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY name LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const subjects = database.prepare(query).all(...params);

    // Get count
    let countQuery = 'SELECT COUNT(*) as count FROM subjects WHERE is_deleted = 0';
    const countParams = [];
    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }

    const { count } = database.prepare(countQuery).get(...countParams);

    res.status(200).json({
      success: true,
      data: subjects,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ success: false, message: 'Error fetching subjects' });
  }
});

// Get single subject
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const subject = db.getSubject(id);

    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    console.error('Error fetching subject:', error);
    res.status(500).json({ success: false, message: 'Error fetching subject' });
  }
});

// Create new subject
router.post('/', requireRole(['admin']), (req, res) => {
  try {
    const { name, code, description, credit_hours, category, class_name, teacher_id, status } = req.body;

    console.log('Creating subject with:', { name, code, class_name, credit_hours, category, description, teacher_id, status });

    // Validation
    if (!name || !code || !class_name) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, code, class_name'
      });
    }

    const id = uuidv4();
    const now = new Date().toISOString();

    const newSubject = {
      id,
      name,
      code,
      class: class_name,
      description: description || '',
      credit_hours: credit_hours || 0,
      category: category || 'Academic',
      teacher_id: teacher_id || null,
      status: status || 'active',
      created_at: now,
      updated_at: now,
      synced_at: null,
      is_deleted: 0
    };

    db.insertSubject(newSubject);
    syncService.addToSyncQueue('subjects', 'INSERT', id);

    res.status(201).json({
      success: true,
      data: newSubject,
      message: 'Subject created successfully'
    });
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({ success: false, message: error.message || 'Error creating subject' });
  }
});

// Update subject
router.put('/:id', requireRole(['admin']), (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description, credit_hours, category, class_name, teacher_id, status } = req.body;

    const existing = db.getSubject(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    const now = new Date().toISOString();

    const updates = {
      name: name || existing.name,
      code: code || existing.code,
      class: class_name || existing.class,
      description: description !== undefined ? description : existing.description,
      credit_hours: credit_hours !== undefined ? credit_hours : existing.credit_hours,
      category: category || existing.category,
      teacher_id: teacher_id !== undefined ? teacher_id : existing.teacher_id,
      status: status !== undefined ? status : existing.status,
      updated_at: now,
      synced_at: null
    };

    db.updateSubject(id, updates);
    syncService.addToSyncQueue('subjects', 'UPDATE', id);

    res.status(200).json({
      success: true,
      data: { id, ...updates },
      message: 'Subject updated successfully'
    });
  } catch (error) {
    console.error('Error updating subject:', error);
    res.status(500).json({ success: false, message: 'Error updating subject' });
  }
});

// Delete subject
router.delete('/:id', requireRole(['admin']), (req, res) => {
  try {
    const { id } = req.params;

    const existing = db.getSubject(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    db.deleteSubject(id);
    syncService.addToSyncQueue('subjects', 'DELETE', id);

    res.status(200).json({
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({ success: false, message: 'Error deleting subject' });
  }
});

module.exports = router;
