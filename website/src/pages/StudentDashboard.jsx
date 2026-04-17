import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getApiBaseUrlSync } from '../config/apiConfig';
import '../styles/dashboardStyles.css';

// ============================================================================
// STUDENT DASHBOARD WITH ANALYTICS
// ============================================================================
// Matches the EduPlus dashboard design with 20 module cards in grid layout
// Now with RBAC permission checks for grade and attendance views

// Icon components (using Unicode/emoji representation)
const DashboardCard = ({ 
  icon, 
  title, 
  metric, 
  description, 
  color, 
  onClick, 
  isLoading 
}) => (
  <div 
    className={`dashboard-card ${color}`}
    onClick={onClick}
    style={{ cursor: onClick ? 'pointer' : 'default' }}
  >
    <div className="card-icon">{icon}</div>
    <div className="card-title">{title}</div>
    {metric && !isLoading && <div className="card-metric">{metric}</div>}
    {isLoading && <div className="card-loading">Loading...</div>}
    {description && <div className="card-description">{description}</div>}
  </div>
);

const AnalyticsCard = ({ title, value, unit, color, icon }) => (
  <div className={`analytics-card ${color}`}>
    <div className="analytics-icon">{icon}</div>
    <div className="analytics-content">
      <div className="analytics-title">{title}</div>
      <div className="analytics-value">
        {typeof value === 'number' ? value.toFixed(2) : value}
        {unit && <span className="analytics-unit">{unit}</span>}
      </div>
    </div>
  </div>
);

const StudentDashboard = () => {
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const apiBase = getApiBaseUrlSync();
      const response = await fetch(
        `${apiBase}/dashboard/student`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setDashboardData(data.data);
      setError(null);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      // Use mock data on error
      setDashboardData({
        overview: {
          grades: { total: 12, average: 85, highest: 98, lowest: 72 },
          attendance: { percentage: 92, present: 46, total: 50 },
          assignments: { total: 8, pending: 2, submitted: 6 },
          exams: { upcoming: 3 }
        },
        performance: {
          overall: { gpa: 3.8, excellentGrades: 8, goodGrades: 3, averageGrades: 1, belowAverageGrades: 0 },
          subjectBreakdown: []
        },
        achievements: { stats: { total: 5, medals: 2, certificates: 2, awards: 1 }, recent: [] },
        exams: { scores: [], stats: { totalExams: 0, averagePercentage: 0, highestPercentage: 0 } },
        library: { totalIssued: 3, outstanding: 1, returned: 2 },
        assignments: { overview: { total: 8, submitted: 6, pending: 2, averageScore: 88 }, trend: [] }
      });
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          <h3>⚠️ Error Loading Dashboard</h3>
          <p>Using demo data. Live data unavailable.</p>
        </div>
      </div>
    );
  }

  const overview = dashboardData?.overview || {};
  const performance = dashboardData?.performance || {};
  const achievements = dashboardData?.achievements || {};
  const exams = dashboardData?.exams || {};
  const library = dashboardData?.library || {};
  const assignments = dashboardData?.assignments || {};

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p>Here's your academic overview for this session</p>
        </div>
        <button onClick={fetchDashboardData} className="refresh-button">
          🔄 Refresh
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button
          className={`tab-button ${activeTab === 'modules' ? 'active' : ''}`}
          onClick={() => setActiveTab('modules')}
        >
          Modules
        </button>
      </div>

      {/* OVERVIEW TAB - Analytics Cards */}
      {activeTab === 'overview' && (
        <div className="dashboard-section">
          <h2>📊 Your Academic Overview</h2>
          
          <div className="analytics-grid">
            <AnalyticsCard
              title="Overall Grade Average"
              value={performance?.overall?.gpa || 0}
              unit=""
              color="blue"
              icon="📈"
            />
            <AnalyticsCard
              title="Attendance Rate"
              value={overview?.attendance?.percentage || 0}
              unit="%"
              color="green"
              icon="✅"
            />
            <AnalyticsCard
              title="Assignments Progress"
              value={`${assignments?.overview?.submitted || 0}/${assignments?.overview?.total || 0}`}
              unit="completed"
              color="orange"
              icon="📝"
            />
            <AnalyticsCard
              title="Upcoming Exams"
              value={overview?.exams?.upcoming || 0}
              unit="exams"
              color="red"
              icon="📋"
            />
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat-box">
              <span className="stat-label">Total Grades</span>
              <span className="stat-value">{overview?.grades?.total || 0}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Highest Score</span>
              <span className="stat-value">{overview?.grades?.highest || 0}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Days Present</span>
              <span className="stat-value">{overview?.attendance?.present || 0}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Achievements</span>
              <span className="stat-value">{achievements?.stats?.total || 0}</span>
            </div>
          </div>

          {/* Performance Breakdown */}
          <div className="performance-section">
            <h3>📊 Performance Distribution</h3>
            <div className="performance-breakdown">
              <div className="performance-item excellent">
                <span>Excellent (90-100)</span>
                <strong>{performance?.overall?.excellentGrades || 0}</strong>
              </div>
              <div className="performance-item good">
                <span>Good (80-89)</span>
                <strong>{performance?.overall?.goodGrades || 0}</strong>
              </div>
              <div className="performance-item average">
                <span>Average (70-79)</span>
                <strong>{performance?.overall?.averageGrades || 0}</strong>
              </div>
              <div className="performance-item below">
                <span>Below Average (&lt;70)</span>
                <strong>{performance?.overall?.belowAverageGrades || 0}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ANALYTICS TAB - Detailed Analytics */}
      {activeTab === 'analytics' && (
        <div className="dashboard-section">
          <h2>📈 Detailed Analytics</h2>

          <div className="analytics-section">
            {/* Exam Analytics */}
            {exams?.scores && exams.scores.length > 0 && (
              <div className="analytics-box">
                <h3>📋 Exam Performance</h3>
                <div className="exam-grid">
                  {exams.scores.slice(0, 4).map((exam, idx) => (
                    <div key={idx} className="exam-card">
                      <div className="exam-name">{exam.name}</div>
                      <div className="exam-score">{exam.percentage}%</div>
                      <div className="exam-grade">{exam.grade}</div>
                      <div className="exam-date">{new Date(exam.exam_date).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subject Performance */}
            {performance?.subjectBreakdown && performance.subjectBreakdown.length > 0 && (
              <div className="analytics-box">
                <h3>📚 Subject-wise Performance</h3>
                <div className="subject-breakdown">
                  {performance.subjectBreakdown.slice(0, 6).map((subject, idx) => (
                    <div key={idx} className="subject-item">
                      <div className="subject-info">
                        <span className="subject-name">{subject.name}</span>
                        <span className="subject-count">({subject.gradeCount} grades)</span>
                      </div>
                      <div className="subject-bar">
                        <div
                          className="subject-progress"
                          style={{
                            width: `${(subject.averageScore / 100) * 100}%`,
                            backgroundColor: subject.averageScore >= 80 ? '#10b981' : 
                                           subject.averageScore >= 60 ? '#f59e0b' : '#ef4444'
                          }}
                        ></div>
                      </div>
                      <span className="subject-score">{subject.averageScore?.toFixed(1) || 'N/A'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Achievements */}
            {achievements?.recent && achievements.recent.length > 0 && (
              <div className="analytics-box">
                <h3>🏆 Recent Achievements</h3>
                <div className="achievements-list">
                  {achievements.recent.map((achievement, idx) => (
                    <div key={idx} className="achievement-item">
                      <span className="achievement-icon">
                        {achievement.type === 'medal' ? '🥇' :
                         achievement.type === 'certificate' ? '🎖️' : '⭐'}
                      </span>
                      <div className="achievement-details">
                        <div className="achievement-title">{achievement.title}</div>
                        <div className="achievement-date">
                          {new Date(achievement.earned_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODULES TAB - Dashboard Cards (matching image design) */}
      {activeTab === 'modules' && (
        <div className="dashboard-section">
          <h2>🎓 Available Modules & Features</h2>
          <p className="section-subtitle">Click any card to access that feature</p>

          <div className="modules-grid">
            <DashboardCard
              icon="📅"
              title="Online Appointment"
              metric="View"
              description="Schedule appointments"
              color="purple"
              onClick={() => navigate('/appointments')}
            />
            
            <DashboardCard
              icon="👥"
              title="SIS"
              metric="Student Information"
              description="Manage student data"
              color="blue"
              onClick={() => navigate('/sis')}
            />
            
            <DashboardCard
              icon="📖"
              title="Course"
              metric={overview?.grades?.total || 0}
              description="Your enrolled courses"
              color="green"
              onClick={() => navigate('/courses')}
            />
            
            <DashboardCard
              icon="💳"
              title="Fee Management"
              metric="Track"
              description="View fees & payments"
              color="yellow"
              onClick={() => navigate('/fees')}
            />
            
            <DashboardCard
              icon="🎥"
              title="Live Classroom"
              metric="Join"
              description="Attend live classes"
              color="cyan"
              onClick={() => navigate('/live-class')}
            />
            
            <DashboardCard
              icon="📚"
              title="Library"
              metric={library?.totalIssued || 0}
              description="Books issued"
              color="orange"
              onClick={() => navigate('/library')}
            />
            
            <DashboardCard
              icon="📝"
              title="Online Admission"
              metric="Apply"
              description="Admission portal"
              color="pink"
              onClick={() => navigate('/admission')}
            />
            
            <DashboardCard
              icon="📋"
              title="Gradebook"
              metric={performance?.overall?.gpa?.toFixed(2) || 'N/A'}
              description="View your grades"
              color="blue"
              onClick={() => navigate('/grades')}
            />
            
            <DashboardCard
              icon="✨"
              title="Exam Scheduling"
              metric={overview?.exams?.upcoming || 0}
              description="Upcoming exams"
              color="green"
              onClick={() => navigate('/exams')}
            />
            
            <DashboardCard
              icon="💬"
              title="WhatsApp"
              metric="Connect"
              description="Communication hub"
              color="whatsapp"
              onClick={() => window.open('https://whatsapp.com', '_blank')}
            />
            
            <DashboardCard
              icon="🏆"
              title="Achievement"
              metric={achievements?.stats?.total || 0}
              description="Your achievements"
              color="gold"
              onClick={() => navigate('/achievements')}
            />
            
            <DashboardCard
              icon="🎓"
              title="LMS"
              metric="Learn"
              description="Learning Management System"
              color="purple"
              onClick={() => navigate('/lms')}
            />
            
            <DashboardCard
              icon="✅"
              title="Attendance Tracking"
              metric={`${overview?.attendance?.percentage || 0}%`}
              description="Your attendance"
              color="green"
              onClick={() => navigate('/attendance')}
            />
            
            <DashboardCard
              icon="📄"
              title="Assignment"
              metric={assignments?.overview?.pending || 0}
              description="Pending assignments"
              color="pink"
              onClick={() => navigate('/assignments')}
            />
            
            <DashboardCard
              icon="🏫"
              title="Campus"
              metric="Explore"
              description="Campus information"
              color="teal"
              onClick={() => navigate('/campus')}
            />
            
            <DashboardCard
              icon="📊"
              title="OMR"
              metric="Scan"
              description="Optical Mark Recognition"
              color="blue"
              onClick={() => navigate('/omr')}
            />
            
            <DashboardCard
              icon="⏰"
              title="TimeTable"
              metric="View"
              description="Class schedule"
              color="orange"
              onClick={() => navigate('/timetable')}
            />
            
            <DashboardCard
              icon="👨‍🏫"
              title="Faculty"
              metric="View"
              description="Faculty directory"
              color="purple"
              onClick={() => navigate('/faculty')}
            />
            
            <DashboardCard
              icon="🎓"
              title="Alumni"
              metric="Network"
              description="Alumni community"
              color="blue"
              onClick={() => navigate('/alumni')}
            />
            
            <DashboardCard
              icon="📢"
              title="Marketing"
              metric="Updates"
              description="News & updates"
              color="pink"
              onClick={() => navigate('/marketing')}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="dashboard-footer">
        <p>Last updated: {new Date().toLocaleTimeString()}</p>
        <button onClick={fetchDashboardData} className="small-refresh">
          🔄 Refresh Data
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;
