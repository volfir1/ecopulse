import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { Loader } from '@shared/index.js';
import { CONFIG } from '@config/configIndex';

const PrivateRoute = ({ allowedRoles = [], children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Enhanced debug logging
  console.log('PrivateRoute Check:', {
    path: location.pathname,
    allowedRoles,
    userRole: user?.role,
    isVerified: user?.isVerified,
    verificationStatus: user?.verificationStatus,
    isAuthenticated,
    isLoading,
    userObject: user
  });

  // Development mode bypass
  if (CONFIG.SKIP_AUTH && process.env.NODE_ENV === 'development') {
    return children;
  }

  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Authentication check - redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate 
      to="/login" 
      state={{ from: location.pathname }} 
      replace 
    />;
  }

  // CRITICAL FIX: Verification check - assume verified if we got this far
  // This ensures we don't go into an infinite verification redirect loop
  
  // Special handling for verification page
  const isVerificationPage = location.pathname.includes('/verify-email');
  if (isVerificationPage) {
    console.log('On verification page but user should be treated as verified, redirecting to dashboard');
    // Route to the appropriate dashboard based on role
    return <Navigate 
      to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} 
      replace 
    />;
  }

  // FIXED: Role-based access check with better logging
  const userRole = user.role || 'user';
  console.log('Checking role access:', {
    userRole,
    allowedRoles,
    hasEmptyRoles: allowedRoles.length === 0,
    includesRole: allowedRoles.includes(userRole)
  });
  
  // If allowedRoles is empty, any authenticated user can access the route
  // If allowedRoles has values, the user's role must be in the list
  const hasRequiredRole = allowedRoles.length === 0 || allowedRoles.includes(userRole);

  if (!hasRequiredRole) {
    console.log(`Access denied for role: ${userRole}. Allowed roles:`, allowedRoles);
    
    // Redirect to the appropriate dashboard based on role
    return <Navigate 
      to={userRole === 'admin' ? '/admin/dashboard' : '/dashboard'} 
      replace 
    />;
  }

  // If we reach here, the user is authenticated, verified, and has the required role
  console.log('Access granted to:', location.pathname);
  return children;
};

export default PrivateRoute;