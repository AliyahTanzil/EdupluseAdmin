import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button } from '../components/Shared';
import { getApiBaseUrlSync } from '../config/apiConfig';
import { Users, BookOpen, BarChart3, Settings, LogOut, User, Clock, Zap, FileText, Wifi, ChevronDown, TrendingUp, AlertCircle, Lock } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, hasPermission } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalAttendanceToday: 0,
    presentStudents: 0,
    absentStudents: 0,
    pendingTasks: 0,
    systemHealth: 'Good'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const apiBase = getApiBaseUrlSync();
      
      const res = await fetch(`${apiBase}/dashboard/admin`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error(`Dashboard API returned ${res.status}`);
      }

      const result = await res.json();
      const dashStats = result.dashboard?.stats || {};

      setStats({
        totalStudents: dashStats.totalStudents || 0,
        totalTeachers: dashStats.totalTeachers || 0,
        totalClasses: dashStats.totalSubjects || 0,
        totalAttendanceToday: dashStats.totalAttendanceToday || 0,
        presentStudents: dashStats.presentToday || 0,
        absentStudents: dashStats.absentToday || 0,
        pendingTasks: dashStats.totalCourses || 0,
        systemHealth: 'Good'
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Fallback: try individual endpoints if dashboard endpoint fails
      try {
        const token = localStorage.getItem('authToken');
        const apiBase = getApiBaseUrlSync();
        const safeFetch = async (url) => {
          try {
            const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!res.ok) return { data: [] };
            return await res.json();
          } catch {
            return { data: [] };
          }
        };

        const [studentsData, teachersData, attendanceData] = await Promise.all([
          safeFetch(`${apiBase}/students`),
          safeFetch(`${apiBase}/teachers`),
          safeFetch(`${apiBase}/attendance?date=${new Date().toISOString().split('T')[0]}`)
        ]);

        setStats({
          totalStudents: studentsData.data?.length || studentsData.pagination?.total || 0,
          totalTeachers: teachersData.data?.length || teachersData.total || 0,
          totalClasses: Math.ceil((studentsData.pagination?.total || studentsData.data?.length || 0) / 30),
          totalAttendanceToday: attendanceData.data?.length || 0,
          presentStudents: attendanceData.data?.filter(a => a.morning_status === 'present').length || 0,
          absentStudents: attendanceData.data?.filter(a => a.morning_status === 'absent').length || 0,
          pendingTasks: 0,
          systemHealth: 'Good'
        });
      } catch (fallbackError) {
        console.error('Fallback fetch also failed:', fallbackError);
      }
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
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'blue',
      trend: '+12% from last month'
    },
    {
      title: 'Total Teachers',
      value: stats.totalTeachers,
      icon: User,
      color: 'green',
      trend: '+5% from last month'
    },
    {
      title: 'Total Classes',
      value: stats.totalClasses,
      icon: BookOpen,
      color: 'purple',
      trend: 'Total subjects in system'
    },
    {
      title: 'Attendance Today',
      value: `${stats.presentStudents}/${stats.totalAttendanceToday}`,
      icon: BarChart3,
      color: 'orange',
      trend: `${stats.absentStudents} absent`
    },
    {
      title: 'Total Courses',
      value: stats.pendingTasks,
      icon: AlertCircle,
      color: 'red',
      trend: 'Registered courses'
    },
    {
      title: 'System Health',
      value: stats.systemHealth,
      icon: Zap,
      color: 'cyan',
      trend: 'All systems operational'
    }
  ];

  const menuItems = [
    {
      title: 'Students',
      description: 'Manage all students - add, edit, delete',
      icon: Users,
      onClick: () => navigate('/students'),
      color: 'from-blue-500 to-blue-600',
      requiredPermissions: ['view_students', 'manage_students']
    },
    {
      title: 'Teachers',
      description: 'Manage all teachers and staff',
      icon: User,
      onClick: () => navigate('/teachers'),
      color: 'from-green-500 to-green-600',
      requiredPermissions: ['view_teachers', 'manage_teachers']
    },
    {
      title: 'Subjects',
      description: 'Manage subjects and curriculum',
      icon: BookOpen,
      onClick: () => navigate('/subjects'),
      color: 'from-purple-500 to-purple-600',
      requiredPermissions: ['manage_classes']
    },
    {
      title: 'Timetable',
      description: 'Create and manage class schedules',
      icon: Clock,
      onClick: () => navigate('/timetable'),
      color: 'from-orange-500 to-orange-600',
      requiredPermissions: ['manage_classes']
    },
    {
      title: 'Attendance',
      description: 'View and manage attendance records',
      icon: BarChart3,
      onClick: () => navigate('/attendance'),
      color: 'from-red-500 to-red-600',
      requiredPermissions: ['view_attendance']
    },
    {
      title: 'Mark Attendance',
      description: 'Mark daily student attendance',
      icon: Zap,
      onClick: () => navigate('/mark-attendance'),
      color: 'from-yellow-500 to-yellow-600',
      requiredPermissions: ['manage_attendance']
    },
    {
      title: 'Courses',
      description: 'Manage courses and programs',
      icon: BookOpen,
      onClick: () => navigate('/courses'),
      color: 'from-indigo-500 to-indigo-600',
      requiredPermissions: ['manage_classes']
    },
    {
      title: 'Reports',
      description: 'Generate and export reports',
      icon: FileText,
      onClick: () => navigate('/export-reports'),
      color: 'from-cyan-500 to-cyan-600',
      requiredPermissions: ['view_all_reports', 'create_reports']
    },
    {
      title: 'Devices',
      description: 'Manage biometric devices',
      icon: Wifi,
      onClick: () => navigate('/manage-devices'),
      color: 'from-pink-500 to-pink-600',
      requiredPermissions: ['manage_devices']
    },
    {
      title: 'Settings',
      description: 'System configuration and preferences',
      icon: Settings,
      onClick: () => navigate('/settings'),
      color: 'from-gray-500 to-gray-600',
      requiredPermissions: ['super_admin_only']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50" onClick={() => setShowProfileMenu(false)}>
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name}! {user?.isSuperUser && <span className="text-blue-600 font-semibold">(Super Admin)</span>}</p>
            </div>
            <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors font-medium text-blue-700 z-40"
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

        {/* Management Functions */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Administrative Functions</h2>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            
            // Check if super admin is required
            if (item.requiredPermissions?.includes('super_admin_only')) {
              if (!user?.role?.isSuperAdmin) {
                return null;
              }
            } else {
              // Check if user has at least one required permission
              const hasAccess = item.requiredPermissions?.some(perm => hasPermission(perm));
              if (!hasAccess) {
                return (
                  <Card key={index} className="opacity-50 cursor-not-allowed">
                    <div className="p-6 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="text-gray-400" size={32} />
                      </div>
                      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${item.color} mb-4 opacity-50`}>
                        <Icon className="text-white" size={24} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-600 mb-1 line-through">{item.title}</h3>
                      <p className="text-gray-500 text-sm">Insufficient permissions</p>
                    </div>
                  </Card>
                );
              }
            }

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

export default AdminDashboard;
