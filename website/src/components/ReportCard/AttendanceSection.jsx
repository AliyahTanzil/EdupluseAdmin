/**
 * AttendanceSection Component
 * Displays On Time, Late, Absent for all 3 terms
 */
import React from 'react';

const AttendanceSection = ({ attendance }) => {
  const terms = [1, 2, 3];
  const rows = [
    { key: 'totalDays', label: 'Total School Days', icon: '📅', color: '' },
    { key: 'onTime', label: 'On Time', icon: '✅', color: 'text-emerald-700 font-semibold' },
    { key: 'late', label: 'Late', icon: '⏰', color: 'text-yellow-700 font-semibold' },
    { key: 'absent', label: 'Absent', icon: '❌', color: 'text-red-600 font-semibold' },
  ];

  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-2 flex items-center gap-1">
        📋 Attendance Summary
      </h4>
      <table className="w-full border-collapse text-xs rc-table">
        <thead>
          <tr className="bg-gray-100">
            <th className="rc-th text-left pl-3">Attendance</th>
            {terms.map((t) => (
              <th key={t} className="rc-th text-center w-20">Term {t}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="hover:bg-gray-50">
              <td className="rc-cell text-left pl-3 text-gray-700">
                <span className="mr-1">{row.icon}</span> {row.label}
              </td>
              {terms.map((t) => {
                const val = attendance?.[t]?.[row.key];
                return (
                  <td key={t} className={`rc-cell text-center ${row.color}`}>
                    {val ?? '—'}
                  </td>
                );
              })}
            </tr>
          ))}
          {/* Attendance Rate */}
          <tr className="bg-gray-50 font-semibold border-t border-gray-300">
            <td className="rc-cell text-left pl-3 text-gray-700">📊 Attendance Rate</td>
            {terms.map((t) => {
              const data = attendance?.[t] || {};
              const rate = data.totalDays
                ? (((data.onTime || 0) + (data.late || 0)) / data.totalDays * 100).toFixed(1)
                : '—';
              const rateNum = parseFloat(rate);
              const color = rateNum >= 90 ? 'text-emerald-700' : rateNum >= 75 ? 'text-yellow-700' : 'text-red-600';
              return (
                <td key={t} className={`rc-cell text-center font-bold ${color}`}>
                  {rate !== '—' ? `${rate}%` : '—'}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceSection;
