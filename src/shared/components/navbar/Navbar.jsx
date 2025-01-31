import React, { useState } from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Avatar, Tooltip, useTheme, alpha } from '@mui/material';
import { MenuIcon } from "lucide-react";
import NavMenu from './menu';
import { useApp } from '@context/AppContext';
import { AppIcon } from '../icons';
import SearchBar from '../searchbar/searchbar';

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
        }}
      >
        <Toolbar sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          py: 1.5,
          px: { xs: 2, sm: 3 }
        }}>
          {/* Left Section */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              edge="start"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              sx={{ 
                mr: 2, 
                display: { xs: "block", sm: "none" },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1)
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              transition: 'all 0.2s ease'
            }}>
              <Typography 
                variant="h6" 
                noWrap
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  color: theme.palette.text.primary
                }}
              >
                Hello, User
              </Typography>
             
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  borderRadius: 2,
                  px: 1,
                  py: 0.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                <IconButton 
                  sx={{
                    mr: 0.5,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: 'transparent'
                    }
                  }}
                >
                  <AppIcon 
                    name='location' 
                    type='tool'
                    sx={{ 
                      width: 20,
                      height: 20
                    }}
                  />
                </IconButton>
                <Typography 
                  variant="body1" 
                  noWrap 
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    pr: 1
                  }}
                >
                  Taguig
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right Section */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 2 }
          }}>
            <Box sx={{ 
              transition: 'transform 0.2s ease',
              '&:hover': { transform: 'translateY(-1px)' }
            }}>
              <SearchBar />
            </Box>

            <IconButton 
              size="large" 
              sx={{
                color: theme.palette.text.primary,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  transform: 'translateY(-1px)'
                }
              }}
            >
              <AppIcon 
                name='notification' 
                type='tool'
                sx={{ 
                  width: 22,
                  height: 22
                }}
              />
            </IconButton>

            <IconButton 
              size="large" 
              sx={{
                color: theme.palette.text.primary,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  transform: 'translateY(-1px)'
                }
              }}
            >
              <AppIcon 
                name='settings' 
                type='tool'
                sx={{ 
                  width: 22,
                  height: 22
                }}
              />
            </IconButton>
            
            <Tooltip title="My Account">
              <IconButton
                size='large'
                onClick={handleMenuClick}
                aria-controls={open ? "account-menu" : undefined}
                sx={{
                  p: 0.5,
                  transition: 'all 0.2s ease',
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    border: `2px solid ${theme.palette.primary.main}`,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1)
                  }
                }}
              >
                <Avatar 
                  alt="User" 
                  src="/api/placeholder/32/32"
                  sx={{ 
                    width: 32, 
                    height: 32
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