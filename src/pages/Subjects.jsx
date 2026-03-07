import React, { useState } from 'react';
import { Table, Button, Card, Modal } from '../components/Shared';
import { Plus, BookOpen } from 'lucide-react';

const Subjects = () => {
  const [subjects, setSubjects] = useState([
    { 
      id: 1, 
      name: 'Mathematics', 
      code: 'MATH101',
      teacher: 'Dr. Smith',
      classes: '10-A, 10-B',
      credits: 4,
      status: 'Active'
    },
    { 
      id: 2, 
      name: 'English Literature', 
      code: 'ENG101',
      teacher: 'Ms. Johnson',
      classes: '9-A, 9-B, 10-A',
      credits: 3,
      status: 'Active'
    },
    { 
      id: 3, 
      name: 'Physics', 
      code: 'PHY201',
      teacher: 'Mr. Wilson',
      classes: '11-A, 11-B',
      credits: 4,
      status: 'Active'
    },
    { 
      id: 4, 
      name: 'Chemistry', 
      code: 'CHM201',
      teacher: 'Mr. Anderson',
      classes: '11-A, 11-B',
      credits: 4,
      status: 'Active'
    },
    { 
      id: 5, 
      name: 'Biology', 
      code: 'BIO201',
      teacher: 'Dr. Taylor',
      classes: '11-A, 11-B, 12-A',
      credits: 3,
      status: 'Active'
    },
    { 
      id: 6, 
      name: 'Social Studies', 
      code: 'SS101',
      teacher: 'Ms. Brown',
      classes: '9-A, 9-B, 10-A, 10-B',
      credits: 2,
      status: 'Active'
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    teacher: '',
    classes: '',
    credits: '',
  });

  const handleAddSubject = () => {
    setEditingSubject(null);
    setFormData({ name: '', code: '', teacher: '', classes: '', credits: '' });
    setIsModalOpen(true);
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      teacher: subject.teacher,
      classes: subject.classes,
      credits: subject.credits,
    });
    setIsModalOpen(true);
  };

  const handleSaveSubject = () => {
    if (editingSubject) {
      setSubjects(subjects.map(s => 
        s.id === editingSubject.id 
          ? { ...s, ...formData, status: 'Active' }
          : s
      ));
    } else {
      setSubjects([
        ...subjects,
        {
          id: Math.max(...subjects.map(s => s.id), 0) + 1,
          ...formData,
          credits: parseInt(formData.credits),
          status: 'Active'
        }
      ]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteSubject = (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const columns = [
    { key: 'code', label: 'Subject Code' },
    { key: 'name', label: 'Subject Name' },
    { key: 'teacher', label: 'Teacher' },
    { key: 'classes', label: 'Classes' },
    { key: 'credits', label: 'Credits' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
          {value}
        </span>
      )
    },
  ];

  const actions = [
    {
      label: 'Edit',
      onClick: (row) => handleEditSubject(row),
      className: 'bg-blue-600 text-white hover:bg-blue-700',
    },
    {
      label: 'Delete',
      onClick: (row) => handleDeleteSubject(row.id),
      className: 'bg-red-600 text-white hover:bg-red-700',
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <BookOpen size={32} className="text-blue-600" />
            Subjects Management
          </h1>
          <p className="text-gray-600 mt-2">Manage all subjects taught in your institution</p>
        </div>
        <Button 
          variant="primary" 
          className="flex items-center gap-2"
          onClick={handleAddSubject}
        >
          <Plus size={18} />
          Add New Subject
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium">Total Subjects</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">{subjects.length}</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium">Active Subjects</p>
            <p className="text-4xl font-bold text-green-600 mt-2">{subjects.filter(s => s.status === 'Active').length}</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium">Total Credits</p>
            <p className="text-4xl font-bold text-purple-600 mt-2">{subjects.reduce((sum, s) => sum + s.credits, 0)}</p>
          </div>
        </Card>
      </div>

      {/* Subjects Table */}
      <Card>
        <Table data={subjects} columns={columns} actions={actions} />
      </Card>

      {/* Add/Edit Subject Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubject ? 'Edit Subject' : 'Add New Subject'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g., MATH101"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Mathematics"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teacher</label>
              <input
                type="text"
                value={formData.teacher}
                onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                placeholder="e.g., Dr. Smith"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Credits</label>
              <input
                type="number"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                placeholder="e.g., 4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Classes (comma-separated)</label>
            <input
              type="text"
              value={formData.classes}
              onChange={(e) => setFormData({ ...formData, classes: e.target.value })}
              placeholder="e.g., 10-A, 10-B, 11-A"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button 
              variant="primary"
              className="flex-1"
              onClick={handleSaveSubject}
            >
              {editingSubject ? 'Update Subject' : 'Add Subject'}
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

export default Subjects;
