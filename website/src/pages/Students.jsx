import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Card, LoadingSpinner, ErrorAlert } from '../components/Shared';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { studentsAPI } from '../services/api';

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const pageSize = 50;

  // Fetch students on mount and when page changes
  useEffect(() => {
    loadStudents();
  }, [page]);

  // Handle search filtering
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStudents(students);
      setIsSearching(false);
    } else {
      setIsSearching(true);
      const query = searchQuery.toLowerCase();
      const filtered = students.filter(student => 
        student.name.toLowerCase().includes(query) ||
        student.roll.toLowerCase().includes(query) ||
        student.class.toLowerCase().includes(query) ||
        (student.email && student.email.toLowerCase().includes(query)) ||
        (student.phone && student.phone.includes(query))
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentsAPI.getAll({
        limit: pageSize,
        offset: page * pageSize
      });
      
      if (response.success) {
        setStudents(response.data || []);
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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await studentsAPI.delete(id);
      if (response.success) {
        setStudents(students.filter(s => s.id !== id));
      } else {
        setError(response.message || 'Failed to delete student');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while deleting the student');
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-student/${id}`);
  };

  const columns = [
    { key: 'roll', label: 'Roll No' },
    { key: 'name', label: 'Name' },
    { key: 'class', label: 'Class' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
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

  if (loading) return <LoadingSpinner message="Loading students..." />;

  return (
    <div>
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Students</h1>
        <Button variant="primary" className="flex items-center gap-2" onClick={() => navigate('/add-new-student')}>
          <Plus size={18} />
          Add New Student
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <div className="p-6">
          <div className="relative">
            <Search className="absolute left-4 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, roll number, class, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>
          {isSearching && (
            <p className="mt-2 text-sm text-gray-600">
              Found <span className="font-semibold text-blue-600">{filteredStudents.length}</span> student(s)
            </p>
          )}
        </div>
      </Card>

      {students.length > 0 ? (
        <>
          <Card>
            <Table data={students} columns={columns} actions={actions} />
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
              disabled={students.length < pageSize}
              variant="secondary"
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <Card className="text-center py-12">
          <p className="text-gray-500 mb-4">No students found.</p>
          <Button variant="primary" onClick={() => navigate('/add-new-student')}>
            Add the first student
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Students;