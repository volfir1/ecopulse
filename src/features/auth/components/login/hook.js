import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoader } from '@components/loaders/useLoader';
import { useSnackbar } from '@shared/index';
import * as Yup from 'yup';

// Validation schema - can be extended later
export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required')
});

// Mock authentication service - replace with real auth later
const authService = {
  login: async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Prototype validation
    if (email === 'test@example.com' && password === 'Test1234') {
      return { success: true, user: { email, name: 'Test User' }};
    }
    throw new Error('Invalid credentials');
  },
  
  googleSignIn: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, user: { email: 'google@example.com', name: 'Google User' }};
  },

  // Add more auth methods here later
};

export const useLogin = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoader();
  const toast = useSnackbar();
  const [authError, setAuthError] = useState(null);

  // Store user data - integrate with your state management later
  const [user, setUser] = useState(null);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    // You can add token storage, user data persistence, etc. here later
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

  // Helper method to check auth state - can be extended later
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

  // Logout function - can be extended later
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

export default useLogin;