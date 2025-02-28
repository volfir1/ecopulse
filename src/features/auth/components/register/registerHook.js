// register/registerHook.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar, useLoader } from '@shared/index';
import authService from '../../services/authService';
import { calculatePasswordStrength } from './passwordUtils';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase/firebase'; // Make sure this import path is correct

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

  // Handle normal form submission
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

  // Enhanced Google Sign Up function
  const handleGoogleSignUp = async () => {
    startLoading();
    
    try {
      // 1. Initialize Google Auth Provider
      const provider = new GoogleAuthProvider();
      
      // 2. Add scopes if needed
      provider.addScope('profile');
      provider.addScope('email');
      
      // 3. Set custom parameters (optional)
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      // 4. Trigger the Google sign-in popup
      const result = await signInWithPopup(auth, provider);
      
      // 5. Get the Google user information
      const user = result.user;
      
      // 6. Get credentials including access token
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      
      // 7. Get the ID token
      const idToken = await user.getIdToken();
      
      // 8. Send the token to your backend to create or authenticate the user
      const response = await fetch("http://localhost:5000/api/auth/google-signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken: idToken,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid
        }),
        credentials: "include"
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Google sign-in failed");
      }
      
      // Save token to localStorage if provided
      if (data.user && data.user.accessToken) {
        localStorage.setItem('authToken', data.user.accessToken);
      }
      
      // 9. Handle successful registration
      toast.success('Google sign-up successful!');
      setTimeout(() => {
        navigate('/dashboard'); // Navigate to dashboard after successful registration
      }, 800);
      
    } catch (error) {
      console.error('Google sign-up error:', error);
      
      // Handle different Firebase Auth errors
      if (error.code) {
        switch (error.code) {
          case 'auth/popup-closed-by-user':
            toast.error('Sign-up canceled. You closed the popup.');
            break;
          case 'auth/popup-blocked':
            toast.error('Sign-up popup was blocked by your browser. Please enable popups.');
            break;
          case 'auth/account-exists-with-different-credential':
            toast.error('An account already exists with the same email address but different sign-in credentials.');
            break;
          default:
            toast.error(`Google sign-up failed: ${error.message}`);
        }
      } else {
        toast.error(error.message || 'Google sign-up failed. Please try again.');
      }
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