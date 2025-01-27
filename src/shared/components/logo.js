// Logo.jsx (updated)
import { Box, IconButton } from '@mui/material';
import { ChevronLeft, Menu } from '@mui/icons-material';
import { useTheme } from '@emotion/react';

const Logo = ({ open, onToggle }) => {
  const theme  = useTheme()
  return (
    <Box 
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        // Match DrawerHeader styles
        ...theme.mixins.toolbar,
        padding: theme.spacing(0, 1),
      }}
    >
      {/* Logo Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <img 
          src="/logo.png"
          alt="Logo"
          style={{
            width: 50,
            height: 50,
            color: theme.pal,
            objectFit: 'contain',
            fontWeight: 'bold'
          }}
        />
        {open && <span style={{
          fontSize: 20,
          color: 'primary.main',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          opacity: open ? 1 : 0,
          transition: 'opacity 0.2s ease',
          
        }}>EcoPulse</span>}
      </Box>

      {/* Integrated Toggle Button */}
      <IconButton onClick={onToggle}>
        {open ? <ChevronLeft /> : <Menu />}
      </IconButton>
    </Box>
  );
};

export default Logo;