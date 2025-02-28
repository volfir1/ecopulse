import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { userManagementData } from './data';

export const useUserManagement = () => {
  const [data, setData] = useState({
    usersList: [],
    statistics: {
      totalUsers: '0',
      activeUsers: '0',
      newUsers: '0',
      verifiedUsers: '0'
    },
    activityData: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Attempt to fetch from API
        let users = [];
        let statistics = {};
        let activityData = [];
        
        try {
          const response = await userService.getAllUsers();
          users = response.users;
          
          // If the API call is successful, process the data
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
            verifiedUsers: verifiedUsers.toLocaleString()
          };
          
          // You would typically fetch this from an analytics endpoint
          activityData = response.userActivity || [];
        } catch (error) {
          console.warn('API fetch failed, using mock data:', error);
          // Fallback to mock data if API call fails
          users = userManagementData.usersList;
          statistics = userManagementData.statistics;
          activityData = userManagementData.activityData;
        }
        
        setData({
          usersList: users.map(user => ({
            id: user._id || user.id,
            name: user.name || `${user.firstName || ''} ${user.lastName || ''}`,
            email: user.email,
            role: user.role,
            status: user.status || (user.lastLogin ? 'active' : 'inactive'),
            lastActive: user.lastActive || user.updatedAt || new Date()
          })),
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
  }, []);

  const handleUserDelete = async (userId) => {
    try {
      // Add API call here when backend is ready
      await userService.deleteUser(userId).catch(() => {
        console.warn('Delete API not available, simulating delete');
      });
      
      // Update local state to reflect the deletion
      setData(prev => ({
        ...prev,
        usersList: prev.usersList.filter(user => user.id !== userId),
        statistics: {
          ...prev.statistics,
          totalUsers: (parseInt(prev.statistics.totalUsers.replace(/,/g, ''), 10) - 1).toLocaleString()
        }
      }));
    } catch (error) {
      console.error('Failed to delete user:', error);
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
    handleUserDelete,
    setSelectedUser,
    updateUserRole
  };
};