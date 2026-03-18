/**
 * Session Configuration
 * This file contains all session management settings
 */

export const SESSION_CONFIG = {
  // Session timeout in milliseconds (15 minutes = 900000ms)
  SESSION_TIMEOUT: 15 * 60 * 1000,
  
  // Warning timeout - shows warning 2 minutes before logout
  WARNING_TIMEOUT: (15 * 60 * 1000) - (2 * 60 * 1000),
  
  // Activity events that reset the inactivity timer
  ACTIVITY_EVENTS: [
    'mousedown',
    'keydown',
    'scroll',
    'touchstart',
    'click',
    'mousemove',
    'wheel'
  ],
  
  // Auto-logout settings
  AUTO_LOGOUT: {
    // Logout on connection loss
    onConnectionLoss: true,
    
    // Logout on inactivity
    onInactivity: true,
    
    // Show warning before logout
    showWarning: true,
    
    // Clear local storage on logout
    clearStorage: true
  },
  
  // Notification settings
  NOTIFICATIONS: {
    // Show offline notification
    showOfflineNotification: true,
    
    // Show session warning notification
    showSessionWarning: true,
    
    // Duration of offline notification in milliseconds
    offlineNotificationDuration: 5000
  },
  
  // Debug mode (set to false in production)
  DEBUG: false
};

/**
 * Get formatted session timeout display
 * @returns {string} Formatted time string (e.g., "15:00")
 */
export const getSessionTimeoutDisplay = () => {
  const minutes = Math.floor(SESSION_CONFIG.SESSION_TIMEOUT / 60000);
  const seconds = Math.floor((SESSION_CONFIG.SESSION_TIMEOUT % 60000) / 1000);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

/**
 * Get formatted warning timeout display
 * @returns {string} Formatted time string
 */
export const getWarningTimeoutDisplay = () => {
  const minutes = Math.floor(SESSION_CONFIG.WARNING_TIMEOUT / 60000);
  const seconds = Math.floor((SESSION_CONFIG.WARNING_TIMEOUT % 60000) / 1000);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

/**
 * Log debug information if DEBUG mode is enabled
 * @param {string} message - Debug message
 * @param {any} data - Optional data to log
 */
export const debugLog = (message, data = null) => {
  if (SESSION_CONFIG.DEBUG) {
    console.log(`[SESSION DEBUG] ${message}`, data || '');
  }
};

export default SESSION_CONFIG;
