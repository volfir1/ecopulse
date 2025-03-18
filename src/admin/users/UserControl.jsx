import React, { useState } from 'react';
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
    handleSoftDeleteUser, 
    handleRestoreUser, 
    handleSendRecoveryLink,
    handleSendPasswordResetLink,
    updateUserRole
  } = useUserManagement();
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleEditUser = (user) => {
    console.log('Edit user:', user);
    setSelectedUser(user);
    // Implement edit functionality 
  };

  // Wrapped handlers with snackbar notifications
  const handleSoftDelete = async (userId) => {
    try {
      const result = await handleSoftDeleteUser(userId);
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
      setSnackbar({
        open: true,
        message: 'An error occurred while deactivating the user',
        severity: 'error'
      });
    }
  };

  const handleRestore = async (userId) => {
    try {
      const result = await handleRestoreUser(userId);
      if (result.success) {
        setSnackbar({
          open: true,
          message: 'User has been successfully restored',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: result.error?.message || 'Failed to restore user',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'An error occurred while restoring the user',
        severity: 'error'
      });
    }
  };

  // NEW: Handler for sending recovery links
  const handleSendRecovery = async (email) => {
    try {
      const result = await handleSendRecoveryLink(email);
      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Recovery link has been sent to the user',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: result.error?.message || 'Failed to send recovery link',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'An error occurred while sending recovery link',
        severity: 'error'
      });
    }
  };

  // NEW: Handler for sending password reset links
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '100%' }}>
      <Typography variant="h5" component="h1" fontWeight="medium" sx={{ mb: 2 }}>
        User Management
      </Typography>
      
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
        <UserDashboard data={data} />
      )}
      
      {tabIndex === 1 && (
        <UsersList 
          users={data.usersList} 
          deletedUsers={data.deletedUsers}
          handleEdit={handleEditUser} 
          handleSoftDelete={handleSoftDelete}
          handleRestore={handleRestore}
          handleSendRecovery={handleSendRecovery} // NEW: For sending recovery links
          handleSendPasswordReset={handleSendPasswordReset} // NEW: For sending password reset links
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