/**
 * School Structure Configuration
 * Defines the educational hierarchy for the school system
 */

const SCHOOL_STRUCTURE = {
  PRIMARY_SCHOOL: {
    id: 'primary',
    name: 'Primary School',
    description: 'Primary education (Ages 3-12)',
    sections: {
      NURSERY: {
        id: 'nursery',
        name: 'Nursery',
        description: 'Nursery education',
        classes: [
          { id: 'nursery_i', name: 'Nursery I', level: 1 },
          { id: 'nursery_ii', name: 'Nursery II', level: 2 },
          { id: 'nursery_iii', name: 'Nursery III', level: 3 }
        ]
      },
      PRIMARY: {
        id: 'primary_classes',
        name: 'Primary Classes',
        description: 'Primary education classes',
        classes: [
          { id: 'class_1', name: 'Class 1', level: 1 },
          { id: 'class_2', name: 'Class 2', level: 2 },
          { id: 'class_3', name: 'Class 3', level: 3 },
          { id: 'class_4', name: 'Class 4', level: 4 },
          { id: 'class_5', name: 'Class 5', level: 5 },
          { id: 'class_6', name: 'Class 6', level: 6 }
        ]
      }
    }
  },

  SECONDARY_SCHOOL: {
    id: 'secondary',
    name: 'Secondary School',
    description: 'Secondary education (Ages 12-18)',
    sections: {
      JUNIOR_SECONDARY: {
        id: 'junior_secondary',
        name: 'Junior Secondary School (JSS)',
        description: 'Junior secondary education (Form 1-3)',
        classes: [
          { id: 'form_1', name: 'Form 1 (JSS1)', level: 1 },
          { id: 'form_2', name: 'Form 2 (JSS2)', level: 2 },
          { id: 'form_3', name: 'Form 3 (JSS3)', level: 3 }
        ],
        streams: [] // Junior secondary doesn't have streams
      },
      SENIOR_SECONDARY: {
        id: 'senior_secondary',
        name: 'Senior Secondary School (SSS)',
        description: 'Senior secondary education (SSS1-3)',
        classes: [
          { id: 'sss_1', name: 'SSS1', level: 1 },
          { id: 'sss_2', name: 'SSS2', level: 2 },
          { id: 'sss_3', name: 'SSS3', level: 3 }
        ],
        streams: [
          { id: 'science', name: 'Science Stream', subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics'] },
          { id: 'commercial', name: 'Commercial Stream', subjects: ['Accounting', 'Economics', 'Commerce', 'Mathematics'] },
          { id: 'art', name: 'Art Stream', subjects: ['English', 'History', 'Geography', 'Government', 'Literature'] }
        ]
      }
    }
  }
};

/**
 * Get all school levels
 */
const getSchoolLevels = () => [
  {
    id: 'primary',
    name: 'Primary School',
    description: 'Primary education'
  },
  {
    id: 'secondary',
    name: 'Secondary School',
    description: 'Secondary education'
  }
];

/**
 * Get sections for a school level
 */
const getSectionsForLevel = (schoolLevel) => {
  if (schoolLevel === 'primary') {
    return Object.values(SCHOOL_STRUCTURE.PRIMARY_SCHOOL.sections).map(section => ({
      id: section.id,
      name: section.name,
      description: section.description
    }));
  } else if (schoolLevel === 'secondary') {
    return Object.values(SCHOOL_STRUCTURE.SECONDARY_SCHOOL.sections).map(section => ({
      id: section.id,
      name: section.name,
      description: section.description
    }));
  }
  return [];
};

/**
 * Get classes for a section
 */
const getClassesForSection = (schoolLevel, section) => {
  if (schoolLevel === 'primary') {
    return SCHOOL_STRUCTURE.PRIMARY_SCHOOL.sections[section.toUpperCase()]?.classes || [];
  } else if (schoolLevel === 'secondary') {
    return SCHOOL_STRUCTURE.SECONDARY_SCHOOL.sections[section.toUpperCase()]?.classes || [];
  }
  return [];
};

/**
 * Get streams for a section (Senior Secondary only)
 */
const getStreamsForSection = (schoolLevel, section) => {
  if (schoolLevel === 'secondary' && section === 'senior_secondary') {
    return SCHOOL_STRUCTURE.SECONDARY_SCHOOL.sections.SENIOR_SECONDARY.streams;
  }
  return [];
};

/**
 * Get full class name with school level and section
 */
const getFullClassName = (schoolLevel, section, className) => {
  const schoolName = schoolLevel === 'primary' ? 'Primary' : 'Secondary';
  const sectionName = getSectionsForLevel(schoolLevel).find(s => s.id === section)?.name;
  return `${schoolName} - ${sectionName} - ${className}`;
};

/**
 * Get subjects for a class/stream combination
 */
const getSubjectsForClass = (schoolLevel, section, stream = null) => {
  const DEFAULT_SUBJECTS = {
    nursery: ['Alphabets', 'Numbers', 'Arts', 'Music', 'Physical Education'],
    primary: ['English', 'Mathematics', 'Science', 'Social Studies', 'Arts', 'Physical Education', 'Music'],
    junior_secondary: ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Civic Education', 'Physical Education'],
    senior_secondary: {
      science: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English'],
      commercial: ['Accounting', 'Economics', 'Commerce', 'Mathematics', 'English'],
      art: ['English', 'History', 'Geography', 'Government', 'Literature', 'Economics']
    }
  };

  if (section === 'nursery') {
    return DEFAULT_SUBJECTS.nursery;
  } else if (section === 'primary_classes') {
    return DEFAULT_SUBJECTS.primary;
  } else if (section === 'junior_secondary') {
    return DEFAULT_SUBJECTS.junior_secondary;
  } else if (section === 'senior_secondary' && stream) {
    return DEFAULT_SUBJECTS.senior_secondary[stream] || [];
  }
  return [];
};

/**
 * Validate class assignment
 */
const isValidClassAssignment = (schoolLevel, section, classId, stream = null) => {
  const classes = getClassesForSection(schoolLevel, section);
  const classExists = classes.some(c => c.id === classId);

  if (section === 'senior_secondary' && !stream) {
    return false; // Senior secondary requires a stream
  }

  return classExists;
};

module.exports = {
  SCHOOL_STRUCTURE,
  getSchoolLevels,
  getSectionsForLevel,
  getClassesForSection,
  getStreamsForSection,
  getFullClassName,
  getSubjectsForClass,
  isValidClassAssignment
};
