import { useEffect, useRef, useCallback } from 'react';
import { useSnackbar } from '@shared/index';
import { stores } from '../admin/adminEnergyStrore';

/**
 * Custom hook for energy analytics functionality
 * @param {string} energyType - 'solar', 'hydro', 'wind', 'biomass', or 'geothermal'
 * @returns {object} Energy analytics functionality for the specified energy type
 */
const useEnergyAnalytics = (energyType) => {
  // Validate energy type
  if (!['solar', 'hydro', 'wind', 'biomass', 'geothermal'].includes(energyType)) {
    throw new Error(`Invalid energy type: ${energyType}. Must be one of: solar, hydro, wind, biomass, geothermal`);
  }
  
  // Get the store for this energy type
  const store = stores[energyType];
  
  // Get snackbar functions
  const { enqueueSnackbar } = useSnackbar();
  
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
  const selectedStartYear = store(state => state.selectedStartYear);
  const selectedEndYear = store(state => state.selectedEndYear);
  const config = store(state => state.config);
  
  // Select actions from the store
  const initialize = store(state => state.initialize);
  const fetchData = store(state => state.fetchData); // Ensure fetchData is exposed
  const handleOpenAddModal = store(state => state.handleOpenAddModal);
  const handleOpenEditModal = store(state => state.handleOpenEditModal);
  const handleCloseModal = store(state => state.handleCloseModal);
  const handleYearChange = store(state => state.handleYearChange);
  const handleGenerationChange = store(state => state.handleGenerationChange);
  const handleStartYearChange = store(state => state.handleStartYearChange);
  const handleEndYearChange = store(state => state.handleEndYearChange);
  const handleRefresh = store(state => state.handleRefresh);
  const handleExportData = store(state => state.handleExportData);
  const handleDownload = store(state => state.handleDownload);
  const setChartRef = store(state => state.setChartRef);
  const storeHandleSubmit = store(state => state.handleSubmit);
  const storeHandleDelete = store(state => state.handleDelete);
  
  // Initialize data on component mount
  useEffect(() => {
    initialize();
    setChartRef(chartRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Custom wrapper for start year change to improve API call reliability
  const customHandleStartYearChange = useCallback((year) => {
    handleStartYearChange(year);
    // We call fetchData directly to ensure the API is called with the correct parameters
    fetchData(year, selectedEndYear);
  }, [handleStartYearChange, fetchData, selectedEndYear]);

  // Custom wrapper for end year change
  const customHandleEndYearChange = useCallback((year) => {
    handleEndYearChange(year);
    // We call fetchData directly to ensure the API is called with the correct parameters
    fetchData(selectedStartYear, year);
  }, [handleEndYearChange, fetchData, selectedStartYear]);
  
  // Enhanced download handler with snackbar notifications
  const handleDownloadWithNotification = useCallback(async () => {
    enqueueSnackbar('Preparing your download...', { variant: 'info' });
    
    const result = await handleDownload();
    
    if (result.success) {
      enqueueSnackbar(result.message, { variant: 'success' });
    } else {
      enqueueSnackbar(result.message, { variant: 'error' });
    }
  }, [handleDownload, enqueueSnackbar]);
  
  // Enhanced export handler with snackbar notifications
  const handleExportWithNotification = useCallback((exportData) => {
    const result = handleExportData(exportData || data);
    
    if (result.success) {
      enqueueSnackbar(result.message, { variant: 'success' });
    } else {
      enqueueSnackbar(result.message, { variant: 'info' });
    }
  }, [handleExportData, data, enqueueSnackbar]);

  // Mock data for wind-specific metrics
  const windSpeedData = [
    { month: 'Jan', speed: 18.2 },
    { month: 'Feb', speed: 17.8 },
    { month: 'Mar', speed: 19.1 },
    // Add more mock data as needed
  ];

  const turbinePerformance = {
    efficiency: 87.5,
    availability: 92.3,
    maintenanceScheduled: '2025-05-15'
  };
  
  // Return unified energy analytics functions and state
  return {
    // Data
    data,
    generationData,
    currentProjection,
    loading,
    
    // Modal state
    isModalOpen,
    selectedYear,
    generationValue,
    isEditing,
    
    // Year range
    selectedStartYear,
    selectedEndYear,
    
    // Refs
    chartRef,
    
    // Configuration
    config,
    energyType,
    
    // Modal actions
    handleOpenAddModal,
    handleOpenEditModal,
    handleCloseModal,
    handleYearChange,
    handleGenerationChange,
    
    // Table actions
    handleDelete: storeHandleDelete,
    handleExportData: handleExportWithNotification,
    
    // Chart actions
    handleStartYearChange: customHandleStartYearChange,
    handleEndYearChange: customHandleEndYearChange,
    handleDownload: handleDownloadWithNotification,
    
    // Core functions that should be exposed
    initialize,
    fetchData,
    
    // Refresh data
    handleRefresh,
    refresh: handleRefresh,
    
    // Wind-specific data (mock data for now)
    windSpeedData,
    turbinePerformance
  };
};

export default useEnergyAnalytics;