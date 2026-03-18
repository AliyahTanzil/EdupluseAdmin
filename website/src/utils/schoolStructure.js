import React, { useState } from 'react';

/**
 * School Structure Utilities for Frontend
 * Provides UI components and helpers for the new school hierarchy
 */

/**
 * School Structure Configuration (Mirror of Backend)
 */
export const SCHOOL_STRUCTURE_FRONTEND = {
  PRIMARY_SCHOOL: {
    id: 'primary',
    name: 'Primary School',
    description: 'Primary education (Ages 3-12)',
    icon: '🎒',
    sections: [
      {
        id: 'nursery',
        name: 'Nursery',
        classes: ['Nursery I', 'Nursery II', 'Nursery III']
      },
      {
        id: 'primary_classes',
        name: 'Primary Classes',
        classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6']
      }
    ]
  },

  SECONDARY_SCHOOL: {
    id: 'secondary',
    name: 'Secondary School',
    description: 'Secondary education (Ages 12-18)',
    icon: '📚',
    sections: [
      {
        id: 'junior_secondary',
        name: 'Junior Secondary (JSS)',
        classes: ['Form 1 (JSS1)', 'Form 2 (JSS2)', 'Form 3 (JSS3)'],
        hasStreams: false
      },
      {
        id: 'senior_secondary',
        name: 'Senior Secondary (SSS)',
        classes: ['SSS1', 'SSS2', 'SSS3'],
        hasStreams: true,
        streams: [
          { id: 'science', name: 'Science' },
          { id: 'commercial', name: 'Commercial' },
          { id: 'art', name: 'Art' }
        ]
      }
    ]
  }
};

/**
 * Get all school levels
 */
export const getSchoolLevels = () => [
  { id: 'primary', name: 'Primary School', icon: '🎒' },
  { id: 'secondary', name: 'Secondary School', icon: '📚' }
];

/**
 * Get sections for school level
 */
export const getSectionsForLevel = (schoolLevel) => {
  const structure = schoolLevel === 'primary' 
    ? SCHOOL_STRUCTURE_FRONTEND.PRIMARY_SCHOOL 
    : SCHOOL_STRUCTURE_FRONTEND.SECONDARY_SCHOOL;
  
  return structure.sections;
};

/**
 * Get classes for section
 */
export const getClassesForSection = (schoolLevel, sectionId) => {
  const sections = getSectionsForLevel(schoolLevel);
  const section = sections.find(s => s.id === sectionId);
  return section ? section.classes : [];
};

/**
 * Get streams for section (if applicable)
 */
export const getStreamsForSection = (schoolLevel, sectionId) => {
  const section = getSectionsForLevel(schoolLevel)
    .find(s => s.id === sectionId);
  
  return section?.streams || [];
};

/**
 * Check if section requires stream selection
 */
export const requiresStream = (schoolLevel, sectionId) => {
  const section = getSectionsForLevel(schoolLevel)
    .find(s => s.id === sectionId);
  
  return section?.hasStreams || false;
};

/**
 * SchoolLevelSelector Component
 */
export const SchoolLevelSelector = ({ value, onChange }) => {
  const levels = getSchoolLevels();

  return (
    <div className="form-group">
      <label htmlFor="school-level">School Level:</label>
      <select
        id="school-level"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-control"
      >
        <option value="">Select School Level</option>
        {levels.map(level => (
          <option key={level.id} value={level.id}>
            {level.icon} {level.name}
          </option>
        ))}
      </select>
    </div>
  );
};

/**
 * SectionSelector Component
 */
export const SectionSelector = ({ schoolLevel, value, onChange }) => {
  const sections = schoolLevel ? getSectionsForLevel(schoolLevel) : [];

  return (
    <div className="form-group">
      <label htmlFor="section">Section:</label>
      <select
        id="section"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-control"
        disabled={!schoolLevel}
      >
        <option value="">Select Section</option>
        {sections.map(section => (
          <option key={section.id} value={section.id}>
            {section.name}
          </option>
        ))}
      </select>
    </div>
  );
};

/**
 * ClassSelector Component
 */
export const ClassSelector = ({ schoolLevel, section, value, onChange }) => {
  const classes = (schoolLevel && section) 
    ? getClassesForSection(schoolLevel, section) 
    : [];

  return (
    <div className="form-group">
      <label htmlFor="class">Class:</label>
      <select
        id="class"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-control"
        disabled={!schoolLevel || !section}
      >
        <option value="">Select Class</option>
        {classes.map((cls, idx) => (
          <option key={idx} value={cls}>
            {cls}
          </option>
        ))}
      </select>
    </div>
  );
};

/**
 * StreamSelector Component
 */
export const StreamSelector = ({ schoolLevel, section, value, onChange }) => {
  const streams = (schoolLevel && section)
    ? getStreamsForSection(schoolLevel, section)
    : [];

  const isRequired = (schoolLevel && section)
    ? requiresStream(schoolLevel, section)
    : false;

  if (!isRequired) return null;

  return (
    <div className="form-group">
      <label htmlFor="stream">
        Stream:
        {isRequired && <span className="text-red-600">*</span>}
      </label>
      <select
        id="stream"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-control"
        disabled={!schoolLevel || !section}
      >
        <option value="">Select Stream</option>
        {streams.map(stream => (
          <option key={stream.id} value={stream.id}>
            {stream.name}
          </option>
        ))}
      </select>
    </div>
  );
};

/**
 * Complete School Hierarchy Selector
 */
export const SchoolHierarchySelector = ({ 
  schoolLevel, 
  section, 
  classSelected, 
  stream,
  onSchoolLevelChange,
  onSectionChange,
  onClassChange,
  onStreamChange
}) => {
  return (
    <div className="school-hierarchy-selector">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <SchoolLevelSelector 
          value={schoolLevel}
          onChange={onSchoolLevelChange}
        />
        
        <SectionSelector
          schoolLevel={schoolLevel}
          value={section}
          onChange={onSectionChange}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
        <ClassSelector
          schoolLevel={schoolLevel}
          section={section}
          value={classSelected}
          onChange={onClassChange}
        />

        {requiresStream(schoolLevel, section) && (
          <StreamSelector
            schoolLevel={schoolLevel}
            section={section}
            value={stream}
            onChange={onStreamChange}
          />
        )}
      </div>
    </div>
  );
};

/**
 * Display Full Class Name
 */
export const getFullClassName = (schoolLevel, section, className, stream) => {
  const schoolName = schoolLevel === 'primary' ? 'Primary' : 'Secondary';
  const sectionInfo = getSectionsForLevel(schoolLevel)
    .find(s => s.id === section);
  
  let fullName = `${schoolName} - ${sectionInfo?.name || ''} - ${className}`;
  
  if (stream) {
    fullName += ` (${stream.toUpperCase()})`;
  }
  
  return fullName;
};

/**
 * School Info Card Component
 */
export const SchoolInfoCard = ({ schoolLevel, section, classSelected, stream }) => {
  const fullName = getFullClassName(schoolLevel, section, classSelected, stream);

  return (
    <div className="card" style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
      <h3>School Assignment</h3>
      <p><strong>School Level:</strong> {schoolLevel === 'primary' ? 'Primary School' : 'Secondary School'}</p>
      <p><strong>Section:</strong> {getSectionsForLevel(schoolLevel).find(s => s.id === section)?.name}</p>
      <p><strong>Class:</strong> {classSelected}</p>
      {stream && <p><strong>Stream:</strong> {stream}</p>}
      <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
        <strong>Full Assignment:</strong> {fullName}
      </p>
    </div>
  );
};

export default {
  SCHOOL_STRUCTURE_FRONTEND,
  getSchoolLevels,
  getSectionsForLevel,
  getClassesForSection,
  getStreamsForSection,
  requiresStream,
  SchoolLevelSelector,
  SectionSelector,
  ClassSelector,
  StreamSelector,
  SchoolHierarchySelector,
  getFullClassName,
  SchoolInfoCard
};
