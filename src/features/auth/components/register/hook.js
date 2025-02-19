// src/components/auth/useRegister.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoader } from '@components/loaders/useLoader';

export const useRegister = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const { startLoading, stopLoading } = useLoader();
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePhoneChange = (e) => setPhone(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setToastMessage('Passwords do not match!');
      setToastType('error');
      return;
    }
    
    startLoading();
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setToastMessage('Registration Successful!');
      setToastType('success');
      setTimeout(() => {
        navigate('/login');
      }, 800);
    } catch (error) {
      setToastMessage('Registration failed. Please try again.');
      setToastType('error');
    } finally {
      stopLoading();
    }
  };

  const handleGoogleSignUp = async () => {
    startLoading();
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setToastMessage('Google Sign-up Successful!');
      setToastType('success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } finally {
      stopLoading();
    }
  };

  return {
    formValues: {
      email,
      phone,
      password,
      confirmPassword
    },
    formHandlers: {
      handleEmailChange,
      handlePhoneChange,
      handlePasswordChange,
      handleConfirmPasswordChange,
      handleSubmit,
      handleGoogleSignUp
    },
    toast: {
      toastMessage,
      toastType
    }
  };
};