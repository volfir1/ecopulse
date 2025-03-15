// Add this import at the top of your loginHook.js file
import { auth } from '@features/auth/firebase/firebase'; // Adjust the path to match your project structure

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
  const [showRecoveryOption, setShowRecoveryOption] = useState(false);
  const [showRedirectOption, setShowRedirectOption] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [lockoutInfo, setLockoutInfo] = useState(null);

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

  // Redirect to deactivated account page
  const redirectToDeactivatedPage = (email, lockoutHours = null) => {
    console.log('Redirecting to deactivated page:', { email, lockoutHours });
    
    navigate('/account-deactivated', { 
      state: { 
        email: email,
        lockoutHours: lockoutHours,
        isLocked: !!lockoutHours,
        isDeactivated: true
      },
      replace: true  // Use replace to prevent going back to login
    });
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

  // Request account recovery email
  const handleRequestRecovery = async () => {
    if (!recoveryEmail) {
      toast.error("Email is required");
      return;
    }
    
    startLoading();
    
    try {
      const result = await authService.requestAccountRecovery(recoveryEmail);
      
      if (result.success) {
        toast.success("Recovery email sent. Please check your inbox and follow the instructions.");
        // Redirect to deactivated account page with email info
        redirectToDeactivatedPage(recoveryEmail);
      } else {
        toast.error(result.message || "Failed to send recovery email");
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
      // First, check if the account is deactivated
      const deactivatedCheck = await authService.checkDeactivatedAccount(values.email);
      
      // If the account is deactivated, redirect to deactivated account page
      if (deactivatedCheck.isDeactivated) {
        console.log('Account is deactivated:', deactivatedCheck);
        
        // Send recovery email automatically
        await authService.requestAccountRecovery(values.email);
        
        // If in lockout period, pass that information
        if (deactivatedCheck.lockoutRemaining) {
          toast.warning(`This account is deactivated. Recovery is locked for ${deactivatedCheck.lockoutRemaining} more hours.`);
          redirectToDeactivatedPage(values.email, deactivatedCheck.lockoutRemaining);
        } else {
          toast.info("This account has been deactivated. A recovery link has been sent to your email.");
          redirectToDeactivatedPage(values.email);
        }
        
        setSubmitting(false);
        stopLoading();
        return;
      }
      
      // Normal login flow if account is not deactivated
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
      
      // FIXED: Check verification status properly with improved logging
      console.log('Checking verification status:', {
        userEmail: result.user.email,
        explicitVerification: !!result.isVerified,
        userVerification: !!result.user.isVerified,
        requireVerification: !!result.requireVerification
      });
      
      // Only redirect to verification if explicitly required by the server
      // CRITICAL CHANGE: Default to NOT requiring verification unless explicitly stated
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
      
      console.log('Enhanced user with verified flag:', verifiedUser);
      
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

  // Updated handleGoogleSignIn function to handle the "email already exists" error
  const handleGoogleSignIn = async () => {
    try {
      setAuthError(null);
      setShowRedirectOption(false); // Reset redirect option on new attempt
      startLoading();
      
      console.log('Starting Google sign-in attempt');
      
      // Try Google sign-in
      const result = await contextGoogleSignIn();
      
      console.log('Google sign-in result received:', result);
      
      // CRITICAL: Handle deactivated account
      if (result && result.isDeactivated === true) {
        console.log('Detected deactivated account through Google sign-in:', result.email);
        
        // Set state for recovery UI
        setIsDeactivated(true);
        setRecoveryEmail(result.email || '');
        setShowRecoveryOption(true);
        
        // Show notification
        toast.info(result.message || "This account has been deactivated. A recovery link has been sent to your email.");
        
        // Directly redirect to deactivated account page
        if (result.email) {
          console.log('Redirecting to deactivated account page with email:', result.email);
          
          // We need to use navigate directly instead of the redirectToDeactivatedPage helper
          // to ensure it happens immediately
          navigate('/account-deactivated', { 
            state: { 
              email: result.email,
              isDeactivated: true,
              // Don't set lockout hours if we don't have that information
            }
          });
        }
        
        stopLoading();
        return;
      }
      
      // Handle verification requirement
      if (result && result.requireVerification) {
        console.log('Account requires verification:', result);
        
        // Navigate to verification page
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
      
      // Handle successful sign-in
      if (result && result.success) {
        toast.success('Google sign-in successful');
        // Navigation will be handled by AuthContext
      } else {
        // If we got a result but it wasn't successful or one of the special cases above
        console.warn('Unhandled Google sign-in result type:', result);
        throw new Error(result?.message || 'Google sign-in failed for an unknown reason');
      }
      
    } catch (error) {
      console.error('Google sign-in error:', error);
      
      // SPECIAL CASE: Email already exists - treat as deactivated account
      if (error.message && error.message.includes('email already exists')) {
        console.log('Caught "email already exists" error - treating as deactivated account');
        
        // Extract the email from Google authentication
        let email = '';
        try {
          // Attempt to get the email from Firebase directly
          const currentUser = auth.currentUser;
          if (currentUser && currentUser.email) {
            email = currentUser.email;
            console.log('Got email from Firebase user:', email);
          }
        } catch (authError) {
          console.error('Error getting current user email:', authError);
        }
        
        // If we couldn't get email from Firebase, try extracting from error message
        if (!email) {
          try {
            // Try to extract email from error message if it exists
            const matches = error.message.match(/email: "([^"]+)"/);
            if (matches && matches[1]) {
              email = matches[1];
              console.log('Extracted email from error message:', email);
            }
          } catch (extractError) {
            console.error('Error extracting email from error message:', extractError);
          }
        }
        
        // Set UI state for recovery
        setIsDeactivated(true);
        setRecoveryEmail(email);
        setShowRecoveryOption(true);
        
        // Show helpful message
        toast.info("It seems this account may be deactivated. You can request recovery below or using the account recovery option.");
        
        // If we have an email, automatically request recovery
        if (email) {
          // Use the recovery function directly
          setIsLoading(true);
          toast.info("Sending account recovery email...");
          
          try {
            const recoveryResult = await authService.requestAccountRecovery(email);
            
            if (recoveryResult.success) {
              toast.success("Recovery email sent. Please check your inbox and follow the instructions.");
              
              // Navigate to deactivated account page
              navigate('/account-deactivated', { 
                state: { 
                  email: email,
                  isDeactivated: true
                },
                replace: true
              });
            } else {
              toast.error(recoveryResult.message || "Failed to send recovery email");
            }
          } catch (recoveryError) {
            console.error('Error requesting recovery:', recoveryError);
            toast.error("Failed to send recovery email. Please try again manually.");
          } finally {
            setIsLoading(false);
          }
        } else {
          // Show manual recovery UI if we couldn't get the email
          setAuthError("This account may be deactivated. Please enter your email to request recovery.");
        }
      }
      // Handle popup blocking
      else if (error.message.includes('popup')) {
        toast.error('Sign-in popup was blocked. Try redirect sign-in instead or enable popups in your browser settings.');
        setAuthError('Browser blocked the popup. Try redirect sign-in instead or enable popups in your browser settings.');
        setShowRedirectOption(true);
      } else if (error.message.includes('closed')) {
        toast.error('Sign-in was cancelled');
        setAuthError('Sign-in was cancelled. Please try again.');
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
    // Account recovery props
    isDeactivated,
    showRecoveryOption,
    lockoutInfo,
    recoveryEmail,
    setRecoveryEmail,
    handleRequestRecovery
  };
};