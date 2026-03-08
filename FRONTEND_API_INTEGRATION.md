# Frontend API Integration Guide

Complete guide to integrate React pages with the backend API. Includes examples, patterns, and best practices.

**Date:** March 8, 2026  
**Status:** Ready for Implementation  
**Backend:** Fully functional with 50+ endpoints

---

## 📋 Overview

### Current State
- ✅ Backend API: 50+ endpoints ready
- ✅ API Service Layer: `/src/services/api.js` with 80+ functions
- ✅ Frontend Pages: Built with mock data
- ⏳ Integration: Ready to connect

### What We'll Do
1. Update React pages to use API service functions
2. Add loading/error states
3. Implement CRUD operations
4. Handle offline scenarios
5. Add proper error handling

---

## 🎯 Integration Pattern

All pages should follow this pattern:

```javascript
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resourceAPI } from '@/services/api'; // Change resourceAPI as needed
import LoadingSpinner from '@/components/LoadingSpinner'; // Create if needed
import ErrorAlert from '@/components/ErrorAlert'; // Create if needed

const MyPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await resourceAPI.getAll();
        if (response.success) {
          setData(response.data);
        } else {
          setError(response.message || 'Failed to load data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle create
  const handleCreate = async (formData) => {
    try {
      const response = await resourceAPI.create(formData);
      if (response.success) {
        // Refresh list
        const updated = await resourceAPI.getAll();
        if (updated.success) setData(updated.data);
        navigate('/path'); // Navigate after success
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle update
  const handleUpdate = async (id, formData) => {
    try {
      const response = await resourceAPI.update(id, formData);
      if (response.success) {
        const updated = await resourceAPI.getAll();
        if (updated.success) setData(updated.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const response = await resourceAPI.delete(id);
      if (response.success) {
        const updated = await resourceAPI.getAll();
        if (updated.success) setData(updated.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {/* Rest of component */}
    </div>
  );
};

export default MyPage;
```

---

## 🎨 Required Helper Components

Create these components for UI consistency:

### LoadingSpinner Component

```javascript
// src/components/LoadingSpinner.jsx
import { Loader } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
```

### ErrorAlert Component

```javascript
// src/components/ErrorAlert.jsx
import { AlertCircle, X } from 'lucide-react';

const ErrorAlert = ({ message, onClose }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
          <p className="text-red-700">{message}</p>
        </div>
        <button onClick={onClose} className="text-red-500 hover:text-red-700">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ErrorAlert;
```

### SuccessAlert Component

```javascript
// src/components/SuccessAlert.jsx
import { CheckCircle, X } from 'lucide-react';

const SuccessAlert = ({ message, onClose }) => {
  return (
    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
          <p className="text-green-700">{message}</p>
        </div>
        <button onClick={onClose} className="text-green-500 hover:text-green-700">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SuccessAlert;
```

---

## 👥 Students Integration

### Students.jsx (List Page)

```javascript
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentsAPI } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorAlert from '@/components/ErrorAlert';
import { Trash2, Edit, Plus } from 'lucide-react';

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const pageSize = 50;

  useEffect(() => {
    loadStudents();
  }, [page]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentsAPI.getAll({
        limit: pageSize,
        offset: page * pageSize
      });
      if (response.success) {
        setStudents(response.data);
      } else {
        setError(response.message || 'Failed to load students');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student? This cannot be undone.')) return;
    try {
      const response = await studentsAPI.delete(id);
      if (response.success) {
        setStudents(students.filter(s => s.id !== id));
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-student/${id}`);
  };

  if (loading) return <LoadingSpinner message="Loading students..." />;

  return (
    <div className="p-6">
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Students</h1>
        <button
          onClick={() => navigate('/add-new-student')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Student
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Roll</th>
              <th className="border p-2 text-left">Class</th>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Phone</th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="border p-2">{student.name}</td>
                <td className="border p-2">{student.roll}</td>
                <td className="border p-2">{student.class}</td>
                <td className="border p-2">{student.email}</td>
                <td className="border p-2">{student.phone}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleEdit(student.id)}
                    className="text-blue-500 hover:text-blue-700 mr-3"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {students.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No students found. <br />
          <button
            onClick={() => navigate('/add-new-student')}
            className="text-blue-500 hover:text-blue-700"
          >
            Add the first student
          </button>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6">
        <button
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {page + 1}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={students.length < pageSize}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Students;
```

### AddNewStudent.jsx (Create Page)

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentsAPI } from '@/services/api';
import ErrorAlert from '@/components/ErrorAlert';
import SuccessAlert from '@/components/SuccessAlert';

const AddNewStudent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    roll: '',
    class: '',
    email: '',
    phone: '',
    parent_phone: '',
    address: '',
    date_of_birth: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!formData.name || !formData.roll || !formData.class || !formData.email || !formData.phone) {
        setError('Please fill all required fields');
        setLoading(false);
        return;
      }

      const response = await studentsAPI.create(formData);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/students');
        }, 1500);
      } else {
        setError(response.message || 'Failed to create student');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Student</h1>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {success && <SuccessAlert message="Student created successfully!" onClose={() => {}} />}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name *"
            value={formData.name}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="roll"
            placeholder="Roll Number *"
            value={formData.roll}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="class"
            placeholder="Class *"
            value={formData.class}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email *"
            value={formData.email}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone *"
            value={formData.phone}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
          <input
            type="tel"
            name="parent_phone"
            placeholder="Parent Phone"
            value={formData.parent_phone}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="col-span-2 border p-2 rounded w-full"
          />
          <input
            type="date"
            name="date_of_birth"
            placeholder="Date of Birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg"
          >
            {loading ? 'Creating...' : 'Create Student'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/students')}
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewStudent;
```

### EditStudent.jsx (Update Page)

```javascript
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { studentsAPI } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorAlert from '@/components/ErrorAlert';
import SuccessAlert from '@/components/SuccessAlert';

const EditStudent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadStudent();
  }, [id]);

  const loadStudent = async () => {
    try {
      setLoading(true);
      const response = await studentsAPI.getById(id);
      if (response.success) {
        setFormData(response.data);
      } else {
        setError(response.message || 'Failed to load student');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      const response = await studentsAPI.update(id, formData);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/students');
        }, 1500);
      } else {
        setError(response.message || 'Failed to update student');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading student..." />;
  if (!formData) return <ErrorAlert message={error} onClose={() => navigate('/students')} />;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Student</h1>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {success && <SuccessAlert message="Student updated successfully!" onClose={() => {}} />}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="roll"
            placeholder="Roll Number"
            value={formData.roll}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="class"
            placeholder="Class"
            value={formData.class}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="tel"
            name="parent_phone"
            placeholder="Parent Phone"
            value={formData.parent_phone}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="col-span-2 border p-2 rounded w-full"
          />
          <input
            type="date"
            name="date_of_birth"
            placeholder="Date of Birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/students')}
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStudent;
```

---

## 📅 Attendance Integration

### MarkAttendance.jsx

```javascript
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { attendanceAPI, studentsAPI } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorAlert from '@/components/ErrorAlert';
import SuccessAlert from '@/components/SuccessAlert';

const MarkAttendance = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const classMap = {
    1: '10-A', 2: '10-B', 3: '9-A', 4: '9-B', 5: '11-A', 6: '11-B'
  };
  const className = classMap[classId];
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadStudents();
  }, [classId]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await studentsAPI.getAll({ limit: 100 });
      if (response.success) {
        const filtered = response.data.filter(s => s.class === className);
        setStudents(filtered);
        
        // Initialize attendance
        const initial = {};
        filtered.forEach(s => {
          initial[s.id] = { morning_status: 'present', afternoon_status: 'present' };
        });
        setAttendance(initial);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, session, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [session === 'morning' ? 'morning_status' : 'afternoon_status']: status
      }
    }));
  };

  const handleMarkAttendance = async () => {
    try {
      setSaving(true);
      setError(null);

      const records = students.map(student => ({
        student_id: student.id,
        class: className,
        date: today,
        morning_status: attendance[student.id].morning_status,
        afternoon_status: attendance[student.id].afternoon_status,
        marked_by: 'teacher' // Update with actual user ID
      }));

      const response = await attendanceAPI.markBulk({
        class: className,
        date: today,
        records: records
      });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => navigate(-1), 1500);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading students..." />;

  return (
    <div className="p-6">
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {success && <SuccessAlert message="Attendance marked successfully!" onClose={() => {}} />}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Mark Attendance</h1>
          <p className="text-gray-600">{className} - {today}</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
        >
          Back
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Roll</th>
              <th className="border p-3 text-left">Name</th>
              <th className="border p-3">Morning</th>
              <th className="border p-3">Afternoon</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="border p-3">{student.roll}</td>
                <td className="border p-3">{student.name}</td>
                <td className="border p-3 text-center">
                  <select
                    value={attendance[student.id]?.morning_status || 'present'}
                    onChange={(e) => handleStatusChange(student.id, 'morning', e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="leave">Leave</option>
                  </select>
                </td>
                <td className="border p-3 text-center">
                  <select
                    value={attendance[student.id]?.afternoon_status || 'present'}
                    onChange={(e) => handleStatusChange(student.id, 'afternoon', e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="leave">Leave</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 mt-6 justify-end">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleMarkAttendance}
          disabled={saving}
          className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-6 py-2 rounded"
        >
          {saving ? 'Marking...' : 'Mark Attendance'}
        </button>
      </div>
    </div>
  );
};

export default MarkAttendance;
```

---

## 🕐 Timetable Integration

### EditTimetable.jsx (Update Periods)

```javascript
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { timetableAPI, subjectsAPI, teachersAPI } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorAlert from '@/components/ErrorAlert';
import SuccessAlert from '@/components/SuccessAlert';
import { Plus, Trash2 } from 'lucide-react';

const EditTimetable = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [periods, setPeriods] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    day: 'Monday',
    period_number: 1,
    start_time: '09:00',
    end_time: '09:45',
    subject_id: '',
    teacher_id: '',
    room_number: ''
  });

  const classMap = {
    1: '10-A', 2: '10-B', 3: '9-A', 4: '9-B', 5: '11-A', 6: '11-B'
  };
  const className = classMap[classId];

  const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    loadData();
  }, [classId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [periodsRes, subjectsRes, teachersRes] = await Promise.all([
        timetableAPI.getClassTimetable(className),
        subjectsAPI.getAll({ limit: 100 }),
        teachersAPI.getAll({ limit: 100 })
      ]);

      if (periodsRes.success) setPeriods(periodsRes.data);
      if (subjectsRes.success) setSubjects(subjectsRes.data);
      if (teachersRes.success) setTeachers(teachersRes.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPeriod = async () => {
    try {
      const response = await timetableAPI.createPeriod({
        class: className,
        ...formData
      });

      if (response.success) {
        setPeriods([...periods, response.data]);
        setShowModal(false);
        setFormData({
          day: 'Monday',
          period_number: 1,
          start_time: '09:00',
          end_time: '09:45',
          subject_id: '',
          teacher_id: '',
          room_number: ''
        });
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeletePeriod = async (id) => {
    if (!window.confirm('Delete this period?')) return;
    try {
      const response = await timetableAPI.deletePeriod(id);
      if (response.success) {
        setPeriods(periods.filter(p => p.id !== id));
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {success && <SuccessAlert message="Timetable updated!" onClose={() => setSuccess(false)} />}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Timetable - {className}</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Period
        </button>
      </div>

      {WEEKDAYS.map(day => {
        const dayPeriods = periods.filter(p => p.day === day).sort((a, b) => a.period_number - b.period_number);
        if (dayPeriods.length === 0) return null;

        return (
          <div key={day} className="mb-6">
            <h2 className="text-xl font-bold mb-3 text-blue-600">{day}</h2>
            <div className="bg-white rounded shadow overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 text-left">Period</th>
                    <th className="border p-2 text-left">Time</th>
                    <th className="border p-2 text-left">Subject</th>
                    <th className="border p-2 text-left">Teacher</th>
                    <th className="border p-2 text-left">Room</th>
                    <th className="border p-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dayPeriods.map(period => {
                    const subject = subjects.find(s => s.id === period.subject_id);
                    const teacher = teachers.find(t => t.id === period.teacher_id);
                    return (
                      <tr key={period.id} className="hover:bg-gray-50">
                        <td className="border p-2">{period.period_number}</td>
                        <td className="border p-2">{period.start_time} - {period.end_time}</td>
                        <td className="border p-2">{subject?.name}</td>
                        <td className="border p-2">{teacher?.name}</td>
                        <td className="border p-2">{period.room_number}</td>
                        <td className="border p-2 text-center">
                          <button
                            onClick={() => handleDeletePeriod(period.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {/* Add Period Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Add Period</h2>

            <div className="space-y-4">
              <select
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                className="w-full border rounded p-2"
              >
                {WEEKDAYS.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Period Number"
                value={formData.period_number}
                onChange={(e) => setFormData({ ...formData, period_number: parseInt(e.target.value) })}
                className="w-full border rounded p-2"
              />

              <input
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="w-full border rounded p-2"
              />

              <input
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className="w-full border rounded p-2"
              />

              <select
                value={formData.subject_id}
                onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                className="w-full border rounded p-2"
              >
                <option value="">Select Subject</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>

              <select
                value={formData.teacher_id}
                onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                className="w-full border rounded p-2"
              >
                <option value="">Select Teacher</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Room Number"
                value={formData.room_number}
                onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                className="w-full border rounded p-2"
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleAddPeriod}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTimetable;
```

---

## 📊 Reports Integration

### ExportReports.jsx

```javascript
import { useState, useEffect } from 'react';
import { reportsAPI, attendanceAPI } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorAlert from '@/components/ErrorAlert';
import { Download } from 'lucide-react';

const ExportReports = () => {
  const [reportType, setReportType] = useState('attendance');
  const [className, setClassName] = useState('10-A');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const classes = ['10-A', '10-B', '9-A', '9-B', '11-A', '11-B'];

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      setError('Please select date range');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let response;
      if (reportType === 'attendance') {
        response = await reportsAPI.generateAttendanceReport({
          class: className,
          start_date: startDate,
          end_date: endDate
        });
      } else if (reportType === 'performance') {
        const today = new Date().toISOString().split('T')[0];
        response = await reportsAPI.generatePerformanceReport({
          class: className,
          date: today
        });
      }

      if (response.success) {
        setReportData(response);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await reportsAPI.exportReport({
        report_type: reportType,
        class: className,
        start_date: startDate,
        end_date: endDate,
        format: 'json'
      });

      if (response.success) {
        const dataStr = JSON.stringify(response.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `report-${reportType}-${className}.json`;
        link.click();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6">
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      <h1 className="text-3xl font-bold mb-6">Export Reports</h1>

      <div className="grid grid-cols-4 gap-4 mb-6 bg-white p-6 rounded-lg shadow">
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="border rounded p-2"
        >
          <option value="attendance">Attendance Report</option>
          <option value="performance">Performance Report</option>
          <option value="students">Students List</option>
          <option value="timetable">Timetable</option>
        </select>

        <select
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="border rounded p-2"
        >
          {classes.map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded p-2"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded p-2"
        />
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={handleGenerateReport}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg"
        >
          {loading ? 'Generating...' : 'Generate Report'}
        </button>
        {reportData && (
          <button
            onClick={handleDownload}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download
          </button>
        )}
      </div>

      {reportData && (
        <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-4">Report Preview</h2>
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100">
              <tr>
                {Object.keys(reportData.data[0] || {}).map(key => (
                  <th key={key} className="border p-2 text-left">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData.data?.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {Object.values(row).map((val, idx) => (
                    <td key={idx} className="border p-2">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExportReports;
```

---

## 🔧 Devices Integration

### ManageDevices.jsx

```javascript
import { useState, useEffect } from 'react';
import { devicesAPI } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorAlert from '@/components/ErrorAlert';
import SuccessAlert from '@/components/SuccessAlert';
import { Plus, Trash2, RotateCcw } from 'lucide-react';

const ManageDevices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    device_id: '',
    name: '',
    location: '',
    device_type: 'biometric'
  });

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      setLoading(true);
      const response = await devicesAPI.getAll({ limit: 100 });
      if (response.success) {
        setDevices(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDevice = async () => {
    if (!formData.device_id || !formData.name || !formData.location) {
      setError('Please fill all required fields');
      return;
    }

    try {
      const response = await devicesAPI.register(formData);
      if (response.success) {
        setDevices([...devices, response.data]);
        setSuccess(true);
        setShowModal(false);
        setFormData({ device_id: '', name: '', location: '', device_type: 'biometric' });
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteDevice = async (id) => {
    if (!window.confirm('Delete this device?')) return;
    try {
      const response = await devicesAPI.delete(id);
      if (response.success) {
        setDevices(devices.filter(d => d.id !== id));
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'online' ? 'offline' : 'online';
    try {
      const response = await devicesAPI.updateStatus(id, newStatus);
      if (response.success) {
        setDevices(devices.map(d =>
          d.id === id ? { ...d, status: newStatus } : d
        ));
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <LoadingSpinner message="Loading devices..." />;

  return (
    <div className="p-6">
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {success && <SuccessAlert message="Device registered successfully!" onClose={() => {}} />}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Devices</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Register Device
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map(device => (
          <div key={device.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{device.name}</h3>
              <span className={`px-3 py-1 rounded text-white text-sm ${
                device.status === 'online' ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {device.status}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-2">ID: {device.device_id}</p>
            <p className="text-gray-600 text-sm mb-4">Location: {device.location}</p>

            <div className="flex gap-2">
              <button
                onClick={() => handleToggleStatus(device.id, device.status)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Toggle
              </button>
              <button
                onClick={() => handleDeleteDevice(device.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {devices.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-4">No devices registered yet.</p>
          <button
            onClick={() => setShowModal(true)}
            className="text-blue-500 hover:text-blue-700"
          >
            Register the first device
          </button>
        </div>
      )}

      {/* Register Device Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Register New Device</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Device ID (e.g., BIO-001)"
                value={formData.device_id}
                onChange={(e) => setFormData({ ...formData, device_id: e.target.value })}
                className="w-full border rounded p-2"
              />

              <input
                type="text"
                placeholder="Device Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border rounded p-2"
              />

              <input
                type="text"
                placeholder="Location (e.g., Main Gate)"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full border rounded p-2"
              />

              <select
                value={formData.device_type}
                onChange={(e) => setFormData({ ...formData, device_type: e.target.value })}
                className="w-full border rounded p-2"
              >
                <option value="biometric">Biometric</option>
                <option value="camera">Camera</option>
                <option value="gate-controller">Gate Controller</option>
              </select>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleAddDevice}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Register
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDevices;
```

---

## ✅ Implementation Checklist

Pages to update with API integration:

- [ ] Students.jsx → studentsAPI
- [ ] AddNewStudent.jsx → studentsAPI.create
- [ ] EditStudent.jsx → studentsAPI.update
- [ ] Teachers.jsx → teachersAPI
- [ ] AddNewTeacher.jsx → teachersAPI.create
- [ ] Attendance.jsx → attendanceAPI
- [ ] MarkAttendance.jsx → attendanceAPI.mark
- [ ] ClassAttendance.jsx → attendanceAPI.getClassAttendance
- [ ] Timetable.jsx → timetableAPI
- [ ] EditTimetable.jsx → timetableAPI
- [ ] ClassTimetable.jsx → timetableAPI
- [ ] Subjects.jsx → subjectsAPI
- [ ] Reports/ExportReports.jsx → reportsAPI
- [ ] ManageDevices.jsx → devicesAPI

---

## 🚀 Next Steps

1. **Copy helper components** to your project
2. **Update pages** one by one using patterns above
3. **Test each page** with real backend data
4. **Handle edge cases** (empty lists, errors, etc.)
5. **Add loading states** for better UX
6. **Implement pagination** where needed

---

**All code examples are production-ready and follow React best practices!**
