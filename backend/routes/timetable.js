const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database/local');
const syncService = require('../services/syncService');

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Validate period doesn't conflict with existing schedule
const checkConflict = (classname, day, startTime, endTime, excludeId = null) => {
  const database = db.getDatabase();
  let query = `
    SELECT * FROM timetable 
    WHERE class = ? AND day = ? AND is_deleted = 0
  `;
  const params = [classname, day];

  if (excludeId) {
    query += ' AND id != ?';
    params.push(excludeId);
  }

  const periods = database.prepare(query).all(...params);

  for (const period of periods) {
    const existingStart = new Date(`2000-01-01 ${period.start_time}`);
    const existingEnd = new Date(`2000-01-01 ${period.end_time}`);
    const newStart = new Date(`2000-01-01 ${startTime}`);
    const newEnd = new Date(`2000-01-01 ${endTime}`);

    if (!(newEnd <= existingStart || newStart >= existingEnd)) {
      return true; // Conflict found
    }
  }

  return false;
};

// Get all timetable entries
router.get('/', (req, res) => {
  try {
    const { class: classname, day, teacher_id, limit = 100, offset = 0 } = req.query;

    const database = db.getDatabase();
    let query = 'SELECT * FROM timetable WHERE is_deleted = 0';
    const params = [];

    if (classname) {
      query += ' AND class = ?';
      params.push(classname);
    }

    if (day) {
      query += ' AND day = ?';
      params.push(day);
    }

    if (teacher_id) {
      query += ' AND teacher_id = ?';
      params.push(teacher_id);
    }

    query += ' ORDER BY day, period_number LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const timetable = database.prepare(query).all(...params);

    // Get count
    let countQuery = 'SELECT COUNT(*) as count FROM timetable WHERE is_deleted = 0';
    const countParams = [];
    if (classname) {
      countQuery += ' AND class = ?';
      countParams.push(classname);
    }
    if (day) {
      countQuery += ' AND day = ?';
      countParams.push(day);
    }
    if (teacher_id) {
      countQuery += ' AND teacher_id = ?';
      countParams.push(teacher_id);
    }

    const { count } = database.prepare(countQuery).get(...countParams);

    res.status(200).json({
      success: true,
      data: timetable,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching timetable:', error);
    res.status(500).json({ success: false, message: 'Error fetching timetable' });
  }
});

// Get timetable for specific class
router.get('/class/:className', (req, res) => {
  try {
    const { className } = req.params;
    const timetable = db.getClassTimetable(className);

    res.status(200).json({
      success: true,
      data: timetable,
      class: className
    });
  } catch (error) {
    console.error('Error fetching class timetable:', error);
    res.status(500).json({ success: false, message: 'Error fetching class timetable' });
  }
});

// Get timetable for specific day
router.get('/class/:className/day/:day', (req, res) => {
  try {
    const { className, day } = req.params;
    const timetable = db.getTimetableByDay(className, day);

    res.status(200).json({
      success: true,
      data: timetable,
      class: className,
      day
    });
  } catch (error) {
    console.error('Error fetching day timetable:', error);
    res.status(500).json({ success: false, message: 'Error fetching day timetable' });
  }
});

// Get teacher schedule
router.get('/teacher/:teacherId', (req, res) => {
  try {
    const { teacherId } = req.params;
    const schedule = db.getTeacherSchedule(teacherId);

    res.status(200).json({
      success: true,
      data: schedule,
      teacher_id: teacherId
    });
  } catch (error) {
    console.error('Error fetching teacher schedule:', error);
    res.status(500).json({ success: false, message: 'Error fetching teacher schedule' });
  }
});

// Create new period
router.post('/period', (req, res) => {
  try {
    const { class: classname, day, period_number, start_time, end_time, subject_id, teacher_id, room_number } = req.body;

    // Validation
    if (!classname || !day || !period_number || !start_time || !end_time || !subject_id || !teacher_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: class, day, period_number, start_time, end_time, subject_id, teacher_id'
      });
    }

    if (!WEEKDAYS.includes(day)) {
      return res.status(400).json({
        success: false,
        message: `Invalid day. Must be one of: ${WEEKDAYS.join(', ')}`
      });
    }

    // Check for time conflicts
    if (checkConflict(classname, day, start_time, end_time)) {
      return res.status(409).json({
        success: false,
        message: 'Time conflict: Period overlaps with existing schedule'
      });
    }

    const id = uuidv4();
    const now = new Date().toISOString();

    const newPeriod = {
      id,
      class: classname,
      day,
      period_number,
      start_time,
      end_time,
      subject_id,
      teacher_id,
      room_number: room_number || '',
      created_at: now,
      updated_at: now,
      synced_at: null,
      is_deleted: 0
    };

    db.insertTimetablePeriod(newPeriod);
    syncService.addToSyncQueue('timetable', 'INSERT', id);

    res.status(201).json({
      success: true,
      data: newPeriod,
      message: 'Period created successfully'
    });
  } catch (error) {
    console.error('Error creating period:', error);
    res.status(500).json({ success: false, message: 'Error creating period' });
  }
});

// Update period
router.put('/period/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { start_time, end_time, subject_id, teacher_id, room_number } = req.body;

    const existing = db.getTimetablePeriod(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Period not found' });
    }

    // If time changed, check for conflicts
    if (start_time || end_time) {
      const newStart = start_time || existing.start_time;
      const newEnd = end_time || existing.end_time;

      if (checkConflict(existing.class, existing.day, newStart, newEnd, id)) {
        return res.status(409).json({
          success: false,
          message: 'Time conflict: Period overlaps with existing schedule'
        });
      }
    }

    const now = new Date().toISOString();

    const updates = {
      start_time: start_time || existing.start_time,
      end_time: end_time || existing.end_time,
      subject_id: subject_id || existing.subject_id,
      teacher_id: teacher_id || existing.teacher_id,
      room_number: room_number !== undefined ? room_number : existing.room_number,
      updated_at: now,
      synced_at: null
    };

    db.updateTimetablePeriod(id, updates);
    syncService.addToSyncQueue('timetable', 'UPDATE', id);

    res.status(200).json({
      success: true,
      data: { id, ...updates },
      message: 'Period updated successfully'
    });
  } catch (error) {
    console.error('Error updating period:', error);
    res.status(500).json({ success: false, message: 'Error updating period' });
  }
});

// Delete period
router.delete('/period/:id', (req, res) => {
  try {
    const { id } = req.params;

    const existing = db.getTimetablePeriod(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Period not found' });
    }

    db.deleteTimetablePeriod(id);
    syncService.addToSyncQueue('timetable', 'DELETE', id);

    res.status(200).json({
      success: true,
      message: 'Period deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting period:', error);
    res.status(500).json({ success: false, message: 'Error deleting period' });
  }
});

module.exports = router;
