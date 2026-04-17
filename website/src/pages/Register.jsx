import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button, ErrorAlert } from '../components/Shared';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, Users, AlertCircle } from 'lucide-react';
import { 
  ADMIN_TYPES, 
  SCHOOL_LEVELS, 
  getSchoolOptionsForAdminType,
  canViewMultipleSchools,
  getAllowedSchoolLevels 
} from '../config/schoolHierarchy';

const Register = () => {
  const navigate = useNavigate();
  const { register, error: authError } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    class: '',
    phone: '',
    schoolLevel: '', // For admin, teacher
    adminType: '', // For admin account type (admin, principal, ceo, secretary, finance)
    assignedSchools: [], // For admins that can manage multiple schools
    department: '', // For admin, teacher
    teacherType: '', // For teacher (class_master or regular_teacher)
    parentSchool: '', // For parent
    childrenCount: '1', // For parent
    childrenNames: '' // For parent (comma-separated)
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      
      // Validate required fields based on role
      if (formData.role === 'admin' && !formData.adminType) {
        setError('Please select admin account type');
        setLoading(false);
        return;
      }
      
      if (formData.role === 'admin') {
        if (canViewMultipleSchools(formData.adminType) && formData.assignedSchools.length === 0) {
          setError('Please select at least one school');
          setLoading(false);
          return;
        }
        if (!canViewMultipleSchools(formData.adminType) && !formData.schoolLevel) {
          setError('Please select a school level');
          setLoading(false);
          return;
        }
      }
      
      if (formData.role === 'teacher' && !formData.schoolLevel) {
        setError('Please select school level for teacher');
        setLoading(false);
        return;
      }
      
      if (formData.role === 'teacher' && formData.teacherType === 'class_master' && !formData.class) {
        setError('Please select class for class master');
        setLoading(false);
        return;
      }
      
      if (formData.role === 'parent' && !formData.parentSchool) {
        setError('Please select school for parent');
        setLoading(false);
        return;
      }
      
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        class: formData.class,
        phone: formData.phone,
        schoolLevel: formData.schoolLevel,
        department: formData.department,
        teacherType: formData.teacherType,
        parentSchool: formData.parentSchool,
        childrenCount: formData.childrenCount,
        childrenNames: formData.childrenNames,
        // New admin hierarchy fields
        adminType: formData.role === 'admin' ? formData.adminType : undefined,
        assignedSchools: formData.role === 'admin' && canViewMultipleSchools(formData.adminType) ? formData.assignedSchools : []
      });

      // Redirect to login
      navigate('/login', { 
        state: { message: 'Registration successful! Please log in.' }
      });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Edupluse</h1>
          <p className="text-blue-100">Student Management System</p>
        </div>

        {/* Register Card */}
        <Card className="shadow-2xl">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Account</h2>

            {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
            {authError && <ErrorAlert message={authError} onClose={() => setError(null)} />}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 text-gray-400" size={20} />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                    <option value="parent">Parent</option>
                  </select>
                </div>
              </div>

              {/* Class Field - for students */}
              {formData.role === 'student' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class
                  </label>
                  <input
                    type="text"
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    placeholder="e.g., Class 10A"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              )}

              {/* ADMIN FIELDS */}
              {formData.role === 'admin' && (
                <>
                  {/* Admin Account Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Account Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="adminType"
                      value={formData.adminType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    >
                      <option value="">-- Select Admin Type --</option>
                      <option value={ADMIN_TYPES.REGULAR_ADMIN}>Regular Admin (Single School)</option>
                      <option value={ADMIN_TYPES.PRINCIPAL}>Principal (Multiple Schools)</option>
                      <option value={ADMIN_TYPES.CEO}>CEO (All Schools - Super Admin)</option>
                      <option value={ADMIN_TYPES.SECRETARY}>Secretary (Single School)</option>
                      <option value={ADMIN_TYPES.FINANCE}>Finance Officer (All Schools Finance)</option>
                    </select>
                    {formData.adminType && (
                      <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                        <AlertCircle size={16} />
                        {(() => {
                          const allowedSchools = getAllowedSchoolLevels(formData.adminType);
                          if (allowedSchools.length === 1) {
                            return `Can manage: ${allowedSchools.map(s => s.replace(/_/g, ' ')).join(', ')}`;
                          } else if (allowedSchools.length > 1) {
                            return `Can manage: ${allowedSchools.map(s => s.replace(/_/g, ' ')).join(', ')}`;
                          } else {
                            return 'Select one or more schools below';
                          }
                        })()}
                      </p>
                    )}
                  </div>

                  {/* School Level Selection */}
                  {formData.adminType && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {canViewMultipleSchools(formData.adminType) ? 'Schools' : 'School Level'} <span className="text-red-500">*</span>
                      </label>
                      
                      {canViewMultipleSchools(formData.adminType) ? (
                        // Multi-select for admins that can manage multiple schools
                        <div className="space-y-2 border border-gray-300 rounded-lg p-3">
                          {getSchoolOptionsForAdminType(formData.adminType)
                            .filter(option => !option.disabled)
                            .map(option => (
                              <div key={option.value} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={option.value}
                                  checked={formData.assignedSchools.includes(option.value)}
                                  onChange={(e) => {
                                    const schoolValue = option.value;
                                    if (e.target.checked) {
                                      setFormData(prev => ({
                                        ...prev,
                                        assignedSchools: [...prev.assignedSchools, schoolValue]
                                      }));
                                    } else {
                                      setFormData(prev => ({
                                        ...prev,
                                        assignedSchools: prev.assignedSchools.filter(s => s !== schoolValue)
                                      }));
                                    }
                                  }}
                                  className="w-4 h-4 text-blue-600 rounded"
                                  disabled={loading}
                                />
                                <label htmlFor={option.value} className="ml-2 text-sm text-gray-700">
                                  {option.label}
                                </label>
                              </div>
                            ))}
                        </div>
                      ) : (
                        // Single-select for admins that manage one school
                        <select
                          name="schoolLevel"
                          value={formData.schoolLevel}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={loading}
                        >
                          <option value="">-- Select School Level --</option>
                          {getSchoolOptionsForAdminType(formData.adminType)
                            .filter(option => !option.disabled)
                            .map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                        </select>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department / Role
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="e.g., Administration, Finance, Operations"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    />
                  </div>
                </>
              )}

              {/* TEACHER FIELDS */}
              {formData.role === 'teacher' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      School Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="schoolLevel"
                      value={formData.schoolLevel}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    >
                      <option value="">-- Select School Level --</option>
                      <option value="primary">Primary School</option>
                      <option value="junior_secondary">Junior Secondary</option>
                      <option value="senior_secondary">Senior Secondary</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teacher Type
                    </label>
                    <select
                      name="teacherType"
                      value={formData.teacherType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    >
                      <option value="">-- Select Teacher Type --</option>
                      <option value="regular_teacher">Regular Teacher</option>
                      <option value="class_master">Class Master</option>
                      <option value="subject_head">Subject Head</option>
                      <option value="department_head">Department Head</option>
                    </select>
                  </div>

                  {formData.teacherType === 'class_master' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Class <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="class"
                        value={formData.class}
                        onChange={handleChange}
                        placeholder="e.g., Class 10A, Form 1, SSS2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department / Subject Area
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="e.g., Mathematics, Sciences, Languages"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    />
                  </div>
                </>
              )}

              {/* PARENT FIELDS */}
              {formData.role === 'parent' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      School <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="parentSchool"
                      value={formData.parentSchool}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    >
                      <option value="">-- Select School --</option>
                      <option value="primary">Primary School</option>
                      <option value="secondary">Secondary School</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Children in School
                    </label>
                    <select
                      name="childrenCount"
                      value={formData.childrenCount}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    >
                      <option value="1">1 Child</option>
                      <option value="2">2 Children</option>
                      <option value="3">3 Children</option>
                      <option value="4">4+ Children</option>
                    </select>
                  </div>

                  {parseInt(formData.childrenCount) > 1 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Children Names (comma-separated)
                      </label>
                      <input
                        type="text"
                        name="childrenNames"
                        value={formData.childrenNames}
                        onChange={handleChange}
                        placeholder="e.g., John, Mary, David"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      />
                    </div>
                  )}
                </>
              )}

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2"
              >
                <UserPlus size={18} />
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
