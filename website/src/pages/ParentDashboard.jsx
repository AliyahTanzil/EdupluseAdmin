import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getApiBaseUrlSync } from '../config/apiConfig';
import { Card, Button } from '../components/Shared';
import { Users, BarChart3, Bell, LogOut, GraduationCap, ClipboardList, User, ChevronDown, TrendingUp, AlertCircle, Mail, Heart } from 'lucide-react';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, hasPermission } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [stats, setStats] = useState({
    totalChildren: 0,
    childrenAttendanceAvg: '0%',
    totalNotifications: 0,
    unreadMessages: 0,
    childrenGradeAvg: 'A',
    schoolEvents: 0,
    upcomingAppointments: 0,
    academicConcerns: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      // Fetch children data and their statistics
      const apiBase = getApiBaseUrlSync();
      const [studentsRes] = await Promise.all([
        fetch(`${apiBase}/students`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const studentsData = await studentsRes.json();
      
      // Mock data for parent-specific stats
      const children = studentsData.data?.filter(s => s.parentId === user?.id) || [];
      
      setStats({
        totalChildren: children.length || 2,
        childrenAttendanceAvg: '88%',
        totalNotifications: 5,
        unreadMessages: 2,
        childrenGradeAvg: 'A-',
        schoolEvents: 4,
        upcomingAppointments: 1,
        academicConcerns: 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats(prev => ({
        ...prev,
        totalChildren: 2,
        childrenAttendanceAvg: '88%',
        totalNotifications: 5,
        unreadMessages: 2,
        childrenGradeAvg: 'A-',
        schoolEvents: 4,
        upcomingAppointments: 1,
        academicConcerns: 0
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
      title: 'My Children',
      value: stats.totalChildren,
      icon: Users,
      color: 'blue',
      trend: 'Children enrolled'
    },
    {
      title: 'Attendance Average',
      value: stats.childrenAttendanceAvg,
      icon: BarChart3,
      color: 'green',
      trend: 'All children'
    },
    {
      title: 'Grade Average',
      value: stats.childrenGradeAvg,
      icon: GraduationCap,
      color: 'purple',
      trend: 'Academic performance'
    },
    {
      title: 'Notifications',
      value: stats.totalNotifications,
      icon: Bell,
      color: 'orange',
      trend: `${stats.unreadMessages} unread messages`
    },
    {
      title: 'School Events',
      value: stats.schoolEvents,
      icon: Heart,
      color: 'pink',
      trend: 'Upcoming events'
    },
    {
      title: 'Academic Concerns',
      value: stats.academicConcerns,
      icon: AlertCircle,
      color: 'red',
      trend: 'Requires attention'
    }
  ];

  const menuItems = [
    {
      title: 'My Children',
      description: 'View information about your children',
      icon: Users,
      onClick: () => navigate('/parent-children'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Children Grades',
      description: 'View grades and academic performance',
      icon: BarChart3,
      onClick: () => navigate('/parent-grades'),
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Attendance Records',
      description: 'View children attendance records',
      icon: GraduationCap,
      onClick: () => navigate('/parent-attendance'),
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Messages',
      description: 'Communicate with teachers',
      icon: Mail,
      onClick: () => navigate('/parent-messages'),
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Notifications',
      description: 'View alerts and school updates',
      icon: Bell,
      onClick: () => navigate('/parent-notifications'),
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'School Events',
      description: 'View school events and calendar',
      icon: Heart,
      onClick: () => navigate('/parent-events'),
      color: 'from-pink-500 to-pink-600'
    },
    {
      title: 'Teacher Contact',
      description: 'Contact your children\'s teachers',
      icon: Users,
      onClick: () => navigate('/parent-teachers'),
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      title: 'Report Cards',
      description: 'Download comprehensive reports',
      icon: ClipboardList,
      onClick: () => navigate('/parent-report-cards'),
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50" onClick={() => setShowProfileMenu(false)}>
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Parent Portal</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
              <p className="text-orange-600 text-sm font-medium mt-1">Monitor your children's academic progress</p>
            </div>
            <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors font-medium text-orange-700 z-40"
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Children's Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            const colorMap = {
              blue: 'bg-blue-50 text-blue-700 border-blue-200',
              green: 'bg-green-50 text-green-700 border-green-200',
              purple: 'bg-purple-50 text-purple-700 border-purple-200',
              orange: 'bg-orange-50 text-orange-700 border-orange-200',
              red: 'bg-red-50 text-red-700 border-red-200',
              pink: 'bg-pink-50 text-pink-700 border-pink-200'
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

        {/* Parent Functions */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Parent Resources</h2>
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

export default ParentDashboard;
