import { useState, useMemo } from 'react';
import dayjs from 'dayjs';

export const useSolarAnalytics = () => {
  const [startYear, setStartYear] = useState(dayjs());
  const [endYear, setEndYear] = useState(dayjs().add(1, 'year'));

  const handleYearChange = (newStart, newEnd) => {
    // Validate year range (maximum 30 years instead of 50)
    if (newEnd.diff(newStart, 'year') > 30) {
      newEnd = newStart.add(30, 'year');
    }
    setStartYear(newStart);
    setEndYear(newEnd);
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
      const growthFactor = 1 + (yearProgress * 0.6); // Reduced from 0.8 to 0.6 for more realistic 30-year growth
      const randomVariation = 0.9 + Math.random() * 0.2;
      
      yearRange.push({
        year: year.toString(),
        generation: Math.round(baseGeneration * growthFactor * randomVariation),
        efficiency: Math.round(85 + (yearProgress * 10 * randomVariation))
      });
    }
    return yearRange;
  }, [startYear, endYear]);

  // ... rest of the code remains the same ...
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

  return {
    generationData,
    currentGeneration,
    projectedGeneration,
    growthPercentage,
    startYear,
    endYear,
    handleYearChange
  };
};

export default useSolarAnalytics;