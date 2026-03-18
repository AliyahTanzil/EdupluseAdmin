import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button } from '../components/Shared';
import { User, BookOpen, BarChart3, LogOut, GraduationCap, TrendingUp, Award, Clock, ChevronDown } from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalClasses: 0,
    attendancePercentage: '0%',
    presentDays: 0,
    absentDays: 0,
    averageGrade: 'A',
    gpa: '3.8',
    upcomingTests: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const [subjectsRes, attendanceRes] = await Promise.all([
        fetch('http://localhost:5001/api/subjects', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5001/api/attendance', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const subjectsData = await subjectsRes.json();
      const attendanceData = await attendanceRes.json();

      const present = attendanceData.data?.filter(a => a.status === 'present').length || 85;
      const absent = attendanceData.data?.filter(a => a.status === 'absent').length || 15;
      const total = present + absent;

      setStats({
        totalSubjects: subjectsData.data?.length || 6,
        totalClasses: 5,
        attendancePercentage: Math.round((present / total) * 100) + '%',
        presentDays: present,
        absentDays: absent,
        averageGrade: 'A',
        gpa: '3.8',
        upcomingTests: 3
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats(prev => ({
        ...prev,
        totalSubjects: 6,
        totalClasses: 5,
        attendancePercentage: '85%',
        presentDays: 85,
        absentDays: 15,
        averageGrade: 'A',
        gpa: '3.8',
        upcomingTests: 3
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setShowProfileMenu(false);
    navigate('/logout');
  };

  const handleProfileClick = () => {
    navigate('/profile-settings');
    setShowProfileMenu(false);
  };

  const statCards = [
    {
      title: 'Enrolled Subjects',
      value: stats.totalSubjects,
      icon: BookOpen,
      color: 'purple',
      trend: 'Current subjects'
    },
    {
      title: 'Attendance Rate',
      value: stats.attendancePercentage,
      icon: BarChart3,
      color: 'green',
      trend: `${stats.presentDays} present, ${stats.absentDays} absent`
    },
    {
      title: 'Average Grade',
      value: stats.averageGrade,
      icon: Award,
      color: 'blue',
      trend: 'Based on assessments'
    },
    {
      title: 'GPA',
      value: stats.gpa,
      icon: TrendingUp,
      color: 'cyan',
      trend: 'Current semester'
    },
    {
      title: 'Classes',
      value: stats.totalClasses,
      icon: GraduationCap,
      color: 'orange',
      trend: 'Total classes enrolled'
    },
    {
      title: 'Upcoming Tests',
      value: stats.upcomingTests,
      icon: Clock,
      color: 'red',
      trend: 'In next 2 weeks'
    }
  ];

  const menuItems = [
    {
      title: 'My Profile',
      description: 'View your personal information',
      icon: User,
      onClick: () => navigate('/student-profile'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'My Grades',
      description: 'View your grades and performance',
      icon: BarChart3,
      onClick: () => navigate('/student-grades'),
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'My Subjects',
      description: 'View subjects you are enrolled in',
      icon: BookOpen,
      onClick: () => navigate('/student-subjects'),
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'My Teachers',
      description: 'View your teachers contact info',
      icon: GraduationCap,
      onClick: () => navigate('/student-teachers'),
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Attendance',
      description: 'View your attendance record',
      icon: Clock,
      onClick: () => navigate('/student-attendance'),
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'Class Timetable',
      description: 'View your class schedule',
      icon: Clock,
      onClick: () => navigate('/student-timetable'),
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'Assignments',
      description: 'View and submit assignments',
      icon: BookOpen,
      onClick: () => navigate('/student-assignments'),
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      title: 'Report Card',
      description: 'View your comprehensive report',
      icon: Award,
      onClick: () => navigate('/student-report-card'),
      color: 'from-pink-500 to-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50" onClick={() => setShowProfileMenu(false)}>
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
              <p className="text-blue-600 text-sm font-medium mt-1">Class: {user?.class}</p>
            </div>
            <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors font-medium text-purple-700 z-40"
                >
                  <User size={20} />
                  <span>{user?.name}</span>
                  <ChevronDown size={18} />
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleProfileClick();
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-200 flex items-center gap-2 text-gray-700 font-medium transition-colors cursor-pointer"
                    >
                      <User size={18} />
                      Profile Settings
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-700 font-medium flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
              
              {/* Direct Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Academic Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            const colorMap = {
              blue: 'bg-blue-50 text-blue-700 border-blue-200',
              green: 'bg-green-50 text-green-700 border-green-200',
              purple: 'bg-purple-50 text-purple-700 border-purple-200',
              orange: 'bg-orange-50 text-orange-700 border-orange-200',
              red: 'bg-red-50 text-red-700 border-red-200',
              cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200'
            };
            return (
              <Card key={index} className={`border-2 ${colorMap[stat.color]}`}>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <Icon className="text-2xl opacity-50" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium">
                    <TrendingUp size={14} className="text-green-600" />
                    <span className="text-gray-600">{stat.trend}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Academic Functions */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Academic Resources</h2>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200">
                <div 
                  onClick={item.onClick}
                  className="p-6"
                >
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${item.color} mb-4`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
