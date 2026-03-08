import { CheckCircle, X } from 'lucide-react';

const SuccessAlert = ({ message, onClose, dismissible = true, autoClose = true }) => {
  // Auto-close after 5 seconds if autoClose is true
  React.useEffect(() => {
    if (autoClose && dismissible) {
      const timer = setTimeout(() => {
        onClose?.();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, dismissible, onClose]);

  return (
    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <div>
            <p className="text-green-700 font-medium">Success</p>
            <p className="text-green-600 text-sm">{message}</p>
          </div>
        </div>
        {dismissible && (
          <button
            onClick={onClose}
            className="text-green-500 hover:text-green-700 flex-shrink-0 ml-4"
            aria-label="Close alert"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessAlert;
