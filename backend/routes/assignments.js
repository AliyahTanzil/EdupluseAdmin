const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../database/local');
const { requireRole } = require('../middleware/auth');

/**
 * GET /api/assignments
 * Get all assignments
 */
router.get('/', (req, res) => {
  try {
    const db = getDatabase();
    const { class_id, subject_id, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM assignments WHERE is_deleted = 0';
    const params = [];
    
    if (class_id) {
      query += ' AND class_id = ?';
      params.push(class_id);
    }
    if (subject_id) {
      query += ' AND subject_id = ?';
      params.push(subject_id);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const assignments = db.prepare(query).all(...params);
    const total = db.prepare('SELECT COUNT(*) as count FROM assignments WHERE is_deleted = 0').get().count;

    res.json({ success: true, data: assignments, total });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch assignments' });
  }
});

/**
 * POST /api/assignments
 * Create a new assignment
 */
router.post('/', requireRole(['admin', 'teacher']), (req, res) => {
  try {
    const db = getDatabase();
    const { title, description, class_id, subject_id, teacher_id, due_date, max_score } = req.body;
    
    if (!title || !class_id) {
      return res.status(400).json({ success: false, error: 'Title and class_id are required' });
    }

    const id = uuidv4();
    db.prepare(`
      INSERT INTO assignments (id, title, description, class_id, subject_id, teacher_id, due_date, max_score)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, title, description || null, class_id, subject_id || null, teacher_id || req.user?.id, due_date || null, max_score || 100);

    const assignment = db.prepare('SELECT * FROM assignments WHERE id = ?').get(id);
    res.status(201).json({ success: true, message: 'Assignment created', data: assignment });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ success: false, error: 'Failed to create assignment' });
  }
});

/**
 * PUT /api/assignments/:id
 */
router.put('/:id', requireRole(['admin', 'teacher']), (req, res) => {
  try {
    const db = getDatabase();
    const { id } = req.params;
    const updates = req.body;
    
    const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    const values = Object.values(updates);
    
    db.prepare(`UPDATE assignments SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...values, id);
    const assignment = db.prepare('SELECT * FROM assignments WHERE id = ?').get(id);
    
    res.json({ success: true, data: assignment });
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ success: false, error: 'Failed to update assignment' });
  }
});

/**
 * DELETE /api/assignments/:id
 */
router.delete('/:id', requireRole(['admin', 'teacher']), (req, res) => {
  try {
    const db = getDatabase();
    db.prepare('UPDATE assignments SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Assignment deleted' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ success: false, error: 'Failed to delete assignment' });
  }
});

module.exports = router;
