/**
 * ReportHeader Component
 * School logo, name, motto, and student info section
 */
import React from 'react';

const ReportHeader = ({ school, student, academicYear, currentTerm }) => {
  return (
    <>
      {/* ──── School Banner ──── */}
      <div className="border-b-2 border-gray-800 px-6 py-5 text-center bg-gradient-to-r from-blue-50 via-white to-blue-50 print:bg-white">
        {school.schoolLogo && (
          <img
            src={school.schoolLogo}
            alt="School Logo"
            className="mx-auto mb-2 h-16 w-16 object-contain"
          />
        )}
        <h2
          className="text-2xl font-bold uppercase tracking-widest text-gray-900"
          style={{ letterSpacing: '3px' }}
        >
          {school.schoolName || 'EDUPLUS INTERNATIONAL ACADEMY'}
        </h2>
        {school.schoolAddress && (
          <p className="text-sm text-gray-600 mt-1">{school.schoolAddress}</p>
        )}
        {(school.schoolPhone || school.schoolEmail) && (
          <p className="text-xs text-gray-500 mt-0.5">
            {school.schoolPhone && `Tel: ${school.schoolPhone}`}
            {school.schoolPhone && school.schoolEmail && ' | '}
            {school.schoolEmail && `Email: ${school.schoolEmail}`}
          </p>
        )}
        <p className="text-xs italic text-gray-500 mt-1">
          {school.schoolMotto || 'Excellence in Education'}
        </p>
        <div className="mt-3 inline-block border-2 border-gray-800 px-8 py-1.5 bg-gray-800 text-white rounded-sm">
          <span className="text-sm font-bold uppercase tracking-wider">
            Student Report Card
          </span>
        </div>
      </div>

      {/* ──── Student Information Grid ──── */}
      <div className="border-b-2 border-gray-800 px-6 py-3">
        <table className="w-full text-sm">
          <tbody>
            <tr>
              <td className="py-1.5 font-semibold text-gray-600 w-[14%]">Name:</td>
              <td className="py-1.5 border-b border-dotted border-gray-400 w-[36%] font-medium text-gray-900">
                {student.studentName || '—'}
              </td>
              <td className="py-1.5 font-semibold text-gray-600 w-[14%] pl-4">Class:</td>
              <td className="py-1.5 border-b border-dotted border-gray-400 w-[36%] font-medium text-gray-900">
                {student.class || '—'} {student.section ? `(${student.section})` : ''}
              </td>
            </tr>
            <tr>
              <td className="py-1.5 font-semibold text-gray-600">Adm. No:</td>
              <td className="py-1.5 border-b border-dotted border-gray-400 font-medium text-gray-900">
                {student.admissionNo || '—'}
              </td>
              <td className="py-1.5 font-semibold text-gray-600 pl-4">Gender:</td>
              <td className="py-1.5 border-b border-dotted border-gray-400 font-medium text-gray-900">
                {student.gender || '—'}
              </td>
            </tr>
            <tr>
              <td className="py-1.5 font-semibold text-gray-600">D.O.B:</td>
              <td className="py-1.5 border-b border-dotted border-gray-400 font-medium text-gray-900">
                {student.dateOfBirth || '—'}
              </td>
              <td className="py-1.5 font-semibold text-gray-600 pl-4">Acad. Year:</td>
              <td className="py-1.5 border-b border-dotted border-gray-400 font-medium text-gray-900">
                {academicYear || '—'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ReportHeader;
