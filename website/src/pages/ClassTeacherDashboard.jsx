import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Class Teacher Dashboard
 * Displays class-specific information and management options
 */
const ClassTeacherDashboard = () => {
  const { user } = useAuth();
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    averageMarks: 0
  });

  useEffect(() => {
    loadClassData();
  }, [user]);

  const loadClassData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      // Fetch class data
      const classRes = await fetch(`http://localhost:5001/api/classes/${user.class}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (classRes.ok) {
        const data = await classRes.json();
        setClassData(data.data);
      }

      // Fetch class students
      const studentsRes = await fetch(`http://localhost:5001/api/students?class=${user.class}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (studentsRes.ok) {
        const data = await studentsRes.json();
        setStudents(data.data || []);
        setStats(prev => ({
          ...prev,
          totalStudents: data.data?.length || 0
        }));
      }

      // Fetch attendance stats
      const attendanceRes = await fetch(`http://localhost:5001/api/attendance/today?class=${user.class}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (attendanceRes.ok) {
        const data = await attendanceRes.json();
        const present = data.data?.filter(a => a.status === 'present').length || 0;
        const absent = data.data?.filter(a => a.status === 'absent').length || 0;
        setStats(prev => ({
          ...prev,
          presentToday: present,
          absentToday: absent
        }));
      }
    } catch (error) {
      console.error('Error loading class data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading class data...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Class Teacher Dashboard</h1>
        <p>Class: <strong>{user.class}</strong></p>
      </div>

      {/* Quick Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.totalStudents}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#27ae60' }}>
            {stats.presentToday}
          </div>
          <div className="stat-label">Present Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#e74c3c' }}>
            {stats.absentToday}
          </div>
          <div className="stat-label">Absent Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.averageMarks.toFixed(1)}</div>
          <div className="stat-label">Class Average Marks</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => window.location.href = '/mark-attendance'}>
            <span className="action-icon">📋</span>
            <span>Mark Attendance</span>
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/class-attendance'}>
            <span className="action-icon">📊</span>
            <span>View Class Attendance</span>
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/class-timetable'}>
            <span className="action-icon">⏰</span>
            <span>View Timetable</span>
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/students'}>
            <span className="action-icon">👥</span>
            <span>Manage Students</span>
          </button>
        </div>
      </div>

      {/* Class Overview */}
      <div className="dashboard-section">
        <h2>Class Overview</h2>
        <div className="overview-grid">
          <div className="overview-card">
            <h3>Class Information</h3>
            <p><strong>Class:</strong> {user.class}</p>
            <p><strong>Total Students:</strong> {stats.totalStudents}</p>
            <p><strong>Class Teacher:</strong> {user.name}</p>
            <p><strong>Department:</strong> {user.department}</p>
          </div>

          <div className="overview-card">
            <h3>Today's Attendance</h3>
            <div className="attendance-summary">
              <div className="attendance-item">
                <span>Present:</span>
                <span className="badge badge-success">{stats.presentToday}</span>
              </div>
              <div className="attendance-item">
                <span>Absent:</span>
                <span className="badge badge-danger">{stats.absentToday}</span>
              </div>
              <div className="attendance-item">
                <span>Attendance Rate:</span>
                <span className="badge badge-info">
                  {stats.totalStudents > 0 
                    ? ((stats.presentToday / stats.totalStudents) * 100).toFixed(1) 
                    : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="overview-card">
            <h3>Your Subjects</h3>
            <ul className="subjects-list">
              {user.subjects && user.subjects.map((subject, idx) => (
                <li key={idx}>{subject}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="dashboard-section">
        <h2>Class Performance</h2>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Roll No</th>
              <th>Today's Attendance</th>
              <th>Average Marks</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.slice(0, 5).map((student, idx) => (
              <tr key={idx}>
                <td>{student.name}</td>
                <td>{student.rollNo}</td>
                <td><span className="badge badge-success">Present</span></td>
                <td>{student.averageMarks || 'N/A'}</td>
                <td><span className="badge badge-info">Active</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {students.length > 5 && (
          <div className="view-more-link">
            <a href="/students">View all students →</a>
          </div>
        )}
      </div>

      {/* Responsibilities */}
      <div className="dashboard-section">
        <h2>Class Teacher Responsibilities</h2>
        <div className="responsibilities-list">
          <div className="responsibility-item">
            <input type="checkbox" id="resp1" defaultChecked />
            <label htmlFor="resp1">Monitor class attendance and performance</label>
          </div>
          <div className="responsibility-item">
            <input type="checkbox" id="resp2" />
            <label htmlFor="resp2">Coordinate with subject teachers</label>
          </div>
          <div className="responsibility-item">
            <input type="checkbox" id="resp3" />
            <label htmlFor="resp3">Address student disciplinary issues</label>
          </div>
          <div className="responsibility-item">
            <input type="checkbox" id="resp4" />
            <label htmlFor="resp4">Generate class performance reports</label>
          </div>
          <div className="responsibility-item">
            <input type="checkbox" id="resp5" />
            <label htmlFor="resp5">Maintain class attendance records</label>
          </div>
          <div className="responsibility-item">
            <input type="checkbox" id="resp6" />
            <label htmlFor="resp6">Communicate with parents</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassTeacherDashboard;
