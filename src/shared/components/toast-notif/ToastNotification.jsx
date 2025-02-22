// ToastNotification.jsx
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Snackbar, Alert, LinearProgress } from '@mui/material';
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// Create context
const SnackbarContext = createContext(null);

// Snackbar styles configuration
const snackbarStyles = {
  success: {
    icon: <CheckCircle size={24} strokeWidth={2.5} />,
    color: '#34C759',
    lightColor: 'rgba(52, 199, 89, 0.95)'
  },
  error: {
    icon: <AlertCircle size={24} strokeWidth={2.5} />,
    color: '#FF3B30',
    lightColor: 'rgba(255, 59, 48, 0.95)'
  },
  info: {
    icon: <Info size={24} strokeWidth={2.5} />,
    color: '#007AFF',
    lightColor: 'rgba(0, 122, 255, 0.95)'
  },
  warning: {
    icon: <AlertTriangle size={24} strokeWidth={2.5} />,
    color: '#FF9500',
    lightColor: 'rgba(255, 149, 0, 0.95)'
  }
};

// Hook to use snackbar
export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

// Snackbar Provider Component
export const SnackbarProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentSnackbar, setCurrentSnackbar] = useState(null);
  const [progress, setProgress] = useState(100);

  const NOTIFICATION_DURATION = 5000; // 5 seconds

  useEffect(() => {
    let timer;
    if (open && progress > 0) {
      timer = setInterval(() => {
        setProgress((prev) => Math.max(prev - 2, 0));
      }, NOTIFICATION_DURATION / 50);
    }
    return () => {
      clearInterval(timer);
    };
  }, [open, progress]);

  const enqueueSnackbar = (message, type, position = { vertical: 'top', horizontal: 'center' }) => {
    setQueue(prev => [...prev, { message, type, position }]);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const handleExited = () => {
    setCurrentSnackbar(null);
    setProgress(100);
  };

  useEffect(() => {
    if (queue.length && !currentSnackbar) {
      setCurrentSnackbar(queue[0]);
      setQueue(prev => prev.slice(1));
      setOpen(true);
      setProgress(100);
    } else if (queue.length && currentSnackbar && open) {
      setOpen(false);
    }
  }, [queue, currentSnackbar, open]);

  const toast = {
    success: (message, position = 'top-center') => {
      const vertical = position?.includes('bottom') ? 'bottom' : 'top';
      const horizontal = position?.includes('left') ? 'left' : 
                        position?.includes('right') ? 'right' : 'center';
      enqueueSnackbar(message, 'success', { vertical, horizontal });
    },
    error: (message, position = 'top-center') => {
      const vertical = position?.includes('bottom') ? 'bottom' : 'top';
      const horizontal = position?.includes('left') ? 'left' : 
                        position?.includes('right') ? 'right' : 'center';
      enqueueSnackbar(message, 'error', { vertical, horizontal });
    },
    info: (message, position = 'top-center') => {
      const vertical = position?.includes('bottom') ? 'bottom' : 'top';
      const horizontal = position?.includes('left') ? 'left' : 
                        position?.includes('right') ? 'right' : 'center';
      enqueueSnackbar(message, 'info', { vertical, horizontal });
    },
    warning: (message, position = 'top-center') => {
      const vertical = position?.includes('bottom') ? 'bottom' : 'top';
      const horizontal = position?.includes('left') ? 'left' : 
                        position?.includes('right') ? 'right' : 'center';
      enqueueSnackbar(message, 'warning', { vertical, horizontal });
    }
  };

  return (
    <SnackbarContext.Provider value={toast}>
      {children}
      {currentSnackbar && (
        <Snackbar
          open={open}
          autoHideDuration={NOTIFICATION_DURATION}
          onClose={handleClose}
          TransitionProps={{ onExited: handleExited }}
          anchorOrigin={currentSnackbar.position}
          sx={{
            '& .MuiPaper-root': {
              width: '100%',
              maxWidth: '420px', // Increased width
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: 0,
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }
          }}
        >
          <div style={{ width: '100%' }}>
            <Alert
              onClose={handleClose}
              severity={currentSnackbar.type}
              variant="filled"
              icon={snackbarStyles[currentSnackbar.type].icon}
              sx={{
                width: '100%',
                backgroundColor: snackbarStyles[currentSnackbar.type].lightColor,
                '& .MuiAlert-icon': { 
                  color: 'white',
                  marginRight: '16px', // Increased spacing
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                },
                '& .MuiAlert-message': { 
                  color: 'white',
                  padding: '6px 0',
                  fontSize: '15px', // Increased font size
                  fontWeight: 500,
                  lineHeight: '1.5'
                },
                '& .MuiAlert-action': { 
                  color: 'white',
                  padding: '0 8px',
                  alignItems: 'center'
                },
                borderRadius: '12px',
                padding: '16px 24px', // Increased padding
                minHeight: '64px', // Minimum height
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {currentSnackbar.message}
            </Alert>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 4, // Thicker progress bar
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  transition: 'transform .2s linear'
                },
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                borderRadius: '0 0 12px 12px'
              }}
            />
          </div>
        </Snackbar>
      )}
    </SnackbarContext.Provider>
  );
};

// Export as named exports only
export  default SnackbarProvider ;