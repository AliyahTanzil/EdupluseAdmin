const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database/local');
const syncService = require('../services/syncService');

// Get all devices
router.get('/', (req, res) => {
  try {
    const { status, location, limit = 50, offset = 0 } = req.query;

    const database = db.getDatabase();
    let query = 'SELECT * FROM devices WHERE is_deleted = 0';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (location) {
      query += ' AND location = ?';
      params.push(location);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const devices = database.prepare(query).all(...params);

    // Get count
    let countQuery = 'SELECT COUNT(*) as count FROM devices WHERE is_deleted = 0';
    const countParams = [];
    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }
    if (location) {
      countQuery += ' AND location = ?';
      countParams.push(location);
    }

    const { count } = database.prepare(countQuery).get(...countParams);

    res.status(200).json({
      success: true,
      data: devices,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ success: false, message: 'Error fetching devices' });
  }
});

// Get single device
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const device = db.getDevice(id);

    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }

    res.status(200).json({ success: true, data: device });
  } catch (error) {
    console.error('Error fetching device:', error);
    res.status(500).json({ success: false, message: 'Error fetching device' });
  }
});

// Register new device
router.post('/register', (req, res) => {
  try {
    const { device_id, name, location, device_type } = req.body;

    // Validation
    if (!device_id || !name || !location) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: device_id, name, location'
      });
    }

    // Check if device already exists
    const existing = db.getDeviceByDeviceId(device_id);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Device with this ID already exists'
      });
    }

    const id = uuidv4();
    const now = new Date().toISOString();

    const newDevice = {
      id,
      device_id,
      name,
      location,
      device_type: device_type || 'biometric',
      status: 'online',
      last_sync: now,
      created_at: now,
      updated_at: now,
      synced_at: null,
      is_deleted: 0
    };

    db.insertDevice(newDevice);
    syncService.addToSyncQueue('devices', 'INSERT', id);

    res.status(201).json({
      success: true,
      data: newDevice,
      message: 'Device registered successfully'
    });
  } catch (error) {
    console.error('Error registering device:', error);
    res.status(500).json({ success: false, message: 'Error registering device' });
  }
});

// Update device status
router.put('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['online', 'offline', 'inactive', 'error'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: online, offline, inactive, or error'
      });
    }

    const existing = db.getDevice(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }

    const now = new Date().toISOString();

    const updates = {
      status,
      last_sync: now,
      updated_at: now,
      synced_at: null
    };

    db.updateDevice(id, updates);
    syncService.addToSyncQueue('devices', 'UPDATE', id);

    res.status(200).json({
      success: true,
      data: { id, ...updates },
      message: 'Device status updated successfully'
    });
  } catch (error) {
    console.error('Error updating device status:', error);
    res.status(500).json({ success: false, message: 'Error updating device status' });
  }
});

// Update full device details
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, device_type } = req.body;

    const existing = db.getDevice(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }

    const now = new Date().toISOString();

    const updates = {
      name: name || existing.name,
      location: location || existing.location,
      device_type: device_type || existing.device_type,
      updated_at: now,
      synced_at: null
    };

    db.updateDevice(id, updates);
    syncService.addToSyncQueue('devices', 'UPDATE', id);

    res.status(200).json({
      success: true,
      data: { id, ...updates },
      message: 'Device updated successfully'
    });
  } catch (error) {
    console.error('Error updating device:', error);
    res.status(500).json({ success: false, message: 'Error updating device' });
  }
});

// Delete device
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const existing = db.getDevice(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }

    db.deleteDevice(id);
    syncService.addToSyncQueue('devices', 'DELETE', id);

    res.status(200).json({
      success: true,
      message: 'Device deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting device:', error);
    res.status(500).json({ success: false, message: 'Error deleting device' });
  }
});

// Get sync logs for device
router.get('/:deviceId/sync-logs', (req, res) => {
  try {
    const { deviceId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const database = db.getDatabase();
    const logs = database.prepare(`
      SELECT * FROM sync_logs 
      WHERE record_id = ? 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `).all(deviceId, parseInt(limit), parseInt(offset));

    const { count } = database.prepare(
      'SELECT COUNT(*) as count FROM sync_logs WHERE record_id = ?'
    ).get(deviceId);

    res.status(200).json({
      success: true,
      data: logs,
      total: count,
      device_id: deviceId,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching sync logs:', error);
    res.status(500).json({ success: false, message: 'Error fetching sync logs' });
  }
});

module.exports = router;
