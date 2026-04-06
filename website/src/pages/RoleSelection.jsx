import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchool } from '../contexts/SchoolContext';
import { useAuth } from '../contexts/AuthContext';
import {
  USER_TYPES,
  TEACHER_ROLES,
  ADMIN_ROLES,
  ROLE_CATEGORIES,
  ROLE_SUBCATEGORIES,
  SCHOOL_LEVEL_INFO,
  getTeacherRolesForCategory,
  getSuperAdminRolesForSchool,
  getOrdinaryAdminRoles
} from '../config/rbac';
import {
  Users,
  BarChart3,
  BookOpen,
  DollarSign,
  GraduationCap,
  Shield,
  ChevronRight,
  ArrowLeft,
  Briefcase,
  Crown,
  LogOut
} from 'lucide-react';

const RoleSelection = () => {
  const navigate = useNavigate();
  const { schoolType, userType } = useSchool();
  const { selectRole, logout } = useAuth();
  const [step, setStep] = useState(1); // Step 1: Category, Step 2: Specific Role
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if school/type not selected
  useEffect(() => {
    if (!schoolType || !userType) {
      navigate('/school-selection');
    }
  }, [schoolType, userType, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  // Prevent rendering if data not available yet
  if (!schoolType || !userType) {
    return null;
  }

  const schoolInfo = SCHOOL_LEVEL_INFO[schoolType];

  const getRoleIcon = (roleId) => {
    const iconProps = { className: 'w-12 h-12' };
    
    switch (roleId) {
      case 'class_master':
      case 'head_of_department':
        return <GraduationCap {...iconProps} className='w-12 h-12 text-blue-600' />;
      case 'ordinary_teacher':
        return <BookOpen {...iconProps} className='w-12 h-12 text-green-600' />;
      case 'ceo':
        return <Crown {...iconProps} className='w-12 h-12 text-red-600' />;
      case 'head_master':
      case 'principal':
      case 'vice_principal':
        return <Shield {...iconProps} className='w-12 h-12 text-purple-600' />;
      case 'secretary':
        return <Briefcase {...iconProps} className='w-12 h-12 text-indigo-600' />;
      case 'treasurer':
        return <DollarSign {...iconProps} className='w-12 h-12 text-yellow-600' />;
      default:
        return <Users {...iconProps} />;
    }
  };

  const getRoleColor = (roleId) => {
    switch (roleId) {
      case 'class_master':
      case 'head_of_department':
        return 'from-blue-50 to-blue-100';
      case 'ordinary_teacher':
        return 'from-green-50 to-green-100';
      case 'ceo':
        return 'from-red-50 to-red-100';
      case 'head_master':
      case 'principal':
      case 'vice_principal':
        return 'from-purple-50 to-purple-100';
      case 'secretary':
        return 'from-indigo-50 to-indigo-100';
      case 'treasurer':
        return 'from-yellow-50 to-yellow-100';
      default:
        return 'from-gray-50 to-gray-100';
    }
  };

  const handleSelectRole = async (role) => {
    setSelectedRole(role.id);
    setIsSubmitting(true);
    
    try {
      await selectRole(role);
      
      // Map role IDs to their specific dashboard routes
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
      
      const dashboardPath = dashboardMap[role.id] || '/dashboard';
      navigate(dashboardPath);
    } catch (error) {
      console.error('Error selecting role:', error);
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setSelectedRole(null);
    } else {
      navigate('/school-selection');
    }
  };

  const getAvailableCategories = () => {
    if (userType === USER_TYPES.TEACHER) {
      return [ROLE_CATEGORIES.TEACHER];
    } else if (userType === USER_TYPES.ADMIN) {
      return [ROLE_CATEGORIES.ADMIN_SUPER, ROLE_CATEGORIES.ADMIN_ORDINARY];
    }
    return [];
  };

  const getRolesForCategory = (category) => {
    if (category === ROLE_CATEGORIES.TEACHER) {
      return Object.values(TEACHER_ROLES);
    } else if (category === ROLE_CATEGORIES.ADMIN_SUPER) {
      return getSuperAdminRolesForSchool(schoolType);
    } else if (category === ROLE_CATEGORIES.ADMIN_ORDINARY) {
      return getOrdinaryAdminRoles();
    }
    return [];
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case ROLE_CATEGORIES.TEACHER:
        return <BookOpen className='w-8 h-8' />;
      case ROLE_CATEGORIES.ADMIN_SUPER:
        return <Crown className='w-8 h-8' />;
      case ROLE_CATEGORIES.ADMIN_ORDINARY:
        return <Briefcase className='w-8 h-8' />;
      default:
        return <Users className='w-8 h-8' />;
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case ROLE_CATEGORIES.TEACHER:
        return 'Teacher';
      case ROLE_CATEGORIES.ADMIN_SUPER:
        return 'Super Admin';
      case ROLE_CATEGORIES.ADMIN_ORDINARY:
        return 'Ordinary Admin';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8'>
      {/* Header */}
      <div className='max-w-4xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <button
            onClick={handleBack}
            className='flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors'
          >
            <ArrowLeft className='w-5 h-5' />
            <span>Back</span>
          </button>
          <button
            onClick={handleLogout}
            className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 font-medium'
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            {step === 1 ? 'Select Your Role Category' : 'Choose Your Specific Role'}
          </h1>
          <p className='text-lg text-gray-600 mb-2'>
            {schoolInfo.name}
          </p>
          <p className='text-sm text-gray-500'>
            Step {step} of 2
            {step === 2 && ` - ${getCategoryLabel(selectedCategory)}`}
          </p>
        </div>

        {/* Step 1: Category Selection */}
        {step === 1 && (
          <div className='grid md:grid-cols-3 gap-6 mb-8'>
            {getAvailableCategories().map((category) => {
              const categoryRoles = getRolesForCategory(category);
              return (
                <div
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setStep(2);
                  }}
                  className={`
                    relative cursor-pointer transform transition-all duration-300 ease-out
                    hover:scale-105
                  `}
                >
                  <div
                    className={`
                      bg-gradient-to-br from-white to-gray-50
                      rounded-lg p-8 shadow-lg hover:shadow-xl
                      border-2 border-gray-200 hover:border-indigo-400
                      transition-all duration-300
                    `}
                  >
                    {/* Icon */}
                    <div className='flex justify-center mb-6 text-indigo-600'>
                      {getCategoryIcon(category)}
                    </div>

                    {/* Category Name */}
                    <h3 className='text-2xl font-bold text-gray-900 text-center mb-4'>
                      {getCategoryLabel(category)}
                    </h3>

                    {/* Number of roles */}
                    <p className='text-sm text-gray-600 text-center mb-6'>
                      {categoryRoles.length} role{categoryRoles.length !== 1 ? 's' : ''} available
                    </p>

                    {/* Role List Preview */}
                    <div className='mb-6 bg-gray-50 rounded p-4'>
                      <ul className='space-y-2'>
                        {categoryRoles.map((role) => (
                          <li key={role.id} className='text-sm text-gray-600 flex items-center gap-2'>
                            <span className='w-2 h-2 bg-indigo-600 rounded-full'></span>
                            {role.name}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Arrow Button */}
                    <button
                      className='
                        w-full py-3 px-4 rounded-lg font-semibold
                        bg-indigo-600 text-white hover:bg-indigo-700
                        flex items-center justify-center gap-2
                        transition-all duration-300
                      '
                    >
                      <span>Select Category</span>
                      <ChevronRight className='w-5 h-5' />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Step 2: Specific Role Selection */}
        {step === 2 && (
          <div>
            <div className='grid md:grid-cols-2 gap-6 mb-8'>
              {getRolesForCategory(selectedCategory).map((role) => (
            <div
              key={role.id}
              onClick={() => !isSubmitting && handleSelectRole(role)}
              className={`
                relative cursor-pointer transform transition-all duration-300 ease-out
                ${selectedRole === role.id ? 'scale-105 ring-4 ring-indigo-400' : 'hover:scale-102'}
                ${isSubmitting && selectedRole !== role.id ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div
                className={`
                  bg-gradient-to-br ${getRoleColor(role.id)}
                  rounded-lg p-8 shadow-lg hover:shadow-xl
                  border-2 border-transparent hover:border-indigo-200
                  transition-all duration-300
                `}
              >
                {/* Badge for Super Admin */}
                {role.isSuperAdmin && (
                  <div className='absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold'>
                    Super Admin
                  </div>
                )}

                {/* Icon */}
                <div className='flex justify-center mb-6'>
                  {getRoleIcon(role.id)}
                </div>

                {/* Role Name */}
                <h3 className='text-xl font-bold text-gray-900 text-center mb-2'>
                  {role.name}
                </h3>

                {/* Description */}
                <p className='text-sm text-gray-600 text-center mb-6'>
                  {role.description}
                </p>

                {/* Permissions Preview */}
                <div className='mb-6 bg-white bg-opacity-70 rounded p-4'>
                  <p className='text-xs font-semibold text-gray-700 mb-3'>
                    Key Permissions:
                  </p>
                  <ul className='space-y-2'>
                    {role.permissions.slice(0, 3).map((permission, idx) => (
                      <li key={idx} className='text-xs text-gray-600 flex items-start gap-2'>
                        <span className='text-indigo-600 mt-1'>•</span>
                        <span className='capitalize'>{permission.replace(/_/g, ' ')}</span>
                      </li>
                    ))}
                    {role.permissions.length > 3 && (
                      <li className='text-xs text-gray-500 italic'>
                        + {role.permissions.length - 3} more permissions
                      </li>
                    )}
                  </ul>
                </div>

                {/* Select Button */}
                <button
                  disabled={isSubmitting && selectedRole !== role.id}
                  className={`
                    w-full py-2 px-4 rounded-lg font-semibold
                    flex items-center justify-center gap-2
                    transition-all duration-300
                    ${selectedRole === role.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-indigo-600 hover:bg-indigo-50 border-2 border-indigo-200'
                    }
                    ${isSubmitting && selectedRole !== role.id
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                    }
                  `}
                >
                  <span>
                    {isSubmitting && selectedRole === role.id ? 'Confirming...' : 'Confirm Role'}
                  </span>
                  {selectedRole !== role.id && <ChevronRight className='w-4 h-4' />}
                </button>
              </div>
            </div>
              ))}
            </div>

            {/* Info Box */}
            <div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-600'>
              <h4 className='font-semibold text-gray-900 mb-3 flex items-center gap-2'>
                <BarChart3 className='w-5 h-5 text-indigo-600' />
                About Your Role
              </h4>
              <p className='text-sm text-gray-600'>
                Each role comes with specific permissions and access levels tailored to your responsibilities.
                Your dashboard will display features relevant to your role. You can request role changes from your
                {getRolesForCategory(selectedCategory).some(r => r.isSuperAdmin) ? ' administrator' : ' Head Master/Principal'}.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSelection;
