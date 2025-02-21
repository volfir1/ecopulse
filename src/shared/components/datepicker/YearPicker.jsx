import React from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, Typography } from '@mui/material';
import { RefreshCcw, Calendar } from 'lucide-react';
import dayjs from 'dayjs';

export const YearPicker = ({ startYear, endYear, onYearChange }) => {
  const handleStartYearChange = (newValue) => {
    if (!newValue) return;
    onYearChange(newValue, endYear);
  };

  const handleEndYearChange = (newValue) => {
    if (!newValue) return;
    onYearChange(startYear, newValue);
  };

  const handleReset = () => {
    onYearChange(dayjs(), dayjs().add(1, 'year'));
  };

  // Custom styles for the DatePicker
  const datePickerStyles = {
    '& .MuiInputBase-root': {
      height: '40px',  // More compact height
      borderRadius: '8px',  // Rounded corners
    },
    '& .MuiOutlinedInput-input': {
      padding: '8px 14px',
      fontSize: '0.875rem',
    },
    width: '130px'  // More compact width
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="flex items-center gap-3">  {/* Reduced gap */}
        <DatePicker
          views={['year']}
          value={startYear}
          onChange={handleStartYearChange}
          maxDate={endYear}
          sx={datePickerStyles}
          slots={{
            openPickerIcon: () => <Calendar size={18} />
          }}
        />

        <Typography className="text-gray-500 font-normal mx-0">
          to
        </Typography>

        <DatePicker
          views={['year']}
          value={endYear}
          onChange={handleEndYearChange}
          minDate={startYear}
          sx={datePickerStyles}
          slots={{
            openPickerIcon: () => <Calendar size={18} />
          }}
        />

        <button
          onClick={handleReset}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"  
        >
          <RefreshCcw size={18} className="text-gray-500" />
        </button>
      </Box>
    </LocalizationProvider>
  );
};

export default YearPicker;