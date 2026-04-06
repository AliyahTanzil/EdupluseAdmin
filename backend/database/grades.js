// Grades Database Functions
// File: backend/database/grades.js

const { v4: uuid } = require('uuid');
const { getDatabase } = require('./local');

// Use getDatabase function to access the shared DB instance
const getLocalDB = () => getDatabase();

/**
 * Insert a new grade record
 * @throws {Error} If validation fails or database error occurs
 */
function insertGrade(gradeData) {
  try {
    if (!gradeData.student_id || !gradeData.subject_id) {
      throw new Error('student_id and subject_id are required');
    }

    if (gradeData.score < 0 || gradeData.score > 100) {
      throw new Error('Score must be between 0 and 100');
    }

    if (!gradeData.term || !gradeData.academic_year) {
      throw new Error('term and academic_year are required');
    }

    const id = uuid();
    const grade = calculateGrade(gradeData.score);
    const now = new Date().toISOString();

    const db = getLocalDB();
    const stmt = db.prepare(`
      INSERT INTO grades (
        id, student_id, subject_id, score, grade, term, academic_year, 
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      gradeData.student_id,
      gradeData.subject_id,
      gradeData.score,
      grade,
      gradeData.term,
      gradeData.academic_year,
      now,
      now
    );

    return { id, ...gradeData, grade, created_at: now, updated_at: now };
  } catch (error) {
    throw new Error(`Failed to insert grade: ${error.message}`);
  }
}

/**
 * Get a single grade record
 */
function getGrade(id) {
  try {
    const db = getLocalDB();
    const stmt = db.prepare('SELECT * FROM grades WHERE id = ?');
    const grade = stmt.get(id);

    if (!grade) {
      throw new Error(`Grade with ID ${id} not found`);
    }

    return grade;
  } catch (error) {
    throw new Error(`Failed to get grade: ${error.message}`);
  }
}

/**
 * Get all grades for a student
 */
function getStudentGrades(studentId, term = null, academicYear = null) {
  try {
    if (!studentId) {
      throw new Error('studentId is required');
    }

    const db = getLocalDB();
    let query = 'SELECT * FROM grades WHERE student_id = ?';
    const params = [studentId];

    if (term) {
      query += ' AND term = ?';
      params.push(term);
    }

    if (academicYear) {
      query += ' AND academic_year = ?';
      params.push(academicYear);
    }

    query += ' ORDER BY created_at DESC';

    const stmt = db.prepare(query);
    return stmt.all(...params);
  } catch (error) {
    throw new Error(`Failed to get student grades: ${error.message}`);
  }
}

/**
 * Get class grades (all students in a class)
 */
function getClassGrades(classId, subjectId = null, term = null) {
  try {
    if (!classId) {
      throw new Error('classId is required');
    }

    const db = getLocalDB();
    let query = `
      SELECT g.*, s.name as student_name, s.admission_number,
             sub.name as subject_name
      FROM grades g
      JOIN students s ON g.student_id = s.id
      JOIN subjects sub ON g.subject_id = sub.id
      WHERE s.class = ?
    `;
    const params = [classId];

    if (subjectId) {
      query += ' AND g.subject_id = ?';
      params.push(subjectId);
    }

    if (term) {
      query += ' AND g.term = ?';
      params.push(term);
    }

    query += ' ORDER BY s.name ASC';

    const stmt = db.prepare(query);
    return stmt.all(...params);
  } catch (error) {
    throw new Error(`Failed to get class grades: ${error.message}`);
  }
}

/**
 * Update a grade
 */
function updateGrade(id, updates) {
  try {
    if (!id) {
      throw new Error('Grade ID is required');
    }

    // Validate score if provided
    if (updates.score !== undefined) {
      if (updates.score < 0 || updates.score > 100) {
        throw new Error('Score must be between 0 and 100');
      }
      updates.grade = calculateGrade(updates.score);
    }

    const db = getLocalDB();
    const existing = db.prepare('SELECT * FROM grades WHERE id = ?').get(id);

    if (!existing) {
      throw new Error(`Grade with ID ${id} not found`);
    }

    const updated = { ...existing, ...updates, updated_at: new Date().toISOString() };

    const keys = Object.keys(updates);
    const values = Object.values(updates);
    values.push(new Date().toISOString());
    values.push(id);

    const updateQuery = keys.map(k => `${k} = ?`).join(', ');
    const stmt = db.prepare(`
      UPDATE grades SET ${updateQuery}, updated_at = ? WHERE id = ?
    `);

    stmt.run(...values);
    return updated;
  } catch (error) {
    throw new Error(`Failed to update grade: ${error.message}`);
  }
}

/**
 * Delete a grade
 */
function deleteGrade(id) {
  try {
    if (!id) {
      throw new Error('Grade ID is required');
    }

    const db = getLocalDB();
    const existing = db.prepare('SELECT * FROM grades WHERE id = ?').get(id);

    if (!existing) {
      throw new Error(`Grade with ID ${id} not found`);
    }

    const stmt = db.prepare('DELETE FROM grades WHERE id = ?');
    stmt.run(id);

    return { success: true, message: 'Grade deleted successfully' };
  } catch (error) {
    throw new Error(`Failed to delete grade: ${error.message}`);
  }
}

/**
 * Calculate letter grade from score
 */
function calculateGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

/**
 * Calculate GPA for a student
 */
function calculateStudentGPA(studentId, term = null, academicYear = null) {
  try {
    if (!studentId) {
      throw new Error('studentId is required');
    }

    const db = getLocalDB();
    let query = `
      SELECT AVG(score) as gpa FROM grades WHERE student_id = ?
    `;
    const params = [studentId];

    if (term) {
      query += ' AND term = ?';
      params.push(term);
    }

    if (academicYear) {
      query += ' AND academic_year = ?';
      params.push(academicYear);
    }

    const stmt = db.prepare(query);
    const result = stmt.get(...params);

    return {
      student_id: studentId,
      gpa: result.gpa ? parseFloat(result.gpa).toFixed(2) : 0,
      term,
      academic_year: academicYear
    };
  } catch (error) {
    throw new Error(`Failed to calculate GPA: ${error.message}`);
  }
}

/**
 * Calculate class average for a subject
 */
function getSubjectClassAverage(subjectId, classId, term = null) {
  try {
    if (!subjectId || !classId) {
      throw new Error('subjectId and classId are required');
    }

    const db = getLocalDB();
    let query = `
      SELECT AVG(g.score) as average, COUNT(g.id) as count
      FROM grades g
      JOIN students s ON g.student_id = s.id
      WHERE g.subject_id = ? AND s.class = ?
    `;
    const params = [subjectId, classId];

    if (term) {
      query += ' AND g.term = ?';
      params.push(term);
    }

    const stmt = db.prepare(query);
    const result = stmt.get(...params);

    return {
      subject_id: subjectId,
      class_id: classId,
      average: result.average ? parseFloat(result.average).toFixed(2) : 0,
      student_count: result.count
    };
  } catch (error) {
    throw new Error(`Failed to calculate class average: ${error.message}`);
  }
}

/**
 * Get grade distribution for a subject
 */
function getGradeDistribution(subjectId, classId = null, term = null) {
  try {
    if (!subjectId) {
      throw new Error('subjectId is required');
    }

    const db = getLocalDB();
    let query = `
      SELECT grade, COUNT(*) as count FROM grades WHERE subject_id = ?
    `;
    const params = [subjectId];

    if (classId) {
      query += ` AND student_id IN (
        SELECT id FROM students WHERE class = ?
      )`;
      params.push(classId);
    }

    if (term) {
      query += ' AND term = ?';
      params.push(term);
    }

    query += ' GROUP BY grade ORDER BY grade DESC';

    const stmt = db.prepare(query);
    return stmt.all(...params);
  } catch (error) {
    throw new Error(`Failed to get grade distribution: ${error.message}`);
  }
}

module.exports = {
  insertGrade,
  getGrade,
  getStudentGrades,
  getClassGrades,
  updateGrade,
  deleteGrade,
  calculateGrade,
  calculateStudentGPA,
  getSubjectClassAverage,
  getGradeDistribution
};
