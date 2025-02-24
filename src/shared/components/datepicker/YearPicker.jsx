import React from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, Typography, IconButton } from '@mui/material';
import { RefreshCcw, Calendar } from 'lucide-react';
import dayjs from 'dayjs';
import { useYearPicker } from './useYearPicker';
import { getPickerStyles } from './styles';

export const YearPicker = ({
  initialStartYear,
  initialEndYear,
  onStartYearChange,
  onEndYearChange
}) => {
  const {
    startYear,
    endYear,
    error,
    handleStartYearChange,
    handleEndYearChange,
    handleReset
  } = useYearPicker({
    initialStartYear,
    initialEndYear,
    onStartYearChange,
    onEndYearChange
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="flex items-center gap-3">
        <DatePicker
          views={['year']}
          value={dayjs(startYear)}
          onChange={handleStartYearChange}
          maxDate={dayjs(endYear)}
          slots={{
            openPickerIcon: () => <Calendar className="h-4 w-4 text-gray-500" />
          }}
          slotProps={{
            textField: {
              sx: getPickerStyles(error),
              inputProps: {
                placeholder: 'Start Year'
              },
              format: 'YYYY'
            }
          }}
        />

        <Typography className="text-gray-500 text-sm">to</Typography>

        <DatePicker
          views={['year']}
          value={dayjs(endYear)}
          onChange={handleEndYearChange}
          minDate={dayjs(startYear)}
          slots={{
            openPickerIcon: () => <Calendar className="h-4 w-4 text-gray-500" />
          }}
          slotProps={{
            textField: {
              sx: getPickerStyles(error),
              inputProps: {
                placeholder: 'End Year'
              },
              format: 'YYYY'
            }
          }}
        />

        <IconButton
          onClick={handleReset}
          className="p-1.5 hover:bg-gray-100 rounded-full"
          size="small"
        >
          <RefreshCcw className="h-4 w-4 text-gray-500" />
        </IconButton>
      </Box>
    </LocalizationProvider>
  );
};

export default YearPicker;