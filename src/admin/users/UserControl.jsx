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
    handleUserDelete, 
    setSelectedUser, 
    updateUserRole  // Make sure this is included from the hook
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
        handleEdit={handleEditUser} 
        handleDelete={handleUserDelete}
        updateUserRole={updateUserRole} // Pass the function directly
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