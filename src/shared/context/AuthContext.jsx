// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@features/auth/services/authService';

// Create the Auth Context
const AuthContext = createContext(null);

// Custom hook to use the Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate(); // Add navigation capability
  
  const [user, setUser] = useState(() => {
    // Initialize user from localStorage on component mount
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize authentication state based on presence of user in localStorage
    return localStorage.getItem('user') ? true : false;
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authCheckInProgress, setAuthCheckInProgress] = useState(false);
  
  // Add debounce timer reference
  const authCheckTimerRef = useRef(null);

  // Function to redirect based on user role
  const redirectToUserDashboard = (userData = user) => {
    if (!userData) return;
    
    if (userData.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  // Verify authentication with the server on component mount
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const verifyAuth = async () => {
      // Skip if already checking or no stored token
      if (authCheckInProgress || !localStorage.getItem('authToken')) {
        setIsLoading(false);
        return;
      }

      setAuthCheckInProgress(true);

      try {
        const result = await authService.checkAuthStatus(controller.signal);
        
        if (!isMounted) return;

        if (result.success && result.user) {
          setUser(result.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('authToken');
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Auth verification error:', err);
        setError(err.message);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setAuthCheckInProgress(false);
        }
      }
    };

    verifyAuth();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []); // Empty dependency array - only run on mount

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.login(email, password);
      
      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // Add automatic redirection after login
        redirectToUserDashboard(result.user);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout API error:', err);
      // Continue with local logout even if API fails
    } finally {
      // Always clear local state
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      setError(null);
      setIsLoading(false);
      
      // Redirect to login page after logout
      navigate('/login');
    }
  };

  // Register function
  const register = async (firstName, lastName, email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.register(firstName, lastName, email, password);
      
      // After successful registration, redirect to login
      if (result.success) {
        navigate('/login', { 
          state: { message: 'Registration successful! Please log in.' }
        });
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Google sign in
  const googleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.googleSignIn();
      
      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // Add automatic redirection after Google sign-in
        redirectToUserDashboard(result.user);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions for roles
  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  const getUserRole = () => {
    return user?.role || 'user';
  };

  // Create the context value
  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    googleSignIn,
    hasRole,
    getUserRole,
    redirectToUserDashboard // Add the redirect function to the context
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;