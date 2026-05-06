import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Card, LoadingSpinner, ErrorAlert } from '../components/Shared';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';
import { teachersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ADMIN_TYPES, SCHOOL_LEVELS } from '../config/schoolHierarchy';

const Teachers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [selectedSchool, setSelectedSchool] = useState('all');
  const pageSize = 50;

  // Initialize selected school based on user assignments
  useEffect(() => {
    if (user) {
      const isMultiSchool = user.adminType === ADMIN_TYPES.CEO || 
                          user.adminType === ADMIN_TYPES.PRINCIPAL || 
                          user.adminType === ADMIN_TYPES.FINANCE;
      
      if (!isMultiSchool && user.assignedSchools?.length > 0) {
        setSelectedSchool(user.assignedSchools[0]);
      }
    }
  }, [user]);

  // Fetch teachers on mount, when page changes, or when school filter changes
  useEffect(() => {
    loadTeachers();
  }, [page, selectedSchool]);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = {
        limit: pageSize,
        offset: page * pageSize
      };
      
      if (selectedSchool !== 'all') {
        queryParams.school_id = selectedSchool;
      }

      const response = await teachersAPI.getAll(queryParams);
      
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

  const getSchoolLabel = (value) => {
    switch (value) {
      case SCHOOL_LEVELS.NURSERY: return 'Nursery';
      case SCHOOL_LEVELS.PRIMARY: return 'Primary';
      case SCHOOL_LEVELS.JUNIOR_SECONDARY: return 'Junior Secondary';
      case SCHOOL_LEVELS.SENIOR_SECONDARY: return 'Senior Secondary';
      case 'all': return 'All Schools';
      default: return value;
    }
  };

  const isMultiSchoolAdmin = user?.adminType === ADMIN_TYPES.CEO || 
                           user?.adminType === ADMIN_TYPES.PRINCIPAL || 
                           user?.adminType === ADMIN_TYPES.FINANCE;

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
    { key: 'school_id', label: 'School', render: (val) => getSchoolLabel(val) },
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

  return (
    <div>
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Teachers Management</h1>
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* School Selector (only for multi-school admins) */}
          {isMultiSchoolAdmin && (
            <div className="relative flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
              <Building2 size={18} className="text-gray-500" />
              <select 
                value={selectedSchool}
                onChange={(e) => {
                  setSelectedSchool(e.target.value);
                  setPage(0);
                }}
                className="bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 cursor-pointer outline-none"
              >
                <option value="all">All Assigned Schools</option>
                {(user.assignedSchools || []).map(school => (
                  <option key={school} value={school}>{getSchoolLabel(school)}</option>
                ))}
              </select>
            </div>
          )}
          
          <Button variant="primary" className="flex items-center gap-2 whitespace-nowrap" onClick={() => navigate('/add-new-teacher')}>
            <Plus size={18} />
            Add New Teacher
          </Button>
        </div>
      </div>

      {loading && <LoadingSpinner message="Loading teachers..." />}

      {!loading && teachers.length > 0 ? (
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
      ) : !loading && (
        <Card className="text-center py-12">
          <p className="text-gray-500 mb-4">
            {selectedSchool !== 'all' ? `No teachers found for ${getSchoolLabel(selectedSchool)}.` : 
             'No teachers found.'}
          </p>
          <Button variant="primary" onClick={() => navigate('/add-new-teacher')}>
            Add the first teacher
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Teachers;