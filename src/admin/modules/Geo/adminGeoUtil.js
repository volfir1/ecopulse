// adminGeoUtil.js
import React from 'react';
import { AppIcon, theme } from '@shared/index';

// Get table columns with memoized action buttons
export const getTableColumns = (handleEdit, handleDelete) => [
  { 
    id: 'year', 
    label: 'Year', 
    align: 'left',
    sortable: true
  },
  { 
    id: 'generation', 
    label: 'Generation (GWh)', 
    align: 'right',
    sortable: true,
    format: (value) => value ? value.toFixed(2) : '0.00'
  },
  { 
    id: 'dateAdded', 
    label: 'Date Added', 
    align: 'center',
    sortable: true,
    format: (value) => value ? new Date(value).toLocaleDateString() : '-',
  },
  { 
    id: 'actions', 
    label: 'Actions', 
    align: 'center',
    sortable: false,
    // Use a static format function that doesn't create new functions on each render
    format: (_, row) => <ActionButtons row={row} onEdit={handleEdit} onDelete={handleDelete} />
  }
];

// Create a separate component for the action buttons
const ActionButtons = React.memo(({ row, onEdit, onDelete }) => {
  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(row);
  };
  
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(row.id);
  };
  
  return (
    <div className="flex justify-center gap-2">
      <button 
        onClick={handleEdit}
        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors"
        title="Edit"
      >
        <AppIcon name="edit" size={18} />
      </button>
      <button 
        onClick={handleDelete}
        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors"
        title="Delete"
      >
        <AppIcon name="trash" size={18} />
      </button>
    </div>
  );
});

// Format data for the chart
export const formatDataForChart = (data) => {
  if (!data || data.length === 0) return [];
  
  // Sort by year ascending
  return [...data]
    .sort((a, b) => a.year - b.year)
    .map(item => ({
      year: item.year.toString(),
      value: item.generation
    }));
};

// Get chart configuration
export const getChartConfig = () => {
  const { elements, text } = theme.palette;
  const geothermalColor = '#FF6B6B'; // Use geothermal red color
  
  return {
    bar: {
      dataKey: 'value',
      fill: geothermalColor,
      radius: [4, 4, 0, 0],
      barSize: 30,
      name: 'Generation (GWh)'
    },
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
      // This base label will be extended in the component
      label: ''
    },
    // Default line configuration
    line: {
      stroke: geothermalColor,
      strokeWidth: 2,
      dot: {
        r: 4,
        fill: geothermalColor,
        stroke: '#fff',
        strokeWidth: 2
      },
      activeDot: {
        r: 6,
        fill: geothermalColor,
        stroke: '#fff',
        strokeWidth: 2
      }
    }
  };
};

// Validate form inputs
export const validateInputs = (year, generation) => {
  const errors = {};
  
  if (!year) {
    errors.year = 'Year is required';
  } else if (year < 1900 || year > 2100) {
    errors.year = 'Year must be between 1900 and 2100';
  }
  
  if (!generation) {
    errors.generation = 'Generation value is required';
  } else if (isNaN(generation) || parseFloat(generation) <= 0) {
    errors.generation = 'Generation must be a positive number';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Generate sample data for development
export const generateSampleData = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    year: currentYear - 4 + i,
    generation: 900 + Math.random() * 300 + i * 60, // Different formula for geothermal
    dateAdded: new Date(Date.now() - i * 86400000).toISOString()
  }));
};

// Calculate statistics for geothermal data
export const calculateStats = (data) => {
  if (!data || data.length === 0) {
    return {
      average: 0,
      min: 0,
      max: 0,
      total: 0,
      growthRate: 0
    };
  }

  const values = data.map(item => item.generation);
  const total = values.reduce((sum, val) => sum + val, 0);
  const average = total / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  // Calculate average annual growth rate
  let growthRate = 0;
  if (data.length > 1) {
    const sortedData = [...data].sort((a, b) => a.year - b.year);
    const firstYear = sortedData[0].generation;
    const lastYear = sortedData[sortedData.length - 1].generation;
    const years = sortedData.length - 1;
    
    if (firstYear > 0) {
      // Compound Annual Growth Rate formula
      growthRate = ((lastYear / firstYear) ** (1 / years) - 1) * 100;
    }
  }
  
  return {
    average: average.toFixed(2),
    min: min.toFixed(2),
    max: max.toFixed(2),
    total: total.toFixed(2),
    growthRate: growthRate.toFixed(2)
  };
};

// Format for export
export const formatForExport = (data) => {
  return data.map(item => ({
    Year: item.year,
    'Generation (GWh)': item.generation.toFixed(2),
    'Date Added': new Date(item.dateAdded).toLocaleDateString()
  }));
};

export default {
  getTableColumns,
  formatDataForChart,
  getChartConfig,
  validateInputs,
  generateSampleData,
  calculateStats,
  formatForExport
};