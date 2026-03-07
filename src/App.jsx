import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import StudentDashboard from './pages/StudentDashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Subjects from './pages/Subjects';
import Timetable from './pages/Timetable';
import Attendance from './pages/Attendance';
import ClassAttendance from './pages/ClassAttendance';
import ClassTimetable from './pages/ClassTimetable';
import ClassSubjects from './pages/ClassSubjects';
import './App.css'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/attendance" element={<Attendance />} />
          
          {/* Class-specific routes */}
          <Route path="/class/:classId/attendance" element={<ClassAttendance />} />
          <Route path="/class/:classId/timetable" element={<ClassTimetable />} />
          <Route path="/class/:classId/subjects" element={<ClassSubjects />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App