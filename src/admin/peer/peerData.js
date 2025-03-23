import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { calculateTotals } from './peerUtils';

/**
 * Custom hook to manage peer-to-peer energy data
 * @param {Object} options - Configuration options
 * @param {Number} options.defaultYear - Default selected year  
 * @returns {Object} - State and handlers
 */
export const usePeerToPeerData = ({ defaultYear = new Date().getFullYear() }) => {
  // State management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRegion, setEditingRegion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [tableData, setTableData] = useState([]);
  
  // Data state
  const [dashboardData, setDashboardData] = useState({
    regions: {
      cebu: { totalPowerGeneration: '', nonRenewableGeneration: '', renewableGeneration: '', geothermal: '', hydro: '', biomass: '', solar: '', wind: '' },
      negros: { totalPowerGeneration: '', nonRenewableGeneration: '', renewableGeneration: '', geothermal: '', hydro: '', biomass: '', solar: '', wind: '' },
      panay: { totalPowerGeneration: '', nonRenewableGeneration: '', renewableGeneration: '', geothermal: '', hydro: '', biomass: '', solar: '', wind: '' },
      leyteSamar: { totalPowerGeneration: '', nonRenewableGeneration: '', renewableGeneration: '', geothermal: '', hydro: '', biomass: '', solar: '', wind: '' },
      bohol: { totalPowerGeneration: '', nonRenewableGeneration: '', renewableGeneration: '', geothermal: '', hydro: '', biomass: '', solar: '', wind: '' }
    },
    visayas: { totalPowerGeneration: '', totalPowerConsumption: '' },
    recommendations: { solarCost: '', meralcoRate: '' }
  });
  
  const [formData, setFormData] = useState({
    year: defaultYear,
    regions: {
      cebu: { totalPowerGeneration: '', nonRenewableGeneration: '', renewableGeneration: '', geothermal: '', hydro: '', biomass: '', solar: '', wind: '' },
      negros: { totalPowerGeneration: '', nonRenewableGeneration: '', renewableGeneration: '', geothermal: '', hydro: '', biomass: '', solar: '', wind: '' },
      panay: { totalPowerGeneration: '', nonRenewableGeneration: '', renewableGeneration: '', geothermal: '', hydro: '', biomass: '', solar: '', wind: '' },
      leyteSamar: { totalPowerGeneration: '', nonRenewableGeneration: '', renewableGeneration: '', geothermal: '', hydro: '', biomass: '', solar: '', wind: '' },
      bohol: { totalPowerGeneration: '', nonRenewableGeneration: '', renewableGeneration: '', geothermal: '', hydro: '', biomass: '', solar: '', wind: '' }
    },
    visayas: { totalPowerGeneration: '', totalPowerConsumption: '' },
    recommendations: { solarCost: '', meralcoRate: '' }
  });
  
  // Form field change handler
  const handleFieldChange = useCallback((regionKey, field, value) => {
    setFormData(prevData => {
      if (regionKey === 'visayas' || regionKey === 'recommendations') {
        return {
          ...prevData,
          [regionKey]: {
            ...prevData[regionKey],
            [field]: value
          }
        };
      } else {
        return {
          ...prevData,
          regions: {
            ...prevData.regions,
            [regionKey]: {
              ...prevData.regions[regionKey],
              [field]: value
            }
          }
        };
      }
    });
  }, []);
  
  // Automatically calculate totals when form data changes
  useEffect(() => {
    calculateTotals(formData, handleFieldChange);
  }, [formData.regions, handleFieldChange]);
  
  // Year change handler
  const handleYearChange = useCallback((year) => {
    setSelectedYear(year);
    setIsLoading(true);
    
    // API call to fetch data for the selected year
    axios.get(`http://127.0.0.1:8000/api/peertopeer/`, {
      params: { year: year }
    })
      .then(response => {
        console.log('API response:', response.data);
        if (response.data && response.data.predictions) {
          processPredictionData(response.data.predictions);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setHasError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  
  // Process API data
  const processPredictionData = useCallback((predictions) => {
    // Group data by location/region
    const regionData = {
      cebu: { totalPowerGeneration: 0, nonRenewableGeneration: 0, renewableGeneration: 0, 
              geothermal: 0, hydro: 0, biomass: 0, solar: 0, wind: 0 },
      negros: { totalPowerGeneration: 0, nonRenewableGeneration: 0, renewableGeneration: 0, 
               geothermal: 0, hydro: 0, biomass: 0, solar: 0, wind: 0 },
      panay: { totalPowerGeneration: 0, nonRenewableGeneration: 0, renewableGeneration: 0, 
              geothermal: 0, hydro: 0, biomass: 0, solar: 0, wind: 0 },
      leyteSamar: { totalPowerGeneration: 0, nonRenewableGeneration: 0, renewableGeneration: 0, 
                   geothermal: 0, hydro: 0, biomass: 0, solar: 0, wind: 0 },
      bohol: { totalPowerGeneration: 0, nonRenewableGeneration: 0, renewableGeneration: 0, 
              geothermal: 0, hydro: 0, biomass: 0, solar: 0, wind: 0 }
    };
    
    // Process each prediction and map to our data structure
    predictions.forEach(prediction => {
      const place = prediction.Place.toLowerCase().replace('-', '');
      const energyType = prediction['Energy Type'];
      const value = prediction['Predicted Value'];
      
      if (!regionData[place]) return; // Skip if region not recognized
      
      // Map API energy types to our data structure
      if (energyType === 'Total Power Generation (GWh)') {
        regionData[place].totalPowerGeneration = value;
      } else if (energyType === 'Total Non-Renewable Energy (GWh)') {
        regionData[place].nonRenewableGeneration = value;
      } else if (energyType === 'Total Renewable Energy (GWh)') {
        regionData[place].renewableGeneration = value;
      } else if (energyType === 'Geothermal (GWh)') {
        regionData[place].geothermal = value;
      } else if (energyType === 'Hydro (GWh)') {
        regionData[place].hydro = value;
      } else if (energyType === 'Biomass (GWh)') {
        regionData[place].biomass = value;
      } else if (energyType === 'Solar (GWh)') {
        regionData[place].solar = value;
      } else if (energyType === 'Wind (GWh)') {
        regionData[place].wind = value;
      }
    });
    
    // Update form data with processed API data
    setFormData(prevData => ({
      ...prevData,
      regions: {
        cebu: regionData.cebu,
        negros: regionData.negros,
        panay: regionData.panay,
        leyteSamar: regionData.leyteSamar,
        bohol: regionData.bohol
      }
    }));

    // Also update dashboard data
    setDashboardData(prevData => ({
      ...prevData,
      regions: {
        cebu: regionData.cebu,
        negros: regionData.negros,
        panay: regionData.panay,
        leyteSamar: regionData.leyteSamar,
        bohol: regionData.bohol
      }
    }));
  }, []);
  
  // Refresh data from API
  const handleRefreshData = useCallback(() => {
    setIsLoading(true);
    
    axios.get(`http://127.0.0.1:8000/api/peertopeer/`, {
      params: { year: selectedYear }
    })
      .then(response => {
        if (response.data && response.data.predictions) {
          processPredictionData(response.data.predictions);
          // Also update table data
          setTableData(response.data.yearlyData || []);
        }
      })
      .catch(error => {
        console.error('Error refreshing data:', error);
        setHasError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedYear, processPredictionData]);

  // Save record to API
  const handleSaveRecord = useCallback(() => {
    setIsLoading(true);
    
    // Prepare data for API
    const apiData = {
      year: selectedYear,
      cebu: {
        totalPowerGeneration: parseFloat(formData.regions.cebu.totalPowerGeneration || 0),
        nonRenewableGeneration: parseFloat(formData.regions.cebu.nonRenewableGeneration || 0),
        renewableGeneration: parseFloat(formData.regions.cebu.renewableGeneration || 0),
        geothermal: parseFloat(formData.regions.cebu.geothermal || 0),
        hydro: parseFloat(formData.regions.cebu.hydro || 0),
        biomass: parseFloat(formData.regions.cebu.biomass || 0),
        solar: parseFloat(formData.regions.cebu.solar || 0),
        wind: parseFloat(formData.regions.cebu.wind || 0)
      },
      negros: {
        totalPowerGeneration: parseFloat(formData.regions.negros.totalPowerGeneration || 0),
        nonRenewableGeneration: parseFloat(formData.regions.negros.nonRenewableGeneration || 0),
        renewableGeneration: parseFloat(formData.regions.negros.renewableGeneration || 0),
        geothermal: parseFloat(formData.regions.negros.geothermal || 0),
        hydro: parseFloat(formData.regions.negros.hydro || 0),
        biomass: parseFloat(formData.regions.negros.biomass || 0),
        solar: parseFloat(formData.regions.negros.solar || 0),
        wind: parseFloat(formData.regions.negros.wind || 0)
      },
      panay: {
        totalPowerGeneration: parseFloat(formData.regions.panay.totalPowerGeneration || 0),
        nonRenewableGeneration: parseFloat(formData.regions.panay.nonRenewableGeneration || 0),
        renewableGeneration: parseFloat(formData.regions.panay.renewableGeneration || 0),
        geothermal: parseFloat(formData.regions.panay.geothermal || 0),
        hydro: parseFloat(formData.regions.panay.hydro || 0),
        biomass: parseFloat(formData.regions.panay.biomass || 0),
        solar: parseFloat(formData.regions.panay.solar || 0),
        wind: parseFloat(formData.regions.panay.wind || 0)
      },
      leyteSamar: {
        totalPowerGeneration: parseFloat(formData.regions.leyteSamar.totalPowerGeneration || 0),
        nonRenewableGeneration: parseFloat(formData.regions.leyteSamar.nonRenewableGeneration || 0),
        renewableGeneration: parseFloat(formData.regions.leyteSamar.renewableGeneration || 0),
        geothermal: parseFloat(formData.regions.leyteSamar.geothermal || 0),
        hydro: parseFloat(formData.regions.leyteSamar.hydro || 0),
        biomass: parseFloat(formData.regions.leyteSamar.biomass || 0),
        solar: parseFloat(formData.regions.leyteSamar.solar || 0),
        wind: parseFloat(formData.regions.leyteSamar.wind || 0)
      },
      bohol: {
        totalPowerGeneration: parseFloat(formData.regions.bohol.totalPowerGeneration || 0),
        nonRenewableGeneration: parseFloat(formData.regions.bohol.nonRenewableGeneration || 0),
        renewableGeneration: parseFloat(formData.regions.bohol.renewableGeneration || 0),
        geothermal: parseFloat(formData.regions.bohol.geothermal || 0),
        hydro: parseFloat(formData.regions.bohol.hydro || 0),
        biomass: parseFloat(formData.regions.bohol.biomass || 0),
        solar: parseFloat(formData.regions.bohol.solar || 0),
        wind: parseFloat(formData.regions.bohol.wind || 0)
      },
      visayas: {
        totalPowerConsumption: parseFloat(formData.visayas.totalPowerConsumption || 0)
      },
      recommendations: {
        solarCost: parseFloat(formData.recommendations.solarCost || 0),
        meralcoRate: parseFloat(formData.recommendations.meralcoRate || 0)
      }
    };
    
    // POST or PUT request based on whether we're editing or adding
    const apiMethod = isEditing ? 'put' : 'post';
    const apiUrl = `http://127.0.0.1:8000/api/peertopeer/${isEditing ? selectedRecord?.id || '' : ''}`;
    
    axios[apiMethod](apiUrl, apiData)
      .then(response => {
        console.log('Data saved successfully:', response.data);
        setIsModalOpen(false);
        // Refresh data after saving
        handleRefreshData();
      })
      .catch(error => {
        console.error('Error saving data:', error);
        setHasError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedYear, formData, isEditing, selectedRecord, handleRefreshData]);

  // Modal handlers
  const handleOpenAddModal = useCallback(() => {
    setIsEditing(false);
    setEditingRegion(null);
    setFormData({
      year: selectedYear,
      regions: {
        cebu: { totalPowerGeneration: '', nonRenewableGeneration: '', renewableGeneration: '', geothermal: '', hydro: '', biomass: '', solar: '', wind: '' },
        negros: { totalPowerGeneration: '', nonRenewableGeneration: '', renewableGeneration: '', geothermal: '', hydro: '', biomass: '', solar: '', wind: '' },
        panay: { totalPowerGeneration: '', nonRenewableGeneration: '', renewableGeneration: '', geothermal: '', hydro: '', biomass: '', solar: '', wind: '' },
        leyteSamar: { totalPowerGeneration: '', nonRenewableGeneration: '', renewableGeneration: '', geothermal: '', hydro: '', biomass: '', solar: '', wind: '' },
        bohol: { totalPowerGeneration: '', nonRenewableGeneration: '', renewableGeneration: '', geothermal: '', hydro: '', biomass: '', solar: '', wind: '' }
      },
      visayas: { totalPowerGeneration: '', totalPowerConsumption: '' },
      recommendations: { solarCost: '', meralcoRate: '' }
    });
    setIsModalOpen(true);
  }, [selectedYear]);
  
  const handleEditRegion = useCallback((region) => {
    const regionKey = region.toLowerCase().replace('-', '');
    setEditingRegion(regionKey);
    setIsEditing(true);
    setIsModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((record) => {
    setSelectedRecord(record);
    // Populate formData from the record
    setFormData({
      year: record.Year || selectedYear,
      regions: {
        cebu: {
          totalPowerGeneration: record["Cebu Total Power Generation (GWh)"] || '',
          nonRenewableGeneration: record["Cebu Total Non-Renewable Energy (GWh)"] || '',
          renewableGeneration: record["Cebu Total Renewable Energy (GWh)"] || '',
          geothermal: record["Cebu Geothermal (GWh)"] || '',
          hydro: record["Cebu Hydro (GWh)"] || '',
          biomass: record["Cebu Biomass (GWh)"] || '',
          solar: record["Cebu Solar (GWh)"] || '',
          wind: record["Cebu Wind (GWh)"] || ''
        },
        negros: {
          totalPowerGeneration: record["Negros Total Power Generation (GWh)"] || '',
          nonRenewableGeneration: record["Negros Total Non-Renewable Energy (GWh)"] || '',
          renewableGeneration: record["Negros Total Renewable Energy (GWh)"] || '',
          geothermal: record["Negros Geothermal (GWh)"] || '',
          hydro: record["Negros Hydro (GWh)"] || '',
          biomass: record["Negros Biomass (GWh)"] || '',
          solar: record["Negros Solar (GWh)"] || '',
          wind: record["Negros Wind (GWh)"] || ''
        },
        panay: {
          totalPowerGeneration: record["Panay Total Power Generation (GWh)"] || '',
          nonRenewableGeneration: record["Panay Total Non-Renewable Energy (GWh)"] || '',
          renewableGeneration: record["Panay Total Renewable Energy (GWh)"] || '',
          geothermal: record["Panay Geothermal (GWh)"] || '',
          hydro: record["Panay Hydro (GWh)"] || '',
          biomass: record["Panay Biomass (GWh)"] || '',
          solar: record["Panay Solar (GWh)"] || '',
          wind: record["Panay Wind (GWh)"] || ''
        },
        leyteSamar: {
          totalPowerGeneration: record["Leyte-Samar Total Power Generation (GWh)"] || '',
          nonRenewableGeneration: record["Leyte-Samar Total Non-Renewable Energy (GWh)"] || '',  // Fixed field name
          renewableGeneration: record["Leyte-Samar Total Renewable Energy (GWh)"] || '',  // Fixed field name
          geothermal: record["Leyte-Samar Geothermal (GWh)"] || '',
          hydro: record["Leyte-Samar Hydro (GWh)"] || '',
          biomass: record["Leyte-Samar Biomass (GWh)"] || '',
          solar: record["Leyte-Samar Solar (GWh)"] || '',
          wind: record["Leyte-Samar Wind (GWh)"] || ''
        },
        bohol: {
          totalPowerGeneration: record["Bohol Total Power Generation (GWh)"] || '',
          nonRenewableGeneration: record["Bohol Total Non-Renewable Energy (GWh)"] || '',  // Fixed field name
          renewableGeneration: record["Bohol Total Renewable Energy (GWh)"] || '',  // Fixed field name
          geothermal: record["Bohol Geothermal (GWh)"] || '',
          hydro: record["Bohol Hydro (GWh)"] || '',
          biomass: record["Bohol Biomass (GWh)"] || '',
          solar: record["Bohol Solar (GWh)"] || '',
          wind: record["Bohol Wind (GWh)"] || ''
        }
      },
      visayas: {
        totalPowerGeneration: record["Visayas Total Power Generation (GWh)"] || '',
        totalPowerConsumption: record["Visayas Total Power Consumption (GWh)"] || ''
      },
      recommendations: {
        solarCost: record["Solar Cost (PHP/W)"] || '',
        meralcoRate: record["MERALCO Rate (PHP/kWh)"] || ''
      }
    });
    setIsEditing(true);
    setEditingRegion(null);
    setIsModalOpen(true);
  }, [selectedYear]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Fetch initial data on mount
  useEffect(() => {
    handleRefreshData();
  }, [handleRefreshData]);

  return {
    // State
    isModalOpen,
    selectedRecord,
    selectedYear,
    isEditing,
    editingRegion,
    isLoading,
    hasError,
    formData,
    dashboardData,
    tableData,
    
    // Handlers
    setIsModalOpen,
    setSelectedRecord,
    setSelectedYear,
    handleYearChange,
    handleFieldChange,
    handleRefreshData,
    handleSaveRecord,
    handleOpenAddModal,
    handleOpenEditModal,
    handleEditRegion,
    handleCloseModal
  };
};

export default usePeerToPeerData;