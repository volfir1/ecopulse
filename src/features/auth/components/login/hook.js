import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoader } from '@components/loaders/useLoader';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const { startLoading, stopLoading } = useLoader();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    startLoading();

    try {
      // Implement your login logic here
      setToastMessage('Successfully Logged In!');
      setToastType('success');
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch (error) {
      console.error('Login failed:', error);
      setToastMessage('Login failed. Please try again.');
      setToastType('error');
    } finally {
      stopLoading();
    }
  };

  const handleGoogleSignIn = async () => {
    startLoading();
    try {
      // Implement Google Sign-in logic here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setToastMessage('Google Sign-in Successful!');
      setToastType('success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch (error) {
      setToastMessage('Google Sign-in failed. Please try again.');
      setToastType('error');
    } finally {
      stopLoading();
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    toastMessage,
    toastType,
    handleSubmit,
    handleGoogleSignIn
  };
};

export default useLogin;