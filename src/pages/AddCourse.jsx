import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Form } from '../components/Shared';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

const AddCourse = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([
    { id: 1, name: 'Mathematics', code: 'MATH101', teacher: 'Dr. Smith', students: 45, duration: '1 year', credits: 4 },
    { id: 2, name: 'English Literature', code: 'ENG201', teacher: 'Ms. Johnson', students: 38, duration: '1 year', credits: 3 },
    { id: 3, name: 'Physics', code: 'PHY301', teacher: 'Mr. Brown', students: 42, duration: '1 year', credits: 4 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: '',
    code: '',
    teacher: '',
    students: 0,
    duration: '1 year',
    credits: 3
  });

  const [stats] = useState({
    total: courses.length,
    active: courses.length,
    total_students: courses.reduce((sum, c) => sum + c.students, 0)
  });

  const teachers = ['Dr. Smith', 'Ms. Johnson', 'Mr. Brown', 'Dr. Wilson', 'Ms. Taylor', 'Mr. Anderson'];

  const handleAddCourse = () => {
    if (newCourse.name && newCourse.code && newCourse.teacher) {
      const course = {
        id: Math.max(...courses.map(c => c.id), 0) + 1,
        ...newCourse,
        students: 0
      };
      setCourses([...courses, course]);
      setNewCourse({ name: '', code: '', teacher: '', students: 0, duration: '1 year', credits: 3 });
      setIsModalOpen(false);
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleDeleteCourse = (id) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => navigate('/courses')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Course Management</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Total Courses</p>
            <p className="text-4xl font-bold text-blue-600">{stats.total}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Active Courses</p>
            <p className="text-4xl font-bold text-green-600">{stats.active}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Total Students Enrolled</p>
            <p className="text-4xl font-bold text-purple-600">{stats.total_students}</p>
          </div>
        </Card>
      </div>

      {/* Add Course Button */}
      <div className="mb-6">
        <Button 
          variant="primary" 
          className="flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          Add New Course
        </Button>
      </div>

      {/* Courses Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Name</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Code</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Teacher</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Students</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Duration</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Credits</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-6">{course.name}</td>
                  <td className="py-4 px-6">{course.code}</td>
                  <td className="py-4 px-6">{course.teacher}</td>
                  <td className="py-4 px-6">{course.students}</td>
                  <td className="py-4 px-6">{course.duration}</td>
                  <td className="py-4 px-6">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {course.credits}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      <Trash2 size={18} className="inline mr-2" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Course</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Name *</label>
                <input
                  type="text"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                  placeholder="e.g., Advanced Mathematics"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Code *</label>
                <input
                  type="text"
                  value={newCourse.code}
                  onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                  placeholder="e.g., MATH401"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teacher *</label>
                <select
                  value={newCourse.teacher}
                  onChange={(e) => setNewCourse({ ...newCourse, teacher: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Teacher</option>
                  {teachers.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                    placeholder="e.g., 1 year"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Credits</label>
                  <input
                    type="number"
                    value={newCourse.credits}
                    onChange={(e) => setNewCourse({ ...newCourse, credits: parseInt(e.target.value) })}
                    min="1"
                    max="10"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="success"
                className="flex-1"
                onClick={handleAddCourse}
              >
                Add Course
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCourse;
