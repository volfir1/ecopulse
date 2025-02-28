import { useState, useEffect, useContext } from 'react';
import userService from '../../services/userService.js';
import { useLoader, useSnackbar } from '@shared/index';
import AuthContext from '@context/AuthContext';

export const useProfile = () => {
  const { user} = useContext(AuthContext);
  const { isLoading, startLoading, stopLoading } = useLoader();
  const { enqueueSnackbar } = useSnackbar(); // Fix: Correctly destructure enqueueSnackbar
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'user'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    let isMounted = true;

    const fetchUserProfile = async () => {
      if (!user?.id) {
        console.log('No user ID found, skipping profile fetch');
        return;
      }
      
      startLoading();
      try {
        const response = await userService.getCurrentUser();
        console.log('Profile Response:', response);
        
        if (!isMounted) return;
      
        if (!response.success || !response.user) {
          throw new Error(response.message || 'Failed to fetch profile');
        }
      
        // Ensure all expected fields are present
        const userData = {
          firstName: response.user.firstName || '',
          lastName: response.user.lastName || '',
          email: response.user.email || '',
          phone: response.user.phone || '',
          role: response.user.role || 'user'
        };
      
        console.log('Setting form data:', userData);
        setFormData(userData);
      } catch (error) {
        console.error('Profile fetch error:', error);
        if (isMounted) {
          enqueueSnackbar(error.message || 'Failed to fetch profile', { 
            variant: 'error',
            preventDuplicate: true
          });
        }
      } finally {
        if (isMounted) {
          stopLoading();
        }
      }
    };

    fetchUserProfile();

    return () => {
      isMounted = false;
    };
  }, [user?.id, enqueueSnackbar, startLoading, stopLoading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    startLoading();
    try {
        const response = await userService.updateUserProfile({
            ...formData,
            id: user?.id
          });

      if (!response.success) {
        throw new Error(response.message);
      }

      enqueueSnackbar('Profile updated successfully', { 
        variant: 'success',
        preventDuplicate: true
      });
    } catch (error) {
      console.error('Profile update error:', error);
      enqueueSnackbar(error.message || 'Failed to update profile', { 
        variant: 'error',
        preventDuplicate: true
      });
    } finally {
      stopLoading();
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      enqueueSnackbar('New passwords do not match', { variant: 'error' }); // Fix: Use enqueueSnackbar
      return;
    }
    
    startLoading();
    try {
        await userService.changePassword(user.id, passwordData);
      enqueueSnackbar('Password changed successfully', { variant: 'success' }); // Fix: Use enqueueSnackbar
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      enqueueSnackbar(error.message || 'Failed to change password', { variant: 'error' }); // Fix: Use enqueueSnackbar
    } finally {
      stopLoading();
    }
  };

  return {
    formData,
    passwordData,
    isLoading,
    handleInputChange,
    handlePasswordChange,
    handleProfileSubmit,
    handlePasswordSubmit
  };
};