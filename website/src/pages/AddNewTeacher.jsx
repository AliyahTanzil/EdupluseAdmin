import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../components/Shared';
import { ArrowLeft, Loader, Building2 } from 'lucide-react';
import { teachersAPI, subjectsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ADMIN_TYPES, SCHOOL_LEVELS } from '../config/schoolHierarchy';
import ErrorAlert from '../components/Shared/ErrorAlert';
import SuccessAlert from '../components/Shared/SuccessAlert';

const AddNewTeacher = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject_id: '',
    classes_assigned: '',
    experience: '',
    qualification: '',
    school_id: '' // New mandatory field
  });

  const classes = ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'];

  // Initialize school_id based on user assignments
  useEffect(() => {
    if (user) {
      const isMultiSchool = user.adminType === ADMIN_TYPES.CEO || 
                          user.adminType === ADMIN_TYPES.PRINCIPAL || 
                          user.adminType === ADMIN_TYPES.FINANCE;
      
      if (!isMultiSchool && user.assignedSchools?.length > 0) {
        setFormData(prev => ({ ...prev, school_id: user.assignedSchools[0] }));
      }
    }
  }, [user]);

  // Load subjects on component mount
  useEffect(() => {
    loadSubjects();
  }, [formData.school_id]); // Reload subjects when school changes

  const loadSubjects = async () => {
    try {
      setSubjectsLoading(true);
      const queryParams = { limit: 100, offset: 0 };
      if (formData.school_id) queryParams.school_id = formData.school_id;
      
      const response = await subjectsAPI.getAll(queryParams);
      
      if (response.success && response.data && Array.isArray(response.data)) {
        setSubjects(response.data);
      } else if (response.data && Array.isArray(response.data)) {
        setSubjects(response.data);
      } else {
        setSubjects([]);
      }
    } catch (err) {
      console.error('Failed to load subjects:', err);
      setSubjects([]);
    } finally {
      setSubjectsLoading(false);
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
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone || !formData.subject_id || !formData.classes_assigned || !formData.school_id) {
        setError('Please fill all required fields (Name, Email, Phone, Subject, Class, School)');
        setLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      // Prepare data for backend
      const submitData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject_id: formData.subject_id,
        school_id: formData.school_id, // NEW
        classes_assigned: formData.classes_assigned,
        experience: formData.experience ? parseInt(formData.experience) : 0,
        qualification: formData.qualification || '',
        hire_date: new Date().toISOString(),
        status: 'active'
      };

      const response = await teachersAPI.create(submitData);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/teachers');
        }, 1500);
      } else {
        setError(response.message || 'Failed to create teacher');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while creating the teacher');
    } finally {
      setLoading(false);
    }
  };

  const getSchoolLabel = (value) => {
    switch (value) {
      case SCHOOL_LEVELS.NURSERY: return 'Nursery / Day Care';
      case SCHOOL_LEVELS.PRIMARY: return 'Primary School';
      case SCHOOL_LEVELS.JUNIOR_SECONDARY: return 'Junior Secondary School';
      case SCHOOL_LEVELS.SENIOR_SECONDARY: return 'Senior Secondary School';
      default: return value;
    }
  };

  const isMultiSchoolAdmin = user?.adminType === ADMIN_TYPES.CEO || 
                           user?.adminType === ADMIN_TYPES.PRINCIPAL || 
                           user?.adminType === ADMIN_TYPES.FINANCE;

  const handleCancel = () => {
    navigate('/teachers');
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={20} />
          Back to Teachers
        </button>
      </div>

      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Add New Teacher</h1>
        <p className="text-gray-600 mb-8">Register a teacher and assign them to a specific school and subjects</p>

        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
        {success && <SuccessAlert message="Teacher created successfully! Redirecting..." onClose={() => {}} />}

        <Card>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* SCHOOL ASSIGNMENT */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Building2 size={20} className="text-blue-600" />
                School Assignment
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target School <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="school_id"
                    value={formData.school_id}
                    onChange={handleChange}
                    required
                    disabled={!isMultiSchoolAdmin || loading}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isMultiSchoolAdmin ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  >
                    <option value="">-- Select School --</option>
                    {(user?.assignedSchools || []).map(school => (
                      <option key={school} value={school}>{getSchoolLabel(school)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* PERSONAL INFORMATION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teacher Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Dr. Smith"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g., smith@school.com"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* CONTACT & SUBJECT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g., 9876543210"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  name="subject_id"
                  value={formData.subject_id}
                  onChange={handleChange}
                  required
                  disabled={subjectsLoading || !formData.school_id}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {!formData.school_id ? 'Please select a school first' : subjectsLoading ? 'Loading subjects...' : subjects.length === 0 ? 'No subjects available for this school' : 'Select Subject'}
                  </option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Class and Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class <span className="text-red-500">*</span>
                </label>
                <select
                  name="classes_assigned"
                  value={formData.classes_assigned}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualification
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  placeholder="e.g., B.Ed, M.Sc"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g., 10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="submit"
                variant="primary"
                className="flex-1 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Teacher'
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddNewTeacher;
