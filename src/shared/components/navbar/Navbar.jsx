import React, { useState } from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Avatar, Tooltip, useTheme, alpha } from '@mui/material';
import { MenuIcon } from "lucide-react";
import NavMenu from './menu';
import { useApp } from '@context/AppContext';
import { AppIcon } from '../ui/icons';
import SearchBar from '@components/searchbar/searchbar';

export default function Navbar() {
  const theme = useTheme();
  const { sidebarOpen, setSidebarOpen } = useApp();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
    <AppBar 
      position="static" 
      color="transparent" 
      elevation={0}
      sx={{
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        backgroundColor: alpha(theme.palette.background.paper, 0.7),
        minHeight: 56, // Add fixed height
      }}
    >
      <Toolbar 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          minHeight: '56px !important', // Override default Toolbar height
          py: 0.5, // Reduced vertical padding
          px: { xs: 1.5, sm: 2 }
        }}
      >
        {/* Left Section - Adjust Typography and Box heights */}
        <Box sx={{ display: 'flex', alignItems: 'center', height: 40 }}>
          {/* ... existing IconButton ... */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            height: '100%'
          }}>
            <Typography 
              variant="h6" 
              noWrap
              sx={{
                fontWeight: 600,
                fontSize: { xs: '0.95rem', sm: '1.1rem' }, // Slightly smaller
                color: theme.palette.text.primary,
                lineHeight: 1, // Reduce line height
              }}
            >
              Hello, User
            </Typography>
           
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                borderRadius: 1.5,
                px: 0.75,
                py: 0.25,
                height: 32, // Fixed height
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  transform: 'translateY(-1px)'
                }
              }}
            >
            <IconButton 
      size="small"
      sx={{
        mr: 0.5,
        color: theme.palette.primary.main,
        p: 0.5,
        '&:hover': {
          backgroundColor: 'transparent'
        }
      }}
    >
      <AppIcon 
        name="location" 
        type="tool"
        sx={{ 
          width: 18,
          height: 18
        }}
      />
    </IconButton>
    <Typography 
      variant="body2" 
      noWrap 
      sx={{
        fontWeight: 500,
        color: theme.palette.text.primary,
        pr: 0.5
      }}
    >
      Taguig
    </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right Section - Adjust icon button sizes */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 0.5, sm: 1 },
          height: 40
        }}>
          <Box sx={{ height: '100%' }}>
            <SearchBar />
          </Box>

          <IconButton 
            size="small" // Changed from medium
            sx={{
              p: 0.5, // Reduced padding
              height: 32,
              width: 32,
              // ... existing hover styles ...
            }}
          >
            <AppIcon 
              name='notification' 
              type='tool'
              sx={{ 
                width: 18,
                height: 18
              }}
            />
          </IconButton>

          {/* Apply same changes to settings IconButton */}

          <Tooltip title="My Account">
            <IconButton
              size='small'
              onClick={handleMenuClick}
              aria-controls={open ? "account-menu" : undefined}
              sx={{
                p: 0.25,
                height: 32,
                width: 32,
                // ... existing styles ...
              }}
            >
              <Avatar 
                alt="User" 
                src="/api/placeholder/24/24" // Further reduced
                sx={{ 
                  width: 24,
                  height: 24
                }} 
              />
            </IconButton>
          </Tooltip>
        </Box>

        <NavMenu 
          anchorEl={anchorEl} 
          open={open} 
          onClose={handleMenuClose}
        />
      </Toolbar>
    </AppBar>
  </Box>
  );
}