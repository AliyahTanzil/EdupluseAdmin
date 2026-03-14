import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/students', label: 'Students', icon: '👨‍🎓' },
    { path: '/teachers', label: 'Teachers', icon: '👨‍🏫' },
    { path: '/courses', label: 'Courses', icon: '📚' },
    { path: '/timetable', label: 'Timetable', icon: '📅' },
  ];

  return (
    <div className="bg-blue-600 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Menu</h2>
      </div>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-700 text-white'
                  : 'hover:bg-blue-500'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;