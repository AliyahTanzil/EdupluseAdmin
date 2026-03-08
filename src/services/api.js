/**
 * Frontend API Service
 * Handles all API calls with offline-first approach
 * Automatically syncs when online
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to make API calls
const makeRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    // Handle offline scenario
    if (!response.ok) {
      if (response.status === 0 || !navigator.onLine) {
        throw new Error('OFFLINE');
      }
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // Attempt to use cached data when offline
    if (error.message === 'OFFLINE' || !navigator.onLine) {
      return getCachedData(endpoint, options);
    }
    throw error;
  }
};

// Local storage caching
const cacheKey = (endpoint) => `api_cache_${endpoint}`;

const setCachedData = (endpoint, data) => {
  try {
    localStorage.setItem(cacheKey(endpoint), JSON.stringify({
      data,
      timestamp: new Date().toISOString(),
    }));
  } catch (error) {
    console.warn('Failed to cache data:', error);
  }
};

const getCachedData = (endpoint, options = {}) => {
  try {
    const cached = localStorage.getItem(cacheKey(endpoint));
    if (cached) {
      const { data } = JSON.parse(cached);
      return { ...data, _cached: true };
    }
  } catch (error) {
    console.warn('Failed to retrieve cached data:', error);
  }
  return null;
};

// ==================== STUDENTS API ====================

export const studentsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/students${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await makeRequest(endpoint);
      setCachedData(endpoint, response);
      return response;
    } catch (error) {
      return getCachedData(endpoint) || { success: false, data: [] };
    }
  },

  getById: async (id) => {
    const endpoint = `/students/${id}`;
    
    try {
      const response = await makeRequest(endpoint);
      setCachedData(endpoint, response);
      return response;
    } catch (error) {
      return getCachedData(endpoint) || { success: false };
    }
  },

  create: async (studentData) => {
    const endpoint = '/students';
    
    try {
      const response = await makeRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(studentData),
      });
      
      // Clear list cache to force refresh
      localStorage.removeItem(cacheKey('/students'));
      return response;
    } catch (error) {
      console.error('Failed to create student:', error);
      throw error;
    }
  },

  update: async (id, updates) => {
    const endpoint = `/students/${id}`;
    
    try {
      const response = await makeRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      
      localStorage.removeItem(cacheKey(`/students/${id}`));
      localStorage.removeItem(cacheKey('/students'));
      return response;
    } catch (error) {
      console.error('Failed to update student:', error);
      throw error;
    }
  },

  delete: async (id) => {
    const endpoint = `/students/${id}`;
    
    try {
      const response = await makeRequest(endpoint, {
        method: 'DELETE',
      });
      
      localStorage.removeItem(cacheKey(`/students/${id}`));
      localStorage.removeItem(cacheKey('/students'));
      return response;
    } catch (error) {
      console.error('Failed to delete student:', error);
      throw error;
    }
  },
};

// ==================== TEACHERS API ====================

export const teachersAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/teachers${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await makeRequest(endpoint);
      setCachedData(endpoint, response);
      return response;
    } catch (error) {
      return getCachedData(endpoint) || { success: false, data: [] };
    }
  },

  getById: async (id) => {
    const endpoint = `/teachers/${id}`;
    
    try {
      const response = await makeRequest(endpoint);
      setCachedData(endpoint, response);
      return response;
    } catch (error) {
      return getCachedData(endpoint) || { success: false };
    }
  },

  create: async (teacherData) => {
    const endpoint = '/teachers';
    
    try {
      const response = await makeRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(teacherData),
      });
      
      localStorage.removeItem(cacheKey('/teachers'));
      return response;
    } catch (error) {
      console.error('Failed to create teacher:', error);
      throw error;
    }
  },

  update: async (id, updates) => {
    const endpoint = `/teachers/${id}`;
    
    try {
      const response = await makeRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      
      localStorage.removeItem(cacheKey(`/teachers/${id}`));
      localStorage.removeItem(cacheKey('/teachers'));
      return response;
    } catch (error) {
      console.error('Failed to update teacher:', error);
      throw error;
    }
  },

  delete: async (id) => {
    const endpoint = `/teachers/${id}`;
    
    try {
      const response = await makeRequest(endpoint, {
        method: 'DELETE',
      });
      
      localStorage.removeItem(cacheKey(`/teachers/${id}`));
      localStorage.removeItem(cacheKey('/teachers'));
      return response;
    } catch (error) {
      console.error('Failed to delete teacher:', error);
      throw error;
    }
  },
};

// ==================== ATTENDANCE API ====================

export const attendanceAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/attendance${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await makeRequest(endpoint);
      setCachedData(endpoint, response);
      return response;
    } catch (error) {
      return getCachedData(endpoint) || { success: false, data: [] };
    }
  },

  mark: async (attendanceData) => {
    const endpoint = '/attendance/mark';
    
    try {
      const response = await makeRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(attendanceData),
      });
      
      localStorage.removeItem(cacheKey('/attendance'));
      return response;
    } catch (error) {
      console.error('Failed to mark attendance:', error);
      throw error;
    }
  },

  markBulk: async (bulkData) => {
    const endpoint = '/attendance/bulk';
    
    try {
      const response = await makeRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(bulkData),
      });
      
      localStorage.removeItem(cacheKey('/attendance'));
      return response;
    } catch (error) {
      console.error('Failed to mark bulk attendance:', error);
      throw error;
    }
  },

  getStudentAttendance: async (studentId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/attendance/student/${studentId}${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await makeRequest(endpoint);
      setCachedData(endpoint, response);
      return response;
    } catch (error) {
      return getCachedData(endpoint) || { success: false, data: [] };
    }
  },

  getClassAttendance: async (className, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/attendance/class/${className}${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await makeRequest(endpoint);
      setCachedData(endpoint, response);
      return response;
    } catch (error) {
      return getCachedData(endpoint) || { success: false, data: [] };
    }
  },

  update: async (id, updates) => {
    const endpoint = `/attendance/${id}`;
    
    try {
      const response = await makeRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      
      localStorage.removeItem(cacheKey('/attendance'));
      return response;
    } catch (error) {
      console.error('Failed to update attendance:', error);
      throw error;
    }
  },

  delete: async (id) => {
    const endpoint = `/attendance/${id}`;
    
    try {
      const response = await makeRequest(endpoint, {
        method: 'DELETE',
      });
      
      localStorage.removeItem(cacheKey('/attendance'));
      return response;
    } catch (error) {
      console.error('Failed to delete attendance:', error);
      throw error;
    }
  },
};

// ==================== TIMETABLE API ====================

export const timetableAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/timetable${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await makeRequest(endpoint);
      setCachedData(endpoint, response);
      return response;
    } catch (error) {
      return getCachedData(endpoint) || { success: false, data: [] };
    }
  },

  getClassTimetable: async (className) => {
    const endpoint = `/timetable/class/${className}`;
    
    try {
      const response = await makeRequest(endpoint);
      setCachedData(endpoint, response);
      return response;
    } catch (error) {
      return getCachedData(endpoint) || { success: false, data: [] };
    }
  },

  getDayTimetable: async (className, day) => {
    const endpoint = `/timetable/class/${className}/day/${day}`;
    
    try {
      const response = await makeRequest(endpoint);
      setCachedData(endpoint, response);
      return response;
    } catch (error) {
      return getCachedData(endpoint) || { success: false, data: [] };
    }
  },

  getTeacherSchedule: async (teacherId) => {
    const endpoint = `/timetable/teacher/${teacherId}`;
    
    try {
      const response = await makeRequest(endpoint);
      setCachedData(endpoint, response);
      return response;
    } catch (error) {
      return getCachedData(endpoint) || { success: false, data: [] };
    }
  },

  createPeriod: async (periodData) => {
    const endpoint = '/timetable/period';
    
    try {
      const response = await makeRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(periodData),
      });
      
      localStorage.removeItem(cacheKey('/timetable'));
      return response;
    } catch (error) {
      console.error('Failed to create period:', error);
      throw error;
    }
  },

  updatePeriod: async (id, updates) => {
    const endpoint = `/timetable/period/${id}`;
    
    try {
      const response = await makeRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      
      localStorage.removeItem(cacheKey('/timetable'));
      return response;
    } catch (error) {
      console.error('Failed to update period:', error);
      throw error;
    }
  },

  deletePeriod: async (id) => {
    const endpoint = `/timetable/period/${id}`;
    
    try {
      const response = await makeRequest(endpoint, {
        method: 'DELETE',
      });
      
      localStorage.removeItem(cacheKey('/timetable'));
      return response;
    } catch (error) {
      console.error('Failed to delete period:', error);
      throw error;
    }
  },
};

// ==================== SUBJECTS API ====================

export const subjectsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/subjects${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await makeRequest(endpoint);
      setCachedData(endpoint, response);
      return response;
    } catch (error) {
      return getCachedData(endpoint) || { success: false, data: [] };
    }
  },

  getById: async (id) => {
    const endpoint = `/subjects/${id}`;
    
    try {
      const response = await makeRequest(endpoint);
      setCachedData(endpoint, response);
      return response;
    } catch (error) {
      return getCachedData(endpoint) || { success: false };
    }
  },

  create: async (subjectData) => {
    const endpoint = '/subjects';
    
    try {
      const response = await makeRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(subjectData),
      });
      
      localStorage.removeItem(cacheKey('/subjects'));
      return response;
    } catch (error) {
      console.error('Failed to create subject:', error);
      throw error;
    }
  },

  update: async (id, updates) => {
    const endpoint = `/subjects/${id}`;
    
    try {
      const response = await makeRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      
      localStorage.removeItem(cacheKey(`/subjects/${id}`));
      localStorage.removeItem(cacheKey('/subjects'));
      return response;
    } catch (error) {
      console.error('Failed to update subject:', error);
      throw error;
    }
  },

  delete: async (id) => {
    const endpoint = `/subjects/${id}`;
    
    try {
      const response = await makeRequest(endpoint, {
        method: 'DELETE',
      });
      
      localStorage.removeItem(cacheKey(`/subjects/${id}`));
      localStorage.removeItem(cacheKey('/subjects'));
      return response;
    } catch (error) {
      console.error('Failed to delete subject:', error);
      throw error;
    }
  },
};

// ==================== REPORTS API ====================

export const reportsAPI = {
  generateAttendanceReport: async (reportData) => {
    const endpoint = '/reports/attendance';
    
    try {
      const response = await makeRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(reportData),
      });
      
      return response;
    } catch (error) {
      console.error('Failed to generate attendance report:', error);
      throw error;
    }
  },

  generatePerformanceReport: async (reportData) => {
    const endpoint = '/reports/performance';
    
    try {
      const response = await makeRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(reportData),
      });
      
      return response;
    } catch (error) {
      console.error('Failed to generate performance report:', error);
      throw error;
    }
  },

  exportReport: async (exportData) => {
    const endpoint = '/reports/export';
    
    try {
      const response = await makeRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(exportData),
      });
      
      return response;
    } catch (error) {
      console.error('Failed to export report:', error);
      throw error;
    }
  },
};

// ==================== DEVICES API ====================

export const devicesAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/devices${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await makeRequest(endpoint);
      setCachedData(endpoint, response);
      return response;
    } catch (error) {
      return getCachedData(endpoint) || { success: false, data: [] };
    }
  },

  getById: async (id) => {
    const endpoint = `/devices/${id}`;
    
    try {
      const response = await makeRequest(endpoint);
      setCachedData(endpoint, response);
      return response;
    } catch (error) {
      return getCachedData(endpoint) || { success: false };
    }
  },

  register: async (deviceData) => {
    const endpoint = '/devices/register';
    
    try {
      const response = await makeRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(deviceData),
      });
      
      localStorage.removeItem(cacheKey('/devices'));
      return response;
    } catch (error) {
      console.error('Failed to register device:', error);
      throw error;
    }
  },

  updateStatus: async (id, status) => {
    const endpoint = `/devices/${id}/status`;
    
    try {
      const response = await makeRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      
      localStorage.removeItem(cacheKey(`/devices/${id}`));
      localStorage.removeItem(cacheKey('/devices'));
      return response;
    } catch (error) {
      console.error('Failed to update device status:', error);
      throw error;
    }
  },

  update: async (id, updates) => {
    const endpoint = `/devices/${id}`;
    
    try {
      const response = await makeRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      
      localStorage.removeItem(cacheKey(`/devices/${id}`));
      localStorage.removeItem(cacheKey('/devices'));
      return response;
    } catch (error) {
      console.error('Failed to update device:', error);
      throw error;
    }
  },

  delete: async (id) => {
    const endpoint = `/devices/${id}`;
    
    try {
      const response = await makeRequest(endpoint, {
        method: 'DELETE',
      });
      
      localStorage.removeItem(cacheKey(`/devices/${id}`));
      localStorage.removeItem(cacheKey('/devices'));
      return response;
    } catch (error) {
      console.error('Failed to delete device:', error);
      throw error;
    }
  },

  getSyncLogs: async (deviceId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/devices/${deviceId}/sync-logs${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await makeRequest(endpoint);
      setCachedData(endpoint, response);
      return response;
    } catch (error) {
      return getCachedData(endpoint) || { success: false, data: [] };
    }
  },
};

// ==================== SYNC API ====================

export const syncAPI = {
  syncAll: async () => {
    const endpoint = '/sync/sync-all';
    
    try {
      const response = await makeRequest(endpoint, {
        method: 'POST',
      });
      
      return response;
    } catch (error) {
      console.error('Failed to sync all data:', error);
      throw error;
    }
  },

  getStatus: async () => {
    const endpoint = '/sync/status';
    
    try {
      const response = await makeRequest(endpoint);
      return response;
    } catch (error) {
      console.error('Failed to get sync status:', error);
      throw error;
    }
  },

  getConnectionStatus: async () => {
    const endpoint = '/sync/connection-status';
    
    try {
      const response = await makeRequest(endpoint);
      return response;
    } catch (error) {
      return { success: false, online: navigator.onLine };
    }
  },

  batchSync: async (records) => {
    const endpoint = '/sync/batch-sync';
    
    try {
      const response = await makeRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify({ records }),
      });
      
      return response;
    } catch (error) {
      console.error('Failed to batch sync:', error);
      throw error;
    }
  },
};

// ==================== HEALTH API ====================

export const healthAPI = {
  check: async () => {
    const endpoint = '/health';
    
    try {
      const response = await makeRequest(endpoint);
      return response;
    } catch (error) {
      return { success: false, online: navigator.onLine };
    }
  },

  readiness: async () => {
    const endpoint = '/health/ready';
    
    try {
      const response = await makeRequest(endpoint);
      return response;
    } catch (error) {
      return { success: false, ready: false };
    }
  },
};

// ==================== UTILITY FUNCTIONS ====================

export const apiUtils = {
  isOnline: () => navigator.onLine,

  clearCache: () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('api_cache_')) {
        localStorage.removeItem(key);
      }
    });
  },

  getCacheInfo: () => {
    const cacheData = {};
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('api_cache_')) {
        cacheData[key] = JSON.parse(localStorage.getItem(key));
      }
    });
    return cacheData;
  },
};

export default {
  studentsAPI,
  teachersAPI,
  attendanceAPI,
  timetableAPI,
  subjectsAPI,
  reportsAPI,
  devicesAPI,
  syncAPI,
  healthAPI,
  apiUtils,
};
