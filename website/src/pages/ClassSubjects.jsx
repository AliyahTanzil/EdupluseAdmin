import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button } from '../components/Shared';
import { ArrowLeft, Plus, BookOpen, Trash2, Edit2 } from 'lucide-react';

const ClassSubjects = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  // Mock class data
  const classData = {
    '1': { name: '10-A', teacher: 'Dr. Smith' },
    '2': { name: '10-B', teacher: 'Ms. Johnson' },
    '3': { name: '9-A', teacher: 'Mr. Brown' },
    '4': { name: '9-B', teacher: 'Dr. Wilson' },
    '5': { name: '11-A', teacher: 'Ms. Taylor' },
    '6': { name: '11-B', teacher: 'Mr. Anderson' },
  };

  const currentClass = classData[classId] || { name: 'Class', teacher: 'Unknown' };

  const [subjects, setSubjects] = useState([
    {
      id: 1,
      name: 'Mathematics',
      code: 'MAT101',
      teacher: 'Dr. Smith',
      credits: 4,
      students: 35,
      description: 'Advanced mathematical concepts and problem solving',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      name: 'English',
      code: 'ENG101',
      teacher: 'Ms. Brown',
      credits: 3,
      students: 35,
      description: 'Literature, writing, and communication skills',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 3,
      name: 'Science',
      code: 'SCI101',
      teacher: 'Mr. Johnson',
      credits: 4,
      students: 35,
      description: 'Physics, Chemistry, and Biology integrated',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 4,
      name: 'History',
      code: 'HIS101',
      teacher: 'Mrs. Lee',
      credits: 3,
      students: 35,
      description: 'World history and cultural heritage',
      color: 'from-amber-500 to-amber-600'
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: '',
    code: '',
    teacher: '',
    credits: '',
    description: ''
  });

  const handleAddSubject = () => {
    if (newSubject.name && newSubject.code && newSubject.teacher) {
      const colors = [
        'from-blue-500 to-blue-600',
        'from-purple-500 to-purple-600',
        'from-green-500 to-green-600',
        'from-amber-500 to-amber-600',
        'from-red-500 to-red-600',
        'from-indigo-500 to-indigo-600'
      ];
      setSubjects([
        ...subjects,
        {
          id: subjects.length + 1,
          name: newSubject.name,
          code: newSubject.code,
          teacher: newSubject.teacher,
          credits: parseInt(newSubject.credits) || 3,
          students: 35,
          description: newSubject.description,
          color: colors[subjects.length % colors.length]
        }
      ]);
      setNewSubject({ name: '', code: '', teacher: '', credits: '', description: '' });
      setIsModalOpen(false);
    }
  };

  const handleDeleteSubject = (id) => {
    setSubjects(subjects.filter(sub => sub.id !== id));
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/student-dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Classes
          </button>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">{currentClass.name} - Subjects</h1>
            <p className="text-gray-600 mt-2">Class Teacher: <span className="font-semibold">{currentClass.teacher}</span></p>
          </div>
          <Button 
            variant="primary" 
            className="flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} />
            Add Subject
          </Button>
        </div>
      </div>

      {/* Subjects Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Subjects</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{subjects.length}</p>
              </div>
              <div className="bg-blue-200 p-3 rounded-lg">
                <BookOpen className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Credits</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{subjects.reduce((sum, sub) => sum + sub.credits, 0)}</p>
              </div>
              <div className="bg-green-200 p-3 rounded-lg">
                <BookOpen className="text-green-600" size={24} />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg Credits</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {Math.round(subjects.reduce((sum, sub) => sum + sub.credits, 0) / subjects.length)}
                </p>
              </div>
              <div className="bg-purple-200 p-3 rounded-lg">
                <BookOpen className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((subject) => (
          <Card key={subject.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className={`h-24 bg-gradient-to-r ${subject.color} p-4 text-white flex flex-col justify-between`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold">{subject.name}</h3>
                  <p className="text-sm opacity-90">Code: {subject.code}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Teacher:</span>
                  <span className="font-semibold text-gray-800">{subject.teacher}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Credits:</span>
                  <span className="font-semibold text-gray-800">{subject.credits}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Students:</span>
                  <span className="font-semibold text-gray-800">{subject.students}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
                {subject.description}
              </p>

              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1 text-xs py-2 flex items-center justify-center gap-2">
                  <Edit2 size={14} />
                  Edit
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex-1 text-xs py-2 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50"
                  onClick={() => handleDeleteSubject(subject.id)}
                >
                  <Trash2 size={14} />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Subject Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Subject</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
                  <input
                    type="text"
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                    placeholder="e.g., Computer Science"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject Code</label>
                  <input
                    type="text"
                    value={newSubject.code}
                    onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                    placeholder="e.g., CS101"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teacher</label>
                  <input
                    type="text"
                    value={newSubject.teacher}
                    onChange={(e) => setNewSubject({ ...newSubject, teacher: e.target.value })}
                    placeholder="e.g., Mr. Anderson"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Credits</label>
                  <input
                    type="number"
                    value={newSubject.credits}
                    onChange={(e) => setNewSubject({ ...newSubject, credits: e.target.value })}
                    placeholder="e.g., 3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newSubject.description}
                    onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                    placeholder="Subject description..."
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="primary"
                    className="flex-1"
                    onClick={handleAddSubject}
                  >
                    Add Subject
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
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ClassSubjects;
