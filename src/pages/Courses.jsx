import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Card } from '../components/Shared';
import { Plus } from 'lucide-react';

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([
    { id: 1, name: 'Mathematics', code: 'MATH101', teacher: 'Dr. Smith', students: 45, duration: '1 year' },
    { id: 2, name: 'English Literature', code: 'ENG201', teacher: 'Ms. Johnson', students: 38, duration: '1 year' },
    { id: 3, name: 'Physics', code: 'PHY301', teacher: 'Mr. Brown', students: 42, duration: '1 year' },
  ]);

  const columns = [
    { key: 'name', label: 'Course Name' },
    { key: 'code', label: 'Code' },
    { key: 'teacher', label: 'Teacher' },
    { key: 'students', label: 'Enrolled Students' },
    { key: 'duration', label: 'Duration' },
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
        <h1 className="text-3xl font-bold text-gray-800">Courses</h1>
        <Button 
          variant="primary" 
          className="flex items-center gap-2"
          onClick={() => navigate('/add-course')}
        >
          <Plus size={18} />
          Add New Course
        </Button>
      </div>
      <Card>
        <Table data={courses} columns={columns} actions={actions} />
      </Card>
    </div>
  );
};

export default Courses;