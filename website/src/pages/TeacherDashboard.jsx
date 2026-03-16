import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button } from '../components/Shared';
import { BookOpen, Users, BarChart3, LogOut, GraduationCap, Clock } from 'lucide-react';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      title: 'My Subjects',
      description: 'Manage subjects you teach',
      icon: BookOpen,
      onClick: () => navigate('/subjects')
    },
    {
      title: 'My Classes',
      description: 'View classes you teach',
      icon: GraduationCap,
      onClick: () => navigate('/classes')
    },
    {
      title: 'Mark Attendance',
      description: 'Mark student attendance',
      icon: Clock,
      onClick: () => navigate('/mark-attendance')
    },
    {
      title: 'Attendance Records',
      description: 'View attendance history',
      icon: BarChart3,
      onClick: () => navigate('/attendance')
    }
  ];

  // Show class master options if applicable
  if (user?.isClassMaster) {
    menuItems.push({
      title: 'Class Students',
      description: 'Manage your class students',
      icon: Users,
      onClick: () => navigate('/students')
    });
    menuItems.push({
      title: 'Class Grades',
      description: 'Manage student grades',
      icon: BarChart3,
      onClick: () => navigate('/grades')
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                  <Icon className="text-green-600 mb-4" size={32} />
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
