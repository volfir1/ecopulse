import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../drawer/Sidebar";
import Navbar from "../navbar/Navbar";
import { useApp } from "shared/context/AppContext";

export default function Layout() {
  const { sidebarOpen } = useApp();
  
  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <Box
  component="main"
  sx={{
    flexGrow: 1,
    marginLeft: {
      xs: 0,
      sm: sidebarOpen ? "10px" : "64px",
    },
    width: {
      xs: "100%",
      sm: sidebarOpen ? "calc(100% - 240px)" : "calc(100% - 64px)",
    },
    transition: theme => theme.transitions.create(["margin", "width"]),
    display: "flex",
    flexDirection: "column",
    height: "100vh", // Add this
    
  }}
>
  <Navbar />
  <Box 
    sx={{ 
      p: 3, 
      flexGrow: 1,
      overflow: "auto",
      position: "relative", // Add this
      "&::-webkit-scrollbar": {display: "none"},
      msOverflowStyle: "none",
      scrollbarWidth: "none"
    }}
  >
    <Outlet />
  </Box>
</Box>
    </Box>
  );
}