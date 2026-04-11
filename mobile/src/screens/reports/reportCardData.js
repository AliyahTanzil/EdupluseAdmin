/**
 * Example Report Card Data (React Native)
 * Same shape as the web model for consistency
 */
export const exampleData = {
  studentId: 'STU-001',
  studentName: 'Aliyah Tanzil',
  admissionNo: 'ADM/2024/0042',
  class: 'SSS 2A',
  section: 'Science',
  gender: 'Female',
  dateOfBirth: '2008-03-15',

  schoolName: 'EDUPLUS INTERNATIONAL ACADEMY',
  schoolAddress: '12 Education Lane, Victoria Island, Lagos',
  schoolMotto: 'Knowledge is Power — Excellence in Education',
  schoolPhone: '+234 801 234 5678',
  schoolEmail: 'info@eduplusacademy.edu',

  academicYear: '2025/2026',
  currentTerm: 1,

  subjects: [
    { subjectId: 'ENG', subjectName: 'English Language', terms: { 1: { test1: 18, test2: 16, mean: 17, rank: 3 }, 2: { test1: 15, test2: 17, mean: 16, rank: 5 }, 3: { test1: 19, test2: 18, mean: 18.5, rank: 2 } } },
    { subjectId: 'MTH', subjectName: 'Mathematics', terms: { 1: { test1: 20, test2: 19, mean: 19.5, rank: 1 }, 2: { test1: 18, test2: 20, mean: 19, rank: 1 }, 3: { test1: 17, test2: 18, mean: 17.5, rank: 2 } } },
    { subjectId: 'BIO', subjectName: 'Biology', terms: { 1: { test1: 15, test2: 14, mean: 14.5, rank: 8 }, 2: { test1: 16, test2: 15, mean: 15.5, rank: 7 }, 3: { test1: 18, test2: 17, mean: 17.5, rank: 4 } } },
    { subjectId: 'CHM', subjectName: 'Chemistry', terms: { 1: { test1: 17, test2: 16, mean: 16.5, rank: 4 }, 2: { test1: 14, test2: 16, mean: 15, rank: 6 }, 3: { test1: 16, test2: 18, mean: 17, rank: 3 } } },
    { subjectId: 'PHY', subjectName: 'Physics', terms: { 1: { test1: 16, test2: 18, mean: 17, rank: 3 }, 2: { test1: 17, test2: 15, mean: 16, rank: 4 }, 3: { test1: 15, test2: 16, mean: 15.5, rank: 6 } } },
    { subjectId: 'FMT', subjectName: 'Further Mathematics', terms: { 1: { test1: 19, test2: 20, mean: 19.5, rank: 1 }, 2: { test1: 20, test2: 19, mean: 19.5, rank: 1 }, 3: { test1: 18, test2: 20, mean: 19, rank: 1 } } },
    { subjectId: 'ENG_SCI', subjectName: 'Engineering Science', terms: { 1: { test1: 14, test2: 15, mean: 14.5, rank: 9 }, 2: { test1: 13, test2: 14, mean: 13.5, rank: 10 }, 3: { test1: 16, test2: 15, mean: 15.5, rank: 7 } } },
    { subjectId: 'GEO', subjectName: 'Geography', terms: { 1: { test1: 12, test2: 14, mean: 13, rank: 11 }, 2: { test1: 15, test2: 13, mean: 14, rank: 9 }, 3: { test1: 14, test2: 16, mean: 15, rank: 8 } } },
    { subjectId: 'AGR', subjectName: 'Agricultural Science', terms: { 1: { test1: 16, test2: 15, mean: 15.5, rank: 6 }, 2: { test1: 17, test2: 16, mean: 16.5, rank: 3 }, 3: { test1: 15, test2: 17, mean: 16, rank: 5 } } },
    { subjectId: 'TD', subjectName: 'Technical Drawing', terms: { 1: { test1: 18, test2: 17, mean: 17.5, rank: 2 }, 2: { test1: 16, test2: 18, mean: 17, rank: 2 }, 3: { test1: 19, test2: 17, mean: 18, rank: 2 } } },
    { subjectId: 'PE', subjectName: 'Physical Education', terms: { 1: { test1: 20, test2: 19, mean: 19.5, rank: 1 }, 2: { test1: 19, test2: 20, mean: 19.5, rank: 1 }, 3: { test1: 20, test2: 20, mean: 20, rank: 1 } } },
    { subjectId: 'CHN', subjectName: 'Chinese', terms: { 1: { test1: 10, test2: 12, mean: 11, rank: 15 }, 2: { test1: 12, test2: 11, mean: 11.5, rank: 14 }, 3: { test1: 13, test2: 14, mean: 13.5, rank: 11 } } },
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
};
