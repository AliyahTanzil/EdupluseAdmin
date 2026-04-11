/**
 * SummarySection Component
 * Total Score, Average, Position, Performance remark + Grading Key
 */
import React from 'react';
import { getOrdinal, getGradeColor } from '../../utils/reportCardUtils';

const GRADING_KEY = [
  { range: '90 – 100', grade: 'A+', desc: 'Outstanding', color: '#059669' },
  { range: '80 – 89', grade: 'A', desc: 'Excellent', color: '#059669' },
  { range: '70 – 79', grade: 'B', desc: 'Very Good', color: '#2563eb' },
  { range: '60 – 69', grade: 'C', desc: 'Good', color: '#ca8a04' },
  { range: '50 – 59', grade: 'D', desc: 'Average', color: '#ea580c' },
  { range: '40 – 49', grade: 'E', desc: 'Below Average', color: '#dc2626' },
  { range: '0 – 39', grade: 'F', desc: 'Fail', color: '#dc2626' },
];

const SummarySection = ({ summary, attendance }) => {
  const terms = [1, 2, 3];

  return (
    <div className="border-t-2 border-gray-800 px-4 py-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ──── Grading Key ──── */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-2">
            📝 Grading Key
          </h4>
          <table className="w-full border-collapse text-xs rc-table">
            <thead>
              <tr className="bg-gray-100">
                <th className="rc-th text-center">Mark Range</th>
                <th className="rc-th text-center w-12">Grade</th>
                <th className="rc-th text-left pl-2">Interpretation</th>
              </tr>
            </thead>
            <tbody>
              {GRADING_KEY.map((gk) => (
                <tr key={gk.grade} className="hover:bg-gray-50">
                  <td className="rc-cell text-center">{gk.range}</td>
                  <td className="rc-cell text-center font-bold" style={{ color: gk.color }}>
                    {gk.grade}
                  </td>
                  <td className="rc-cell text-left pl-2">{gk.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ──── Term-by-Term Summary ──── */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-2">
            📊 Term Summary
          </h4>
          <table className="w-full border-collapse text-xs rc-table">
            <thead>
              <tr className="bg-gray-100">
                <th className="rc-th text-left pl-3">Metric</th>
                {terms.map((t) => (
                  <th key={t} className="rc-th text-center w-20">Term {t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="rc-cell text-left pl-3 font-semibold text-gray-700">Total Score</td>
                {terms.map((t) => {
                  const s = summary?.[t] || {};
                  return (
                    <td key={t} className="rc-cell text-center font-bold">
                      {s.totalScore || '—'}/{s.maxPossible || '—'}
                    </td>
                  );
                })}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="rc-cell text-left pl-3 font-semibold text-gray-700">Average (%)</td>
                {terms.map((t) => {
                  const s = summary?.[t] || {};
                  return (
                    <td key={t} className="rc-cell text-center font-bold text-blue-700">
                      {s.average != null ? `${s.average}%` : '—'}
                    </td>
                  );
                })}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="rc-cell text-left pl-3 font-semibold text-gray-700">Overall Grade</td>
                {terms.map((t) => {
                  const s = summary?.[t] || {};
                  return (
                    <td key={t} className="rc-cell text-center text-lg font-bold" style={{ color: getGradeColor(s.overallGrade) }}>
                      {s.overallGrade || '—'}
                    </td>
                  );
                })}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="rc-cell text-left pl-3 font-semibold text-gray-700">Position</td>
                {terms.map((t) => {
                  const s = summary?.[t] || {};
                  return (
                    <td key={t} className="rc-cell text-center font-bold">
                      {s.position ? `${getOrdinal(s.position)} / ${s.totalStudents}` : '—'}
                    </td>
                  );
                })}
              </tr>
              <tr className="bg-gray-50 border-t border-gray-300">
                <td className="rc-cell text-left pl-3 font-semibold text-gray-700">Remark</td>
                {terms.map((t) => {
                  const s = summary?.[t] || {};
                  return (
                    <td key={t} className="rc-cell text-center font-semibold" style={{ color: getGradeColor(s.overallGrade) }}>
                      {s.performanceRemark || '—'}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SummarySection;
