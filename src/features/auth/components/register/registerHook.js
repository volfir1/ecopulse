// register/registerHook.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar, useLoader } from '@shared/index';
import  authService  from '../../services/authService';
import { calculatePasswordStrength } from './passwordUtils';

export const useRegister = () => {
  const navigate = useNavigate();
  const toast = useSnackbar();
  const { startLoading, stopLoading } = useLoader();
  
  // Password visibility states
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  
  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: 'empty',
    color: 'gray-300',
    feedback: 'Enter a password'
  });

  // Modified to accept Formik form values
  const handleSubmit = async (values, { setSubmitting }) => {
    startLoading();
    setSubmitting(true);
    
    try {
      const result = await authService.register(
        values.firstName,
        values.lastName,
        values.email,
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

  const togglePasswordVisibility = () => {
    setPasswordVisible(prev => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(prev => !prev);
  };

  // Password strength handler
  const handlePasswordChange = (e, handleChange) => {
    const password = e.target.value;
    setPasswordStrength(calculatePasswordStrength(password));
    
    // Make sure Formik also updates the field
    if (handleChange) {
      handleChange(e);
    }
  };

  return {
    formValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    },
    passwordVisibility: {
      passwordVisible,
      confirmPasswordVisible
    },
    passwordStrength,
    formHandlers: {
      handleSubmit,
      handleGoogleSignUp,
      togglePasswordVisibility,
      toggleConfirmPasswordVisibility,
      handlePasswordChange
    }
  };
};