// src/contexts/ProfileContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { useLoader } from '@shared/index';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const { startLoading, stopLoading } = useLoader();
  
  const fetchUserProfile = async () => {
    try {
      startLoading();
      const userData = await userService.getCurrentUser();
      setProfile(userData);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load profile');
      console.error('Error loading profile:', err);
    } finally {
      stopLoading();
    }
  };
  
  const updateProfile = async (updatedData) => {
    try {
      startLoading();
      const updated = await userService.updateUserProfile({
        id: profile.id,
        ...updatedData
      });
      setProfile({ ...profile, ...updated });
      setError(null);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      console.error('Error updating profile:', err);
      return false;
    } finally {
      stopLoading();
    }
  };
  
  const updateProfilePicture = async (imageFile) => {
    try {
      startLoading();
      const result = await userService.updateProfilePicture(profile.id, imageFile);
      setProfile({ ...profile, profileImage: result.profileImage });
      return true;
    } catch (err) {
      setError(err.message || 'Failed to update profile picture');
      console.error('Error updating profile picture:', err);
      return false;
    } finally {
      stopLoading();
    }
  };
  
  const changePassword = async (passwordData) => {
    try {
      startLoading();
      await userService.changePassword(profile.id, passwordData);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to change password');
      console.error('Error changing password:', err);
      return false;
    } finally {
      stopLoading();
    }
  };
  
  useEffect(() => {
    fetchUserProfile();
  }, []);
  
  return (
    <ProfileContext.Provider 
      value={{
        profile,
        error,
        fetchUserProfile,
        updateProfile,
        updateProfilePicture,
        changePassword
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);

export default ProfileContext;