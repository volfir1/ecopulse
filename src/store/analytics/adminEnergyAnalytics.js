// adminEnergyAnalytics.js
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import api from '@features/modules/api';
import { useSnackbar } from '@shared/index';
import { stores } from '../admin/adminEnergyStore';

/**
 * Custom hook for unified energy analytics functionality for admin users
 * @param {string} energyType - 'solar', 'hydro', 'wind', 'biomass', or 'geothermal'
 * @returns {object} Energy analytics functionality for the specified energy type
 */
export const useAdminEnergyAnalytics = (energyType = 'solar') => {
  // Validate energy type
  const validTypes = ['solar', 'hydro', 'wind', 'biomass', 'geothermal'];
  const normalizedType = energyType.toLowerCase();
  
  if (!validTypes.includes(normalizedType)) {
    console.error(`Invalid energy type: ${energyType}. Using solar as fallback.`);
    energyType = 'solar';
  }
  
  // Get the Zustand store for this energy type
  const store = stores[normalizedType];
  
  // Access snackbar from your shared utilities
  const snackbar = useSnackbar();
  const enqueueSnackbar = snackbar?.enqueueSnackbar || 
                         (message => console.log('Snackbar message:', message));
  
  // Create ref for chart
  const chartRef = useRef(null);
  
  // Select state from the store
  const data = store(state => state.data);
  const generationData = store(state => state.generationData);
  const currentProjection = store(state => state.currentProjection);
  const loading = store(state => state.loading);
  const isModalOpen = store(state => state.isModalOpen);
  const selectedYear = store(state => state.selectedYear);
  const generationValue = store(state => state.generationValue);
  const isEditing = store(state => state.isEditing);
  const editId = store(state => state.editId);
  const selectedStartYear = store(state => state.selectedStartYear);
  const selectedEndYear = store(state => state.selectedEndYear);
  const config = store(state => state.config);
  
  // Select actions from the store
  const initialize = store(state => state.initialize);
  const fetchData = store(state => state.fetchData);
  const fetchAllData = store(state => state.fetchAllData);
  const fetchRecordById = store(state => state.fetchRecordById);
  const handleOpenAddModal = store(state => state.handleOpenAddModal);
  const handleOpenEditModal = store(state => state.handleOpenEditModal);
  const handleCloseModal = store(state => state.handleCloseModal);
  const handleYearChange = store(state => state.handleYearChange);
  const handleGenerationChange = store(state => state.handleGenerationChange);
  const calculateTotals = store(state => state.calculateTotals);
  const handleStartYearChange = store(state => state.handleStartYearChange);
  const handleEndYearChange = store(state => state.handleEndYearChange);
  const handleRefresh = store(state => state.handleRefresh);
  const storeHandleSubmit = store(state => state.handleSubmit);
  const storeHandleDelete = store(state => state.handleDelete);
  const handleExportData = store(state => state.handleExportData);
  const handleDownload = store(state => state.handleDownload);
  const calculateInsights = store(state => state.calculateInsights);
  const forecastData = store(state => state.forecastData);
  const compareWithOtherTypes = store(state => state.compareWithOtherTypes);
  const calculateCostAnalysis = store(state => state.calculateCostAnalysis);
  const bulkDelete = store(state => state.bulkDelete);
  const searchRecords = store(state => state.searchRecords);
  const setChartRef = store(state => state.setChartRef);
  
  // Initialize data on component mount
  useEffect(() => {
    console.log(`Initializing ${normalizedType} analytics`);
    initialize();
    setChartRef(chartRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Enhanced submit handler with notifications
  const handleSubmit = useCallback(async (formValues) => {
    try {
      const result = await storeHandleSubmit(formValues);
      
      if (result.success) {
        enqueueSnackbar(result.message, { variant: 'success' });
      } else {
        enqueueSnackbar(result.message, { variant: 'error' });
      }
      
      return result;
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      enqueueSnackbar(`An error occurred while submitting: ${error.message}`, { variant: 'error' });
      return { success: false, message: error.message };
    }
  }, [storeHandleSubmit, enqueueSnackbar]);
  
  // Enhanced delete handler with notifications
  const handleDelete = useCallback(async (id) => {
    try {
      const result = await storeHandleDelete(id);
      
      if (result.success) {
        enqueueSnackbar(result.message, { variant: 'success' });
      } else {
        enqueueSnackbar(result.message, { variant: 'error' });
      }
      
      return result;
    } catch (error) {
      console.error('Error in handleDelete:', error);
      enqueueSnackbar(`An error occurred while deleting: ${error.message}`, { variant: 'error' });
      return { success: false, message: error.message };
    }
  }, [storeHandleDelete, enqueueSnackbar]);
  
  // Enhanced download handler with notifications
  const enhancedDownload = useCallback(async () => {
    try {
      enqueueSnackbar('Preparing your download...', { variant: 'info' });
      const result = await handleDownload();
      
      if (result.success) {
        enqueueSnackbar(result.message, { variant: 'success' });
      } else {
        enqueueSnackbar(result.message, { variant: 'error' });
      }
      
      return result;
    } catch (error) {
      console.error('Error in enhancedDownload:', error);
      enqueueSnackbar(`Download failed: ${error.message}`, { variant: 'error' });
      return { success: false, message: error.message };
    }
  }, [handleDownload, enqueueSnackbar]);
  
  // Enhanced export handler with notifications
  const enhancedExportData = useCallback((exportData) => {
    try {
      const result = handleExportData(exportData || data);
      
      if (result.success) {
        enqueueSnackbar(result.message, { variant: 'success' });
      } else {
        enqueueSnackbar(result.message, { variant: 'error' });
      }
      
      return result;
    } catch (error) {
      console.error('Error in enhancedExportData:', error);
      enqueueSnackbar(`Export failed: ${error.message}`, { variant: 'error' });
      return { success: false, message: error.message };
    }
  }, [handleExportData, data, enqueueSnackbar]);
  
  // Enhanced bulk delete with notifications
  const enhancedBulkDelete = useCallback(async (ids) => {
    try {
      const result = await bulkDelete(ids);
      
      if (result.success) {
        enqueueSnackbar(result.message, { variant: 'success' });
      } else {
        enqueueSnackbar(result.message, { variant: 'warning' });
      }
      
      return result;
    } catch (error) {
      console.error('Error in enhancedBulkDelete:', error);
      enqueueSnackbar(`Bulk delete failed: ${error.message}`, { variant: 'error' });
      return { success: false, message: error.message };
    }
  }, [bulkDelete, enqueueSnackbar]);
  
  // Enhanced search with notifications
  const enhancedSearch = useCallback(async (searchTerm) => {
    try {
      const result = await searchRecords(searchTerm);
      
      if (result.success && result.message) {
        enqueueSnackbar(result.message, { variant: 'info' });
      }
      
      return result;
    } catch (error) {
      console.error('Error in enhancedSearch:', error);
      enqueueSnackbar(`Search failed: ${error.message}`, { variant: 'error' });
      return { success: false, message: error.message };
    }
  }, [searchRecords, enqueueSnackbar]);

  // Calculate insights with notifications
  const enhancedCalculateInsights = useCallback(async () => {
    try {
      const result = await calculateInsights();
      
      if (result.success) {
        if (result.data) {
          enqueueSnackbar(`Analysis complete - ${normalizedType} generation is ${result.data.trend}`, { variant: 'success' });
        } else {
          enqueueSnackbar('Analysis complete', { variant: 'success' });
        }
      } else {
        enqueueSnackbar(result.message, { variant: 'warning' });
      }
      
      return result;
    } catch (error) {
      console.error('Error calculating insights:', error);
      enqueueSnackbar(`Analysis failed: ${error.message}`, { variant: 'error' });
      return { success: false, message: error.message };
    }
  }, [calculateInsights, enqueueSnackbar, normalizedType]);

  // Generate forecast with notifications
  const enhancedForecastData = useCallback(async (yearsAhead = 5) => {
    try {
      const result = await forecastData(yearsAhead);
      
      if (result.success) {
        enqueueSnackbar(`${normalizedType.charAt(0).toUpperCase() + normalizedType.slice(1)} forecast generated for ${yearsAhead} years ahead`, { variant: 'success' });
      } else {
        enqueueSnackbar(result.message, { variant: 'warning' });
      }
      
      return result;
    } catch (error) {
      console.error('Error forecasting data:', error);
      enqueueSnackbar(`Forecast failed: ${error.message}`, { variant: 'error' });
      return { success: false, message: error.message };
    }
  }, [forecastData, enqueueSnackbar, normalizedType]);

  // Enhanced cost analysis with notifications
  const enhancedCostAnalysis = useCallback(async () => {
    try {
      const result = await calculateCostAnalysis();
      
      if (result.success) {
        if (result.data) {
          enqueueSnackbar(`Cost analysis complete - ROI: ${result.data.roi.toFixed(2)}%`, { variant: 'success' });
        } else {
          enqueueSnackbar('Cost analysis complete', { variant: 'success' });
        }
      } else {
        enqueueSnackbar(result.message, { variant: 'warning' });
      }
      
      return result;
    } catch (error) {
      console.error('Error in cost analysis:', error);
      enqueueSnackbar(`Cost analysis failed: ${error.message}`, { variant: 'error' });
      return { success: false, message: error.message };
    }
  }, [calculateCostAnalysis, enqueueSnackbar]);

  // Energy type specific additional data
  const additionalData = useMemo(() => {
    switch (normalizedType) {
      case 'solar':
        return {
          irradianceData: Array.from({ length: 7 }, (_, i) => ({
            day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
            direct: 5.2 + Math.sin(i * 0.8) * 1.2 + Math.random() * 0.5,
            diffuse: 1.8 + Math.sin(i * 0.7) * 0.6 + Math.random() * 0.3
          })),
          panelEfficiency: Array.from({ length: 5 }, (_, i) => ({
            type: ['Monocrystalline', 'Polycrystalline', 'Thin-Film', 'PERC', 'Bifacial'][i],
            efficiency: [22.8, 19.5, 17.2, 21.6, 23.1][i],
            costPerWatt: [0.85, 0.65, 0.60, 0.95, 1.10][i]
          }))
        };
      case 'hydro':
        return {
          waterFlowData: Array.from({ length: 7 }, (_, i) => ({
            day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
            flow: 4200 + Math.sin(i * 0.8) * 800 + Math.random() * 400,
            generation: 3800 + Math.sin(i * 0.8) * 600 + Math.random() * 300
          })),
          turbineEfficiency: Array.from({ length: 8 }, (_, i) => ({
            turbine: `T${i + 1}`,
            efficiency: 85 + Math.sin(i * 0.5) * 10 + Math.random() * 5,
            output: 2800 + Math.sin(i * 0.7) * 400 + Math.random() * 200
          }))
        };
      case 'wind':
        return {
          windSpeedData: Array.from({ length: 7 }, (_, i) => ({
            day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
            speed: 15 + Math.sin(i * 0.9) * 7 + Math.random() * 3,
            generation: 3200 + Math.sin(i * 0.9) * 500 + Math.random() * 250
          })),
          turbineFarm: Array.from({ length: 6 }, (_, i) => ({
            turbine: `WT${i + 1}`,
            capacity: 3.5 + (i % 3) * 0.5,
            output: 2400 + Math.sin(i * 0.8) * 350 + Math.random() * 200,
            efficiency: 87 + Math.sin(i * 0.6) * 8 + Math.random() * 4
          }))
        };
      case 'biomass':
        return {
          feedstockData: Array.from({ length: 7 }, (_, i) => ({
            day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
            agricultural: 2800 + Math.sin(i * 0.8) * 500 + Math.random() * 300,
            forestry: 2200 + Math.cos(i * 0.8) * 400 + Math.random() * 250
          })),
          efficiencyData: Array.from({ length: 6 }, (_, i) => ({
            source: ['Wood', 'Crop', 'Waste', 'Biogas', 'Pellets', 'Other'][i],
            efficiency: 75 + Math.sin(i * 0.7) * 15 + Math.random() * 10,
            output: 2400 + Math.sin(i * 0.6) * 500 + Math.random() * 300
          }))
        };
      case 'geothermal':
        return {
          temperatureData: Array.from({ length: 7 }, (_, i) => ({
            day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
            surface: 150 + Math.sin(i * 0.5) * 10 + Math.random() * 5,
            deep: 280 + Math.sin(i * 0.3) * 5 + Math.random() * 3
          })),
          wellPerformance: Array.from({ length: 6 }, (_, i) => ({
            well: `Well ${i + 1}`,
            pressure: 85 + Math.sin(i * 0.7) * 10 + Math.random() * 5,
            output: 2600 + Math.sin(i * 0.6) * 300 + Math.random() * 200
          }))
        };
      default:
        return {};
    }
  }, [normalizedType]);

  return {
    // Core state
    energyType: normalizedType,
    data,
    generationData,
    currentProjection,
    loading,
    config,
    
    // Modal state
    isModalOpen,
    selectedYear,
    generationValue,
    isEditing,
    editId,
    
    // Year range
    selectedStartYear,
    selectedEndYear,
    
    // References
    chartRef,
    
    // Core actions
    initialize,
    fetchData,
    fetchAllData,
    fetchRecordById,
    handleRefresh,
    setChartRef,
    
    // Modal actions
    handleOpenAddModal,
    handleOpenEditModal,
    handleCloseModal,
    handleYearChange,
    handleGenerationChange,
    calculateTotals,
    handleSubmit,
    
    // Year range actions
    handleStartYearChange,
    handleEndYearChange,
    
    // Table actions
    handleDelete,
    bulkDelete: enhancedBulkDelete,
    handleExportData: enhancedExportData,
    
    // Download action
    handleDownload: enhancedDownload,
    
    // Search function
    searchRecords: enhancedSearch,
    
    // Advanced analytics
    calculateInsights: enhancedCalculateInsights,
    forecastData: enhancedForecastData,
    compareWithOtherTypes,
    calculateCostAnalysis: enhancedCostAnalysis,
    
    // Additional data for specific energy types
    additionalData,
    
    // Simple aliases for compatibility with existing code
    refresh: handleRefresh,
    addRecord: handleSubmit,
    updateRecord: handleSubmit,
    deleteRecord: handleDelete,
    export: enhancedExportData,
    download: enhancedDownload
  };
};

export default useAdminEnergyAnalytics;