import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Modal } from '../components/Shared';
import { ArrowLeft, Plus, Edit2, Trash2, Save } from 'lucide-react';

const EditTimetable = () => {
  const navigate = useNavigate();
  const [isEditingPeriod, setIsEditingPeriod] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [periods, setPeriods] = useState([
    { id: 1, day: 'Monday', time: '9:00-10:00', subject: 'Math', teacher: 'Dr. Smith', room: '101' },
    { id: 2, day: 'Monday', time: '10:00-11:00', subject: 'English', teacher: 'Ms. Brown', room: '102' },
    { id: 3, day: 'Monday', time: '11:00-12:00', subject: 'Science', teacher: 'Mr. Johnson', room: '103' },
  ]);

  const [editData, setEditData] = useState({
    day: '',
    time: '',
    subject: '',
    teacher: '',
    room: '',
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const subjects = ['Math', 'English', 'Science', 'History', 'Geography', 'PE', 'Art', 'Music'];
  const teachers = ['Dr. Smith', 'Ms. Brown', 'Mr. Johnson', 'Mrs. Lee', 'Mr. Wilson'];
  const rooms = ['101', '102', '103', '104', '105', '106', '107'];

  const handleEditPeriod = (period) => {
    setSelectedPeriod(period);
    setEditData(period);
    setIsEditingPeriod(true);
  };

  const handleSavePeriod = () => {
    setPeriods(
      periods.map(p => p.id === selectedPeriod.id ? { ...editData, id: p.id } : p)
    );
    setIsEditingPeriod(false);
    alert('Period updated successfully!');
  };

  const handleDeletePeriod = (id) => {
    setPeriods(periods.filter(p => p.id !== id));
  };

  const handleAddNewPeriod = () => {
    const newPeriod = {
      id: Math.max(...periods.map(p => p.id), 0) + 1,
      day: 'Monday',
      time: '3:00-4:00',
      subject: 'Math',
      teacher: 'Dr. Smith',
      room: '101',
    };
    setPeriods([...periods, newPeriod]);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/timetable')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={20} />
          Back to Timetable
        </button>
      </div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Edit Timetable</h1>
          <p className="text-gray-600 mt-2">Manage school timetable and class schedules</p>
        </div>
        <Button variant="primary" className="flex items-center gap-2" onClick={handleAddNewPeriod}>
          <Plus size={18} />
          Add Period
        </Button>
      </div>

      {/* Timetable Grid */}
      <Card>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Day</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Subject</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Teacher</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Room</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {periods.map((period) => (
                  <tr key={period.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800 font-medium">{period.day}</td>
                    <td className="py-3 px-4 text-gray-600">{period.time}</td>
                    <td className="py-3 px-4 text-gray-600">{period.subject}</td>
                    <td className="py-3 px-4 text-gray-600">{period.teacher}</td>
                    <td className="py-3 px-4 text-gray-600 font-semibold">Room {period.room}</td>
                    <td className="py-3 px-4 text-center space-x-2">
                      <button
                        onClick={() => handleEditPeriod(period)}
                        className="text-blue-600 hover:text-blue-800 inline-block"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeletePeriod(period.id)}
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

      {/* Edit Modal */}
      <Modal
        isOpen={isEditingPeriod}
        onClose={() => setIsEditingPeriod(false)}
        title="Edit Period"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
            <select
              value={editData.day}
              onChange={(e) => setEditData({ ...editData, day: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
            <input
              type="text"
              value={editData.time}
              onChange={(e) => setEditData({ ...editData, time: e.target.value })}
              placeholder="e.g., 9:00-10:00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <select
              value={editData.subject}
              onChange={(e) => setEditData({ ...editData, subject: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Teacher</label>
            <select
              value={editData.teacher}
              onChange={(e) => setEditData({ ...editData, teacher: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {teachers.map(teacher => (
                <option key={teacher} value={teacher}>{teacher}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Room</label>
            <select
              value={editData.room}
              onChange={(e) => setEditData({ ...editData, room: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {rooms.map(room => (
                <option key={room} value={room}>{room}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="primary"
              className="flex-1 flex items-center justify-center gap-2"
              onClick={handleSavePeriod}
            >
              <Save size={18} />
              Save Changes
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setIsEditingPeriod(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditTimetable;
