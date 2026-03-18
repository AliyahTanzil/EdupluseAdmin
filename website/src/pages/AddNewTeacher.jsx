import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../components/Shared';
import { ArrowLeft, Loader } from 'lucide-react';
import { teachersAPI, subjectsAPI } from '../services/api';
import ErrorAlert from '../components/Shared/ErrorAlert';
import SuccessAlert from '../components/Shared/SuccessAlert';

const AddNewTeacher = () => {
  const navigate = useNavigate();
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
    qualification: ''
  });

  const classes = ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'];

  // Load subjects on component mount
  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setSubjectsLoading(true);
      console.log('Loading subjects...');
      const response = await subjectsAPI.getAll({ limit: 100, offset: 0 });
      console.log('Subjects response:', response);
      
      if (response.success && response.data && Array.isArray(response.data)) {
        console.log('Subjects loaded:', response.data);
        setSubjects(response.data);
      } else if (response.data && Array.isArray(response.data)) {
        // Sometimes data comes without success flag
        console.log('Subjects loaded (no success flag):', response.data);
        setSubjects(response.data);
      } else {
        console.warn('No subjects found or invalid response format:', response);
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
      if (!formData.name || !formData.email || !formData.phone || !formData.subject_id || !formData.classes_assigned) {
        setError('Please fill all required fields (Name, Email, Phone, Subject, Class)');
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

      // Validate phone format - must have at least 10 digits
      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        setError('Please enter a valid phone number (at least 10 digits)');
        setLoading(false);
        return;
      }

      // Validate name length
      if (formData.name.trim().length < 2) {
        setError('Teacher name must be at least 2 characters long');
        setLoading(false);
        return;
      }

      // Prepare data for backend
      const submitData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject_id: formData.subject_id,
        classes_assigned: formData.classes_assigned,
        experience: formData.experience ? parseInt(formData.experience) : 0,
        qualification: formData.qualification || '',
        hire_date: new Date().toISOString(),
        status: 'active'
      };

      const response = await teachersAPI.create(submitData);
      
      if (response.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject_id: '',
          classes_assigned: '',
          experience: '',
          qualification: ''
        });
        
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
        <p className="text-gray-600 mb-8">Fill in the teacher information below to create a new teacher record</p>

        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
        {success && <SuccessAlert message="Teacher created successfully! Redirecting..." onClose={() => {}} />}

        <Card>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Row 1: Name and Email */}
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

            {/* Row 2: Phone and Subject */}
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
                  disabled={subjectsLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {subjectsLoading ? 'Loading subjects...' : subjects.length === 0 ? 'No subjects available' : 'Select Subject'}
                  </option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
                {subjects.length === 0 && !subjectsLoading && (
                  <p className="text-xs text-red-500 mt-1">No subjects found. Please create subjects first.</p>
                )}
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
