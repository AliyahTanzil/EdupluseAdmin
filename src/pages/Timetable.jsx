import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, LoadingSpinner, ErrorAlert } from '../components/Shared';
import { Edit2, ArrowLeft, Filter } from 'lucide-react';
import { timetableAPI, classesAPI } from '../services/api';

const Timetable = () => {
  const navigate = useNavigate();
  const { classId } = useParams();

  // State Management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);
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
      const response = await classesAPI.getAll({ limit: 100, offset: 0 });

      if (response.success) {
        setClasses(response.data || []);
        if (classId) {
          setSelectedClass(classId);
        } else if (response.data && response.data.length > 0) {
          setSelectedClass(response.data[0].id);
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
        const timeA = a.startTime || '00:00';
        const timeB = b.startTime || '00:00';
        return timeA.localeCompare(timeB);
      });
    });

    setSchedule(organized);
  };

  const getTimeSlots = () => {
    const slots = new Set();
    Object.values(timetableData).forEach(entry => {
      if (entry.startTime) {
        slots.add(entry.startTime);
      }
    });
    return Array.from(slots).sort();
  };

  const getEntryForTimeSlot = (day, time) => {
    return timetableData.find(
      entry => entry.day === day && entry.startTime === time
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
    };

    return colors[subject] || 'bg-gray-100 text-gray-800';
  };

  if (loading && Object.keys(schedule).length === 0) {
    return <LoadingSpinner message="Loading timetable..." />;
  }

  const selectedClassData = classes.find(c => c.id === parseInt(selectedClass));
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
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {selectedClass && selectedClassData && (
        <>
          {/* Class Info */}
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-blue-900">{selectedClassData.name}</h2>
              {selectedClassData.teacher && (
                <p className="text-blue-700 mt-2">Class Teacher: <span className="font-semibold">{selectedClassData.teacher}</span></p>
              )}
            </div>
          </Card>

          {/* Timetable Grid */}
          <Card>
            <div className="p-6">
              {timeSlots.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No timetable entries for this class.</p>
                  <p className="text-gray-500 mt-2">
                    <button
                      onClick={() => navigate(`/edit-timetable/${selectedClass}`)}
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
                        <th className="px-6 py-4 text-left font-semibold text-gray-900 w-32">Time</th>
                        {days.map(day => (
                          <th key={day} className="px-6 py-4 text-left font-semibold text-gray-900 min-w-40">
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timeSlots.map((time) => (
                        <tr key={time} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                            {time}
                          </td>
                          {days.map(day => {
                            const entry = getEntryForTimeSlot(day, time);
                            return (
                              <td key={day} className="px-6 py-4 whitespace-nowrap">
                                {entry ? (
                                  <div className={`px-3 py-2 rounded font-medium text-sm ${getSubjectColor(entry.subject)}`}>
                                    <p className="font-bold">{entry.subject}</p>
                                    <p className="text-xs opacity-75">{entry.teacher || 'N/A'}</p>
                                    <p className="text-xs opacity-75">Room {entry.room || 'N/A'}</p>
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