import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getApiBaseUrlSync } from '../config/apiConfig';

/**
 * Subject Head Dashboard
 * Displays subject-wide curriculum, teachers, and performance metrics
 */
const SubjectHeadDashboard = () => {
  const { user } = useAuth();
  const [subjectTeachers, setSubjectTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalClasses: 0,
    totalStudents: 0,
    averagePerformance: 0
  });

  useEffect(() => {
    loadSubjectData();
  }, [user]);

  const loadSubjectData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const apiBase = getApiBaseUrlSync();
      
      // Fetch subject teachers
      const teachersRes = await fetch(`${apiBase}/teachers?subject=${user.headingSubject}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (teachersRes.ok) {
        const data = await teachersRes.json();
        setSubjectTeachers(data.data || []);
        setStats(prev => ({
          ...prev,
          totalTeachers: data.data?.length || 0
        }));
      }

      // Fetch classes offering subject
      const classesRes = await fetch(`${apiBase}/classes?subject=${user.headingSubject}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (classesRes.ok) {
        const data = await classesRes.json();
        setClasses(data.data || []);
        setStats(prev => ({
          ...prev,
          totalClasses: data.data?.length || 0
        }));
      }
    } catch (error) {
      console.error('Error loading subject data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading subject data...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Subject Head Dashboard</h1>
        <p>Subject: <strong>{user.headingSubject}</strong></p>
      </div>

      {/* Quick Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.totalTeachers}</div>
          <div className="stat-label">Subject Teachers</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalClasses}</div>
          <div className="stat-label">Classes Offering Subject</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalStudents}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.averagePerformance.toFixed(1)}</div>
          <div className="stat-label">Subject Average %</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => window.location.href = '/subject-performance'}>
            <span className="action-icon">📊</span>
            <span>Subject Performance</span>
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/teacher-coordination'}>
            <span className="action-icon">👥</span>
            <span>Coordinate Teachers</span>
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/curriculum-management'}>
            <span className="action-icon">📚</span>
            <span>Manage Curriculum</span>
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/mark-verification'}>
            <span className="action-icon">✓</span>
            <span>Verify Marks</span>
          </button>
        </div>
      </div>

      {/* Subject Overview */}
      <div className="dashboard-section">
        <h2>Subject Overview</h2>
        <div className="overview-grid">
          <div className="overview-card">
            <h3>Subject Information</h3>
            <p><strong>Subject:</strong> {user.headingSubject}</p>
            <p><strong>Department:</strong> {user.subjectDepartment}</p>
            <p><strong>Subject Head:</strong> {user.name}</p>
            <p><strong>Total Teachers:</strong> {stats.totalTeachers}</p>
            <p><strong>Classes:</strong> {stats.totalClasses}</p>
          </div>

          <div className="overview-card">
            <h3>Performance Metrics</h3>
            <div className="metrics">
              <div className="metric-item">
                <span>Average Performance:</span>
                <span className="badge badge-info">{stats.averagePerformance.toFixed(1)}%</span>
              </div>
              <div className="metric-item">
                <span>Classes Monitored:</span>
                <span className="badge badge-primary">{stats.totalClasses}</span>
              </div>
              <div className="metric-item">
                <span>Teachers Coordinating:</span>
                <span className="badge badge-success">{stats.totalTeachers}</span>
              </div>
            </div>
          </div>

          <div className="overview-card">
            <h3>Responsibilities</h3>
            <ul className="responsibilities">
              <li>Curriculum development & oversight</li>
              <li>Subject assessment strategies</li>
              <li>Teacher coordination & support</li>
              <li>Mark verification</li>
              <li>Performance analysis</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Subject Teachers */}
      <div className="dashboard-section">
        <h2>Subject Teachers</h2>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Teacher Name</th>
              <th>Classes Teaching</th>
              <th>Experience</th>
              <th>Performance Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {subjectTeachers.map((teacher, idx) => (
              <tr key={idx}>
                <td>{teacher.name}</td>
                <td>{teacher.classes?.join(', ') || 'N/A'}</td>
                <td>{teacher.experience || 'N/A'}</td>
                <td><span className="badge badge-info">{teacher.rating || 'N/A'}</span></td>
                <td>
                  <button className="btn-sm">Evaluate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Classes Offering Subject */}
      <div className="dashboard-section">
        <h2>Classes Offering This Subject</h2>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Class</th>
              <th>Teacher</th>
              <th>Students</th>
              <th>Average Marks</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls, idx) => (
              <tr key={idx}>
                <td>{cls.name}</td>
                <td>{cls.teacher || 'N/A'}</td>
                <td>{cls.students || 0}</td>
                <td>{cls.averageMarks || 'N/A'}</td>
                <td><span className="badge badge-success">Active</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Curriculum Management */}
      <div className="dashboard-section">
        <h2>Curriculum Management</h2>
        <div className="curriculum-info">
          <div className="curriculum-item">
            <h4>📖 Syllabus</h4>
            <p>Review and update the curriculum syllabus for all classes</p>
            <button className="btn-primary">Manage Syllabus</button>
          </div>
          <div className="curriculum-item">
            <h4>📋 Assessment Criteria</h4>
            <p>Define assessment methods and evaluation criteria</p>
            <button className="btn-primary">Set Criteria</button>
          </div>
          <div className="curriculum-item">
            <h4>📊 Performance Standards</h4>
            <p>Set performance benchmarks and standards</p>
            <button className="btn-primary">Set Standards</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectHeadDashboard;
