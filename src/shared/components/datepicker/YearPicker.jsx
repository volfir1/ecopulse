// YearPicker.jsx
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="flex flex-col">
        <Box className="flex items-center gap-4">
          <DatePicker
            views={['year']}
            value={startYear}
            onChange={handleStartYearChange}
            maxDate={endYear}
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
            slots={{
              openPickerIcon: () => <Calendar size={18} />
            }}
          />

          <button
            onClick={handleReset}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <RefreshCcw size={16} className="text-gray-500" />
          </button>
        </Box>

        <Box className="mt-1">
          <Typography className="text-gray-500 text-sm">
            Selected Range: {startYear.format('YYYY')} - {endYear.format('YYYY')}
            ({endYear.diff(startYear, 'year')} years)
          </Typography>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default YearPicker