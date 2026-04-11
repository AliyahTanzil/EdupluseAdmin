const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { validateTableName, buildSafeUpdate } = require('../config/security');

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

  // Users table (for authentication and user management)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      admin_type TEXT,
      teacher_type TEXT,
      school_level TEXT,
      section TEXT,
      class_id TEXT,
      class_name TEXT,
      stream TEXT,
      assigned_schools TEXT DEFAULT '[]',
      assigned_classes TEXT DEFAULT '[]',
      subjects TEXT DEFAULT '[]',
      department TEXT,
      phone TEXT,
      address TEXT,
      is_super_user INTEGER DEFAULT 0,
      is_suspended INTEGER DEFAULT 0,
      permissions TEXT DEFAULT '[]',
      children TEXT DEFAULT '[]',
      join_date DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Schools table
  db.exec(`
    CREATE TABLE IF NOT EXISTS schools (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT NOT NULL UNIQUE,
      school_level TEXT NOT NULL,
      address TEXT,
      city TEXT DEFAULT 'Freetown',
      state TEXT DEFAULT 'Western Area',
      country TEXT DEFAULT 'Sierra Leone',
      phone TEXT,
      email TEXT,
      website TEXT,
      principal_name TEXT,
      total_students INTEGER DEFAULT 0,
      total_teachers INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_deleted INTEGER DEFAULT 0
    )
  `);

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
      subject_id TEXT,
      qualification TEXT,
      experience INTEGER DEFAULT 0,
      classes_assigned TEXT,
      hire_date DATETIME,
      status TEXT DEFAULT 'active',
      photo_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      synced_at DATETIME,
      is_deleted INTEGER DEFAULT 0,
      FOREIGN KEY (subject_id) REFERENCES subjects(id)
    )
  `);

  // Subjects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS subjects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT NOT NULL,
      class TEXT NOT NULL,
      description TEXT,
      credit_hours REAL DEFAULT 0,
      category TEXT DEFAULT 'Academic',
      teacher_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      synced_at DATETIME,
      is_deleted INTEGER DEFAULT 0,
      FOREIGN KEY (teacher_id) REFERENCES teachers(id),
      UNIQUE(name, code, class)
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

  // Grades table
  db.exec(`
    CREATE TABLE IF NOT EXISTS grades (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      subject_id TEXT NOT NULL,
      class_id TEXT,
      score REAL NOT NULL,
      grade TEXT,
      term TEXT NOT NULL,
      academic_year TEXT NOT NULL,
      exam_type TEXT DEFAULT 'test',
      remarks TEXT,
      graded_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_deleted INTEGER DEFAULT 0,
      FOREIGN KEY (student_id) REFERENCES students(id),
      FOREIGN KEY (subject_id) REFERENCES subjects(id)
    )
  `);

  // Assignments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS assignments (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      class_id TEXT NOT NULL,
      subject_id TEXT,
      teacher_id TEXT,
      due_date DATE,
      max_score REAL DEFAULT 100,
      status TEXT DEFAULT 'active',
      submitted INTEGER DEFAULT 0,
      student_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_deleted INTEGER DEFAULT 0,
      FOREIGN KEY (subject_id) REFERENCES subjects(id),
      FOREIGN KEY (teacher_id) REFERENCES teachers(id)
    )
  `);

  // Exams table
  db.exec(`
    CREATE TABLE IF NOT EXISTS exams (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subject_id TEXT NOT NULL,
      class_id TEXT NOT NULL,
      exam_date DATE NOT NULL,
      duration_minutes INTEGER DEFAULT 120,
      max_score REAL DEFAULT 100,
      exam_type TEXT DEFAULT 'midterm',
      status TEXT DEFAULT 'scheduled',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_deleted INTEGER DEFAULT 0,
      FOREIGN KEY (subject_id) REFERENCES subjects(id)
    )
  `);

  // Class enrollments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS class_enrollments (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      class_id TEXT NOT NULL,
      academic_year TEXT,
      status TEXT DEFAULT 'active',
      enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id),
      UNIQUE(student_id, class_id, academic_year)
    )
  `);

  // C-4 fix: Classes table (missing - referenced by class_enrollments & exams)
  db.exec(`
    CREATE TABLE IF NOT EXISTS classes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      school_id TEXT,
      grade_level TEXT,
      section TEXT,
      academic_year TEXT,
      teacher_id TEXT,
      capacity INTEGER DEFAULT 40,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_deleted INTEGER DEFAULT 0,
      FOREIGN KEY (school_id) REFERENCES schools(id),
      FOREIGN KEY (teacher_id) REFERENCES teachers(id)
    )
  `);

  // ============ SAFE MIGRATIONS FOR EXISTING DATABASES ============
  // Add is_deleted column to tables that may have been created without it
  const safeAddColumn = (table, column, type) => {
    try {
      const cols = db.pragma(`table_info(${table})`);
      const exists = cols.some(c => c.name === column);
      if (!exists) {
        db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
        console.log(`  ✓ Added missing column ${table}.${column}`);
      }
    } catch (e) {
      // Table may not exist yet - that's fine, CREATE TABLE above handles it
    }
  };

  safeAddColumn('schools', 'is_deleted', 'INTEGER DEFAULT 0');
  safeAddColumn('users', 'is_deleted', 'INTEGER DEFAULT 0');

  // C-2 fix: Add indexes for frequently queried columns
  db.exec(`CREATE INDEX IF NOT EXISTS idx_students_class ON students(class)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_students_is_deleted ON students(is_deleted)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_attendance_is_deleted ON attendance(is_deleted)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_grades_student_id ON grades(student_id)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_grades_subject_id ON grades(subject_id)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_grades_is_deleted ON grades(is_deleted)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_teachers_is_deleted ON teachers(is_deleted)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_subjects_is_deleted ON subjects(is_deleted)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_schools_is_deleted ON schools(is_deleted)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_assignments_class_id ON assignments(class_id)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_assignments_is_deleted ON assignments(is_deleted)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_timetable_class ON timetable(class)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_sync_logs_table ON sync_logs(table_name)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_class_enrollments_student ON class_enrollments(student_id)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_classes_school_id ON classes(school_id)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_classes_is_deleted ON classes(is_deleted)`);

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
  const { fields, values } = buildSafeUpdate('students', id, updates);
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
  const { fields, values } = buildSafeUpdate('teachers', id, updates);
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
  const { fields, values } = buildSafeUpdate('attendance', id, updates);
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
  const { fields, values } = buildSafeUpdate('timetable', id, updates);
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
    INSERT INTO subjects (id, name, code, class, description, credit_hours, category, created_at, updated_at, synced_at, is_deleted)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    subject.id,
    subject.name,
    subject.code,
    subject.class,
    subject.description,
    subject.credit_hours,
    subject.category,
    subject.created_at,
    subject.updated_at,
    subject.synced_at,
    subject.is_deleted
  );
};

const updateSubject = (id, updates) => {
  const { fields, values } = buildSafeUpdate('subjects', id, updates);
  const stmt = db.prepare(`UPDATE subjects SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
  return stmt.run(...values, id);
};

const deleteSubject = (id) => {
  const stmt = db.prepare('UPDATE subjects SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
  return stmt.run(id);
};

<<<<<<< HEAD
=======
// Courses operations
const getCourse = (id) => {
  const stmt = db.prepare('SELECT * FROM courses WHERE id = ? AND is_deleted = 0');
  return stmt.get(id);
};

const getAllCourses = (limit = 100, offset = 0) => {
  const stmt = db.prepare('SELECT * FROM courses WHERE is_deleted = 0 LIMIT ? OFFSET ?');
  return stmt.all(limit, offset);
};

const insertCourse = (course) => {
  const stmt = db.prepare(`
    INSERT INTO courses (id, name, code, description, credits, teacher_id, semester, created_at, updated_at, synced_at, is_deleted)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    course.id,
    course.name,
    course.code,
    course.description,
    course.credits,
    course.teacher_id,
    course.semester,
    course.created_at,
    course.updated_at,
    course.synced_at,
    course.is_deleted
  );
};

const updateCourse = (id, updates) => {
  const { fields, values } = buildSafeUpdate('courses', id, updates);
  const stmt = db.prepare(`UPDATE courses SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
  return stmt.run(...values, id);
};

const deleteCourse = (id) => {
  const stmt = db.prepare('UPDATE courses SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
  return stmt.run(id);
};

>>>>>>> 5469f3f1 (chore: update gitignore and remove sensitive files)
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
  const { fields, values } = buildSafeUpdate('devices', id, updates);
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

// Mark record as synced (A-7 fix: validate table name)
const markAsSynced = (id, tableName) => {
  validateTableName(tableName);
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
  getLocalDB: () => db,
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
