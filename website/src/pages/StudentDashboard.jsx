import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button } from '../components/Shared';
import { User, BookOpen, BarChart3, LogOut, GraduationCap } from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      title: 'My Profile',
      description: 'View your personal information',
      icon: User,
      onClick: () => navigate('/student-profile')
    },
    {
      title: 'My Grades',
      description: 'View your grades and performance',
      icon: BarChart3,
      onClick: () => navigate('/student-grades')
    },
    {
      title: 'My Subjects',
      description: 'View subjects you are enrolled in',
      icon: BookOpen,
      onClick: () => navigate('/student-subjects')
    },
    {
      title: 'My Teachers',
      description: 'View your teachers',
      icon: GraduationCap,
      onClick: () => navigate('/student-teachers')
    },
    {
      title: 'Attendance',
      description: 'View your attendance record',
      icon: BarChart3,
      onClick: () => navigate('/student-attendance')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
              <p className="text-blue-600 text-sm font-medium mt-1">Class: {user?.class}</p>
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
                  <Icon className="text-purple-600 mb-4" size={32} />
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
