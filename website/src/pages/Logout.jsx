import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Loader } from 'lucide-react';

const Logout = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  // D-26 fix: Capture user name before logout clears the user object
  const [userName] = useState(() => user?.name || '');

  useEffect(() => {
    // Perform logout
    const performLogout = async () => {
      try {
        console.log('Starting logout process...');
        await logout();
        console.log('Logout completed');
        
        // Wait a moment for state to update
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Navigate to login with replace to prevent back button access
        navigate('/login', { replace: true });
      } catch (error) {
        console.error('Error during logout:', error);
        // Still navigate to login even if logout fails
        navigate('/login', { replace: true });
      }
    };

    performLogout();
  }, [logout, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="bg-white rounded-lg shadow-2xl p-12 max-w-md mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-4 rounded-full">
              <LogOut size={48} className="text-red-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Logging Out</h1>
          <p className="text-gray-600 mb-6">
            {userName ? `Goodbye, ${userName}!` : 'See you soon!'}
          </p>
          
          <div className="flex justify-center mb-6">
            <Loader size={32} className="text-red-600 animate-spin" />
          </div>
          
          <p className="text-sm text-gray-500">Please wait while we sign you out...</p>
        </div>
      </div>
    </div>
  );
};

export default Logout;
