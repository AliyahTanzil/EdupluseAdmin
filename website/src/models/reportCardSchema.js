/**
 * Report Card Data Model & Schema
 * 
 * Scalable schema for:
 * - Subjects & Term results
 * - Scores (test1, test2, mean, rank)
 * - Ratings (cognitive, affective, psychomotor)
 * - Attendance (On Time, Late, Absent)
 * - Summary (Total Score, Average, Position, Performance remark)
 * 
 * Compatible with MongoDB / Firestore / SQL
 */

// ─── MongoDB / Firestore Schema Shape ─────────────────────────────────

export const ReportCardSchema = {
  // --- Student Info ---
  studentId: '',          // Reference to Students collection
  studentName: '',
  admissionNo: '',
  class: '',              // e.g. "JSS 3A"
  section: '',
  gender: '',
  dateOfBirth: '',
  passportUrl: '',        // Student photo

  // --- School Info ---
  schoolId: '',
  schoolName: '',
  schoolAddress: '',
  schoolLogo: '',
  schoolMotto: '',
  schoolPhone: '',
  schoolEmail: '',

  // --- Academic Period ---
  academicYear: '',       // e.g. "2025/2026"
  currentTerm: 1,         // 1, 2, or 3

  // --- Subject Results (all 3 terms) ---
  subjects: [
    {
      subjectId: '',
      subjectName: '',     // e.g. "English Language"
      terms: {
        1: { test1: 0, test2: 0, mean: 0, rank: 0 },
        2: { test1: 0, test2: 0, mean: 0, rank: 0 },
        3: { test1: 0, test2: 0, mean: 0, rank: 0 },
      },
    },
  ],

  // --- Performance Ratings (per term, scale 1-5 or A-E) ---
  ratings: {
    cognitive: {
      1: { punctuality: '', attentiveness: '', assignment: '', classwork: '', testPrep: '' },
      2: { punctuality: '', attentiveness: '', assignment: '', classwork: '', testPrep: '' },
      3: { punctuality: '', attentiveness: '', assignment: '', classwork: '', testPrep: '' },
    },
    affective: {
      1: { neatness: '', politeness: '', honesty: '', teamwork: '', leadership: '' },
      2: { neatness: '', politeness: '', honesty: '', teamwork: '', leadership: '' },
      3: { neatness: '', politeness: '', honesty: '', teamwork: '', leadership: '' },
    },
    psychomotor: {
      1: { sports: '', handwriting: '', drawing: '', crafts: '', verbal: '' },
      2: { sports: '', handwriting: '', drawing: '', crafts: '', verbal: '' },
      3: { sports: '', handwriting: '', drawing: '', crafts: '', verbal: '' },
    },
  },

  // --- Attendance (per term) ---
  attendance: {
    1: { totalDays: 0, onTime: 0, late: 0, absent: 0 },
    2: { totalDays: 0, onTime: 0, late: 0, absent: 0 },
    3: { totalDays: 0, onTime: 0, late: 0, absent: 0 },
  },

  // --- Summary (per term) ---
  summary: {
    1: { totalScore: 0, maxPossible: 0, average: 0, position: 0, totalStudents: 0, performanceRemark: '', overallGrade: '' },
    2: { totalScore: 0, maxPossible: 0, average: 0, position: 0, totalStudents: 0, performanceRemark: '', overallGrade: '' },
    3: { totalScore: 0, maxPossible: 0, average: 0, position: 0, totalStudents: 0, performanceRemark: '', overallGrade: '' },
  },

  // --- Signatures ---
  classTeacherRemark: '',
  principalRemark: '',
  classTeacherSignature: '',
  principalSignature: '',
  parentSignature: '',

  // --- Metadata ---
  createdAt: '',
  updatedAt: '',
  generatedBy: '',        // userId of who generated the report
};


// ─── Example Data for One Student ──────────────────────────────────────

export const exampleReportCard = {
  studentId: 'STU-001',
  studentName: 'Aliyah Tanzil',
  admissionNo: 'ADM/2024/0042',
  class: 'SSS 2A',
  section: 'Science',
  gender: 'Female',
  dateOfBirth: '2008-03-15',
  passportUrl: '',

  schoolId: 'SCH-001',
  schoolName: 'EDUPLUS INTERNATIONAL ACADEMY',
  schoolAddress: '12 Education Lane, Victoria Island, Lagos',
  schoolLogo: '',
  schoolMotto: 'Knowledge is Power — Excellence in Education',
  schoolPhone: '+234 801 234 5678',
  schoolEmail: 'info@eduplusacademy.edu',

  academicYear: '2025/2026',
  currentTerm: 1,

  subjects: [
    {
      subjectId: 'ENG',
      subjectName: 'English Language',
      terms: {
        1: { test1: 18, test2: 16, mean: 17, rank: 3 },
        2: { test1: 15, test2: 17, mean: 16, rank: 5 },
        3: { test1: 19, test2: 18, mean: 18.5, rank: 2 },
      },
    },
    {
      subjectId: 'MTH',
      subjectName: 'Mathematics',
      terms: {
        1: { test1: 20, test2: 19, mean: 19.5, rank: 1 },
        2: { test1: 18, test2: 20, mean: 19, rank: 1 },
        3: { test1: 17, test2: 18, mean: 17.5, rank: 2 },
      },
    },
    {
      subjectId: 'BIO',
      subjectName: 'Biology',
      terms: {
        1: { test1: 15, test2: 14, mean: 14.5, rank: 8 },
        2: { test1: 16, test2: 15, mean: 15.5, rank: 7 },
        3: { test1: 18, test2: 17, mean: 17.5, rank: 4 },
      },
    },
    {
      subjectId: 'CHM',
      subjectName: 'Chemistry',
      terms: {
        1: { test1: 17, test2: 16, mean: 16.5, rank: 4 },
        2: { test1: 14, test2: 16, mean: 15, rank: 6 },
        3: { test1: 16, test2: 18, mean: 17, rank: 3 },
      },
    },
    {
      subjectId: 'PHY',
      subjectName: 'Physics',
      terms: {
        1: { test1: 16, test2: 18, mean: 17, rank: 3 },
        2: { test1: 17, test2: 15, mean: 16, rank: 4 },
        3: { test1: 15, test2: 16, mean: 15.5, rank: 6 },
      },
    },
    {
      subjectId: 'FMT',
      subjectName: 'Further Mathematics',
      terms: {
        1: { test1: 19, test2: 20, mean: 19.5, rank: 1 },
        2: { test1: 20, test2: 19, mean: 19.5, rank: 1 },
        3: { test1: 18, test2: 20, mean: 19, rank: 1 },
      },
    },
    {
      subjectId: 'ENG_SCI',
      subjectName: 'Engineering Science',
      terms: {
        1: { test1: 14, test2: 15, mean: 14.5, rank: 9 },
        2: { test1: 13, test2: 14, mean: 13.5, rank: 10 },
        3: { test1: 16, test2: 15, mean: 15.5, rank: 7 },
      },
    },
    {
      subjectId: 'GEO',
      subjectName: 'Geography',
      terms: {
        1: { test1: 12, test2: 14, mean: 13, rank: 11 },
        2: { test1: 15, test2: 13, mean: 14, rank: 9 },
        3: { test1: 14, test2: 16, mean: 15, rank: 8 },
      },
    },
    {
      subjectId: 'AGR',
      subjectName: 'Agricultural Science',
      terms: {
        1: { test1: 16, test2: 15, mean: 15.5, rank: 6 },
        2: { test1: 17, test2: 16, mean: 16.5, rank: 3 },
        3: { test1: 15, test2: 17, mean: 16, rank: 5 },
      },
    },
    {
      subjectId: 'TD',
      subjectName: 'Technical Drawing',
      terms: {
        1: { test1: 18, test2: 17, mean: 17.5, rank: 2 },
        2: { test1: 16, test2: 18, mean: 17, rank: 2 },
        3: { test1: 19, test2: 17, mean: 18, rank: 2 },
      },
    },
    {
      subjectId: 'PE',
      subjectName: 'Physical Education',
      terms: {
        1: { test1: 20, test2: 19, mean: 19.5, rank: 1 },
        2: { test1: 19, test2: 20, mean: 19.5, rank: 1 },
        3: { test1: 20, test2: 20, mean: 20, rank: 1 },
      },
    },
    {
      subjectId: 'CHN',
      subjectName: 'Chinese',
      terms: {
        1: { test1: 10, test2: 12, mean: 11, rank: 15 },
        2: { test1: 12, test2: 11, mean: 11.5, rank: 14 },
        3: { test1: 13, test2: 14, mean: 13.5, rank: 11 },
      },
    },
  ],

  ratings: {
    cognitive: {
      1: { punctuality: 4, attentiveness: 5, assignment: 4, classwork: 5, testPrep: 4 },
      2: { punctuality: 4, attentiveness: 4, assignment: 5, classwork: 4, testPrep: 4 },
      3: { punctuality: 5, attentiveness: 5, assignment: 5, classwork: 5, testPrep: 5 },
    },
    affective: {
      1: { neatness: 5, politeness: 5, honesty: 4, teamwork: 4, leadership: 3 },
      2: { neatness: 4, politeness: 5, honesty: 5, teamwork: 5, leadership: 4 },
      3: { neatness: 5, politeness: 5, honesty: 5, teamwork: 5, leadership: 5 },
    },
    psychomotor: {
      1: { sports: 4, handwriting: 3, drawing: 4, crafts: 3, verbal: 5 },
      2: { sports: 5, handwriting: 4, drawing: 4, crafts: 4, verbal: 5 },
      3: { sports: 5, handwriting: 4, drawing: 5, crafts: 4, verbal: 5 },
    },
  },

  attendance: {
    1: { totalDays: 65, onTime: 58, late: 5, absent: 2 },
    2: { totalDays: 60, onTime: 52, late: 6, absent: 2 },
    3: { totalDays: 62, onTime: 57, late: 4, absent: 1 },
  },

  summary: {
    1: { totalScore: 195, maxPossible: 240, average: 81.3, position: 3, totalStudents: 45, performanceRemark: 'Very Good', overallGrade: 'B' },
    2: { totalScore: 187, maxPossible: 240, average: 77.9, position: 5, totalStudents: 45, performanceRemark: 'Good', overallGrade: 'C' },
    3: { totalScore: 203, maxPossible: 240, average: 84.6, position: 2, totalStudents: 45, performanceRemark: 'Excellent', overallGrade: 'A' },
  },

  classTeacherRemark: '',
  principalRemark: '',
  classTeacherSignature: '',
  principalSignature: '',
  parentSignature: '',

  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  generatedBy: 'SYSTEM',
};


// ─── Rating Scale Legend ───────────────────────────────────────────────

export const RATING_SCALE = [
  { value: 5, label: 'Excellent' },
  { value: 4, label: 'Very Good' },
  { value: 3, label: 'Good' },
  { value: 2, label: 'Fair' },
  { value: 1, label: 'Poor' },
];

export const RATING_LABELS = {
  cognitive: {
    punctuality: 'Punctuality',
    attentiveness: 'Attentiveness',
    assignment: 'Assignment Completion',
    classwork: 'Classwork',
    testPrep: 'Test Preparation',
  },
  affective: {
    neatness: 'Neatness',
    politeness: 'Politeness',
    honesty: 'Honesty',
    teamwork: 'Teamwork',
    leadership: 'Leadership',
  },
  psychomotor: {
    sports: 'Sports / Games',
    handwriting: 'Handwriting',
    drawing: 'Drawing / Painting',
    crafts: 'Crafts',
    verbal: 'Verbal Fluency',
  },
};
