import React, { useState } from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Avatar, Tooltip } from '@mui/material';
import { MenuIcon } from "lucide-react";
import NavMenu from './menu';
import { useApp } from "shared/context/AppContext";
import { AppIcon } from '../icons';
import SearchBar from '../searchbar/searchbar';

export default function Navbar() {
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
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Left Section */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              edge="start"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              sx={{ mr: 2, display: { xs: "block", sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" noWrap>
                Hello, User
              </Typography>
             
              <Typography 
                  variant="body1" 
                  noWrap 
                  sx={{fontSize:"1.5rem"}}
               >
                   <IconButton >
                  <AppIcon name='location' type='tool' sx= {{mr: 0.5}}>
                        {/* Script Here */}
                  </AppIcon>
              </IconButton>
                  Taguig 
              </Typography>
            </Box>
          </Box>

         
          {/* Right Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SearchBar />
            <IconButton size="large" color="inherit">
              <AppIcon name='notification' type='tool' />
            </IconButton>
            <IconButton size="large" color="inherit">
              <AppIcon name='settings' type='tool' />
            </IconButton>
            
            <Tooltip title="My Account">
              <IconButton
                size='large'
                color='inherit'
                onClick={handleMenuClick}
                aria-controls={open ? "account-menu" : undefined}
              >
                <Avatar alt="User" src="" />
              </IconButton>
            </Tooltip>
          </Box>

          <NavMenu 
            anchorEl={anchorEl} 
            open={open} 
            onClose={handleMenuClose} // Fixed typo in prop name
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
}