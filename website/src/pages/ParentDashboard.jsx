import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button } from '../components/Shared';
import { Users, BarChart3, Bell, LogOut, GraduationCap, ClipboardList } from 'lucide-react';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      title: 'My Children',
      description: 'View information about your children',
      icon: Users,
      onClick: () => navigate('/parent-children')
    },
    {
      title: 'Children Grades',
      description: 'View grades and academic performance',
      icon: BarChart3,
      onClick: () => navigate('/parent-grades')
    },
    {
      title: 'Attendance',
      description: 'View attendance records',
      icon: GraduationCap,
      onClick: () => navigate('/parent-attendance')
    },
    {
      title: 'Notifications',
      description: 'View alerts and notifications',
      icon: Bell,
      onClick: () => navigate('/parent-notifications')
    },
    {
      title: 'Learning Checklist',
      description: 'Personal learning progress',
      icon: ClipboardList,
      onClick: () => navigate('/parent-learning-checklist')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
            </div>
            <Button variant="danger" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                <div 
                  onClick={item.onClick}
                  className="p-6"
                >
                  <Icon className="text-orange-600 mb-4" size={32} />
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
