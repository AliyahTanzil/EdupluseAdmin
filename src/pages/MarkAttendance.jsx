import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button } from '../components/Shared';
import { ArrowLeft, Download, Printer, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'month'
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handlePrevious = () => {
    if (viewMode === 'week') {
      // Previous week logic
      setCurrentWeek('Jan 15 - Jan 19, 2024');
    } else {
      // Previous month
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'week') {
      // Next week logic
      setCurrentWeek('Jan 29 - Feb 02, 2024');
    } else {
      // Next month
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    }
  };

  const getMonthName = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

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
          <Button variant="secondary" className="flex items-center gap-2" onClick={() => alert('Exporting attendance data...')}>
            <Download size={18} />
            Export
          </Button>
          <Button variant="secondary" className="flex items-center gap-2" onClick={() => alert('Opening print dialog...')}>
            <Printer size={18} />
            Print
          </Button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <Card className="mb-6">
        <div className="p-4 flex justify-between items-center flex-wrap gap-4">
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'week' ? 'primary' : 'secondary'}
              className="flex items-center gap-2"
              onClick={() => setViewMode('week')}
            >
              <Calendar size={18} />
              Weekly View
            </Button>
            <Button 
              variant={viewMode === 'month' ? 'primary' : 'secondary'}
              className="flex items-center gap-2"
              onClick={() => setViewMode('month')}
            >
              <Calendar size={18} />
              Monthly View
            </Button>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={handlePrevious}
              className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded font-semibold min-w-max">
              {viewMode === 'week' ? currentWeek : getMonthName(currentMonth)}
            </span>
            <button 
              onClick={handleNext}
              className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </Card>

      {/* Attendance Grid */}
      <Card className="mb-6">
        <div className="p-6">
          <WeeklyAttendanceGrid 
            className={currentClass.name}
            viewMode={viewMode}
            currentMonth={currentMonth}
          />
        </div>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">{viewMode === 'week' ? "Today's" : "Month's"} Summary</h3>
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
            <Button variant="secondary" fullWidth className="mt-4" onClick={() => navigate('/manage-devices')}>
              Manage Devices
            </Button>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="success" fullWidth onClick={() => alert('Morning attendance marked successfully!')}>
                Mark Morning Attendance
              </Button>
              <Button variant="warning" fullWidth onClick={() => alert('Afternoon attendance marked successfully!')}>
                Mark Afternoon Attendance
              </Button>
              <Button variant="secondary" fullWidth onClick={() => alert('SMS notifications sent to all guardians!')}>
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
