import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      // Trigger logout action
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),
  logout: () => apiClient.post('/auth/logout'),
  forgotPassword: (email) =>
    apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) =>
    apiClient.post('/auth/reset-password', { token, password }),
  verifyToken: () => apiClient.post('/auth/verify-token'),
};

// User APIs
export const userAPI = {
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data) => apiClient.put('/users/profile', data),
  changePassword: (oldPassword, newPassword) =>
    apiClient.post('/users/change-password', { oldPassword, newPassword }),
  getUsers: (filters) => apiClient.get('/users', { params: filters }),
  getUserById: (id) => apiClient.get(`/users/${id}`),
  createUser: (data) => apiClient.post('/users', data),
  updateUser: (id, data) => apiClient.put(`/users/${id}`, data),
  deleteUser: (id) => apiClient.delete(`/users/${id}`),
};

// School APIs
export const schoolAPI = {
  getSchools: (filters) => apiClient.get('/schools', { params: filters }),
  getSchoolById: (id) => apiClient.get(`/schools/${id}`),
  createSchool: (data) => apiClient.post('/schools', data),
  updateSchool: (id, data) => apiClient.put(`/schools/${id}`, data),
  deleteSchool: (id) => apiClient.delete(`/schools/${id}`),
  getSchoolStats: (id) => apiClient.get(`/schools/${id}/stats`),
};

// Student APIs
export const studentAPI = {
  getStudents: (filters) => apiClient.get('/students', { params: filters }),
  getStudentById: (id) => apiClient.get(`/students/${id}`),
  createStudent: (data) => apiClient.post('/students', data),
  updateStudent: (id, data) => apiClient.put(`/students/${id}`, data),
  deleteStudent: (id) => apiClient.delete(`/students/${id}`),
  getStudentGrades: (id) => apiClient.get(`/students/${id}/grades`),
  getStudentAttendance: (id) => apiClient.get(`/students/${id}/attendance`),
};

// Grade APIs
export const gradeAPI = {
  getGrades: (filters) => apiClient.get('/grades', { params: filters }),
  getGradeById: (id) => apiClient.get(`/grades/${id}`),
  createGrade: (data) => apiClient.post('/grades', data),
  updateGrade: (id, data) => apiClient.put(`/grades/${id}`, data),
  deleteGrade: (id) => apiClient.delete(`/grades/${id}`),
  bulkUploadGrades: (data) => apiClient.post('/grades/bulk', data),
};

// Attendance APIs
export const attendanceAPI = {
  getAttendance: (filters) => apiClient.get('/attendance', { params: filters }),
  getAttendanceById: (id) => apiClient.get(`/attendance/${id}`),
  createAttendance: (data) => apiClient.post('/attendance', data),
  updateAttendance: (id, data) => apiClient.put(`/attendance/${id}`, data),
  deleteAttendance: (id) => apiClient.delete(`/attendance/${id}`),
  getStudentAttendanceReport: (studentId) =>
    apiClient.get(`/attendance/student/${studentId}`),
};

// Dashboard APIs
export const dashboardAPI = {
  getSummary: () => apiClient.get('/dashboard/summary'),
  getCharts: () => apiClient.get('/dashboard/charts'),
  getRecentActivity: () => apiClient.get('/dashboard/activity'),
};

// Report APIs
export const reportAPI = {
  getReports: (filters) => apiClient.get('/reports', { params: filters }),
  getReportById: (id) => apiClient.get(`/reports/${id}`),
  generateReport: (data) => apiClient.post('/reports/generate', data),
  downloadReport: (id) => apiClient.get(`/reports/${id}/download`, { responseType: 'blob' }),
};
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('refreshToken');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
