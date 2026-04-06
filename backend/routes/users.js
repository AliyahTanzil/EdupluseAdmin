const express = require('express');
const router = express.Router();
const { getDatabase } = require('../database/local');
const { requirePermission, requireRole } = require('../middleware/auth');

const db = getDatabase();

/**
 * GET /api/users
 * Get all users with filtering and pagination
 * Query params: role, school, limit, offset, search
 */
router.get('/', (req, res) => {
  try {
    const { role, school, limit = 20, offset = 0, search = '' } = req.query;
    const user = req.user;

    // Build where clause
    let whereConditions = ['1=1'];
    let params = [];

    // Filter by role if provided
    if (role) {
      whereConditions.push('role = ?');
      params.push(role);
    }

    // Filter by search term
    if (search) {
      whereConditions.push("(full_name LIKE ? OR email LIKE ?)");
      params.push(`%${search}%`, `%${search}%`);
    }

    // Filter by school if user is not CEO
    if (user.adminType !== 'ceo' && school) {
      whereConditions.push("assigned_schools LIKE ?");
      params.push(`%${school}%`);
    }

    const whereClause = whereConditions.join(' AND ');

    // Get total count
    const countStmt = db.prepare(`
      SELECT COUNT(*) as total FROM users WHERE ${whereClause}
    `);
    const { total } = countStmt.get(...params);

    // Get paginated results
    const stmt = db.prepare(`
      SELECT id, email, full_name, role, admin_type, assigned_schools, 
             is_super_user, is_suspended, created_at 
      FROM users 
      WHERE ${whereClause}
      LIMIT ? OFFSET ?
    `);

    const users = stmt.all(...params, limit, offset).map(u => ({
      id: u.id,
      email: u.email,
      fullName: u.full_name,
      role: u.role,
      adminType: u.admin_type,
      assignedSchools: u.assigned_schools ? JSON.parse(u.assigned_schools) : [],
      isSuperUser: u.is_super_user,
      isSuspended: u.is_suspended,
      createdAt: u.created_at,
    }));

    res.json({
      success: true,
      data: users,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
    });
  }
});

/**
 * GET /api/users/:userId
 * Get specific user details
 */
router.get('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const user = req.user;

    // Check permission
    if (user.adminType !== 'ceo' && user.id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only view your own profile',
      });
    }

    const stmt = db.prepare(`
      SELECT id, email, full_name, role, admin_type, assigned_schools,
             is_super_user, is_suspended, created_at, updated_at
      FROM users WHERE id = ?
    `);

    const userData = stmt.get(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        fullName: userData.full_name,
        role: userData.role,
        adminType: userData.admin_type,
        assignedSchools: userData.assigned_schools ? JSON.parse(userData.assigned_schools) : [],
        isSuperUser: userData.is_super_user,
        isSuspended: userData.is_suspended,
        createdAt: userData.created_at,
        updatedAt: userData.updated_at,
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
    });
  }
});

/**
 * POST /api/users
 * Create new user (Admin only)
 */
router.post('/', (req, res) => {
  try {
    const { email, password, fullName, role, adminType, assignedSchools = [] } = req.body;
    const user = req.user;

    // Validate input
    if (!email || !password || !fullName || !role) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Email already registered',
      });
    }

    // Hash password
    const bcrypt = require('bcrypt');
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Generate JWT token
    const jwt = require('jsonwebtoken');
    const newUserId = require('uuid').v4();
    const token = jwt.sign(
      { userId: newUserId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Insert user
    const stmt = db.prepare(`
      INSERT INTO users (
        id, email, password, full_name, role, admin_type, 
        assigned_schools, is_super_user, permissions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const permissions = getPermissionsByRole(role);
    stmt.run(
      newUserId,
      email,
      hashedPassword,
      fullName,
      role,
      adminType || 'admin',
      JSON.stringify(assignedSchools),
      adminType === 'ceo' ? 1 : 0,
      JSON.stringify(permissions)
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: newUserId,
        email,
        fullName,
        role,
        adminType,
        assignedSchools,
      },
      token,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
    });
  }
});

/**
 * PUT /api/users/:userId
 * Update user
 */
router.put('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { fullName, email, role, adminType, assignedSchools } = req.body;
    const user = req.user;

    // Check permission
    if (user.adminType !== 'ceo' && user.id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only update your own profile',
      });
    }

    // Get current user
    const currentUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Update user
    const updateFields = [];
    const updateParams = [];

    if (fullName) {
      updateFields.push('full_name = ?');
      updateParams.push(fullName);
    }

    if (email && email !== currentUser.email) {
      // Check if new email is already taken
      const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'Email already in use',
        });
      }
      updateFields.push('email = ?');
      updateParams.push(email);
    }

    if (role && user.adminType === 'ceo') {
      updateFields.push('role = ?');
      updateParams.push(role);
    }

    if (assignedSchools && user.adminType === 'ceo') {
      updateFields.push('assigned_schools = ?');
      updateParams.push(JSON.stringify(assignedSchools));
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update',
      });
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateParams.push(userId);

    const stmt = db.prepare(`
      UPDATE users SET ${updateFields.join(', ')} WHERE id = ?
    `);

    stmt.run(...updateParams);

    // Fetch updated user
    const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

    res.json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.full_name,
        role: updatedUser.role,
        adminType: updatedUser.admin_type,
        assignedSchools: updatedUser.assigned_schools ? JSON.parse(updatedUser.assigned_schools) : [],
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
    });
  }
});

/**
 * DELETE /api/users/:userId
 * Soft delete user
 */
router.delete('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const user = req.user;

    // Only CEO can delete users
    if (user.adminType !== 'ceo') {
      return res.status(403).json({
        success: false,
        error: 'Only CEO admin can delete users',
      });
    }

    // Soft delete
    const stmt = db.prepare(`
      UPDATE users SET is_suspended = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `);

    stmt.run(userId);

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user',
    });
  }
});

/**
 * Helper function to get permissions by role
 */
function getPermissionsByRole(role) {
  const rolePermissions = {
    'student': ['view_own_grades', 'view_own_attendance', 'view_assignments'],
    'teacher': ['manage_grades', 'manage_attendance', 'view_classes', 'manage_assignments'],
    'parent': ['view_child_grades', 'view_child_attendance', 'message_teacher'],
    'admin': ['manage_users', 'manage_classes', 'manage_schools', 'view_reports'],
  };

  return rolePermissions[role] || [];
}

module.exports = router;
