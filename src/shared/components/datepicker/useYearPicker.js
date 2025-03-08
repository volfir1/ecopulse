// useYearPicker.js with dynamic defaults
import { useState, useCallback } from 'react';
import dayjs from 'dayjs';

export const useYearPicker = ({
  // Set default start year to current year and end year to current year + 5
  initialStartYear = dayjs().year(),
  initialEndYear = dayjs().year() + 5,
  onStartYearChange,
  onEndYearChange
}) => {
  // Use provided values or fallback to defaults
  const [startYear, setStartYear] = useState(dayjs(initialStartYear?.toString() || dayjs().year().toString()));
  const [endYear, setEndYear] = useState(dayjs(initialEndYear?.toString() || (dayjs().year() + 5).toString()));
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
    setError(false);
    setEndYear(newValue);
    onEndYearChange?.(newValue.year());
  }, [onEndYearChange]);

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