import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Modal } from '../components/Shared';
import { Plus, Users, BookOpen, Clock } from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([
    {
      id: 1,
      name: '10-A',
      teacher: 'Dr. Smith',
      students: 35,
      subject: 'Mathematics',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      name: '10-B',
      teacher: 'Ms. Johnson',
      students: 32,
      subject: 'English',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 3,
      name: '9-A',
      teacher: 'Mr. Brown',
      students: 38,
      subject: 'Science',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 4,
      name: '9-B',
      teacher: 'Dr. Wilson',
      students: 36,
      subject: 'Social Studies',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 5,
      name: '11-A',
      teacher: 'Ms. Taylor',
      students: 40,
      subject: 'Physics',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 6,
      name: '11-B',
      teacher: 'Mr. Anderson',
      students: 37,
      subject: 'Chemistry',
      color: 'from-indigo-500 to-indigo-600'
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClass, setNewClass] = useState({
    name: '',
    teacher: '',
    students: '',
  });

  const handleCreateClass = () => {
    if (newClass.name && newClass.teacher && newClass.students) {
      const classColors = ['from-blue-500 to-blue-600', 'from-purple-500 to-purple-600', 'from-green-500 to-green-600', 'from-orange-500 to-orange-600', 'from-red-500 to-red-600', 'from-indigo-500 to-indigo-600'];
      setClasses([
        ...classes,
        {
          id: classes.length + 1,
          name: newClass.name,
          teacher: newClass.teacher,
          students: parseInt(newClass.students),
          subject: 'New Subject',
          color: classColors[classes.length % classColors.length],
        },
      ]);
      setNewClass({ name: '', teacher: '', students: '' });
      setIsModalOpen(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Student Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your classes and track attendance</p>
          </div>
          <Button 
            variant="primary" 
            className="flex items-center gap-2 px-6 py-3"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={20} />
            Create Class
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Classes</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{classes.length}</p>
                </div>
                <div className="bg-blue-200 p-3 rounded-lg">
                  <BookOpen className="text-blue-600" size={24} />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Students</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">{classes.reduce((sum, cls) => sum + cls.students, 0)}</p>
                </div>
                <div className="bg-purple-200 p-3 rounded-lg">
                  <Users className="text-purple-600" size={24} />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Avg Students/Class</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {Math.round(classes.reduce((sum, cls) => sum + cls.students, 0) / classes.length)}
                  </p>
                </div>
                <div className="bg-green-200 p-3 rounded-lg">
                  <Clock className="text-green-600" size={24} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Classes Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Classes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <Card 
              key={classItem.id}
              className="hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className={`h-32 bg-gradient-to-r ${classItem.color} p-6 text-white flex flex-col justify-between`}>
                <div className="flex justify-between items-start">
                  <h3 className="text-3xl font-bold">{classItem.name}</h3>
                </div>
                <p className="text-white text-sm opacity-90">{classItem.subject}</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <div>
                      <p className="text-gray-600 text-sm">Class Teacher</p>
                      <p className="font-semibold text-gray-800">{classItem.teacher}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users size={18} />
                      <span className="text-sm">Students</span>
                    </div>
                    <span className="font-bold text-gray-800 text-lg">{classItem.students}</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2">
                  <Button 
                    variant="secondary" 
                    className="text-xs py-2"
                    title="View Attendance"
                    onClick={() => navigate(`/class/${classItem.id}/attendance`)}
                  >
                    📋 Attendance
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="text-xs py-2"
                    title="View Timetable"
                    onClick={() => navigate(`/class/${classItem.id}/timetable`)}
                  >
                    🕐 Timetable
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="text-xs py-2"
                    title="View Subjects"
                    onClick={() => navigate(`/class/${classItem.id}/subjects`)}
                  >
                    📚 Subjects
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Class Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Class"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Class Name</label>
            <input
              type="text"
              value={newClass.name}
              onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
              placeholder="e.g., 10-A"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Class Teacher</label>
            <input
              type="text"
              value={newClass.teacher}
              onChange={(e) => setNewClass({ ...newClass, teacher: e.target.value })}
              placeholder="e.g., Dr. Smith"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Students</label>
            <input
              type="number"
              value={newClass.students}
              onChange={(e) => setNewClass({ ...newClass, students: e.target.value })}
              placeholder="e.g., 35"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="primary"
              className="flex-1"
              onClick={handleCreateClass}
            >
              Create Class
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

export default StudentDashboard;
