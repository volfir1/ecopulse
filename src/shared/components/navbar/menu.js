import React from "react";
import { Menu, MenuItem, Avatar, ListItemIcon, Divider } from "@mui/material";
import { AppIcon } from "../ui/icons";
import { useNavigate } from "react-router-dom";
import { Logout } from "@mui/icons-material";

export default function NavMenu({ anchorEl, open, onClose }) {
  const navigate = useNavigate()
  
  const handleNavigate = () => {
    onClose()
    navigate('/profile')
  }

  return (
    <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={open}
      onClose={onClose}
      onClick={onClose}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            p: 0.5, // Add padding to the menu container
            minWidth: 200, // Set minimum width
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem 
        onClick={handleNavigate}
        sx={{ 
          py: 1, // Vertical padding
          px: 2, // Horizontal padding
          gap: 1.5 // Gap between icon and text
        }}
      >
        <Avatar /> Profile
      </MenuItem>
      <MenuItem 
        onClick={onClose} 
        sx={{ 
          py: 1,
          px: 2,
          gap: 1.5
        }}
      >
        <AppIcon name="myaccount" />
        My Account
      </MenuItem>
      <Divider sx={{ my: 1 }} /> {/* Add margin to divider */}
      <MenuItem 
        onClick={onClose}
        sx={{ 
          py: 1,
          px: 2
        }}
      >
        <ListItemIcon sx={{ gap: 1.5 }}>
          <AppIcon name="addaccount" type="tool" fontSize="small" />
        </ListItemIcon>
        Add Account
      </MenuItem>
      <MenuItem 
        onClick={handleNavigate}
        sx={{ 
          py: 1,
          px: 2,
          gap: 1.5,
          color: 'error.main' // Make logout red
        }}
      >
        <Logout fontSize="small" />
        Logout
      </MenuItem>
    </Menu>
  );
}