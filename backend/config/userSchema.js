/**
 * Updated User Schema with School Hierarchy
 * Defines user data structure with school level, section, and stream
 */

const USER_SCHEMA = {
  ADMIN: {
    id: 'string',
    email: 'string',
    password: 'string (hashed)',
    name: 'string',
    role: 'admin',
    phone: 'string',
    address: 'string',
    joinDate: 'date',
    department: 'string',
    isSuperUser: 'boolean'
  },

  TEACHER: {
    // Base fields
    id: 'string',
    email: 'string',
    password: 'string (hashed)',
    name: 'string',
    role: 'teacher',
    teacherType: 'regular|class_teacher|subject_head|departmental_head',
    phone: 'string',
    address: 'string',
    joinDate: 'date',
    department: 'string',
    experience: 'number (years)',

    // School Hierarchy
    schoolLevel: 'primary|secondary', // Primary School or Secondary School
    section: 'nursery|primary_classes|junior_secondary|senior_secondary',
    
    // For Class/Subject Teachers
    assignedClasses: [
      {
        schoolLevel: 'string',
        section: 'string',
        classId: 'string',
        className: 'string',
        stream: 'string (optional, for SSS)', // science|commercial|art
        subjects: ['string']
      }
    ],

    // For Class Teachers
    classHead: 'boolean',
    headClass: 'string (class id they head)',
    students: ['string (student ids)'],

    // For Subject Teachers
    headingSubject: 'string',
    subjectDepartment: 'string',
    classesTeaching: ['string (class ids)'],

    // For Department Heads
    headOfDepartment: 'boolean',
    departmentHead: 'string (department name)',
    subjectTeachers: ['string (teacher ids)'],
    responsibilities: ['string']
  },

  STUDENT: {
    id: 'string',
    email: 'string',
    password: 'string (hashed)',
    name: 'string',
    role: 'student',
    rollNo: 'string',
    dateOfBirth: 'date',
    gender: 'M|F|Other',
    phone: 'string',
    address: 'string',
    joinDate: 'date',

    // School Hierarchy
    schoolLevel: 'primary|secondary',
    section: 'nursery|primary_classes|junior_secondary|senior_secondary',
    classId: 'string',
    className: 'string',
    stream: 'string (optional, for SSS)', // science|commercial|art
    
    // Academic
    subjects: ['string'],
    classTeacher: 'string (teacher id)',
    guardian: 'string (parent id)',

    // Status
    status: 'active|inactive|transferred|graduated',
    admissionNo: 'string'
  },

  PARENT: {
    id: 'string',
    email: 'string',
    password: 'string (hashed)',
    name: 'string',
    role: 'parent',
    phone: 'string',
    address: 'string',
    relationship: 'Father|Mother|Guardian|Other',
    children: ['string (student ids)'],
    occupation: 'string',
    joinDate: 'date'
  }
};

/**
 * Example Teacher Data with New Structure
 */
const EXAMPLE_TEACHERS = {
  REGULAR_TEACHER: {
    id: '2',
    email: 'teacher@school.com',
    password: 'password',
    name: 'John Teacher',
    role: 'teacher',
    teacherType: 'regular',
    schoolLevel: 'primary',
    section: 'primary_classes',
    assignedClasses: [
      {
        schoolLevel: 'primary',
        section: 'primary_classes',
        classId: 'class_4',
        className: 'Class 4',
        subjects: ['Mathematics', 'English']
      }
    ],
    phone: '+1-800-987-6543',
    department: 'Primary Education'
  },

  CLASS_TEACHER: {
    id: '2a',
    email: 'classteacher@school.com',
    password: 'password',
    name: 'Sarah ClassTeacher',
    role: 'teacher',
    teacherType: 'class_teacher',
    schoolLevel: 'secondary',
    section: 'junior_secondary',
    classHead: true,
    headClass: 'form_1',
    students: ['3', '5', '6', '7'],
    assignedClasses: [
      {
        schoolLevel: 'secondary',
        section: 'junior_secondary',
        classId: 'form_1',
        className: 'Form 1 (JSS1)',
        subjects: ['English', 'Social Studies']
      }
    ],
    phone: '+1-800-111-2222',
    department: 'Junior Secondary'
  },

  SUBJECT_HEAD_SCIENCE: {
    id: '2b',
    email: 'subjecthead@school.com',
    password: 'password',
    name: 'Dr. Michael SubjectHead',
    role: 'teacher',
    teacherType: 'subject_head',
    schoolLevel: 'secondary',
    section: 'senior_secondary',
    headingSubject: 'Mathematics',
    subjectDepartment: 'Sciences',
    classesTeaching: ['sss_1', 'sss_2', 'sss_3'],
    assignedClasses: [
      {
        schoolLevel: 'secondary',
        section: 'senior_secondary',
        classId: 'sss_1',
        className: 'SSS1',
        stream: 'science',
        subjects: ['Mathematics', 'Advanced Mathematics']
      }
    ],
    phone: '+1-800-333-4444',
    department: 'Sciences'
  },

  DEPARTMENT_HEAD: {
    id: '2c',
    email: 'depthead@school.com',
    password: 'password',
    name: 'Prof. Rachel DeptHead',
    role: 'teacher',
    teacherType: 'departmental_head',
    schoolLevel: 'secondary',
    section: 'senior_secondary',
    headOfDepartment: true,
    departmentHead: 'Sciences',
    subjectTeachers: ['2b', '2', '8', '9'],
    phone: '+1-800-555-6666',
    responsibilities: ['budget management', 'staff coordination', 'curriculum oversight']
  }
};

/**
 * Example Student Data with New Structure
 */
const EXAMPLE_STUDENTS = {
  PRIMARY_STUDENT: {
    id: '10',
    email: 'student.primary@school.com',
    password: 'password',
    name: 'Chioma Okafor',
    role: 'student',
    rollNo: '001',
    schoolLevel: 'primary',
    section: 'primary_classes',
    classId: 'class_4',
    className: 'Class 4',
    subjects: ['Mathematics', 'English', 'Science', 'Social Studies', 'Arts'],
    dateOfBirth: '2015-03-15',
    gender: 'F',
    status: 'active',
    admissionNo: 'ADM/2019/001'
  },

  JSS_STUDENT: {
    id: '11',
    email: 'student.jss@school.com',
    password: 'password',
    name: 'Kolade Adeyemi',
    role: 'student',
    rollNo: '045',
    schoolLevel: 'secondary',
    section: 'junior_secondary',
    classId: 'form_1',
    className: 'Form 1 (JSS1)',
    subjects: ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography'],
    dateOfBirth: '2011-07-20',
    gender: 'M',
    status: 'active',
    admissionNo: 'ADM/2022/045'
  },

  SSS_SCIENCE_STUDENT: {
    id: '12',
    email: 'student.sss.science@school.com',
    password: 'password',
    name: 'Amara Nwosu',
    role: 'student',
    rollNo: '078',
    schoolLevel: 'secondary',
    section: 'senior_secondary',
    classId: 'sss_1',
    className: 'SSS1',
    stream: 'science',
    subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English'],
    dateOfBirth: '2008-11-05',
    gender: 'F',
    status: 'active',
    admissionNo: 'ADM/2023/078'
  },

  SSS_COMMERCIAL_STUDENT: {
    id: '13',
    email: 'student.sss.commercial@school.com',
    password: 'password',
    name: 'Tunde Olawale',
    role: 'student',
    rollNo: '092',
    schoolLevel: 'secondary',
    section: 'senior_secondary',
    classId: 'sss_2',
    className: 'SSS2',
    stream: 'commercial',
    subjects: ['Accounting', 'Economics', 'Commerce', 'Mathematics', 'English'],
    dateOfBirth: '2007-08-12',
    gender: 'M',
    status: 'active',
    admissionNo: 'ADM/2022/092'
  }
};

module.exports = {
  USER_SCHEMA,
  EXAMPLE_TEACHERS,
  EXAMPLE_STUDENTS
};
