// YearRangePicker.jsx
import React, { useState, useCallback } from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, Typography, IconButton } from '@mui/material';
import { RefreshCcw } from 'lucide-react';
import dayjs from 'dayjs';

// Styles for the date pickers
const getPickerStyles = (error) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    width: '120px',
    height: '40px',
    background: '#fff',
    border: error ? '1px solid #d32f2f' : 'none',
    '&:hover': {
      borderColor: error ? '#d32f2f' : 'primary.main',
    },
  },
});

export const YearRangePicker = ({
  // Set default start year to current year and end year to current year + 5
  initialStartYear = dayjs().year(),
  initialEndYear = dayjs().year() + 5,
  onStartYearChange,
  onEndYearChange,
}) => {
  // State management
  const [startYear, setStartYear] = useState(dayjs(initialStartYear.toString()));
  const [endYear, setEndYear] = useState(dayjs(initialEndYear.toString()));
  const [error, setError] = useState(false);

  // Handlers for year changes
  const handleStartYearChange = useCallback((newValue) => {
    if (!newValue || !newValue.isValid()) {
      setError(true);
      return;
    }
    setError(false);
    setStartYear(newValue);
    onStartYearChange?.(newValue.year());
  }, [onStartYearChange]);

  const handleEndYearChange = useCallback((newValue) => {
    if (!newValue || !newValue.isValid()) {
      setError(true);
      return;
    }
    
    // Validate that end year is after start year
    if (newValue.year() < startYear.year()) {
      setError(true);
      return;
    }
    
    setError(false);
    setEndYear(newValue);
    onEndYearChange?.(newValue.year());
  }, [onEndYearChange, startYear]);

  // Reset handler - now resets to current year and current year + 5
  const handleReset = useCallback(() => {
    const currentYear = dayjs().year();
    const defaultStartYear = dayjs(currentYear.toString());
    const defaultEndYear = dayjs((currentYear + 5).toString());
    
    setStartYear(defaultStartYear);
    setEndYear(defaultEndYear);
    onStartYearChange?.(defaultStartYear.year());
    onEndYearChange?.(defaultEndYear.year());
    setError(false);
  }, [onStartYearChange, onEndYearChange]);


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <DatePicker
            views={['year']}
            value={startYear}
            onChange={handleStartYearChange}
            slotProps={{
              textField: {
                sx: getPickerStyles(error),
                inputProps: {
                  placeholder: 'Start Year'
                },
                size: "small",
                format: 'YYYY'
              }
            }}
          />

          <Typography variant="body2">to</Typography>

          <DatePicker
            views={['year']}
            value={endYear}
            onChange={handleEndYearChange}
            slotProps={{
              textField: {
                sx: getPickerStyles(error),
                inputProps: {
                  placeholder: 'End Year'
                },
                size: "small",
                format: 'YYYY'
              }
            }}
          />

          <IconButton 
            onClick={handleReset} 
            size="small"
            sx={{ 
              bgcolor: 'primary.light', 
              color: 'primary.contrastText',
              '&:hover': {
                bgcolor: 'primary.main',
              },
              width: 36,
              height: 36
            }}
          >
            <RefreshCcw size={16} />
          </IconButton>
        </Box>
        
        {error && (
          <Typography variant="caption" color="error">
            Invalid year range
          </Typography>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default YearRangePicker;