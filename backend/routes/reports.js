const express = require('express');
const router = express.Router();
const db = require('../database/local');

// Generate attendance report
router.post('/attendance', (req, res) => {
  try {
    const { class: className, start_date, end_date, student_id } = req.body;

    if (!className || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: class, start_date, end_date'
      });
    }

    const database = db.getDatabase();
    
    let query = `
      SELECT a.student_id, s.name, s.roll, a.class, 
             COUNT(*) as total_days,
             SUM(CASE WHEN a.morning_status = 'present' THEN 1 ELSE 0 END) as present_days,
             SUM(CASE WHEN a.morning_status = 'absent' THEN 1 ELSE 0 END) as absent_days,
             SUM(CASE WHEN a.morning_status = 'leave' THEN 1 ELSE 0 END) as leave_days
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      WHERE a.class = ? AND a.date BETWEEN ? AND ? AND a.is_deleted = 0
    `;
    const params = [className, start_date, end_date];

    if (student_id) {
      query += ' AND a.student_id = ?';
      params.push(student_id);
    }

    query += ' GROUP BY a.student_id ORDER BY s.roll';

    const report = database.prepare(query).all(...params);

    // Calculate percentages
    const reportWithPercentage = report.map(row => ({
      ...row,
      attendance_percentage: row.total_days > 0 
        ? ((row.present_days / row.total_days) * 100).toFixed(2)
        : 0
    }));

    res.status(200).json({
      success: true,
      data: reportWithPercentage,
      summary: {
        class: className,
        period: `${start_date} to ${end_date}`,
        total_students: reportWithPercentage.length
      }
    });
  } catch (error) {
    console.error('Error generating attendance report:', error);
    res.status(500).json({ success: false, message: 'Error generating attendance report' });
  }
});

// Generate class performance report
router.post('/performance', (req, res) => {
  try {
    const { class: className, date } = req.body;

    if (!className || !date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: class, date'
      });
    }

    const database = db.getDatabase();

    // Get attendance data for specific date
    const attendanceData = database.prepare(`
      SELECT COUNT(*) as total,
             SUM(CASE WHEN morning_status = 'present' THEN 1 ELSE 0 END) as present,
             SUM(CASE WHEN morning_status = 'absent' THEN 1 ELSE 0 END) as absent,
             SUM(CASE WHEN morning_status = 'leave' THEN 1 ELSE 0 END) as leave
      FROM attendance
      WHERE class = ? AND date = ? AND is_deleted = 0
    `).get(className, date);

    res.status(200).json({
      success: true,
      data: {
        class: className,
        date,
        attendance: attendanceData,
        attendance_rate: attendanceData.total > 0 
          ? ((attendanceData.present / attendanceData.total) * 100).toFixed(2)
          : 0
      }
    });
  } catch (error) {
    console.error('Error generating performance report:', error);
    res.status(500).json({ success: false, message: 'Error generating performance report' });
  }
});

// Export report as JSON
router.post('/export', (req, res) => {
  try {
    const { report_type, class: className, start_date, end_date, format = 'json' } = req.body;

    if (!report_type || !className) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: report_type, class'
      });
    }

    const database = db.getDatabase();

    let data = [];

    if (report_type === 'attendance') {
      data = database.prepare(`
        SELECT a.student_id, s.name, s.roll, a.class, a.date, a.morning_status, a.afternoon_status
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        WHERE a.class = ? AND a.is_deleted = 0
        ${start_date ? 'AND a.date >= ?' : ''}
        ${end_date ? 'AND a.date <= ?' : ''}
        ORDER BY a.date, s.roll
      `).all(className, ...(start_date ? [start_date] : []), ...(end_date ? [end_date] : []));
    } else if (report_type === 'students') {
      data = database.prepare(`
        SELECT id, name, roll, class, email, phone, parent_phone, date_of_birth
        FROM students
        WHERE class = ? AND is_deleted = 0
        ORDER BY roll
      `).all(className);
    } else if (report_type === 'timetable') {
      data = database.prepare(`
        SELECT t.class, t.day, t.period_number, t.start_time, t.end_time, 
               subj.name as subject, teach.name as teacher, t.room_number
        FROM timetable t
        LEFT JOIN subjects subj ON t.subject_id = subj.id
        LEFT JOIN teachers teach ON t.teacher_id = teach.id
        WHERE t.class = ? AND t.is_deleted = 0
        ORDER BY t.day, t.period_number
      `).all(className);
    }

    if (format === 'json') {
      res.status(200).json({
        success: true,
        data,
        exported_at: new Date().toISOString(),
        format: 'json'
      });
    } else {
      // For CSV, send as attachment
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="report-${report_type}-${className}.json"`);
      res.status(200).json({
        success: true,
        data,
        exported_at: new Date().toISOString(),
        format: 'json'
      });
    }
  } catch (error) {
    console.error('Error exporting report:', error);
    res.status(500).json({ success: false, message: 'Error exporting report' });
  }
});

module.exports = router;
