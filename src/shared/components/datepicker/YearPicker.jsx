import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export default function YearPicker() {
  const [startYear, setStartYear] = useState(dayjs());
  const [endYear, setEndYear] = useState(dayjs().add(1, 'year'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <DatePicker 
          label="Start Year"
          views={['year']}
          value={startYear}
          onChange={(newValue) => setStartYear(newValue)}
          maxDate={endYear}
          slotProps={{
            textField: {
              sx: {
                '& .MuiInputBase-root': {
                  height: '40px', // Smaller height
                  width: '150px',
                  borderRadius: '8px', // Rounded corners
                  backgroundColor: 'white', // White background
                  '& .MuiInputAdornment-positionStart': {
                    marginRight: '8px' // Adjust icon spacing
                  }
                },
                '& .MuiInputLabel-root': {
                  top: '-6px' // Adjust label position for smaller input
                }
              }
            },
            inputAdornment: {
              position: 'start' // Move icon to left
            }
          }}
        />
        
        <span>–</span>
        
        <DatePicker
          label="End Year"
          views={['year']}
          value={endYear}
          onChange={(newValue) => setEndYear(newValue)}
          minDate={startYear}
          slotProps={{
            textField: {
              sx: {
                '& .MuiInputBase-root': {
                  height: '40px', // Smaller height
                  width: '150px',
                  borderRadius: '8px', // Rounded corners
                  backgroundColor: 'white', // White background
                  '& .MuiInputAdornment-positionStart': {
                    marginRight: '8px' // Adjust icon spacing
                  }
                },
                '& .MuiInputLabel-root': {
                  top: '-6px' // Adjust label position for smaller input
                }
              }
            },
            inputAdornment: {
              position: 'start' // Move icon to left
            }
          }}
        />
      </div>
    </LocalizationProvider>
  );
}