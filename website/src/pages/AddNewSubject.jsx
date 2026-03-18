import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../components/Shared';
import { ArrowLeft, Loader } from 'lucide-react';
import { subjectsAPI } from '../services/api';
import ErrorAlert from '../components/Shared/ErrorAlert';
import SuccessAlert from '../components/Shared/SuccessAlert';

const AddNewSubject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    credit_hours: '',
    category: 'Academic',
    class_name: '',
    teacher_id: '',
    status: 'active'
  });

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
      if (!formData.name || !formData.code || formData.credit_hours === '' || !formData.class_name) {
        setError('Please fill all required fields (Name, Code, Credit Hours, Class)');
        setLoading(false);
        return;
      }

      // Validate credit hours is a positive number
      const creditHours = parseFloat(formData.credit_hours);
      if (isNaN(creditHours) || creditHours <= 0) {
        setError('Credit hours must be a positive number');
        setLoading(false);
        return;
      }

      // Validate code format
      if (formData.code.trim().length < 2) {
        setError('Subject code must be at least 2 characters long');
        setLoading(false);
        return;
      }

      // Prepare data for backend
      const submitData = {
        name: formData.name,
        code: formData.code,
        description: formData.description || '',
        credit_hours: creditHours,
        category: formData.category || 'Academic',
        class_name: formData.class_name,
        teacher_id: formData.teacher_id || null,
        status: formData.status || 'active'
      };

      const response = await subjectsAPI.create(submitData);
      
      if (response.success) {
        setSuccess(true);
        setFormData({
          name: '',
          code: '',
          description: '',
          credit_hours: '',
          category: 'Academic',
          class_name: '',
          teacher_id: '',
          status: 'active'
        });
        
        setTimeout(() => {
          navigate('/subjects');
        }, 1500);
      } else {
        setError(response.message || 'Failed to create subject');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while creating the subject');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/subjects');
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={20} />
          Back to Subjects
        </button>
      </div>

      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Add New Subject</h1>
        <p className="text-gray-600 mb-8">Fill in the subject information below to create a new subject record</p>

        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
        {success && <SuccessAlert message="Subject created successfully! Redirecting..." onClose={() => {}} />}

        <Card>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Row 1: Name and Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Mathematics"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g., MATH101"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Row 2: Description and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g., Introduction to Mathematics"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Academic">Academic</option>
                  <option value="Sports">Sports</option>
                  <option value="Arts">Arts</option>
                  <option value="Science">Science</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Co-curricular">Co-curricular</option>
                </select>
              </div>
            </div>

            {/* Row 3: Class and Credit Hours */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class <span className="text-red-500">*</span>
                </label>
                <select
                  name="class_name"
                  value={formData.class_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Class</option>
                  <option value="9-A">Class 9-A</option>
                  <option value="9-B">Class 9-B</option>
                  <option value="10-A">Class 10-A</option>
                  <option value="10-B">Class 10-B</option>
                  <option value="11-A">Class 11-A</option>
                  <option value="11-B">Class 11-B</option>
                  <option value="12-A">Class 12-A</option>
                  <option value="12-B">Class 12-B</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credit Hours <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  name="credit_hours"
                  value={formData.credit_hours}
                  onChange={handleChange}
                  placeholder="e.g., 4"
                  min="1"
                  max="10"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Row 4: Teacher ID and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teacher (Optional)
                </label>
                <input
                  type="text"
                  name="teacher_id"
                  value={formData.teacher_id}
                  onChange={handleChange}
                  placeholder="e.g., teacher ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Subject'
                )}
              </Button>

              <Button
                type="button"
                variant="secondary"
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

export default AddNewSubject;
