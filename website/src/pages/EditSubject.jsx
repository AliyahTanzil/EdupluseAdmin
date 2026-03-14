import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, LoadingSpinner, ErrorAlert } from '../components/Shared';
import { ArrowLeft, Loader } from 'lucide-react';
import { subjectsAPI } from '../services/api';
import SuccessAlert from '../components/Shared/SuccessAlert';

const EditSubject = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState(null);

  // Load subject data on mount
  useEffect(() => {
    loadSubject();
  }, [id]);

  const loadSubject = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await subjectsAPI.getById(id);
      
      if (response.success) {
        setFormData(response.data);
      } else {
        setError(response.message || 'Failed to load subject');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while loading the subject');
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

      const response = await subjectsAPI.update(id, formData);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/subjects');
        }, 1500);
      } else {
        setError(response.message || 'Failed to update subject');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while updating the subject');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/subjects');
  };

  if (loading) return <LoadingSpinner message="Loading subject..." />;
  
  if (!formData) {
    return (
      <div>
        <ErrorAlert 
          message={error || 'Subject not found'} 
          onClose={() => navigate('/subjects')} 
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
          Back to Subjects
        </button>
      </div>

      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Edit Subject</h1>
        <p className="text-gray-600 mb-8">Update the subject information below</p>

        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
        {success && <SuccessAlert message="Subject updated successfully! Redirecting..." onClose={() => {}} />}

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

            {/* Row 2: Teacher and Credits */}
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
                  Credits <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="credits"
                  value={formData.credits}
                  onChange={handleChange}
                  placeholder="e.g., 4"
                  min="1"
                  max="10"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status || 'Active'}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
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

export default EditSubject;
