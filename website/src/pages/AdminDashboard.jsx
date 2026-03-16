import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button } from '../components/Shared';
import { Users, BookOpen, BarChart3, Settings, LogOut, User, Clock, Zap, FileText, Wifi, ChevronDown } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      setShowProfileMenu(false);
      logout();
      // Navigate after a brief delay to allow state to update
      await new Promise(resolve => setTimeout(resolve, 50));
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login', { replace: true });
    }
  };

  const handleProfileClick = () => {
    navigate('/profile-settings');
    setShowProfileMenu(false);
  };

  const menuItems = [
    {
      title: 'Students',
      description: 'Manage all students - add, edit, delete',
      icon: Users,
      onClick: () => navigate('/students'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Teachers',
      description: 'Manage all teachers and staff',
      icon: User,
      onClick: () => navigate('/teachers'),
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Subjects',
      description: 'Manage subjects and curriculum',
      icon: BookOpen,
      onClick: () => navigate('/subjects'),
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Timetable',
      description: 'Create and manage class schedules',
      icon: Clock,
      onClick: () => navigate('/timetable'),
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Attendance',
      description: 'View and manage attendance records',
      icon: BarChart3,
      onClick: () => navigate('/attendance'),
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'Mark Attendance',
      description: 'Mark daily student attendance',
      icon: Zap,
      onClick: () => navigate('/mark-attendance'),
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'Courses',
      description: 'Manage courses and programs',
      icon: BookOpen,
      onClick: () => navigate('/courses'),
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'Reports',
      description: 'Generate and export reports',
      icon: FileText,
      onClick: () => navigate('/export-reports'),
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      title: 'Devices',
      description: 'Manage biometric devices',
      icon: Wifi,
      onClick: () => navigate('/manage-devices'),
      color: 'from-pink-500 to-pink-600'
    },
    {
      title: 'Settings',
      description: 'System configuration and preferences',
      icon: Settings,
      onClick: () => navigate('/settings'),
      color: 'from-gray-500 to-gray-600'
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Administrative Functions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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

export default AdminDashboard;
