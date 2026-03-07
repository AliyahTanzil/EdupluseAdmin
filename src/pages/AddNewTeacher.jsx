import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Modal } from '../components/Shared';
import { ArrowLeft, Plus, Edit2, Trash2 } from 'lucide-react';

const AddNewTeacher = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([
    { id: 1, name: 'Dr. Smith', subject: 'Mathematics', email: 'smith@school.com', phone: '98765432', experience: '10' },
    { id: 2, name: 'Ms. Brown', subject: 'English', email: 'brown@school.com', phone: '98765433', experience: '8' },
    { id: 3, name: 'Mr. Johnson', subject: 'Science', email: 'johnson@school.com', phone: '98765434', experience: '12' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    subject: '',
    email: '',
    phone: '',
    experience: '',
  });

  const subjects = ['Mathematics', 'English', 'Science', 'History', 'Geography', 'PE', 'Art', 'Music', 'Computer Science'];

  const handleAddTeacher = () => {
    if (newTeacher.name && newTeacher.subject) {
      setTeachers([
        ...teachers,
        {
          id: teachers.length + 1,
          ...newTeacher,
        },
      ]);
      setNewTeacher({ name: '', subject: '', email: '', phone: '', experience: '' });
      setIsModalOpen(false);
      alert('Teacher added successfully!');
    }
  };

  const handleDeleteTeacher = (id) => {
    setTeachers(teachers.filter(t => t.id !== id));
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/teachers')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={20} />
          Back to Teachers
        </button>
      </div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Manage Teachers</h1>
          <p className="text-gray-600 mt-2">Add, edit, and manage teacher records</p>
        </div>
        <Button
          variant="primary"
          className="flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          Add New Teacher
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium">Total Teachers</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{teachers.length}</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium">Subjects</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{new Set(teachers.map(t => t.subject)).size}</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium">Avg Experience</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {(teachers.reduce((sum, t) => sum + parseInt(t.experience || 0), 0) / teachers.length).toFixed(1)} yrs
            </p>
          </div>
        </Card>
      </div>

      {/* Teachers Table */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Teacher List</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Subject</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Experience</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800 font-medium">{teacher.name}</td>
                    <td className="py-3 px-4 text-gray-600">{teacher.subject}</td>
                    <td className="py-3 px-4 text-gray-600">{teacher.email}</td>
                    <td className="py-3 px-4 text-gray-600">{teacher.phone}</td>
                    <td className="py-3 px-4 text-gray-600">{teacher.experience} years</td>
                    <td className="py-3 px-4 text-center space-x-2">
                      <button onClick={() => alert(`Edit ${teacher.name}`)} className="text-blue-600 hover:text-blue-800 inline-block">
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteTeacher(teacher.id)}
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

      {/* Add Teacher Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Teacher"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Teacher Name</label>
            <input
              type="text"
              value={newTeacher.name}
              onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
              placeholder="e.g., Dr. Smith"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <select
              value={newTeacher.subject}
              onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Subject</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={newTeacher.email}
              onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
              placeholder="e.g., smith@school.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={newTeacher.phone}
              onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
              placeholder="e.g., 9876543210"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
            <input
              type="number"
              value={newTeacher.experience}
              onChange={(e) => setNewTeacher({ ...newTeacher, experience: e.target.value })}
              placeholder="e.g., 10"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleAddTeacher}
            >
              Add Teacher
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

export default AddNewTeacher;
