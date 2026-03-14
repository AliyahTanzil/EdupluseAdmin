import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Card, LoadingSpinner, ErrorAlert } from '../components/Shared';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { subjectsAPI } from '../services/api';

const Subjects = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const pageSize = 50;

  // Fetch subjects on mount and when page changes
  useEffect(() => {
    loadSubjects();
  }, [page]);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await subjectsAPI.getAll({
        limit: pageSize,
        offset: page * pageSize
      });
      
      if (response.success) {
        setSubjects(response.data || []);
      } else {
        setError(response.message || 'Failed to load subjects');
        setSubjects([]);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while loading subjects');
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await subjectsAPI.delete(id);
      if (response.success) {
        setSubjects(subjects.filter(s => s.id !== id));
      } else {
        setError(response.message || 'Failed to delete subject');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while deleting the subject');
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-subject/${id}`);
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    { key: 'teacher', label: 'Teacher' },
    { key: 'credits', label: 'Credits' },
    { key: 'status', label: 'Status' },
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

  if (loading) return <LoadingSpinner message="Loading subjects..." />;

  return (
    <div>
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Subjects</h1>
        <Button variant="primary" className="flex items-center gap-2" onClick={() => navigate('/add-new-subject')}>
          <Plus size={18} />
          Add New Subject
        </Button>
      </div>

      <Card>
        <Table 
          columns={columns} 
          data={subjects} 
          actions={actions}
        />
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-gray-600">
          Showing {subjects.length > 0 ? page * pageSize + 1 : 0} - {Math.min((page + 1) * pageSize, subjects.length)} of {subjects.length}
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
            disabled={subjects.length < pageSize}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Subjects;
