const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const dotenv = require('dotenv');
<<<<<<< HEAD
=======
const path = require('path');
>>>>>>> 041b17aa (modification)

// Load environment variables
dotenv.config();

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
app.use('/api/school-structure', require('./routes/schoolStructure'));

// ============ 404 HANDLER ============
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
  });
});

// ============ ERROR HANDLER ============
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {},
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
  
  app.listen(availablePort, () => {
    console.log(`
╔═══════════════════════════════════════╗
║  EduPlus Admin Backend API            ║
║  Server running on port ${availablePort}        ║
║  Environment: ${process.env.NODE_ENV || 'development'}          ║
║  Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}
╚═══════════════════════════════════════╝
    `);
  });
})();
>>>>>>> 041b17aa (modification)

module.exports = app;
