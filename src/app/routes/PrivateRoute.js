// src/routes/PrivateRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { Loader } from '@shared/index.js';

/**
 * PrivateRoute component that handles authentication and role-based routing
 */
const PrivateRoute = ({ allowedRoles = [], children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Only show loader during initial authentication check
  if (isLoading && !user) {
    return <Loader />;
  }
  
  // If not authenticated and not loading, redirect to login
  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // If authenticated, check role-based access
  if (isAuthenticated && user) {
    const userRole = user.role || 'user';
    const hasRequiredRole = allowedRoles.length === 0 || allowedRoles.includes(userRole);
    
    // If user doesn't have required role, redirect to appropriate dashboard
    if (!hasRequiredRole) {
      if (userRole === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
      } else {
        return <Navigate to="/dashboard" replace />;
      }
    }
  }
  
  // If we get here, user is authenticated and has the required role (or is still loading)
  // In the loading case, we'll show the children with the expectation that
  // authentication will complete and either confirm access or redirect
  return children;
};

export default PrivateRoute;