/**
 * ScoreTable Component
 * The main academic scores grid with Term 1/2/3 sub-columns
 * Columns: S/N | Subject | Term 1 (T1,T2,Mn,Rnk) | Term 2 | Term 3
 */
import React from 'react';
import ScoreTableRow from './ScoreTableRow';
import {
  calculateTermTotal,
  calculateTermAverage,
  getGradeFromAverage,
  getGradeColor,
  getOrdinal,
} from '../../utils/reportCardUtils';

const ScoreTable = ({ subjects, summary, isEditable, onScoreChange }) => {
  const termHeaders = [1, 2, 3];

  return (
    <div className="px-2 py-2 overflow-x-auto">
      <table className="w-full border-collapse text-xs leading-tight rc-table">
        {/* ──── Column Group for alignment ──── */}
        <colgroup>
          <col className="w-8" />           {/* S/N */}
          <col className="w-32 min-w-[120px]" /> {/* Subject */}
          {/* 3 terms × 4 cols each */}
          {termHeaders.map(() => (
            <React.Fragment key={Math.random()}>
              <col className="w-10" />
              <col className="w-10" />
              <col className="w-10" />
              <col className="w-9" />
            </React.Fragment>
          ))}
        </colgroup>

        <thead>
          {/* ──── Top header: Term labels ──── */}
          <tr className="bg-gray-800 text-white">
            <th rowSpan={2} className="rc-th text-center">S/N</th>
            <th rowSpan={2} className="rc-th text-left pl-2">SUBJECTS</th>
            {termHeaders.map((t) => (
              <th key={t} colSpan={4} className="rc-th text-center border-l-2 border-gray-600">
                TERM {t}
              </th>
            ))}
          </tr>

          {/* ──── Sub-header: Test 1, Test 2, Mean, Rank ──── */}
          <tr className="bg-gray-700 text-gray-200">
            {termHeaders.map((t) => (
              <React.Fragment key={t}>
                <th className="rc-th-sub border-l-2 border-gray-500">T1</th>
                <th className="rc-th-sub">T2</th>
                <th className="rc-th-sub">Mn</th>
                <th className="rc-th-sub">Rnk</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>

        <tbody>
          {subjects.map((subj, idx) => (
            <ScoreTableRow
              key={subj.subjectId}
              index={idx + 1}
              subject={subj}
              isEditable={isEditable}
              onScoreChange={onScoreChange}
            />
          ))}

          {/* ──── Combined / Summary Row ──── */}
          {subjects.length > 0 && (
            <>
              <tr className="bg-gray-100 font-bold border-t-2 border-gray-800">
                <td colSpan={2} className="rc-cell text-right pr-2 uppercase text-gray-700 text-xs">
                  Combined Scores
                </td>
                {termHeaders.map((t) => {
                  const total = calculateTermTotal(subjects, t);
                  const avg = calculateTermAverage(subjects, t);
                  const { grade } = getGradeFromAverage((avg / 20) * 100);
                  const termSummary = summary?.[t] || {};
                  return (
                    <React.Fragment key={t}>
                      <td colSpan={2} className="rc-cell text-center text-blue-800 border-l-2 border-gray-400">
                        {total.toFixed(1)}
                      </td>
                      <td className="rc-cell text-center" style={{ color: getGradeColor(grade) }}>
                        {avg.toFixed(1)}
                      </td>
                      <td className="rc-cell text-center text-xs">
                        {termSummary.position ? getOrdinal(termSummary.position) : '—'}
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>

              {/* Performance remark row */}
              <tr className="bg-gray-50">
                <td colSpan={2} className="rc-cell text-right pr-2 text-xs font-semibold text-gray-600 uppercase">
                  Performance
                </td>
                {termHeaders.map((t) => {
                  const termSummary = summary?.[t] || {};
                  const remark = termSummary.performanceRemark || '—';
                  return (
                    <td key={t} colSpan={4} className="rc-cell text-center font-semibold text-xs border-l-2 border-gray-300" style={{ color: getGradeColor(termSummary.overallGrade) }}>
                      {remark} ({termSummary.overallGrade || '—'})
                    </td>
                  );
                })}
              </tr>

              {/* Position in class row */}
              <tr className="bg-gray-50 border-b-2 border-gray-800">
                <td colSpan={2} className="rc-cell text-right pr-2 text-xs font-semibold text-gray-600 uppercase">
                  Position in Class
                </td>
                {termHeaders.map((t) => {
                  const termSummary = summary?.[t] || {};
                  return (
                    <td key={t} colSpan={4} className="rc-cell text-center font-bold text-sm border-l-2 border-gray-300">
                      {termSummary.position
                        ? `${getOrdinal(termSummary.position)} of ${termSummary.totalStudents}`
                        : '—'}
                    </td>
                  );
                })}
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreTable;
