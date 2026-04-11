// Grades Management Page
// File: website/src/pages/Grades.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getApiBaseUrlSync } from '../config/apiConfig';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Card from '../components/Card';
import '../styles/gradesStyles.css';

const Grades = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    term: '1',
    academicYear: '2025/2026',
    studentId: '',
    classId: ''
  });
  const [analytics, setAnalytics] = useState({
    totalGrades: 0,
    averageScore: 0,
    topStudent: null,
    distribution: {}
  });
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  /**
   * Fetch grades from backend
   */
  const fetchGrades = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const apiBase = getApiBaseUrlSync();
      let url = `${apiBase}/grades`;

      if (user.role === 'teacher' && filters.classId) {
        url = `${apiBase}/grades/class/${filters.classId}`;
      } else if (user.role === 'student') {
        url = `${apiBase}/grades/student/${user.id}`;
      }

      const params = new URLSearchParams();
      if (filters.term) params.append('term', filters.term);
      if (filters.academicYear) params.append('academic_year', filters.academicYear);
      if (filters.studentId) params.append('student_id', filters.studentId);

      const token = localStorage.getItem('authToken');
      const response = await fetch(`${url}?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch grades: ${response.statusText}`);
      }

      const data = await response.json();
      setGrades(data.data || []);

      // Calculate analytics
      calculateAnalytics(data.data || []);
    } catch (err) {
      console.error('Error fetching grades:', err);
      setError(err.message || 'Failed to load grades. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user.id, user.role, filters]);

  /**
   * Calculate analytics from grades
   */
  const calculateAnalytics = useCallback((gradesData) => {
    if (!gradesData.length) {
      setAnalytics({
        totalGrades: 0,
        averageScore: 0,
        topStudent: null,
        distribution: {}
      });
      return;
    }

    const totalGrades = gradesData.length;
    const averageScore = (gradesData.reduce((sum, g) => sum + g.score, 0) / totalGrades).toFixed(2);

    const distribution = gradesData.reduce((acc, g) => {
      acc[g.grade] = (acc[g.grade] || 0) + 1;
      return acc;
    }, {});

    setAnalytics({
      totalGrades,
      averageScore,
      topStudent: gradesData.reduce((max, g) => g.score > (max?.score || 0) ? g : max),
      distribution
    });
  }, []);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  /**
   * Delete grade
   */
  const handleDelete = async (gradeId) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      try {
        const token = localStorage.getItem('authToken');
        const apiBase = getApiBaseUrlSync();
        const response = await fetch(`${apiBase}/grades/${gradeId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete grade');
        }

        setGrades(grades.filter(g => g.id !== gradeId));
        alert('Grade deleted successfully');
      } catch (err) {
        console.error('Error deleting grade:', err);
        alert(err.message || 'Failed to delete grade');
      }
    }
  };

  /**
   * Handle edit
   */
  const handleEdit = (grade) => {
    setSelectedGrade(grade);
    setIsEditing(true);
    setShowModal(true);
  };

  /**
   * Handle add new grade
   */
  const handleAddNew = () => {
    setSelectedGrade(null);
    setIsEditing(false);
    setShowModal(true);
  };

  /**
   * Handle modal close
   */
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGrade(null);
  };

  /**
   * Handle grade save
   */
  const handleSaveGrade = async (gradeData) => {
    try {
      const token = localStorage.getItem('authToken');
      const apiBase = getApiBaseUrlSync();
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing 
        ? `${apiBase}/grades/${selectedGrade.id}`
        : `${apiBase}/grades`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(gradeData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save grade');
      }

      const data = await response.json();
      
      if (isEditing) {
        setGrades(grades.map(g => g.id === data.data.id ? data.data : g));
        alert('Grade updated successfully');
      } else {
        setGrades([...grades, data.data]);
        alert('Grade created successfully');
      }

      handleCloseModal();
      fetchGrades();
    } catch (err) {
      console.error('Error saving grade:', err);
      alert(err.message || 'Failed to save grade');
    }
  };

  const columns = [
    { label: 'Student Name', key: 'student_name' },
    { label: 'Subject', key: 'subject_name' },
    { label: 'Score', key: 'score' },
    { label: 'Grade', key: 'grade' },
    { label: 'Term', key: 'term' },
    { label: 'Academic Year', key: 'academic_year' }
  ];

  return (
    <div className="grades-page">
      <Navbar />
      <div className="grades-container">
        <Sidebar />
        <main className="grades-main">
          {/* Header */}
          <div className="grades-header">
            <h1>📚 Grades Management</h1>
            {(user.role === 'admin' || user.role === 'teacher') && (
              <button className="btn-primary" onClick={handleAddNew}>
                + Add Grade
              </button>
            )}
          </div>

          {/* Analytics Cards */}
          {grades.length > 0 && (
            <div className="analytics-grid">
              <Card className="card-stat">
                <div className="card-content">
                  <p className="card-label">Total Grades</p>
                  <p className="card-value">{analytics.totalGrades}</p>
                </div>
              </Card>

              <Card className="card-stat">
                <div className="card-content">
                  <p className="card-label">Average Score</p>
                  <p className="card-value">{analytics.averageScore}%</p>
                </div>
              </Card>

              <Card className="card-stat">
                <div className="card-content">
                  <p className="card-label">Grade Distribution</p>
                  <div className="grade-distribution">
                    {Object.entries(analytics.distribution).map(([grade, count]) => (
                      <span key={grade} className={`badge badge-${grade}`}>
                        {grade}: {count}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Filters */}
          <div className="filters-section">
            <input
              type="text"
              placeholder="Filter by term"
              value={filters.term}
              onChange={(e) => setFilters({ ...filters, term: e.target.value })}
              className="filter-input"
            />
            <input
              type="text"
              placeholder="Academic Year"
              value={filters.academicYear}
              onChange={(e) => setFilters({ ...filters, academicYear: e.target.value })}
              className="filter-input"
            />
            <button className="btn-secondary" onClick={fetchGrades}>
              🔄 Refresh
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error">
              ⚠️ {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading grades...</p>
            </div>
          )}

          {/* Grades Table */}
          {!loading && grades.length === 0 && !error && (
            <div className="empty-state">
              <p>No grades found</p>
            </div>
          )}

          {!loading && grades.length > 0 && (
            <Table
              columns={columns}
              data={grades}
              onEdit={handleEdit}
              onDelete={handleDelete}
              showActions={user.role === 'admin' || user.role === 'teacher'}
            />
          )}

          {/* Modal for Add/Edit Grade */}
          {showModal && (
            <GradeModal
              grade={selectedGrade}
              isEditing={isEditing}
              onSave={handleSaveGrade}
              onClose={handleCloseModal}
            />
          )}
        </main>
      </div>
    </div>
  );
};

/**
 * Grade Modal Component
 */
const GradeModal = ({ grade, isEditing, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    student_id: grade?.student_id || '',
    subject_id: grade?.subject_id || '',
    score: grade?.score || '',
    term: grade?.term || '1',
    academic_year: grade?.academic_year || '2025/2026'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /**
   * Validate form
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.student_id) newErrors.student_id = 'Student is required';
    if (!formData.subject_id) newErrors.subject_id = 'Subject is required';
    if (!formData.score) {
      newErrors.score = 'Score is required';
    } else if (formData.score < 0 || formData.score > 100) {
      newErrors.score = 'Score must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await onSave(formData);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="modal-content">
        <h2>{isEditing ? 'Edit Grade' : 'Add New Grade'}</h2>

        <form onSubmit={handleSubmit} className="grade-form">
          <div className="form-group">
            <label>Student ID *</label>
            <input
              type="text"
              value={formData.student_id}
              onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
              disabled={isEditing}
              className={errors.student_id ? 'input-error' : ''}
            />
            {errors.student_id && <span className="error-msg">{errors.student_id}</span>}
          </div>

          <div className="form-group">
            <label>Subject ID *</label>
            <input
              type="text"
              value={formData.subject_id}
              onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
              disabled={isEditing}
              className={errors.subject_id ? 'input-error' : ''}
            />
            {errors.subject_id && <span className="error-msg">{errors.subject_id}</span>}
          </div>

          <div className="form-group">
            <label>Score (0-100) *</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.score}
              onChange={(e) => setFormData({ ...formData, score: e.target.value })}
              className={errors.score ? 'input-error' : ''}
            />
            {errors.score && <span className="error-msg">{errors.score}</span>}
          </div>

          <div className="form-group">
            <label>Term *</label>
            <select
              value={formData.term}
              onChange={(e) => setFormData({ ...formData, term: e.target.value })}
            >
              <option value="1">Term 1</option>
              <option value="2">Term 2</option>
              <option value="3">Term 3</option>
            </select>
          </div>

          <div className="form-group">
            <label>Academic Year *</label>
            <input
              type="text"
              value={formData.academic_year}
              onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
            />
          </div>

          {errors.submit && <div className="alert alert-error">{errors.submit}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default Grades;
