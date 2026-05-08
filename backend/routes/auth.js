const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const schoolStructure = require('../config/schoolStructure');
const { TEACHER_ROLES, ADMIN_ROLES, USER_TYPES, SCHOOL_TYPES } = require('../config/rbac');
const { JWT_SECRET } = require('../config/security');
const { authMiddleware } = require('../middleware/auth');

// ============ TOKEN BLACKLIST ============
const tokenBlacklist = new Set();

// Clean up expired tokens from blacklist periodically (every 1 hour)
setInterval(() => {
  const now = Math.floor(Date.now() / 1000);
  for (const entry of tokenBlacklist) {
    try {
      const decoded = jwt.decode(entry);
      if (decoded && decoded.exp && decoded.exp < now) {
        tokenBlacklist.delete(entry);
      }
    } catch (e) {
      tokenBlacklist.delete(entry);
    }
  }
}, 60 * 60 * 1000);

/**
 * Check if a token is blacklisted
 */
const isTokenBlacklisted = (token) => tokenBlacklist.has(token);

// Export for use by auth middleware
router.isTokenBlacklisted = isTokenBlacklisted;

// Mock user database (replace with real database)
// Passwords are hashed with bcrypt (A-5 fix)
let usersInitialized = false;
const users = [
  // ADMIN - CEO (Super Admin with all school access)
  {
    id: '1',
    email: 'admin@school.com',
    password: 'password', // Will be hashed at startup
    name: 'Principal Admin',
    role: 'admin',
    adminType: 'ceo',
    assignedSchools: ['nursery', 'primary', 'junior_secondary', 'senior_secondary'],
    isSuperUser: true,
    phone: '+1-800-123-4567',
    address: '123 Education Street, School City',
    joinDate: '2023-01-15'
  },

  // ADMIN - PRINCIPAL (Can manage Junior and Senior Secondary)
  {
    id: '1a',
    email: 'principal@school.com',
    password: 'password',
    name: 'Dr. Sarah Principal',
    role: 'admin',
    adminType: 'principal',
    assignedSchools: ['junior_secondary', 'senior_secondary'],
    isSuperUser: false,
    phone: '+1-800-234-5678',
    address: '456 School Road, Education City',
    joinDate: '2023-02-01'
  },

  // ADMIN - REGULAR ADMIN (Can manage single school)
  {
    id: '1b',
    email: 'regularadmin@school.com',
    password: 'password',
    name: 'John Regular Admin',
    role: 'admin',
    adminType: 'admin',
    assignedSchools: ['senior_secondary'],
    isSuperUser: false,
    phone: '+1-800-345-6789',
    address: '789 Academy Street, Learning City',
    joinDate: '2023-03-01'
  },

  // REGULAR TEACHER
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

  // PARENT
  {
    id: '4',
    email: 'parent@school.com',
    password: 'password',
    name: 'John Parent',
    role: 'parent',
    children: ['3', '5']
  }
];

// Hash all demo user passwords at startup
(async () => {
  if (usersInitialized) return;
  for (const user of users) {
    if (user.password && !user.password.startsWith('$2b$')) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  }
  usersInitialized = true;
  console.log('✓ Demo user passwords hashed with bcrypt');
})();

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

    // Use bcrypt to compare hashed passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Determine user type and school type based on user object
    let userType = USER_TYPES.ADMIN;
    let schoolType = SCHOOL_TYPES.PRIMARY;
    let roleObj = null;

    if (user.role === 'teacher') {
      userType = USER_TYPES.TEACHER;
      schoolType = user.schoolLevel === 'primary' ? SCHOOL_TYPES.PRIMARY : SCHOOL_TYPES.SENIOR_SECONDARY;
      
      if (user.teacherType === 'class_teacher') {
        roleObj = TEACHER_ROLES.CLASS_MASTER;
      } else {
        roleObj = TEACHER_ROLES.ORDINARY_TEACHER;
      }
    } else if (user.role === 'admin') {
      userType = USER_TYPES.ADMIN;
      schoolType = user.schoolLevel === 'primary' ? SCHOOL_TYPES.PRIMARY : SCHOOL_TYPES.SENIOR_SECONDARY;
      
      if (schoolType === SCHOOL_TYPES.PRIMARY) {
        roleObj = ADMIN_ROLES.HEAD_MASTER;
      } else {
        roleObj = ADMIN_ROLES.PRINCIPAL;
      }
    } else {
      userType = user.role;
      roleObj = { id: user.role, name: user.role };
    }

    // Generate JWT token with enhanced payload
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        userType,
        schoolType,
        roleId: roleObj?.id,
        adminType: user.adminType || null,
        assignedSchools: user.assignedSchools || [],
        isSuperUser: user.isSuperUser || false,
        teacherType: user.teacherType || null,
        schoolLevel: user.schoolLevel || null,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    const responseUser = {
      ...userWithoutPassword,
      userType,
      schoolType,
      role: roleObj || { id: user.role, name: user.role },
      adminType: user.adminType || undefined,
      assignedSchools: user.assignedSchools || [],
      isSuperUser: user.isSuperUser || false
    };

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: responseUser
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
 */
router.post('/register', async (req, res) => {
  try {
    const { 
      name, email, password, role, teacherType, schoolLevel, section, 
      classId, className, stream, phone, adminType, assignedSchools 
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and role are required'
      });
    }

    if (users.some(u => u.email === email)) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      name,
      role,
      phone: phone || null,
      teacherType: teacherType || (role === 'teacher' ? 'regular' : null),
      schoolLevel: schoolLevel || null,
      section: section || null,
      classId: classId || null,
      className: className || null,
      stream: stream || null,
      adminType: adminType || (role === 'admin' ? 'admin' : null),
      assignedSchools: assignedSchools || [],
      isSuperUser: adminType === 'ceo',
      createdAt: new Date()
    };

    users.push(newUser);

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
 */
router.get('/me', authMiddleware, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.id);

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

    tokenBlacklist.add(token);

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
