const express = require('express');
const router = express.Router();
const SyncService = require('../services/syncService');
const { isOnline } = require('../database/firebase');

// Sync all pending records
router.post('/sync-all', async (req, res) => {
  try {
    const result = await SyncService.syncAll();

    res.json({
      success: result.success,
      message: result.message,
      synced: result.synced,
      failed: result.failed
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get sync status
router.get('/status', (req, res) => {
  try {
    const status = SyncService.getSyncStatus();

    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Check connection status
router.get('/connection-status', async (req, res) => {
  try {
    const online = await isOnline();

    res.json({
      success: true,
      online,
      message: online ? 'Online' : 'Offline'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      online: false
    });
  }
});

// Batch sync
router.post('/batch-sync', async (req, res) => {
  try {
    const { records } = req.body;

    if (!Array.isArray(records)) {
      return res.status(400).json({
        success: false,
        message: 'Records must be an array'
      });
    }

    const result = await SyncService.batchSync(records);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
