const { db, getPendingSyncRecords, markAsSynced } = require('../database/local');
const { isOnline, pushToFirebase, updateFirebaseRecord } = require('../database/firebase');
const { v4: uuidv4 } = require('uuid');

class SyncService {
  /**
   * Sync data between local and online database
   */
  static async syncAll() {
    try {
      const online = await isOnline();
      
      if (!online) {
        console.log('⚠ No internet connection - skipping sync');
        return {
          success: false,
          message: 'No internet connection',
          synced: 0,
          failed: 0
        };
      }

      const pendingRecords = getPendingSyncRecords();
      
      if (pendingRecords.length === 0) {
        return {
          success: true,
          message: 'No pending records to sync',
          synced: 0,
          failed: 0
        };
      }

      let synced = 0;
      let failed = 0;

      for (const record of pendingRecords) {
        try {
          await this.syncRecord(record);
          synced++;
        } catch (error) {
          console.error(`Sync failed for ${record.record_id}:`, error);
          failed++;
        }
      }

      return {
        success: true,
        message: `Synced ${synced} records, ${failed} failed`,
        synced,
        failed
      };
    } catch (error) {
      console.error('Sync error:', error);
      return {
        success: false,
        message: error.message,
        synced: 0,
        failed: 0
      };
    }
  }

  /**
   * Sync a single record to Firebase
   */
  static async syncRecord(syncLog) {
    const { table_name, action, record_id } = syncLog;

    // Get the record from local database
    const stmt = db.prepare(`SELECT * FROM ${table_name} WHERE id = ?`);
    const record = stmt.get(record_id);

    if (!record) {
      console.log(`Record ${record_id} not found in ${table_name}`);
      return;
    }

    const path = `${table_name}/${record_id}`;

    try {
      if (action === 'INSERT' || action === 'UPDATE') {
        await pushToFirebase(path, record);
        markAsSynced(record_id, table_name);
        console.log(`✓ Synced ${table_name}/${record_id}`);
      } else if (action === 'DELETE') {
        // Handle delete action
        markAsSynced(record_id, table_name);
      }
    } catch (error) {
      console.error(`Failed to sync ${path}:`, error);
      throw error;
    }
  }

  /**
   * Add a record to sync queue
   */
  static addToSyncQueue(tableName, action, recordId) {
    const { logSyncAction } = require('../database/local');
    
    logSyncAction({
      id: uuidv4(),
      table_name: tableName,
      action: action,
      record_id: recordId,
      status: 'pending'
    });
  }

  /**
   * Get sync status
   */
  static getSyncStatus() {
    const stmt = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'synced' THEN 1 ELSE 0 END) as synced,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
      FROM sync_logs
    `);
    
    return stmt.get();
  }

  /**
   * Batch sync records
   */
  static async batchSync(records) {
    try {
      const online = await isOnline();
      
      if (!online) {
        return {
          success: false,
          message: 'No internet connection',
          synced: 0
        };
      }

      let synced = 0;

      for (const record of records) {
        try {
          const path = `${record.table_name}/${record.id}`;
          await pushToFirebase(path, record);
          synced++;
        } catch (error) {
          console.error(`Batch sync failed for ${record.id}:`, error);
        }
      }

      return {
        success: true,
        message: `Batch synced ${synced}/${records.length} records`,
        synced
      };
    } catch (error) {
      console.error('Batch sync error:', error);
      return {
        success: false,
        message: error.message,
        synced: 0
      };
    }
  }

  /**
   * Conflict resolution - Server wins
   */
  static resolveConflict(localRecord, remoteRecord) {
    // Compare timestamps - use the newer record
    const localTime = new Date(localRecord.updated_at).getTime();
    const remoteTime = new Date(remoteRecord.updated_at).getTime();

    if (remoteTime > localTime) {
      return remoteRecord;
    }
    return localRecord;
  }
}

module.exports = SyncService;
