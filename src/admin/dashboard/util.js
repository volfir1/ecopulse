// dashboardUtils.js
import React from 'react';
import { AppIcon } from '@shared/index';

// Format numbers with appropriate units (K for thousands, M for millions)
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(2)}K`;
  }
  return num.toFixed(2);
};

// Format percentage with sign and 1 decimal place
export const formatPercentage = (value) => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

// Get color based on percentage change (green for positive, red for negative)
export const getChangeColor = (percentage) => {
  if (percentage > 0) return 'text-green-500';
  if (percentage < 0) return 'text-red-500';
  return 'text-gray-500';
};

// Get appropriate icon for energy source
export const getEnergyIcon = (source) => {
  switch (source.toLowerCase()) {
    case 'wind':
      return <AppIcon name="wind" className="text-slate-500" />;
    case 'solar':
      return <AppIcon name="sun" className="text-yellow-500" />;
    case 'hydropower':
      return <AppIcon name="droplet" className="text-blue-500" />;
    case 'geothermal':
      return <AppIcon name="thermometer" className="text-red-500" />;
    case 'biomass':
      return <AppIcon name="leaf" className="text-green-500" />;
    default:
      return <AppIcon name="zap" className="text-purple-500" />;
  }
};

// Get configuration for pie chart (energy mix)
export const getPieChartConfig = () => {
  return {
    legend: {
      position: 'right',
      offsetY: 30,
      height: 230
    },
    dataLabels: {
      enabled: true,
      formatter: function(val) {
        return val.toFixed(1) + '%';
      }
    },
    tooltip: {
      y: {
        formatter: function(val, opts) {
          const total = opts.series.reduce((a, b) => a + b, 0);
          const percent = (val / total * 100).toFixed(1);
          return `${val.toFixed(2)} GWh (${percent}%)`;
        }
      }
    },
    responsive: [{
      breakpoint: 768,
      options: {
        chart: {
          height: 350
        },
        legend: {
          position: 'bottom',
          offsetY: 0,
          height: 'auto'
        }
      }
    }]
  };
};

// Get configuration for line chart (yearly trends)
export const getLineChartConfig = () => {
  return {
    tooltip: {
      formatter: (value) => [`${value.toFixed(2)} GWh`, 'Generation'],
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
        value: 'Generation (GWh)',
        angle: -90,
        position: 'insideLeft',
        style: { textAnchor: 'middle' },
        offset: -5
      }
    }
  };
};

// Get configuration for bar chart (comparison)
export const getBarChartConfig = () => {
  return {
    bar: {
      dataKey: 'currentValue',
      barSize: 25,
      radius: [4, 4, 0, 0]
    },
    xAxis: {
      type: 'category',
      dataKey: 'source',
      axisLine: { stroke: '#E0E0E0' },
      tickLine: false
    },
    yAxis: {
      axisLine: { stroke: '#E0E0E0' },
      tickLine: false,
      label: {
        value: 'Generation (GWh)',
        angle: -90,
        position: 'insideLeft',
        style: { textAnchor: 'middle' },
        offset: -5
      }
    },
    tooltip: {
      formatter: (value, name, entry) => {
        const percentChange = entry.payload.percentChange;
        const changeText = percentChange >= 0 
          ? `+${percentChange.toFixed(2)}%` 
          : `${percentChange.toFixed(2)}%`;
        return [`${value.toFixed(2)} GWh (${changeText})`, entry.payload.source];
      },
      labelFormatter: (label) => `Energy Source: ${label}`
    }
  };
};

// Get color for each energy source
export const getSourceColor = (source) => {
  switch (source.toLowerCase()) {
    case 'wind':
      return '#64748B'; // Slate
    case 'solar':
      return '#FFD700'; // Gold
    case 'hydropower':
      return '#2E90E5'; // Blue
    case 'geothermal':
      return '#FF6B6B'; // Red
    case 'biomass':
      return '#16A34A'; // Green
    default:
      return '#9333EA'; // Purple (default)
  }
};

// Convert raw energy mix data to format required by pie chart
export const formatEnergyMixForChart = (mixData) => {
  if (!mixData || mixData.length === 0) return [];
  
  return mixData.map(item => ({
    name: item.label,
    value: item.value,
    percentage: item.percentage,
    color: item.color || getSourceColor(item.label)
  }));
};

// Get the array of energy sources in standard order
export const getEnergySources = () => [
  'Wind', 'Solar', 'Hydropower', 'Geothermal', 'Biomass'
];

// Calculate the growth rate between two time periods
export const calculateGrowthRate = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

// Get year-over-year comparison stats for each energy source
export const getYearOverYearComparison = (yearlyData) => {
  if (!yearlyData || yearlyData.length < 2) return [];
  
  const sources = getEnergySources();
  const currentYear = yearlyData[yearlyData.length - 1];
  const previousYear = yearlyData[yearlyData.length - 2];
  
  return sources.map(source => {
    const current = currentYear[source] || 0;
    const previous = previousYear[source] || 0;
    const change = calculateGrowthRate(current, previous);
    
    return {
      source,
      currentYear: currentYear.year,
      currentValue: current,
      previousYear: previousYear.year,
      previousValue: previous,
      change,
      color: getSourceColor(source)
    };
  });
};

// Get summary stats from yearly trends data
export const getSummaryStats = (yearlyData) => {
  if (!yearlyData || yearlyData.length === 0) return null;
  
  const latestYear = yearlyData[yearlyData.length - 1];
  const sources = getEnergySources();
  const total = sources.reduce((sum, source) => sum + (latestYear[source] || 0), 0);
  
  // Find highest contributing source
  let highestSource = null;
  let highestValue = 0;
  
  sources.forEach(source => {
    const value = latestYear[source] || 0;
    if (value > highestValue) {
      highestValue = value;
      highestSource = source;
    }
  });
  
  // Calculate growth if we have multiple years of data
  let overallGrowth = 0;
  if (yearlyData.length >= 2) {
    const firstYear = yearlyData[0];
    const firstTotal = sources.reduce((sum, source) => sum + (firstYear[source] || 0), 0);
    overallGrowth = calculateGrowthRate(total, firstTotal);
  }
  
  return {
    totalGeneration: total,
    highestSource,
    highestValue,
    years: yearlyData.length,
    startYear: yearlyData[0].year,
    endYear: latestYear.year,
    overallGrowth
  };
};

export default {
  formatNumber,
  formatPercentage,
  getChangeColor,
  getEnergyIcon,
  getPieChartConfig,
  getLineChartConfig,
  getBarChartConfig,
  getSourceColor,
  formatEnergyMixForChart,
  getEnergySources,
  calculateGrowthRate,
  getYearOverYearComparison,
  getSummaryStats
};