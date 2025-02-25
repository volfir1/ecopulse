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
    const verifyAuth = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Prevent multiple simultaneous auth checks
      if (authCheckInProgress) return;

      setIsLoading(true);
      setAuthCheckInProgress(true);
      
      try {
        // Verify token with backend
        const result = await authService.checkAuthStatus();
        
        // If request was aborted, just return without changing state
        if (result.aborted) return;
        
        if (result.success && result.user) {
          // Update user data with fresh data from server
          setUser(result.user);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(result.user));
        } else {
          // If verification fails, clear authentication state
          console.log('Auth verification failed, logging out');
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('user');
          localStorage.removeItem('authToken');
        }
      } catch (err) {
        console.error('Auth verification error:', err);
        // Don't automatically log out on network errors to allow offline usage
        // Just set the error state
        setError(err.message);
      } finally {
        setIsLoading(false);
        setAuthCheckInProgress(false);
      }
    };

    // Clear any existing timer
    if (authCheckTimerRef.current) {
      clearTimeout(authCheckTimerRef.current);
    }
    
    // Set a new timer with a small delay to debounce multiple calls
    authCheckTimerRef.current = setTimeout(() => {
      verifyAuth();
    }, 100);
    
    // Cleanup timer on unmount
    return () => {
      if (authCheckTimerRef.current) {
        clearTimeout(authCheckTimerRef.current);
      }
    };
  }, [user, authCheckInProgress]);

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