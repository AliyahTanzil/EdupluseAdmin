import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, LoadingSpinner, ErrorAlert } from '../components/Shared';
import { Edit2, ArrowLeft, Filter } from 'lucide-react';
import { timetableAPI, studentsAPI } from '../services/api';

const Timetable = () => {
  const navigate = useNavigate();
  const { classId } = useParams();

  // State Management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(classId || '');
  const [timetableData, setTimetableData] = useState({});
  const [schedule, setSchedule] = useState({});

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadTimetable();
    }
  }, [selectedClass]);

  const loadClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      // Get all students and extract unique classes
      const response = await studentsAPI.getAll({ limit: 1000, offset: 0 });

      if (response.success && response.data) {
        const classes = [...new Set(response.data.map(s => s.class))].filter(Boolean);
        setAvailableClasses(classes.sort());
        if (classId) {
          setSelectedClass(classId);
        } else if (classes.length > 0) {
          setSelectedClass(classes[0]);
        }
      } else {
        setError(response.message || 'Failed to load classes');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while loading classes');
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
        const entries = response.data || [];
        setTimetableData(entries);
        organizeByDay(entries);
      } else {
        setError(response.message || 'Failed to load timetable');
        setSchedule({});
      }
    } catch (err) {
      setError(err.message || 'An error occurred while loading timetable');
      setSchedule({});
    } finally {
      setLoading(false);
    }
  };

  const organizeByDay = (entries) => {
    const organized = {};

    // Initialize days
    days.forEach(day => {
      organized[day] = [];
    });

    // Group by day and sort by time
    entries.forEach(entry => {
      const day = entry.day;
      if (organized[day]) {
        organized[day].push(entry);
      }
    });

    // Sort each day by time
    Object.keys(organized).forEach(day => {
      organized[day].sort((a, b) => {
        const timeA = a.period_number || 0;
        const timeB = b.period_number || 0;
        return timeA - timeB;
      });
    });

    setSchedule(organized);
  };

  const getTimeSlots = () => {
    const slots = new Set();
    Object.values(timetableData).forEach(entry => {
      if (entry.period_number) {
        slots.add(entry.period_number);
      }
    });
    return Array.from(slots).sort((a, b) => a - b);
  };

  const getEntryForTimeSlot = (day, period) => {
    if (!Array.isArray(timetableData)) {
      return null;
    }
    return timetableData.find(
      entry => entry.day === day && entry.period_number === period
    );
  };

  const getSubjectColor = (subject) => {
    const colors = {
      'Math': 'bg-blue-100 text-blue-800',
      'English': 'bg-green-100 text-green-800',
      'Science': 'bg-purple-100 text-purple-800',
      'History': 'bg-yellow-100 text-yellow-800',
      'Geography': 'bg-pink-100 text-pink-800',
      'PE': 'bg-red-100 text-red-800',
      'Art': 'bg-indigo-100 text-indigo-800',
      'Music': 'bg-orange-100 text-orange-800',
      'Break': 'bg-gray-100 text-gray-600',
      'Mathematics': 'bg-blue-100 text-blue-800',
      'Hindi': 'bg-orange-100 text-orange-800',
      'Social Studies': 'bg-yellow-100 text-yellow-800',
    };

    return colors[subject] || 'bg-gray-100 text-gray-800';
  };

  if (loading && Object.keys(schedule).length === 0) {
    return <LoadingSpinner message="Loading timetable..." />;
  }

  const timeSlots = getTimeSlots();

  return (
    <div>
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Timetable</h1>
          <p className="text-gray-600 mt-2">View and manage class schedules</p>
        </div>
        <Button
          variant="primary"
          className="flex items-center gap-2"
          onClick={() => navigate(`/edit-timetable${selectedClass ? `/${selectedClass}` : ''}`)}
        >
          <Edit2 size={18} />
          Edit Timetable
        </Button>
      </div>

      {/* Class Filter */}
      <Card className="mb-6">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={18} className="text-gray-600" />
            <label className="font-semibold text-gray-800">Select Class</label>
          </div>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a class</option>
            {availableClasses.map(cls => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {selectedClass && (
        <>
          {/* Class Info */}
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-blue-900">{selectedClass}</h2>
            </div>
          </Card>

          {/* Timetable Grid */}
          <Card>
            <div className="p-6">
              {timeSlots.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No timetable entries for this class yet.</p>
                  <p className="text-gray-500 mt-2">
                    <button
                      onClick={() => navigate(`/edit-timetable`)}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Click here to create timetable
                    </button>
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold text-gray-900 w-32">Period</th>
                        {days.map(day => (
                          <th key={day} className="px-6 py-4 text-left font-semibold text-gray-900 min-w-40">
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timeSlots.map((period) => (
                        <tr key={period} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                            Period {period}
                          </td>
                          {days.map(day => {
                            const entry = getEntryForTimeSlot(day, period);
                            return (
                              <td key={day} className="px-6 py-4 whitespace-nowrap">
                                {entry ? (
                                  <div className={`px-3 py-2 rounded font-medium text-sm ${getSubjectColor(entry.subject_name)}`}>
                                    <p className="font-bold">{entry.subject_name}</p>
                                    <p className="text-xs opacity-75">{entry.teacher_name || 'N/A'}</p>
                                    <p className="text-xs opacity-75">Room {entry.room_number || 'N/A'}</p>
                                  </div>
                                ) : (
                                  <div className="px-3 py-2 rounded text-gray-400 text-sm">-</div>
                                )}
                              </td>
                            );
                          })}
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
    </div>
  );
};

export default Timetable;