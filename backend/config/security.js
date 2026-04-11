/**
 * Centralized Configuration Module
 * Single source of truth for JWT secret and other config values
 */
const crypto = require('crypto');

// JWT Secret - centralized, used by all auth/middleware modules
const JWT_SECRET = process.env.JWT_SECRET || (() => {
  console.warn('⚠️  WARNING: JWT_SECRET not set in environment. Using randomly generated secret.');
  console.warn('⚠️  Set JWT_SECRET in your .env file for production use.');
  return crypto.randomBytes(64).toString('hex');
})();

// Allowed table names for SQL operations (whitelist for A-7)
const ALLOWED_TABLES = [
  'students', 'teachers', 'subjects', 'courses', 'attendance',
  'timetable', 'devices', 'grades', 'assignments', 'exams',
  'class_enrollments', 'schools', 'users', 'sync_logs'
];

// Allowed column names per table for updates (whitelist for A-6)
const ALLOWED_COLUMNS = {
  students: ['name', 'roll', 'class', 'email', 'phone', 'parent_phone', 'address', 'date_of_birth', 'photo_url', 'updated_at', 'synced_at'],
  teachers: ['name', 'email', 'phone', 'subject_id', 'qualification', 'experience', 'classes_assigned', 'hire_date', 'status', 'photo_url', 'updated_at', 'synced_at'],
  subjects: ['name', 'code', 'class', 'description', 'credit_hours', 'category', 'teacher_id', 'updated_at', 'synced_at'],
  courses: ['name', 'code', 'description', 'credits', 'teacher_id', 'semester', 'updated_at', 'synced_at'],
  attendance: ['student_id', 'class', 'date', 'morning_status', 'afternoon_status', 'remarks', 'marked_by', 'updated_at', 'synced_at'],
  timetable: ['class', 'day', 'period_number', 'start_time', 'end_time', 'subject_id', 'teacher_id', 'room_number', 'updated_at', 'synced_at'],
  devices: ['device_id', 'name', 'location', 'device_type', 'status', 'last_sync', 'updated_at', 'synced_at'],
  grades: ['student_id', 'subject_id', 'class_id', 'score', 'grade', 'term', 'academic_year', 'exam_type', 'remarks', 'graded_by', 'updated_at'],
  assignments: ['title', 'description', 'class_id', 'subject_id', 'teacher_id', 'due_date', 'max_score', 'status', 'submitted', 'student_id', 'updated_at'],
  schools: ['name', 'code', 'school_level', 'address', 'city', 'state', 'country', 'phone', 'email', 'website', 'principal_name', 'total_students', 'total_teachers', 'status', 'updated_at'],
  users: ['email', 'password', 'full_name', 'role', 'admin_type', 'teacher_type', 'school_level', 'section', 'class_id', 'class_name', 'stream', 'assigned_schools', 'assigned_classes', 'subjects', 'department', 'phone', 'address', 'is_super_user', 'is_suspended', 'permissions', 'children', 'updated_at']
};

/**
 * Validate table name against whitelist (A-7)
 */
function validateTableName(tableName) {
  if (!ALLOWED_TABLES.includes(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }
  return tableName;
}

/**
 * Filter and validate column names for a table (A-6)
 * Returns only whitelisted columns from the updates object
 */
function sanitizeUpdateColumns(tableName, updates) {
  const allowed = ALLOWED_COLUMNS[tableName];
  if (!allowed) {
    throw new Error(`No column whitelist defined for table: ${tableName}`);
  }
  
  const sanitized = {};
  for (const key of Object.keys(updates)) {
    if (allowed.includes(key)) {
      sanitized[key] = updates[key];
    } else {
      console.warn(`Blocked disallowed column "${key}" for table "${tableName}"`);
    }
  }
  return sanitized;
}

/**
 * Build a safe UPDATE query with whitelisted columns (A-6)
 */
function buildSafeUpdate(tableName, id, updates) {
  const sanitized = sanitizeUpdateColumns(tableName, updates);
  const keys = Object.keys(sanitized);
  
  if (keys.length === 0) {
    throw new Error('No valid columns to update');
  }
  
  const fields = keys.map(key => `${key} = ?`).join(', ');
  const values = Object.values(sanitized);
  
  return { fields, values };
}

module.exports = {
  JWT_SECRET,
  ALLOWED_TABLES,
  ALLOWED_COLUMNS,
  validateTableName,
  sanitizeUpdateColumns,
  buildSafeUpdate
};
