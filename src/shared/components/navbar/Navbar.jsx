import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Avatar, 
  Tooltip, 
  useTheme, 
  alpha,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider
} from '@mui/material';
import { useApp } from '@context/AppContext';
import { useAuth } from '@context/AuthContext';
import { AppIcon } from '@shared/index';
import SearchBar from '@components/searchbar/searchbar';

export default function Navbar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { sidebarOpen, setSidebarOpen } = useApp();
  const { user: currentUser, logout } = useAuth(); // Use the auth context properly
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const isAdmin = currentUser?.role === 'admin';

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate(isAdmin ? '/admin/profile' : '/profile');
  };

  // Fixed logout function that uses the context's logout
  const handleLogout = async () => {
    try {
      handleMenuClose();
      // Use the context's logout function which properly clears cookies and state
      await logout();
      // No need to navigate - the context's logout will handle it
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="static" 
        color="transparent" 
        elevation={0}
        sx={{
          backdropFilter: 'blur(6px)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.85),
          height: 52,
        }}
      >
        <Toolbar 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            minHeight: '52px !important',
            px: { xs: 1.5, sm: 2 },
            gap: 2
          }}
        >
          {/* Left Section */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            height: 36 
          }}>
            <Typography 
              variant="h6" 
              noWrap
              sx={{
                fontWeight: 600,
                fontSize: '1rem',
                color: theme.palette.text.primary,
                lineHeight: 1,
              }}
            >
              Hello, {currentUser?.firstName || 'User'}
            </Typography>

        
          </Box>

          {/* Right Section */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            height: 36
          }}>
            <Box sx={{ 
              width: { xs: 180, sm: 240 },
              height: '100%' 
            }}>
             
            </Box>

            <IconButton 
              size="small"
              sx={{
                p: 1,
                height: 32,
                width: 32,
                backgroundColor: alpha(theme.palette.divider, 0.04),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.divider, 0.08),
                }
              }}
            >
              <AppIcon 
                name='notification' 
                type='tool'
                sx={{ 
                  width: 18,
                  height: 18,
                  color: theme.palette.text.secondary
                }}
              />
            </IconButton>

            <Tooltip title="My Account">
              <IconButton
                onClick={handleMenuClick}
                size='small'
                sx={{
                  p: 0.25,
                  height: 32,
                  width: 32,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.divider, 0.04),
                  }
                }}
              >
                <Avatar 
                  alt={currentUser?.firstName || 'User'} 
                  src={currentUser?.profileImage || "/api/placeholder/24/24"}
                  sx={{ 
                    width: 24,
                    height: 24
                  }} 
                />
              </IconButton>
            </Tooltip>
          </Box>

          {/* User Menu */}
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 3,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                mt: 1.5,
                borderRadius: 1.5,
                minWidth: 200,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: theme.palette.background.paper,
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                  borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                  borderLeft: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {currentUser?.firstName} {currentUser?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentUser?.email || 'user@example.com'}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 1 }} />
            
            <MenuItem onClick={handleProfileClick} sx={{ py: 1.25 }}>
              <ListItemIcon>
                <AppIcon name="profile" size={18} style={{ color: theme.palette.primary.main }} />
              </ListItemIcon>
              My Profile
            </MenuItem>
            
            {isAdmin && (
              <MenuItem onClick={() => { handleMenuClose(); navigate('/admin/dashboard'); }} sx={{ py: 1.25 }}>
                <ListItemIcon>
                  <AppIcon name="dashboard" size={18} style={{ color: theme.palette.secondary.main }} />
                </ListItemIcon>
                Admin Dashboard
              </MenuItem>
            )}
            
            <MenuItem onClick={() => { handleMenuClose(); navigate('/help-support'); }} sx={{ py: 1.25 }}>
              <ListItemIcon>
                <AppIcon name="help" size={18} style={{ color: theme.palette.info.main }} />
              </ListItemIcon>
              Help & Support
            </MenuItem>
            
            <Divider sx={{ my: 1 }} />
            
            <MenuItem onClick={handleLogout} sx={{ py: 1.25 }}>
              <ListItemIcon>
                <AppIcon name="logout" size={18} style={{ color: theme.palette.error.main }} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}