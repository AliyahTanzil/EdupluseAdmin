# ⚙️ Backend Development Guide & API Implementation

**Version:** 1.0.0  
**Target:** Node.js/Express Backend  
**Status:** Ready for Development

---

## Backend Architecture Overview

### Server Structure
```
backend/
├── server.js                 # Entry point
├── middleware/
│   ├── auth.js              # JWT verification
│   ├── permissions.js       # RBAC enforcement
│   └── errorHandler.js      # Error handling
├── routes/
│   ├── auth.js              # Authentication
│   ├── users.js             # User management
│   ├── schools.js           # School management
│   ├── dashboard.js         # Dashboard data
│   ├── classes.js           # Class management
│   ├── assignments.js       # Assignment management
│   └── reports.js           # Reports & analytics
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── schoolController.js
│   └── dashboardController.js
├── models/
│   ├── User.js
│   ├── School.js
│   ├── Class.js
│   ├── Assignment.js
│   └── AdminHierarchy.js
├── config/
│   ├── database.js
│   ├── jwt.js
│   └── constants.js
├── utils/
│   ├── validators.js
│   ├── permissions.js
│   └── helpers.js
├── database/
│   └── eduplus.db            # SQLite database
├── logs/
│   ├── error.log
│   └── access.log
└── package.json
```

---

## Server Setup (server.js)

```javascript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import schoolRoutes from './routes/schools.js';
import dashboardRoutes from './routes/dashboard.js';
import classRoutes from './routes/classes.js';
import assignmentRoutes from './routes/assignments.js';

// Middleware
import { authMiddleware } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.BACKEND_PORT || 5001;

// ============ SECURITY MIDDLEWARE ============
app.use(helmet()); // Security headers
app.use(compression()); // Gzip compression

// ============ CORS CONFIGURATION ============
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ============ BODY PARSER ============
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ============ REQUEST LOGGING ============
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// ============ HEALTH CHECK ============
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend server is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    version: '1.0.0',
  });
});

// ============ PUBLIC ROUTES ============
app.use('/api/auth', authRoutes);

// ============ PROTECTED ROUTES ============
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/schools', authMiddleware, schoolRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/classes', authMiddleware, classRoutes);
app.use('/api/assignments', authMiddleware, assignmentRoutes);

// ============ 404 HANDLER ============
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
  });
});

// ============ ERROR HANDLER ============
app.use(errorHandler);

// ============ START SERVER ============
app.listen(PORT, () => {
  console.log(`\n🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📚 API docs available at http://localhost:${PORT}/api-docs`);
  console.log(`✅ CORS enabled for ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`📊 Database: ${process.env.DATABASE_PATH || './database/eduplus.db'}\n`);
});

export default app;
```

---

## Authentication Middleware

```javascript
// middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No authentication token provided',
        code: 'NO_TOKEN',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user to request
    req.user = decoded;
    req.userId = decoded.id;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token has expired',
        code: 'TOKEN_EXPIRED',
      });
    }

    res.status(401).json({
      success: false,
      error: 'Invalid authentication token',
      code: 'INVALID_TOKEN',
    });
  }
};

export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    if (!allowedRoles.includes(req.user.adminType)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        code: 'PERMISSION_DENIED',
      });
    }

    next();
  };
};

export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    // Check if user has permission
    const user = new User();
    if (!user.hasPermission(req.user.id, permission)) {
      return res.status(403).json({
        success: false,
        error: 'Permission denied',
        code: 'PERMISSION_DENIED',
      });
    }

    next();
  };
};
```

---

## Authentication Routes (routes/auth.js)

```javascript
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js';

const router = express.Router();

// Mock users database
const mockUsers = [
  {
    id: '1',
    email: 'admin@school.com',
    password: 'password', // In production, use hashed
    fullName: 'CEO Admin',
    userType: 'admin',
    adminType: 'ceo',
    assignedSchools: ['primary', 'junior_secondary', 'senior_secondary'],
    isSuperUser: true,
    role: 'CEO Admin',
  },
  {
    id: '1a',
    email: 'principal@school.com',
    password: 'password',
    fullName: 'Principal User',
    userType: 'admin',
    adminType: 'principal',
    assignedSchools: ['junior_secondary', 'senior_secondary'],
    isSuperUser: false,
    role: 'Principal',
  },
  {
    id: '1b',
    email: 'regularadmin@school.com',
    password: 'password',
    fullName: 'Regular Admin',
    userType: 'admin',
    adminType: 'admin',
    assignedSchools: ['senior_secondary'],
    isSuperUser: false,
    role: 'Admin',
  },
  {
    id: '2',
    email: 'teacher@school.com',
    password: 'password',
    fullName: 'Teacher User',
    userType: 'teacher',
    role: 'Teacher',
  },
  {
    id: '3',
    email: 'student@school.com',
    password: 'password',
    fullName: 'Student User',
    userType: 'student',
    role: 'Student',
  },
  {
    id: '4',
    email: 'parent@school.com',
    password: 'password',
    fullName: 'Parent User',
    userType: 'parent',
    role: 'Parent',
  },
];

/**
 * POST /api/auth/login
 * Authenticate user with email and password
 */
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password required',
        code: 'INVALID_INPUT',
      });
    }

    // Find user
    const user = mockUsers.find((u) => u.email === email);

    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        userType: user.userType,
        adminType: user.adminType,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      token,
      user: {
        ...userWithoutPassword,
        expiresIn: 86400, // 24 hours in seconds
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      code: 'SERVER_ERROR',
    });
  }
});

/**
 * POST /api/auth/register
 * Register new user account
 */
router.post('/register', async (req, res) => {
  try {
    const {
      email,
      password,
      fullName,
      userType,
      adminType,
      schoolLevel,
    } = req.body;

    // Validate input
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and full name required',
        code: 'INVALID_INPUT',
      });
    }

    // Check if user exists
    if (mockUsers.find((u) => u.email === email)) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists',
        code: 'USER_EXISTS',
      });
    }

    // Create new user
    const newUser = {
      id: uuidv4(),
      email,
      password, // In production: await bcrypt.hash(password, 10)
      fullName,
      userType: userType || 'admin',
      adminType: adminType || 'admin',
      assignedSchools: schoolLevel ? [schoolLevel] : [],
      isSuperUser: false,
      role: adminType ? adminType.charAt(0).toUpperCase() + adminType.slice(1) : 'User',
      createdAt: new Date(),
    };

    // Add to mock database
    mockUsers.push(newUser);

    // Generate token
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        userType: newUser.userType,
        adminType: newUser.adminType,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      code: 'SERVER_ERROR',
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user (invalidate token)
 */
router.post('/logout', (req, res) => {
  // In production, you might want to blacklist the token
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * POST /api/auth/refresh
 * Refresh authentication token
 */
router.post('/refresh', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Authorization header required',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Generate new token
    const newToken = jwt.sign(
      {
        id: decoded.id,
        email: decoded.email,
        userType: decoded.userType,
        adminType: decoded.adminType,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token: newToken,
      expiresIn: 86400,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token',
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user profile
 */
router.get('/me', (req, res) => {
  try {
    const user = mockUsers.find((u) => u.id === req.user?.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
});

export default router;
```

---

## User Management Routes

```javascript
// routes/users.js
import express from 'express';
import { requireRole, requirePermission } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/users
 * Get all users (admin only)
 */
router.get('/', requireRole(['ceo', 'principal', 'admin']), (req, res) => {
  try {
    const { role, school, page = 1, limit = 20 } = req.query;

    // Mock users data
    const users = [
      {
        id: '2',
        email: 'teacher1@school.com',
        fullName: 'John Smith',
        userType: 'teacher',
        school: 'Senior Secondary',
        status: 'active',
        createdAt: '2024-01-15',
      },
      {
        id: '3',
        email: 'teacher2@school.com',
        fullName: 'Jane Doe',
        userType: 'teacher',
        school: 'Senior Secondary',
        status: 'active',
        createdAt: '2024-01-16',
      },
    ];

    res.json({
      success: true,
      data: users,
      total: users.length,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
});

/**
 * GET /api/users/:userId
 * Get user by ID
 */
router.get('/:userId', (req, res) => {
  try {
    const { userId } = req.params;

    // Mock user data
    const user = {
      id: userId,
      email: 'user@school.com',
      fullName: 'User Name',
      userType: 'teacher',
      school: 'Senior Secondary',
      phone: '+1234567890',
      status: 'active',
    };

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
});

/**
 * POST /api/users
 * Create new user
 */
router.post('/', requireRole(['ceo', 'principal', 'admin']), (req, res) => {
  try {
    const { email, fullName, userType, school } = req.body;

    if (!email || !fullName || !userType) {
      return res.status(400).json({
        success: false,
        error: 'Email, full name, and user type required',
      });
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      fullName,
      userType,
      school,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
});

/**
 * PUT /api/users/:userId
 * Update user
 */
router.put('/:userId', requireRole(['ceo', 'principal', 'admin']), (req, res) => {
  try {
    const { userId } = req.params;
    const { fullName, email, status } = req.body;

    const updatedUser = {
      id: userId,
      email: email || 'user@school.com',
      fullName: fullName || 'User Name',
      status: status || 'active',
      updatedAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
});

/**
 * DELETE /api/users/:userId
 * Delete user
 */
router.delete('/:userId', requireRole(['ceo', 'principal']), (req, res) => {
  try {
    const { userId } = req.params;

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
});

export default router;
```

---

## Dashboard Data Routes

```javascript
// routes/dashboard.js
import express from 'express';

const router = express.Router();

/**
 * GET /api/dashboard
 * Get dashboard data based on user role
 */
router.get('/', (req, res) => {
  try {
    const { type = 'student' } = req.query;
    const userId = req.user?.id;

    let dashboardData = {};

    if (type === 'admin' || type === 'ceo') {
      // Admin dashboard
      dashboardData = {
        statistics: {
          totalUsers: 2543,
          totalSchools: 3,
          activeToday: 1892,
          pendingTasks: 12,
        },
        charts: {
          userGrowth: [
            { month: 'Jan', users: 1200 },
            { month: 'Feb', users: 1900 },
            { month: 'Mar', users: 2100 },
          ],
          schoolDistribution: [
            { school: 'Primary', count: 450 },
            { school: 'Junior Secondary', count: 520 },
            { school: 'Senior Secondary', count: 680 },
          ],
        },
        recentActivity: [
          {
            user: 'John Smith',
            action: 'Created student account',
            timestamp: '2 hours ago',
          },
          {
            user: 'Jane Doe',
            action: 'Updated class settings',
            timestamp: '4 hours ago',
          },
        ],
      };
    } else if (type === 'student') {
      // Student dashboard
      dashboardData = {
        statistics: {
          enrolledClasses: 8,
          completedAssignments: 24,
          averageGrade: 'A-',
          attendance: 96,
        },
        classes: [
          {
            id: '1',
            name: 'Mathematics 101',
            teacher: 'Mr. Smith',
            schedule: 'MWF 9:00-10:30',
            students: 32,
          },
          {
            id: '2',
            name: 'English Literature',
            teacher: 'Ms. Johnson',
            schedule: 'TTh 10:00-11:30',
            students: 28,
          },
        ],
        recentAssignments: [
          {
            title: 'Calculus Problem Set',
            subject: 'Mathematics 101',
            dueDate: '2024-03-28',
            status: 'pending',
          },
          {
            title: 'Essay on Shakespeare',
            subject: 'English Literature',
            dueDate: '2024-03-25',
            status: 'submitted',
          },
        ],
        upcomingEvents: [
          {
            name: 'Quiz - Mathematics',
            date: '2024-03-22',
            time: '10:00 AM',
          },
          {
            name: 'Project Deadline',
            date: '2024-03-25',
            time: '5:00 PM',
          },
        ],
      };
    } else if (type === 'teacher') {
      // Teacher dashboard
      dashboardData = {
        statistics: {
          totalClasses: 4,
          totalStudents: 124,
          averageAttendance: 94,
          pendingGrades: 45,
        },
        classes: [
          {
            id: '1',
            name: 'Mathematics 101',
            level: 'Senior Secondary',
            students: 32,
            nextClass: '2024-03-22 at 9:00 AM',
          },
        ],
      };
    } else if (type === 'parent') {
      // Parent dashboard
      dashboardData = {
        statistics: {
          childrenEnrolled: 2,
          averageGrade: 'B+',
          attendance: 92,
          upcomingEvents: 5,
        },
        children: [
          {
            id: '1',
            name: 'Sarah Johnson',
            school: 'Senior Secondary',
            grade: 'A-',
            classes: 8,
          },
          {
            id: '2',
            name: 'Mike Johnson',
            school: 'Junior Secondary',
            grade: 'B+',
            classes: 6,
          },
        ],
      };
    }

    res.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
});

export default router;
```

---

## Error Handler Middleware

```javascript
// middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: message,
    code: err.code || 'SERVER_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
```

---

## Environment Variables (.env)

```bash
# Server Configuration
BACKEND_PORT=5001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# Database
DATABASE_PATH=./database/eduplus.db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRY=24h

# Firebase Configuration (Optional)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log
```

---

## Database Initialization Script

```javascript
// scripts/seed.js
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../database/eduplus.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    user_type TEXT NOT NULL,
    admin_type TEXT,
    assigned_schools TEXT,
    is_super_user BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Create schools table
db.exec(`
  CREATE TABLE IF NOT EXISTS schools (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    level TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    students_count INTEGER DEFAULT 0,
    teachers_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Create classes table
db.exec(`
  CREATE TABLE IF NOT EXISTS classes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    school_id TEXT NOT NULL,
    teacher_id TEXT NOT NULL,
    level TEXT NOT NULL,
    students_count INTEGER DEFAULT 0,
    schedule TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id),
    FOREIGN KEY (teacher_id) REFERENCES users(id)
  );
`);

// Create assignments table
db.exec(`
  CREATE TABLE IF NOT EXISTS assignments (
    id TEXT PRIMARY KEY,
    class_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATETIME NOT NULL,
    created_by TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
  );
`);

console.log('✅ Database initialized successfully');
db.close();
```

---

## Testing Backend API

```bash
# Test health endpoint
curl http://localhost:5001/health

# Test login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.com",
    "password": "password"
  }'

# Test get users (requires token)
curl http://localhost:5001/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Running the Backend

```bash
# Install dependencies
npm install --prefix backend

# Start development server
npm run dev:backend

# Start with seed data
npm run seed --prefix backend

# Run tests
npm test --prefix backend
```

---

**Next Steps:**
1. Set up the database schema
2. Implement all route handlers
3. Add form validation
4. Set up logging
5. Write integration tests

