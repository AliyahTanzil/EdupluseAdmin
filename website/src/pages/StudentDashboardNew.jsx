import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Users, BookOpen, GraduationCap, LogOut, Settings, Bell,
  BarChart3, Calendar, FileText, MessageSquare, Medal,
  Video, Smartphone, DollarSign, Clock, Home, User
} from 'lucide-react';
import '../styles/modernDashboard.css';

const ModuleCard = ({ icon: Icon, title, description, onClick, color }) => (
  <div className="module-card" style={{ borderTopColor: color }} onClick={onClick}>
    <div className="module-icon" style={{ color }}>
      <Icon size={40} />
    </div>
    <div className="module-title">{title}</div>
    {description && <div className="module-description">{description}</div>}
  </div>
);

const StudentDashboardNew = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const studentModules = [
    {
      icon: BookOpen,
      title: 'Online Admission',
      description: 'View admission status',
      path: '/students',
      color: '#3B82F6'
    },
    {
      icon: GraduationCap,
      title: 'Course Library',
      description: 'Browse courses',
      path: '/courses',
      color: '#10B981'
    },
    {
      icon: FileText,
      title: 'Gradebook',
      description: 'View your grades',
      path: '/grades',
      color: '#F59E0B'
    },
    {
      icon: Medal,
      title: 'Achievements',
      description: 'Your certificates',
      path: '/achievements',
      color: '#EC4899'
    },
    {
      icon: Calendar,
      title: 'Exam Schedule',
      description: 'Upcoming exams',
      path: '/timetable',
      color: '#8B5CF6'
    }
  ];

  return (
    <div className="modern-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Welcome, {user?.name}</h1>
          <p>Student Portal</p>
        </div>
        <div className="header-right">
          <button className="notification-btn">
            <Bell size={20} />
          </button>
          <div className="profile-menu-container">
            <button 
              className="profile-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <User size={20} />
            </button>
            {showProfileMenu && (
              <div className="profile-dropdown">
                <button onClick={() => navigate('/profile-settings')}>
                  <Settings size={18} /> Settings
                </button>
                <button onClick={() => { logout(); navigate('/logout'); }}>
                  <LogOut size={18} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="modules-grid">
          {studentModules.map((module, index) => (
            <ModuleCard
              key={index}
              icon={module.icon}
              title={module.title}
              description={module.description}
              color={module.color}
              onClick={() => handleNavigation(module.path)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboardNew;
