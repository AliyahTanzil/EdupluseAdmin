import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, LoadingSpinner, ErrorAlert } from '../components/Shared';
import { ArrowLeft, Download, Plus, Filter, TrendingUp } from 'lucide-react';
import { attendanceAPI, studentsAPI } from '../services/api';

const ClassAttendance = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  // State Management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [statistics, setStatistics] = useState({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    attendanceRate: 0,
  });

  // Filters
  const [dateFrom, setDateFrom] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [students, setStudents] = useState([]);

  // Load class info and attendance records
  useEffect(() => {
    if (classId) {
      loadStudents();
      loadAttendanceRecords();
    }
  }, [classId]);

  // Reload attendance when filters change
  useEffect(() => {
    if (classId) {
      loadAttendanceRecords();
    }
  }, [dateFrom, dateTo, selectedStudent, classId]);

  const loadStudents = async () => {
    try {
      const response = await studentsAPI.getByClass(classId, { limit: 100, offset: 0 });
      if (response.success) {
        setStudents(response.data || []);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
    }
  };

  const loadAttendanceRecords = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await attendanceAPI.getByClass(classId, {
        limit: 1000,
        offset: 0,
      });

      if (response.success) {
        const records = response.data || [];
        
        // Filter records by date range
        const filtered = records.filter(r => {
          const recordDate = r.date;
          return recordDate >= dateFrom && recordDate <= dateTo;
        });

        // Filter by student if selected
        const studentFiltered = selectedStudent !== 'all' 
          ? filtered.filter(r => r.student_id === selectedStudent)
          : filtered;

        setAttendanceRecords(studentFiltered);
        calculateStatistics(studentFiltered, records);
      } else {
        setError(response.message || 'Failed to load attendance records');
        setAttendanceRecords([]);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while loading attendance records');
      setAttendanceRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (filteredRecords, allRecords) => {
    if (!students || students.length === 0) {
      setStatistics({
        totalStudents: 0,
        presentToday: 0,
        absentToday: 0,
        attendanceRate: 0,
      });
      return;
    }

    // Get today's records
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = filteredRecords.filter(r => r.date === today);

    const presentCount = todayRecords.filter(r => r.status === 'present' || r.morning_status === 'present' || r.afternoon_status === 'present').length;
    const absentCount = todayRecords.filter(r => r.status === 'absent' || (r.morning_status === 'absent' && r.afternoon_status === 'absent')).length;
    const totalPresent = filteredRecords.filter(r => r.status === 'present' || r.morning_status === 'present').length;
    const attendanceRate = filteredRecords.length > 0 ? Math.round((totalPresent / filteredRecords.length) * 100) : 0;

    setStatistics({
      totalStudents: students.length,
      presentToday: presentCount,
      absentToday: absentCount,
      attendanceRate,
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status) => {
    return status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase();
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  return (
    <div>
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {loading && attendanceRecords.length === 0 && <LoadingSpinner message="Loading attendance records..." />}

      {/* Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/attendance')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={20} />
          Back to Attendance
        </button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              {classId} - Attendance
            </h1>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              className="flex items-center gap-2"
              onClick={() => navigate('/mark-attendance')}
            >
              <Plus size={18} />
              Mark Attendance
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium">Total Students</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{statistics.totalStudents}</p>
            <p className="text-xs text-gray-500 mt-2">In class</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium">Present Today</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{statistics.presentToday}</p>
            <p className="text-xs text-gray-500 mt-2">Out of {statistics.totalStudents} students</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium">Absent Today</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{statistics.absentToday}</p>
            <p className="text-xs text-gray-500 mt-2">{statistics.totalStudents > 0 ? Math.round((statistics.absentToday / statistics.totalStudents) * 100) : 0}% of class</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Attendance Rate</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{statistics.attendanceRate}%</p>
              </div>
              <TrendingUp size={32} className="text-purple-600 opacity-20" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Overall average</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={18} className="text-gray-600" />
            <h3 className="font-semibold text-gray-800">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Student Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Students</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name} (Roll: {student.roll})
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <Button
                variant="secondary"
                onClick={() => {
                  const date = new Date();
                  date.setDate(date.getDate() - 30);
                  setDateFrom(date.toISOString().split('T')[0]);
                  setDateTo(new Date().toISOString().split('T')[0]);
                  setSelectedStudent('all');
                }}
                className="w-full"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Attendance Records Table */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Attendance Records</h2>

          {attendanceRecords.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No attendance records found for the selected filters.</p>
              <p className="text-gray-500 mt-2">Try adjusting your date range or student selection.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Morning</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Afternoon</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800 font-medium">{getStudentName(record.student_id)}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.morning_status || record.status)}`}>
                          {formatStatus(record.morning_status || record.status || 'unmarked')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.afternoon_status || record.status)}`}>
                          {formatStatus(record.afternoon_status || record.status || 'unmarked')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-600 text-sm">{record.remarks || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Summary */}
          {attendanceRecords.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{attendanceRecords.length}</span> records
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ClassAttendance;
