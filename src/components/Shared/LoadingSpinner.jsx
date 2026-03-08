import { Loader } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading...', fullScreen = true }) => {
  const containerClasses = fullScreen
    ? 'flex items-center justify-center min-h-screen bg-gray-50'
    : 'flex items-center justify-center py-12';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className="inline-flex">
          <Loader className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
        <p className="text-gray-600 text-lg mt-4 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
