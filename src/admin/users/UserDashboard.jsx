import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Card,
  CardContent,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  Tooltip,
  Tab,
  Tabs,
  Divider
} from '@mui/material';
import { 
  Edit, 
  Delete, 
  People, 
  TrendingUp, 
  PersonAdd, 
  VerifiedUser, 
  MoreVert,
  AdminPanelSettings,
  RestoreFromTrash,
  DeleteForever,
  Block,
  CheckCircle,
  LockReset,  // NEW: Icon for password reset
  MailOutline  // NEW: Icon for sending recovery email
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

import PropTypes from 'prop-types';

// Stat Card Component
export const StatCard = ({ title, value, icon, color }) => {
  return (
    <Card elevation={1} sx={{ borderRadius: '10px' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h3" component="div" fontWeight="bold">
              {value}
            </Typography>
          </Box>
          <Avatar
            sx={{ 
              bgcolor: color,
              width: 56,
              height: 56
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

// User Dashboard Component
export const UserDashboard = ({ data }) => {
  // Get statistics from data or use defaults
  const stats = data.statistics || {
    totalUsers: '0',
    activeUsers: '0',
    newUsers: '0',
    verifiedUsers: '0',
    deletedUsers: '0'
  };

  // Format activity data for chart
  const activityData = data.activityData && data.activityData.length > 0
    ? data.activityData
    : [
        { date: 'Feb 19', totalVisits: 7, activeUsers: 4, newUsers: 2 },
        { date: 'Feb 20', totalVisits: 5, activeUsers: 3, newUsers: 1 },
        { date: 'Feb 21', totalVisits: 6, activeUsers: 4, newUsers: 0 },
        { date: 'Feb 22', totalVisits: 6, activeUsers: 3, newUsers: 2 },
        { date: 'Feb 23', totalVisits: 8, activeUsers: 4, newUsers: 1 },
        { date: 'Feb 24', totalVisits: 10, activeUsers: 4, newUsers: 3 },
        { date: 'Feb 25', totalVisits: 4, activeUsers: 3, newUsers: 0 }
      ];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        User Dashboard
      </Typography>
      
      {/* Statistics Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: '1 1 200px' }}>
          <StatCard 
            title="Total Users" 
            value={stats.totalUsers} 
            icon={<People fontSize="medium" sx={{ color: "white" }} />}
            color="#34a853"
          />
        </Box>
        <Box sx={{ flex: '1 1 200px' }}>
          <StatCard 
            title="Active Users" 
            value={stats.activeUsers} 
            icon={<TrendingUp fontSize="medium" sx={{ color: "white" }} />}
            color="#8bc34a"
          />
        </Box>
        <Box sx={{ flex: '1 1 200px' }}>
          <StatCard 
            title="New Users" 
            value={stats.newUsers} 
            icon={<PersonAdd fontSize="medium" sx={{ color: "white" }} />}
            color="#2196f3"
          />
        </Box>
        <Box sx={{ flex: '1 1 200px' }}>
          <StatCard 
            title="Verified Users" 
            value={stats.verifiedUsers} 
            icon={<VerifiedUser fontSize="medium" sx={{ color: "white" }} />}
            color="#ffc107"
          />
        </Box>
        <Box sx={{ flex: '1 1 200px' }}>
          <StatCard 
            title="Deleted Users" 
            value={stats.deletedUsers} 
            icon={<Block fontSize="medium" sx={{ color: "white" }} />}
            color="#f44336"
          />
        </Box>
      </Box>
      
      {/* User Activity Chart */}
      <Paper elevation={1} sx={{ p: 3, borderRadius: '4px', border: '1px dashed #e0e0e0' }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          User Activity
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={activityData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <RechartsTooltip />
              <Legend wrapperStyle={{ position: 'relative', marginTop: '10px' }} />
              <Line 
                type="monotone" 
                dataKey="totalVisits" 
                name="Total Visits" 
                stroke="#2196f3" 
                strokeWidth={2}
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                dataKey="activeUsers" 
                name="Active Users" 
                stroke="#4caf50" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="newUsers" 
                name="New Users" 
                stroke="#ff9800" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
};

// Users List Component
export const UsersList = ({ 
  users, 
  deletedUsers, 
  handleEdit, 
  handleSoftDelete, 
  handleRestore,
  handleSendRecovery, // NEW: For sending recovery links
  handleSendPasswordReset, // NEW: For sending password reset links 
  updateUserRole 
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuUser, setMenuUser] = useState(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [roleChangeDetails, setRoleChangeDetails] = useState({
    userId: null,
    userName: '',
    currentRole: '',
    newRole: '',
    confirmationPhrase: ''
  });
  
  // Action confirmation dialogs
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    confirmText: '',
    action: null
  });

  // Table tabs
  const [tabValue, setTabValue] = useState(0);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };
    
  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setMenuUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuUser(null);
  };

  const handleRoleChangeRequest = (newRole) => {
    handleMenuClose();
    
    const confirmationPhrase = newRole === 'admin' 
      ? `make ${menuUser.name} admin` 
      : `remove admin from ${menuUser.name}`;
    
    setRoleChangeDetails({
      userId: menuUser.id,
      userName: menuUser.name,
      currentRole: menuUser.role,
      newRole,
      confirmationPhrase
    });
    
    setRoleDialogOpen(true);
  };

  const handleRoleDialogClose = () => {
    setRoleDialogOpen(false);
    setConfirmText('');
  };

  const handleConfirmRoleChange = async () => {
    if (confirmText !== roleChangeDetails.confirmationPhrase) {
      return;
    }

    try {
      const result = await updateUserRole(roleChangeDetails.userId, roleChangeDetails.newRole);
      
      if (result.success) {
        handleRoleDialogClose();
      } else {
        // Handle error case if needed
        console.error('Failed to update role:', result.error);
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };
  
  // Handle soft delete confirmation
  const openSoftDeleteConfirm = (userId, userName) => {
    setConfirmDialog({
      open: true,
      title: 'Confirm User Deactivation',
      message: `Are you sure you want to deactivate the user "${userName}"? This action can be reversed later.`,
      confirmText: 'Deactivate',
      action: () => handleSoftDelete(userId)
    });
  };
  
  // Handle restore confirmation
  const openRestoreConfirm = (userId, userName) => {
    setConfirmDialog({
      open: true,
      title: 'Confirm User Restoration',
      message: `Are you sure you want to restore the user "${userName}"?`,
      confirmText: 'Restore',
      action: () => handleRestore(userId)
    });
  };

  // NEW: Handle send recovery link confirmation
  const openSendRecoveryConfirm = (email, userName) => {
    setConfirmDialog({
      open: true,
      title: 'Send Recovery Link',
      message: `Are you sure you want to send a recovery link to "${userName}" (${email})?`,
      confirmText: 'Send Recovery Link',
      action: () => handleSendRecovery(email)
    });
  };

  // NEW: Handle send password reset link confirmation
  const openSendPasswordResetConfirm = (email, userName) => {
    setConfirmDialog({
      open: true,
      title: 'Send Password Reset Link',
      message: `Are you sure you want to send a password reset link to "${userName}" (${email})?`,
      confirmText: 'Send Reset Link',
      action: () => handleSendPasswordReset(email)
    });
  };
  
  // Handle confirm dialog actions
  const handleConfirmAction = async () => {
    if (confirmDialog.action) {
      await confirmDialog.action();
    }
    setConfirmDialog({ ...confirmDialog, open: false });
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // To filter users
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredActiveUsers = roleFilter === 'all' 
    ? users 
    : users.filter(user => user.role === roleFilter);
    
  const currentUsers = tabValue === 0 ? filteredActiveUsers : deletedUsers;

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Users Management
        </Typography>
        
        {/* Role filters - only show for active users tab */}
        {tabValue === 0 && (
          <Box>
            <Button 
              variant={roleFilter === 'all' ? 'contained' : 'outlined'} 
              size="small" 
              onClick={() => setRoleFilter('all')}
              sx={{ mr: 1 }}
            >
              All Users
            </Button>
            <Button 
              variant={roleFilter === 'admin' ? 'contained' : 'outlined'} 
              size="small" 
              onClick={() => setRoleFilter('admin')}
              sx={{ mr: 1 }}
              color="primary"
            >
              <AdminPanelSettings sx={{ mr: 0.5, fontSize: 18 }} />
              Admins
            </Button>
            <Button 
              variant={roleFilter === 'user' ? 'contained' : 'outlined'} 
              size="small" 
              onClick={() => setRoleFilter('user')}
              color="info"
            >
              <People sx={{ mr: 0.5, fontSize: 18 }} />
              Regular Users
            </Button>
          </Box>
        )}
      </Box>
      
      {/* Tabs for active/deleted users */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          TabIndicatorProps={{
            style: {
              height: '3px',
              backgroundColor: tabValue === 0 ? '#1b5e20' : '#d32f2f'
            },
          }}
        >
          <Tab 
            label="Active Users" 
            icon={<CheckCircle />} 
            iconPosition="start"
            sx={{ 
              fontWeight: tabValue === 0 ? 'bold' : 'normal',
              color: tabValue === 0 ? '#1b5e20' : 'inherit'
            }} 
          />
          <Tab 
            label="Deleted Users" 
            icon={<DeleteForever />}
            iconPosition="start"
            sx={{ 
              fontWeight: tabValue === 1 ? 'bold' : 'normal',
              color: tabValue === 1 ? '#d32f2f' : 'inherit'
            }} 
          />
        </Tabs>
      </Box>
      
      {/* Users Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
        <Table>
          <TableHead sx={{ backgroundColor: tabValue === 0 ? '#f5f5f5' : '#ffebee' }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              {tabValue === 1 && (
                <TableCell>Deleted At</TableCell>
              )}
              <TableCell>{tabValue === 0 ? 'Last Active' : 'Created At'}</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentUsers.map((user) => (
              <TableRow 
                key={user.id} 
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  bgcolor: tabValue === 0 && user.role === 'admin' ? 'rgba(27, 94, 32, 0.04)' : 
                          tabValue === 1 ? 'rgba(211, 47, 47, 0.04)' : 'transparent'
                }}
              >
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role}
                    color={user.role === 'admin' ? 'primary' : 'default'}
                    size="small"
                    sx={{ 
                      bgcolor: user.role === 'admin' ? '#1b5e20' : 'transparent',
                      color: user.role === 'admin' ? 'white' : 'inherit',
                      fontWeight: 500
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.status}
                    color={
                      user.status === 'active' ? 'success' : 
                      user.status === 'deleted' ? 'error' : 
                      'warning'
                    }
                    size="small"
                    sx={{ 
                      bgcolor: 
                        user.status === 'active' ? '#4caf50' : 
                        user.status === 'deleted' ? '#d32f2f' :
                        '#ff9800',
                      color: 'white',
                      fontWeight: 500
                    }}
                  />
                </TableCell>
                {tabValue === 1 && (
                  <TableCell>{formatDate(user.deletedAt)}</TableCell>
                )}
                <TableCell>{formatDate(tabValue === 0 ? user.lastActive : user.createdAt)}</TableCell>
                <TableCell align="right">
                  {tabValue === 0 ? (
                    // Actions for active users
                    <>
                      {/* Password Reset Button - Only for active users */}
                      <Tooltip title="Send Password Reset Link">
                        <IconButton 
                          size="small" 
                          onClick={() => openSendPasswordResetConfirm(user.email, user.name)}
                          color="primary"
                          sx={{ mr: 1 }}
                        >
                          <LockReset fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Deactivate User">
                        <IconButton 
                          size="small" 
                          onClick={() => openSoftDeleteConfirm(user.id, user.name)}
                          color="error"
                          sx={{ mr: 1 }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="More actions">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, user)}
                        >
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : (
                    // Actions for deleted users
                    <>
                      {/* Send Recovery Link Button - Only for deleted users */}
                      <Tooltip title="Send Recovery Link">
                        <IconButton 
                          size="small" 
                          onClick={() => openSendRecoveryConfirm(user.email, user.name)}
                          color="warning"
                          sx={{ mr: 1 }}
                        >
                          <MailOutline fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Restore User">
                        <IconButton 
                          size="small" 
                          onClick={() => openRestoreConfirm(user.id, user.name)}
                          color="primary"
                          sx={{ mr: 1 }}
                        >
                          <RestoreFromTrash fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
            
            {currentUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={tabValue === 0 ? 6 : 7} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="textSecondary">
                    {tabValue === 0 
                      ? "No active users found" 
                      : "No deleted users found"}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {menuUser && menuUser.role !== 'admin' && (
          <MenuItem onClick={() => handleRoleChangeRequest('admin')}>
            <AdminPanelSettings fontSize="small" sx={{ mr: 1 }} />
            Make Admin
          </MenuItem>
        )}
        {menuUser && menuUser.role === 'admin' && (
          <MenuItem onClick={() => handleRoleChangeRequest('user')}>
            <People fontSize="small" sx={{ mr: 1 }} />
            Remove Admin Privileges
          </MenuItem>
        )}
        {/* NEW: Add Password Reset option in menu */}
        {menuUser && (
          <MenuItem onClick={() => {
            handleMenuClose();
            openSendPasswordResetConfirm(menuUser.email, menuUser.name);
          }}>
            <LockReset fontSize="small" sx={{ mr: 1 }} />
            Send Password Reset
          </MenuItem>
        )}
      </Menu>
      
      {/* Role Change Confirmation Dialog */}
      <Dialog open={roleDialogOpen} onClose={handleRoleDialogClose}>
        <DialogTitle>
          {roleChangeDetails.newRole === 'admin' ? 'Grant Admin Privileges' : 'Remove Admin Privileges'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {roleChangeDetails.newRole === 'admin' 
              ? `You are about to grant admin privileges to ${roleChangeDetails.userName}. This will give them full access to manage users and system settings.` 
              : `You are about to remove admin privileges from ${roleChangeDetails.userName}.`}
          </DialogContentText>
          <DialogContentText sx={{ mb: 2, fontWeight: 'bold' }}>
            To confirm, please type: <span style={{ color: '#1b5e20' }}>{roleChangeDetails.confirmationPhrase}</span>
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            error={confirmText !== '' && confirmText !== roleChangeDetails.confirmationPhrase}
            helperText={confirmText !== '' && confirmText !== roleChangeDetails.confirmationPhrase 
              ? "Text doesn't match" 
              : null}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRoleDialogClose}>Cancel</Button>
          <Button 
            onClick={handleConfirmRoleChange} 
            color="primary"
            variant="contained"
            disabled={confirmText !== roleChangeDetails.confirmationPhrase}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Action Confirmation Dialog (Delete/Restore/Recovery/Reset) */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({...confirmDialog, open: false})}>
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDialog.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({...confirmDialog, open: false})}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color={
              confirmDialog.confirmText === 'Deactivate' ? 'error' : 
              confirmDialog.confirmText === 'Send Recovery Link' ? 'warning' :
              'primary'
            }
            onClick={handleConfirmAction}
          >
            {confirmDialog.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Add PropTypes validation
UsersList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    lastActive: PropTypes.string 
  })).isRequired,
  deletedUsers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    deletedAt: PropTypes.string,
    createdAt: PropTypes.string
  })),
  handleEdit: PropTypes.func,
  handleSoftDelete: PropTypes.func.isRequired,
  handleRestore: PropTypes.func.isRequired,
  handleSendRecovery: PropTypes.func.isRequired, // NEW: Added prop validation
  handleSendPasswordReset: PropTypes.func.isRequired, // NEW: Added prop validation
  updateUserRole: PropTypes.func.isRequired
};