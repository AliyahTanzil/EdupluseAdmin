import React from 'react';
import PropTypes from 'prop-types';

/**
 * Card Component - Reusable card for dashboard content
 * Features: gradient support, shadow, rounded corners
 */
export const Card = ({
  children,
  className = '',
  elevation = 'md',
  onClick = null,
  padding = 'md',
}) => {
  const elevationClasses = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  const paddingClasses = {
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        bg-white rounded-lg 
        ${elevationClasses[elevation]}
        ${paddingClasses[padding]}
        transition-all duration-300 ease-in-out
        hover:shadow-lg
        ${onClick ? 'cursor-pointer hover:scale-105' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  elevation: PropTypes.oneOf(['none', 'sm', 'md', 'lg']),
  onClick: PropTypes.func,
  padding: PropTypes.oneOf(['sm', 'md', 'lg']),
};

export default Card;
