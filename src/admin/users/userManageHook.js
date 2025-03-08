import { useState, useEffect, useCallback } from 'react';
import { userService } from '../../services/userService';
import { userManagementData } from './data';

export const useUserManagement = () => {
  const [data, setData] = useState({
    usersList: [],
    deletedUsers: [], // Added to store soft-deleted users
    statistics: {
      totalUsers: '0',
      activeUsers: '0',
      newUsers: '0',
      verifiedUsers: '0',
      deletedUsers: '0' // Added stat for deleted users
    },
    activityData: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // To trigger refresh after operations
  
  // Function to refresh the data
  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Attempt to fetch regular and deleted users
        let users = [];
        let deletedUsers = [];
        let statistics = {};
        let activityData = [];
        
        try {
          // Get regular users
          const response = await userService.getAllUsers();
          users = response.users || [];
          
          // Get all users including deleted ones (for admin)
          const allUsersResponse = await userService.getAllUsersWithDeleted();
          const allUsers = allUsersResponse.users || [];
          
          // Filter out deleted users
          deletedUsers = allUsers.filter(user => user.isDeleted);
          
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
          console.warn('API fetch failed, using mock data:', error);
          // Fallback to mock data if API call fails
          users = userManagementData.usersList;
          statistics = userManagementData.statistics;
          activityData = userManagementData.activityData;
        }
        
        // Format users data for the UI
        const formatUserList = (users, isDeleted = false) => {
          return users.map(user => ({
            id: user._id || user.id,
            name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            email: user.email,
            role: user.role,
            status: isDeleted ? 'deleted' : (user.status || (user.lastLogin ? 'active' : 'inactive')),
            lastActive: user.lastActive || user.lastLogin || user.updatedAt || new Date(),
            isDeleted: isDeleted,
            createdAt: user.createdAt,
            deletedAt: user.updatedAt // For deleted users, updatedAt typically has the deletion time
          }));
        };
        
        setData({
          usersList: formatUserList(users),
          deletedUsers: formatUserList(deletedUsers, true),
          statistics,
          activityData
        });
      } catch (error) {
        console.error('Failed to process users data:', error);
        // Fallback to mock data
        setData(userManagementData);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [refreshTrigger]);  // Depend on refreshTrigger to reload data

  // Enhanced delete function for soft delete
  const handleSoftDeleteUser = async (userId) => {
    try {
      const result = await userService.softDeleteUser(userId);
      
      if (result.success) {
        // Move the user from active to deleted list
        const userToDelete = data.usersList.find(user => user.id === userId);
        if (userToDelete) {
          const deletedUser = {
            ...userToDelete,
            status: 'deleted',
            isDeleted: true,
            deletedAt: new Date().toISOString()
          };
          
          // Update state
          setData(prev => ({
            ...prev,
            usersList: prev.usersList.filter(user => user.id !== userId),
            deletedUsers: [...prev.deletedUsers, deletedUser],
            statistics: {
              ...prev.statistics,
              totalUsers: (parseInt(prev.statistics.totalUsers.replace(/,/g, ''), 10) - 1).toLocaleString(),
              deletedUsers: (parseInt(prev.statistics.deletedUsers.replace(/,/g, ''), 10) + 1).toLocaleString()
            }
          }));
        }
        
        return { success: true, message: "User successfully deleted" };
      } else {
        throw new Error(result.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      return { 
        success: false, 
        error: { message: error.message || 'Failed to delete user' }
      };
    }
  };
  
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
            isDeleted: false,
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
    selectedUser,
    setSelectedUser,
    handleSoftDeleteUser,
    handleRestoreUser,
    updateUserRole,
    refreshData
  };
};