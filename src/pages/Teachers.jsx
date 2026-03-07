import React, { useState } from 'react';
import { Table, Button, Card } from '../components/Shared';
import { Plus } from 'lucide-react';

const Teachers = () => {
  const [teachers, setTeachers] = useState([
    { id: 1, name: 'Dr. Smith', subject: 'Mathematics', classes: '10-A, 10-B', status: 'Active' },
    { id: 2, name: 'Ms. Johnson', subject: 'English', classes: '9-A, 9-B', status: 'Active' },
    { id: 3, name: 'Mr. Brown', subject: 'Science', classes: '11-A', status: 'On Leave' },
  ]);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'subject', label: 'Subject' },
    { key: 'classes', label: 'Classes' },
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
      label: 'View',
      onClick: (row) => alert(`View ${row.name}`),
      className: 'bg-blue-600 text-white hover:bg-blue-700',
    },
    {
      label: 'Edit',
      onClick: (row) => alert(`Edit ${row.name}`),
      className: 'bg-green-600 text-white hover:bg-green-700',
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Teachers</h1>
        <Button variant="primary" className="flex items-center gap-2">
          <Plus size={18} />
          Add New Teacher
        </Button>
      </div>
      <Card>
        <Table data={teachers} columns={columns} actions={actions} />
      </Card>
    </div>
  );
};

export default Teachers;