const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const dotenv = require('dotenv');
<<<<<<< HEAD
=======
const path = require('path');
<<<<<<< HEAD
>>>>>>> 041b17aa (modification)
=======
const rateLimit = require('express-rate-limit');
>>>>>>> 5469f3f1 (chore: update gitignore and remove sensitive files)

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

<<<<<<< HEAD
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database initialization
const { initializeLocalDB } = require('./database/local');
const { initializeFirebase } = require('./database/firebase');

// Initialize databases
initializeLocalDB();
initializeFirebase();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/timetable', require('./routes/timetable'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/devices', require('./routes/devices'));
app.use('/api/sync', require('./routes/sync'));
app.use('/api/health', require('./routes/health'));
app.use('/api/school-structure', require('./routes/schoolStructure'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════╗
  ║  EduPlus Admin Backend API        ║
  ║  Server running on port ${PORT}      ║
  ║  Environment: ${process.env.NODE_ENV || 'development'}    ║
  ╚═══════════════════════════════════╝
  `);
});
=======
// ============ INITIALIZE DATABASE ============
const { initializeLocalDB } = require('./database/local');
initializeLocalDB();

const app = express();
const PORT = process.env.BACKEND_PORT || 5001;

// ============ SECURITY MIDDLEWARE ============
app.use(helmet());
app.use(compression());

// ============ CORS CONFIGURATION ============
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(u => u.trim());
// Also allow common Vite fallback ports (5174, 5175)
['http://localhost:5174', 'http://localhost:5175'].forEach(u => {
  if (!allowedOrigins.includes(u)) allowedOrigins.push(u);
});

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ============ BODY PARSER ============
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ============ RATE LIMITING (E-5) ============
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', generalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 login attempts per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts, please try again later.' }
});
app.use('/api/auth/login', authLimiter);

// ============ REQUEST LOGGING ============
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
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
    timestamp: new Date().toISOString(),
  });
});

// ============ PUBLIC ROUTES (NO AUTH REQUIRED) ============
app.use('/api/auth', require('./routes/auth'));

// ============ PROTECTED ROUTES ============
const { authMiddleware } = require('./middleware/auth');

app.use('/api/users', authMiddleware, require('./routes/users'));
app.use('/api/schools', authMiddleware, require('./routes/schools'));
app.use('/api/dashboard', authMiddleware, require('./routes/dashboard'));
app.use('/api/classes', authMiddleware, require('./routes/classes'));
app.use('/api/assignments', authMiddleware, require('./routes/assignments'));
app.use('/api/attendance', authMiddleware, require('./routes/attendance'));
app.use('/api/grades', authMiddleware, require('./routes/grades'));
app.use('/api/reports', authMiddleware, require('./routes/reports'));
app.use('/api/students', authMiddleware, require('./routes/students'));
app.use('/api/teachers', authMiddleware, require('./routes/teachers'));
app.use('/api/subjects', authMiddleware, require('./routes/subjects'));
app.use('/api/timetable', authMiddleware, require('./routes/timetable'));
app.use('/api/courses', authMiddleware, require('./routes/courses'));
app.use('/api/devices', authMiddleware, require('./routes/devices'));
app.use('/api/sync', authMiddleware, require('./routes/sync'));
app.use('/api/school-structure', authMiddleware, require('./routes/schoolStructure'));
app.use('/api/analytics', authMiddleware, require('./routes/analytics'));

// ============ 404 HANDLER ============
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
  });
});

// ============ ERROR HANDLER (A-11 fix: only leak stack in development) ============
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const isDev = process.env.NODE_ENV === 'development';
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(isDev && { error: err.stack }),
  });
});

// ============ FIND AVAILABLE PORT ============
const net = require('net');

function findAvailablePort(startPort) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(findAvailablePort(startPort + 1));
      } else {
        resolve(startPort);
      }
    });
  });
}

// ============ START SERVER ============
(async () => {
  const availablePort = await findAvailablePort(PORT);
  
  if (availablePort !== Number(PORT)) {
    console.warn(`⚠️  Port ${PORT} is busy, using port ${availablePort} instead`);
  }

  const server = app.listen(availablePort, () => {
    console.log(`
╔═══════════════════════════════════════╗
║  EduPlus Admin Backend API            ║
║  Server running on port ${availablePort}        ║
║  Environment: ${process.env.NODE_ENV || 'development'}          ║
║  Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}
╚═══════════════════════════════════════╝
    `);
  });

  // ============ GRACEFUL SHUTDOWN (E-8) ============
  const gracefulShutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log('HTTP server closed.');
      try {
        const { db } = require('./database/local');
        if (db && typeof db.close === 'function') {
          db.close();
          console.log('Database connection closed.');
        }
      } catch (e) { /* ignore */ }
      process.exit(0);
    });
    // Force exit after 10 seconds
    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
})();
>>>>>>> 041b17aa (modification)

module.exports = app;
