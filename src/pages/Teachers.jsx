import React, { useState } from 'react';
import { Table, Button, Card, Modal } from '../components/Shared';
import { Plus, CheckCircle, Calendar, TrendingUp, AlertCircle } from 'lucide-react';

const Teachers = () => {
  const [teachers, setTeachers] = useState([
    { 
      id: 1, 
      name: 'Dr. Smith', 
      subject: 'Mathematics', 
      classes: '10-A, 10-B', 
      status: 'Active',
      attendance: 94,
      performance: 92,
      lastPresent: '2026-03-06',
      attendanceRecord: [
        { date: '2026-03-06', status: 'Present' },
        { date: '2026-03-05', status: 'Present' },
        { date: '2026-03-04', status: 'Absent' },
        { date: '2026-03-03', status: 'Present' },
        { date: '2026-03-02', status: 'Present' },
      ]
    },
    { 
      id: 2, 
      name: 'Ms. Johnson', 
      subject: 'English', 
      classes: '9-A, 9-B', 
      status: 'Active',
      attendance: 98,
      performance: 95,
      lastPresent: '2026-03-06',
      attendanceRecord: [
        { date: '2026-03-06', status: 'Present' },
        { date: '2026-03-05', status: 'Present' },
        { date: '2026-03-04', status: 'Present' },
        { date: '2026-03-03', status: 'Present' },
        { date: '2026-03-02', status: 'Present' },
      ]
    },
    { 
      id: 3, 
      name: 'Mr. Brown', 
      subject: 'Science', 
      classes: '11-A', 
      status: 'On Leave',
      attendance: 85,
      performance: 88,
      lastPresent: '2026-02-28',
      attendanceRecord: [
        { date: '2026-03-06', status: 'Absent' },
        { date: '2026-03-05', status: 'Absent' },
        { date: '2026-03-04', status: 'Absent' },
        { date: '2026-02-28', status: 'Present' },
        { date: '2026-02-27', status: 'Present' },
      ]
    },
    { 
      id: 4, 
      name: 'Dr. Wilson', 
      subject: 'Physics', 
      classes: '11-A, 11-B', 
      status: 'Active',
      attendance: 91,
      performance: 89,
      lastPresent: '2026-03-06',
      attendanceRecord: [
        { date: '2026-03-06', status: 'Present' },
        { date: '2026-03-05', status: 'Absent' },
        { date: '2026-03-04', status: 'Present' },
        { date: '2026-03-03', status: 'Present' },
        { date: '2026-03-02', status: 'Present' },
      ]
    },
  ]);

  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceStatus, setAttendanceStatus] = useState('Present');

  const handleViewAttendance = (teacher) => {
    setSelectedTeacher(teacher);
    setIsAttendanceModalOpen(true);
  };

  const handleMarkAttendance = () => {
    if (selectedTeacher) {
      setTeachers(teachers.map(t => {
        if (t.id === selectedTeacher.id) {
          const newAttendanceRecord = [
            { date: attendanceDate, status: attendanceStatus },
            ...t.attendanceRecord.filter(r => r.date !== attendanceDate)
          ];
          const presentCount = newAttendanceRecord.filter(r => r.status === 'Present').length;
          const newAttendance = Math.round((presentCount / newAttendanceRecord.length) * 100);
          
          return {
            ...t,
            attendance: newAttendance,
            attendanceRecord: newAttendanceRecord,
            lastPresent: attendanceStatus === 'Present' ? attendanceDate : t.lastPresent,
          };
        }
        return t;
      }));
      setSelectedTeacher(null);
      setIsAttendanceModalOpen(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'subject', label: 'Subject' },
    { key: 'classes', label: 'Classes' },
    { 
      key: 'attendance', 
      label: 'Attendance %',
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${value >= 90 ? 'bg-green-500' : value >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="font-semibold text-gray-800">{value}%</span>
        </div>
      )
    },
    { 
      key: 'performance', 
      label: 'Performance',
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          value >= 90 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {value}%
        </span>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          value === 'Active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      )
    },
  ];

  const actions = [
    {
      label: 'Attendance',
      onClick: (row) => handleViewAttendance(row),
      className: 'bg-blue-600 text-white hover:bg-blue-700',
    },
    {
      label: 'Edit',
      onClick: (row) => alert(`Edit ${row.name}`),
      className: 'bg-green-600 text-white hover:bg-green-700',
    },
  ];

  // Summary Stats
  const avgAttendance = Math.round(teachers.reduce((sum, t) => sum + t.attendance, 0) / teachers.length);
  const avgPerformance = Math.round(teachers.reduce((sum, t) => sum + t.performance, 0) / teachers.length);
  const activeTeachers = teachers.filter(t => t.status === 'Active').length;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Teachers Management</h1>
          <p className="text-gray-600 mt-2">Track teacher attendance and performance</p>
        </div>
        <Button variant="primary" className="flex items-center gap-2">
          <Plus size={18} />
          Add New Teacher
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Teachers</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{teachers.length}</p>
              </div>
              <CheckCircle className="text-blue-400" size={32} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Teachers</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{activeTeachers}</p>
              </div>
              <CheckCircle className="text-green-400" size={32} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg Attendance</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{avgAttendance}%</p>
              </div>
              <Calendar className="text-purple-400" size={32} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg Performance</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{avgPerformance}%</p>
              </div>
              <TrendingUp className="text-orange-400" size={32} />
            </div>
          </div>
        </Card>
      </div>

      {/* Teachers Table */}
      <Card>
        <Table data={teachers} columns={columns} actions={actions} />
      </Card>

      {/* Attendance Modal */}
      <Modal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        title={selectedTeacher ? `Mark Attendance - ${selectedTeacher.name}` : 'Mark Attendance'}
      >
        {selectedTeacher && (
          <div className="space-y-6">
            {/* Teacher Info */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600">Subject: {selectedTeacher.subject}</p>
              <p className="text-sm text-gray-600">Classes: {selectedTeacher.classes}</p>
              <p className="text-sm text-gray-600 mt-2">Current Attendance: <span className="font-bold text-blue-600">{selectedTeacher.attendance}%</span></p>
            </div>

            {/* Attendance Records */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Recent Attendance Records</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedTeacher.attendanceRecord.map((record, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-600">{record.date}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      record.status === 'Present' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {record.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mark Attendance Form */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-800 mb-3">Mark Attendance</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={attendanceStatus}
                    onChange={(e) => setAttendanceStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                    <option value="Leave">Leave</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button 
                variant="primary"
                className="flex-1"
                onClick={handleMarkAttendance}
              >
                Save Attendance
              </Button>
              <Button 
                variant="secondary"
                className="flex-1"
                onClick={() => setIsAttendanceModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Teachers;