import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, LoadingSpinner, ErrorAlert } from '../components/Shared';
import { ArrowLeft, Check, X, Save, Loader, Sun, Cloud, Clock } from 'lucide-react';
import { attendanceAPI, studentsAPI } from '../services/api';
import SuccessAlert from '../components/Shared/SuccessAlert';

const MarkAttendance = () => {
  const { classId: paramClassId } = useParams();
  const navigate = useNavigate();

  // State Management
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [selectedClass, setSelectedClass] = useState(paramClassId || '');
  const [availableClasses, setAvailableClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [weekStartDate, setWeekStartDate] = useState(getMonday(new Date()).toISOString().split('T')[0]);

  // Track attendance status for each student for the week
  // Structure: { studentId: { day0: { morning: 'present'|'absent'|'late'|null, afternoon: ... }, day1: ... } }
  const [weeklyAttendance, setWeeklyAttendance] = useState({});


  // Helper function to get Monday of current week
  function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  // Get days of the week from Monday
  const getDaysOfWeek = (startDate) => {
    const start = new Date(startDate);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const daysOfWeek = getDaysOfWeek(new Date(weekStartDate));
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Get session icon
  const getSessionIcon = (session) => {
    switch (session) {
      case 'morning':
        return <Sun size={16} className="text-yellow-500" />;
      case 'afternoon':
        return <Cloud size={16} className="text-gray-500" />;
      default:
        return <Sun size={16} className="text-yellow-500" />;
    }
  };

  // Get status color and icon
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'present':
        return { color: 'border-green-500 bg-white', icon: <Check size={20} className="text-green-500" /> };
      case 'absent':
        return { color: 'border-red-500 bg-white', icon: <X size={20} className="text-red-500" /> };
      case 'late':
        return { color: 'border-yellow-500 bg-white', icon: <Clock size={20} className="text-yellow-500" /> };
      default:
        return { color: 'border-gray-300 bg-gray-50', icon: null };
    }
  };

  // Load students when class changes
  useEffect(() => {
    if (selectedClass) {
      loadStudents();
    }
  }, [selectedClass]);


  // Load available classes when component mounts
  useEffect(() => {
    loadAvailableClasses();
  }, []);

  const loadAvailableClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      // Get all students and extract unique classes
      const response = await studentsAPI.getAll({ limit: 1000, offset: 0 });
      
      if (response.success && response.data) {
        const classes = [...new Set(response.data.map(s => s.class))].filter(Boolean);
        setAvailableClasses(classes.sort());
        
        // Auto-select first class if paramClassId not provided
        if (!paramClassId && classes.length > 0) {
          setSelectedClass(classes[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load classes:', err);
      setError('Failed to load available classes');
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
        
        // Initialize weekly attendance state with morning/afternoon sessions
        // Structure: { studentId: { day0: { morning: null, afternoon: null }, ... } }
        const initialAttendance = {};
        studentList.forEach(student => {
          initialAttendance[student.id] = {};
          for (let i = 0; i < 7; i++) {
            initialAttendance[student.id][`day${i}`] = {
              morning: null,
              afternoon: null
            };
          }
        });
        setWeeklyAttendance(initialAttendance);
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

  const handleAttendanceChange = (studentId, dayIndex, session, status) => {
    setWeeklyAttendance(prev => {
      const updated = { ...prev };
      const dayKey = `day${dayIndex}`;
      updated[studentId] = { ...updated[studentId] };
      updated[studentId][dayKey] = { ...updated[studentId][dayKey] };
      
      // Cycle through statuses: null -> present -> late -> absent -> null
      if (status === null) {
        updated[studentId][dayKey][session] = 'present';
      } else if (status === 'present') {
        updated[studentId][dayKey][session] = 'late';
      } else if (status === 'late') {
        updated[studentId][dayKey][session] = 'absent';
      } else {
        updated[studentId][dayKey][session] = null;
      }
      
      return updated;
    });
  };

  const clearAll = () => {
    const cleared = {};
    students.forEach(student => {
      cleared[student.id] = {};
      for (let i = 0; i < 7; i++) {
        cleared[student.id][`day${i}`] = {
          morning: null,
          afternoon: null
        };
      }
    });
    setWeeklyAttendance(cleared);
  };

  const getAttendancePercentage = (studentId) => {
    if (!weeklyAttendance[studentId]) return 0;
    let totalSlots = 0;
    let presentSlots = 0;
    
    for (let i = 0; i < 7; i++) {
      const dayKey = `day${i}`;
      const day = weeklyAttendance[studentId][dayKey];
      
      // Morning
      if (day.morning !== null) {
        totalSlots++;
        if (day.morning === 'present') presentSlots++;
      }
      
      // Afternoon
      if (day.afternoon !== null) {
        totalSlots++;
        if (day.afternoon === 'present') presentSlots++;
      }
    }
    
    return totalSlots === 0 ? 0 : Math.round((presentSlots / totalSlots) * 100);
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);

      // Prepare bulk attendance data for the week
      const attendanceData = [];
      daysOfWeek.forEach((date, dayIndex) => {
        const dateStr = date.toISOString().split('T')[0];
        const dayKey = `day${dayIndex}`;
        
        Object.keys(weeklyAttendance).forEach(studentId => {
          const dayData = weeklyAttendance[studentId][dayKey];
          
          // Morning session
          if (dayData.morning !== null) {
            attendanceData.push({
              class: selectedClass,
              date: dateStr,
              session: 'morning',
              student_id: studentId,
              status: dayData.morning
            });
          }
          
          // Afternoon session
          if (dayData.afternoon !== null) {
            attendanceData.push({
              class: selectedClass,
              date: dateStr,
              session: 'afternoon',
              student_id: studentId,
              status: dayData.afternoon
            });
          }
        });
      });

      if (attendanceData.length === 0) {
        setError('Please mark attendance for at least one student and session');
        setSaving(false);
        return;
      }

      // Submit attendance
      const response = await attendanceAPI.markBulk({
        class: selectedClass,
        records: attendanceData
      });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/attendance');
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

  return (
    <div>
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {success && <SuccessAlert message="Attendance marked successfully! Redirecting..." onClose={() => {}} />}

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/attendance')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={20} />
          Back to Attendance
        </button>
      </div>

      <h1 className="text-4xl font-bold text-gray-800 mb-2">Mark Attendance</h1>
      <p className="text-gray-600 mb-8">Weekly attendance tracking for students</p>

      {loading && availableClasses.length === 0 ? (
        <LoadingSpinner message="Loading classes and students..." />
      ) : (
        <>
          {/* Class & Session Selection */}
          <Card className="mb-6">
            <div className="p-6 space-y-6">
              {availableClasses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 text-lg">No classes found in the system.</p>
                  <p className="text-gray-500 mt-2">Please add some students first to create classes.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      {availableClasses.map(cls => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Week Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Week Starting <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={weekStartDate}
                      onChange={(e) => setWeekStartDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>

          {selectedClass && (
            <>
              {loading ? (
                <LoadingSpinner message="Loading students..." />
              ) : (
                <>
                  {/* Weekly Attendance Grid */}
                  <Card className="mb-6">
                    <div className="p-6 overflow-x-auto">
                      {students.length === 0 ? (
                        <p className="text-gray-600">No students found for this class.</p>
                      ) : (
                        <>
                          <h2 className="text-xl font-bold text-gray-800 mb-6">Week Attendance - {students.length} Students</h2>
                          
                          {/* Weekly Table */}
                          <table className="w-full border-collapse">
                            <thead>
                              <tr>
                                <th className="text-left p-4 border border-gray-200 bg-gray-50">Student</th>
                                {daysOfWeek.map((date, index) => (
                                  <th key={index} colSpan="2" className="text-center p-2 border border-gray-200 bg-gray-50">
                                    <div className="flex flex-col items-center">
                                      <span className="text-xs font-semibold text-gray-600">{dayNames[index]}</span>
                                    </div>
                                  </th>
                                ))}
                                <th className="text-center p-4 border border-gray-200 bg-gray-50">Week %</th>
                              </tr>
                              <tr>
                                <th className="text-left p-2 border border-gray-200 bg-gray-100"></th>
                                {daysOfWeek.map((date, index) => (
                                  <React.Fragment key={`sessions-${index}`}>
                                    <th className="text-center p-2 border border-gray-200 bg-gray-100 min-w-16">
                                      <div className="flex items-center justify-center gap-1">
                                        {getSessionIcon('morning')}
                                      </div>
                                    </th>
                                    <th className="text-center p-2 border border-gray-200 bg-gray-100 min-w-16">
                                      <div className="flex items-center justify-center gap-1">
                                        {getSessionIcon('afternoon')}
                                      </div>
                                    </th>
                                  </React.Fragment>
                                ))}
                                <th className="text-center p-2 border border-gray-200 bg-gray-100"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {students.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50">
                                  <td className="p-4 border border-gray-200">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                                        {student.name.charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-800">{student.name}</p>
                                        <p className="text-sm text-gray-600">Roll: {student.roll}</p>
                                      </div>
                                    </div>
                                  </td>
                                  {daysOfWeek.map((date, dayIndex) => {
                                    const dayKey = `day${dayIndex}`;
                                    const dayData = weeklyAttendance[student.id]?.[dayKey] || { morning: null, afternoon: null };
                                    
                                    return (
                                      <React.Fragment key={`${student.id}-${dayIndex}`}>
                                        {/* Morning Session */}
                                        <td className="text-center p-2 border border-gray-200">
                                          <button
                                            onClick={() => handleAttendanceChange(student.id, dayIndex, 'morning', dayData.morning)}
                                            className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer hover:shadow-md ${
                                              getStatusDisplay(dayData.morning).color
                                            }`}
                                            title={dayData.morning ? `Morning: ${dayData.morning}` : 'Morning: Unmarked'}
                                          >
                                            {getStatusDisplay(dayData.morning).icon}
                                          </button>
                                        </td>
                                        
                                        {/* Afternoon Session */}
                                        <td className="text-center p-2 border border-gray-200">
                                          <button
                                            onClick={() => handleAttendanceChange(student.id, dayIndex, 'afternoon', dayData.afternoon)}
                                            className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer hover:shadow-md ${
                                              getStatusDisplay(dayData.afternoon).color
                                            }`}
                                            title={dayData.afternoon ? `Afternoon: ${dayData.afternoon}` : 'Afternoon: Unmarked'}
                                          >
                                            {getStatusDisplay(dayData.afternoon).icon}
                                          </button>
                                        </td>
                                      </React.Fragment>
                                    );
                                  })}
                                  <td className="text-center p-4 border border-gray-200">
                                    <div className="flex flex-col items-center">
                                      <div className="w-16 h-16 rounded-full border-4 border-gray-300 flex items-center justify-center">
                                        <span className="text-lg font-bold text-gray-700">{getAttendancePercentage(student.id)}%</span>
                                      </div>
                                      <span className="text-xs text-gray-600 mt-1">
                                        {(() => {
                                          let present = 0;
                                          let total = 0;
                                          for (let i = 0; i < 7; i++) {
                                            const dayKey = `day${i}`;
                                            const day = weeklyAttendance[student.id][dayKey];
                                            if (day.morning !== null) total++;
                                            if (day.afternoon !== null) total++;
                                            if (day.morning === 'present') present++;
                                            if (day.afternoon === 'present') present++;
                                          }
                                          return `${present}/${total}`;
                                        })()}
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </>
                      )}
                    </div>
                  </Card>

                  {/* Quick Actions & Submit */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    <Button variant="secondary" onClick={clearAll} className="flex items-center gap-2">
                      Clear All
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSubmit}
                      disabled={saving || students.length === 0}
                      className="flex items-center gap-2 ml-auto"
                    >
                      {saving ? (
                        <>
                          <Loader size={18} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Save Weekly Attendance
                        </>
                      )}
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={() => navigate('/attendance')}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MarkAttendance;

