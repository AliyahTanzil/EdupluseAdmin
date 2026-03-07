import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button } from '../components/Shared';
import { ArrowLeft, Download, Printer, ChevronLeft, ChevronRight } from 'lucide-react';
import WeeklyAttendanceGrid from '../components/Attendance/WeeklyAttendanceGrid';

const MarkAttendance = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  // Mock class data
  const classData = {
    '1': { name: '10-A', teacher: 'Dr. Smith', students: 35 },
    '2': { name: '10-B', teacher: 'Ms. Johnson', students: 32 },
    '3': { name: '9-A', teacher: 'Mr. Brown', students: 38 },
    '4': { name: '9-B', teacher: 'Dr. Wilson', students: 36 },
    '5': { name: '11-A', teacher: 'Ms. Taylor', students: 40 },
    '6': { name: '11-B', teacher: 'Mr. Anderson', students: 37 },
  };

  const currentClass = classData[classId] || { name: 'Class', teacher: 'Unknown', students: 0 };
  const [currentWeek, setCurrentWeek] = useState('Jan 22 - Jan 26, 2024');

  return (
    <div>
      {/* Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(`/class/${classId}/attendance`)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Attendance
        </button>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Mark Attendance - {currentClass.name}</h1>
          <p className="text-gray-600 mt-2">Class Teacher: <span className="font-semibold">{currentClass.teacher}</span></p>
          <p className="text-gray-600 mt-1">Total Students: <span className="font-semibold">{currentClass.students}</span></p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex items-center gap-2">
            <Download size={18} />
            Export
          </Button>
          <Button variant="secondary" className="flex items-center gap-2">
            <Printer size={18} />
            Print
          </Button>
        </div>
      </div>

      {/* Week Navigation */}
      <Card className="mb-6">
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Weekly Attendance Grid - {currentClass.name}</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setCurrentWeek('Jan 15 - Jan 19, 2024')}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">{currentWeek}</span>
            <button 
              onClick={() => setCurrentWeek('Jan 29 - Feb 02, 2024')}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </Card>

      {/* Attendance Grid */}
      <Card className="mb-6">
        <div className="p-6">
          <WeeklyAttendanceGrid className={currentClass.name} />
        </div>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Today's Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between pb-2 border-b">
                <span className="text-gray-600">Total Students:</span>
                <span className="font-semibold">{currentClass.students}</span>
              </div>
              <div className="flex justify-between pb-2 border-b">
                <span className="text-gray-600">Present:</span>
                <span className="font-semibold text-green-600">{currentClass.students - 2}</span>
              </div>
              <div className="flex justify-between pb-2 border-b">
                <span className="text-gray-600">Absent:</span>
                <span className="font-semibold text-red-600">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Attendance Rate:</span>
                <span className="font-semibold text-blue-600">94.3%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Biometric Devices</h3>
            <div className="space-y-3">
              <div className="flex justify-between pb-2 border-b">
                <span className="text-gray-600">Main Gate:</span>
                <span className="text-green-600 font-semibold">Online</span>
              </div>
              <div className="flex justify-between pb-2 border-b">
                <span className="text-gray-600">Exit Gate:</span>
                <span className="text-green-600 font-semibold">Online</span>
              </div>
              <div className="flex justify-between pb-2 border-b">
                <span className="text-gray-600">Classroom 1:</span>
                <span className="text-yellow-600 font-semibold">Offline</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Classroom 2:</span>
                <span className="text-green-600 font-semibold">Online</span>
              </div>
            </div>
            <Button variant="secondary" fullWidth className="mt-4">
              Manage Devices
            </Button>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="success" fullWidth>
                Mark Morning Attendance
              </Button>
              <Button variant="warning" fullWidth>
                Mark Afternoon Attendance
              </Button>
              <Button variant="secondary" fullWidth>
                Send SMS Notifications
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MarkAttendance;
