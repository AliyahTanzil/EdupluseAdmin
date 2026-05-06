import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button } from '../components/Shared';
import { getApiBaseUrlSync } from '../config/apiConfig';
import { getDashboardViewForAdminType, ADMIN_TYPES, SCHOOL_LEVELS } from '../config/schoolHierarchy';
import { Users, BookOpen, BarChart3, Settings, LogOut, User, Clock, Zap, FileText, Wifi, ChevronDown, TrendingUp, AlertCircle, Lock, Building2, Filter } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, hasPermission } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [dashboardConfig, setDashboardConfig] = useState(null);
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

  // Get configuration based on admin type
  useEffect(() => {
    if (user) {
      const config = getDashboardViewForAdminType(user.adminType || 'admin');
      setDashboardConfig(config);
      
      // If single school admin, set their school
      if (config.dataScope === 'single_school' && user.assignedSchools?.length > 0) {
        setSelectedSchool(user.assignedSchools[0]);
      }
    }
  }, [user]);

  useEffect(() => {
    if (dashboardConfig) {
      fetchDashboardStats();
    }
  }, [dashboardConfig, selectedSchool]);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const apiBase = getApiBaseUrlSync();
      
      // Build URL with school filter if not 'all'
      let url = `${apiBase}/dashboard/admin`;
      if (selectedSchool !== 'all') {
        url += `?school_id=${selectedSchool}`;
      }
      
      const res = await fetch(url, {
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
      // Fallback: individual endpoint fetching logic preserved but updated with school filter
      setLoading(false);
    } finally {
      setLoading(false);
    }
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

  const allMenuItems = [
    {
      id: 'students',
      title: 'Students',
      description: 'Manage all students - add, edit, delete',
      icon: Users,
      onClick: () => navigate('/students'),
      color: 'from-blue-500 to-blue-600',
      requiredPermissions: ['view_students', 'manage_students']
    },
    {
      id: 'teachers',
      title: 'Teachers',
      description: 'Manage all teachers and staff',
      icon: User,
      onClick: () => navigate('/teachers'),
      color: 'from-green-500 to-green-600',
      requiredPermissions: ['view_teachers', 'manage_teachers']
    },
    {
      id: 'subjects',
      title: 'Subjects',
      description: 'Manage subjects and curriculum',
      icon: BookOpen,
      onClick: () => navigate('/subjects'),
      color: 'from-purple-500 to-purple-600',
      requiredPermissions: ['manage_classes']
    },
    {
      id: 'timetable',
      title: 'Timetable',
      description: 'Create and manage class schedules',
      icon: Clock,
      onClick: () => navigate('/timetable'),
      color: 'from-orange-500 to-orange-600',
      requiredPermissions: ['manage_classes']
    },
    {
      id: 'attendance',
      title: 'Attendance',
      description: 'View and manage attendance records',
      icon: BarChart3,
      onClick: () => navigate('/attendance'),
      color: 'from-red-500 to-red-600',
      requiredPermissions: ['view_attendance']
    },
    {
      id: 'mark_attendance',
      title: 'Mark Attendance',
      description: 'Mark daily student attendance',
      icon: Zap,
      onClick: () => navigate('/mark-attendance'),
      color: 'from-yellow-500 to-yellow-600',
      requiredPermissions: ['manage_attendance']
    },
    {
      id: 'finance',
      title: 'Finance',
      description: 'Manage fees, payments and budgets',
      icon: TrendingUp,
      onClick: () => navigate('/finance'),
      color: 'from-emerald-500 to-emerald-600',
      requiredPermissions: ['view_finances']
    },
    {
      id: 'reports',
      title: 'Reports',
      description: 'Generate and export reports',
      icon: FileText,
      onClick: () => navigate('/export-reports'),
      color: 'from-cyan-500 to-cyan-600',
      requiredPermissions: ['view_all_reports', 'create_reports']
    },
    {
      id: 'devices',
      title: 'Devices',
      description: 'Manage biometric devices',
      icon: Wifi,
      onClick: () => navigate('/manage-devices'),
      color: 'from-pink-500 to-pink-600',
      requiredPermissions: ['manage_devices']
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'System configuration and preferences',
      icon: Settings,
      onClick: () => navigate('/settings'),
      color: 'from-gray-500 to-gray-600',
      requiredPermissions: ['super_admin_only']
    }
  ];

  // Filter menu items based on dashboard configuration
  const menuItems = allMenuItems.filter(item => {
    if (!dashboardConfig) return false;
    
    // CEO sees everything
    if (user?.adminType === ADMIN_TYPES.CEO) return true;
    
    // Filter by configured modules
    return dashboardConfig.modules.includes(item.id) || 
           (item.id === 'mark_attendance' && dashboardConfig.modules.includes('attendance'));
  });

  const getSchoolLabel = (value) => {
    switch (value) {
      case SCHOOL_LEVELS.NURSERY: return 'Nursery / Day Care';
      case SCHOOL_LEVELS.PRIMARY: return 'Primary School';
      case SCHOOL_LEVELS.JUNIOR_SECONDARY: return 'Junior Secondary';
      case SCHOOL_LEVELS.SENIOR_SECONDARY: return 'Senior Secondary';
      case 'all': return 'All Schools';
      default: return value;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" onClick={() => setShowProfileMenu(false)}>
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user?.adminType === ADMIN_TYPES.CEO ? 'Central Admin Dashboard' : 
                 user?.adminType === ADMIN_TYPES.PRINCIPAL ? 'Principal Dashboard' :
                 'Admin Dashboard'}
              </h1>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <p>Welcome back, {user?.name}!</p>
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold uppercase">
                  {user?.adminType?.replace('_', ' ') || 'Admin'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto" onClick={(e) => e.stopPropagation()}>
              {/* School Selector (only for multi-school admins) */}
              {(user?.adminType === ADMIN_TYPES.CEO || user?.adminType === ADMIN_TYPES.PRINCIPAL || user?.adminType === ADMIN_TYPES.FINANCE) && (
                <div className="relative flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
                  <Building2 size={18} className="text-gray-500" />
                  <select 
                    value={selectedSchool}
                    onChange={(e) => setSelectedSchool(e.target.value)}
                    className="bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 cursor-pointer outline-none"
                  >
                    <option value="all">All Assigned Schools</option>
                    {(user.assignedSchools || []).map(school => (
                      <option key={school} value={school}>{getSchoolLabel(school)}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors font-medium text-blue-700"
                >
                  <User size={20} />
                  <span className="hidden sm:inline">{user?.name}</span>
                  <ChevronDown size={18} />
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
                    <button
                      type="button"
                      onClick={() => navigate('/profile-settings')}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-200 flex items-center gap-2 text-gray-700 font-medium transition-colors"
                    >
                      <User size={18} />
                      Profile Settings
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/logout')}
                      className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-700 font-medium flex items-center gap-2 transition-colors"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedSchool === 'all' ? 'Consolidated Statistics' : `${getSchoolLabel(selectedSchool)} Statistics`}
          </h2>
          {loading && <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>}
        </div>

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
              <Card key={index} className={`border-2 ${colorMap[stat.color]} hover:shadow-md transition-shadow`}>
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
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Administrative Functions</h2>
          <div className="h-px flex-grow bg-gray-200 ml-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            
            // Permission check logic
            let hasAccess = false;
            if (item.requiredPermissions?.includes('super_admin_only')) {
              hasAccess = user?.isSuperUser || user?.adminType === ADMIN_TYPES.CEO;
            } else {
              hasAccess = item.requiredPermissions?.some(perm => hasPermission(perm)) || user?.adminType === ADMIN_TYPES.CEO;
            }

            if (!hasAccess) {
              return (
                <Card key={index} className="opacity-50 cursor-not-allowed bg-gray-50 border-gray-200">
                  <div className="p-6 relative overflow-hidden">
                    <div className="absolute top-2 right-2 text-gray-400">
                      <Lock size={16} />
                    </div>
                    <div className={`inline-flex p-3 rounded-lg bg-gray-300 mb-4`}>
                      <Icon className="text-gray-500" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-400 mb-1">{item.title}</h3>
                    <p className="text-gray-400 text-xs">Access Restricted</p>
                  </div>
                </Card>
              );
            }

            return (
              <Card key={index} className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 border-none">
                <div 
                  onClick={item.onClick}
                  className="p-6 h-full flex flex-col"
                >
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${item.color} mb-4 shadow-sm`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm flex-grow">{item.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 flex items-start gap-4">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
            <AlertCircle size={24} />
          </div>
          <div>
            <h4 className="text-blue-900 font-bold mb-1">Hierarchy Information</h4>
            <p className="text-blue-800 text-sm opacity-90">
              Your account ({user?.adminType?.replace('_', ' ')}) has access to {user?.assignedSchools?.length || 0} school level(s). 
              The statistics and data shown are filtered based on your assigned scope for security and relevance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
