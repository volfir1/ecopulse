// useYearPicker.js - FIXED
import { useState, useCallback } from 'react';
import dayjs from 'dayjs';

export const useYearPicker = ({
  // Set default start year to 2025 and end year to 2030
  initialStartYear = 2025,
  initialEndYear = 2030,
  onStartYearChange,
  onEndYearChange
}) => {
  // Use provided values or fallback to defaults
  const [startYear, setStartYear] = useState(dayjs().year(initialStartYear));
  const [endYear, setEndYear] = useState(dayjs().year(initialEndYear));
  const [error, setError] = useState(false);

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

  // Reset handler - now resets to 2025 and 2030
  const handleReset = useCallback(() => {
    const defaultStartYear = dayjs().year(2025);
    const defaultEndYear = dayjs().year(2030);
    
    setStartYear(defaultStartYear);
    setEndYear(defaultEndYear);
    onStartYearChange?.(defaultStartYear.year());
    onEndYearChange?.(defaultEndYear.year());
    setError(false);
  }, [onStartYearChange, onEndYearChange]);

  return {
    startYear,
    endYear,
    error,
    handleStartYearChange,
    handleEndYearChange,
    handleReset
  };
};

export default useYearPicker;
