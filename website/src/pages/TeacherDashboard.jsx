import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button } from '../components/Shared';
import { BookOpen, Users, BarChart3, LogOut, GraduationCap, Clock, TrendingUp, User, ChevronDown } from 'lucide-react';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    totalSubjects: 0,
    attendanceToday: 0,
    presentStudents: 0,
    absentStudents: 0,
    averageAttendance: '0%',
    totalAssignments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const today = new Date().toISOString().split('T')[0];
      const [subjectsRes, attendanceRes] = await Promise.all([
        fetch('http://localhost:5001/api/subjects', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`http://localhost:5001/api/attendance?date=${today}`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const subjectsData = await subjectsRes.json();
      const attendanceData = attendanceRes.ok ? await attendanceRes.json() : { data: [] };

      // Mock data for teacher-specific stats
      const teacherClasses = subjectsData.data?.filter(s => s.teacher === user?.id)?.length || 3;
      const totalStudentsCount = 120; // Mock
      const presentCount = attendanceData.data?.filter(a => a.status === 'present').length || 95;
      const totalAttendance = attendanceData.data?.length || 100;
      const absentCount = totalAttendance - presentCount;

      setStats({
        totalClasses: teacherClasses,
        totalStudents: totalStudentsCount,
        totalSubjects: teacherClasses,
        attendanceToday: totalAttendance,
        presentStudents: presentCount,
        absentStudents: absentCount,
        averageAttendance: Math.round((presentCount / totalAttendance) * 100) + '%',
        totalAssignments: 12
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats(prev => ({
        ...prev,
        totalClasses: 3,
        totalStudents: 120,
        totalSubjects: 3,
        attendanceToday: 100,
        presentStudents: 95,
        absentStudents: 5,
        averageAttendance: '95%',
        totalAssignments: 12
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
      title: 'My Classes',
      value: stats.totalClasses,
      icon: GraduationCap,
      color: 'green',
      trend: 'Classes assigned'
    },
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'blue',
      trend: 'Students in your classes'
    },
    {
      title: 'My Subjects',
      value: stats.totalSubjects,
      icon: BookOpen,
      color: 'purple',
      trend: 'Subjects teaching'
    },
    {
      title: 'Attendance Today',
      value: `${stats.presentStudents}/${stats.attendanceToday}`,
      icon: BarChart3,
      color: 'orange',
      trend: `${stats.absentStudents} absent`
    },
    {
      title: 'Average Attendance',
      value: stats.averageAttendance,
      icon: TrendingUp,
      color: 'cyan',
      trend: 'Class average'
    },
    {
      title: 'Assignments',
      value: stats.totalAssignments,
      icon: BookOpen,
      color: 'red',
      trend: 'Active assignments'
    }
  ];

  const menuItems = [
    {
      title: 'My Subjects',
      description: 'Manage subjects you teach',
      icon: BookOpen,
      onClick: () => navigate('/subjects'),
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'My Classes',
      description: 'View classes you teach',
      icon: GraduationCap,
      onClick: () => navigate('/classes'),
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Mark Attendance',
      description: 'Mark student attendance',
      icon: Clock,
      onClick: () => navigate('/mark-attendance'),
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'Attendance Records',
      description: 'View attendance history',
      icon: BarChart3,
      onClick: () => navigate('/attendance'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Class Students',
      description: 'Manage your class students',
      icon: Users,
      onClick: () => navigate('/students'),
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      title: 'Assignment Reports',
      description: 'View assignment submissions',
      icon: BookOpen,
      onClick: () => navigate('/reports'),
      color: 'from-orange-500 to-orange-600'
    }
  ];

  if (user?.isClassMaster) {
    menuItems.push({
      title: 'Class Grades',
      description: 'Manage student grades',
      icon: BarChart3,
      onClick: () => navigate('/grades'),
      color: 'from-red-500 to-red-600'
    });
  }

  return (
    <div className="min-h-screen bg-gray-50" onClick={() => setShowProfileMenu(false)}>
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
              {user?.isClassMaster && (
                <p className="text-blue-600 text-sm font-medium mt-1">Class Master for {user?.class}</p>
              )}
            </div>
            <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors font-medium text-green-700 z-40"
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview & Statistics</h2>
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

        {/* Teaching Functions */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Teaching Functions</h2>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

export default TeacherDashboard;
