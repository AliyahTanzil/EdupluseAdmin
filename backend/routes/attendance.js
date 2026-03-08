const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database/local');
const syncService = require('../services/syncService');

// Get attendance records with filtering by date, class, or student
router.get('/', (req, res) => {
  try {
    const { date, class_name, student_id, limit = 100, offset = 0 } = req.query;

    const database = db.getDatabase();
    let query = 'SELECT * FROM attendance WHERE is_deleted = 0';
    const params = [];

    if (date) {
      query += ' AND date = ?';
      params.push(date);
    }

    if (class_name) {
      query += ' AND class = ?';
      params.push(class_name);
    }

    if (student_id) {
      query += ' AND student_id = ?';
      params.push(student_id);
    }

    query += ' ORDER BY date DESC, student_id ASC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const records = database.prepare(query).all(...params);

    // Get count
    let countQuery = 'SELECT COUNT(*) as count FROM attendance WHERE is_deleted = 0';
    const countParams = [];
    if (date) {
      countQuery += ' AND date = ?';
      countParams.push(date);
    }
    if (class_name) {
      countQuery += ' AND class = ?';
      countParams.push(class_name);
    }
    if (student_id) {
      countQuery += ' AND student_id = ?';
      countParams.push(student_id);
    }

    const { count } = database.prepare(countQuery).get(...countParams);

    res.status(200).json({
      success: true,
      data: records,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ success: false, message: 'Error fetching attendance records' });
  }
});

// Mark attendance for a student
router.post('/mark', (req, res) => {
  try {
    const { student_id, class: className, date, morning_status, afternoon_status, remarks, marked_by } = req.body;

    // Validation
    if (!student_id || !className || !date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: student_id, class, date'
      });
    }

    const id = uuidv4();
    const now = new Date().toISOString();

    // Check if record already exists for this student on this date
    const existing = db.getDatabase().prepare(
      'SELECT id FROM attendance WHERE student_id = ? AND date = ? AND is_deleted = 0'
    ).get(student_id, date);

    if (existing) {
      // Update existing record
      const updates = {
        morning_status: morning_status || 'present',
        afternoon_status: afternoon_status || 'present',
        remarks: remarks || '',
        marked_by: marked_by || 'system',
        updated_at: now,
        synced_at: null
      };

      db.updateAttendance(existing.id, updates);
      syncService.addToSyncQueue('attendance', 'UPDATE', existing.id);

      return res.status(200).json({
        success: true,
        data: { id: existing.id, ...updates },
        message: 'Attendance updated successfully'
      });
    }

    // Create new record
    const newRecord = {
      id,
      student_id,
      class: className,
      date,
      morning_status: morning_status || 'present',
      afternoon_status: afternoon_status || 'present',
      remarks: remarks || '',
      marked_by: marked_by || 'system',
      created_at: now,
      updated_at: now,
      synced_at: null,
      is_deleted: 0
    };

    db.insertAttendance(newRecord);
    syncService.addToSyncQueue('attendance', 'INSERT', id);

    res.status(201).json({
      success: true,
      data: newRecord,
      message: 'Attendance marked successfully'
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ success: false, message: 'Error marking attendance' });
  }
});

// Mark attendance for entire class (bulk)
router.post('/bulk', (req, res) => {
  try {
    const { class: className, date, records, marked_by } = req.body;

    if (!className || !date || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: class, date, records (array)'
      });
    }

    const now = new Date().toISOString();
    const createdRecords = [];

    // Use transaction for bulk insert
    const transaction = db.getDatabase().transaction((records) => {
      for (const record of records) {
        const id = uuidv4();
        const newRecord = {
          id,
          student_id: record.student_id,
          class: className,
          date,
          morning_status: record.morning_status || 'present',
          afternoon_status: record.afternoon_status || 'present',
          remarks: record.remarks || '',
          marked_by: marked_by || 'system',
          created_at: now,
          updated_at: now,
          synced_at: null,
          is_deleted: 0
        };

        db.insertAttendance(newRecord);
        syncService.addToSyncQueue('attendance', 'INSERT', id);
        createdRecords.push(newRecord);
      }
    });

    transaction(records);

    res.status(201).json({
      success: true,
      data: createdRecords,
      count: createdRecords.length,
      message: 'Bulk attendance marked successfully'
    });
  } catch (error) {
    console.error('Error bulk marking attendance:', error);
    res.status(500).json({ success: false, message: 'Error marking bulk attendance' });
  }
});

// Get attendance by student
router.get('/student/:studentId', (req, res) => {
  try {
    const { studentId } = req.params;
    const { limit = 100, offset = 0 } = req.query;

    const records = db.getStudentAttendance(studentId, parseInt(limit), parseInt(offset));

    res.status(200).json({
      success: true,
      data: records,
      studentId,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    res.status(500).json({ success: false, message: 'Error fetching student attendance' });
  }
});

// Get class attendance for a specific date
router.get('/class/:className', (req, res) => {
  try {
    const { className } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required query parameter: date'
      });
    }

    const records = db.getClassAttendance(className, date);

    res.status(200).json({
      success: true,
      data: records,
      class: className,
      date
    });
  } catch (error) {
    console.error('Error fetching class attendance:', error);
    res.status(500).json({ success: false, message: 'Error fetching class attendance' });
  }
});

// Update attendance record
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { morning_status, afternoon_status, remarks } = req.body;

    const existing = db.getAttendanceRecord(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    const now = new Date().toISOString();

    const updates = {
      morning_status: morning_status !== undefined ? morning_status : existing.morning_status,
      afternoon_status: afternoon_status !== undefined ? afternoon_status : existing.afternoon_status,
      remarks: remarks !== undefined ? remarks : existing.remarks,
      updated_at: now,
      synced_at: null
    };

    db.updateAttendance(id, updates);
    syncService.addToSyncQueue('attendance', 'UPDATE', id);

    res.status(200).json({
      success: true,
      data: { id, ...updates },
      message: 'Attendance updated successfully'
    });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ success: false, message: 'Error updating attendance' });
  }
});

// Delete attendance record
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const existing = db.getAttendanceRecord(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    db.deleteAttendance(id);
    syncService.addToSyncQueue('attendance', 'DELETE', id);

    res.status(200).json({
      success: true,
      message: 'Attendance deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting attendance:', error);
    res.status(500).json({ success: false, message: 'Error deleting attendance' });
  }
});

module.exports = router;
