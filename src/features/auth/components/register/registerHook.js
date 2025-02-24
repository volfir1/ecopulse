// register/registerHook.js
import { useNavigate } from 'react-router-dom';
import { useSnackbar, useLoader } from '@shared/index';
import { authService } from './authService';

export const useRegister = () => {
  const navigate = useNavigate();
  const toast = useSnackbar();
  const { startLoading, stopLoading } = useLoader();

  // Modified to accept Formik form values
  const handleSubmit = async (values, { setSubmitting }) => {
    startLoading();
    setSubmitting(true);
    
    try {
      const result = await authService.register(
        values.email,
        values.phone,
        values.password
      );

      if (result.success) {
        toast.success('Registration successful! Please login.');
        setTimeout(() => {
          navigate('/login');
        }, 800);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      stopLoading();
      setSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    startLoading();
    
    try {
      const result = await authService.googleSignUp();
      
      if (result.success) {
        toast.success('Google sign-up successful!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 800);
      }
    } catch (error) {
      console.error('Google sign-up error:', error);
      toast.error('Google sign-up failed. Please try again.');
    } finally {
      stopLoading();
    }
  };

  return {
    formValues: {
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    },
    formHandlers: {
      handleSubmit,
      handleGoogleSignUp
    }
  };
};