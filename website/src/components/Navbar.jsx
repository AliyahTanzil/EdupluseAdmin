import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-blue-600">Edupluse Admin</h1>
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="p-2 text-gray-600 hover:text-blue-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 3a6 6 0 100 12h6" />
          </svg>
        </button>
        <button className="p-2 text-gray-600 hover:text-blue-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 3a6 6 0 100 12h6" />
          </svg>
        </button>
        <div className="flex items-center space-x-2">
          <img src="https://via.placeholder.com/32" alt="Profile" className="w-8 h-8 rounded-full" />
          <span className="text-gray-700">Admin</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;