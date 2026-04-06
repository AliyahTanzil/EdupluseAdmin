// filepath: website/src/config/schoolHierarchy.js
/**
 * School Hierarchy Configuration
 * Defines which admin types can access which school levels
 * and what data they can view
 */

export const SCHOOL_LEVELS = {
  PRIMARY: 'primary',
  JUNIOR_SECONDARY: 'junior_secondary',
  SENIOR_SECONDARY: 'senior_secondary'
};

export const ADMIN_TYPES = {
  REGULAR_ADMIN: 'admin',           // Can only see selected school
  PRINCIPAL: 'principal',           // Can see multiple school levels
  CEO: 'ceo',                       // Can see all schools (super admin)
  SECRETARY: 'secretary',           // Can see one school level only
  FINANCE: 'finance'                // Can see all schools (finance only)
};

/**
 * Define which school levels each admin type can access
 */
export const ADMIN_ACCESS_LEVELS = {
  [ADMIN_TYPES.REGULAR_ADMIN]: {
    canViewMultiple: false,
    defaultSchools: [],  // Only sees selected school during creation
    description: 'Can manage only the selected school'
  },
  [ADMIN_TYPES.PRINCIPAL]: {
    canViewMultiple: true,
    defaultSchools: [SCHOOL_LEVELS.JUNIOR_SECONDARY, SCHOOL_LEVELS.SENIOR_SECONDARY],
    description: 'Can manage Junior and Senior Secondary Schools'
  },
  [ADMIN_TYPES.CEO]: {
    canViewMultiple: true,
    defaultSchools: [SCHOOL_LEVELS.PRIMARY, SCHOOL_LEVELS.JUNIOR_SECONDARY, SCHOOL_LEVELS.SENIOR_SECONDARY],
    description: 'Super admin - can manage all schools'
  },
  [ADMIN_TYPES.SECRETARY]: {
    canViewMultiple: false,
    defaultSchools: [],  // Only sees one selected school
    description: 'Can manage one school level (Primary, Junior, or Senior)'
  },
  [ADMIN_TYPES.FINANCE]: {
    canViewMultiple: true,
    defaultSchools: [SCHOOL_LEVELS.PRIMARY, SCHOOL_LEVELS.JUNIOR_SECONDARY, SCHOOL_LEVELS.SENIOR_SECONDARY],
    viewMode: 'finances_only',  // Only sees financial data
    description: 'Can view finances across all schools'
  }
};

/**
 * Get allowed school levels for admin type
 */
export const getAllowedSchoolLevels = (adminType) => {
  const accessConfig = ADMIN_ACCESS_LEVELS[adminType];
  if (!accessConfig) return [];
  return accessConfig.defaultSchools;
};

/**
 * Check if admin can view multiple schools
 */
export const canViewMultipleSchools = (adminType) => {
  const accessConfig = ADMIN_ACCESS_LEVELS[adminType];
  return accessConfig?.canViewMultiple || false;
};

/**
 * Get school options based on admin type
 * Used in dropdown during account creation
 */
export const getSchoolOptionsForAdminType = (adminType) => {
  const schoolOptions = [
    { value: SCHOOL_LEVELS.PRIMARY, label: 'Primary School' },
    { value: SCHOOL_LEVELS.JUNIOR_SECONDARY, label: 'Junior Secondary School' },
    { value: SCHOOL_LEVELS.SENIOR_SECONDARY, label: 'Senior Secondary School' }
  ];

  const allowedLevels = getAllowedSchoolLevels(adminType);

  if (canViewMultipleSchools(adminType)) {
    // Return all schools, but mark which ones are available
    return schoolOptions.map(option => ({
      ...option,
      available: allowedLevels.includes(option.value),
      disabled: !allowedLevels.includes(option.value)
    }));
  } else {
    // Return all schools (admin will select one)
    return schoolOptions;
  }
};

/**
 * Filter visible data based on admin role and assigned schools
 */
export const filterDataByAdminType = (data, adminType, userAssignedSchools = []) => {
  const config = ADMIN_ACCESS_LEVELS[adminType];

  if (!config) return data;

  // Finance admin - show only financial data
  if (adminType === ADMIN_TYPES.FINANCE) {
    return {
      ...data,
      visibleFields: ['finances', 'fees', 'payments', 'budgets'],
      hideFields: ['curriculum', 'attendance_details', 'personal_info']
    };
  }

  // CEO - show all data
  if (adminType === ADMIN_TYPES.CEO) {
    return data;
  }

  // Regular admin, Principal, Secretary - filter by assigned schools
  if (userAssignedSchools.length > 0) {
    return {
      ...data,
      assignedSchools: userAssignedSchools,
      visibleAll: false
    };
  }

  return data;
};

/**
 * Get dashboard view based on admin type
 */
export const getDashboardViewForAdminType = (adminType) => {
  switch (adminType) {
    case ADMIN_TYPES.REGULAR_ADMIN:
      return {
        modules: ['students', 'teachers', 'subjects', 'timetable', 'attendance', 'reports'],
        dataScope: 'single_school'
      };
    case ADMIN_TYPES.PRINCIPAL:
      return {
        modules: ['students', 'teachers', 'subjects', 'timetable', 'attendance', 'reports', 'coordination'],
        dataScope: 'multiple_schools',
        schools: [SCHOOL_LEVELS.JUNIOR_SECONDARY, SCHOOL_LEVELS.SENIOR_SECONDARY]
      };
    case ADMIN_TYPES.CEO:
      return {
        modules: ['students', 'teachers', 'subjects', 'timetable', 'attendance', 'reports', 'system_admin', 'analytics'],
        dataScope: 'all_schools',
        schools: [SCHOOL_LEVELS.PRIMARY, SCHOOL_LEVELS.JUNIOR_SECONDARY, SCHOOL_LEVELS.SENIOR_SECONDARY]
      };
    case ADMIN_TYPES.SECRETARY:
      return {
        modules: ['students', 'teachers', 'attendance', 'reports'],
        dataScope: 'single_school'
      };
    case ADMIN_TYPES.FINANCE:
      return {
        modules: ['finance', 'fees', 'payments', 'budgets', 'reports'],
        dataScope: 'all_schools',
        schools: [SCHOOL_LEVELS.PRIMARY, SCHOOL_LEVELS.JUNIOR_SECONDARY, SCHOOL_LEVELS.SENIOR_SECONDARY],
        viewMode: 'finances_only'
      };
    default:
      return {
        modules: [],
        dataScope: 'none'
      };
  }
};

/**
 * Validate admin type selection based on admin creating account
 */
export const validateAdminTypeSelection = (currentUserAdminType, selectedAdminType) => {
  // CEO can create any type of admin
  if (currentUserAdminType === ADMIN_TYPES.CEO) {
    return true;
  }

  // Regular admins cannot create other admins
  if (currentUserAdminType === ADMIN_TYPES.REGULAR_ADMIN) {
    return false;
  }

  // Other validations as needed
  return true;
};

export default {
  SCHOOL_LEVELS,
  ADMIN_TYPES,
  ADMIN_ACCESS_LEVELS,
  getAllowedSchoolLevels,
  canViewMultipleSchools,
  getSchoolOptionsForAdminType,
  filterDataByAdminType,
  getDashboardViewForAdminType,
  validateAdminTypeSelection
};
