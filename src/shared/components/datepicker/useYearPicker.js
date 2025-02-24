// useYearPicker.js
import { useState, useCallback } from 'react';
import dayjs from 'dayjs';

export const useYearPicker = ({
  initialStartYear,
  initialEndYear,
  onStartYearChange,
  onEndYearChange
}) => {
  const [startYear, setStartYear] = useState(dayjs(initialStartYear?.toString()));
  const [endYear, setEndYear] = useState(dayjs(initialEndYear?.toString()));
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

  const handleReset = useCallback(() => {
    const currentYear = dayjs().year();
    const defaultStartYear = dayjs(currentYear.toString());
    const defaultEndYear = dayjs((currentYear + 1).toString());
    
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