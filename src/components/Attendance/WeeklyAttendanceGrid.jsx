import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Download, Printer } from 'lucide-react';
import { Button } from '../Shared';
import AttendanceCell from './AttendanceCell';
import WeekSummary from './WeekSummary';

/**
 * WeeklyAttendanceGrid Component
 * Displays attendance records in a beautiful grid format
 * Features: Weekly and Monthly views, Entry/Exit marking, real-time updates
 */
const WeeklyAttendanceGrid = ({ className = '10-A', viewMode = 'week', currentMonth = new Date() }) => {
  // All days including weekends
  const allDaysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const sessions = ['Morning', 'Afternoon'];

  // Sample student data
  const [students] = useState([
    { id: 1, name: 'John Doe', photo: '👨', roll: '001' },
    { id: 2, name: 'Jane Smith', photo: '👩', roll: '002' },
    { id: 3, name: 'Bob Johnson', photo: '👨', roll: '003' },
    { id: 4, name: 'Alice Brown', photo: '👩', roll: '004' },
    { id: 5, name: 'Charlie Davis', photo: '👨', roll: '005' },
  ]);

  // Create all possible day keys for attendance data (including month days)
  const getAllPossibleDays = () => {
    const allDays = [...allDaysOfWeek];
    // Add all possible month days (1-31)
    for (let i = 1; i <= 31; i++) {
      const weekday = new Date(2024, 0, i).toLocaleDateString('en-US', { weekday: 'short' });
      allDays.push(`${weekday} ${i}`);
    }
    return allDays;
  };

  // Sample attendance data
  const [attendance, setAttendance] = useState(() => {
    const data = {};
    const allPossibleDays = getAllPossibleDays();
    students.forEach(student => {
      allPossibleDays.forEach(day => {
        sessions.forEach(session => {
          data[`${student.id}-${day}-${session}`] = {
            status: Math.random() > 0.1 ? 'present' : 'absent',
            hasGateScan: Math.random() > 0.3,
          };
        });
      });
    });
    return data;
  });

  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [unsavedChanges, setUnsavedChanges] = useState(0);

  // Get days to display based on view mode - properly memoized
  const daysToDisplay = useMemo(() => {
    if (viewMode === 'week') {
      return allDaysOfWeek;
    } else {
      // Monthly view - get all days of the month
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      const days = [];
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
        days.push(dayName);
      }
      return days;
    }
  }, [viewMode, currentMonth, allDaysOfWeek]);

  const getWeekDateRange = (date) => {
    const curr = new Date(date);
    const first = curr.getDate() - curr.getDay() + 1;
    const last = first + 6;
    const firstDay = new Date(curr.setDate(first));
    const lastDay = new Date(curr.setDate(last));
    return {
      start: firstDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      end: lastDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  };

  const weekRange = getWeekDateRange(currentWeek);

  const handleCellChange = (studentId, day, session, newStatus) => {
    const key = `${studentId}-${day}-${session}`;
    setAttendance(prev => {
      // Ensure the key exists before updating
      if (!prev[key]) {
        prev[key] = { status: 'present', hasGateScan: false };
      }
      return {
        ...prev,
        [key]: { ...prev[key], status: newStatus }
      };
    });
    setUnsavedChanges(prev => prev + 1);
  };

  const handleSave = () => {
    alert('Attendance saved successfully!');
    setUnsavedChanges(0);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm text-gray-600">Class: {className}</p>
            <p className="text-sm text-gray-600">Students: {students.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentWeek(new Date(currentWeek.getTime() - 7 * 24 * 60 * 60 * 1000))}
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
            {viewMode === 'week' ? `${weekRange.start} - ${weekRange.end}` : currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentWeek(new Date(currentWeek.getTime() + 7 * 24 * 60 * 60 * 1000))}
          >
            <ChevronRight size={16} />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" size="sm" className="flex items-center gap-1">
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button variant="secondary" size="sm" className="flex items-center gap-1">
            <Printer size={16} />
            <span className="hidden sm:inline">Print</span>
          </Button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="w-full text-sm">
          {/* Header */}
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              {/* Student Column Header */}
              <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left font-semibold text-gray-900 border-r border-gray-200 min-w-48">
                Student
              </th>

              {/* Day Headers */}
              {daysToDisplay.map(day => (
                <th
                  key={day}
                  colSpan={2}
                  className="px-4 py-3 text-center font-semibold text-gray-900 border-r border-gray-200 bg-gradient-to-b from-blue-50 to-white"
                >
                  <div>{day}</div>
                  <div className="text-xs text-gray-500 font-normal mt-1 flex justify-center gap-2">
                    <span>☀️</span>
                    <span>🌙</span>
                  </div>
                </th>
              ))}

              {/* Summary Column */}
              <th className="sticky right-0 z-10 bg-gray-50 px-4 py-3 text-center font-semibold text-gray-900 border-l border-gray-200 min-w-24">
                {viewMode === 'week' ? 'Week %' : 'Month %'}
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {students.map((student, idx) => (
              <tr
                key={student.id}
                className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                {/* Student Info */}
                <td className="sticky left-0 z-10 px-4 py-3 font-medium text-gray-900 border-r border-gray-200 bg-inherit">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                      {student.photo}
                    </div>
                    <div>
                      <p className="font-semibold">{student.name}</p>
                      <p className="text-xs text-gray-500">Roll: {student.roll}</p>
                    </div>
                  </div>
                </td>

                {/* Attendance Cells */}
                {daysToDisplay.map(day =>
                  sessions.map(session => {
                    const key = `${student.id}-${day}-${session}`;
                    const data = attendance[key] || { status: 'present', hasGateScan: false };
                    return (
                      <td
                        key={key}
                        className="px-2 py-3 text-center border-r border-gray-100"
                      >
                        <AttendanceCell
                          status={data.status}
                          session={session}
                          hasGateScan={data.hasGateScan}
                          onChange={(newStatus) => handleCellChange(student.id, day, session, newStatus)}
                        />
                      </td>
                    );
                  })
                )}

                {/* Week/Month Summary */}
                <td className="sticky right-0 z-10 px-4 py-3 text-center border-l border-gray-200 bg-inherit">
                  <WeekSummary
                    attendance={attendance}
                    studentId={student.id}
                    daysOfWeek={daysToDisplay}
                    sessions={sessions}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Stats and Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-xs text-gray-600">Total Students</p>
          <p className="text-2xl font-bold text-gray-900">{students.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-xs text-gray-600">Present Today</p>
          <p className="text-2xl font-bold text-green-600">42</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-xs text-gray-600">Absent Today</p>
          <p className="text-2xl font-bold text-red-600">3</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-xs text-gray-600">Unsaved Changes</p>
          <p className={`text-2xl font-bold ${
            unsavedChanges > 0 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {unsavedChanges}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="secondary">Reset Changes</Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={unsavedChanges === 0}
        >
          Save Attendance
        </Button>
      </div>
    </div>
  );
};

export default WeeklyAttendanceGrid;
