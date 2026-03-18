import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Wifi, WifiOff } from 'lucide-react';

const OfflineNotification = () => {
  const { isOnline, user } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isOnline && user) {
      setShow(true);
    } else {
      // Fade out notification after 2 seconds when back online
      if (isOnline) {
        const timer = setTimeout(() => setShow(false), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [isOnline, user]);

  if (!show) return null;

  return (
    <div className={`fixed top-4 right-4 max-w-md mx-4 rounded-lg shadow-lg animate-slide-in-right z-50 ${
      isOnline 
        ? 'bg-green-100 border border-green-300' 
        : 'bg-red-100 border border-red-300'
    }`}>
      <div className="flex items-center gap-3 p-4">
        {isOnline ? (
          <>
            <div className="p-2 bg-green-200 rounded-full">
              <Wifi className="text-green-600" size={20} />
            </div>
            <div>
              <p className="font-semibold text-green-900">Connection Restored</p>
              <p className="text-sm text-green-700">You're back online</p>
            </div>
          </>
        ) : (
          <>
            <div className="p-2 bg-red-200 rounded-full animate-pulse">
              <WifiOff className="text-red-600" size={20} />
            </div>
            <div>
              <p className="font-semibold text-red-900">No Connection</p>
              <p className="text-sm text-red-700">You will be logged out immediately</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OfflineNotification;
