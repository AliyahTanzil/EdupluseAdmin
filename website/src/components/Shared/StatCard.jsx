import React from 'react';
import PropTypes from 'prop-types';

/**
 * StatCard Component - Displays key statistics
 * Shows icon, value, title, and optional trend
 */
export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend = null,
  bgColor = 'bg-blue-50',
  iconColor = 'text-blue-500',
}) => {
  return (
    <div className={`${bgColor} rounded-lg p-6 transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className={`text-xs font-semibold mt-2 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}% {trend.label}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`${iconColor} p-3 bg-white rounded-full`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType,
  trend: PropTypes.shape({
    positive: PropTypes.bool.isRequired,
    value: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
  }),
  bgColor: PropTypes.string,
  iconColor: PropTypes.string,
};

export default StatCard;
