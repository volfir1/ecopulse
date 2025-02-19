import { useState, useMemo } from 'react';
import dayjs from 'dayjs';

export const useWindAnalytics = () => {
  const [startYear, setStartYear] = useState(dayjs());
  const [endYear, setEndYear] = useState(dayjs().add(1, 'year'));

  const handleYearChange = (newStart, newEnd) => {
    // Validate year range (maximum 30 years)
    if (newEnd.diff(newStart, 'year') > 30) {
      newEnd = newStart.add(30, 'year');
    }
    setStartYear(newStart);
    setEndYear(newEnd);
  };

  const generationData = useMemo(() => {
    const yearStart = parseInt(startYear.format('YYYY'));
    const yearEnd = parseInt(endYear.format('YYYY'));
    const data = [];

    for (let year = yearStart; year <= yearEnd; year++) {
      const baseGeneration = 4800;
      const yearProgress = (year - yearStart) / Math.max(yearEnd - yearStart, 1);
      
      // Add seasonal and random variations
      const seasonalFactor = Math.sin((year - yearStart) * Math.PI / 2) * 0.15;
      const randomVariation = 0.85 + Math.random() * 0.3;
      
      data.push({
        year: year.toString(),
        generation: Math.round(baseGeneration * (1 + yearProgress * 0.5) * (1 + seasonalFactor) * randomVariation),
        windSpeed: Math.round((12 + yearProgress * 2) * randomVariation),
        efficiency: Math.round((82 + yearProgress * 8) * randomVariation)
      });
    }
    
    return data;
  }, [startYear, endYear]);

  const currentStats = useMemo(() => ({
    generation: generationData[0]?.generation || 0,
    windSpeed: generationData[0]?.windSpeed || 0,
    efficiency: generationData[0]?.efficiency || 0
  }), [generationData]);

  const projectedStats = useMemo(() => ({
    generation: generationData[generationData.length - 1]?.generation || 0,
    windSpeed: generationData[generationData.length - 1]?.windSpeed || 0,
    efficiency: generationData[generationData.length - 1]?.efficiency || 0
  }), [generationData]);

  const growthPercentages = useMemo(() => ({
    generation: Math.round(((projectedStats.generation - currentStats.generation) / currentStats.generation) * 100),
    windSpeed: Math.round(((projectedStats.windSpeed - currentStats.windSpeed) / currentStats.windSpeed) * 100),
    efficiency: Math.round(((projectedStats.efficiency - currentStats.efficiency) / currentStats.efficiency) * 100)
  }), [currentStats, projectedStats]);

  return {
    generationData,
    currentStats,
    projectedStats,
    growthPercentages,
    startYear,
    endYear,
    handleYearChange
  };
};