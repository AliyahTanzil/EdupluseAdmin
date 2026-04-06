const express = require('express');
const router = express.Router();
const { getDatabase } = require('../database/local');
const { v4: uuidv4 } = require('uuid');

const db = getDatabase();

/**
 * GET /api/schools
 * Get schools based on user's access level
 */
router.get('/', (req, res) => {
  try {
    const user = req.user;
    const { limit = 20, offset = 0, search = '' } = req.query;

    let stmt;
    let params = [];

    if (user.adminType === 'ceo' || user.isSuperUser) {
      // CEO can see all schools
      const whereClause = search ? "WHERE name LIKE ? OR code LIKE ?" : "WHERE 1=1";
      if (search) {
        params = [`%${search}%`, `%${search}%`];
      }

      stmt = db.prepare(`
        SELECT * FROM schools ${whereClause} LIMIT ? OFFSET ?
      `);
      const schools = stmt.all(...params, limit, offset);

      const countStmt = db.prepare(`SELECT COUNT(*) as total FROM schools ${whereClause}`);
      const { total } = countStmt.get(...params);

      return res.json({
        success: true,
        data: schools.map(formatSchool),
        total,
        page: Math.floor(offset / limit) + 1,
        limit,
      });
    }

    // Other users can only see their assigned schools
    const assignedSchools = user.assignedSchools || [];
    if (assignedSchools.length === 0) {
      return res.json({
        success: true,
        data: [],
        total: 0,
        page: 1,
        limit,
      });
    }

    const placeholders = assignedSchools.map(() => '?').join(',');
    stmt = db.prepare(`
      SELECT * FROM schools WHERE school_level IN (${placeholders}) LIMIT ? OFFSET ?
    `);

    const schools = stmt.all(...assignedSchools, limit, offset);
    const countStmt = db.prepare(`
      SELECT COUNT(*) as total FROM schools WHERE school_level IN (${placeholders})
    `);
    const { total } = countStmt.get(...assignedSchools);

    res.json({
      success: true,
      data: schools.map(formatSchool),
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
    });
  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch schools',
    });
  }
});

/**
 * GET /api/schools/:schoolId
 * Get school details
 */
router.get('/:schoolId', (req, res) => {
  try {
    const { schoolId } = req.params;
    const user = req.user;

    const stmt = db.prepare('SELECT * FROM schools WHERE id = ?');
    const school = stmt.get(schoolId);

    if (!school) {
      return res.status(404).json({
        success: false,
        error: 'School not found',
      });
    }

    // Check if user has access to this school
    if (user.adminType !== 'ceo' && !user.assignedSchools.includes(school.school_level)) {
      return res.status(403).json({
        success: false,
        error: 'You do not have access to this school',
      });
    }

    res.json({
      success: true,
      school: formatSchool(school),
    });
  } catch (error) {
    console.error('Error fetching school:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch school',
    });
  }
});

/**
 * POST /api/schools
 * Create new school (CEO only)
 */
router.post('/', (req, res) => {
  try {
    const user = req.user;

    // Only CEO can create schools
    if (user.adminType !== 'ceo') {
      return res.status(403).json({
        success: false,
        error: 'Only CEO admin can create schools',
      });
    }

    const {
      name,
      code,
      schoolLevel,
      address,
      city,
      state,
      country,
      phone,
      email,
      website,
      principalName,
      totalStudents = 0,
      totalTeachers = 0,
    } = req.body;

    // Validate required fields
    if (!name || !code || !schoolLevel) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    // Check if code already exists
    const existing = db.prepare('SELECT id FROM schools WHERE code = ?').get(code);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'School code already exists',
      });
    }

    const schoolId = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO schools (
        id, name, code, school_level, address, city, state, country,
        phone, email, website, principal_name, total_students, total_teachers,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      schoolId,
      name,
      code,
      schoolLevel,
      address,
      city,
      state,
      country,
      phone,
      email,
      website,
      principalName,
      totalStudents,
      totalTeachers,
      new Date().toISOString(),
      new Date().toISOString()
    );

    res.status(201).json({
      success: true,
      message: 'School created successfully',
      school: {
        id: schoolId,
        name,
        code,
        schoolLevel,
      },
    });
  } catch (error) {
    console.error('Error creating school:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create school',
    });
  }
});

/**
 * PUT /api/schools/:schoolId
 * Update school (CEO only)
 */
router.put('/:schoolId', (req, res) => {
  try {
    const user = req.user;
    const { schoolId } = req.params;

    // Only CEO can update schools
    if (user.adminType !== 'ceo') {
      return res.status(403).json({
        success: false,
        error: 'Only CEO admin can update schools',
      });
    }

    // Get existing school
    const existingSchool = db.prepare('SELECT * FROM schools WHERE id = ?').get(schoolId);
    if (!existingSchool) {
      return res.status(404).json({
        success: false,
        error: 'School not found',
      });
    }

    const {
      name,
      address,
      city,
      state,
      country,
      phone,
      email,
      website,
      principalName,
      totalStudents,
      totalTeachers,
    } = req.body;

    // Build update query
    const updateFields = [];
    const updateParams = [];

    if (name) {
      updateFields.push('name = ?');
      updateParams.push(name);
    }
    if (address) {
      updateFields.push('address = ?');
      updateParams.push(address);
    }
    if (city) {
      updateFields.push('city = ?');
      updateParams.push(city);
    }
    if (state) {
      updateFields.push('state = ?');
      updateParams.push(state);
    }
    if (country) {
      updateFields.push('country = ?');
      updateParams.push(country);
    }
    if (phone) {
      updateFields.push('phone = ?');
      updateParams.push(phone);
    }
    if (email) {
      updateFields.push('email = ?');
      updateParams.push(email);
    }
    if (website) {
      updateFields.push('website = ?');
      updateParams.push(website);
    }
    if (principalName) {
      updateFields.push('principal_name = ?');
      updateParams.push(principalName);
    }
    if (totalStudents !== undefined) {
      updateFields.push('total_students = ?');
      updateParams.push(totalStudents);
    }
    if (totalTeachers !== undefined) {
      updateFields.push('total_teachers = ?');
      updateParams.push(totalTeachers);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update',
      });
    }

    updateFields.push('updated_at = ?');
    updateParams.push(new Date().toISOString());
    updateParams.push(schoolId);

    const stmt = db.prepare(`
      UPDATE schools SET ${updateFields.join(', ')} WHERE id = ?
    `);

    stmt.run(...updateParams);

    res.json({
      success: true,
      message: 'School updated successfully',
    });
  } catch (error) {
    console.error('Error updating school:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update school',
    });
  }
});

/**
 * DELETE /api/schools/:schoolId
 * Delete school (CEO only)
 */
router.delete('/:schoolId', (req, res) => {
  try {
    const user = req.user;
    const { schoolId } = req.params;

    // Only CEO can delete schools
    if (user.adminType !== 'ceo') {
      return res.status(403).json({
        success: false,
        error: 'Only CEO admin can delete schools',
      });
    }

    const stmt = db.prepare('DELETE FROM schools WHERE id = ?');
    stmt.run(schoolId);

    res.json({
      success: true,
      message: 'School deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting school:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete school',
    });
  }
});

/**
 * Helper function to format school data
 */
function formatSchool(school) {
  return {
    id: school.id,
    name: school.name,
    code: school.code,
    schoolLevel: school.school_level,
    address: school.address,
    city: school.city,
    state: school.state,
    country: school.country,
    phone: school.phone,
    email: school.email,
    website: school.website,
    principalName: school.principal_name,
    totalStudents: school.total_students,
    totalTeachers: school.total_teachers,
    createdAt: school.created_at,
    updatedAt: school.updated_at,
  };
}

module.exports = router;
