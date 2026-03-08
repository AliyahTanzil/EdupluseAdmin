import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, LoadingSpinner, ErrorAlert } from '../components/Shared';
import { ArrowLeft, Check, X, Save, Loader } from 'lucide-react';
import { attendanceAPI, studentsAPI, classesAPI } from '../services/api';
import SuccessAlert from '../components/Shared/SuccessAlert';

const MarkAttendance = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  // State Management
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [selectedClass, setSelectedClass] = useState(classId || '');
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSession, setSelectedSession] = useState('morning');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

  // Track attendance status for each student
  const [attendance, setAttendance] = useState({});

  // Load classes and students
  useEffect(() => {
    loadClasses();
  }, []);

  // Load students when class changes
  useEffect(() => {
    if (selectedClass) {
      loadStudents();
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

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentsAPI.getByClass(selectedClass, { limit: 100, offset: 0 });
      
      if (response.success) {
        const studentList = response.data || [];
        setStudents(studentList);
        
        // Initialize attendance state (all unmarked by default)
        const initialAttendance = {};
        studentList.forEach(student => {
          initialAttendance[student.id] = null; // null = unmarked, true = present, false = absent
        });
        setAttendance(initialAttendance);
      } else {
        setError(response.message || 'Failed to load students');
        setStudents([]);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while loading students');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const markAllPresent = () => {
    const allPresent = {};
    students.forEach(student => {
      allPresent[student.id] = true;
    });
    setAttendance(allPresent);
  };

  const markAllAbsent = () => {
    const allAbsent = {};
    students.forEach(student => {
      allAbsent[student.id] = false;
    });
    setAttendance(allAbsent);
  };

  const clearAll = () => {
    const cleared = {};
    students.forEach(student => {
      cleared[student.id] = null;
    });
    setAttendance(cleared);
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);

      // Validate that all students have attendance marked
      const unmarkedCount = Object.values(attendance).filter(a => a === null).length;
      if (unmarkedCount > 0) {
        setError(`Please mark attendance for all ${unmarkedCount} unmarked student(s)`);
        setSaving(false);
        return;
      }

      // Prepare bulk attendance data
      const attendanceData = {
        classId: selectedClass,
        date: attendanceDate,
        session: selectedSession,
        records: Object.keys(attendance).map(studentId => ({
          studentId: parseInt(studentId),
          status: attendance[studentId] ? 'present' : 'absent'
        }))
      };

      const response = await attendanceAPI.markBulk(attendanceData);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/class/${selectedClass}/attendance`);
        }, 1500);
      } else {
        setError(response.message || 'Failed to mark attendance');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while marking attendance');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading data..." />;

  const selectedClassData = classes.find(c => c.id === parseInt(selectedClass));
  const presentCount = Object.values(attendance).filter(a => a === true).length;
  const absentCount = Object.values(attendance).filter(a => a === false).length;
  const unmarkedCount = Object.values(attendance).filter(a => a === null).length;

  return (
    <div>
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {success && <SuccessAlert message="Attendance marked successfully! Redirecting..." onClose={() => {}} />}

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/class-attendance')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={20} />
          Back to Attendance
        </button>
      </div>

      <h1 className="text-4xl font-bold text-gray-800 mb-2">Mark Attendance</h1>
      <p className="text-gray-600 mb-8">Bulk mark attendance for students in a class</p>

      {/* Class & Session Selection */}
      <Card className="mb-6">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Class Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Session Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
              </select>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </Card>

      {selectedClass && selectedClassData && (
        <>
          {/* Class Info & Statistics */}
          <Card className="mb-6">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600">Class</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedClassData.name}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600">Present</p>
                  <p className="text-2xl font-bold text-green-600">{presentCount}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="text-sm text-gray-600">Absent</p>
                  <p className="text-2xl font-bold text-red-600">{absentCount}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-sm text-gray-600">Unmarked</p>
                  <p className="text-2xl font-bold text-yellow-600">{unmarkedCount}</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                <Button variant="success" onClick={markAllPresent} className="flex items-center gap-2">
                  <Check size={16} />
                  Mark All Present
                </Button>
                <Button variant="danger" onClick={markAllAbsent} className="flex items-center gap-2">
                  <X size={16} />
                  Mark All Absent
                </Button>
                <Button variant="secondary" onClick={clearAll}>
                  Clear All
                </Button>
              </div>
            </div>
          </Card>

          {/* Student Attendance Grid */}
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Students - {students.length} Total</h2>
              
              {students.length === 0 ? (
                <p className="text-gray-600">No students found for this class.</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {students.map(student => (
                    <div key={student.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{student.name}</p>
                        <p className="text-sm text-gray-600">Roll: {student.roll}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAttendanceChange(student.id, true)}
                          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                            attendance[student.id] === true
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-green-100'
                          }`}
                        >
                          <Check size={16} />
                          Present
                        </button>
                        <button
                          onClick={() => handleAttendanceChange(student.id, false)}
                          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                            attendance[student.id] === false
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                          }`}
                        >
                          <X size={16} />
                          Absent
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={saving || unmarkedCount > 0}
              className="flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Mark Attendance ({presentCount + absentCount}/{students.length})
                </>
              )}
            </Button>

            <Button
              variant="secondary"
              onClick={() => navigate('/class-attendance')}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default MarkAttendance;
