import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../components/Shared';
import { Lock, Home } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="max-w-md text-center">
        <div className="p-8">
          <Lock className="mx-auto text-red-500 mb-4" size={64} />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 w-full"
          >
            <Home size={18} />
            Go Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Unauthorized;
