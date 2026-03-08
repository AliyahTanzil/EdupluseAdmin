import React from 'react';
import PropTypes from 'prop-types';
import { AlertCircle, X } from 'lucide-react';

const ErrorAlert = ({ message, onClose, dismissible = true }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div>
            <p className="text-red-700 font-medium">Error</p>
            <p className="text-red-600 text-sm">{message}</p>
          </div>
        </div>
        {dismissible && (
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 flex-shrink-0 ml-4"
            aria-label="Close alert"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

ErrorAlert.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  dismissible: PropTypes.bool,
};

export default ErrorAlert;
