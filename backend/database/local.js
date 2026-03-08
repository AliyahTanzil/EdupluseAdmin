const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../data/eduplus.db');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

const initializeLocalDB = () => {
  console.log('Initializing local SQLite database...');

  // Students table
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      roll TEXT NOT NULL UNIQUE,
      class TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      parent_phone TEXT,
      address TEXT,
      date_of_birth DATE,
      photo_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      synced_at DATETIME,
      is_deleted INTEGER DEFAULT 0
    )
  `);

  // Teachers table
  db.exec(`
    CREATE TABLE IF NOT EXISTS teachers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      phone TEXT,
      subject TEXT,
      qualification TEXT,
      experience INTEGER,
      photo_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      synced_at DATETIME,
      is_deleted INTEGER DEFAULT 0
    )
  `);

  // Subjects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS subjects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT NOT NULL UNIQUE,
      description TEXT,
      teacher_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      synced_at DATETIME,
      is_deleted INTEGER DEFAULT 0,
      FOREIGN KEY (teacher_id) REFERENCES teachers(id)
    )
  `);

  // Attendance table
  db.exec(`
    CREATE TABLE IF NOT EXISTS attendance (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      class TEXT NOT NULL,
      date DATE NOT NULL,
      morning_status TEXT DEFAULT 'absent',
      afternoon_status TEXT DEFAULT 'absent',
      remarks TEXT,
      marked_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      synced_at DATETIME,
      is_deleted INTEGER DEFAULT 0,
      FOREIGN KEY (student_id) REFERENCES students(id),
      UNIQUE(student_id, date)
    )
  `);

  // Timetable table
  db.exec(`
    CREATE TABLE IF NOT EXISTS timetable (
      id TEXT PRIMARY KEY,
      class TEXT NOT NULL,
      day TEXT NOT NULL,
      period_number INTEGER NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      subject_id TEXT NOT NULL,
      teacher_id TEXT NOT NULL,
      room_number TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      synced_at DATETIME,
      is_deleted INTEGER DEFAULT 0,
      FOREIGN KEY (subject_id) REFERENCES subjects(id),
      FOREIGN KEY (teacher_id) REFERENCES teachers(id),
      UNIQUE(class, day, period_number)
    )
  `);

  // Biometric Devices table
  db.exec(`
    CREATE TABLE IF NOT EXISTS devices (
      id TEXT PRIMARY KEY,
      device_id TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      device_type TEXT,
      status TEXT DEFAULT 'online',
      last_sync DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      synced_at DATETIME,
      is_deleted INTEGER DEFAULT 0
    )
  `);

  // Sync Log table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sync_logs (
      id TEXT PRIMARY KEY,
      table_name TEXT NOT NULL,
      action TEXT NOT NULL,
      record_id TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      error_message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      synced_at DATETIME
    )
  `);

  console.log('✓ Local database initialized successfully');
};

// Helper functions
const getStudent = (id) => {
  const stmt = db.prepare('SELECT * FROM students WHERE id = ? AND is_deleted = 0');
  return stmt.get(id);
};

const getAllStudents = (limit = 100, offset = 0) => {
  const stmt = db.prepare('SELECT * FROM students WHERE is_deleted = 0 LIMIT ? OFFSET ?');
  return stmt.all(limit, offset);
};

const insertStudent = (student) => {
  const stmt = db.prepare(`
    INSERT INTO students (id, name, roll, class, email, phone, parent_phone, address, date_of_birth, photo_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    student.id,
    student.name,
    student.roll,
    student.class,
    student.email,
    student.phone,
    student.parent_phone,
    student.address,
    student.date_of_birth,
    student.photo_url
  );
};

const updateStudent = (id, updates) => {
  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updates);
  const stmt = db.prepare(`UPDATE students SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
  return stmt.run(...values, id);
};

const deleteStudent = (id) => {
  const stmt = db.prepare('UPDATE students SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
  return stmt.run(id);
};

// Teacher operations
const getTeacher = (id) => {
  const stmt = db.prepare('SELECT * FROM teachers WHERE id = ? AND is_deleted = 0');
  return stmt.get(id);
};

const getAllTeachers = (limit = 100, offset = 0) => {
  const stmt = db.prepare('SELECT * FROM teachers WHERE is_deleted = 0 LIMIT ? OFFSET ?');
  return stmt.all(limit, offset);
};

const insertTeacher = (teacher) => {
  const stmt = db.prepare(`
    INSERT INTO teachers (id, name, email, phone, subject_id, qualification, experience, classes_assigned, hire_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    teacher.id,
    teacher.name,
    teacher.email,
    teacher.phone,
    teacher.subject_id,
    teacher.qualification,
    teacher.experience,
    teacher.classes_assigned,
    teacher.hire_date,
    teacher.status
  );
};

const updateTeacher = (id, updates) => {
  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updates);
  const stmt = db.prepare(`UPDATE teachers SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
  return stmt.run(...values, id);
};

const deleteTeacher = (id) => {
  const stmt = db.prepare('UPDATE teachers SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
  return stmt.run(id);
};

// Attendance operations
const getAttendanceRecord = (id) => {
  const stmt = db.prepare('SELECT * FROM attendance WHERE id = ? AND is_deleted = 0');
  return stmt.get(id);
};

const getStudentAttendance = (studentId, limit = 100, offset = 0) => {
  const stmt = db.prepare(`
    SELECT * FROM attendance 
    WHERE student_id = ? AND is_deleted = 0 
    ORDER BY date DESC 
    LIMIT ? OFFSET ?
  `);
  return stmt.all(studentId, limit, offset);
};

const getClassAttendance = (className, date) => {
  const stmt = db.prepare(`
    SELECT * FROM attendance 
    WHERE class = ? AND date = ? AND is_deleted = 0 
    ORDER BY student_id
  `);
  return stmt.all(className, date);
};

const insertAttendance = (attendance) => {
  const stmt = db.prepare(`
    INSERT INTO attendance (id, student_id, class, date, morning_status, afternoon_status, remarks, marked_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    attendance.id,
    attendance.student_id,
    attendance.class,
    attendance.date,
    attendance.morning_status,
    attendance.afternoon_status,
    attendance.remarks,
    attendance.marked_by
  );
};

const updateAttendance = (id, updates) => {
  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updates);
  const stmt = db.prepare(`UPDATE attendance SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
  return stmt.run(...values, id);
};

const deleteAttendance = (id) => {
  const stmt = db.prepare('UPDATE attendance SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
  return stmt.run(id);
};

// Timetable operations
const getTimetablePeriod = (id) => {
  const stmt = db.prepare('SELECT * FROM timetable WHERE id = ? AND is_deleted = 0');
  return stmt.get(id);
};

const getClassTimetable = (className) => {
  const stmt = db.prepare(`
    SELECT * FROM timetable 
    WHERE class = ? AND is_deleted = 0 
    ORDER BY day, period_number
  `);
  return stmt.all(className);
};

const getTimetableByDay = (className, day) => {
  const stmt = db.prepare(`
    SELECT * FROM timetable 
    WHERE class = ? AND day = ? AND is_deleted = 0 
    ORDER BY period_number
  `);
  return stmt.all(className, day);
};

const getTeacherSchedule = (teacherId) => {
  const stmt = db.prepare(`
    SELECT * FROM timetable 
    WHERE teacher_id = ? AND is_deleted = 0 
    ORDER BY day, period_number
  `);
  return stmt.all(teacherId);
};

const insertTimetablePeriod = (period) => {
  const stmt = db.prepare(`
    INSERT INTO timetable (id, class, day, period_number, start_time, end_time, subject_id, teacher_id, room_number)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    period.id,
    period.class,
    period.day,
    period.period_number,
    period.start_time,
    period.end_time,
    period.subject_id,
    period.teacher_id,
    period.room_number
  );
};

const updateTimetablePeriod = (id, updates) => {
  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updates);
  const stmt = db.prepare(`UPDATE timetable SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
  return stmt.run(...values, id);
};

const deleteTimetablePeriod = (id) => {
  const stmt = db.prepare('UPDATE timetable SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
  return stmt.run(id);
};

// Subjects operations
const getSubject = (id) => {
  const stmt = db.prepare('SELECT * FROM subjects WHERE id = ? AND is_deleted = 0');
  return stmt.get(id);
};

const getAllSubjects = (limit = 100, offset = 0) => {
  const stmt = db.prepare('SELECT * FROM subjects WHERE is_deleted = 0 LIMIT ? OFFSET ?');
  return stmt.all(limit, offset);
};

const insertSubject = (subject) => {
  const stmt = db.prepare(`
    INSERT INTO subjects (id, name, code, description, credit_hours, category)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    subject.id,
    subject.name,
    subject.code,
    subject.description,
    subject.credit_hours,
    subject.category
  );
};

const updateSubject = (id, updates) => {
  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updates);
  const stmt = db.prepare(`UPDATE subjects SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
  return stmt.run(...values, id);
};

const deleteSubject = (id) => {
  const stmt = db.prepare('UPDATE subjects SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
  return stmt.run(id);
};

// Devices operations
const getDevice = (id) => {
  const stmt = db.prepare('SELECT * FROM devices WHERE id = ? AND is_deleted = 0');
  return stmt.get(id);
};

const getDeviceByDeviceId = (deviceId) => {
  const stmt = db.prepare('SELECT * FROM devices WHERE device_id = ? AND is_deleted = 0');
  return stmt.get(deviceId);
};

const getAllDevices = (limit = 100, offset = 0) => {
  const stmt = db.prepare('SELECT * FROM devices WHERE is_deleted = 0 LIMIT ? OFFSET ?');
  return stmt.all(limit, offset);
};

const insertDevice = (device) => {
  const stmt = db.prepare(`
    INSERT INTO devices (id, device_id, name, location, device_type, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    device.id,
    device.device_id,
    device.name,
    device.location,
    device.device_type,
    device.status
  );
};

const updateDevice = (id, updates) => {
  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updates);
  const stmt = db.prepare(`UPDATE devices SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
  return stmt.run(...values, id);
};

const deleteDevice = (id) => {
  const stmt = db.prepare('UPDATE devices SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
  return stmt.run(id);
};

// Get pending sync records
const getPendingSyncRecords = () => {
  const stmt = db.prepare(`
    SELECT * FROM sync_logs 
    WHERE status = 'pending' 
    ORDER BY created_at ASC
  `);
  return stmt.all();
};

// Mark record as synced
const markAsSynced = (id, tableName) => {
  const stmt = db.prepare(`
    UPDATE ${tableName} 
    SET synced_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `);
  return stmt.run(id);
};

// Log sync action
const logSyncAction = (syncLog) => {
  const stmt = db.prepare(`
    INSERT INTO sync_logs (id, table_name, action, record_id, status)
    VALUES (?, ?, ?, ?, ?)
  `);
  return stmt.run(
    syncLog.id,
    syncLog.table_name,
    syncLog.action,
    syncLog.record_id,
    syncLog.status || 'pending'
  );
};

module.exports = {
  db,
  getDatabase: () => db,
  initializeLocalDB,
  // Student operations
  getStudent,
  getAllStudents,
  insertStudent,
  updateStudent,
  deleteStudent,
  // Teacher operations
  getTeacher,
  getAllTeachers,
  insertTeacher,
  updateTeacher,
  deleteTeacher,
  // Attendance operations
  getAttendanceRecord,
  getStudentAttendance,
  getClassAttendance,
  insertAttendance,
  updateAttendance,
  deleteAttendance,
  // Timetable operations
  getTimetablePeriod,
  getClassTimetable,
  getTimetableByDay,
  getTeacherSchedule,
  insertTimetablePeriod,
  updateTimetablePeriod,
  deleteTimetablePeriod,
  // Subjects operations
  getSubject,
  getAllSubjects,
  insertSubject,
  updateSubject,
  deleteSubject,
  // Devices operations
  getDevice,
  getDeviceByDeviceId,
  getAllDevices,
  insertDevice,
  updateDevice,
  deleteDevice,
  // Sync operations
  getPendingSyncRecords,
  markAsSynced,
  logSyncAction
};
