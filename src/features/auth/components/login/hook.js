import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoader } from '@components/loaders/useLoader';
import { useSnackbar } from '@shared/index'; // Make sure this path is correct

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoader();
  const toast = useSnackbar();

  // Add console logs to debug
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password });

    if (!email || !password) {
      console.log('Validation failed');
      toast.warning('Please fill in all fields');
      return;
    }

    console.log('Starting loading');
    startLoading();

    try {
      console.log('Simulating API call');
      // Simulate API call with visible delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Login successful');
      toast.success('Welcome back! Successfully logged in.');
      
      console.log('Navigating to dashboard');
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      console.log('Stopping loading');
      stopLoading();
    }
  };

  const handleGoogleSignIn = async () => {
    console.log('Starting Google Sign-in');
    startLoading();

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Successfully signed in with Google!');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } finally {
      stopLoading();
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
    handleGoogleSignIn
  };
};

export default useLogin;