// src/pages/UserManagement/UserControl.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { UserDashboard, UsersList } from './UserDashboard';
import { useUserManagement } from './userManageHook';

// Main User Management Component
export default function UserControl() {
  const [tabIndex, setTabIndex] = useState(0);
  const { 
    data, 
    loading, 
    selectedUser, 
    setSelectedUser, 
    handleRestoreUser, 
    handleSendRecoveryLink,
    handleSendPasswordResetLink,
    updateUserRole,
    handleDeactivateUser,
    refreshData // Make sure refreshData is pulled from the hook
  } = useUserManagement();
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Add useEffect to log data status for debugging
  useEffect(() => {
    console.log('UserControl data:', data);
    console.log('UsersList available:', data?.usersList?.length || 0);
    console.log('DeletedUsers available:', data?.deletedUsers?.length || 0);
  }, [data]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleEditUser = (user) => {
    console.log('Edit user:', user);
    setSelectedUser(user);
  };

  const handleSoftDelete = async (userId) => {
    try {
      const result = await handleDeactivateUser(userId);
      if (result.success) {
        setSnackbar({
          open: true,
          message: 'User has been successfully deactivated',
          severity: 'success'
        });
       
      } else {
        setSnackbar({
          open: true,
          message: result.error?.message || 'Failed to deactivate user',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error in deactivating user:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred while deactivating the user',
        severity: 'error'
      });
    }
  };;

  const handleRestore = async (userId) => {
    try {
      const result = await handleRestoreUser(userId);
      if (result.success) {
        setSnackbar({
          open: true,
          message: 'User has been successfully restored',
          severity: 'success'
        });
        refreshData(); // Refresh the data after successful restoration
      } else {
        setSnackbar({
          open: true,
          message: result.error?.message || 'Failed to restore user',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error in restoring user:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred while restoring the user',
        severity: 'error'
      });
    }
  };

  const handleSendRecovery = async (email) => {
    try {
      const result = await handleSendRecoveryLink(email);
      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Reactivation link has been sent to the user',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: result.error?.message || 'Failed to send reactivation link',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error in sending recovery link:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred while sending reactivation link',
        severity: 'error'
      });
    }
  };

  const handleSendPasswordReset = async (email) => {
    try {
      const result = await handleSendPasswordResetLink(email);
      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Password reset link has been sent to the user',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: result.error?.message || 'Failed to send password reset link',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error in sending password reset:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred while sending password reset link',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Make sure we're checking data existence properly
  const isDataEmpty = !data || !data.usersList || data.usersList.length === 0;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Ensure the data structure includes default empty arrays if data is missing
  const safeData = {
    ...data,
    usersList: data?.usersList || [],
    deletedUsers: data?.deletedUsers || [],
    statistics: {
      ...(data?.statistics || {}),
      totalUsers: data?.statistics?.totalUsers || '0',
      activeUsers: data?.statistics?.activeUsers || '0',
      newUsers: data?.statistics?.newUsers || '0',
      verifiedUsers: data?.statistics?.verifiedUsers || '0',
      deletedUsers: data?.statistics?.deletedUsers || '0',
      inactiveUsers: parseInt(data?.statistics?.totalUsers || 0) - parseInt(data?.statistics?.activeUsers || 0)
    },
    activityData: data?.activityData || []
  };

  return (
    <Box sx={{ p: 3, maxWidth: '100%' }}>
      <Typography variant="h5" component="h1" fontWeight="medium" sx={{ mb: 2 }}>
        User Management
      </Typography>
      
      {/* Display data status for debugging */}
      {isDataEmpty && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          No user data available. This could be a data fetching issue or empty database.
        </Alert>
      )}
      
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange}
          TabIndicatorProps={{
            style: {
              height: '3px',
              backgroundColor: '#1b5e20'
            },
          }}
        >
          <Tab 
            label="DASHBOARD" 
            sx={{ 
              fontWeight: tabIndex === 0 ? 'bold' : 'normal',
              color: tabIndex === 0 ? '#1b5e20' : 'inherit'
            }} 
          />
          <Tab 
            label="USERS LIST" 
            sx={{ 
              fontWeight: tabIndex === 1 ? 'bold' : 'normal',
              color: tabIndex === 1 ? '#1b5e20' : 'inherit'
            }} 
          />
        </Tabs>
      </Box>
      
      {/* Tab Panels */}
      {tabIndex === 0 && (
        <UserDashboard data={safeData} />
      )}
      
      {tabIndex === 1 && (
        <UsersList 
          users={safeData.usersList} 
          deletedUsers={safeData.deletedUsers}
          handleEdit={handleEditUser} 
          handleSoftDelete={handleSoftDelete}
          handleRestore={handleRestore}
          handleSendRecovery={handleSendRecovery} 
          handleSendPasswordReset={handleSendPasswordReset} 
          updateUserRole={updateUserRole}
        />
      )}

      {/* Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}  
        </Alert>
      </Snackbar>
    </Box>
  );
}