// Sidebar.jsx
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import { NAVIGATION } from './data';
import useDrawer from './useDrawer'; // Update path if needed
import RenderDrawer from './renderDrawer'; // Update path if needed
import Logo from '../logo';
import { 
  ListItemButton,
  ListItemIcon,
  ListItemText,

 } from '@mui/material';

import { Logout } from '@mui/icons-material';
const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function Sidebar() {
  const { open, openSubMenu, handleDrawer, handleSubMenu } = useDrawer();

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer variant="permanent" open={open}>
        {/* Main container with flex column */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          height: '100%', // Take full height of drawer
          minHeight: '100vh' // Ensure full viewport height
        }}>
          <Logo open={open} onToggle={handleDrawer}/>
          
          {/* Scrollable content area */}
          <List sx={{ 
            flex: 1, // Take remaining space
            overflowY: 'auto', // Enable scrolling
            pb: 7, // Padding for logout button height
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar':{
              display: 'none'
            },
            msOverflowStyle: 'none'
          }}>
            {NAVIGATION.map((item) => 
              RenderDrawer(item, open, openSubMenu, handleSubMenu)
            )}
          </List>

          {/* Fixed logout button */}
          <Box sx={{
            position: 'sticky',
            bottom: 0,
            width: '100%',
            bgcolor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
            zIndex: 1
          }}>
            <ListItemButton 
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                '&:hover': { backgroundColor: 'action.hover' }
              }}
              onClick={() => console.log('Logout clicked')}
            >
              <ListItemIcon sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}>
                <Logout/>
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}