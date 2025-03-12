// adminWindUtil.js
import React from 'react';
import { AppIcon, theme } from '@shared/index';

// Format data for the chart with clear distinction between predicted/historical
export const formatDataForChart = (data, isPredicted = false) => {
  if (!data || data.length === 0) return [];
  
  // Sort by year ascending
  return [...data]
    .sort((a, b) => a.year - b.year)
    .map(item => ({
      year: item.year.toString(),
      value: item.generation,
      isPredicted: isPredicted || item.isPredicted
    }));
};

// Get chart configuration with different styling for predicted data
export const getChartConfig = () => {
  const { palette } = theme;
  const windColor = palette?.elements?.wind || '#64748B'; // Slate color as default for wind
  
  return {
    bar: {
      dataKey: 'value',
      fill: windColor,
      radius: [4, 4, 0, 0],
      barSize: 30,
      name: 'Generation (GWh)'
    },
    tooltip: {
      formatter: (value, name, props) => {
        const isPredicted = props.payload.isPredicted;
        return [`${value.toFixed(2)} GWh`, `${isPredicted ? 'Predicted' : 'Historical'} Generation`];
      },
      labelFormatter: (label) => `Year: ${label}`
    },
    xAxis: {
      dataKey: 'year',
      axisLine: { stroke: '#E0E0E0' },
      tickLine: false
    },
    yAxis: {
      axisLine: { stroke: '#E0E0E0' },
      tickLine: false,
      label: {
        value: 'Wind Generation (GWh)',
        angle: -90,
        position: 'insideLeft'
      }
    },
    // Line configuration with predicted data styling
    line: {
      stroke: windColor,
      strokeWidth: 2,
      dot: (props) => {
        const isPredicted = props.payload.isPredicted;
        return {
          r: isPredicted ? 3 : 4,
          fill: isPredicted ? '#A3A3A3' : windColor,
          stroke: '#fff',
          strokeWidth: 2
        };
      },
      activeDot: {
        r: 6,
        fill: windColor,
        stroke: '#fff',
        strokeWidth: 2
      }
    }
  };
};

// Validate form inputs with improved validation
export const validateInputs = (year, generation, nonRenewableEnergy, population, gdp) => {
  const errors = {};
  const currentYear = new Date().getFullYear();
  
  // Year validation
  if (!year) {
    errors.year = 'Year is required';
  } else if (year < 1900 || year > 2100) {
    errors.year = 'Year must be between 1900 and 2100';
  }
  
  // Generation validation
  if (!generation) {
    errors.generation = 'Generation value is required';
  } else if (isNaN(parseFloat(generation)) || parseFloat(generation) < 0) {
    errors.generation = 'Generation must be a positive number';
  }
  
  // Optional field validations
  if (nonRenewableEnergy && (isNaN(parseFloat(nonRenewableEnergy)) || parseFloat(nonRenewableEnergy) < 0)) {
    errors.nonRenewableEnergy = 'Must be a positive number';
  }
  
  if (population && (isNaN(parseFloat(population)) || parseFloat(population) < 0)) {
    errors.population = 'Must be a positive number';
  }
  
  if (gdp && (isNaN(parseFloat(gdp)) || parseFloat(gdp) < 0)) {
    errors.gdp = 'Must be a positive number';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Helper function to determine data type
export const getDataType = (item) => {
  // MongoDB records must have _id and should not be flagged as predicted
  if (!item.isPredicted && item._id) {
    return 'historical';
  }
  // Otherwise it's predicted data
  return 'predicted';
};

// Create consistent data formatting for both tables
export const formatTableData = (data, type = 'mongodb') => {
  if (!data || data.length === 0) return [];
  
  return data.map((item, index) => ({
    id: item._id || `predicted-${index}`,
    year: item.date,
    generation: item.value,
    nonRenewableEnergy: item.nonRenewableEnergy,
    population: item.population,
    gdp: item.gdp,
    isPredicted: type === 'predicted',
    dataType: type // Additional field to help with filtering
  }));
};

// Generate consistent styles based on data type
export const getDataTypeStyles = (dataType) => {
  switch(dataType) {
    case 'predicted':
      return {
        textStyle: 'text-gray-500 italic',
        bgStyle: 'bg-gray-50',
        hoverStyle: 'hover:bg-gray-100',
        indicatorStyle: 'bg-gray-200 text-gray-700'
      };
    case 'historical':
    default:
      return {
        textStyle: 'text-slate-700',
        bgStyle: 'bg-white',
        hoverStyle: 'hover:bg-slate-50',
        indicatorStyle: 'bg-slate-100 text-slate-700'
      };
  }
};