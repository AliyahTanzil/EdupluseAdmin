import React, { useState } from 'react';
import Table from '../components/Table';

const Courses = () => {
  const [courses, setCourses] = useState([
    { id: 1, name: 'Mathematics', code: 'MATH101', teacher: 'Dr. Smith', students: 45, duration: '1 year' },
    { id: 2, name: 'English Literature', code: 'ENG201', teacher: 'Ms. Johnson', students: 38, duration: '1 year' },
    { id: 3, name: 'Physics', code: 'PHY301', teacher: 'Mr. Brown', students: 42, duration: '1 year' },
  ]);

  const columns = [
    { header: 'Course Name', accessor: 'name' },
    { header: 'Code', accessor: 'code' },
    { header: 'Teacher', accessor: 'teacher' },
    { header: 'Enrolled Students', accessor: 'students' },
    { header: 'Duration', accessor: 'duration' },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="space-x-2">
          <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
            View Details
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
        <h1 className="text-3xl font-bold text-gray-800">Courses</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add New Course
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Table data={courses} columns={columns} />
      </div>
    </div>
  );
};

export default Courses;