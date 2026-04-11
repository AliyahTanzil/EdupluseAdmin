import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSchool } from '../contexts/SchoolContext';
import { BookOpen, GraduationCap, Users, Building2, AlertCircle, LogOut } from 'lucide-react';
import { getApplicableSchoolTypes } from '../config/rbac';
import { 
  ADMIN_TYPES, 
  SCHOOL_LEVELS, 
  getAllowedSchoolLevels, 
  canViewMultipleSchools 
} from '../config/schoolHierarchy';

const SchoolSelection = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { selectSchool } = useSchool();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  const schoolTypes = [
    {
      id: 'nursery',
      name: 'Nursery / Day Care',
      icon: BookOpen,
      description: 'For preschool and early childhood education',
      color: 'from-pink-500 to-rose-500',
      classes: ['Playgroup', 'Pre-K', 'K-1', 'K-2']
    },
    {
      id: 'primary',
      name: 'Primary School',
      icon: GraduationCap,
      description: 'For elementary and foundational education',
      color: 'from-blue-500 to-cyan-500',
      classes: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6']
    },
    {
      id: 'junior_secondary',
      name: 'Junior Secondary',
      icon: Users,
      description: 'For middle school education',
      color: 'from-purple-500 to-violet-500',
      classes: ['JSS 1', 'JSS 2', 'JSS 3']
    },
    {
      id: 'senior_secondary',
      name: 'Senior Secondary',
      icon: Building2,
      description: 'For high school education',
      color: 'from-orange-500 to-red-500',
      classes: ['SS 1', 'SS 2', 'SS 3']
    }
  ];

  // Get applicable school types based on user role
  // Priority: Use adminType if available, otherwise fall back to user.role
  const applicableSchoolTypeIds = useMemo(() => {
    if (!user) return [];
    
    // If user has adminType (from school hierarchy system)
    if (user.adminType) {
      const allowedLevels = getAllowedSchoolLevels(user.adminType);
      // Map school hierarchy levels to school type IDs
      const schoolTypeMap = {
        [SCHOOL_LEVELS.NURSERY]: 'nursery',
        [SCHOOL_LEVELS.PRIMARY]: 'primary',
        [SCHOOL_LEVELS.JUNIOR_SECONDARY]: 'junior_secondary',
        [SCHOOL_LEVELS.SENIOR_SECONDARY]: 'senior_secondary'
      };
      return allowedLevels.map(level => schoolTypeMap[level]).filter(Boolean);
    }
    
    // Fall back to old RBAC system
    if (!user.role) return [];
    // user.role is now always a base string ('admin', 'teacher', etc.)
    // Use roleObj if available for RBAC lookup, otherwise use the base role string
    const roleForRbac = user.roleObj || user.role;
    return getApplicableSchoolTypes(roleForRbac);
  }, [user]);

  // Filter school types based on applicable types for user's role
  const availableSchools = useMemo(() => {
    if (applicableSchoolTypeIds.length === 0) return [];
    return schoolTypes.filter(school => applicableSchoolTypeIds.includes(school.id));
  }, [applicableSchoolTypeIds]);

  // Get role name for display
  const getRoleName = () => {
    if (!user) return 'User';
    
    // If user has adminType (from school hierarchy system)
    if (user.adminType) {
      // Map adminType to display name
      const adminTypeNames = {
        [ADMIN_TYPES.CEO]: 'CEO',
        [ADMIN_TYPES.PRINCIPAL]: 'Principal',
        [ADMIN_TYPES.REGULAR_ADMIN]: 'Regular Admin',
        [ADMIN_TYPES.SECRETARY]: 'Secretary',
        [ADMIN_TYPES.FINANCE]: 'Finance Officer'
      };
      return adminTypeNames[user.adminType] || user.adminType;
    }
    
    // Fall back to old system
    if (!user.role) return 'User';
    // user.role is always a base string now; use roleObj for display name if available
    if (user.roleObj && user.roleObj.name) return user.roleObj.name;
    // Capitalize the base role string
    return user.role.charAt(0).toUpperCase() + user.role.slice(1);
  };

  // Check if user has unrestricted access to all schools
  const hasUnrestrictedAccess = useMemo(() => {
    if (!user) return false;
    
    // For adminType system: CEO has unrestricted access
    if (user.adminType === ADMIN_TYPES.CEO) {
      return true;
    }
    
    // For old RBAC system
    if (!user.role) return false;
    // If roleObj has no applicableTo restriction, it's unrestricted
    if (user.roleObj && !user.roleObj.applicableTo) return true;
    // If role is string 'admin', consider it unrestricted for super users
    return user.role === 'admin' && user.isSuperUser;
  }, [user]);

  // Map role ID to dashboard route
  const getRoleDashboard = (roleId) => {
    const dashboardMap = {
      'class_master': '/class-teacher-dashboard',
      'head_of_department': '/departmental-head-dashboard',
      'ordinary_teacher': '/teacher-dashboard',
      'subject_head': '/subject-head-dashboard',
      'regular_teacher': '/teacher-dashboard',
      'ceo': '/admin-dashboard',
      'head_master': '/admin-dashboard',
      'principal': '/admin-dashboard',
      'vice_principal': '/admin-dashboard',
      'secretary': '/admin-dashboard',
      'treasurer': '/admin-dashboard',
      'admin': '/admin-dashboard',
      'teacher': '/teacher-dashboard',
      'student': '/student-dashboard'
    };
    return dashboardMap[roleId] || '/role-selection';
  };

  const handleSelectSchool = (schoolId) => {
    selectSchool(schoolId);
    
    // If user already has a role, go directly to their dashboard
    if (user) {
      // Use the specific roleId (e.g., 'head_master', 'ceo') or adminType for dashboard routing
      // user.roleId holds the specific role from login, user.role holds the base role ('admin','teacher')
      const specificRoleId = user.adminType || user.roleId || user.role;
      const dashboardPath = getRoleDashboard(specificRoleId);
      navigate(dashboardPath);
    } else {
      // If no role yet (just registered), go to role selection
      navigate('/role-selection');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md sticky top-0 z-40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-white">EduPlus Admin</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                Back to Home
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 font-medium"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">Select Your School Type</h1>
          <p className="text-xl text-blue-100">Choose the school level that matches your institution</p>
          
          {/* Role-based access information */}
          {user && user.role && (
            <div className="mt-6 inline-block bg-blue-500/20 backdrop-blur-md border border-blue-300/30 rounded-lg px-6 py-3">
              <p className="text-blue-100 text-sm">
                Logged in as: <span className="font-semibold text-white">{getRoleName()}</span>
                {!hasUnrestrictedAccess && (
                  <span className="ml-2 text-blue-200">
                    • Viewing {availableSchools.length} available school type{availableSchools.length !== 1 ? 's' : ''}
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Show message if no schools available */}
        {availableSchools.length === 0 && (
          <div className="bg-yellow-500/20 border border-yellow-300/30 rounded-xl p-8 mb-8 flex items-start gap-4">
            <AlertCircle className="text-yellow-300 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-yellow-100 mb-2">No Available Schools</h3>
              <p className="text-yellow-100/80">
                Your role ({getRoleName()}) is not configured to access any school types. 
                Please contact your administrator.
              </p>
            </div>
          </div>
        )}

        {/* School Cards Grid */}
        {availableSchools.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {availableSchools.map((school) => {
              const Icon = school.icon;
            return (
              <button
                key={school.id}
                onClick={() => handleSelectSchool(school.id)}
                className="group relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105"
              >
                {/* Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${school.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                {/* Content */}
                <div className="relative p-8 text-left h-full flex flex-col">
                  <div className={`w-16 h-16 bg-gradient-to-br ${school.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={32} className="text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{school.name}</h3>
                  <p className="text-sm text-blue-100 mb-6 flex-grow">{school.description}</p>

                  {/* Classes Preview */}
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-blue-200 mb-2">Classes:</p>
                    <div className="flex flex-wrap gap-2">
                      {school.classes.slice(0, 3).map((cls) => (
                        <span
                          key={cls}
                          className="px-2 py-1 text-xs bg-white/20 text-white rounded-md"
                        >
                          {cls}
                        </span>
                      ))}
                      {school.classes.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-white/20 text-white rounded-md">
                          +{school.classes.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-4 border-t border-white/10 group-hover:border-white/30 transition-colors">
                    <span className="inline-block text-blue-300 font-semibold text-sm group-hover:text-blue-200 transition-colors">
                      Select School →
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
            </div>
        )}

        {/* Information Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4">
              Customized
            </div>
            <p className="text-blue-100">
              Each school type has customized class structures and curriculum settings tailored to its needs.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
              Flexible
            </div>
            <p className="text-blue-100">
              Switch between school types or manage multiple school levels within the same system.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-4">
              Efficient
            </div>
            <p className="text-blue-100">
              Role-based access ensures administrators, teachers, and parents see relevant information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolSelection;
