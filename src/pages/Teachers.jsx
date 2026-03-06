import React, { useState } from 'react';
import Table from '../components/Table';

const Teachers = () => {
  const [teachers, setTeachers] = useState([
    { id: 1, name: 'Dr. Smith', subject: 'Mathematics', classes: '10-A, 10-B', status: 'Active' },
    { id: 2, name: 'Ms. Johnson', subject: 'English', classes: '9-A, 9-B', status: 'Active' },
    { id: 3, name: 'Mr. Brown', subject: 'Science', classes: '11-A', status: 'On Leave' },
  ]);

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Subject', accessor: 'subject' },
    { header: 'Classes', accessor: 'classes' },
    { header: 'Status', accessor: 'status' },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="space-x-2">
          <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
            View Profile
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
        <h1 className="text-3xl font-bold text-gray-800">Teachers</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add New Teacher
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Table data={teachers} columns={columns} />
      </div>
    </div>
  );
};

export default Teachers;