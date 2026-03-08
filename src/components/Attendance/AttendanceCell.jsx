import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CheckCircle, XCircle, AlertCircle, Fingerprint } from 'lucide-react';

/**
 * AttendanceCell Component
 * Individual attendance cell with status toggling and gate scan indication
 */
const AttendanceCell = ({
  status = 'not_marked',
  hasGateScan = false,
  isDisabled = false,
  note = null,
  onChange = null,
  onContextMenu = null,
}) => {
  const [hovered, setHovered] = useState(false);

  const statusConfig = {
    present: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      text: 'text-green-700',
      icon: CheckCircle,
      label: 'Present',
    },
    absent: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-700',
      icon: XCircle,
      label: 'Absent',
    },
    late: {
      bg: 'bg-orange-50',
      border: 'border-orange-500',
      text: 'text-orange-700',
      icon: AlertCircle,
      label: 'Late',
    },
    excused: {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      text: 'text-blue-700',
      icon: AlertCircle,
      label: 'Excused',
    },
    not_marked: {
      bg: 'bg-gray-50',
      border: 'border-gray-200 border-dashed',
      text: 'text-gray-400',
      icon: null,
      label: '--',
    },
  };

  const config = statusConfig[status];
  const IconComponent = config.icon;

  const handleClick = () => {
    if (!isDisabled && onChange) {
      const cycle = ['not_marked', 'present', 'absent'];
      const currentIndex = cycle.indexOf(status);
      const nextStatus = cycle[(currentIndex + 1) % cycle.length];
      onChange(nextStatus);
    }
  };

  return (
    <div
      className={`
        relative w-14 h-14 rounded-lg border-2 flex items-center justify-center
        transition-all duration-200
        ${config.bg} ${config.border} ${config.text}
        ${!isDisabled && !hovered ? 'shadow-sm' : ''}
        ${!isDisabled && hovered ? 'shadow-md scale-105' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onContextMenu={onContextMenu}
      title={config.label}
    >
      {/* Status Icon */}
      {IconComponent && (
        <IconComponent size={20} className="transition-transform duration-200" />
      )}
      {!IconComponent && (
        <span className="text-lg font-semibold">--</span>
      )}

      {/* Gate Scan Indicator */}
      {hasGateScan && (
        <div className="absolute -top-1 -right-1 animate-pulse">
          <Fingerprint size={12} className="text-blue-600 bg-white rounded-full p-0.5" />
        </div>
      )}

      {/* Note Indicator */}
      {note && (
        <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-yellow-500 rounded-full" />
      )}
    </div>
  );
};

AttendanceCell.propTypes = {
  status: PropTypes.oneOf(['present', 'absent', 'late', 'excused', 'not_marked']),
  hasGateScan: PropTypes.bool,
  isDisabled: PropTypes.bool,
  note: PropTypes.string,
  onChange: PropTypes.func,
  onContextMenu: PropTypes.func,
};

export default AttendanceCell;
