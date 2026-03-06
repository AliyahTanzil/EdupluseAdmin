import React, { useState } from 'react';
import Table from '../components/Table';
import Modal from '../components/Modal';

const Students = () => {
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
    { header: 'Roll No', accessor: 'roll' },
    { header: 'Name', accessor: 'name' },
    { header: 'Class', accessor: 'class' },
    { header: 'Today\'s Attendance', accessor: 'attendance' },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="space-x-2">
          <button
            onClick={() => handleViewAttendance(row)}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            View Attendance
          </button>
          <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
            Edit
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Students</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add New Student
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Table data={students} columns={columns} />
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedStudent && (
          <div>
            <h2 className="text-xl font-bold mb-4">Attendance for {selectedStudent.name}</h2>
            <div className="grid grid-cols-7 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <div key={day} className="text-center">
                  <div className="text-sm font-medium">{day}</div>
                  <div className={`w-8 h-8 mx-auto mt-1 rounded-full flex items-center justify-center text-white text-xs ${
                    index < 5 ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    {index < 5 ? '✓' : '-'}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Weekly Attendance: 5/5 days (100%)</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Students;