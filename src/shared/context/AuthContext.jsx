// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONFIG } from '@config/configIndex';
// Import authService dynamically to avoid circular dependencies
import authService from '@features/auth/services/authService';

// Create the Auth Context first
const AuthContext = createContext(null);

// Export the context directly for advanced use cases
export default AuthContext;

// Then define the hook with a fallback return for safety
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.warn('useAuth used outside AuthProvider - returning fallback auth');
    // Return a fallback auth object for development
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: () => console.error('Auth not initialized'),
      logout: () => console.error('Auth not initialized'),
      register: () => console.error('Auth not initialized'),
      googleSignIn: () => console.error('Auth not initialized'),
      hasRole: () => false,
      getUserRole: () => 'user'
    };
  }
  return context;
};

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  
  const [user, setUser] = useState(() => {
    // Only create mock user if explicitly in development mode with SKIP_AUTH
    if (CONFIG.SKIP_AUTH && process.env.NODE_ENV === 'development') {
      console.log('Development mode with SKIP_AUTH: Using mock user');
      return {
        id: 'dev-user-id',
        firstName: 'Development',
        lastName: 'User',
        email: 'dev@example.com',
        role: CONFIG.DEFAULT_ROLE || 'admin',
      };
    }
    
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
    // Only auto-authenticate if explicitly in development mode with SKIP_AUTH
    if (CONFIG.SKIP_AUTH && process.env.NODE_ENV === 'development') {
      console.log('Development mode with SKIP_AUTH: Auto-authenticated');
      return true;
    }
    
    // Initialize authentication state based on presence of user in localStorage
    return localStorage.getItem('user') ? true : false;
  });
  
  const [isLoading, setIsLoading] = useState(() => {
    // Don't show loading in dev mode with SKIP_AUTH
    return !(CONFIG.SKIP_AUTH && process.env.NODE_ENV === 'development');
  });
  
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
    // Skip authentication check in development mode with SKIP_AUTH
    if (CONFIG.SKIP_AUTH && process.env.NODE_ENV === 'development') {
      console.log('Development mode: Authentication check bypassed');
      setIsLoading(false);
      return;
    }
    
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
  }, []);

  // Login function
  const login = async (email, password) => {
    // In development mode with SKIP_AUTH, simulate successful login
    if (CONFIG.SKIP_AUTH && process.env.NODE_ENV === 'development') {
      console.log('Development mode: Login bypassed');
      const mockUser = {
        id: 'dev-user-id',
        firstName: 'Development',
        lastName: 'User',
        email: email || 'dev@example.com',
        role: CONFIG.DEFAULT_ROLE || 'admin',
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Add automatic redirection after login
      redirectToUserDashboard(mockUser);
      
      return { success: true, user: mockUser };
    }
    
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
    // Special handling for development mode
    if (CONFIG.SKIP_AUTH && process.env.NODE_ENV === 'development') {
      console.log('Development mode: Simulating logout but maintaining dev access');
      
      // Instead of clearing user, reset to default dev user
      const mockUser = {
        id: 'dev-user-id',
        firstName: 'Development',
        lastName: 'User',
        email: 'dev@example.com',
        role: CONFIG.DEFAULT_ROLE || 'admin',
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Still redirect to login page for flow testing
      window.location.href = '/login';
      return;
    }
    
    // Normal logout process for production
    setIsLoading(true);
    
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout API error:', err);
    } finally {
      // Clear ALL user data and tokens
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('authToken');
      
      // Delete all cookies
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      setError(null);
      setIsLoading(false);
      
      // Force redirect to login page
      window.location.href = '/login';
    }
  };

  // Register function
  const register = async (firstName, lastName, email, password) => {
    // In development mode, simulate successful registration
    if (CONFIG.SKIP_AUTH && process.env.NODE_ENV === 'development') {
      console.log('Development mode: Registration bypassed');
      navigate('/login', { 
        state: { message: 'Development mode: Registration successful! Please log in.' }
      });
      
      return { success: true };
    }
    
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
    // In development mode, simulate successful Google sign-in
    if (CONFIG.SKIP_AUTH && process.env.NODE_ENV === 'development') {
      console.log('Development mode: Google sign-in bypassed');
      const mockUser = {
        id: 'dev-user-id',
        firstName: 'Development',
        lastName: 'User',
        email: 'dev-google@example.com',
        role: CONFIG.DEFAULT_ROLE || 'admin',
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Add automatic redirection after Google sign-in
      redirectToUserDashboard(mockUser);
      
      return { success: true, user: mockUser };
    }
    
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
    setUser, // Expose setUser for development tools
    isAuthenticated,
    setIsAuthenticated, // Expose setIsAuthenticated for development tools
    isLoading,
    error,
    login,
    logout,
    register,
    googleSignIn,
    hasRole,
    getUserRole,
    redirectToUserDashboard,
    isDevelopmentMode: CONFIG.SKIP_AUTH && process.env.NODE_ENV === 'development'
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};