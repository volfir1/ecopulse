// hooks/useLogin.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoader } from '@components/loaders/useLoader';
import { useSnackbar } from '@shared/index';
import { LoginSchema } from './validation';
import { authService } from './authService';

export const useLogin = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoader();
  const toast = useSnackbar();
  const [authError, setAuthError] = useState(null);
  const [user, setUser] = useState(null);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    toast.success('Welcome back! Successfully logged in.');
    
    setTimeout(() => {
      navigate('/dashboard');
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
      const result = await authService.login(values.email, values.password);
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
      const result = await authService.googleSignIn();
      if (result.success) {
        handleAuthSuccess(result.user);
      }
    } catch (error) {
      handleAuthError(error);
    } finally {
      stopLoading();
    }
  };

  const checkAuth = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        return true;
      } catch (error) {
        console.error('Error parsing stored user data:', error);
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Successfully logged out');
    navigate('/login');
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
    checkAuth,
    user,
    authError,
    isAuthenticated: !!user
  };
};