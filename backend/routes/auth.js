const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const schoolStructure = require('../config/schoolStructure');

// Mock user database (replace with real database)
// Updated with proper school hierarchy structure
const users = [
  // ADMIN
  {
    id: '1',
    email: 'admin@school.com',
    password: 'password', // In real app, this should be hashed
    name: 'Principal Admin',
    role: 'admin',
    isSuperUser: true,
    phone: '+1-800-123-4567',
    address: '123 Education Street, School City',
    joinDate: '2023-01-15'
  },

  // REGULAR TEACHER (Primary School - Class 4)
  {
    id: '2',
    email: 'teacher@school.com',
    password: 'password',
    name: 'John Teacher',
    role: 'teacher',
    teacherType: 'regular',
    schoolLevel: 'primary',
    section: 'primary_classes',
    assignedClasses: [
      {
        classId: 'prim-class4',
        className: 'Class 4',
        className_full: 'Primary - Class 4'
      }
    ],
    subjects: ['Mathematics', 'English Language', 'Science'],
    phone: '+1-800-987-6543',
    department: 'Primary Section'
  },

  // CLASS TEACHER (Junior Secondary - Form 1)
  {
    id: '2a',
    email: 'classteacher@school.com',
    password: 'password',
    name: 'Sarah ClassTeacher',
    role: 'teacher',
    teacherType: 'class_teacher',
    schoolLevel: 'secondary',
    section: 'junior_secondary',
    classId: 'jss-form1',
    className: 'Form 1 (JSS1)',
    className_full: 'Secondary - Junior Secondary - Form 1 (JSS1)',
    students: ['3', '5', '6', '7'], // Student IDs under this class
    subjects: ['English Language', 'Social Studies', 'Creative Arts'],
    phone: '+1-800-111-2222',
    department: 'Secondary Section'
  },

  // SUBJECT HEAD (Senior Secondary - Science Stream)
  {
    id: '2b',
    email: 'subjecthead@school.com',
    password: 'password',
    name: 'Dr. Michael SubjectHead',
    role: 'teacher',
    teacherType: 'subject_head',
    schoolLevel: 'secondary',
    section: 'senior_secondary',
    stream: 'science',
    headingSubject: 'Physics',
    assignedClasses: [
      { classId: 'sss-1-sci', className: 'SSS1', stream: 'science', className_full: 'Secondary - Senior Secondary - SSS1 (Science)' },
      { classId: 'sss-2-sci', className: 'SSS2', stream: 'science', className_full: 'Secondary - Senior Secondary - SSS2 (Science)' },
      { classId: 'sss-3-sci', className: 'SSS3', stream: 'science', className_full: 'Secondary - Senior Secondary - SSS3 (Science)' }
    ],
    subjects: ['Physics', 'Advanced Physics'],
    phone: '+1-800-333-4444',
    department: 'Sciences',
    responsibleFor: ['curriculum development', 'subject assessment', 'teacher coordination']
  },

  // DEPARTMENTAL HEAD (Science Department)
  {
    id: '2c',
    email: 'depthead@school.com',
    password: 'password',
    name: 'Prof. Rachel DeptHead',
    role: 'teacher',
    teacherType: 'departmental_head',
    schoolLevel: 'secondary',
    section: 'senior_secondary',
    department: 'Sciences',
    headOfDepartment: true,
    subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics'],
    subjectTeachers: ['2b', '2', '8', '9'], // IDs of teachers under this department
    assignedClasses: [
      { classId: 'sss-1-sci', className: 'SSS1', stream: 'science' },
      { classId: 'sss-1-com', className: 'SSS1', stream: 'commercial' },
      { classId: 'sss-2-sci', className: 'SSS2', stream: 'science' },
      { classId: 'sss-2-com', className: 'SSS2', stream: 'commercial' },
      { classId: 'sss-3-sci', className: 'SSS3', stream: 'science' },
      { classId: 'sss-3-com', className: 'SSS3', stream: 'commercial' }
    ],
    phone: '+1-800-555-6666',
    responsibilities: ['budget management', 'staff coordination', 'curriculum oversight', 'performance evaluation']
  },

  // STUDENT (Primary School - Class 4)
  {
    id: '3',
    email: 'student-primary@school.com',
    password: 'password',
    name: 'Jane Student (Primary)',
    role: 'student',
    schoolLevel: 'primary',
    section: 'primary_classes',
    classId: 'prim-class4',
    className: 'Class 4',
    className_full: 'Primary - Class 4',
    stream: null,
    subjects: ['Mathematics', 'English Language', 'Science', 'Social Studies'],
    enrollmentDate: '2023-09-01'
  },

  // STUDENT (Secondary - Junior Secondary Form 1)
  {
    id: '5',
    email: 'student-jss@school.com',
    password: 'password',
    name: 'Ahmad Student (JSS)',
    role: 'student',
    schoolLevel: 'secondary',
    section: 'junior_secondary',
    classId: 'jss-form1',
    className: 'Form 1 (JSS1)',
    className_full: 'Secondary - Junior Secondary - Form 1 (JSS1)',
    stream: null,
    subjects: ['English Language', 'Mathematics', 'Integrated Science', 'Social Studies', 'Creative Arts'],
    enrollmentDate: '2023-09-01'
  },

  // STUDENT (Secondary - Senior Secondary Science Stream)
  {
    id: '6',
    email: 'student-sss-science@school.com',
    password: 'password',
    name: 'Chioma Student (Science)',
    role: 'student',
    schoolLevel: 'secondary',
    section: 'senior_secondary',
    classId: 'sss-1-sci',
    className: 'SSS1',
    className_full: 'Secondary - Senior Secondary - SSS1 (Science)',
    stream: 'science',
    subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English Language'],
    enrollmentDate: '2023-09-01'
  },

  // STUDENT (Secondary - Senior Secondary Commercial Stream)
  {
    id: '7',
    email: 'student-sss-commercial@school.com',
    password: 'password',
    name: 'Adebayo Student (Commercial)',
    role: 'student',
    schoolLevel: 'secondary',
    section: 'senior_secondary',
    classId: 'sss-2-com',
    className: 'SSS2',
    className_full: 'Secondary - Senior Secondary - SSS2 (Commercial)',
    stream: 'commercial',
    subjects: ['Accounting', 'Business Studies', 'Economics', 'Mathematics', 'English Language'],
    enrollmentDate: '2023-09-01'
  },

  // PARENT
  {
    id: '4',
    email: 'parent@school.com',
    password: 'password',
    name: 'John Parent',
    role: 'parent',
    children: ['3', '5'] // IDs of student children (one primary, one JSS)
  }
];

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * POST /api/auth/login
 * Login user and return JWT token
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // In production, use bcrypt to compare hashed passwords
    // const passwordMatch = await bcrypt.compare(password, user.password);
    // For demo, do simple comparison
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  }
});

/**
 * POST /api/auth/register
 * Register new user with school hierarchy validation
 */
router.post('/register', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      role, 
      teacherType,
      schoolLevel,
      section,
      classId,
      className,
      stream,
      phone 
    } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and role are required'
      });
    }

    // Check if user already exists
    if (users.some(u => u.email === email)) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Validate school hierarchy if role is student or teacher
    if ((role === 'student' || role === 'teacher') && schoolLevel && section) {
      const isValid = schoolStructure.isValidClassAssignment(
        schoolLevel,
        section,
        className,
        stream
      );

      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid school hierarchy assignment'
        });
      }
    }

    // Create new user based on role
    let newUser = {
      id: Date.now().toString(),
      email,
      password, // In production, hash this with bcrypt
      name,
      role,
      phone: phone || null,
      createdAt: new Date()
    };

    // Add role-specific fields
    if (role === 'student') {
      newUser = {
        ...newUser,
        schoolLevel: schoolLevel || null,
        section: section || null,
        classId: classId || null,
        className: className || null,
        stream: stream || null,
        subjects: [],
        enrollmentDate: new Date()
      };
    } else if (role === 'teacher') {
      newUser = {
        ...newUser,
        teacherType: teacherType || 'regular',
        schoolLevel: schoolLevel || null,
        section: section || null,
        assignedClasses: classId ? [{
          classId,
          className,
          stream: stream || null
        }] : [],
        subjects: [],
        department: null
      };
    }

    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      success: false,
      message: 'An error occurred during registration'
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user (requires token)
 */
router.get('/me', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user and invalidate token
 */
router.post('/logout', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Verify token is valid before logout
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Token is successfully verified and logout is complete
    // In a production app, you would:
    // 1. Add token to blacklist/revocation list
    // 2. Clear user session from database
    // 3. Clear any cached user data

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({
      success: false,
      message: 'An error occurred during logout'
    });
  }
});

module.exports = router;
