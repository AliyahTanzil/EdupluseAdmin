import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, LoadingSpinner, ErrorAlert } from '../components/Shared';
import { ArrowLeft, Loader } from 'lucide-react';
import { teachersAPI } from '../services/api';
import SuccessAlert from '../components/Shared/SuccessAlert';

const EditTeacher = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState(null);

  const subjects = ['Mathematics', 'English', 'Science', 'History', 'Geography', 'PE', 'Art', 'Music', 'Computer Science'];
  const classes = ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'];

  // Load teacher data on mount
  useEffect(() => {
    loadTeacher();
  }, [id]);

  const loadTeacher = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await teachersAPI.getById(id);
      
      if (response.success) {
        setFormData(response.data);
      } else {
        setError(response.message || 'Failed to load teacher');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while loading the teacher');
    } finally {
      setLoading(false);
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
      setSaving(true);
      setError(null);

      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.class) {
        setError('Please fill all required fields (Name, Email, Phone, Subject, Class)');
        setSaving(false);
        return;
      }

      const response = await teachersAPI.update(id, formData);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/teachers');
        }, 1500);
      } else {
        setError(response.message || 'Failed to update teacher');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while updating the teacher');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/teachers');
  };

  if (loading) return <LoadingSpinner message="Loading teacher..." />;
  
  if (!formData) {
    return (
      <div>
        <ErrorAlert 
          message={error || 'Teacher not found'} 
          onClose={() => navigate('/teachers')} 
        />
      </div>
    );
  }

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
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Edit Teacher</h1>
        <p className="text-gray-600 mb-8">Update the teacher information below</p>

        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
        {success && <SuccessAlert message="Teacher updated successfully! Redirecting..." onClose={() => {}} />}

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
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
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
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience || ''}
                  onChange={handleChange}
                  placeholder="e.g., 5"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <Button
                type="submit"
                variant="primary"
                disabled={saving}
                className="flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                disabled={saving}
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

export default EditTeacher;
