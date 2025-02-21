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
              Hello, User
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: alpha(theme.palette.primary.main, 0.06),
                borderRadius: '20px',
                px: 1.5,
                py: 0.5,
                height: 28,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  transform: 'translateY(-1px)'
                }
              }}
            >
              <AppIcon 
                name="location" 
                type="tool"
                sx={{ 
                  width: 16,
                  height: 16,
                  color: theme.palette.primary.main,
                  mr: 0.5
                }}
              />
              <Typography 
                variant="body2" 
                noWrap 
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                  fontSize: '0.875rem'
                }}
              >
                Taguig
              </Typography>
            </Box>
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
              <SearchBar />
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
                size='small'
                onClick={handleMenuClick}
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
                  alt="User" 
                  src="/api/placeholder/24/24"
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