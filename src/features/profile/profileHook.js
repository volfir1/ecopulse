// src/pages/profile/profileHook.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { useSnackbar } from '@shared/index'; // Using your app's snackbar instead of react-hot-toast
import authService from '../../services/authService';
import userService from '../../services/userService';

export const useProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useSnackbar(); // Use your app's toast/snackbar system
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Profile form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: ''
  });
  
  // Password form data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Load user data on component mount
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'user'
      });
    }
  }, [user]);
  
  // Handle profile form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle password form input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };
  
  // Handle profile update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await userService.updateProfile(user.id, formData);
      
      if (response.success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while updating profile");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle password update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await userService.updatePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      if (response.success) {
        toast.success("Password updated successfully");
        // Reset form
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error(response.message || "Failed to update password");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while updating password");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle account deactivation
  const handleDeactivateAccount = async () => {
    setIsLoading(true);
    
    try {
      const response = await authService.deactivateAccount();
      
      if (response.success) {
        toast.success(response.message || "Account deleted successfully");
        
        // Log out the user
        await logout();
        
        // Redirect to a confirmation page
        navigate('/account-deactivated', { 
          state: { email: user?.email }
        });
      } else {
        toast.error(response.message || "Failed to delete account");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while deleting account");
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    formData,
    passwordData,
    isLoading,
    handleInputChange,
    handlePasswordChange,
    handleProfileSubmit,
    handlePasswordSubmit,
    handleDeactivateAccount
  };
};