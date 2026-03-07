import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Modal, Button, Card } from '../components/Shared';
import { Plus } from 'lucide-react';

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([
    { id: 1, name: 'John Doe', roll: '001', class: '10-A', attendance: 'Present' },
    { id: 2, name: 'Jane Smith', roll: '002', class: '10-A', attendance: 'Absent' },
    { id: 3, name: 'Bob Johnson', roll: '003', class: '10-B', attendance: 'Present' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleViewAttendance = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const columns = [
    { key: 'roll', label: 'Roll No' },
    { key: 'name', label: 'Name' },
    { key: 'class', label: 'Class' },
    { key: 'attendance', label: 'Today\'s Attendance' },
  ];

  const actions = [
    {
      label: 'View',
      onClick: (row) => handleViewAttendance(row),
      className: 'bg-blue-600 text-white hover:bg-blue-700',
    },
    {
      label: 'Edit',
      onClick: (row) => navigate(`/edit-student/${row.id}`, { state: { student: row } }),
      className: 'bg-green-600 text-white hover:bg-green-700',
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Students</h1>
        <Button variant="primary" className="flex items-center gap-2" onClick={() => navigate('/add-student')}>
          <Plus size={18} />
          Add New Student
        </Button>
      </div>
      <Card>
        <Table data={students} columns={columns} actions={actions} />
      </Card>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Attendance" size="md">
        {selectedStudent && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Attendance for {selectedStudent.name}</h3>
            <div className="grid grid-cols-7 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <div key={day} className="text-center">
                  <div className="text-xs font-medium text-gray-600">{day}</div>
                  <div className={`w-8 h-8 mx-auto mt-1 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    index < 5 ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    {index < 5 ? '✓' : '-'}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">Weekly Attendance: <span className="font-semibold text-green-600">5/5 days (100%)</span></p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Students;