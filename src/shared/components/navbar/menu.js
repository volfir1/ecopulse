import React from "react";
import { Menu, MenuItem, Avatar, ListItemIcon, Divider } from "@mui/material";
import { AppIcon } from "../icons";

export default function NavMenu({ anchorEl, open, onClose }) {
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
      <MenuItem onClick={onClose}>
        <Avatar /> Profile
      </MenuItem>
      <MenuItem onClick={onClose} sx={{ gap: 1 }}>
        <AppIcon name="myaccount" />
        My Account
      </MenuItem>
      <Divider />
      <MenuItem onClick={onClose}>
        <ListItemIcon sx={{ gap: 1 }}>
          <AppIcon name="addaccount" type="tool" fontSize="small" />
        </ListItemIcon>
        Add Account
      </MenuItem>
    </Menu>
  );
}