import React from 'react';
import PropTypes from 'prop-types';

/**
 * Form Component - Reusable form with validation
 */
export const Form = ({
  children,
  onSubmit,
  className = '',
}) => {
  return (
    <form onSubmit={onSubmit} className={`space-y-4 ${className}`}>
      {children}
    </form>
  );
};

Form.propTypes = {
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func.isRequired,
  className: PropTypes.string,
};

/**
 * FormGroup Component - Wraps input with label and error
 */
export const FormGroup = ({
  label,
  error = null,
  children,
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

FormGroup.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  children: PropTypes.node.isRequired,
};

/**
 * Input Component
 */
export const Input = React.forwardRef(({
  type = 'text',
  placeholder,
  error = false,
  ...props
}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      placeholder={placeholder}
      className={`
        w-full px-4 py-2 rounded-lg border
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500
        ${error
          ? 'border-red-500 bg-red-50'
          : 'border-gray-300 bg-white'
        }
      `}
      {...props}
    />
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.bool,
};

/**
 * Select Component
 */
export const Select = React.forwardRef(({
  options = [],
  placeholder,
  error = false,
  ...props
}, ref) => {
  return (
    <select
      ref={ref}
      className={`
        w-full px-4 py-2 rounded-lg border
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500
        ${error
          ? 'border-red-500 bg-red-50'
          : 'border-gray-300 bg-white'
        }
      `}
      {...props}
    >
      {placeholder && (
        <option value="">{placeholder}</option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
});

Select.displayName = 'Select';

Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  placeholder: PropTypes.string,
  error: PropTypes.bool,
};

/**
 * Textarea Component
 */
export const Textarea = React.forwardRef(({
  placeholder,
  error = false,
  rows = 4,
  ...props
}, ref) => {
  return (
    <textarea
      ref={ref}
      placeholder={placeholder}
      rows={rows}
      className={`
        w-full px-4 py-2 rounded-lg border resize-none
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500
        ${error
          ? 'border-red-500 bg-red-50'
          : 'border-gray-300 bg-white'
        }
      `}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

Textarea.propTypes = {
  placeholder: PropTypes.string,
  error: PropTypes.bool,
  rows: PropTypes.number,
};

export default Form;
