/**
 * ScoreTableRow Component
 * Renders a single subject row across all 3 terms
 * Columns: Subject | T1(Test1, Test2, Mean, Rank) | T2(...) | T3(...)
 */
import React from 'react';
import {
  getScoreColor,
  getMeanColorClass,
  getRankBadge,
} from '../../utils/reportCardUtils';

const ScoreTableRow = ({ index, subject, isEditable, onScoreChange }) => {
  const renderTermCells = (term) => {
    const data = subject.terms?.[term] || {};
    const meanClass = getMeanColorClass(data.mean);
    const badge = getRankBadge(data.rank);

    if (isEditable) {
      return (
        <>
          <td className="rc-cell">
            <input
              type="number"
              min="0"
              max="20"
              value={data.test1 ?? ''}
              onChange={(e) => onScoreChange(subject.subjectId, term, 'test1', e.target.value)}
              className="w-full text-center bg-transparent border-b border-dashed border-gray-300 focus:border-blue-500 focus:outline-none py-0.5 text-sm"
            />
          </td>
          <td className="rc-cell">
            <input
              type="number"
              min="0"
              max="20"
              value={data.test2 ?? ''}
              onChange={(e) => onScoreChange(subject.subjectId, term, 'test2', e.target.value)}
              className="w-full text-center bg-transparent border-b border-dashed border-gray-300 focus:border-blue-500 focus:outline-none py-0.5 text-sm"
            />
          </td>
          <td className={`rc-cell ${meanClass}`}>
            {data.mean != null ? data.mean : '—'}
          </td>
          <td className="rc-cell text-gray-500 text-xs">
            {data.rank ? `${data.rank}` : '—'} {badge}
          </td>
        </>
      );
    }

    return (
      <>
        <td className={`rc-cell ${getScoreColor(data.test1)}`}>
          {data.test1 ?? '—'}
        </td>
        <td className={`rc-cell ${getScoreColor(data.test2)}`}>
          {data.test2 ?? '—'}
        </td>
        <td className={`rc-cell ${meanClass}`}>
          {data.mean != null ? data.mean : '—'}
        </td>
        <td className="rc-cell text-xs">
          {badge && <span className="mr-0.5">{badge}</span>}
          {data.rank || '—'}
        </td>
      </>
    );
  };

  return (
    <tr className="hover:bg-blue-50/40 transition-colors">
      <td className="rc-cell text-center text-gray-500 text-xs w-8">{index}</td>
      <td className="rc-cell text-left font-medium text-gray-800 whitespace-nowrap">
        {subject.subjectName}
      </td>
      {/* Term 1 */}
      {renderTermCells(1)}
      {/* Term 2 */}
      {renderTermCells(2)}
      {/* Term 3 */}
      {renderTermCells(3)}
    </tr>
  );
};

export default ScoreTableRow;
