import React from 'react';
import PropTypes from 'prop-types';

/**
 * WeekSummary Component
 * Displays circular progress ring showing weekly attendance percentage
 */
const WeekSummary = ({
  attendance,
  studentId,
  daysOfWeek,
  sessions = ['Morning', 'Afternoon'],
  onClick = null,
}) => {
  // Calculate attendance percentage
  const presentCount = daysOfWeek.reduce((count, day) => {
    const morningKey = `${studentId}-${day}-${sessions[0]}`;
    const afternoonKey = `${studentId}-${day}-${sessions[1]}`;
    
    const morningPresent = attendance[morningKey]?.status === 'present';
    const afternoonPresent = attendance[afternoonKey]?.status === 'present';
    
    // Count as present if either session is marked present
    return count + (morningPresent || afternoonPresent ? 1 : 0);
  }, 0);

  const totalDays = daysOfWeek.length;
  const percentage = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;

  // Color based on percentage
  const getColor = (pct) => {
    if (pct >= 90) return '#10b981'; // green
    if (pct >= 70) return '#f59e0b'; // orange
    return '#ef4444'; // red
  };

  const circleColor = getColor(percentage);
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="flex flex-col items-center gap-1 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors"
      onClick={onClick}
    >
      {/* Circular Progress */}
      <svg width="60" height="60" className="drop-shadow-sm">
        {/* Background circle */}
        <circle
          cx="30"
          cy="30"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="6"
        />
        {/* Progress circle */}
        <circle
          cx="30"
          cy="30"
          r={radius}
          fill="none"
          stroke={circleColor}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '30px 30px' }}
        />
      </svg>

      {/* Percentage Text */}
      <p className="text-sm font-bold text-gray-900">{percentage}%</p>
      
      {/* Days Count */}
      <p className="text-xs text-gray-500">
        {presentCount}/{totalDays} days
      </p>
    </div>
  );
};

WeekSummary.propTypes = {
  attendance: PropTypes.object.isRequired,
  studentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  daysOfWeek: PropTypes.array.isRequired,
  sessions: PropTypes.arrayOf(PropTypes.string),
  onClick: PropTypes.func,
};

export default WeekSummary;
