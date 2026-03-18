import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Departmental Head Dashboard
 * Displays department-wide overview, staff management, and performance analytics
 */
const DepartmentalHeadDashboard = () => {
  const { user } = useAuth();
  const [departmentTeachers, setDepartmentTeachers] = useState([]);
  const [departmentSubjects, setDepartmentSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalSubjects: 0,
    totalClasses: 0,
    totalStudents: 0,
    departmentAverage: 0
  });

  useEffect(() => {
    loadDepartmentData();
  }, [user]);

  const loadDepartmentData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      // Fetch department teachers
      const teachersRes = await fetch(`http://localhost:5001/api/teachers?department=${user.department}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (teachersRes.ok) {
        const data = await teachersRes.json();
        setDepartmentTeachers(data.data || []);
        setStats(prev => ({
          ...prev,
          totalTeachers: data.data?.length || 0
        }));
      }

      // Fetch department subjects
      const subjectsRes = await fetch(`http://localhost:5001/api/subjects?department=${user.department}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (subjectsRes.ok) {
        const data = await subjectsRes.json();
        setDepartmentSubjects(data.data || []);
        setStats(prev => ({
          ...prev,
          totalSubjects: data.data?.length || 0
        }));
      }
    } catch (error) {
      console.error('Error loading department data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading department data...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Departmental Head Dashboard</h1>
        <p>Department: <strong>{user.department}</strong></p>
      </div>

      {/* Quick Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.totalTeachers}</div>
          <div className="stat-label">Department Staff</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalSubjects}</div>
          <div className="stat-label">Subjects</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalClasses}</div>
          <div className="stat-label">Classes</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.departmentAverage.toFixed(1)}</div>
          <div className="stat-label">Department Average %</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => window.location.href = '/department-overview'}>
            <span className="action-icon">🏢</span>
            <span>Department Overview</span>
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/staff-management'}>
            <span className="action-icon">👔</span>
            <span>Staff Management</span>
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/performance-analytics'}>
            <span className="action-icon">📈</span>
            <span>Performance Analytics</span>
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/budget-allocation'}>
            <span className="action-icon">💰</span>
            <span>Budget Allocation</span>
          </button>
        </div>
      </div>

      {/* Department Overview */}
      <div className="dashboard-section">
        <h2>Department Overview</h2>
        <div className="overview-grid">
          <div className="overview-card">
            <h3>Department Information</h3>
            <p><strong>Department:</strong> {user.department}</p>
            <p><strong>Head of Department:</strong> {user.name}</p>
            <p><strong>Total Staff:</strong> {stats.totalTeachers}</p>
            <p><strong>Subjects Offered:</strong> {stats.totalSubjects}</p>
            <p><strong>Classes Managed:</strong> {stats.totalClasses}</p>
            <p><strong>Department Size:</strong> {stats.totalStudents} Students</p>
          </div>

          <div className="overview-card">
            <h3>Performance Overview</h3>
            <div className="metrics">
              <div className="metric-item">
                <span>Department Average:</span>
                <span className="badge badge-info">{stats.departmentAverage.toFixed(1)}%</span>
              </div>
              <div className="metric-item">
                <span>Teaching Staff:</span>
                <span className="badge badge-success">{stats.totalTeachers}</span>
              </div>
              <div className="metric-item">
                <span>Subject Heads:</span>
                <span className="badge badge-primary">
                  {departmentSubjects.filter(s => s.isHead).length}
                </span>
              </div>
              <div className="metric-item">
                <span>Active Classes:</span>
                <span className="badge badge-warning">{stats.totalClasses}</span>
              </div>
            </div>
          </div>

          <div className="overview-card">
            <h3>Key Responsibilities</h3>
            <ul className="responsibilities">
              <li>Department budget management</li>
              <li>Staff performance evaluation</li>
              <li>Curriculum oversight</li>
              <li>Resource allocation</li>
              <li>Faculty coordination</li>
              <li>Strategic planning</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Department Staff */}
      <div className="dashboard-section">
        <h2>Department Staff</h2>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Staff Name</th>
              <th>Position</th>
              <th>Subjects</th>
              <th>Performance Rating</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {departmentTeachers.map((teacher, idx) => (
              <tr key={idx}>
                <td>{teacher.name}</td>
                <td>{teacher.position || 'Teacher'}</td>
                <td>{teacher.subjects?.join(', ') || 'N/A'}</td>
                <td><span className="badge badge-info">{teacher.rating || 'N/A'}</span></td>
                <td><span className="badge badge-success">Active</span></td>
                <td>
                  <button className="btn-sm">Evaluate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Subjects Offered */}
      <div className="dashboard-section">
        <h2>Subjects in Department</h2>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Subject Head</th>
              <th>Teachers</th>
              <th>Classes</th>
              <th>Average Performance</th>
            </tr>
          </thead>
          <tbody>
            {departmentSubjects.map((subject, idx) => (
              <tr key={idx}>
                <td>{subject.name}</td>
                <td>{subject.head || 'Unassigned'}</td>
                <td>{subject.teacherCount || 0}</td>
                <td>{subject.classCount || 0}</td>
                <td><span className="badge badge-info">{subject.avgPerformance || 'N/A'}%</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Performance Analytics */}
      <div className="dashboard-section">
        <h2>Performance Analytics</h2>
        <div className="analytics-grid">
          <div className="analytics-card">
            <h4>📊 Overall Performance Trend</h4>
            <p>Department is performing <strong>above average</strong> this term</p>
            <div className="trend-indicator positive">↑ +5.2%</div>
          </div>
          <div className="analytics-card">
            <h4>👥 Staff Engagement</h4>
            <p>89% of staff actively participating in professional development</p>
            <div className="progress-bar">
              <div className="progress" style={{ width: '89%' }}></div>
            </div>
          </div>
          <div className="analytics-card">
            <h4>📈 Student Performance</h4>
            <p>Average student score: <strong>78.5%</strong></p>
            <p>Pass rate: <strong>92%</strong></p>
          </div>
        </div>
      </div>

      {/* Budget & Resources */}
      <div className="dashboard-section">
        <h2>Budget & Resource Management</h2>
        <div className="budget-info">
          <div className="budget-item">
            <h4>Annual Budget</h4>
            <p className="budget-value">$50,000</p>
            <p className="budget-status">87% utilized</p>
            <div className="progress-bar">
              <div className="progress" style={{ width: '87%' }}></div>
            </div>
          </div>
          <div className="budget-item">
            <h4>Equipment & Supplies</h4>
            <p className="budget-value">$15,000</p>
            <p className="budget-status">65% utilized</p>
            <div className="progress-bar">
              <div className="progress" style={{ width: '65%' }}></div>
            </div>
          </div>
          <div className="budget-item">
            <h4>Professional Development</h4>
            <p className="budget-value">$8,000</p>
            <p className="budget-status">45% utilized</p>
            <div className="progress-bar">
              <div className="progress" style={{ width: '45%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentalHeadDashboard;
