/**
 * Utility functions for the Peer-to-Peer Energy dashboard
 */

/**
 * Calculate renewable energy totals and update form data
 * 
 * @param {Object} formData - The current form data
 * @param {Function} handleFieldChange - Function to update form fields
 */
export const calculateTotals = (formData, handleFieldChange) => {
    const regions = ['cebu', 'negros', 'panay', 'leyteSamar', 'bohol'];
    
    regions.forEach(region => {
      // Sum all renewable energy types
      const renewableTotal = (
        parseFloat(formData.regions[region].geothermal || 0) +
        parseFloat(formData.regions[region].hydro || 0) +
        parseFloat(formData.regions[region].biomass || 0) +
        parseFloat(formData.regions[region].solar || 0) +
        parseFloat(formData.regions[region].wind || 0)
      );
      
      // Only update if value is different to avoid infinite loop
      if (renewableTotal > 0 && renewableTotal.toString() !== formData.regions[region].renewableGeneration) {
        handleFieldChange(region, 'renewableGeneration', renewableTotal.toString());
      }
    });
    
    // Calculate Visayas total power generation
    const visayasTotal = regions.reduce((total, region) => {
      return total + parseFloat(formData.regions[region].totalPowerGeneration || 0);
    }, 0);
    
    // Only update if value is different
    if (visayasTotal > 0 && visayasTotal.toString() !== formData.visayas.totalPowerGeneration) {
      handleFieldChange('visayas', 'totalPowerGeneration', visayasTotal.toString());
    }
  };
  
  /**
   * Calculate the renewable percentage for a region
   * 
   * @param {Object} regionData - Region data object
   * @returns {Number} - Renewable percentage
   */
  export const calculateRenewablePercentage = (regionData) => {
    const renewable = parseFloat(regionData?.renewableGeneration || 0);
    const total = parseFloat(regionData?.totalPowerGeneration || 0);
    return total > 0 ? (renewable / total) * 100 : 0;
  };
  
  /**
   * Format a number to a fixed decimal place with proper comma separation
   * 
   * @param {Number|String} value - The number to format
   * @param {Number} decimals - Number of decimal places
   * @returns {String} - Formatted number
   */
  export const formatNumber = (value, decimals = 1) => {
    const number = parseFloat(value || 0);
    return number.toLocaleString(undefined, { 
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };
  
  /**
   * Create region summaries from form data
   * 
   * @param {Object} formData - The form data
   * @returns {Array} - Array of region objects
   */
  export const createRegionSummaries = (formData) => {
    return [
      { name: 'Cebu', data: formData.regions.cebu },
      { name: 'Negros', data: formData.regions.negros },
      { name: 'Panay', data: formData.regions.panay },
      { name: 'Leyte-Samar', data: formData.regions.leyteSamar },
      { name: 'Bohol', data: formData.regions.bohol },
    ];
  };
  
  /**
   * Calculate total generation across all regions
   * 
   * @param {Array} regions - Array of region objects
   * @returns {Number} - Total generation
   */
  export const calculateTotalGeneration = (regions) => {
    return regions.reduce((total, region) => 
      total + parseFloat(region.data.totalPowerGeneration || 0), 0
    );
  };
  
  /**
   * Calculate total renewable energy across all regions
   * 
   * @param {Array} regions - Array of region objects
   * @returns {Number} - Total renewable energy
   */
  export const calculateTotalRenewable = (regions) => {
    return regions.reduce((total, region) => 
      total + parseFloat(region.data.renewableGeneration || 0), 0
    );
  };
  
  /**
   * Get color class based on renewable percentage
   * 
   * @param {Number} percentage - Renewable percentage
   * @returns {String} - CSS class name
   */
  export const getRenewableColorClass = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-green-400';
    if (percentage >= 30) return 'bg-yellow-500';
    return 'bg-yellow-600';
  };
  
  /**
   * Create empty region data structure
   * 
   * @returns {Object} - Empty region data structure
   */
  export const createEmptyRegionData = () => ({
    totalPowerGeneration: '',
    nonRenewableGeneration: '',
    renewableGeneration: '',
    geothermal: '',
    hydro: '',
    biomass: '',
    solar: '',
    wind: ''
  });
  
  /**
   * Create empty form data structure
   * 
   * @param {Number} year - The year to use
   * @returns {Object} - Empty form data structure
   */
  export const createEmptyFormData = (year) => ({
    year,
    regions: {
      cebu: createEmptyRegionData(),
      negros: createEmptyRegionData(),
      panay: createEmptyRegionData(),
      leyteSamar: createEmptyRegionData(),
      bohol: createEmptyRegionData()
    },
    visayas: { totalPowerGeneration: '', totalPowerConsumption: '' },
    recommendations: { solarCost: '', meralcoRate: '' }
  });