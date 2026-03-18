import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Search, User, ChevronDown } from 'lucide-react';

/**
 * Navbar Component - Top navigation with branding, search, and profile
 */
export const Navbar = ({ onMenuToggle }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [notifications] = useState([ // notifications is used, but setNotifications is not
    { id: 1, message: '10 students absent today', time: '5 mins ago' },
    { id: 2, message: 'New assignment from Math', time: '1 hour ago' },
  ]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login', { replace: true });
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-md sticky top-0 z-40">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left - Menu Toggle & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-blue-600">
              E
            </div>
            <span className="text-lg font-bold">Edupluse Admin</span>
          </div>
        </div>

        {/* Center - Search */}
        <div className="hidden md:flex flex-1 mx-8 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 w-5 h-5 text-blue-200" />
            <input
              type="text"
              placeholder="Search students, teachers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-blue-500 bg-opacity-30 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-blue-100"
            />
          </div>
        </div>

        {/* Right - Notifications & Profile */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative group hidden sm:block">
            <button className="p-2 hover:bg-blue-700 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full"></span>
            </button>
            
            {/* Notification Dropdown */}
            <div className="absolute right-0 mt-2 w-80 bg-white text-gray-900 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm text-gray-900">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Profile */}
          <div className="relative group">
            <button className="flex items-center gap-2 p-2 hover:bg-blue-700 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <span className="hidden sm:inline text-sm font-medium">Admin</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Profile Dropdown */}
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-default">
                <p className="font-semibold">Admin</p>
                <p className="text-xs text-gray-500">admin@school.edu</p>
              </div>
              <button type="button" onClick={() => navigate('/profile-settings')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 border-b border-gray-100">
                Profile Settings
              </button>
              <button type="button" onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  onMenuToggle: PropTypes.func.isRequired,
};

export default Navbar;
