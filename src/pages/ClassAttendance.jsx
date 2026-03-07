import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Table } from '../components/Shared';
import { ArrowLeft, Download, Plus } from 'lucide-react';

const ClassAttendance = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  // Mock class data
  const classData = {
    '1': { name: '10-A', teacher: 'Dr. Smith' },
    '2': { name: '10-B', teacher: 'Ms. Johnson' },
    '3': { name: '9-A', teacher: 'Mr. Brown' },
    '4': { name: '9-B', teacher: 'Dr. Wilson' },
    '5': { name: '11-A', teacher: 'Ms. Taylor' },
    '6': { name: '11-B', teacher: 'Mr. Anderson' },
  };

  const currentClass = classData[classId] || { name: 'Class', teacher: 'Unknown' };

  // Mock attendance data
  const [attendanceRecords] = useState([
    { id: 1, studentName: 'John Doe', date: '2024-01-22', status: 'Present', percentage: 95 },
    { id: 2, studentName: 'Jane Smith', date: '2024-01-22', status: 'Present', percentage: 92 },
    { id: 3, studentName: 'Mike Johnson', date: '2024-01-22', status: 'Absent', percentage: 78 },
    { id: 4, studentName: 'Sarah Williams', date: '2024-01-22', status: 'Present', percentage: 98 },
    { id: 5, studentName: 'Tom Brown', date: '2024-01-22', status: 'Late', percentage: 85 },
    { id: 6, studentName: 'Emily Davis', date: '2024-01-22', status: 'Present', percentage: 100 },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present':
        return 'bg-green-100 text-green-800';
      case 'Absent':
        return 'bg-red-100 text-red-800';
      case 'Late':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/student-dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Classes
          </button>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">{currentClass.name} - Attendance</h1>
            <p className="text-gray-600 mt-2">Class Teacher: <span className="font-semibold">{currentClass.teacher}</span></p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex items-center gap-2">
              <Download size={18} />
              Export Report
            </Button>
            <Button variant="primary" className="flex items-center gap-2">
              <Plus size={18} />
              Mark Attendance
            </Button>
          </div>
        </div>
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium">Present Today</p>
            <p className="text-3xl font-bold text-green-600 mt-2">32</p>
            <p className="text-xs text-gray-500 mt-2">Out of 35 students</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium">Absent</p>
            <p className="text-3xl font-bold text-red-600 mt-2">2</p>
            <p className="text-xs text-gray-500 mt-2">5.7% of class</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium">Late</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">1</p>
            <p className="text-xs text-gray-500 mt-2">2.9% of class</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium">Attendance Rate</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">92%</p>
            <p className="text-xs text-gray-500 mt-2">Class average</p>
          </div>
        </Card>
      </div>

      {/* Attendance Records */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Student Attendance</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Student Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">{record.studentName}</td>
                    <td className="py-3 px-4 text-gray-600">{record.date}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-12 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${record.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{record.percentage}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ClassAttendance;
