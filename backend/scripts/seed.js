/**
 * Database Seed Script
 * Seeds the SQLite database with demo data for all tables
 * Run: node scripts/seed.js
 */

const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Set up environment
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { db, initializeLocalDB } = require('../database/local');

console.log('🌱 Starting database seed...\n');

// Initialize tables first
initializeLocalDB();

// ============ SEED SCHOOLS ============
const seedSchools = () => {
  console.log('📚 Seeding schools...');
  
  const schools = [
    {
      id: 'school-primary',
      name: 'Prince of Wales Primary School',
      code: 'PWPS',
      school_level: 'primary',
      address: 'Kingtom, Freetown',
      city: 'Freetown',
      state: 'Western Area',
      country: 'Sierra Leone',
      phone: '+232-76-000-001',
      email: 'primary@princewales.edu.sl',
      principal_name: 'Mrs. Fatima Kamara',
      total_students: 0,
      total_teachers: 0,
    },
    {
      id: 'school-junior-secondary',
      name: 'Prince of Wales Junior Secondary School',
      code: 'PWJSS',
      school_level: 'junior_secondary',
      address: 'Kingtom, Freetown',
      city: 'Freetown',
      state: 'Western Area',
      country: 'Sierra Leone',
      phone: '+232-76-000-002',
      email: 'jss@princewales.edu.sl',
      principal_name: 'Mr. Ibrahim Sesay',
      total_students: 0,
      total_teachers: 0,
    },
    {
      id: 'school-senior-secondary',
      name: 'Prince of Wales Senior Secondary School',
      code: 'PWSSS',
      school_level: 'senior_secondary',
      address: 'Kingtom, Freetown',
      city: 'Freetown',
      state: 'Western Area',
      country: 'Sierra Leone',
      phone: '+232-76-000-003',
      email: 'sss@princewales.edu.sl',
      principal_name: 'Dr. Sarah Principal',
      total_students: 0,
      total_teachers: 0,
    },
  ];

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO schools (id, name, code, school_level, address, city, state, country, phone, email, principal_name, total_students, total_teachers, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);

  for (const school of schools) {
    stmt.run(school.id, school.name, school.code, school.school_level, school.address, school.city, school.state, school.country, school.phone, school.email, school.principal_name, school.total_students, school.total_teachers);
  }
  
  console.log(`  ✓ ${schools.length} schools seeded`);
};

// ============ SEED SUBJECTS ============
const seedSubjects = () => {
  console.log('📖 Seeding subjects...');
  
  const subjects = [
    // Primary subjects
    { id: 'subj-math-prim', name: 'Mathematics', code: 'MATH', class: 'Class 4', category: 'Academic', credit_hours: 5 },
    { id: 'subj-eng-prim', name: 'English Language', code: 'ENG', class: 'Class 4', category: 'Academic', credit_hours: 5 },
    { id: 'subj-sci-prim', name: 'Science', code: 'SCI', class: 'Class 4', category: 'Academic', credit_hours: 4 },
    { id: 'subj-ss-prim', name: 'Social Studies', code: 'SS', class: 'Class 4', category: 'Academic', credit_hours: 3 },
    
    // Junior Secondary subjects
    { id: 'subj-math-jss', name: 'Mathematics', code: 'MATH', class: 'JSS1', category: 'Academic', credit_hours: 5 },
    { id: 'subj-eng-jss', name: 'English Language', code: 'ENG', class: 'JSS1', category: 'Academic', credit_hours: 5 },
    { id: 'subj-isci-jss', name: 'Integrated Science', code: 'ISCI', class: 'JSS1', category: 'Academic', credit_hours: 4 },
    { id: 'subj-ss-jss', name: 'Social Studies', code: 'SS', class: 'JSS1', category: 'Academic', credit_hours: 3 },
    { id: 'subj-ca-jss', name: 'Creative Arts', code: 'CA', class: 'JSS1', category: 'Academic', credit_hours: 2 },
    
    // Senior Secondary Science subjects
    { id: 'subj-phy-sss', name: 'Physics', code: 'PHY', class: 'SSS1-Science', category: 'Science', credit_hours: 5 },
    { id: 'subj-chem-sss', name: 'Chemistry', code: 'CHEM', class: 'SSS1-Science', category: 'Science', credit_hours: 5 },
    { id: 'subj-bio-sss', name: 'Biology', code: 'BIO', class: 'SSS1-Science', category: 'Science', credit_hours: 5 },
    { id: 'subj-math-sss', name: 'Mathematics', code: 'MATH', class: 'SSS1-Science', category: 'Academic', credit_hours: 5 },
    { id: 'subj-eng-sss', name: 'English Language', code: 'ENG', class: 'SSS1-Science', category: 'Academic', credit_hours: 5 },
    
    // Senior Secondary Commercial subjects
    { id: 'subj-acc-sss', name: 'Accounting', code: 'ACC', class: 'SSS2-Commercial', category: 'Commercial', credit_hours: 5 },
    { id: 'subj-bus-sss', name: 'Business Studies', code: 'BUS', class: 'SSS2-Commercial', category: 'Commercial', credit_hours: 4 },
    { id: 'subj-eco-sss', name: 'Economics', code: 'ECO', class: 'SSS2-Commercial', category: 'Commercial', credit_hours: 4 },
  ];

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO subjects (id, name, code, class, category, credit_hours, description, created_at, updated_at, synced_at, is_deleted)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), NULL, 0)
  `);

  for (const s of subjects) {
    stmt.run(s.id, s.name, s.code, s.class, s.category, s.credit_hours, `${s.name} for ${s.class}`);
  }
  
  console.log(`  ✓ ${subjects.length} subjects seeded`);
};

// ============ SEED TEACHERS ============
const seedTeachers = () => {
  console.log('👨‍🏫 Seeding teachers...');
  
  const teachers = [
    { id: 'teacher-1', name: 'John Teacher', email: 'teacher@school.com', phone: '+232-76-100-001', subject_id: 'subj-math-prim', qualification: 'B.Ed Mathematics', experience: 8, classes_assigned: 'Class 4', status: 'active' },
    { id: 'teacher-2', name: 'Sarah ClassTeacher', email: 'classteacher@school.com', phone: '+232-76-100-002', subject_id: 'subj-eng-jss', qualification: 'M.Ed English', experience: 12, classes_assigned: 'JSS1', status: 'active' },
    { id: 'teacher-3', name: 'Dr. Michael SubjectHead', email: 'subjecthead@school.com', phone: '+232-76-100-003', subject_id: 'subj-phy-sss', qualification: 'PhD Physics', experience: 15, classes_assigned: 'SSS1-Science,SSS2-Science,SSS3-Science', status: 'active' },
    { id: 'teacher-4', name: 'Prof. Rachel DeptHead', email: 'depthead@school.com', phone: '+232-76-100-004', subject_id: 'subj-chem-sss', qualification: 'PhD Chemistry', experience: 20, classes_assigned: 'SSS1-Science,SSS2-Science', status: 'active' },
    { id: 'teacher-5', name: 'Mr. Koroma', email: 'koroma@school.com', phone: '+232-76-100-005', subject_id: 'subj-bio-sss', qualification: 'M.Sc Biology', experience: 10, classes_assigned: 'SSS1-Science', status: 'active' },
    { id: 'teacher-6', name: 'Mrs. Bangura', email: 'bangura@school.com', phone: '+232-76-100-006', subject_id: 'subj-acc-sss', qualification: 'MBA Accounting', experience: 7, classes_assigned: 'SSS2-Commercial', status: 'active' },
  ];

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO teachers (id, name, email, phone, subject_id, qualification, experience, classes_assigned, hire_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-' || ? || ' years'), ?)
  `);

  for (const t of teachers) {
    stmt.run(t.id, t.name, t.email, t.phone, t.subject_id, t.qualification, t.experience, t.classes_assigned, t.experience, t.status);
  }
  
  console.log(`  ✓ ${teachers.length} teachers seeded`);
};

// ============ SEED STUDENTS ============
const seedStudents = () => {
  console.log('👨‍🎓 Seeding students...');
  
  const students = [
    // Primary students
    { id: 'student-1', name: 'Jane Student', roll: 'PRIM-001', class: 'Class 4', email: 'student-primary@school.com', phone: '+232-76-200-001', parent_phone: '+232-76-300-001' },
    { id: 'student-2', name: 'Mohamed Kamara', roll: 'PRIM-002', class: 'Class 4', email: 'mkamara@school.com', phone: '+232-76-200-002', parent_phone: '+232-76-300-002' },
    { id: 'student-3', name: 'Aminata Sesay', roll: 'PRIM-003', class: 'Class 4', email: 'asesay@school.com', phone: '+232-76-200-003', parent_phone: '+232-76-300-003' },
    { id: 'student-4', name: 'Ibrahim Conteh', roll: 'PRIM-004', class: 'Class 4', email: 'iconteh@school.com', phone: '+232-76-200-004', parent_phone: '+232-76-300-004' },
    { id: 'student-5', name: 'Fatmata Bangura', roll: 'PRIM-005', class: 'Class 4', email: 'fbangura@school.com', phone: '+232-76-200-005', parent_phone: '+232-76-300-005' },
    
    // JSS students
    { id: 'student-6', name: 'Ahmad Student', roll: 'JSS1-001', class: 'JSS1', email: 'student-jss@school.com', phone: '+232-76-200-006', parent_phone: '+232-76-300-006' },
    { id: 'student-7', name: 'Mariama Jalloh', roll: 'JSS1-002', class: 'JSS1', email: 'mjalloh@school.com', phone: '+232-76-200-007', parent_phone: '+232-76-300-007' },
    { id: 'student-8', name: 'David Koroma', roll: 'JSS1-003', class: 'JSS1', email: 'dkoroma@school.com', phone: '+232-76-200-008', parent_phone: '+232-76-300-008' },
    { id: 'student-9', name: 'Isatu Turay', roll: 'JSS1-004', class: 'JSS1', email: 'ituray@school.com', phone: '+232-76-200-009', parent_phone: '+232-76-300-009' },
    { id: 'student-10', name: 'Abu Mansaray', roll: 'JSS1-005', class: 'JSS1', email: 'amansaray@school.com', phone: '+232-76-200-010', parent_phone: '+232-76-300-010' },
    
    // SSS Science students
    { id: 'student-11', name: 'Chioma Student', roll: 'SSS1-SCI-001', class: 'SSS1-Science', email: 'student-sss-science@school.com', phone: '+232-76-200-011', parent_phone: '+232-76-300-011' },
    { id: 'student-12', name: 'Abdul Rahman', roll: 'SSS1-SCI-002', class: 'SSS1-Science', email: 'arahman@school.com', phone: '+232-76-200-012', parent_phone: '+232-76-300-012' },
    { id: 'student-13', name: 'Hawa Bah', roll: 'SSS1-SCI-003', class: 'SSS1-Science', email: 'hbah@school.com', phone: '+232-76-200-013', parent_phone: '+232-76-300-013' },
    { id: 'student-14', name: 'Foday Dumbuya', roll: 'SSS1-SCI-004', class: 'SSS1-Science', email: 'fdumbuya@school.com', phone: '+232-76-200-014', parent_phone: '+232-76-300-014' },
    { id: 'student-15', name: 'Kadiatu Sesay', roll: 'SSS1-SCI-005', class: 'SSS1-Science', email: 'ksesay@school.com', phone: '+232-76-200-015', parent_phone: '+232-76-300-015' },
    
    // SSS Commercial students
    { id: 'student-16', name: 'Adebayo Student', roll: 'SSS2-COM-001', class: 'SSS2-Commercial', email: 'student-sss-commercial@school.com', phone: '+232-76-200-016', parent_phone: '+232-76-300-016' },
    { id: 'student-17', name: 'Mamie Koroma', roll: 'SSS2-COM-002', class: 'SSS2-Commercial', email: 'makoroma@school.com', phone: '+232-76-200-017', parent_phone: '+232-76-300-017' },
    { id: 'student-18', name: 'Alhaji Bah', roll: 'SSS2-COM-003', class: 'SSS2-Commercial', email: 'abah@school.com', phone: '+232-76-200-018', parent_phone: '+232-76-300-018' },
    { id: 'student-19', name: 'Zainab Kamara', roll: 'SSS2-COM-004', class: 'SSS2-Commercial', email: 'zkamara@school.com', phone: '+232-76-200-019', parent_phone: '+232-76-300-019' },
    { id: 'student-20', name: 'Samuel Johnson', roll: 'SSS2-COM-005', class: 'SSS2-Commercial', email: 'sjohnson@school.com', phone: '+232-76-200-020', parent_phone: '+232-76-300-020' },
  ];

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO students (id, name, roll, class, email, phone, parent_phone, date_of_birth, address)
    VALUES (?, ?, ?, ?, ?, ?, ?, date('now', '-' || (14 + abs(random() % 6)) || ' years'), 'Freetown, Sierra Leone')
  `);

  for (const s of students) {
    stmt.run(s.id, s.name, s.roll, s.class, s.email, s.phone, s.parent_phone);
  }
  
  console.log(`  ✓ ${students.length} students seeded`);
};

// ============ SEED USERS ============
const seedUsers = () => {
  console.log('👤 Seeding users...');
  
  const bcrypt = require('bcrypt');
  const hashedPassword = bcrypt.hashSync('password', 10);
  
  const users = [
    // Admin users
    { id: '1', email: 'admin@school.com', full_name: 'Principal Admin', role: 'admin', admin_type: 'ceo', assigned_schools: '["primary","junior_secondary","senior_secondary"]', is_super_user: 1, phone: '+232-76-000-100' },
    { id: '1a', email: 'principal@school.com', full_name: 'Dr. Sarah Principal', role: 'admin', admin_type: 'principal', assigned_schools: '["junior_secondary","senior_secondary"]', is_super_user: 0, phone: '+232-76-000-101' },
    { id: '1b', email: 'regularadmin@school.com', full_name: 'John Regular Admin', role: 'admin', admin_type: 'admin', assigned_schools: '["senior_secondary"]', is_super_user: 0, phone: '+232-76-000-102' },
    
    // Teacher users
    { id: '2', email: 'teacher@school.com', full_name: 'John Teacher', role: 'teacher', teacher_type: 'regular', school_level: 'primary', phone: '+232-76-100-001' },
    { id: '2a', email: 'classteacher@school.com', full_name: 'Sarah ClassTeacher', role: 'teacher', teacher_type: 'class_teacher', school_level: 'secondary', phone: '+232-76-100-002' },
    { id: '2b', email: 'subjecthead@school.com', full_name: 'Dr. Michael SubjectHead', role: 'teacher', teacher_type: 'subject_head', school_level: 'secondary', phone: '+232-76-100-003' },
    { id: '2c', email: 'depthead@school.com', full_name: 'Prof. Rachel DeptHead', role: 'teacher', teacher_type: 'departmental_head', school_level: 'secondary', phone: '+232-76-100-004' },
    
    // Student users
    { id: '3', email: 'student-primary@school.com', full_name: 'Jane Student (Primary)', role: 'student', school_level: 'primary', class_id: 'prim-class4', class_name: 'Class 4' },
    { id: '5', email: 'student-jss@school.com', full_name: 'Ahmad Student (JSS)', role: 'student', school_level: 'secondary', class_id: 'jss-form1', class_name: 'JSS1' },
    { id: '6', email: 'student-sss-science@school.com', full_name: 'Chioma Student (Science)', role: 'student', school_level: 'secondary', class_id: 'sss-1-sci', class_name: 'SSS1', stream: 'science' },
    { id: '7', email: 'student-sss-commercial@school.com', full_name: 'Adebayo Student (Commercial)', role: 'student', school_level: 'secondary', class_id: 'sss-2-com', class_name: 'SSS2', stream: 'commercial' },
    
    // Parent user
    { id: '4', email: 'parent@school.com', full_name: 'John Parent', role: 'parent', children: '["3","5"]', phone: '+232-76-400-001' },
  ];

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO users (
      id, email, password, full_name, role, admin_type, teacher_type,
      school_level, class_id, class_name, stream, assigned_schools,
      is_super_user, children, phone, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);

  for (const u of users) {
    stmt.run(
      u.id, u.email, hashedPassword, u.full_name, u.role,
      u.admin_type || null, u.teacher_type || null,
      u.school_level || null, u.class_id || null, u.class_name || null,
      u.stream || null, u.assigned_schools || '[]',
      u.is_super_user || 0, u.children || '[]', u.phone || null
    );
  }
  
  console.log(`  ✓ ${users.length} users seeded`);
};

// ============ SEED TIMETABLE ============
const seedTimetable = () => {
  console.log('📅 Seeding timetable...');
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = [
    { number: 1, start: '08:00', end: '08:45' },
    { number: 2, start: '08:50', end: '09:35' },
    { number: 3, start: '09:40', end: '10:25' },
    { number: 4, start: '10:40', end: '11:25' },
    { number: 5, start: '11:30', end: '12:15' },
    { number: 6, start: '13:00', end: '13:45' },
  ];

  const classSchedules = [
    { class: 'Class 4', subjects: ['subj-math-prim', 'subj-eng-prim', 'subj-sci-prim', 'subj-ss-prim'], teacher: 'teacher-1', room: 'P-101' },
    { class: 'JSS1', subjects: ['subj-math-jss', 'subj-eng-jss', 'subj-isci-jss', 'subj-ss-jss', 'subj-ca-jss'], teacher: 'teacher-2', room: 'J-201' },
    { class: 'SSS1-Science', subjects: ['subj-phy-sss', 'subj-chem-sss', 'subj-bio-sss', 'subj-math-sss', 'subj-eng-sss'], teacher: 'teacher-3', room: 'S-301' },
  ];

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO timetable (id, class, day, period_number, start_time, end_time, subject_id, teacher_id, room_number)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let count = 0;
  for (const schedule of classSchedules) {
    for (const day of days) {
      for (const period of periods) {
        const subjectIndex = (period.number - 1 + days.indexOf(day)) % schedule.subjects.length;
        const id = `tt-${schedule.class}-${day}-${period.number}`.replace(/\s/g, '');
        stmt.run(id, schedule.class, day, period.number, period.start, period.end, schedule.subjects[subjectIndex], schedule.teacher, schedule.room);
        count++;
      }
    }
  }
  
  console.log(`  ✓ ${count} timetable entries seeded`);
};

// ============ SEED ATTENDANCE ============
const seedAttendance = () => {
  console.log('📋 Seeding attendance...');
  
  const students = db.prepare('SELECT id, class FROM students WHERE is_deleted = 0').all();
  
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO attendance (id, student_id, class, date, morning_status, afternoon_status, remarks, marked_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let count = 0;
  // Generate attendance for last 5 days
  for (let d = 1; d <= 5; d++) {
    const date = new Date();
    date.setDate(date.getDate() - d);
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    const dateStr = date.toISOString().split('T')[0];
    
    for (const student of students) {
      const morningStatus = Math.random() > 0.15 ? 'present' : (Math.random() > 0.5 ? 'absent' : 'leave');
      const afternoonStatus = Math.random() > 0.1 ? 'present' : 'absent';
      const id = `att-${student.id}-${dateStr}`;
      
      stmt.run(id, student.id, student.class, dateStr, morningStatus, afternoonStatus, null, 'system-seed');
      count++;
    }
  }
  
  console.log(`  ✓ ${count} attendance records seeded`);
};

// ============ SEED COURSES ============
const seedCourses = () => {
  console.log('📚 Seeding courses...');
  
  const courses = [
    { id: 'course-1', name: 'Mathematics Foundation', code: 'MATH-101', description: 'Basic mathematics for primary students', credits: 3, teacher_id: 'teacher-1', semester: 1 },
    { id: 'course-2', name: 'English Literature', code: 'ENG-201', description: 'English literature for junior secondary', credits: 4, teacher_id: 'teacher-2', semester: 1 },
    { id: 'course-3', name: 'Advanced Physics', code: 'PHY-301', description: 'Advanced physics for senior secondary science', credits: 5, teacher_id: 'teacher-3', semester: 1 },
    { id: 'course-4', name: 'Chemistry Principles', code: 'CHEM-301', description: 'Chemistry for senior secondary science', credits: 5, teacher_id: 'teacher-4', semester: 1 },
    { id: 'course-5', name: 'Financial Accounting', code: 'ACC-301', description: 'Accounting for commercial students', credits: 4, teacher_id: 'teacher-6', semester: 1 },
  ];

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO courses (id, name, code, description, credits, teacher_id, semester)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const c of courses) {
    stmt.run(c.id, c.name, c.code, c.description, c.credits, c.teacher_id, c.semester);
  }
  
  console.log(`  ✓ ${courses.length} courses seeded`);
};

// ============ SEED GRADES ============
const seedGrades = () => {
  console.log('📝 Seeding grades...');
  
  const students = db.prepare('SELECT id, class FROM students WHERE is_deleted = 0').all();
  const subjects = db.prepare('SELECT id, class FROM subjects WHERE is_deleted = 0').all();
  
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO grades (id, student_id, subject_id, class_id, score, grade, term, academic_year, exam_type, graded_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let count = 0;
  for (const student of students) {
    const matchingSubjects = subjects.filter(s => s.class === student.class);
    for (const subject of matchingSubjects) {
      const score = Math.floor(50 + Math.random() * 50); // 50-100
      let grade;
      if (score >= 90) grade = 'A';
      else if (score >= 80) grade = 'B';
      else if (score >= 70) grade = 'C';
      else if (score >= 60) grade = 'D';
      else grade = 'F';
      
      const id = `grade-${student.id}-${subject.id}-term1`;
      stmt.run(id, student.id, subject.id, student.class, score, grade, 'Term 1', '2025-2026', 'midterm', 'system-seed');
      count++;
    }
  }
  
  console.log(`  ✓ ${count} grade records seeded`);
};

// ============ SEED ASSIGNMENTS ============
const seedAssignments = () => {
  console.log('📄 Seeding assignments...');
  
  const assignments = [
    { title: 'Mathematics Homework 1', description: 'Complete exercises 1-20 from Chapter 5', class_id: 'Class 4', subject_id: 'subj-math-prim', teacher_id: 'teacher-1', due_date: '2026-04-01', max_score: 100 },
    { title: 'English Essay Writing', description: 'Write a 500-word essay on "My School"', class_id: 'Class 4', subject_id: 'subj-eng-prim', teacher_id: 'teacher-1', due_date: '2026-04-05', max_score: 50 },
    { title: 'Science Lab Report', description: 'Complete the report on photosynthesis experiment', class_id: 'JSS1', subject_id: 'subj-isci-jss', teacher_id: 'teacher-2', due_date: '2026-04-03', max_score: 100 },
    { title: 'Social Studies Project', description: 'Research on Sierra Leone history', class_id: 'JSS1', subject_id: 'subj-ss-jss', teacher_id: 'teacher-2', due_date: '2026-04-10', max_score: 80 },
    { title: 'Physics Problem Set', description: 'Complete Newton\'s Laws practice problems', class_id: 'SSS1-Science', subject_id: 'subj-phy-sss', teacher_id: 'teacher-3', due_date: '2026-04-02', max_score: 100 },
    { title: 'Chemistry Lab Report', description: 'Titration experiment report', class_id: 'SSS1-Science', subject_id: 'subj-chem-sss', teacher_id: 'teacher-4', due_date: '2026-04-07', max_score: 100 },
    { title: 'Accounting Exercise', description: 'Balance sheet preparation', class_id: 'SSS2-Commercial', subject_id: 'subj-acc-sss', teacher_id: 'teacher-6', due_date: '2026-04-08', max_score: 100 },
  ];

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO assignments (id, title, description, class_id, subject_id, teacher_id, due_date, max_score, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')
  `);

  for (let i = 0; i < assignments.length; i++) {
    const a = assignments[i];
    stmt.run(`assignment-${i + 1}`, a.title, a.description, a.class_id, a.subject_id, a.teacher_id, a.due_date, a.max_score);
  }
  
  console.log(`  ✓ ${assignments.length} assignments seeded`);
};

// ============ SEED CLASS ENROLLMENTS ============
const seedClassEnrollments = () => {
  console.log('📚 Seeding class enrollments...');
  
  const students = db.prepare('SELECT id, class FROM students WHERE is_deleted = 0').all();
  
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO class_enrollments (id, student_id, class_id, academic_year, status)
    VALUES (?, ?, ?, '2025-2026', 'active')
  `);

  for (const student of students) {
    stmt.run(`enroll-${student.id}`, student.id, student.class);
  }
  
  console.log(`  ✓ ${students.length} enrollments seeded`);
};

// ============ UPDATE SCHOOL COUNTS ============
const updateSchoolCounts = () => {
  console.log('🔢 Updating school counts...');
  
  // Update student counts per school level
  const primaryCount = db.prepare("SELECT COUNT(*) as c FROM students WHERE class LIKE 'Class%' AND is_deleted = 0").get().c;
  const jssCount = db.prepare("SELECT COUNT(*) as c FROM students WHERE class LIKE 'JSS%' AND is_deleted = 0").get().c;
  const sssCount = db.prepare("SELECT COUNT(*) as c FROM students WHERE (class LIKE 'SSS%') AND is_deleted = 0").get().c;
  
  db.prepare("UPDATE schools SET total_students = ? WHERE school_level = 'primary'").run(primaryCount);
  db.prepare("UPDATE schools SET total_students = ? WHERE school_level = 'junior_secondary'").run(jssCount);
  db.prepare("UPDATE schools SET total_students = ? WHERE school_level = 'senior_secondary'").run(sssCount);
  
  console.log('  ✓ School counts updated');
};

// ============ RUN ALL SEEDS ============
try {
  // Use a transaction for speed and atomicity
  const seedAll = db.transaction(() => {
    seedSchools();
    seedSubjects();
    seedTeachers();
    seedStudents();
    seedUsers();
    seedTimetable();
    seedAttendance();
    seedCourses();
    seedGrades();
    seedAssignments();
    seedClassEnrollments();
    updateSchoolCounts();
  });

  seedAll();

  // Print summary
  console.log('\n✅ Database seeding complete!\n');
  console.log('📊 Summary:');
  console.log(`  Schools:      ${db.prepare('SELECT COUNT(*) as c FROM schools').get().c}`);
  console.log(`  Users:        ${db.prepare('SELECT COUNT(*) as c FROM users').get().c}`);
  console.log(`  Students:     ${db.prepare('SELECT COUNT(*) as c FROM students WHERE is_deleted = 0').get().c}`);
  console.log(`  Teachers:     ${db.prepare('SELECT COUNT(*) as c FROM teachers WHERE is_deleted = 0').get().c}`);
  console.log(`  Subjects:     ${db.prepare('SELECT COUNT(*) as c FROM subjects WHERE is_deleted = 0').get().c}`);
  console.log(`  Courses:      ${db.prepare('SELECT COUNT(*) as c FROM courses WHERE is_deleted = 0').get().c}`);
  console.log(`  Grades:       ${db.prepare('SELECT COUNT(*) as c FROM grades WHERE is_deleted = 0').get().c}`);
  console.log(`  Assignments:  ${db.prepare('SELECT COUNT(*) as c FROM assignments WHERE is_deleted = 0').get().c}`);
  console.log(`  Attendance:   ${db.prepare('SELECT COUNT(*) as c FROM attendance WHERE is_deleted = 0').get().c}`);
  console.log(`  Timetable:    ${db.prepare('SELECT COUNT(*) as c FROM timetable WHERE is_deleted = 0').get().c}`);
  console.log(`  Enrollments:  ${db.prepare('SELECT COUNT(*) as c FROM class_enrollments').get().c}`);
  console.log('\n🔑 Demo Login Credentials (password for all: "password"):');
  console.log('  CEO Admin:      admin@school.com');
  console.log('  Principal:      principal@school.com');
  console.log('  Regular Admin:  regularadmin@school.com');
  console.log('  Teacher:        teacher@school.com');
  console.log('  Student:        student-primary@school.com');
  console.log('  Parent:         parent@school.com');
  
} catch (error) {
  console.error('❌ Seed error:', error);
  process.exit(1);
}
