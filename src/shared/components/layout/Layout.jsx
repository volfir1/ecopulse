import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../drawer/Sidebar";
import Navbar from "../navbar/Navbar";
import { useApp } from '@context/AppContext';

export default function Layout() {
  const { sidebarOpen } = useApp();
  
  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
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
          height: "calc(100vh - 64px)", // Subtract Navbar height
          overflow: "hidden",
        }}
      >
        {/* Fixed Navbar to prevent white space */}
        <Box 
          sx={{ 
            position: "fixed", 
            width: "100%", 
            top: 0, 
            zIndex: 1000, 
            backgroundColor: "white" // Ensure navbar has background
          }}
        >
          <Navbar />
        </Box>

        {/* Outlet (Page Content) */}
        <Box 
          sx={{ 
            p: 3, 
            flexGrow: 1,
            overflow: "auto",
            mt: "64px", // Push content below the fixed Navbar
            "&::-webkit-scrollbar": {display: "none"},
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
