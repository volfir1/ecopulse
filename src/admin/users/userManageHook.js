// src/hooks/useUserManagement.js
import { useState, useEffect, useCallback } from 'react';
import { userService } from '@services/userService';
import authService from '@services/authService';
import { userManagementData } from './data'; // Make sure this path is correct

export const useUserManagement = () => {
  const [data, setData] = useState({
    usersList: [],
    deletedUsers: [],
    statistics: {
      totalUsers: '0',
      activeUsers: '0',
      newUsers: '0',
      verifiedUsers: '0',
      deletedUsers: '0'
    },
    activityData: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Function to refresh the data
  const refreshData = useCallback(() => {
    console.log('Refreshing user management data...');
    setRefreshTrigger(prev => prev + 1);
  }, []);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Attempt to fetch regular and deleted users
        let users = [];
        let deletedUsers = [];
        let statistics = {};
        let activityData = [];
        
        try {
          console.log('Fetching all users...');
          // Get regular users
          const response = await userService.getAllUsers();
          console.log('getAllUsers response:', response);
          users = response?.users || [];
          
          console.log('Fetching users with deleted...');
          // Get all users including deleted ones (for admin)
          const allUsersResponse = await userService.getAllUsersWithDeleted();
          console.log('getAllUsersWithDeleted response:', allUsersResponse);
          const allUsers = allUsersResponse?.users || [];
          
          // Debug the first few users to see their properties
          if (allUsers.length > 0) {
            console.log('Sample user properties:', Object.keys(allUsers[0]));
            console.log('Sample user data:', JSON.stringify(allUsers[0], null, 2));
          }
          
          // More robust filtering for deactivated users
          deletedUsers = allUsers.filter(user => {
            const isDeactivated = user.isDeactivated === true;
            const isAutoDeactivated = user.isAutoDeactivated === true;
            const hasDeletedStatus = user.status === 'deleted' || user.status === 'deactivated';
            const isInactive = user.status === 'inactive' && user.deactivatedAt;
            
            // Debug user filtering
            if (isDeactivated || isAutoDeactivated || hasDeletedStatus || isInactive) {
              console.log(`Deactivated user found: ${user.email || user.name}`, { 
                isDeactivated, isAutoDeactivated, hasDeletedStatus, isInactive,
                status: user.status, deactivatedAt: user.deactivatedAt
              });
            }
            
            return isDeactivated || isAutoDeactivated || hasDeletedStatus || isInactive;
          });
          
          console.log(`Found ${deletedUsers.length} deleted/deactivated users`);
          
          // Ensure active users don't include any deactivated ones (double check)
          users = users.filter(user => {
            return !user.isDeactivated && !user.isAutoDeactivated && 
                   user.status !== 'deleted' && user.status !== 'deactivated';
          });
          
          // Calculate statistics
          const activeUsers = users.filter(user => user.lastLogin).length;
          const newUsers = users.filter(user => {
            const joinDate = new Date(user.createdAt);
            const now = new Date();
            const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
            return joinDate >= thirtyDaysAgo;
          }).length;
          const verifiedUsers = users.filter(user => user.isVerified).length;
          
          statistics = {
            totalUsers: users.length.toLocaleString(),
            activeUsers: activeUsers.toLocaleString(),
            newUsers: newUsers.toLocaleString(),
            verifiedUsers: verifiedUsers.toLocaleString(),
            deletedUsers: deletedUsers.length.toLocaleString()
          };
          
          // Generate activity data from user logins if available
          if (allUsers.length > 0) {
            // Group by date and count logins
            const loginsByDate = {};
            const now = new Date();
            
            // Initialize the last 7 days
            for (let i = 6; i >= 0; i--) {
              const date = new Date(now);
              date.setDate(date.getDate() - i);
              const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              loginsByDate[dateString] = { 
                date: dateString,
                totalVisits: 0,
                activeUsers: 0,
                newUsers: 0
              };
            }
            
            // Count logins for each date
            allUsers.forEach(user => {
              if (user.lastLogin) {
                const loginDate = new Date(user.lastLogin);
                const dateString = loginDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                
                // Only count if it's within the last 7 days
                if (loginsByDate[dateString]) {
                  loginsByDate[dateString].totalVisits++;
                  loginsByDate[dateString].activeUsers++;
                }
              }
              
              // Count new users per day
              if (user.createdAt) {
                const createdDate = new Date(user.createdAt);
                const dateString = createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                
                // Only count if it's within the last 7 days
                if (loginsByDate[dateString]) {
                  loginsByDate[dateString].newUsers++;
                }
              }
            });
            
            activityData = Object.values(loginsByDate);
          } else {
            // Fallback to mock data for activity
            activityData = response.userActivity || userManagementData.activityData;
          }
        } catch (error) {
          console.error('API fetch failed, using mock data:', error);
          // Fallback to mock data if API call fails
          console.log('Using mock data as fallback');
          users = userManagementData.usersList;
          statistics = userManagementData.statistics;
          activityData = userManagementData.activityData;
          deletedUsers = userManagementData.deletedUsers || [];
        }
        
        // Format users data for the UI - UPDATED FUNCTION
        const formatUserList = (users, isDeactivated = false) => {
          // Make sure users is an array before attempting to map
          if (!Array.isArray(users)) {
            console.error('Expected users to be an array but got:', typeof users);
            return [];
          }
          
          return users.map(user => {
            // Debug each user to check its format
            console.log(`Formatting user:`, user.email || user._id || 'unknown', 
                        `isDeactivated=${isDeactivated}, status=${user.status}`,
                        `isDeactivated flag=${user.isDeactivated}, isAutoDeactivated=${user.isAutoDeactivated}`);
            
            // Use optional chaining and nullish coalescing to safely access properties
            const firstName = user?.firstName || '';
            const lastName = user?.lastName || '';
            const formattedName = user?.name || `${firstName} ${lastName}`.trim();
            
            // Better status detection logic
            let status = 'unknown';
            if (isDeactivated || user?.isDeactivated === true || user?.isAutoDeactivated === true) {
              status = 'deactivated';
            } else if (user?.status) {
              status = user.status;
            } else if (user?.isVerified === false) {
              status = 'unverified';
            } else if (user?.lastLogin) {
              status = 'active';
            } else {
              status = 'inactive';
            }
            
            return {
              id: user?._id || user?.id || 'unknown-id',
              name: formattedName || 'Unnamed User',
              email: user?.email || 'no-email',
              role: user?.role || 'user',
              status: status,
              lastActive: user?.lastActive || user?.lastLogin || user?.updatedAt || new Date(),
              isDeactivated: isDeactivated || user?.isDeactivated === true || user?.isAutoDeactivated === true,
              createdAt: user?.createdAt || new Date(),
              deactivatedAt: user?.deletedAt || user?.deactivatedAt || null
            };
          });
        };
        
        const formattedUsers = formatUserList(users);
        const formattedDeletedUsers = formatUserList(deletedUsers, true);
        
        console.log(`Formatted ${formattedUsers.length} active users and ${formattedDeletedUsers.length} deleted users`);
        
        setData({
          usersList: formattedUsers,
          deletedUsers: formattedDeletedUsers,
          statistics,
          activityData
        });
      } catch (error) {
        console.error('Failed to process users data:', error);
        // Set the error state
        setError(error.message || 'An error occurred while fetching user data');
        // Fallback to mock data
        setData(userManagementData);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [refreshTrigger]);  // Depend on refreshTrigger to reload data

  // Enhanced delete function for soft delete (admin deactivation)
  const handleDeactivateUser = async (userId) => {
    try {
      // Call the renamed service function
      const result = await userService.deactivateUser(userId);
      
      if (result.success) {
        // Move the user from active to deactivated list
        const userToDeactivate = data.usersList.find(user => user.id === userId);
        if (userToDeactivate) {
          const deactivatedUser = {
            ...userToDeactivate,
            status: 'deactivated', // Use "deactivated" instead of "deleted"
            isDeactivated: true, // Keep this for backend compatibility
            deactivatedAt: new Date().toISOString() // Use deactivatedAt instead of deletedAt
          };
          
          // Update state
          setData(prev => ({
            ...prev,
            usersList: prev.usersList.filter(user => user.id !== userId),
            deletedUsers: [...prev.deletedUsers, deactivatedUser], // This array should be renamed in a full refactor
            statistics: {
              ...prev.statistics,
              // Update relevant statistics
              activeUsers: (parseInt(prev.statistics.activeUsers.replace(/,/g, ''), 10) - 1).toLocaleString(),
              deletedUsers: (parseInt(prev.statistics.deletedUsers.replace(/,/g, ''), 10) + 1).toLocaleString()
            }
          }));
        }
        
        return { success: true, message: "User successfully deactivated" };
      } else {
        throw new Error(result.message || 'Failed to deactivate user');
      }
    } catch (error) {
      console.error('Failed to deactivate user:', error);
      return { 
        success: false, 
        error: { message: error.message || 'Failed to deactivate user' }
      };
    }
  };

  // For backward compatibility
  const handleSoftDeleteUser = handleDeactivateUser;
  
  // Function to restore a deleted user
  const handleRestoreUser = async (userId) => {
    try {
      const result = await userService.restoreUser(userId);
      
      if (result.success) {
        // Move the user from deleted to active list
        const userToRestore = data.deletedUsers.find(user => user.id === userId);
        if (userToRestore) {
          const restoredUser = {
            ...userToRestore,
            status: 'active',
            isDeactivated: false,
            lastActive: new Date().toISOString()
          };
          
          // Update state
          setData(prev => ({
            ...prev,
            deletedUsers: prev.deletedUsers.filter(user => user.id !== userId),
            usersList: [...prev.usersList, restoredUser],
            statistics: {
              ...prev.statistics,
              totalUsers: (parseInt(prev.statistics.totalUsers.replace(/,/g, ''), 10) + 1).toLocaleString(),
              deletedUsers: (parseInt(prev.statistics.deletedUsers.replace(/,/g, ''), 10) - 1).toLocaleString()
            }
          }));
        }
        
        return { success: true, message: "User successfully restored" };
      } else {
        throw new Error(result.message || 'Failed to restore user');
      }
    } catch (error) {
      console.error('Failed to restore user:', error);
      return { 
        success: false, 
        error: { message: error.message || 'Failed to restore user' }
      };
    }
  };

  // NEW: Function to send account recovery link to deactivated user
  const handleSendRecoveryLink = async (email) => {
    try {
      // Use the authService to send recovery link
      const result = await authService.requestAccountRecovery(email);
      
      if (result.success) {
        return { success: true, message: "Recovery link sent successfully" };
      } else {
        throw new Error(result.message || 'Failed to send recovery link');
      }
    } catch (error) {
      console.error('Failed to send recovery link:', error);
      return { 
        success: false, 
        error: { message: error.message || 'Failed to send recovery link' }
      };
    }
  };

  // NEW: Function to send password reset link
  const handleSendPasswordResetLink = async (email) => {
    try {
      // Use the authService to send password reset link
      const result = await authService.forgotPassword(email);
      
      if (result.success) {
        return { success: true, message: "Password reset link sent successfully" };
      } else {
        throw new Error(result.message || 'Failed to send password reset link');
      }
    } catch (error) {
      console.error('Failed to send password reset link:', error);
      return { 
        success: false, 
        error: { message: error.message || 'Failed to send password reset link' }
      };
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const response = await userService.updateUserRole(userId, newRole);
      
      if (response.success) {
        // Update local state with formatted date
        setData(prev => ({
          ...prev,
          usersList: prev.usersList.map(user => 
            user.id === userId ? { 
              ...user, 
              role: newRole,
              lastActive: new Date().toISOString() // Format date as ISO string
            } : user
          )
        }));
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Failed to update role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      return { 
        success: false, 
        error: { message: error.message || 'Failed to update user role' }
      };
    }
  };

  return {
    data,
    setData,
    loading,
    error,
    selectedUser,
    setSelectedUser,
    handleDeactivateUser,
    handleRestoreUser,
    handleSendRecoveryLink,
    handleSendPasswordResetLink,
    updateUserRole,
    refreshData,
    handleSoftDeleteUser // Keep for backward compatibility
  };
};