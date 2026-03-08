const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const dotenv = require('dotenv');

dotenv.config();

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
app.use('/api/students', require('./routes/students'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/timetable', require('./routes/timetable'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/devices', require('./routes/devices'));
app.use('/api/sync', require('./routes/sync'));
app.use('/api/health', require('./routes/health'));

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

module.exports = app;
