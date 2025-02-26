import React from 'react';
import { AppIcon, theme } from '@shared/index';

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
    format: (_, row) => <ActionButtons row={row} onEdit={handleEdit} onDelete={handleDelete} />
  }
];

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

export const formatDataForChart = (data) => {
  if (!data || data.length === 0) return [];
  
  return [...data]
    .sort((a, b) => a.year - b.year)
    .map(item => ({
      year: item.year.toString(),
      value: item.generation
    }));
};

export const getChartConfig = () => {
  const { elements, text } = theme.palette;
  const hydropowerColor = '#2E90E5'; // Hydropower specific color
  
  return {
    bar: {
      dataKey: 'value',
      fill: hydropowerColor,
      radius: [4, 4, 0, 0],
      barSize: 30,
      name: 'Generation (GWh)'
    },
    tooltip: {
      formatter: (value) => [`${value.toFixed(2)} GWh`, 'Hydropower Generation'],
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
      label: 'Hydropower Generation (GWh)'
    },
    line: {
      stroke: hydropowerColor,
      strokeWidth: 2,
      dot: {
        r: 4,
        fill: hydropowerColor,
        stroke: '#fff',
        strokeWidth: 2
      },
      activeDot: {
        r: 6,
        fill: hydropowerColor,
        stroke: '#fff',
        strokeWidth: 2
      }
    }
  };
};

export const validateInputs = (year, generation) => {
  const errors = {};
  
  if (!year) {
    errors.year = 'Year is required';
  } else if (year < 1900 || year > 2100) {
    errors.year = 'Year must be between 1900 and 2100';
  }
  
  if (!generation) {
    errors.generation = 'Generation value is required';
  } else if (isNaN(generation) || parseFloat(generation) < 0) {
    errors.generation = 'Generation must be a non-negative number';
  } else if (parseFloat(generation) > 100000) {
    errors.generation = 'Generation value exceeds maximum capacity';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const generateSampleData = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    year: currentYear - 4 + i,
    // Hydropower-specific generation pattern with seasonal variations
    generation: 1200 + Math.random() * 600 + Math.sin(i * Math.PI / 2) * 200,
    dateAdded: new Date(Date.now() - i * 86400000).toISOString()
  }));
};

export default {
  getTableColumns,
  formatDataForChart,
  getChartConfig,
  validateInputs,
  generateSampleData
};