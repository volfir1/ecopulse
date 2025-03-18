// Streamlined loginHook.js with simplified reactivation handling

import { auth } from '@features/auth/firebase/firebase'; 
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import * as Yup from 'yup';
import { useSnackbar } from '@shared/index';
import authService from '@services/authService';

export const useLogin = () => {
  const { login: contextLogin, googleSignIn: contextGoogleSignIn, setUser, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useSnackbar();
  
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [showRedirectOption, setShowRedirectOption] = useState(false);
  const [isAutoDeactivated, setIsAutoDeactivated] = useState(false);
  const [deactivationInfo, setDeactivationInfo] = useState(null);

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

  // Handle auto-deactivated account
  const handleAutoDeactivatedAccount = async (email) => {
    console.log('Handling auto-deactivated account:', email);
    
    // Set state for reactivation UI
    setIsAutoDeactivated(true);
    setRecoveryEmail(email);
    
    // Show notification
    toast.info("Your account has been automatically deactivated due to inactivity. A reactivation link has been sent to your email.");
    
    try {
      // Send reactivation email
      console.log('Sending reactivation email...');
      const result = await authService.requestReactivation(email);
      
      if (result.success) {
        // Navigate to reactivation page
        navigate('/login', { 
          state: { 
            email: email,
            isAutoDeactivated: true,
            message: "Your account has been automatically deactivated due to inactivity. A reactivation link has been sent to your email."
          },
          replace: true
        });
      } else {
        // Navigate with error info
        navigate('/reactivate-account', { 
          state: { 
            email: email,
            isAutoDeactivated: true,
            hasError: true,
            message: "We encountered an issue sending the reactivation email. Please try requesting a new one."
          },
          replace: true
        });
      }
    } catch (error) {
      console.error('Error in auto-deactivated account flow:', error);
      
      // Navigate with error info
      navigate('/reactivate-account', { 
        state: { 
          email: email,
          isAutoDeactivated: true,
          hasError: true,
          message: "We encountered an issue sending the reactivation email. Please try requesting a new one."
        },
        replace: true
      });
    }
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

  // Request account reactivation email
  const handleRequestReactivation = async () => {
    if (!recoveryEmail) {
      toast.error("Email is required");
      return;
    }
    
    startLoading();
    
    try {
      const result = await authService.requestReactivation(recoveryEmail);
      
      if (result.success) {
        toast.success("Reactivation email sent. Please check your inbox and follow the instructions.");
        
        // Redirect to reactivation page with email info
        navigate('/reactivate-account', { 
          state: { 
            email: recoveryEmail,
            isAutoDeactivated: true,
            message: "A reactivation link has been sent to your email."
          },
          replace: true
        });
      } else {
        toast.error(result.message || "Failed to send reactivation email");
      }
    } catch (error) {
      handleAuthError(error);
    } finally {
      stopLoading();
    }
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    console.log('Login attempt:', { email: values.email });
    setSubmitting(true);
    setAuthError(null);
    startLoading();
    
    try {
      // First check if the account is auto-deactivated
      const statusCheck = await authService.checkAccountStatus(values.email);
      console.log('Account status check result:', statusCheck);
      
      // If account exists and is auto-deactivated, handle accordingly
      if (statusCheck.exists && statusCheck.isAutoDeactivated) {
        console.log('Account is auto-deactivated:', statusCheck);
        
        // Store deactivation info
        setDeactivationInfo({
          email: values.email,
          deactivatedAt: statusCheck.deactivatedAt,
          tokenExpired: statusCheck.tokenExpired
        });
        
        // Handle the auto-deactivated account flow
        await handleAutoDeactivatedAccount(values.email);
        
        setSubmitting(false);
        stopLoading();
        return;
      }
      
      // Continue with normal login flow
      const result = await contextLogin(values.email, values.password);
      console.log('Login result:', result);
      
      // Check if the login automatically reactivated an account
      if (result && result.wasReactivated) {
        console.log('Account was automatically reactivated during login:', result);
        
        // Show success message
        toast.success("Your account has been reactivated. Welcome back!");
        
        // Validate user data
        if (!result.user) {
          toast.error('Invalid response from server');
          setSubmitting(false);
          stopLoading();
          return;
        }
        
        // Store the user and auth token
        localStorage.setItem('user', JSON.stringify(result.user));
        if (result.user.accessToken) {
          localStorage.setItem('authToken', result.user.accessToken);
        }
        
        // Update the auth context
        setUser(result.user);
        setIsAuthenticated(true);
        
        // Show welcome back message
        handleAuthSuccess(result.user);
        
        // Navigate based on role
        if (result.user.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
        
        setSubmitting(false);
        stopLoading();
        return;
      }
      
      // Handle login failures
      if (!result || !result.success) {
        const errorMessage = result?.message || 'Login failed. Please try again.';
        toast.error(errorMessage);
        setSubmitting(false);
        stopLoading();
        return;
      }
      
      // Rest of your existing login success handling code
      if (!result.user) {
        toast.error('Invalid response from server');
        setSubmitting(false);
        stopLoading();
        return;
      }
      
      // Check verification status
      console.log('Checking verification status:', {
        userEmail: result.user.email,
        explicitVerification: !!result.isVerified,
        userVerification: !!result.user.isVerified,
        requireVerification: !!result.requireVerification
      });
      
      // Redirect to verification if required
      if (result.requireVerification === true) {
        console.log('Server explicitly requires verification');
        navigate('/verify-email', { 
          state: { 
            userId: result.user.id || result.userId, 
            email: values.email 
          } 
        });
        setSubmitting(false);
        stopLoading();
        return;
      }
      
      // If we get here, consider the user verified
      console.log('User considered verified, proceeding with login');
      
      // Ensure the user has the isVerified flag set to true
      const verifiedUser = {
        ...result.user,
        isVerified: true // Force this to be true
      };
      
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
      
      // Navigate based on role
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

  // Updated for consistency with reactivate endpoint
  const handleGoogleSignIn = async () => {
    try {
      setAuthError(null);
      setShowRedirectOption(false);
      startLoading();
  
      // Remove the initialization check since it's causing double popup
      console.log('Starting Google sign-in attempt');
  
      const result = await contextGoogleSignIn();
      console.log('Google sign-in result received:', result);
  
      if (result && result.email) {
        // Check account status after successful sign-in
        const statusCheck = await authService.checkAccountStatus(result.email);
        console.log('Account status check result:', statusCheck);
  
        if (statusCheck.exists && statusCheck.isAutoDeactivated) {
          console.log('Account is auto-deactivated:', statusCheck);
          
          setDeactivationInfo({
            email: result.email,
            deactivatedAt: statusCheck.deactivatedAt,
            tokenExpired: statusCheck.tokenExpired
          });
  
          await handleAutoDeactivatedAccount(result.email);
          stopLoading();
          return;
        }
      }
  
      // Handle verification requirement
      if (result && result.requireVerification) {
        console.log('Account requires verification:', result);
        navigate('/verify-email', { 
          state: { 
            userId: result.userId, 
            email: result.email || '' 
          } 
        });
        toast.info(result.message || "Please verify your email to complete sign-in.");
        stopLoading();
        return;
      }
  
      if (result && result.success) {
        toast.success('Google sign-in successful');
      } else {
        throw new Error(result?.message || 'Google sign-in failed');
      }
  
    } catch (error) {
      console.error('Google sign-in error:', error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        toast.info('Sign-in was cancelled');
        setAuthError('Sign-in was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Sign-in popup was blocked. Please try again or use redirect sign-in.');
        setAuthError('Browser blocked the popup. Please enable popups or use redirect sign-in.');
        setShowRedirectOption(true);
      } else {
        handleAuthError(error);
      }
    } finally {
      stopLoading();
    }
  };

  // Google Redirect Sign-in handler
  const handleGoogleRedirectSignIn = async () => {
    try {
      setAuthError(null);
      startLoading();
      
      toast.info("Redirecting to Google sign-in...");
      
      // Use the redirect method instead of popup
      await authService.googleSignInWithRedirect();
      
      // This function will redirect the browser, so we won't reach the code below
      // The result will be handled when the user returns to the app
      
    } catch (error) {
      console.error('Google redirect sign-in error:', error);
      handleAuthError(error);
      stopLoading();
    }
  };

  return {
    isLoading,
    authError,
    handleSubmit,
    handleGoogleSignIn,
    handleGoogleRedirectSignIn,
    showRedirectOption,
    initialValues,
    validationSchema,
    // Account reactivation props
    isAutoDeactivated,
    recoveryEmail,
    setRecoveryEmail,
    handleRequestReactivation,
    deactivationInfo
  };
};