import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../components/Shared';
import { ArrowLeft, Loader, Building2 } from 'lucide-react';
import { studentsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ADMIN_TYPES, SCHOOL_LEVELS } from '../config/schoolHierarchy';
import ErrorAlert from '../components/Shared/ErrorAlert';
import SuccessAlert from '../components/Shared/SuccessAlert';
import { SchoolHierarchySelector } from '../utils/schoolStructure.jsx';

const AddNewStudent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    parent_phone: '',
    address: '',
    date_of_birth: '',
    school_id: '', // New mandatory field
    // New school hierarchy fields
    schoolLevel: '',
    section: '',
    classSelected: '',
    stream: '',
    rollNumber: ''
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSchoolLevelChange = (value) => {
    setFormData(prev => ({
      ...prev,
      schoolLevel: value,
      section: '',
      classSelected: '',
      stream: ''
    }));
  };

  const handleSectionChange = (value) => {
    setFormData(prev => ({
      ...prev,
      section: value,
      classSelected: '',
      stream: ''
    }));
  };

  const handleClassChange = (value) => {
    setFormData(prev => ({
      ...prev,
      classSelected: value
    }));
  };

  const handleStreamChange = (value) => {
    setFormData(prev => ({
      ...prev,
      stream: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone || !formData.schoolLevel || !formData.section || !formData.classSelected || !formData.school_id) {
        setError('Please fill all required fields including school assignment');
        setLoading(false);
        return;
      }

      // Prepare student data - MUST match backend field names!
      const studentData = {
        name: formData.name,
        roll: formData.rollNumber,           // Backend expects "roll"
        class: formData.classSelected,       // Backend expects "class"
        school_id: formData.school_id,       // NEW: pass school_id to backend
        email: formData.email,
        phone: formData.phone,
        parent_phone: formData.parent_phone,
        address: formData.address,
        date_of_birth: formData.date_of_birth
      };

      const response = await studentsAPI.create(studentData);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/students');
        }, 1500);
      } else {
        setError(response.message || 'Failed to create student');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while creating the student');
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
    navigate('/students');
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={20} />
          Back to Students
        </button>
      </div>

      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Add New Student</h1>
        <p className="text-gray-600 mb-8">Register a student and assign them to a specific school and class</p>

        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
        {success && <SuccessAlert message="Student created successfully! Redirecting..." onClose={() => {}} />}

        <Card>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* SECTION: SCHOOL ASSIGNMENT */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Building2 size={20} className="text-blue-600" />
                School Assignment
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                  {!isMultiSchoolAdmin && (
                    <p className="mt-1 text-xs text-gray-500">Your account is restricted to a single school</p>
                  )}
                </div>
              </div>

              <SchoolHierarchySelector
                schoolLevel={formData.schoolLevel}
                section={formData.section}
                classSelected={formData.classSelected}
                stream={formData.stream}
                onSchoolLevelChange={handleSchoolLevelChange}
                onSectionChange={handleSectionChange}
                onClassChange={handleClassChange}
                onStreamChange={handleStreamChange}
              />
            </div>

            {/* SECTION: PERSONAL INFORMATION */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>
              
              {/* Row 1: Name and Roll Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., John Doe"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    placeholder="e.g., 001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Row 2: Email and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g., john@school.com"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
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
              </div>

              {/* Row 3: Parent Phone and Date of Birth */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Phone Number
                  </label>
                  <input
                    type="tel"
                    name="parent_phone"
                    value={formData.parent_phone}
                    onChange={handleChange}
                    placeholder="e.g., 9876543210"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Row 4: Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g., 123 Main Street"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <Button
                type="submit"
                variant="primary"
                className="flex-1 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Student'
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

export default AddNewStudent;
