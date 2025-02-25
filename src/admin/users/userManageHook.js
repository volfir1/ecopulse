import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';

export const useUserManagement = () => {
  const [data, setData] = useState({
    usersList: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getAllUsers();
        const users = response.users;
        
        setData({
          usersList: users.map(user => ({
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role,
            status: user.lastLogin ? 'active' : 'inactive',
            lastActive: user.updatedAt || new Date()
          }))
        });
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserDelete = async (userId) => {
    try {
      // Add API call here when backend is ready
      setData(prev => ({
        ...prev,
        usersList: prev.usersList.filter(user => user.id !== userId)
      }));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  return {
    data,
    loading,
    selectedUser,
    handleUserDelete,
    setSelectedUser
  };
};