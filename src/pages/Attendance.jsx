import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WeeklyAttendanceGrid from '../components/Attendance/WeeklyAttendanceGrid';

const Attendance = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [currentWeek, setCurrentWeek] = useState('Jan 22 - Jan 26, 2024');

  const classes = ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Attendance Management</h1>
        <div className="flex space-x-4">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
          <button 
            onClick={() => navigate('/export-reports')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Export Report
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Weekly Attendance Grid - {selectedClass}</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Previous Week</button>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">{currentWeek}</span>
            <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Next Week</button>
          </div>
        </div>
        <WeeklyAttendanceGrid className={selectedClass} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Today's Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Students:</span>
              <span className="font-semibold">45</span>
            </div>
            <div className="flex justify-between">
              <span>Present:</span>
              <span className="font-semibold text-green-600">42</span>
            </div>
            <div className="flex justify-between">
              <span>Absent:</span>
              <span className="font-semibold text-red-600">3</span>
            </div>
            <div className="flex justify-between">
              <span>Attendance Rate:</span>
              <span className="font-semibold text-blue-600">93.3%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Biometric Devices</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Main Gate:</span>
              <span className="text-green-600">Online</span>
            </div>
            <div className="flex justify-between">
              <span>Exit Gate:</span>
              <span className="text-green-600">Online</span>
            </div>
            <div className="flex justify-between">
              <span>Classroom 1:</span>
              <span className="text-yellow-600">Offline</span>
            </div>
          </div>
          <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" onClick={() => navigate('/manage-devices')}>
            Manage Devices
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button 
              onClick={() => navigate('/mark-attendance')}
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Mark Morning Attendance
            </button>
            <button 
              onClick={() => navigate('/mark-attendance')}
              className="w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
            >
              Mark Afternoon Attendance
            </button>
            <button 
              onClick={() => alert('SMS notifications feature coming soon')}
              className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
            >
              Send SMS Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;