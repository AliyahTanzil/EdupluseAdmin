import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, StatCard, Button, LoadingSpinner } from '../components/Shared';
import { Users, UserCheck, BookOpen, CheckCircle } from 'lucide-react';
import { studentsAPI, teachersAPI, attendanceAPI } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { 
      title: 'Total Students', 
      value: '0', 
      icon: Users,
      trend: { positive: true, value: 0, label: 'total' },
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    { 
      title: 'Total Teachers', 
      value: '0', 
      icon: UserCheck,
      trend: { positive: true, value: 0, label: 'total' },
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    { 
      title: 'Today\'s Present', 
      value: '0', 
      icon: BookOpen,
      trend: { positive: true, value: 0, label: 'today' },
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    { 
      title: 'Attendance Rate', 
      value: '0%', 
      icon: CheckCircle,
      trend: { positive: true, value: 0, label: 'today' },
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    },
  ]);

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load students
      const studentsRes = await studentsAPI.getAll({ limit: 1000, offset: 0 });
      const studentCount = studentsRes.success ? (studentsRes.data?.length || 0) : 0;

      // Load teachers
      const teachersRes = await teachersAPI.getAll({ limit: 1000, offset: 0 });
      const teacherCount = teachersRes.success ? (teachersRes.data?.length || 0) : 0;

      // Load today's attendance
      const today = new Date().toISOString().split('T')[0];
      const attendanceRes = await attendanceAPI.getAll({ limit: 10000, offset: 0 });
      
      let todayPresent = 0;
      let todayTotal = 0;
      if (attendanceRes.success && attendanceRes.data) {
        const todayRecords = attendanceRes.data.filter(r => r.date === today);
        todayTotal = todayRecords.length;
        todayPresent = todayRecords.filter(r => r.morning_status === 'present' || r.status === 'present').length;
      }

      const attendanceRate = todayTotal > 0 ? Math.round((todayPresent / todayTotal) * 100) : 0;

      // Update stats
      setStats([
        { 
          title: 'Total Students', 
          value: studentCount.toString(), 
          icon: Users,
          trend: { positive: true, value: studentCount, label: 'registered' },
          bgColor: 'bg-blue-50',
          iconColor: 'text-blue-600'
        },
        { 
          title: 'Total Teachers', 
          value: teacherCount.toString(), 
          icon: UserCheck,
          trend: { positive: true, value: teacherCount, label: 'on staff' },
          bgColor: 'bg-green-50',
          iconColor: 'text-green-600'
        },
        { 
          title: 'Today\'s Present', 
          value: todayPresent.toString(), 
          icon: BookOpen,
          trend: { positive: todayPresent > 0, value: todayPresent, label: `of ${todayTotal}` },
          bgColor: 'bg-purple-50',
          iconColor: 'text-purple-600'
        },
        { 
          title: 'Attendance Rate', 
          value: `${attendanceRate}%`, 
          icon: CheckCircle,
          trend: { positive: attendanceRate >= 90, value: attendanceRate, label: 'today' },
          bgColor: 'bg-yellow-50',
          iconColor: 'text-yellow-600'
        },
      ]);

      // Generate recent activity
      const activities = [];
      
      if (studentCount > 0) {
        activities.push({
          type: 'students',
          text: `${studentCount} students enrolled in the system`,
          time: new Date().toLocaleString()
        });
      }
      
      if (teacherCount > 0) {
        activities.push({
          type: 'teachers',
          text: `${teacherCount} teachers registered`,
          time: new Date().toLocaleString()
        });
      }

      if (todayTotal > 0) {
        activities.push({
          type: 'attendance',
          text: `${todayPresent} out of ${todayTotal} students present today`,
          time: new Date().toLocaleString()
        });
      }

      if (attendanceRes.success && attendanceRes.data && attendanceRes.data.length > 0) {
        const latest = attendanceRes.data[0];
        activities.push({
          type: 'attendance',
          text: `Latest attendance: ${latest.morning_status || latest.status}`,
          time: latest.date || new Date().toLocaleString()
        });
      }

      setRecentActivity(activities.slice(0, 4));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card elevation="lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <p className="text-gray-600">No recent activity</p>
          ) : (
            <ul className="space-y-3">
              {recentActivity.map((activity, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                    activity.type === 'students' ? 'bg-blue-500' :
                    activity.type === 'teachers' ? 'bg-green-500' :
                    'bg-yellow-500'
                  }`}></span>
                  <div>
                    <span className="text-gray-700">{activity.text}</span>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card elevation="lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Quick Actions</h2>
          <div className="space-y-3">
            <Button variant="primary" fullWidth onClick={() => navigate('/add-new-student')}>
              Add New Student
            </Button>
            <Button variant="success" fullWidth onClick={() => navigate('/generate-report')}>
              Generate Report
            </Button>
            <Button variant="outline" fullWidth onClick={() => navigate('/mark-attendance')}>
              Mark Attendance
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;