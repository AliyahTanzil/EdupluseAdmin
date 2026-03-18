import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Layout from './layouts/Layout';
import SessionWarning from './components/SessionWarning';
import OfflineNotification from './components/OfflineNotification';

// Auth Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';

// Dashboards
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import ClassTeacherDashboard from './pages/ClassTeacherDashboard';
import SubjectHeadDashboard from './pages/SubjectHeadDashboard';
import DepartmentalHeadDashboard from './pages/DepartmentalHeadDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ParentDashboard from './pages/ParentDashboard';

// Admin Pages
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Subjects from './pages/Subjects';
import Timetable from './pages/Timetable';
import Attendance from './pages/Attendance';
import Courses from './pages/Courses';
import AddCourse from './pages/AddCourse';
import EditCourse from './pages/EditCourse';
import ClassAttendance from './pages/ClassAttendance';
import ClassTimetable from './pages/ClassTimetable';
import ClassSubjects from './pages/ClassSubjects';
import MarkAttendance from './pages/MarkAttendance';
import ExportReports from './pages/ExportReports';
import ManageDevices from './pages/ManageDevices';
import EditTimetable from './pages/EditTimetable';
import AddNewStudent from './pages/AddNewStudent';
import EditStudent from './pages/EditStudent';
import AddNewTeacher from './pages/AddNewTeacher';
import EditTeacher from './pages/EditTeacher';
import AddNewSubject from './pages/AddNewSubject';
import EditSubject from './pages/EditSubject';
import GenerateReport from './pages/GenerateReport';
import Settings from './pages/Settings';
import ProfileSettings from './pages/ProfileSettings';
import Logout from './pages/Logout';
import './App.css'

function AppContent() {
  return (
    <>
      <SessionWarning />
      <OfflineNotification />
      <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/logout" element={<Logout />} />
          
          {/* Role-based Dashboards */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile-settings"
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <ProfileSettings />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/teacher-dashboard"
            element={
              <ProtectedRoute requiredRoles={['teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />

          {/* Role-specific Teacher Dashboards */}
          <Route
            path="/class-teacher-dashboard"
            element={
              <ProtectedRoute requiredRoles={['teacher']} requiredTeacherTypes={['class_teacher']}>
                <ClassTeacherDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/subject-head-dashboard"
            element={
              <ProtectedRoute requiredRoles={['teacher']} requiredTeacherTypes={['subject_head']}>
                <SubjectHeadDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/departmental-head-dashboard"
            element={
              <ProtectedRoute requiredRoles={['teacher']} requiredTeacherTypes={['departmental_head']}>
                <DepartmentalHeadDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute requiredRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/parent-dashboard"
            element={
              <ProtectedRoute requiredRoles={['parent']}>
                <ParentDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Protected Admin Routes with Layout */}
          <Route
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/add-new-student" element={<AddNewStudent />} />
            <Route path="/edit-student/:id" element={<EditStudent />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/add-new-teacher" element={<AddNewTeacher />} />
            <Route path="/edit-teacher/:id" element={<EditTeacher />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/add-new-subject" element={<AddNewSubject />} />
            <Route path="/edit-subject/:id" element={<EditSubject />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/edit-timetable" element={<EditTimetable />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/mark-attendance" element={<MarkAttendance />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/add-new-course" element={<AddCourse />} />
            <Route path="/edit-course/:id" element={<EditCourse />} />
            <Route path="/export-reports" element={<ExportReports />} />
            <Route path="/manage-devices" element={<ManageDevices />} />
            <Route path="/generate-report" element={<GenerateReport />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Protected Teacher Routes */}
          <Route
            element={
              <ProtectedRoute requiredRoles={['teacher']}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/mark-attendance" element={<MarkAttendance />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}
export default App