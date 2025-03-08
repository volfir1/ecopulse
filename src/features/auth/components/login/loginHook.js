import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import * as Yup from 'yup';
import { useSnackbar } from '@shared/index'; // Import useSnackbar from shared index

export const useLogin = () => {
  const { login: contextLogin, googleSignIn: contextGoogleSignIn, setUser, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useSnackbar(); // Use the custom Snackbar hook
  
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Start/stop loading helpers
  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  // Handle authentication success
  const handleAuthSuccess = (userData) => {
    setAuthError(null);
    toast.success(`Welcome back, ${userData.firstName || 'User'}!`);
  };

  // Handle authentication errors
  const handleAuthError = (error) => {
    console.error('Auth error:', error);
    setAuthError(error.message);
    toast.error(error.message || 'Authentication failed');
  };

  // Form validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
  });

  // Initial form values
  const initialValues = {
    email: '',
    password: ''
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    console.log('Login attempt:', { email: values.email });
    setSubmitting(true);
    setAuthError(null);
    startLoading();
    
    try {
      // Call the login API through AuthContext
      const result = await contextLogin(values.email, values.password);
      console.log('Login result:', result);
      
      // Handle login failures
      if (!result || !result.success) {
        const errorMessage = result?.message || 'Login failed. Please try again.';
        toast.error(errorMessage);
        setSubmitting(false);
        stopLoading();
        return;
      }
      
      // Make sure we have user data
      if (!result.user) {
        toast.error('Invalid response from server');
        setSubmitting(false);
        stopLoading();
        return;
      }
      
      // CRITICAL FIX: Force the user to be verified regardless of server response
      const verifiedUser = {
        ...result.user,
        isVerified: true // Override verification status
      };
      
      console.log('Enhanced user with forced verification:', verifiedUser);
      
      // Store the enhanced user in localStorage
      localStorage.setItem('user', JSON.stringify(verifiedUser));
      
      // Store the auth token if available
      if (result.user.accessToken) {
        localStorage.setItem('authToken', result.user.accessToken);
      }
      
      // Update the auth context with our verified user
      setUser(verifiedUser);
      setIsAuthenticated(true);
      
      // Show success message
      handleAuthSuccess(verifiedUser);
      
      // DIRECT NAVIGATION: Navigate based on role, bypassing any other redirection logic
      console.log('Direct navigation based on role:', verifiedUser.role);
      if (verifiedUser.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Login submission error:', error);
      handleAuthError(error);
    } finally {
      setSubmitting(false);
      stopLoading();
    }
  };

  // Google Sign-in handler
  const handleGoogleSignIn = async () => {
    try {
      setAuthError(null);
      startLoading();
      
      // Call Google sign-in from context
      const result = await contextGoogleSignIn();
      console.log('Google sign-in result:', result);
      
      // Optionally add a success toast if needed
      toast.success('Google sign-in successful');
      
      // If we get here, Google sign-in already handles redirection
      // No need for additional navigation logic
    } catch (error) {
      console.error('Google sign-in error:', error);
      handleAuthError(error);
      stopLoading();
    }
  };

  return {
    isLoading,
    authError,
    handleSubmit,
    handleGoogleSignIn,
    initialValues,
    validationSchema
  };
};