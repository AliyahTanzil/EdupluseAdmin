import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Card, LoadingSpinner, ErrorAlert } from '../components/Shared';
import { Plus, Edit, Trash2, Search, X, ClipboardList, Building2 } from 'lucide-react';
import { studentsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ADMIN_TYPES, SCHOOL_LEVELS } from '../config/schoolHierarchy';

const Students = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
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

  // Fetch students on mount, when page changes, or when school filter changes
  useEffect(() => {
    loadStudents();
  }, [page, selectedSchool]);

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
      
      const queryParams = {
        limit: pageSize,
        offset: page * pageSize
      };
      
      if (selectedSchool !== 'all') {
        queryParams.school_id = selectedSchool;
      }

      const response = await studentsAPI.getAll(queryParams);
      
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
    { key: 'school_id', label: 'School', render: (val) => getSchoolLabel(val) },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
  ];

  const actions = [
    {
      label: 'Results',
      icon: ClipboardList,
      onClick: (row) => navigate(`/student-results/${row.id}`),
      className: 'bg-green-600 text-white hover:bg-green-700',
    },
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
        <h1 className="text-3xl font-bold text-gray-800">Students Management</h1>
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
          
          <Button variant="primary" className="flex items-center gap-2 whitespace-nowrap" onClick={() => navigate('/add-new-student')}>
            <Plus size={18} />
            Add New Student
          </Button>
        </div>
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

      {loading && <LoadingSpinner message="Loading students..." />}

      {!loading && filteredStudents.length > 0 ? (
        <>
          <Card>
            <Table data={filteredStudents} columns={columns} actions={actions} />
          </Card>

          {/* Pagination - only show if not searching */}
          {!isSearching && (
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
          )}
        </>
      ) : !loading && (
        <Card className="text-center py-12">
          <p className="text-gray-500 mb-4">
            {isSearching ? 'No students match your search.' : 
             selectedSchool !== 'all' ? `No students found for ${getSchoolLabel(selectedSchool)}.` : 
             'No students found.'}
          </p>
          {isSearching && (
            <Button variant="secondary" onClick={() => setSearchQuery('')} className="mr-2">
              Clear Search
            </Button>
          )}
          <Button variant="primary" onClick={() => navigate('/add-new-student')}>
            {isSearching ? 'Add New Student' : 'Add the first student'}
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Students;