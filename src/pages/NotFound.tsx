import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 mb-6">
          <AlertCircle className="h-12 w-12 text-blue-600" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;