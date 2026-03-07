import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  BookOpen,
  Clock,
  LogOut,
  ChevronRight,
  CheckSquare,
  FileCheck,
} from 'lucide-react';

/**
 * Sidebar Component - Navigation menu for all modules
 */
export const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/',
    },
    {
      label: 'Students',
      icon: Users,
      path: '/students',
    },
    {
      label: 'Teachers',
      icon: UserCheck,
      path: '/teachers',
    },
    {
      label: 'Courses',
      icon: BookOpen,
      path: '/courses',
    },
    {
      label: 'Timetable',
      icon: Clock,
      path: '/timetable',
    },
    {
      label: 'Attendance',
      icon: FileCheck,
      path: '/attendance',
    },
  ];

  const isActive = (path) => location.pathname === path;

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

export default Sidebar;
