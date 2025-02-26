// hooks/useLogin.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoader } from '@components/loaders/useLoader';
import { useSnackbar } from '@shared/index';
import { LoginSchema } from './validation';
import { useAuth } from '@context/AuthContext';

export const useLogin = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoader();
  const toast = useSnackbar();
  const [authError, setAuthError] = useState(null);
  
  // Use the AuthContext
  const { 
    login: contextLogin, 
    googleSignIn: contextGoogleSignIn,
    logout: contextLogout,
    user
  } = useAuth();

  // Modified to handle role-based redirection
  const handleAuthSuccess = (userData) => {
    toast.success('Welcome back! Successfully logged in.');
    
    setTimeout(() => {
      // Redirect based on user role
      if (userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/modules/solar');
      }
    }, 800);
  };

  const handleAuthError = (error) => {
    console.error('Authentication error:', error);
    setAuthError(error.message);
    toast.error(error.message || 'Authentication failed. Please try again.');
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log('Login attempt:', { email: values.email });
    setAuthError(null);
    startLoading();
    
    try {
      // Use the login function from AuthContext
      const result = await contextLogin(values.email, values.password);
      if (result.success) {
        handleAuthSuccess(result.user);
      }
    } catch (error) {
      handleAuthError(error);
    } finally {
      stopLoading();
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    console.log('Starting Google Sign-in');
    setAuthError(null);
    startLoading();
    
    try {
      // Use the googleSignIn function from AuthContext
      const result = await contextGoogleSignIn();
      if (result.success) {
        handleAuthSuccess(result.user);
      }
    } catch (error) {
      handleAuthError(error);
    } finally {
      stopLoading();
    }
  };

  const logout = async () => {
    try {
      // Call the logout function from AuthContext
      await contextLogout();
      toast.success('Successfully logged out');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  return {
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: LoginSchema,
    handleSubmit,
    handleGoogleSignIn,
    logout,
    user,
    authError,
    isAuthenticated: !!user,
    hasRole: (role) => user?.role === role,
    userRole: user?.role || 'user'
  };
};