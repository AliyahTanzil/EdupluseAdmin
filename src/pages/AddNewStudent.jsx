import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Modal } from '../components/Shared';
import { ArrowLeft, Plus, Edit2, Trash2, Mail } from 'lucide-react';

const AddNewStudent = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([
    { id: 1, name: 'John Doe', roll: '001', class: '10-A', email: 'john@school.com', phone: '98765432' },
    { id: 2, name: 'Jane Smith', roll: '002', class: '10-A', email: 'jane@school.com', phone: '98765433' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    roll: '',
    class: '',
    email: '',
    phone: '',
  });

  const classes = ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'];

  const handleAddStudent = () => {
    if (newStudent.name && newStudent.roll && newStudent.class) {
      setStudents([
        ...students,
        {
          id: students.length + 1,
          ...newStudent,
        },
      ]);
      setNewStudent({ name: '', roll: '', class: '', email: '', phone: '' });
      setIsModalOpen(false);
      alert('Student added successfully!');
    }
  };

  const handleDeleteStudent = (id) => {
    setStudents(students.filter(s => s.id !== id));
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/students')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={20} />
          Back to Students
        </button>
      </div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Manage Students</h1>
          <p className="text-gray-600 mt-2">Add, edit, and manage student records</p>
        </div>
        <Button
          variant="primary"
          className="flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          Add New Student
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium">Total Students</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{students.length}</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium">Active Students</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{students.length}</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium">Classes</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">{new Set(students.map(s => s.class)).size}</p>
          </div>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Student List</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Roll No</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Class</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800 font-medium">{student.roll}</td>
                    <td className="py-3 px-4 text-gray-800">{student.name}</td>
                    <td className="py-3 px-4 text-gray-600">{student.class}</td>
                    <td className="py-3 px-4 text-gray-600">{student.email}</td>
                    <td className="py-3 px-4 text-gray-600">{student.phone}</td>
                    <td className="py-3 px-4 text-center space-x-2">
                      <button onClick={() => alert(`Edit ${student.name}`)} className="text-blue-600 hover:text-blue-800 inline-block">
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="text-red-600 hover:text-red-800 inline-block"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Add Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Student"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Student Name</label>
            <input
              type="text"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              placeholder="e.g., John Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number</label>
            <input
              type="text"
              value={newStudent.roll}
              onChange={(e) => setNewStudent({ ...newStudent, roll: e.target.value })}
              placeholder="e.g., 001"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
            <select
              value={newStudent.class}
              onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={newStudent.email}
              onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
              placeholder="e.g., john@school.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={newStudent.phone}
              onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
              placeholder="e.g., 9876543210"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleAddStudent}
            >
              Add Student
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddNewStudent;
