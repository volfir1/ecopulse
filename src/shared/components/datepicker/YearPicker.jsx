import { useState, useEffect } from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, Typography } from '@mui/material';
import { RefreshCcw, Calendar } from 'lucide-react';
import { Button, theme } from '@shared/index';
import dayjs from 'dayjs';

export default function YearPicker() {
  const [startYear, setStartYear] = useState(dayjs());
  const [endYear, setEndYear] = useState(dayjs().add(1, 'year'));
  
  // Destructure colors
  const { text, background } = theme.palette;

  const handleReset = () => {
    setStartYear(dayjs());
    setEndYear(dayjs().add(1, 'year'));
  };

  const pickerStyles = {
    '& .MuiInputBase-root': {
      height: '42px',
      width: '150px',
      borderRadius: '100px',
      backgroundColor: 'white',
      fontSize: '1rem',
      border: '1px solid #e2e8f0',
      '&:hover': {
        border: '1px solid #e2e8f0',
      },
      '&.Mui-focused': {
        border: '1px solid #e2e8f0',
        boxShadow: 'none',
      }
    },
    '& .MuiInputBase-input': {
      padding: '8px 14px',
      fontWeight: 500,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none'
    },
    '& .MuiIconButton-root': {
      padding: '8px',
      color: '#94a3b8',
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="flex flex-col">
        <Box className="flex items-center gap-4">
          <DatePicker
            views={['year']}
            value={startYear}
            onChange={(newValue) => setStartYear(newValue)}
            maxDate={endYear}
            slots={{
              openPickerIcon: () => <Calendar size={18} />
            }}
            slotProps={{
              textField: {
                sx: pickerStyles
              }
            }}
          />

          <Typography 
            className="text-gray-500 font-normal mx-0"
          >
            to
          </Typography>

          <DatePicker
            views={['year']}
            value={endYear}
            onChange={(newValue) => setEndYear(newValue)}
            minDate={startYear}
            slots={{
              openPickerIcon: () => <Calendar size={18} />
            }}
            slotProps={{
              textField: {
                sx: pickerStyles
              }
            }}
          />

          <button
            onClick={handleReset}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            style={{ marginLeft: '4px' }}
          >
            <RefreshCcw size={16} className="text-gray-500" />
          </button>
        </Box>

        <Typography className="text-gray-500 text-sm mt-1">
          Selected Range: {startYear.format('YYYY')} - {endYear.format('YYYY')}
          ({endYear.diff(startYear, 'year')} years)
        </Typography>
      </Box>
    </LocalizationProvider>
  );
}