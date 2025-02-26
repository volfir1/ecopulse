// adminBioHook.js
import { useState, useEffect, useCallback, useRef } from 'react';
import api from '@features/modules/api';
import { useSnackbar } from '@shared/index';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

export const useBiomassAnalytics = () => {
  // Properly extract the snackbar function
  const snackbar = useSnackbar();
  const enqueueSnackbar = snackbar?.enqueueSnackbar || 
                         (message => console.log('Snackbar message:', message));
  
  const [generationData, setGenerationData] = useState([]);
  const [currentProjection, setCurrentProjection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStartYear, setSelectedStartYear] = useState(new Date().getFullYear() - 4);
  const [selectedEndYear, setSelectedEndYear] = useState(new Date().getFullYear() + 1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Ref for chart element
  const chartRef = useRef(null);

  // Fetch data based on selected year range - use exact same pattern as geothermal
  const fetchData = useCallback(async (startYear, endYear) => {
    setLoading(true);
    try {
      // Try to get data from API
      try {
        console.log(`Fetching biomass data for year range: ${startYear}-${endYear}`);
        const response = await api.get(`/api/predictions/biomass/?start_year=${startYear}&end_year=${endYear}`);
        console.log('Biomass API response:', response.data);
        
        const data = response.data.predictions;
        const formattedData = data.map(item => ({
          date: item.Year,
          value: parseFloat(item['Predicted Production'])
        }));
        
        console.log('Formatted biomass data:', formattedData);
        setGenerationData(formattedData);
        if (formattedData.length > 0) {
          setCurrentProjection(formattedData[formattedData.length - 1].value);
        }
      } catch (apiError) {
        console.error('API Error:', apiError);
        console.error('API URL:', `/api/predictions/biomass/?start_year=${startYear}&end_year=${endYear}`);
        console.error('API Response status:', apiError.response?.status);
        console.error('API Response data:', apiError.response?.data);
        
        // For development, generate sample data when API fails
        console.log('Generating sample biomass data due to API failure');
        const sampleData = Array.from({ length: endYear - startYear + 1 }, (_, i) => ({
          date: startYear + i,
          value: 800 + Math.random() * 400 + i * 100 // Biomass-specific formula
        }));
        
        console.log('Sample biomass data:', sampleData);
        setGenerationData(sampleData);
        if (sampleData.length > 0) {
          setCurrentProjection(sampleData[sampleData.length - 1].value);
        }
      }
    } catch (error) {
      console.error('Error fetching biomass data:', error);
      
      try {
        enqueueSnackbar('Failed to fetch biomass data', { variant: 'error' });
      } catch (snackbarError) {
        console.error('Snackbar error:', snackbarError);
      }
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  // Fetch data on component mount and when year range or refresh trigger changes
  // Use exact same pattern as geothermal
  useEffect(() => {
    console.log('Biomass useEffect triggered with years:', selectedStartYear, selectedEndYear);
    fetchData(selectedStartYear, selectedEndYear);
  }, [selectedStartYear, selectedEndYear, refreshTrigger]); // fetchData removed

  // Year range handlers
  const handleStartYearChange = useCallback((year) => {
    console.log('Biomass start year changed to:', year);
    setSelectedStartYear(year);
  }, []);

  const handleEndYearChange = useCallback((year) => {
    console.log('Biomass end year changed to:', year);
    setSelectedEndYear(year);
  }, []);

  // Refresh data
  const handleRefresh = useCallback(() => {
    console.log('Biomass refresh triggered');
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Download data as PDF with chart and table - match geothermal pattern
  const handleDownload = useCallback(async () => {
    try {
      try {
        enqueueSnackbar('Preparing your download...', { variant: 'info' });
      } catch (error) {
        console.log('Preparing download...');
      }
      
      // Create new PDF
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add title and metadata
      doc.setFontSize(16);
      doc.text('Biomass Power Generation Summary', 15, 15);
      
      doc.setFontSize(11);
      doc.text(`Year Range: ${selectedStartYear} - ${selectedEndYear}`, 15, 25);
      doc.text(`Current Projection: ${currentProjection ? currentProjection.toFixed(2) : 'N/A'} GWh`, 15, 30);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 35);
      
      // If there's a chart reference, capture it
      if (chartRef.current) {
        try {
          // Capture chart as image
          const chartElement = chartRef.current;
          const canvas = await html2canvas(chartElement, {
            scale: 2,
            useCORS: true,
            logging: false
          });
          
          const chartImageData = canvas.toDataURL('image/png');
          
          // Add chart image to PDF
          doc.addImage(
            chartImageData, 
            'PNG', 
            15, // x position
            45, // y position
            180, // width
            80  // height
          );
          
          // Add chart title
          doc.setFontSize(12);
          doc.text('Biomass Generation Chart', 15, 45);
        } catch (chartError) {
          console.error('Error capturing chart:', chartError);
          // Continue without chart if it fails
        }
      }
      
      // Add table data - position depends on if chart was included
      const tableY = chartRef.current ? 140 : 45;
      
      // Add table header
      doc.setFontSize(12);
      doc.text('Biomass Generation Data Table', 15, tableY - 5);
      
      // Create table data
      doc.autoTable({
        head: [['Year', 'Predicted Production (GWh)']],
        body: generationData.map(item => [item.date, item.value.toFixed(2)]),
        startY: tableY,
        margin: { left: 15, right: 15 },
        headStyles: { fillColor: [22, 163, 74] }, // Green color for biomass
        styles: {
          fontSize: 10,
          cellPadding: 3
        }
      });
      
      // Save PDF
      doc.save('Biomass_Power_Generation_Summary.pdf');
      
      try {
        enqueueSnackbar('Summary downloaded successfully!', { variant: 'success' });
      } catch (error) {
        console.log('Summary downloaded successfully!');
      }
    } catch (error) {
      console.error('Download error:', error);
      
      try {
        enqueueSnackbar('Failed to download summary. Please try again.', { variant: 'error' });
      } catch (snackbarError) {
        console.error('Error showing notification:', snackbarError);
        alert('Failed to download summary. Please try again.');
      }
    }
  }, [generationData, selectedStartYear, selectedEndYear, currentProjection, enqueueSnackbar, chartRef]);

  // Additional data for potential future use - similar to geothermal's data
  const feedstockData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    agricultural: 2800 + Math.sin(i * 0.8) * 500 + Math.random() * 300,
    forestry: 2200 + Math.cos(i * 0.8) * 400 + Math.random() * 250
  }));

  const efficiencyData = Array.from({ length: 6 }, (_, i) => ({
    source: ['Wood', 'Crop', 'Waste', 'Biogas', 'Pellets', 'Other'][i],
    efficiency: 75 + Math.sin(i * 0.7) * 15 + Math.random() * 10,
    output: 2400 + Math.sin(i * 0.6) * 500 + Math.random() * 300
  }));

  // Create, update, and delete methods for data management
  const addRecord = useCallback(async (year, value) => {
    setLoading(true);
    try {
      const payload = {
        Year: year,
        'Predicted Production': value
      };
      
      console.log('Adding biomass record:', payload);
      await api.post('/api/predictions/biomass/', payload);
      
      try {
        enqueueSnackbar('Biomass generation data added successfully', { variant: 'success' });
      } catch (error) {
        console.log('Biomass generation data added successfully');
      }
      
      setRefreshTrigger(prev => prev + 1); // Trigger refetch
    } catch (error) {
      console.error('Error adding biomass data:', error);
      console.error('Error details:', error.response?.data);
      
      try {
        enqueueSnackbar('Failed to add biomass generation data', { variant: 'error' });
      } catch (snackbarError) {
        console.error('Error showing notification:', snackbarError);
      }
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const updateRecord = useCallback(async (id, year, value) => {
    setLoading(true);
    try {
      const payload = {
        Year: year,
        'Predicted Production': value
      };
      
      console.log('Updating biomass record:', id, payload);
      await api.put(`/api/predictions/biomass/${id}`, payload);
      
      try {
        enqueueSnackbar('Biomass generation data updated successfully', { variant: 'success' });
      } catch (error) {
        console.log('Biomass generation data updated successfully');
      }
      
      setRefreshTrigger(prev => prev + 1); // Trigger refetch
    } catch (error) {
      console.error('Error updating biomass data:', error);
      console.error('Error details:', error.response?.data);
      
      try {
        enqueueSnackbar('Failed to update biomass generation data', { variant: 'error' });
      } catch (snackbarError) {
        console.error('Error showing notification:', snackbarError);
      }
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const deleteRecord = useCallback(async (id) => {
    setLoading(true);
    try {
      console.log('Deleting biomass record:', id);
      await api.delete(`/api/predictions/biomass/${id}`);
      
      try {
        enqueueSnackbar('Biomass generation data deleted successfully', { variant: 'success' });
      } catch (error) {
        console.log('Biomass generation data deleted successfully');
      }
      
      setRefreshTrigger(prev => prev + 1); // Trigger refetch
    } catch (error) {
      console.error('Error deleting biomass data:', error);
      console.error('Error details:', error.response?.data);
      
      try {
        enqueueSnackbar('Failed to delete biomass generation data', { variant: 'error' });
      } catch (snackbarError) {
        console.error('Error showing notification:', snackbarError);
      }
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  return {
    generationData,
    currentProjection,
    loading,
    selectedStartYear,
    selectedEndYear,
    handleStartYearChange,
    handleEndYearChange,
    handleRefresh,
    handleDownload,
    addRecord,
    updateRecord,
    deleteRecord,
    feedstockData,
    efficiencyData,
    chartRef // Export the chart ref
  };
};

export default useBiomassAnalytics;