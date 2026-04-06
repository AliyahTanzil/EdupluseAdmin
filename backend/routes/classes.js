const express = require('express');
const router = express.Router();
const { getDatabase } = require('../database/local');

/**
 * GET /api/classes
 * Get all classes (derived from students and timetable)
 */
router.get('/', (req, res) => {
  try {
    const db = getDatabase();
    
    // Get unique classes from students
    const classes = db.prepare(`
      SELECT DISTINCT class as name, 
             COUNT(*) as student_count
      FROM students 
      WHERE is_deleted = 0 
      GROUP BY class 
      ORDER BY class
    `).all();

    res.json({ 
      success: true, 
      data: classes,
      total: classes.length 
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch classes' });
  }
});

/**
 * GET /api/classes/:className
 * Get class details with students
 */
router.get('/:className', (req, res) => {
  try {
    const db = getDatabase();
    const { className } = req.params;
    
    const students = db.prepare(
      'SELECT * FROM students WHERE class = ? AND is_deleted = 0 ORDER BY name'
    ).all(className);
    
    const timetable = db.prepare(
      'SELECT * FROM timetable WHERE class = ? AND is_deleted = 0 ORDER BY day, period_number'
    ).all(className);

    res.json({ 
      success: true, 
      data: { 
        name: className, 
        students, 
        timetable,
        studentCount: students.length 
      } 
    });
  } catch (error) {
    console.error('Error fetching class:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch class' });
  }
});

module.exports = router;
