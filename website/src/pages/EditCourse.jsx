import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, LoadingSpinner, ErrorAlert } from '../components/Shared';
import { ArrowLeft, Loader } from 'lucide-react';
import { coursesAPI } from '../services/api';
import SuccessAlert from '../components/Shared/SuccessAlert';

const EditCourse = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState(null);

  // Load course data on mount
  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await coursesAPI.getById(id);
      
      if (response.success) {
        setFormData(response.data);
      } else {
        setError(response.message || 'Failed to load course');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while loading the course');
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
      if (!formData.name || !formData.code || !formData.credits) {
        setError('Please fill all required fields (Name, Code, Credits)');
        setSaving(false);
        return;
      }

      const response = await coursesAPI.update(id, formData);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/courses');
        }, 1500);
      } else {
        setError(response.message || 'Failed to update course');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while updating the course');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/courses');
  };

  if (loading) return <LoadingSpinner message="Loading course..." />;
  
  if (!formData) {
    return (
      <div>
        <ErrorAlert 
          message={error || 'Course not found'} 
          onClose={() => navigate('/courses')} 
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
          Back to Courses
        </button>
      </div>

      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Edit Course</h1>
        <p className="text-gray-600 mb-8">Update the course information below</p>

        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
        {success && <SuccessAlert message="Course updated successfully! Redirecting..." onClose={() => {}} />}

        <Card>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Row 1: Name and Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Name <span className="text-red-500">*</span>
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
                  Course Code <span className="text-red-500">*</span>
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

            {/* Row 2: Teacher and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teacher
                </label>
                <input
                  type="text"
                  name="teacher"
                  value={formData.teacher || ''}
                  onChange={handleChange}
                  placeholder="e.g., Dr. Smith"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <select
                  name="duration"
                  value={formData.duration || '1 year'}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="6 months">6 months</option>
                  <option value="1 year">1 year</option>
                  <option value="2 years">2 years</option>
                  <option value="3 years">3 years</option>
                  <option value="4 years">4 years</option>
                </select>
              </div>
            </div>

            {/* Credits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Credits <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="credits"
                value={formData.credits}
                onChange={handleChange}
                placeholder="e.g., 4"
                min="1"
                max="20"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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

export default EditCourse;
