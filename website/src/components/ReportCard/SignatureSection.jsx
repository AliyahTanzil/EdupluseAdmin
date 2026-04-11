/**
 * SignatureSection Component
 * Teacher remark, Principal remark, and 3 signature lines
 */
import React from 'react';

const SignatureSection = ({ data, schoolName, isEditable, onRemarkChange }) => {
  const getAutoRemark = (grade) => {
    const remarks = {
      'A+': 'An outstanding performance! Keep soaring!',
      A: 'An excellent performance. Keep up the outstanding work!',
      B: 'Very good performance. Continue to aim higher!',
      C: 'Good effort. There is room for improvement.',
      D: 'Average performance. More dedication is needed.',
      E: 'Below average. Requires more attention and hard work.',
      F: 'Below expectation. Urgent improvement is needed.',
    };
    return remarks[grade] || 'Keep working hard.';
  };

  const currentSummary = data.summary?.[data.currentTerm] || {};
  const autoRemark = getAutoRemark(currentSummary.overallGrade);

  return (
    <div className="border-t-2 border-gray-800 px-6 py-4">
      {/* ──── Class Teacher Remark ──── */}
      <div className="mb-4">
        <p className="font-bold text-sm text-gray-800">Class Teacher&apos;s Remark:</p>
        {isEditable ? (
          <textarea
            className="w-full mt-1 p-2 border border-gray-300 rounded text-sm italic text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[40px]"
            value={data.classTeacherRemark || autoRemark}
            onChange={(e) => onRemarkChange?.('classTeacherRemark', e.target.value)}
            placeholder="Enter remark..."
          />
        ) : (
          <div className="border-b-2 border-dotted border-gray-400 mt-1 pb-4 min-h-[30px] text-sm italic text-gray-600">
            {data.classTeacherRemark || autoRemark}
          </div>
        )}
      </div>

      {/* ──── Principal Remark ──── */}
      <div className="mb-6">
        <p className="font-bold text-sm text-gray-800">Principal&apos;s Remark:</p>
        {isEditable ? (
          <textarea
            className="w-full mt-1 p-2 border border-gray-300 rounded text-sm italic text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[40px]"
            value={data.principalRemark || ''}
            onChange={(e) => onRemarkChange?.('principalRemark', e.target.value)}
            placeholder="Enter remark..."
          />
        ) : (
          <div className="border-b-2 border-dotted border-gray-400 mt-1 pb-4 min-h-[30px] text-sm italic text-gray-600">
            {data.principalRemark || 'Keep up the good effort.'}
          </div>
        )}
      </div>

      {/* ──── Signature Lines ──── */}
      <div className="grid grid-cols-3 gap-8 mt-4">
        <div className="text-center">
          <div className="border-b-2 border-gray-800 mb-1 pb-8"></div>
          <p className="text-xs font-semibold text-gray-700">Class Teacher&apos;s Signature</p>
        </div>
        <div className="text-center">
          <div className="border-b-2 border-gray-800 mb-1 pb-8"></div>
          <p className="text-xs font-semibold text-gray-700">Principal&apos;s Signature</p>
        </div>
        <div className="text-center">
          <div className="border-b-2 border-gray-800 mb-1 pb-8"></div>
          <p className="text-xs font-semibold text-gray-700">Parent/Guardian&apos;s Signature</p>
        </div>
      </div>

      {/* ──── Footer ──── */}
      <div className="text-center mt-5 text-xs text-gray-400">
        <p className="italic">
          This report card is the property of {schoolName || 'EduPlus Academy'}.
          If found, please return to the school.
        </p>
        <p className="mt-1">Generated on {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>
    </div>
  );
};

export default SignatureSection;
