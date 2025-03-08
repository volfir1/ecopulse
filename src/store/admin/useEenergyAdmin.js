// useEnergyAdmin.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { getEnergyStore } from './adminEnergyStore';
import energyUtils from './energyUtils';
import { useSnackbar } from 'notistack'; // For notifications

/**
 * Custom hook for energy administration
 * @param {string} energyType - Type of energy (solar, wind, etc.)
 * @returns {Object} Admin hook state and functions
 */
const useEnergyAdmin = (energyType) => {
  // Get the appropriate store based on energy type
  const store = getEnergyStore(energyType);
  
  // Get notification function
  const { enqueueSnackbar } = useSnackbar();
  
  // Create a ref for chart export
  const chartRef = useRef(null);
  
  // Get store state and actions
  const {
    data,
    loading,
    error,
    isModalOpen,
    selectedYear,
    generationValue,
    isEditing,
    editId,
    yearRange,
    fetchData,
    openAddModal,
    openEditModal,
    closeModal,
    setSelectedYear,
    handleGenerationChange,
    updateGenerationValue,
    setYearRange,
    submitData,
    deleteRecord,
    exportData,
    calculateTotals
  } = store(state => state);
  
  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Show notifications when errors occur
  useEffect(() => {
    if (error) {
      enqueueSnackbar(`Error: ${error}`, { variant: 'error' });
    }
  }, [error, enqueueSnackbar]);
  
  // Enhanced handler for submitting data with notifications
  const handleSubmit = useCallback(async () => {
    try {
      const success = await submitData();
      
      if (success) {
        enqueueSnackbar(
          `${energyType} generation data ${isEditing ? 'updated' : 'added'} successfully`, 
          { variant: 'success' }
        );
      }
    } catch (err) {
      enqueueSnackbar(
        `Failed to ${isEditing ? 'update' : 'add'} ${energyType} generation data`, 
        { variant: 'error' }
      );
    }
  }, [submitData, isEditing, energyType, enqueueSnackbar]);
  
  // Enhanced handler for deleting records with notifications
  const handleDelete = useCallback(async (id) => {
    try {
      const success = await deleteRecord(id);
      
      if (success) {
        enqueueSnackbar(`${energyType} generation data deleted successfully`, { 
          variant: 'success' 
        });
      }
    } catch (err) {
      enqueueSnackbar(`Failed to delete ${energyType} generation data`, { 
        variant: 'error' 
      });
    }
  }, [deleteRecord, energyType, enqueueSnackbar]);
  
  // Handler for downloading chart as image
  const handleDownload = useCallback(() => {
    if (!chartRef.current) {
      enqueueSnackbar('Chart reference not available', { variant: 'warning' });
      return;
    }
    
    try {
      // Find the SVG element
      const svgElement = chartRef.current.querySelector('svg');
      
      if (!svgElement) {
        enqueueSnackbar('SVG element not found', { variant: 'warning' });
        return;
      }
      
      // Clone the SVG for manipulation
      const svgClone = svgElement.cloneNode(true);
      svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      
      // Convert SVG to a data URL
      const svgData = new XMLSerializer().serializeToString(svgClone);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `${energyType}_generation_chart.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      enqueueSnackbar('Chart downloaded successfully', { variant: 'success' });
    } catch (err) {
      console.error('Error downloading chart:', err);
      enqueueSnackbar('Failed to download chart', { variant: 'error' });
    }
  }, [chartRef, energyType, enqueueSnackbar]);
  
  // Handler for exporting data
  const handleExportData = useCallback((dataToExport) => {
    try {
      exportData(dataToExport);
      enqueueSnackbar('Data exported successfully', { variant: 'success' });
    } catch (err) {
      console.error('Error exporting data:', err);
      enqueueSnackbar('Failed to export data', { variant: 'error' });
    }
  }, [exportData, enqueueSnackbar]);
  
  // Handler for starting year change
  const handleStartYearChange = useCallback((year) => {
    setYearRange(year, undefined);
  }, [setYearRange]);
  
  // Handler for ending year change
  const handleEndYearChange = useCallback((year) => {
    setYearRange(undefined, year);
  }, [setYearRange]);
  
  // Effect to calculate totals when relevant generation values change
  useEffect(() => {
    const hasRelevantFields = generationValue.solar || 
                             generationValue.wind || 
                             generationValue.hydro || 
                             generationValue.biomass || 
                             generationValue.geothermal || 
                             generationValue.nonRenewable;
    
    if (hasRelevantFields) {
      calculateTotals();
    }
  }, [
    generationValue.solar,
    generationValue.wind,
    generationValue.hydro,
    generationValue.biomass,
    generationValue.geothermal,
    generationValue.nonRenewable,
    calculateTotals
  ]);
  
  // Get a projection value for certain energy types
  const currentProjection = useCallback(() => {
    // Only for certain energy types
    if (['wind', 'hydro', 'geothermal', 'biomass'].includes(energyType)) {
      const latestYear = Math.max(...data.map(item => item.year));
      const latestData = data.find(item => item.year === latestYear);
      
      if (latestData) {
        return typeof latestData.generation === 'number' 
          ? latestData.generation 
          : latestData.generation[energyType] || 0;
      }
    }
    
    return null;
  }, [data, energyType]);
  
  // Return all the necessary state and functions
  return {
    // State
    data,
    loading,
    error,
    isModalOpen,
    selectedYear,
    generationValue,
    isEditing,
    editId,
    yearRange,
    chartRef,
    currentProjection: currentProjection(),
    
    // Basic actions
    fetchData,
    
    // Modal actions
    handleOpenAddModal: openAddModal,
    handleOpenEditModal: openEditModal,
    handleCloseModal: closeModal,
    
    // Form handling
    handleYearChange: setSelectedYear,
    handleGenerationChange,
    updateGenerationValue,
    
    // Data operations
    handleSubmit,
    handleDelete,
    handleExportData,
    
    // Year range handling
    handleStartYearChange,
    handleEndYearChange,
    
    // Utility functions
    handleDownload,
    calculateTotals
  };
};

export default useEnergyAdmin;