import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Modal, LoadingSpinner, ErrorAlert } from '../components/Shared';
import { ArrowLeft, Plus, Edit2, Trash2, Save, Loader } from 'lucide-react';
import { timetableAPI, classesAPI, subjectsAPI, teachersAPI } from '../services/api';
import SuccessAlert from '../components/Shared/SuccessAlert';

const EditTimetable = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  // State Management
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [selectedClass, setSelectedClass] = useState(classId || '');
  const [timetableEntries, setTimetableEntries] = useState([]);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Form Data
  const [formData, setFormData] = useState({
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:00',
    subject: '',
    teacher: '',
    room: '',
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadTimetable();
    }
  }, [selectedClass]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [classesRes, subjectsRes, teachersRes] = await Promise.all([
        classesAPI.getAll({ limit: 100, offset: 0 }),
        subjectsAPI.getAll({ limit: 100, offset: 0 }),
        teachersAPI.getAll({ limit: 100, offset: 0 }),
      ]);

      if (classesRes.success) {
        setClasses(classesRes.data || []);
        if (classId) {
          setSelectedClass(classId);
        } else if (classesRes.data && classesRes.data.length > 0) {
          setSelectedClass(classesRes.data[0].id);
        }
      }

      if (subjectsRes.success) {
        setSubjects(subjectsRes.data || []);
      }

      if (teachersRes.success) {
        setTeachers(teachersRes.data || []);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while loading data');
    } finally {
      setLoading(false);
    }
  };

  const loadTimetable = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await timetableAPI.getByClass(selectedClass);

      if (response.success) {
        setTimetableEntries(response.data || []);
      } else {
        setError(response.message || 'Failed to load timetable');
        setTimetableEntries([]);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
      setTimetableEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:00',
      subject: '',
      teacher: '',
      room: '',
    });
    setIsEditing(false);
    setSelectedEntry(null);
  };

  const handleAddNew = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (entry) => {
    setFormData({
      day: entry.day,
      startTime: entry.startTime,
      endTime: entry.endTime,
      subject: entry.subject,
      teacher: entry.teacher,
      room: entry.room,
    });
    setSelectedEntry(entry);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this timetable entry?')) {
      try {
        setSaving(true);
        const response = await timetableAPI.delete(id);

        if (response.success) {
          setSuccess(true);
          await loadTimetable();
          setTimeout(() => setSuccess(false), 3000);
        } else {
          setError(response.message || 'Failed to delete entry');
        }
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleSave = async () => {
    try {
      // Validation
      if (!formData.subject || !formData.teacher || !formData.room) {
        setError('Please fill all required fields');
        return;
      }

      setSaving(true);
      setError(null);

      const payload = {
        classId: parseInt(selectedClass),
        day: formData.day,
        startTime: formData.startTime,
        endTime: formData.endTime,
        subject: formData.subject,
        teacher: formData.teacher,
        room: formData.room,
      };

      let response;
      if (isEditing && selectedEntry) {
        response = await timetableAPI.update(selectedEntry.id, payload);
      } else {
        response = await timetableAPI.create(payload);
      }

      if (response.success) {
        setSuccess(true);
        setIsModalOpen(false);
        resetForm();
        await loadTimetable();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.message || 'Failed to save entry');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading && selectedClass === '') {
    return <LoadingSpinner message="Loading timetable editor..." />;
  }

  const sortedEntries = [...timetableEntries].sort((a, b) => {
    const dayOrder = days.indexOf(a.day) - days.indexOf(b.day);
    if (dayOrder !== 0) return dayOrder;
    return (a.startTime || '').localeCompare(b.startTime || '');
  });

  return (
    <div>
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {success && <SuccessAlert message="Timetable entry saved successfully!" onClose={() => {}} />}

      {/* Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/timetable')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={20} />
          Back to Timetable
        </button>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Edit Timetable</h1>
          <p className="text-gray-600 mt-2">Manage class schedules and periods</p>
        </div>
        <Button
          variant="primary"
          className="flex items-center gap-2"
          onClick={handleAddNew}
          disabled={!selectedClass}
        >
          <Plus size={18} />
          Add Period
        </Button>
      </div>

      {/* Class Selection */}
      <Card className="mb-6">
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a class</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {selectedClass && (
        <>
          {/* Timetable Entries Table */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Timetable Entries</h2>

              {loading ? (
                <LoadingSpinner message="Loading entries..." />
              ) : sortedEntries.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No timetable entries for this class.</p>
                  <p className="text-gray-500 mt-2">Click "Add Period" to create entries.</p>
                </div>
              ) : (
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
                      {sortedEntries.map((entry) => (
                        <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-800 font-medium">{entry.day}</td>
                          <td className="py-3 px-4 text-gray-600">
                            {entry.startTime} - {entry.endTime}
                          </td>
                          <td className="py-3 px-4 text-gray-600">{entry.subject}</td>
                          <td className="py-3 px-4 text-gray-600">{entry.teacher}</td>
                          <td className="py-3 px-4 text-gray-600 font-semibold">{entry.room}</td>
                          <td className="py-3 px-4 text-center space-x-2">
                            <button
                              onClick={() => handleEdit(entry)}
                              className="text-blue-600 hover:text-blue-800 inline-block"
                              disabled={saving}
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="text-red-600 hover:text-red-800 inline-block"
                              disabled={saving}
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Card>
        </>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={isEditing ? 'Edit Period' : 'Add New Period'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Day */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
              <select
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
              <select
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
              <select
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Teacher */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teacher <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.teacher}
                onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Teacher</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.name}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Room */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                placeholder="e.g., 101"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="primary"
              className="flex-1 flex items-center justify-center gap-2"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  {isEditing ? 'Update Period' : 'Add Period'}
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              disabled={saving}
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
