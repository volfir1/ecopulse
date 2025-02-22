import { useState, useMemo, useEffect } from 'react';
import dayjs from 'dayjs';
import { useSnackbar } from '@shared/index';

export const useSolarAnalytics = () => {
  const [startYear, setStartYear] = useState(dayjs());
  const [endYear, setEndYear] = useState(dayjs().add(1, 'year'));
  const [isLoading, setIsLoading] = useState(true);
  const toast = useSnackbar();

  const handleYearChange = (newStart, newEnd) => {
    // Validate year range (maximum 30 years instead of 50)
    if (newEnd.diff(newStart, 'year') > 30) {
      newEnd = newStart.add(30, 'year');
      toast.warning('Maximum range of 30 years applied', 'top-center');
    }
    setStartYear(newStart);
    setEndYear(newEnd);
    // Trigger loading state when years change
    setIsLoading(true);
  };

  const generationData = useMemo(() => {
    const yearStart = parseInt(startYear.format('YYYY'));
    const yearEnd = parseInt(endYear.format('YYYY'));
    const yearRange = [];

    // Adjust generation calculations for 30-year span
    for (let year = yearStart; year <= yearEnd; year++) {
      const baseGeneration = 5200;
      const yearProgress = (year - yearStart) / (yearEnd - yearStart || 1);
      
      // Adjusted growth factor for 30-year projection
      const growthFactor = 1 + (yearProgress * 0.6);
      const randomVariation = 0.9 + Math.random() * 0.2;
      
      yearRange.push({
        year: year.toString(),
        generation: Math.round(baseGeneration * growthFactor * randomVariation),
        efficiency: Math.round(85 + (yearProgress * 10 * randomVariation))
      });
    }
    return yearRange;
  }, [startYear, endYear]);

  const currentGeneration = useMemo(() => {
    return generationData[0]?.generation || 0;
  }, [generationData]);

  const projectedGeneration = useMemo(() => {
    return generationData[generationData.length - 1]?.generation || 0;
  }, [generationData]);

  const growthPercentage = useMemo(() => {
    if (!currentGeneration) return 0;
    return Math.round(((projectedGeneration - currentGeneration) / currentGeneration) * 100);
  }, [currentGeneration, projectedGeneration]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [startYear, endYear]);

  const handleDownloadSummary = () => {
    try {
      // Your download logic here
      toast.success('Summary downloaded successfully', 'top-center');
    } catch (error) {
      toast.error('Failed to download summary', 'top-center');
    }
  };

  const handleClick = () => {
    console.log('Button clicked');
    toast.success('Test notification', 'top-center');
  };

  return {
    generationData,
    currentGeneration,
    projectedGeneration,
    growthPercentage,
    startYear,
    endYear,
    handleYearChange,
    isLoading,
    handleDownloadSummary,
    handleClick
  };
};

export default useSolarAnalytics;