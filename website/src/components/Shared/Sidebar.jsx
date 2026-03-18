import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  BookOpen,
  Clock,
  LogOut,
  ChevronRight,
  FileCheck,
  BarChart3,
  Building2,
} from 'lucide-react';

/**
 * Sidebar Component - Navigation menu for all modules
 * Shows role-specific navigation based on user type
 */
export const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // Get menu items based on user role and teacher type
  const getMenuItems = () => {
    if (!user) return [];

    if (user.role === 'admin') {
      return [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/admin-dashboard' },
        { label: 'Students', icon: Users, path: '/students' },
        { label: 'Teachers', icon: UserCheck, path: '/teachers' },
        { label: 'Subjects', icon: BookOpen, path: '/subjects' },
        { label: 'Timetable', icon: Clock, path: '/timetable' },
        { label: 'Attendance', icon: FileCheck, path: '/attendance' },
        { label: 'Reports', icon: BarChart3, path: '/reports' },
        { label: 'Settings', icon: LayoutDashboard, path: '/settings' },
      ];
    }

    if (user.role === 'teacher') {
      const teacherType = user.teacherType || 'regular';

      // Common items for all teachers
      const commonItems = [
        { label: 'My Profile', icon: UserCheck, path: '/profile-settings' },
        { label: 'Mark Attendance', icon: FileCheck, path: '/mark-attendance' },
      ];

      // Role-specific items
      switch (teacherType) {
        case 'class_teacher':
          return [
            { label: 'Class Dashboard', icon: LayoutDashboard, path: '/teacher-dashboard' },
            { label: 'Class Attendance', icon: FileCheck, path: '/class-attendance' },
            { label: 'Class Timetable', icon: Clock, path: '/class-timetable' },
            { label: 'Class Subjects', icon: BookOpen, path: '/class-subjects' },
            { label: 'Students', icon: Users, path: '/students' },
            { label: 'Class Reports', icon: BarChart3, path: '/generate-report' },
            ...commonItems,
          ];

        case 'subject_head':
          return [
            { label: 'Subject Dashboard', icon: LayoutDashboard, path: '/teacher-dashboard' },
            { label: 'Subject Performance', icon: BarChart3, path: '/subject-performance' },
            { label: 'Teachers', icon: UserCheck, path: '/teacher-coordination' },
            { label: 'Curriculum', icon: BookOpen, path: '/curriculum-management' },
            { label: 'Verify Marks', icon: FileCheck, path: '/mark-verification' },
            ...commonItems,
          ];

        case 'departmental_head':
          return [
            { label: 'Department Dashboard', icon: LayoutDashboard, path: '/teacher-dashboard' },
            { label: 'Department Overview', icon: Building2, path: '/department-overview' },
            { label: 'Staff', icon: Users, path: '/staff-management' },
            { label: 'Performance', icon: BarChart3, path: '/performance-analytics' },
            { label: 'Budget', icon: Clock, path: '/budget-allocation' },
            { label: 'Reports', icon: FileCheck, path: '/department-reports' },
            ...commonItems,
          ];

        default: // regular teacher
          return [
            { label: 'Dashboard', icon: LayoutDashboard, path: '/teacher-dashboard' },
            { label: 'My Subjects', icon: BookOpen, path: '/subjects' },
            { label: 'My Classes', icon: Users, path: '/my-classes' },
            { label: 'View Timetable', icon: Clock, path: '/timetable' },
            ...commonItems,
          ];
      }
    }

    if (user.role === 'student') {
      return [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/student-dashboard' },
        { label: 'My Marks', icon: BarChart3, path: '/student-marks' },
        { label: 'Attendance', icon: FileCheck, path: '/student-attendance' },
        { label: 'My Timetable', icon: Clock, path: '/student-timetable' },
        { label: 'Profile', icon: UserCheck, path: '/profile-settings' },
      ];
    }

    if (user.role === 'parent') {
      return [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/parent-dashboard' },
        { label: 'Child Marks', icon: BarChart3, path: '/child-marks' },
        { label: 'Attendance', icon: FileCheck, path: '/child-attendance' },
        { label: 'Reports', icon: FileCheck, path: '/child-reports' },
        { label: 'Profile', icon: UserCheck, path: '/profile-settings' },
      ];
    }

    return [];
  };

  const menuItems = getMenuItems();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      onClose(); // Close sidebar on mobile
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login', { replace: true });
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 overflow-y-auto z-40
          lg:relative lg:translate-x-0 lg:z-0
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo Area */}
        <div className="p-6 border-b border-gray-200 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
              E
            </div>
            <span className="font-bold text-gray-900">Edupluse</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Main Menu
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${
                    active
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium flex-1">{item.label}</span>
                {active && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>

        {/* Settings Section */}
        <div className="p-4 border-t border-gray-200 mt-auto space-y-2">
          <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Other
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg
            hover:bg-red-50 text-red-600 hover:text-red-700
            transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Sidebar;
