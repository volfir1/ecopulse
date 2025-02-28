// In PrivateRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { Loader } from '@shared/index.js';
import { CONFIG } from '@config/configIndex';

const PrivateRoute = ({ allowedRoles = [], children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // For debugging
  console.log('PrivateRoute - Path:', location.pathname);
  console.log('PrivateRoute - Allowed Roles:', allowedRoles);
  console.log('PrivateRoute - User Role:', user?.role);
  console.log('PrivateRoute - SKIP_AUTH:', CONFIG.SKIP_AUTH);
  console.log('PrivateRoute - User:', user);
  
  // In development mode with SKIP_AUTH enabled
  if (CONFIG.SKIP_AUTH && process.env.NODE_ENV === 'development') {
    console.log('Development mode: Authentication bypassed');
    
    // If you want to completely bypass role checking in dev mode, uncomment this
    // return children;
    
    // If you want to simulate role checking but still see errors, keep this
    if (!user) {
      console.error('Development mode: No user found even with SKIP_AUTH enabled');
      return <div>Error: No development user found. Check your AuthContext setup.</div>;
    }
    
    // Check role-based access in dev mode
    const userRole = user.role || 'user';
    const hasRequiredRole = allowedRoles.includes(userRole);
    
    console.log(`Dev mode - User role: ${userRole}, Required roles: ${allowedRoles.join(',')}, Has access: ${hasRequiredRole}`);
    
    // In dev mode, we'll still log the access denial but let the user through
    if (!hasRequiredRole) {
      console.warn(`Development mode: User with role "${userRole}" doesn't technically have access to this route, but allowing anyway for development.`);
    }
    
    // Allow access in dev mode regardless of role
    return children;
  }
  
  // Normal production behavior below
  if (isLoading) {
    return <Loader />;
  }
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // If authenticated, check role-based access
  const userRole = user.role || 'user';
  const hasRequiredRole = allowedRoles.includes(userRole);
  
  // If user doesn't have required role, redirect to their appropriate dashboard
  if (!hasRequiredRole) {
    if (userRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  return children;
};

export default PrivateRoute;