import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  BookOpen, 
  ClipboardList, 
  BarChart3, 
  Bell, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Button } from '../components/Shared';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: 'Student Management',
      description: 'Manage student information, records, and profiles with ease. Track enrollment, attendance, and performance metrics.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: ClipboardList,
      title: 'Attendance Tracking',
      description: 'Track daily attendance with automatic biometric device integration. Generate attendance reports and monitor patterns.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Calendar,
      title: 'Timetable Management',
      description: 'Create and manage class schedules, assign teachers to periods, and optimize classroom utilization.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: BookOpen,
      title: 'Subject Management',
      description: 'Organize curriculum, manage subjects, and track course assignments across different classes.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Generate comprehensive reports on attendance, performance, and student progress with visual analytics.',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Send real-time notifications to parents and staff about attendance and important school updates.',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const benefits = [
    'Automated attendance tracking with biometric devices',
    'Real-time notifications to parents and guardians',
    'Comprehensive student performance analytics',
    'Easy-to-use dashboard with intuitive interface',
    'Multi-user support with role-based access',
    'Secure data management and backup systems'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BookOpen size={32} className="text-blue-600" />
              <span className="text-2xl font-bold text-gray-800">EduPlus Admin</span>
            </div>
            <Button 
              variant="primary"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              Enter Dashboard
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Manage Your School Efficiently with <span className="text-blue-600">EduPlus Admin</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              A comprehensive school administration platform designed to streamline student management, attendance tracking, timetable scheduling, and academic performance monitoring. Simplify your school operations with our intuitive and powerful system.
            </p>
            <div className="flex gap-4">
              <Button 
                variant="primary"
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 text-lg flex items-center gap-2"
              >
                <Zap size={20} />
                Get Started Now
              </Button>
              <Button 
                variant="secondary"
                className="px-8 py-4 text-lg"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-8 text-white flex flex-col items-center justify-center h-40">
              <Users size={48} className="mb-4" />
              <p className="text-center font-semibold">Student Management</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-8 text-white flex flex-col items-center justify-center h-40">
              <ClipboardList size={48} className="mb-4" />
              <p className="text-center font-semibold">Attendance</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-8 text-white flex flex-col items-center justify-center h-40">
              <Calendar size={48} className="mb-4" />
              <p className="text-center font-semibold">Timetable</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-8 text-white flex flex-col items-center justify-center h-40">
              <BarChart3 size={48} className="mb-4" />
              <p className="text-center font-semibold">Analytics</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your school efficiently, all in one platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-6`}>
                    <Icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">Why Choose EduPlus Admin?</h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <CheckCircle size={24} className="text-green-600 flex-shrink-0 mt-1" />
                    <p className="text-gray-700 text-lg">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg p-12 flex items-center justify-center min-h-96">
              <div className="text-center">
                <Shield size={64} className="text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  Secure, reliable, and easy-to-use school management system
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Schools</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg p-8 text-center shadow-md">
              <p className="text-4xl font-bold text-blue-600 mb-2">500+</p>
              <p className="text-gray-600">Schools Using</p>
            </div>
            <div className="bg-white rounded-lg p-8 text-center shadow-md">
              <p className="text-4xl font-bold text-green-600 mb-2">50K+</p>
              <p className="text-gray-600">Students Tracked</p>
            </div>
            <div className="bg-white rounded-lg p-8 text-center shadow-md">
              <p className="text-4xl font-bold text-purple-600 mb-2">99.9%</p>
              <p className="text-gray-600">Uptime</p>
            </div>
            <div className="bg-white rounded-lg p-8 text-center shadow-md">
              <p className="text-4xl font-bold text-orange-600 mb-2">24/7</p>
              <p className="text-gray-600">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your School?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of schools already using EduPlus Admin to manage their operations efficiently and effectively.
          </p>
          <Button 
            variant="primary"
            onClick={() => navigate('/dashboard')}
            className="px-10 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100 flex items-center gap-2 mx-auto"
          >
            <Zap size={20} />
            Start Your Journey Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={24} className="text-blue-400" />
                <span className="text-xl font-bold text-white">EduPlus Admin</span>
              </div>
              <p>Your complete school management solution</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Features</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Student Management</a></li>
                <li><a href="#" className="hover:text-white transition">Attendance</a></li>
                <li><a href="#" className="hover:text-white transition">Timetable</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p>&copy; 2024 EduPlus Admin. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
