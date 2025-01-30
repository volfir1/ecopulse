import { useState, useEffect } from 'react';
import { 
  LocalizationProvider,
  DatePicker 
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { 
  Box, 
  Typography, 
  useTheme, 
  alpha,
  Tooltip,
  IconButton
} from '@mui/material';
import { RefreshCcw, Calendar } from 'lucide-react';
import dayjs from 'dayjs';

export default function YearPicker() {
  const theme = useTheme();
  const [startYear, setStartYear] = useState(dayjs());
  const [endYear, setEndYear] = useState(dayjs().add(1, 'year'));
  const [error, setError] = useState('');

  // Validate year range
  useEffect(() => {
    if (endYear.diff(startYear, 'year') > 10) {
      setError('Maximum range is 10 years');
    } else if (endYear.diff(startYear, 'year') < 0) {
      setError('End year must be after start year');
    } else {
      setError('');
    }
  }, [startYear, endYear]);

  // Reset to current year and next year
  const handleReset = () => {
    setStartYear(dayjs());
    setEndYear(dayjs().add(1, 'year'));
  };

  const commonStyles = {
    '& .MuiInputBase-root': {
      height: '45px',
      width: '180px',
      borderRadius: '12px',
      backgroundColor: theme.palette.background.paper,
      transition: 'all 0.2s ease',
      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
      '&:hover': {
        border: `1px solid ${theme.palette.primary.main}`,
        backgroundColor: alpha(theme.palette.primary.main, 0.02)
      },
      '&.Mui-focused': {
        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
        border: `1px solid ${theme.palette.primary.main}`
      },
      '& .MuiInputAdornment-root': {
        marginLeft: '8px',
        marginRight: '8px',
        '& .MuiButtonBase-root': {
          padding: '4px'
        }
      }
    },
    '& .MuiInputLabel-root': {
      top: '-4px',
      '&.Mui-focused': {
        color: theme.palette.primary.main
      }
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none'
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Box>
            <DatePicker
              label="Start Year"
              views={['year']}
              value={startYear}
              onChange={(newValue) => setStartYear(newValue)}
              maxDate={endYear}
              slotProps={{
                textField: {
                  sx: commonStyles
                }
              }}
              slots={{
                openPickerIcon: () => <Calendar size={18} />
              }}
            />
          </Box>

          <Typography 
            sx={{ 
              color: theme.palette.text.secondary,
              fontWeight: 500,
              px: 1
            }}
          >
            to
          </Typography>

          <Box>
            <DatePicker
              label="End Year"
              views={['year']}
              value={endYear}
              onChange={(newValue) => setEndYear(newValue)}
              minDate={startYear}
              slotProps={{
                textField: {
                  sx: commonStyles
                }
              }}
              slots={{
                openPickerIcon: () => <Calendar size={18} />
              }}
            />
          </Box>

          <Tooltip title="Reset to current year">
            <IconButton 
              onClick={handleReset}
              size="small"
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2)
                }
              }}
            >
              <RefreshCcw size={16} />
            </IconButton>
          </Tooltip>
        </Box>

        {error && (
          <Typography 
            variant="caption" 
            color="error"
            sx={{ 
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            {error}
          </Typography>
        )}

        <Box sx={{ mt: 1 }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
          >
            Selected Range: {startYear.format('YYYY')} - {endYear.format('YYYY')} 
            ({endYear.diff(startYear, 'year')} years)
          </Typography>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}