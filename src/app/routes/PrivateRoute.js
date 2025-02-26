import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { Loader } from '@shared/index.js';

const PrivateRoute = ({ allowedRoles = [], children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading && !user) {
    return <Loader />;
  }
  
  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // If authenticated, check role-based access
  if (isAuthenticated && user) {
    const userRole = user.role || 'user';
    
    // Strict role checking - only allow access if the role matches exactly
    const hasRequiredRole = allowedRoles.includes(userRole);
    
    // If user doesn't have required role, redirect to their appropriate dashboard
    if (!hasRequiredRole) {
      if (userRole === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
      } else {
        return <Navigate to="/dashboard" replace />;
      }
    }
  }
  
  return children;
};

export default PrivateRoute;