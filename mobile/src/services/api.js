import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.0.2.2:5001/api'; // Android emulator -> host machine

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
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
  (error) => Promise.reject(error)
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  logout: () => apiClient.post('/auth/logout'),
  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => apiClient.post('/auth/reset-password', { token, password }),
  verifyToken: () => apiClient.post('/auth/verify-token'),
};

// User APIs
export const userAPI = {
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data) => apiClient.put('/users/profile', data),
  changePassword: (oldPassword, newPassword) => apiClient.post('/users/change-password', { oldPassword, newPassword }),
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

// Teacher APIs
export const teacherAPI = {
  getTeachers: (filters) => apiClient.get('/teachers', { params: filters }),
  getTeacherById: (id) => apiClient.get(`/teachers/${id}`),
  createTeacher: (data) => apiClient.post('/teachers', data),
  updateTeacher: (id, data) => apiClient.put(`/teachers/${id}`, data),
  deleteTeacher: (id) => apiClient.delete(`/teachers/${id}`),
  getTeacherSchedule: (id) => apiClient.get(`/teachers/${id}/schedule`),
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

// Grades API (report card)
export const gradesAPI = {
  getStudentReportCard: (studentId, params) =>
    apiClient.get(`/grades/student/${studentId}/report-card`, { params }),
  getStudentGrades: (studentId, params) =>
    apiClient.get(`/grades/student/${studentId}`, { params }),
  getClassGrades: (classId, params) =>
    apiClient.get(`/grades/class/${classId}`, { params }),
};

// Attendance APIs
export const attendanceAPI = {
  getAttendance: (filters) => apiClient.get('/attendance', { params: filters }),
  getAttendanceById: (id) => apiClient.get(`/attendance/${id}`),
  createAttendance: (data) => apiClient.post('/attendance', data),
  updateAttendance: (id, data) => apiClient.put(`/attendance/${id}`, data),
  deleteAttendance: (id) => apiClient.delete(`/attendance/${id}`),
  markBulk: (data) => apiClient.post('/attendance/bulk', data),
  getStudentAttendanceReport: (studentId) => apiClient.get(`/attendance/student/${studentId}`),
};

// Class APIs
export const classAPI = {
  getClasses: (filters) => apiClient.get('/classes', { params: filters }),
  getClassById: (id) => apiClient.get(`/classes/${id}`),
  createClass: (data) => apiClient.post('/classes', data),
  updateClass: (id, data) => apiClient.put(`/classes/${id}`, data),
  deleteClass: (id) => apiClient.delete(`/classes/${id}`),
  getClassStudents: (id) => apiClient.get(`/classes/${id}/students`),
};

// Timetable APIs
export const timetableAPI = {
  getTimetable: (classId) => apiClient.get(`/timetable/${classId}`),
  updateTimetable: (classId, data) => apiClient.put(`/timetable/${classId}`, data),
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
  exportReport: (data) => apiClient.post('/reports/export', data),
  downloadReport: (id) => apiClient.get(`/reports/${id}/download`, { responseType: 'blob' }),
};

export default apiClient;
