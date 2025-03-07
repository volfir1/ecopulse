import { theme } from '@shared/index';

// Energy type configurations for colors and other visual settings
const energyConfig = {
  solar: {
    primaryColor: '#FFB800',
    secondaryColor: '#FFCD49',
    gradientOpacity: {
      start: 0.2,
      end: 0
    },
    downloadFileName: 'Solar_Power_Generation_Summary.pdf',
    tableHeaders: ['Year', 'Predicted Production (GWh)', 'Date Added', 'Actions'],
    modalTitle: 'Solar Generation Data',
    addButtonText: 'Add Solar Data',
    tableEmptyText: 'No solar generation data available'
  },
  hydro: {
    primaryColor: '#2E90E5',
    secondaryColor: '#4FA2EA',
    gradientOpacity: {
      start: 0.3,
      end: 0
    },
    downloadFileName: 'Hydro_Power_Generation_Summary.pdf',
    tableHeaders: ['Year', 'Predicted Production (GWh)', 'Date Added', 'Actions'],
    modalTitle: 'Hydropower Generation Data',
    addButtonText: 'Add Hydropower Data',
    tableEmptyText: 'No hydropower generation data available'
  },
  wind: {
    primaryColor: '#64748B',
    secondaryColor: '#94A3B8',
    gradientOpacity: {
      start: 0.25,
      end: 0
    },
    downloadFileName: 'Wind_Power_Generation_Summary.pdf',
    tableHeaders: ['Year', 'Predicted Production (GWh)', 'Date Added', 'Actions'],
    modalTitle: 'Wind Generation Data',
    addButtonText: 'Add Wind Data',
    tableEmptyText: 'No wind generation data available'
  },
  biomass: {
    primaryColor: '#16A34A',
    secondaryColor: '#22C55E',
    gradientOpacity: {
      start: 0.2,
      end: 0.05
    },
    downloadFileName: 'Biomass_Power_Generation_Summary.pdf',
    tableHeaders: ['Year', 'Predicted Production (GWh)', 'Date Added', 'Actions'],
    modalTitle: 'Biomass Generation Data',
    addButtonText: 'Add Biomass Data',
    tableEmptyText: 'No biomass generation data available'
  },
  geothermal: {
    primaryColor: '#FF6B6B',
    secondaryColor: '#FF9E9E',
    gradientOpacity: {
      start: 0.2,
      end: 0
    },
    downloadFileName: 'Geothermal_Power_Generation_Summary.pdf',
    tableHeaders: ['Year', 'Predicted Production (GWh)', 'Date Added', 'Actions'],
    modalTitle: 'Geothermal Generation Data',
    addButtonText: 'Add Geothermal Data',
    tableEmptyText: 'No geothermal generation data available'
  }
};

// Common chart configurations that can be shared across all energy types
const { text, background, divider } = theme.palette;

/**
 * Get the color scheme for a specific energy type
 * @param {string} energyType - 'solar', 'hydro', 'wind', 'biomass', or 'geothermal'
 * @returns {object} Color configuration
 */
export const getEnergyColorScheme = (energyType = 'solar') => {
  return energyConfig[energyType] || energyConfig.solar;
};

/**
 * Get Area Chart Configuration for the specified energy type
 * @param {string} energyType - 'solar', 'hydro', 'wind', 'biomass', or 'geothermal'
 * @returns {object} Area chart configuration object
 */
export const getAreaChartConfig = (energyType = 'solar') => {
  const config = energyConfig[energyType] || energyConfig.solar;
  
  return {
    gradient: {
      id: `${energyType}Gradient`,
      stops: [
        { 
          offset: '5%', 
          color: config.secondaryColor, 
          opacity: config.gradientOpacity.start 
        },
        { 
          offset: '95%', 
          color: config.secondaryColor, 
          opacity: config.gradientOpacity.end 
        }
      ]
    },
    area: {
      type: 'monotone',
      dataKey: 'value',
      stroke: config.primaryColor,
      fill: `url(#${energyType}Gradient)`,
      strokeWidth: 2,
      dot: {
        r: 4,
        fill: config.primaryColor,
        strokeWidth: 2,
        stroke: '#FFFFFF'
      },
      activeDot: {
        r: 6,
        fill: config.primaryColor,
        stroke: '#FFFFFF',
        strokeWidth: 2
      }
    },
    tooltip: {
      contentStyle: {
        backgroundColor: background.paper,
        border: `1px solid ${divider}`,
        borderRadius: '6px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }
    }
  };
};

/**
 * Generate sample data for a specific energy type
 * @param {string} energyType - 'solar', 'hydro', 'wind', 'biomass', or 'geothermal'
 * @returns {array} Array of sample data objects
 */
export const generateSampleData = (energyType = 'solar') => {
  const currentYear = new Date().getFullYear();
  
  // Different base values and multipliers for different energy types
  const config = {
    solar: { base: 800, multiplier: 70, randomFactor: 400 },
    hydro: { base: 1200, multiplier: 50, randomFactor: 300 },
    wind: { base: 900, multiplier: 80, randomFactor: 450 },
    biomass: { base: 400, multiplier: 30, randomFactor: 200 },
    geothermal: { base: 600, multiplier: 40, randomFactor: 250 }
  };
  
  const { base, multiplier, randomFactor } = config[energyType] || config.solar;
  
  return Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    year: currentYear - 4 + i,
    generation: base + Math.random() * randomFactor + i * multiplier,
    dateAdded: new Date(Date.now() - i * 86400000).toISOString()
  }));
};

/**
 * Format data for chart visualization
 * @param {array} data - Array of data objects
 * @returns {array} Formatted data for chart
 */
export const formatDataForChart = (data) => {
  return data.map(item => ({
    date: item.year,
    value: item.generation
  }));
};

/**
 * Get table columns configuration for admin view
 * @param {string} energyType - 'solar', 'hydro', 'wind', 'biomass', or 'geothermal'
 * @param {function} onEdit - Callback for edit action
 * @param {function} onDelete - Callback for delete action
 * @returns {array} Table columns configuration
 */
export const getTableColumns = (energyType, onEdit, onDelete) => {
    return [
      {
        id: 'year',  // Change field to id for consistency
        label: 'Year',
        flex: 1,
        align: 'left',
        sortable: true
      },
      {
        id: 'generation',  // Change field to id for consistency
        label: 'Generation (GWh)',
        flex: 1.5,
        align: 'right',
        sortable: true,
        format: (value) => {
          if (value === null || value === undefined) return 'N/A';
          return typeof value === 'number' ? value.toFixed(2) : value.toString();
        }
      },
      {
        id: 'dateAdded',  // Change field to id for consistency
        label: 'Date Added',
        flex: 1.5,
        align: 'left',
        sortable: true,
        format: (value) => {
          if (!value) return 'N/A';
          try {
            return new Date(value).toLocaleDateString();
          } catch (e) {
            console.error('Invalid date value:', value);
            return 'Invalid Date';
          }
        }
      },
      {
        id: 'actions',  // Change field to id for consistency
        label: 'Actions',
        flex: 1,
        align: 'center',
        sortable: false,
        format: (_, row) => {
          if (!row || typeof row !== 'object') {
            console.warn('Row is undefined or not an object:', row);
            return null;
          }
          
          return (
            <div className="flex justify-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onEdit && typeof onEdit === 'function') onEdit(row);
                }}
                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors"
                title="Edit"
              >
                <span className="icon-edit" style={{ fontSize: '18px' }}>✏️</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onDelete && typeof onDelete === 'function' && row.id) onDelete(row.id);
                }}
                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors"
                title="Delete"
              >
                <span className="icon-delete" style={{ fontSize: '18px' }}>🗑️</span>
              </button>
            </div>
          );
        }
      }
    ];
  };
/**
 * Get chart configuration for a specific energy type
 * @param {string} energyType - 'solar', 'hydro', 'wind', 'biomass', or 'geothermal'
 * @returns {object} Chart configuration
 */
export const getChartConfig = (energyType = 'solar') => {
  const config = getEnergyColorScheme(energyType);
  const gridConfig = getGridConfig();
  
  return {
    xAxis: {
      ...gridConfig.xAxis,
      dataKey: 'date',
      label: {
        value: 'Year',
        position: 'insideBottom',
        offset: -5
      }
    },
    yAxis: {
      ...gridConfig.yAxis,
      label: {
        value: 'Generation (GWh)',
        angle: -90,
        position: 'insideLeft'
      }
    },
    line: {
      type: 'monotone',
      dataKey: 'value',
      stroke: config.primaryColor,
      strokeWidth: 2,
      dot: {
        r: 4,
        fill: config.primaryColor,
        strokeWidth: 2,
        stroke: '#FFFFFF'
      },
      activeDot: {
        r: 6,
        fill: config.primaryColor,
        stroke: '#FFFFFF',
        strokeWidth: 2
      }
    },
    tooltip: {
      formatter: (value) => `${parseFloat(value).toFixed(2)} GWh`,
      labelFormatter: (label) => `Year: ${label}`
    }
  };
};

/**
 * Validate form inputs
 * @param {string} energyType - Energy type
 * @param {number} year - Selected year
 * @param {string|number} generation - Generation value
 * @returns {object} Validation result
 */
export const validateInputs = (energyType, year, generation) => {
  const errors = {};
  
  // Check if year is valid
  if (!year) {
    errors.year = 'Year is required';
  } else if (year < 1900 || year > 2100) {
    errors.year = 'Year must be between 1900 and 2100';
  }
  
  // Check if generation is valid
  if (!generation) {
    errors.generation = 'Generation value is required';
  } else {
    const generationValue = parseFloat(generation);
    if (isNaN(generationValue)) {
      errors.generation = 'Generation must be a valid number';
    } else if (generationValue < 0) {
      errors.generation = 'Generation cannot be negative';
    } else if (generationValue > 10000) {
      errors.generation = 'Generation value is too high';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
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
    stroke: text.secondary,
    tickLine: true,
    fontSize: 12,
    tickMargin: 12,
    tick: { fill: text.secondary }
  },
  yAxis: {
    stroke: text.secondary,
    tickLine: true,
    fontSize: 12,
    tickMargin: 12,
    tick: { fill: text.secondary }
  }
});

/**
 * Get table configuration for admin view
 * @param {string} energyType - 'solar', 'hydro', 'wind', 'biomass', or 'geothermal'
 * @returns {object} Table configuration
 */
export const getTableConfig = (energyType = 'solar') => {
  const config = energyConfig[energyType] || energyConfig.solar;
  
  return {
    headers: config.tableHeaders,
    primaryColor: config.primaryColor,
    emptyText: config.tableEmptyText,
    fileName: config.downloadFileName.replace('.pdf', '.csv')
  };
};

/**
 * Get modal configuration for admin view
 * @param {string} energyType - 'solar', 'hydro', 'wind', 'biomass', or 'geothermal'
 * @returns {object} Modal configuration
 */
export const getModalConfig = (energyType = 'solar') => {
  const config = energyConfig[energyType] || energyConfig.solar;
  
  return {
    title: config.modalTitle,
    addButtonText: config.addButtonText,
    primaryColor: config.primaryColor,
    secondaryColor: config.secondaryColor
  };
};

export default {
  getAreaChartConfig,
  getGridConfig,
  getEnergyColorScheme,
  getTableConfig,
  getModalConfig,
  generateSampleData,
  formatDataForChart,
  getTableColumns,
  getChartConfig,
  validateInputs
};