import { useState, useMemo } from 'react';
import dayjs from 'dayjs';

export const useGeothermalAnalytics = () => {
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
      const baseGeneration = 5800; // Geothermal typically has high base load
      const yearProgress = (year - yearStart) / Math.max(yearEnd - yearStart, 1);
      
      // Geothermal is very stable, so less variation
      const seasonalFactor = Math.sin((year - yearStart) * Math.PI / 2) * 0.05;
      const randomVariation = 0.95 + Math.random() * 0.1;
      
      data.push({
        year: year.toString(),
        generation: Math.round(baseGeneration * (1 + yearProgress * 0.3) * (1 + seasonalFactor) * randomVariation),
        wellTemp: Math.round(280 + yearProgress * 5 * randomVariation),
        efficiency: Math.round((90 + yearProgress * 5) * randomVariation)
      });
    }
    
    return data;
  }, [startYear, endYear]);

  const currentStats = useMemo(() => ({
    generation: generationData[0]?.generation || 0,
    wellTemp: generationData[0]?.wellTemp || 0,
    efficiency: generationData[0]?.efficiency || 0
  }), [generationData]);

  const projectedStats = useMemo(() => ({
    generation: generationData[generationData.length - 1]?.generation || 0,
    wellTemp: generationData[generationData.length - 1]?.wellTemp || 0,
    efficiency: generationData[generationData.length - 1]?.efficiency || 0
  }), [generationData]);

  const growthPercentages = useMemo(() => ({
    generation: Math.round(((projectedStats.generation - currentStats.generation) / currentStats.generation) * 100),
    wellTemp: Math.round(((projectedStats.wellTemp - currentStats.wellTemp) / currentStats.wellTemp) * 100),
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