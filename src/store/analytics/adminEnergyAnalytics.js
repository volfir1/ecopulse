import { useEffect, useRef, useCallback } from 'react';
import { useSnackbar } from '@shared/index';
import { stores } from '../admin/adminEnergyStrore';

/**
 * Custom hook for energy admin functionality
 * @param {string} energyType - 'solar', 'hydro', 'wind', 'biomass', or 'geothermal'
 * @returns {object} Admin functionality for the specified energy type
 */
const useAdminEnergyAnalytics = (energyType) => {
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
  
  // Enhanced submit handler with snackbar notifications
  const handleSubmit = useCallback(async () => {
    const result = await storeHandleSubmit();
    
    if (result.success) {
      enqueueSnackbar(result.message, { variant: 'success' });
    } else {
      enqueueSnackbar(result.message, { variant: 'error' });
    }
  }, [storeHandleSubmit, enqueueSnackbar]);
  
  // Enhanced delete handler with snackbar notifications
  const handleDelete = useCallback(async (id) => {
    const result = await storeHandleDelete(id);
    
    if (result && result.success) {
      enqueueSnackbar(result.message, { variant: 'success' });
    } else if (result && !result.success && result.message) {
      enqueueSnackbar(result.message, { variant: 'error' });
    }
  }, [storeHandleDelete, enqueueSnackbar]);
  
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
  
  // Return unified admin functions and state
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
    handleSubmit,
    
    // Table actions
    handleDelete,
    handleExportData: handleExportWithNotification,
    
    // Chart actions
    handleStartYearChange,
    handleEndYearChange,
    handleDownload: handleDownloadWithNotification,
    
    // Refresh data
    handleRefresh,
    refresh: handleRefresh
  };
};

export default useAdminEnergyAnalytics;