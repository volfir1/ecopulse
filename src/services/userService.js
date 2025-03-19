// src/services/userService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthToken = () => {
  const token = localStorage.getItem('authToken');
  console.log('Auth token retrieved:', token ? `${token.substring(0, 15)}...` : 'No token found');
  return token;
};

// Helper function to handle API errors consistently
const handleApiError = (error, functionName) => {
  console.error(`API error in ${functionName}:`, error);
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('Error response:', error.response.data);
    console.error('Error status:', error.response.status);
    
    return {
      success: false,
      message: error.response.data?.message || `Server error (${error.response.status})`,
      error: error.response.data
    };
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received:', error.request);
    return {
      success: false,
      message: 'No response from server. Please check your network connection.',
      error: { type: 'network', details: error.request }
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Request setup error:', error.message);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: { type: 'setup', details: error.message }
    };
  }
};

export const userService = {
  // Get all users (admin function)
  getAllUsers: async () => {
    try {
      console.log('Fetching all users...');
      const token = getAuthToken();
      
      if (!token) {
        console.warn('No auth token available for getAllUsers');
        return { success: false, users: [] };
      }
      
      const response = await axios.get(`${API_URL}/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Debug the response
      console.log('API response status:', response.status);
      
      // Safely access the users array
      if (response.data && response.data.data && Array.isArray(response.data.data.users)) {
        const allUsers = response.data.data.users;
        console.log(`Found ${allUsers.length} total users`);
        
        // Filter out deactivated users client-side
        const activeUsers = allUsers.filter(user => !user.isDeactivated && !user.isAutoDeactivated);
        console.log(`After filtering: ${activeUsers.length} active users`);
        
        return { success: true, users: activeUsers };
      } else if (response.data && Array.isArray(response.data.users)) {
        // Alternative data structure
        const allUsers = response.data.users;
        console.log(`Found ${allUsers.length} total users (alternate structure)`);
        
        // Filter out deactivated users client-side
        const activeUsers = allUsers.filter(user => !user.isDeactivated && !user.isAutoDeactivated);
        console.log(`After filtering: ${activeUsers.length} active users`);
        
        return { success: true, users: activeUsers };
      } else {
        console.warn('Unexpected data structure in getAllUsers:', response.data);
        return { success: true, users: [] };
      }
    } catch (error) {
      return handleApiError(error, 'getAllUsers');
    }
  },

  // Get all users including deleted ones (admin function)
  getAllUsersWithDeleted: async () => {
    try {
      console.log('Fetching all users including deleted ones...');
      const token = getAuthToken();
      
      if (!token) {
        console.warn('No auth token available for getAllUsersWithDeleted');
        return { success: false, users: [] };
      }
      
      // More comprehensive parameters to ensure we get all user types
      const response = await axios.get(
        `${API_URL}/auth/users`, {
          params: {
            includeDeleted: true,
            includeAutoDeactivated: true,
            includeInactive: true,
            all: true
          },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Debug the response structure
      console.log('API response status for getAllUsersWithDeleted:', response.status);
      if (response.data) {
        console.log('Response data structure:', Object.keys(response.data));
        if (response.data.data) {
          console.log('Response data.data structure:', Object.keys(response.data.data));
        }
      }
      
      // Handle different data structures with more robust checks
      let users = [];
      
      if (response.data && response.data.data && Array.isArray(response.data.data.users)) {
        users = response.data.data.users;
      } else if (response.data && Array.isArray(response.data.users)) {
        users = response.data.users;
      } else if (response.data && Array.isArray(response.data)) {
        users = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        users = response.data.data;
      } else {
        console.warn('Unexpected data structure in getAllUsersWithDeleted:', response.data);
        users = [];
      }
      
      console.log(`Found ${users.length} total users (including deleted/deactivated)`);
      
      // Log a sample user if available
      if (users.length > 0) {
        console.log('Sample user from API:', JSON.stringify(users[0], null, 2));
      }
      
      return { success: true, users };
    } catch (error) {
      return handleApiError(error, 'getAllUsersWithDeleted');
    }
  },

  // Deactivate a user (admin function)
  deactivateUser: async (userId) => {
    try {
      console.log(`Attempting to deactivate user ${userId}...`);
      const token = getAuthToken();
      
      if (!token) {
        console.warn('No auth token available for deactivateUser');
        return { success: false, message: 'Not authenticated' };
      }
      
      const response = await axios.post(
        `${API_URL}/auth/admin/deactivate-user`,
        { userId },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Deactivation response:', response.data);
      
      // Return standard response format
      return {
        success: true,
        message: response.data.message || 'User successfully deactivated',
        ...response.data
      };
    } catch (error) {
      return handleApiError(error, 'deactivateUser');
    }
  },

  // Restore a deactivated user (admin function)
  restoreUser: async (userId) => {
    try {
      console.log(`Attempting to restore user ${userId}...`);
      const token = getAuthToken();
      
      if (!token) {
        console.warn('No auth token available for restoreUser');
        return { success: false, message: 'Not authenticated' };
      }
      
      const response = await axios.post(
        `${API_URL}/auth/reactivate-account`,
        { userId },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Restoration response:', response.data);
      
      // Return standard response format
      return {
        success: true,
        message: response.data.message || 'User successfully restored',
        ...response.data
      };
    } catch (error) {
      return handleApiError(error, 'restoreUser');
    }
  },

  // Update user role (admin function)
  updateUserRole: async (userId, newRole) => {
    try {
      console.log(`Updating user ${userId} role to ${newRole}...`);
      const token = getAuthToken();
      
      if (!token) {
        console.warn('No auth token available for updateUserRole');
        return { success: false, message: 'Not authenticated' };
      }
      
      const response = await axios.put(
        `${API_URL}/auth/users/${userId}/role`,
        { role: newRole },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Role update response:', response.data);
      
      // Return standard response format
      return {
        success: true,
        message: response.data.message || `User role updated to ${newRole}`,
        ...response.data
      };
    } catch (error) {
      return handleApiError(error, 'updateUserRole');
    }
  },

  // Legacy method for compatibility
  softDeleteUser: async (userId) => {
    console.warn('softDeleteUser is deprecated, use deactivateUser instead');
    return userService.deactivateUser(userId);
  }
};

export default userService;