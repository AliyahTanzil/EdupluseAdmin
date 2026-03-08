import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Card, LoadingSpinner, ErrorAlert } from '../components/Shared';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { coursesAPI } from '../services/api';

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const pageSize = 50;

  // Fetch courses on mount and when page changes
  useEffect(() => {
    loadCourses();
  }, [page]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await coursesAPI.getAll({
        limit: pageSize,
        offset: page * pageSize
      });
      
      if (response.success) {
        setCourses(response.data || []);
      } else {
        setError(response.message || 'Failed to load courses');
        setCourses([]);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while loading courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await coursesAPI.delete(id);
      if (response.success) {
        setCourses(courses.filter(c => c.id !== id));
      } else {
        setError(response.message || 'Failed to delete course');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while deleting the course');
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-course/${id}`);
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    { key: 'teacher', label: 'Teacher' },
    { key: 'duration', label: 'Duration' },
    { key: 'credits', label: 'Credits' },
  ];

  const actions = [
    {
      label: 'Edit',
      icon: Edit,
      onClick: (row) => handleEdit(row.id),
      className: 'bg-blue-600 text-white hover:bg-blue-700',
    },
    {
      label: 'Delete',
      icon: Trash2,
      onClick: (row) => handleDelete(row.id),
      className: 'bg-red-600 text-white hover:bg-red-700',
    },
  ];

  if (loading) return <LoadingSpinner message="Loading courses..." />;

  return (
    <div>
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Courses</h1>
        <Button variant="primary" className="flex items-center gap-2" onClick={() => navigate('/add-new-course')}>
          <Plus size={18} />
          Add New Course
        </Button>
      </div>

      <Card>
        <Table 
          columns={columns} 
          data={courses} 
          actions={actions}
        />
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-gray-600">
          Showing {courses.length > 0 ? page * pageSize + 1 : 0} - {Math.min((page + 1) * pageSize, courses.length)} of {courses.length}
        </p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            onClick={() => setPage(page + 1)}
            disabled={courses.length < pageSize}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Courses;