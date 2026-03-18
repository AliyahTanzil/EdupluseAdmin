import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertTriangle, Clock, LogOut } from 'lucide-react';

const SessionWarning = () => {
  const { showSessionWarning, extendSession, logout, isOnline } = useAuth();
  const [countdown, setCountdown] = useState(120); // 2 minutes

  useEffect(() => {
    if (!showSessionWarning) return;

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          logout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showSessionWarning, logout]);

  if (!showSessionWarning) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-yellow-100 rounded-full">
            <AlertTriangle className="text-yellow-600" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Session Expiring</h2>
        </div>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Your session is about to expire due to inactivity. You will be automatically logged out in:
        </p>

        {/* Countdown */}
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="text-red-600" size={20} />
            <span className="text-3xl font-bold text-red-600">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
          <p className="text-sm text-red-600 font-medium">minutes remaining</p>
        </div>

        {/* Connection Status */}
        {!isOnline && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700 font-medium">
              ⚠️ No internet connection detected. You will be logged out immediately if connection is not restored.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={extendSession}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Clock size={18} />
            Stay Logged In
          </button>
          <button
            onClick={logout}
            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Logout Now
          </button>
        </div>

        {/* Info */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Your session will automatically expire after 15 minutes of inactivity for security purposes.
        </p>
      </div>
    </div>
  );
};

export default SessionWarning;
