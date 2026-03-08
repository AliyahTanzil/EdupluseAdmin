const express = require('express');
const router = express.Router();

// Health check
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

router.get('/ready', (req, res) => {
  res.json({
    success: true,
    message: 'API is ready',
    status: 'operational'
  });
});

module.exports = router;
