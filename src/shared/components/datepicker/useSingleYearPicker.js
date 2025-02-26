// useSingleYearPicker.js
import { useState, useCallback } from 'react';
import dayjs from 'dayjs';

export const useSingleYearPicker = ({
  initialYear = dayjs().year(),
  onYearChange
}) => {
  const [year, setYear] = useState(dayjs(initialYear?.toString()));
  const [error, setError] = useState(false);

  const handleYearChange = useCallback((newValue) => {
    if (!newValue || !newValue.isValid()) {
      setError(true);
      return;
    }
    setError(false);
    setYear(newValue);
    onYearChange?.(newValue.year());
  }, [onYearChange]);

  const handleReset = useCallback(() => {
    const currentYear = dayjs().year();
    const defaultYear = dayjs(currentYear.toString());
    
    setYear(defaultYear);
    onYearChange?.(defaultYear.year());
    setError(false);
  }, [onYearChange]);

  return {
    year,
    error,
    handleYearChange,
    handleReset
  };
};

export default useSingleYearPicker;