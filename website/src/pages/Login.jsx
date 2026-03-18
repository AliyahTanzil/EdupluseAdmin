import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button, ErrorAlert } from '../components/Shared';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, error: authError, isAuthenticated, user } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // If already logged in, redirect to role dashboard
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    switch (user.role) {
      case 'admin':
        navigate('/admin-dashboard', { replace: true });
        break;
      case 'teacher':
        navigate('/teacher-dashboard', { replace: true });
        break;
      case 'student':
        navigate('/student-dashboard', { replace: true });
        break;
      case 'parent':
        navigate('/parent-dashboard', { replace: true });
        break;
      default:
        navigate('/', { replace: true });
    }
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
      const user = await login(email, password);
      
      // Redirect based on role
      switch (user.role) {
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'teacher':
          navigate('/teacher-dashboard');
          break;
        case 'student':
          navigate('/student-dashboard');
          break;
        case 'parent':
          navigate('/parent-dashboard');
          break;
        default:
          navigate('/');
      }
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
              <p className="text-xs text-gray-600 mb-3 font-medium">Demo Credentials:</p>
              <div className="space-y-2 text-xs text-gray-600">
                <p><strong>Admin:</strong> admin@school.com / password</p>
                <p><strong>Teacher:</strong> teacher@school.com / password</p>
                <p><strong>Student:</strong> student@school.com / password</p>
                <p><strong>Parent:</strong> parent@school.com / password</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
