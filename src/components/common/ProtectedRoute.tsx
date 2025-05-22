import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

interface ProtectedRouteProps {
  role: 'student' | 'recruiter' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role }) => {
  const { user } = useUser();
  
  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If user doesn't have the required role, redirect to homepage
  if (user.role !== role) {
    return <Navigate to="/" replace />;
  }
  
  // If everything is fine, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;