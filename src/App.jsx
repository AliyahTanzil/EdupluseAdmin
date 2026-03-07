import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import StudentDashboard from './pages/StudentDashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Subjects from './pages/Subjects';
import Timetable from './pages/Timetable';
import Attendance from './pages/Attendance';
import Courses from './pages/Courses';
import AddCourse from './pages/AddCourse';
import ClassAttendance from './pages/ClassAttendance';
import ClassTimetable from './pages/ClassTimetable';
import ClassSubjects from './pages/ClassSubjects';
import MarkAttendance from './pages/MarkAttendance';
import ExportReports from './pages/ExportReports';
import ManageDevices from './pages/ManageDevices';
import EditTimetable from './pages/EditTimetable';
import AddNewStudent from './pages/AddNewStudent';
import AddNewTeacher from './pages/AddNewTeacher';
import GenerateReport from './pages/GenerateReport';
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page without layout */}
        <Route path="/" element={<Landing />} />
        
        {/* All other routes with layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/add-student" element={<AddNewStudent />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/add-teacher" element={<AddNewTeacher />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/edit-timetable" element={<EditTimetable />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/add-course" element={<AddCourse />} />
          
          {/* Class-specific routes */}
          <Route path="/class/:classId/attendance" element={<ClassAttendance />} />
          <Route path="/class/:classId/timetable" element={<ClassTimetable />} />
          <Route path="/class/:classId/subjects" element={<ClassSubjects />} />
          <Route path="/class/:classId/mark-attendance" element={<MarkAttendance />} />
          
          {/* Utility routes */}
          <Route path="/export-reports" element={<ExportReports />} />
          <Route path="/manage-devices" element={<ManageDevices />} />
          <Route path="/generate-report" element={<GenerateReport />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App