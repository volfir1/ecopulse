import { useState, useMemo } from 'react';
import dayjs from 'dayjs';

export const useHydroPowerAnalytics = () => {
  const [startYear, setStartYear] = useState(dayjs());
  const [endYear, setEndYear] = useState(dayjs().add(1, 'year'));

  const handleYearChange = (newStart, newEnd) => {
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
      const baseGeneration = 5200; // Base hydro generation
      const yearProgress = (year - yearStart) / Math.max(yearEnd - yearStart, 1);
      
      // Add seasonal variations (higher in spring/summer due to melting)
      const seasonalFactor = Math.sin((year - yearStart) * Math.PI / 2) * 0.25;
      const randomVariation = 0.85 + Math.random() * 0.3;
      
      data.push({
        year: year.toString(),
        generation: Math.round(baseGeneration * (1 + yearProgress * 0.4) * (1 + seasonalFactor) * randomVariation),
        flow: Math.round(4200 * (1 + seasonalFactor) * randomVariation),
        efficiency: Math.round((88 + yearProgress * 7) * randomVariation)
      });
    }
    
    return data;
  }, [startYear, endYear]);

  const currentStats = useMemo(() => ({
    generation: generationData[0]?.generation || 0,
    flow: generationData[0]?.flow || 0,
    efficiency: generationData[0]?.efficiency || 0
  }), [generationData]);

  const projectedStats = useMemo(() => ({
    generation: generationData[generationData.length - 1]?.generation || 0,
    flow: generationData[generationData.length - 1]?.flow || 0,
    efficiency: generationData[generationData.length - 1]?.efficiency || 0
  }), [generationData]);

  const growthPercentages = useMemo(() => ({
    generation: Math.round(((projectedStats.generation - currentStats.generation) / currentStats.generation) * 100),
    flow: Math.round(((projectedStats.flow - currentStats.flow) / currentStats.flow) * 100),
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