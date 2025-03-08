// enhancedEnergyUtils.js - Extended with area chart functions
import React from 'react';
import { AppIcon } from '@shared/index';

/**
 * Get table columns configuration for energy data
 * @param {Function} handleEdit - Function to handle edit action
 * @param {Function} handleDelete - Function to handle delete action
 * @returns {Array} Array of column configurations
 */
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
    format: (value) => {
      if (value === null || value === undefined) return '0.00';
      if (typeof value === 'object' && value !== null) {
        // Handle case where generation is an object with properties
        const total = value.total || 0;
        return total.toFixed(2);
      }
      return typeof value === 'number' ? value.toFixed(2) : '0.00';
    }
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
    // Use a static format function that renders a component instead of creating functions
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

/**
 * Format data for chart display
 * @param {Array} data - Array of energy data records
 * @returns {Array} Formatted data for charts
 */
export const formatDataForChart = (data) => {
  if (!data || data.length === 0) return [];
  
  // Sort by year ascending
  return [...data]
    .sort((a, b) => a.year - b.year)
    .map(item => {
      let value = item.generation;
      
      // Handle the case where generation is an object with properties
      if (typeof item.generation === 'object' && item.generation !== null) {
        value = item.generation.total || 0;
      }
      
      return {
        year: item.year.toString(),
        value: value
      };
    });
};

/**
 * Get energy color scheme based on energy type
 * @param {string} energyType - Type of energy (solar, wind, etc.)
 * @returns {Object} Color scheme object
 */
export const getEnergyColorScheme = (energyType = 'solar') => {
  const colorSchemes = {
    solar: {
      main: '#FFD700', // Gold
      light: '#FFECB3',
      dark: '#FFC107',
      bg: 'bg-amber-100',
      text: 'text-amber-500',
      hover: 'hover:bg-amber-600',
      tableHover: 'hover:bg-amber-50'
    },
    wind: {
      main: '#64748B', // Slate
      light: '#CBD5E1',
      dark: '#475569',
      bg: 'bg-slate-100',
      text: 'text-slate-500',
      hover: 'hover:bg-slate-600',
      tableHover: 'hover:bg-slate-50'
    },
    hydro: {
      main: '#2E90E5', // Blue
      light: '#BFDBFE',
      dark: '#1D4ED8',
      bg: 'bg-blue-100',
      text: 'text-blue-500',
      hover: 'hover:bg-blue-600',
      tableHover: 'hover:bg-blue-50'
    },
    geothermal: {
      main: '#FF6B6B', // Red
      light: '#FEE2E2',
      dark: '#DC2626',
      bg: 'bg-red-100',
      text: 'text-red-500',
      hover: 'hover:bg-red-600',
      tableHover: 'hover:bg-red-50'
    },
    biomass: {
      main: '#16A34A', // Green
      light: '#DCFCE7',
      dark: '#166534',
      bg: 'bg-green-100',
      text: 'text-green-500',
      hover: 'hover:bg-green-600',
      tableHover: 'hover:bg-green-50'
    }
  };
  
  return colorSchemes[energyType] || colorSchemes.solar;
};

/**
 * Get chart configuration for a specific energy type
 * @param {string} energyType - Type of energy (solar, wind, etc.)
 * @returns {Object} Chart configuration
 */
export const getChartConfig = (energyType = 'solar') => {
  // Get color scheme based on energy type
  const colorScheme = getEnergyColorScheme(energyType);
  
  return {
    bar: {
      dataKey: 'value',
      fill: colorScheme.main,
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
      label: {
        value: 'Generation (GWh)',
        angle: -90,
        position: 'insideLeft',
        style: { textAnchor: 'middle' }
      }
    },
    // Default line configuration
    line: {
      stroke: colorScheme.main,
      strokeWidth: 2,
      dot: {
        r: 4,
        fill: colorScheme.main,
        stroke: '#fff',
        strokeWidth: 2
      },
      activeDot: {
        r: 6,
        fill: colorScheme.main,
        stroke: '#fff',
        strokeWidth: 2
      }
    }
  };
};

/**
 * Get Area Chart Configuration for the specified energy type
 * @param {string} energyType - 'solar', 'hydro', 'wind', 'biomass', or 'geothermal'
 * @returns {object} Area chart configuration object
 */
export const getAreaChartConfig = (energyType = 'solar') => {
  const colorScheme = getEnergyColorScheme(energyType);
  
  return {
    gradient: {
      id: `${energyType}Gradient`,
      stops: [
        { 
          offset: '5%', 
          color: colorScheme.main, 
          opacity: 0.2
        },
        { 
          offset: '95%', 
          color: colorScheme.main, 
          opacity: 0
        }
      ]
    },
    area: {
      type: 'monotone',
      dataKey: 'value',
      stroke: colorScheme.main,
      fill: `url(#${energyType}Gradient)`,
      strokeWidth: 2,
      dot: {
        r: 4,
        fill: colorScheme.main,
        strokeWidth: 2,
        stroke: '#FFFFFF'
      },
      activeDot: {
        r: 6,
        fill: colorScheme.main,
        stroke: '#FFFFFF',
        strokeWidth: 2
      }
    },
    tooltip: {
      contentStyle: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #E0E0E0',
        borderRadius: '6px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }
    }
  };
};

/**
 * Get Line Chart Configuration for the specified energy type
 * @param {string} energyType - 'solar', 'hydro', 'wind', 'biomass', or 'geothermal'
 * @param {object} dataKeys - Object with keys for primary and secondary lines
 * @returns {object} Line chart configuration object
 */
export const getLineChartConfig = (energyType = 'solar', dataKeys = { primary: 'value1', secondary: 'value2' }) => {
  const colorScheme = getEnergyColorScheme(energyType);
  const secondaryColor = energyType === 'biomass' ? '#0EA5E9' : 
                        (energyType === 'geothermal' ? '#FFA500' : '#64748B');
  
  const lineNames = {
    solar: { primary: 'Irradiance', secondary: 'Power' },
    hydro: { primary: 'Water Flow', secondary: 'Generation' },
    wind: { primary: 'Wind Speed', secondary: 'Power' },
    biomass: { primary: 'Agricultural', secondary: 'Forestry' },
    geothermal: { primary: 'Temperature', secondary: 'Output' }
  };
  
  const names = lineNames[energyType] || lineNames.solar;
  
  return {
    lines: [
      {
        type: 'monotone',
        dataKey: dataKeys.primary,
        name: names.primary,
        stroke: colorScheme.main,
        strokeWidth: 2,
        dot: { 
          r: 4,
          fill: colorScheme.main,
          strokeWidth: 2,
          stroke: '#FFFFFF'
        },
        activeDot: {
          r: 6,
          fill: colorScheme.main,
          strokeWidth: 2,
          stroke: '#FFFFFF'
        }
      },
      {
        type: 'monotone',
        dataKey: dataKeys.secondary,
        name: names.secondary,
        stroke: secondaryColor,
        strokeWidth: 2,
        dot: { 
          r: 4,
          fill: secondaryColor,
          strokeWidth: 2,
          stroke: '#FFFFFF'
        },
        activeDot: {
          r: 6,
          fill: secondaryColor,
          strokeWidth: 2,
          stroke: '#FFFFFF'
        }
      }
    ],
    tooltip: {
      contentStyle: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #E0E0E0',
        borderRadius: '6px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }
    }
  };
};

/**
 * Get Bar Chart Configuration for the specified energy type
 * @param {string} energyType - 'solar', 'hydro', 'wind', 'biomass', or 'geothermal'
 * @param {string} dataKey - The data key to use for the bar chart
 * @returns {object} Bar chart configuration object
 */
export const getBarChartConfig = (energyType = 'solar', dataKey = 'efficiency') => {
  const colorScheme = getEnergyColorScheme(energyType);
  
  return {
    bar: {
      dataKey,
      fill: colorScheme.main,
      radius: [4, 4, 0, 0],
      opacity: 0.8
    },
    tooltip: {
      contentStyle: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #E0E0E0',
        borderRadius: '6px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }
    }
  };
};

/**
 * Get Grid Configuration - shared across all chart types
 * @returns {object} Grid configuration object
 */
export const getGridConfig = () => ({
  cartesianGrid: {
    strokeDasharray: '3 3',
    vertical: false,
    stroke: '#e5e7eb'
  },
  xAxis: {
    stroke: '#64748B',
    tickLine: true,
    fontSize: 12,
    tickMargin: 12,
    tick: { fill: '#64748B' }
  },
  yAxis: {
    stroke: '#64748B',
    tickLine: true,
    fontSize: 12,
    tickMargin: 12,
    tick: { fill: '#64748B' }
  }
});

/**
 * Generate metric card data based on energy type
 * @param {string} energyType - 'solar', 'hydro', 'wind', 'biomass', or 'geothermal'
 * @param {number} currentProjection - The current projection value
 * @returns {Array} Array of metric card data objects
 */
export const getMetricCardData = (energyType = 'solar', currentProjection = 0) => {
  const metricsByType = {
    solar: [
      {
        title: 'Total Generation',
        value: `${Math.round(currentProjection * 10) / 10} GWh`,
        subtitle: 'Annual projection'
      },
      {
        title: 'Panel Efficiency',
        value: '22.5%',
        subtitle: 'Average efficiency'
      },
      {
        title: 'Daily Peak',
        value: '42.8 MWh',
        subtitle: 'Highest generation'
      }
    ],
    hydro: [
      {
        title: 'Total Generation',
        value: `${Math.round(currentProjection * 10) / 10} GWh`,
        subtitle: 'Annual projection'
      },
      {
        title: 'Turbine Efficiency',
        value: '85.2%',
        subtitle: 'Average efficiency'
      },
      {
        title: 'Water Flow',
        value: '1,250 m³/s',
        subtitle: 'Average flow rate'
      }
    ],
    wind: [
      {
        title: 'Total Generation',
        value: `${Math.round(currentProjection * 10) / 10} GWh`,
        subtitle: 'Annual projection'
      },
      {
        title: 'Turbine Uptime',
        value: '92.7%',
        subtitle: 'Operational time'
      },
      {
        title: 'Wind Velocity',
        value: '16.4 m/s',
        subtitle: 'Average speed'
      }
    ],
    biomass: [
      {
        title: 'Total Generation',
        value: `${Math.round(currentProjection * 10) / 10} GWh`,
        subtitle: 'Annual projection'
      },
      {
        title: 'Feedstock Usage',
        value: '5,200 tons',
        subtitle: 'Current stock'
      },
      {
        title: 'Conversion Rate',
        value: '82.3%',
        subtitle: 'Average efficiency'
      }
    ],
    geothermal: [
      {
        title: 'Total Generation',
        value: `${Math.round(currentProjection * 10) / 10} GWh`,
        subtitle: 'Annual projection'
      },
      {
        title: 'Well Temperature',
        value: '285°C',
        subtitle: 'Average temperature'
      },
      {
        title: 'Field Capacity',
        value: '74.6%',
        subtitle: 'Resource utilization'
      }
    ]
  };
  
  return metricsByType[energyType] || metricsByType.solar;
};

/**
 * Validate input values
 * @param {number} year - Year value
 * @param {string|number|Object} generation - Generation value
 * @returns {Object} Validation result with isValid flag and errors
 */
export const validateInputs = (year, generation) => {
  const errors = {};
  
  // Validate year
  if (!year) {
    errors.year = 'Year is required';
  } else if (year < 1900 || year > 2100) {
    errors.year = 'Year must be between 1900 and 2100';
  }
  
  // Validate generation - can be string or object depending on implementation
  if (typeof generation === 'string' || typeof generation === 'number') {
    if (!generation) {
      errors.generation = 'Generation value is required';
    } else if (isNaN(parseFloat(generation)) || parseFloat(generation) < 0) {
      errors.generation = 'Generation must be a positive number';
    }
  } else if (typeof generation === 'object' && generation !== null) {
    // For advanced implementation with multiple fields
    Object.keys(generation).forEach(key => {
      const value = generation[key];
      if (key !== 'totalRenewable' && key !== 'totalPower') {
        if (!value) {
          errors[key] = `${key} value is required`;
        } else if (isNaN(parseFloat(value)) || parseFloat(value) < 0) {
          errors[key] = `${key} must be a positive number`;
        }
      }
    });
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Generate sample data for demonstration
 * @param {string} energyType - Type of energy (solar, wind, etc.)
 * @returns {Array} Array of sample data records
 */
export const generateSampleData = (energyType = 'solar') => {
  const currentYear = new Date().getFullYear();
  const baseValue = {
    solar: 1000, 
    wind: 800, 
    hydro: 1200, 
    geothermal: 600, 
    biomass: 400
  }[energyType] || 1000;
  
  return Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    year: currentYear - 4 + i,
    generation: baseValue + Math.random() * 500 + i * 50,
    dateAdded: new Date(Date.now() - i * 86400000).toISOString()
  }));
};

export default {
  getTableColumns,
  formatDataForChart,
  getChartConfig,
  getEnergyColorScheme,
  getAreaChartConfig,
  getLineChartConfig,
  getBarChartConfig,
  getGridConfig,
  getMetricCardData,
  validateInputs,
  generateSampleData
};