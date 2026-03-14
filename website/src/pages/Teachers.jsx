import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Card, LoadingSpinner, ErrorAlert } from '../components/Shared';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { teachersAPI } from '../services/api';

const Teachers = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const pageSize = 50;

  // Fetch teachers on mount and when page changes
  useEffect(() => {
    loadTeachers();
  }, [page]);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await teachersAPI.getAll({
        limit: pageSize,
        offset: page * pageSize
      });
      
      if (response.success) {
        setTeachers(response.data || []);
      } else {
        setError(response.message || 'Failed to load teachers');
        setTeachers([]);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while loading teachers');
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this teacher? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await teachersAPI.delete(id);
      if (response.success) {
        setTeachers(teachers.filter(t => t.id !== id));
      } else {
        setError(response.message || 'Failed to delete teacher');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while deleting the teacher');
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-teacher/${id}`);
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'subject', label: 'Subject' },
    { key: 'class', label: 'Class' },
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

  if (loading) return <LoadingSpinner message="Loading teachers..." />;

  return (
    <div>
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Teachers</h1>
        <Button variant="primary" className="flex items-center gap-2" onClick={() => navigate('/add-new-teacher')}>
          <Plus size={18} />
          Add New Teacher
        </Button>
      </div>

      {teachers.length > 0 ? (
        <>
          <Card>
            <Table data={teachers} columns={columns} actions={actions} />
          </Card>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-6">
            <Button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              variant="secondary"
            >
              Previous
            </Button>
            <span className="px-4 py-2 text-gray-700 font-medium">Page {page + 1}</span>
            <Button
              onClick={() => setPage(page + 1)}
              disabled={teachers.length < pageSize}
              variant="secondary"
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <Card className="text-center py-12">
          <p className="text-gray-500 mb-4">No teachers found.</p>
          <Button variant="primary" onClick={() => navigate('/add-new-teacher')}>
            Add the first teacher
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Teachers;