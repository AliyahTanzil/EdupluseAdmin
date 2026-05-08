import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button, ErrorAlert } from '../components/Shared';
import { Mail, Lock, Eye, EyeOff, LogIn, Users, ChevronLeft } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, error: authError, isAuthenticated, user } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');  // New: User type selector
  const [teacherLevel, setTeacherLevel] = useState(''); // Teacher school-level sub-option
  const [showTeacherOptions, setShowTeacherOptions] = useState(false); // Show teacher sub-options
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Teacher school-level options
  const teacherLevelOptions = {
    'nursery': {
      name: 'Nursery',
      email: 'teacher-nursery@school.com',
      password: 'password',
      description: 'Nursery / Day Care section',
      icon: '🧒',
      category: 'Primary'
    },
    'class': {
      name: 'Class (Primary)',
      email: 'teacher@school.com',
      password: 'password',
      description: 'Primary Classes 1-6',
      icon: '📚',
      category: 'Primary'
    },
    'junior': {
      name: 'Junior Secondary',
      email: 'classteacher@school.com',
      password: 'password',
      description: 'JSS 1-3 (Form 1-3)',
      icon: '🏫',
      category: 'Secondary'
    },
    'senior': {
      name: 'Senior Secondary',
      email: 'teacher-senior@school.com',
      password: 'password',
      description: 'SSS 1-3',
      icon: '🎓',
      category: 'Secondary'
    }
  };

  // Demo users with their credentials
  const demoUsers = {
    'ceo': {
      name: 'CEO Admin',
      email: 'admin@school.com',
      password: 'password',
      description: 'All 3 schools (Primary, Junior, Senior)',
      icon: '👑'
    },
    'principal': {
      name: 'Principal',
      email: 'principal@school.com',
      password: 'password',
      description: 'Junior & Senior Secondary',
      icon: '👨‍🎓'
    },
    'regular_admin': {
      name: 'Regular Admin',
      email: 'regularadmin@school.com',
      password: 'password',
      description: 'Senior Secondary School only',
      icon: '🎯'
    },
    'teacher': {
      name: 'Teacher',
      email: '',
      password: '',
      description: 'Select school level →',
      icon: '👩‍🏫',
      hasSubOptions: true
    },
    'student': {
      name: 'Student',
      email: 'student-primary@school.com',
      password: 'password',
      description: 'View courses and grades',
      icon: '👨‍🎓'
    },
    'parent': {
      name: 'Parent',
      email: 'parent@school.com',
      password: 'password',
      description: 'Monitor child progress',
      icon: '👨‍👩‍👧'
    }
  };

  // Auto-fill email and password when user type is selected
  const handleUserTypeChange = (type) => {
    if (type === 'teacher') {
      setUserType(type);
      setShowTeacherOptions(true);
      setTeacherLevel('');
      // Don't auto-fill yet — user needs to pick a school level
      return;
    }
    setShowTeacherOptions(false);
    setTeacherLevel('');
    setUserType(type);
    if (demoUsers[type]) {
      setEmail(demoUsers[type].email);
      setPassword(demoUsers[type].password);
    }
  };

  // Handle teacher level selection
  const handleTeacherLevelChange = (level) => {
    setTeacherLevel(level);
    if (teacherLevelOptions[level]) {
      setEmail(teacherLevelOptions[level].email);
      setPassword(teacherLevelOptions[level].password);
    }
  };

  // If already logged in, redirect to school selection
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    navigate('/school-selection', { replace: true });
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      
      // After successful login, redirect to school selection
      navigate('/school-selection');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Determine which error to show (prioritize local error over context error)
  const displayError = error || authError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Edupluse</h1>
          <p className="text-blue-100">Student Management System</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Welcome Back</h2>

            {displayError && <ErrorAlert message={displayError} onClose={() => setError(null)} />}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* User Type Selector (Demo Mode) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Users size={16} className="inline mr-2" />
                  Quick Login - Select User Type (Demo)
                </label>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {Object.entries(demoUsers).map(([key, user]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleUserTypeChange(key)}
                      className={`p-3 rounded-lg border-2 transition-all text-center text-sm font-medium ${
                        userType === key
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-xl mb-1">{user.icon}</div>
                      <div className="font-semibold text-xs">{user.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{user.description}</div>
                    </button>
                  ))}
                </div>

                {/* Teacher School Level Sub-Options */}
                {showTeacherOptions && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => { setShowTeacherOptions(false); setUserType(''); setTeacherLevel(''); setEmail(''); setPassword(''); }}
                        className="p-1 rounded hover:bg-gray-100 text-gray-500"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="text-sm font-semibold text-gray-700">👩‍🏫 Select Teacher School Level</span>
                    </div>
                    
                    {/* Primary Section */}
                    <p className="text-xs font-semibold text-green-700 mb-1 px-1">🟢 Primary</p>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {Object.entries(teacherLevelOptions)
                        .filter(([, opt]) => opt.category === 'Primary')
                        .map(([key, opt]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handleTeacherLevelChange(key)}
                            className={`p-3 rounded-lg border-2 transition-all text-center text-sm font-medium ${
                              teacherLevel === key
                                ? 'border-green-600 bg-green-50 text-green-700'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-green-300'
                            }`}
                          >
                            <div className="text-xl mb-1">{opt.icon}</div>
                            <div className="font-semibold text-xs">{opt.name}</div>
                            <div className="text-xs text-gray-500 mt-1">{opt.description}</div>
                          </button>
                        ))}
                    </div>
                    
                    {/* Secondary Section */}
                    <p className="text-xs font-semibold text-purple-700 mb-1 px-1">🟣 Secondary</p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(teacherLevelOptions)
                        .filter(([, opt]) => opt.category === 'Secondary')
                        .map(([key, opt]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handleTeacherLevelChange(key)}
                            className={`p-3 rounded-lg border-2 transition-all text-center text-sm font-medium ${
                              teacherLevel === key
                                ? 'border-purple-600 bg-purple-50 text-purple-700'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300'
                            }`}
                          >
                            <div className="text-xl mb-1">{opt.icon}</div>
                            <div className="font-semibold text-xs">{opt.name}</div>
                            <div className="text-xs text-gray-500 mt-1">{opt.description}</div>
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-4">
                  <p className="text-xs text-blue-700">
                    <strong>💡 Tip:</strong> Click a user type above to auto-fill email and password
                    {showTeacherOptions && !teacherLevel && (
                      <span className="block mt-1 text-orange-600 font-semibold">⚠️ Please select a school level for Teacher</span>
                    )}
                  </p>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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

              {/* Submit Button */}
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2"
              >
                <LogIn size={18} />
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Create one
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-3 font-medium">📋 Demo Accounts:</p>
              <div className="space-y-2 text-xs text-gray-600">
                <p><strong>👑 CEO Admin:</strong> admin@school.com (All 3 schools)</p>
                <p><strong>👨‍🎓 Principal:</strong> principal@school.com (2 schools)</p>
                <p><strong>🎯 Regular Admin:</strong> regularadmin@school.com (1 school)</p>
                <p className="font-medium text-gray-700">👩‍🏫 Teachers (by school level):</p>
                <p className="pl-4">🧒 Nursery: teacher-nursery@school.com</p>
                <p className="pl-4">📚 Class (Primary): teacher@school.com</p>
                <p className="pl-4">🏫 Junior Secondary: classteacher@school.com</p>
                <p className="pl-4">🎓 Senior Secondary: teacher-senior@school.com</p>
                <p><strong>👨‍🎓 Student:</strong> student-primary@school.com / password</p>
                <p><strong>👨‍👩‍👧 Parent:</strong> parent@school.com / password</p>
                <p className="text-blue-600 font-medium mt-2">All passwords: <code className="bg-gray-100 px-1 py-0.5 rounded">password</code></p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
