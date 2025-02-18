import { useState } from 'react';
import { userManagementData } from './data';

export const useUserManagement = () => {
  const [data, setData] = useState(userManagementData);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    search: ''
  });

  const handleUserStatusChange = async (userId, newStatus) => {
    setLoading(true);
    try {
      // API call would go here
      setData(prev => ({
        ...prev,
        usersList: prev.usersList.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        )
      }));
    } catch (error) {
      console.error('Failed to update user status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserDelete = async (userId) => {
    setLoading(true);
    try {
      // API call would go here
      setData(prev => ({
        ...prev,
        usersList: prev.usersList.filter(user => user.id !== userId)
      }));
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  return {
    data,
    loading,
    selectedUser,
    filters,
    handleUserStatusChange,
    handleUserDelete,
    handleSearch,
    handleFilterChange,
    setSelectedUser
  };
};