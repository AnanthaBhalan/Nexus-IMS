import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#ccff00] mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 bg-[#ccff00] text-black hover:bg-[#ccff00]/90 rounded-lg font-medium transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;
