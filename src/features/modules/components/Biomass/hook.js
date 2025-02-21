import { useState, useMemo, useEffect } from 'react';
import dayjs from 'dayjs';

export const useBiomassAnalytics = () => {
  const [startYear, setStartYear] = useState(dayjs());
  const [endYear, setEndYear] = useState(dayjs().add(1, 'year'));
  const [isLoading, setIsLoading] = useState(true);

  const handleYearChange = (newStart, newEnd) => {
    if (newEnd.diff(newStart, 'year') > 30) {
      newEnd = newStart.add(30, 'year');
    }
    setStartYear(newStart);
    setEndYear(newEnd);
    // Trigger loading state when years change
    setIsLoading(true);
  };

  const generationData = useMemo(() => {
    const yearStart = parseInt(startYear.format('YYYY'));
    const yearEnd = parseInt(endYear.format('YYYY'));
    const data = [];

    for (let year = yearStart; year <= yearEnd; year++) {
      const baseGeneration = 3800; // Base biomass generation
      const yearProgress = (year - yearStart) / Math.max(yearEnd - yearStart, 1);
      
      // Add seasonal variations (higher in autumn/winter for biomass)
      const seasonalFactor = Math.cos((year - yearStart) * Math.PI / 2) * 0.2;
      const randomVariation = 0.9 + Math.random() * 0.2;
      
      data.push({
        year: year.toString(),
        generation: Math.round(baseGeneration * (1 + yearProgress * 0.3) * (1 + seasonalFactor) * randomVariation),
        feedstock: Math.round(5200 * (1 + seasonalFactor) * randomVariation),
        efficiency: Math.round((82 + yearProgress * 6) * randomVariation)
      });
    }
    
    return data;
  }, [startYear, endYear]);

  const currentStats = useMemo(() => ({
    generation: generationData[0]?.generation || 0,
    feedstock: generationData[0]?.feedstock || 0,
    efficiency: generationData[0]?.efficiency || 0
  }), [generationData]);

  const projectedStats = useMemo(() => ({
    generation: generationData[generationData.length - 1]?.generation || 0,
    feedstock: generationData[generationData.length - 1]?.feedstock || 0,
    efficiency: generationData[generationData.length - 1]?.efficiency || 0
  }), [generationData]);

  const growthPercentages = useMemo(() => ({
    generation: Math.round(((projectedStats.generation - currentStats.generation) / currentStats.generation) * 100),
    feedstock: Math.round(((projectedStats.feedstock - currentStats.feedstock) / currentStats.feedstock) * 100),
    efficiency: Math.round(((projectedStats.efficiency - currentStats.efficiency) / currentStats.efficiency) * 100)
  }), [currentStats, projectedStats]);

  // Add loading effect whenever year changes
  useEffect(() => {
    // Simulate data loading delay
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Adjust loading time as needed
    
    return () => clearTimeout(timer);
  }, [startYear, endYear]);

  return {
    generationData,
    currentStats,
    projectedStats,
    growthPercentages,
    startYear,
    endYear,
    handleYearChange,
    isLoading
  };
};