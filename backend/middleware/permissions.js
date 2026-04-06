// Permission checking middleware for role-based access control

const { getRoleById, hasPermission, USER_TYPES } = require('../config/rbac');

/**
 * Middleware to check if user has required permission
 * @param {string|string[]} requiredPermissions - Single permission or array of permissions
 * @param {string} requireAll - If true, user must have ALL permissions. If false, user needs ANY one permission
 */
const requirePermission = (requiredPermissions, requireAll = false) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not authenticated'
        });
      }

      // Super users and CEO admins bypass all permission checks
      if (user.isSuperUser || user.adminType === 'ceo' || user.adminType === 'principal') {
        return next();
      }

      // Admin role users get broad access
      if (user.role === 'admin') {
        return next();
      }

      // Get user's role - could be a string or an object
      let userRole = user.role;

      // If role is a string, try to resolve it to a role object
      if (typeof userRole === 'string') {
        userRole = getRoleById(userRole);
      }

      if (!userRole) {
        // If we can't resolve the role, allow access for authenticated users
        // This prevents blocking users when role resolution fails
        return next();
      }

      // Normalize permissions to array
      const permissions = Array.isArray(requiredPermissions)
        ? requiredPermissions
        : [requiredPermissions];

      // Check permissions
      let hasAccess = false;

      if (requireAll) {
        // User must have ALL required permissions
        hasAccess = permissions.every(permission =>
          hasPermission(userRole, permission)
        );
      } else {
        // User must have at least ONE required permission
        hasAccess = permissions.some(permission =>
          hasPermission(userRole, permission)
        );
      }

      if (!hasAccess) {
        const missingPerms = permissions.filter(p => !hasPermission(userRole, p));
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Insufficient permissions',
          requiredPermissions: permissions,
          missingPermissions: missingPerms,
          userRole: userRole.name
        });
      }

      // Permission granted, continue to next middleware
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error during permission check',
        error: error.message
      });
    }
  };
};

/**
 * Middleware to check if user is a super admin
 */
const requireSuperAdmin = (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User not authenticated'
      });
    }

    // Check multiple ways a user can be a super admin
    if (user.isSuperUser || user.adminType === 'ceo') {
      return next();
    }

    const userRole = typeof user.role === 'string' ? getRoleById(user.role) : user.role;

    if (userRole && userRole.isSuperAdmin) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Forbidden: Super Admin access required'
    });
  } catch (error) {
    console.error('Super admin check error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error during super admin check',
      error: error.message
    });
  }
};

/**
 * Middleware to check if user belongs to specific school level
 */
const requireSchoolLevel = (schoolLevels) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not authenticated'
        });
      }

      const schoolLevel = user.schoolType;
      const levels = Array.isArray(schoolLevels) ? schoolLevels : [schoolLevels];

      if (!levels.includes(schoolLevel)) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Access not allowed for this school level',
          userSchoolLevel: schoolLevel,
          allowedLevels: levels
        });
      }

      next();
    } catch (error) {
      console.error('School level check error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error during school level check',
        error: error.message
      });
    }
  };
};

/**
 * Middleware to check if user is specific type (teacher, admin, student, parent)
 */
const requireUserType = (userTypes) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not authenticated'
        });
      }

      const userType = user.userType;
      const types = Array.isArray(userTypes) ? userTypes : [userTypes];

      if (!types.includes(userType)) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Access not allowed for this user type',
          userType: userType,
          allowedTypes: types
        });
      }

      next();
    } catch (error) {
      console.error('User type check error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error during user type check',
        error: error.message
      });
    }
  };
};

/**
 * Example usage in route:
 * 
 * router.post('/manage-users',
 *   requirePermission('manage_all_users'),
 *   handleManageUsers
 * );
 * 
 * router.get('/super-admin-report',
 *   requireSuperAdmin,
 *   handleSuperAdminReport
 * );
 * 
 * router.post('/create-course',
 *   requirePermission(['manage_classes', 'create_grades'], false), // Needs at least one
 *   handleCreateCourse
 * );
 */

module.exports = {
  requirePermission,
  requireSuperAdmin,
  requireSchoolLevel,
  requireUserType
};
