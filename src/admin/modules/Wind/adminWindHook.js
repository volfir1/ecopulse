// adminWindHook.js
import { useState, useEffect, useCallback, useRef } from 'react';
import api from '@features/modules/api';
import { useSnackbar } from '@shared/index';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

export const useWindAnalytics = () => {
  // Fix: Properly extract the enqueueSnackbar function from the hook
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

  // Fetch data based on selected year range
  const fetchData = useCallback(async (startYear, endYear) => {
    setLoading(true);
    try {
      // Try to get data from API
      try {
        const response = await api.get(`/api/predictions/wind/?start_year=${startYear}&end_year=${endYear}`);
        const data = response.data.predictions;
        const formattedData = data.map(item => ({
          date: item.Year,
          value: parseFloat(item['Predicted Production'])
        }));

        setGenerationData(formattedData);
        if (formattedData.length > 0) {
          setCurrentProjection(formattedData[formattedData.length - 1].value);
        }
      } catch (apiError) {
        console.error('API Error:', apiError);
        // For development, generate sample data when API fails
        const currentYear = new Date().getFullYear();
        const sampleData = Array.from({ length: endYear - startYear + 1 }, (_, i) => ({
          date: startYear + i,
          value: 800 + Math.random() * 400 + i * 70 // Different formula for wind
        }));
        
        setGenerationData(sampleData);
        if (sampleData.length > 0) {
          setCurrentProjection(sampleData[sampleData.length - 1].value);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      
      // Use safe fallback if snackbar fails
      try {
        enqueueSnackbar('Failed to fetch wind data', { variant: 'error' });
      } catch (snackbarError) {
        console.error('Snackbar error:', snackbarError);
      }
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  // Fetch data on component mount and when year range or refresh trigger changes
  useEffect(() => {
    fetchData(selectedStartYear, selectedEndYear);
  }, [selectedStartYear, selectedEndYear, refreshTrigger]); // fetchData removed

  // Year range handlers
  const handleStartYearChange = useCallback((year) => {
    setSelectedStartYear(year);
  }, []);

  const handleEndYearChange = useCallback((year) => {
    setSelectedEndYear(year);
  }, []);

  // Refresh data
  const handleRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Download data as PDF with chart and table
  const handleDownload = useCallback(async () => {
    try {
      // Use safe notification
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
      doc.text('Wind Power Generation Summary', 15, 15);
      
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
          doc.text('Wind Generation Chart', 15, 45);
        } catch (chartError) {
          console.error('Error capturing chart:', chartError);
          // Continue without chart if it fails
        }
      }
      
      // Add table data - position depends on if chart was included
      const tableY = chartRef.current ? 140 : 45;
      
      // Add table header
      doc.setFontSize(12);
      doc.text('Wind Generation Data Table', 15, tableY - 5);
      
      // Create table data
      doc.autoTable({
        head: [['Year', 'Predicted Production (GWh)']],
        body: generationData.map(item => [item.date, item.value.toFixed(2)]),
        startY: tableY,
        margin: { left: 15, right: 15 },
        headStyles: { fillColor: [100, 116, 139] }, // Slate color
        styles: {
          fontSize: 10,
          cellPadding: 3
        }
      });
      
      // Save PDF
      doc.save('Wind_Power_Generation_Summary.pdf');
      
      // Success notification
      try {
        enqueueSnackbar('Summary downloaded successfully!', { variant: 'success' });
      } catch (error) {
        console.log('Summary downloaded successfully!');
      }
    } catch (error) {
      console.error('Download error:', error);
      
      // Error notification with fallback
      try {
        enqueueSnackbar('Failed to download summary. Please try again.', { variant: 'error' });
      } catch (snackbarError) {
        console.error('Error showing notification:', snackbarError);
        alert('Failed to download summary. Please try again.');
      }
    }
  }, [generationData, selectedStartYear, selectedEndYear, currentProjection, enqueueSnackbar, chartRef]);

  // Additional data for potential future use
  const windSpeedData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    speed: 15 + Math.sin(i * 0.8) * 5 + Math.random() * 3,
    power: 3500 + Math.sin(i * 0.8) * 800 + Math.random() * 500
  }));

  const turbinePerformance = Array.from({ length: 6 }, (_, i) => ({
    turbine: `Turbine ${i + 1}`,
    efficiency: 92 + Math.sin(i * 0.7) * 5 + Math.random() * 3,
    output: 2200 + Math.sin(i * 0.6) * 400 + Math.random() * 200
  }));

  // Create, update, and delete methods for data management
  const addRecord = useCallback(async (year, value) => {
    setLoading(true);
    try {
      const payload = {
        Year: year,
        'Predicted Production': value
      };
      
      await api.post('/api/predictions/wind/', payload);
      
      try {
        enqueueSnackbar('Wind generation data added successfully', { variant: 'success' });
      } catch (error) {
        console.log('Wind generation data added successfully');
      }
      
      setRefreshTrigger(prev => prev + 1); // Trigger refetch
    } catch (error) {
      console.error('Error adding data:', error);
      
      try {
        enqueueSnackbar('Failed to add wind generation data', { variant: 'error' });
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
      
      await api.put(`/api/predictions/wind/${id}`, payload);
      
      try {
        enqueueSnackbar('Wind generation data updated successfully', { variant: 'success' });
      } catch (error) {
        console.log('Wind generation data updated successfully');
      }
      
      setRefreshTrigger(prev => prev + 1); // Trigger refetch
    } catch (error) {
      console.error('Error updating data:', error);
      
      try {
        enqueueSnackbar('Failed to update wind generation data', { variant: 'error' });
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
      await api.delete(`/api/predictions/wind/${id}`);
      
      try {
        enqueueSnackbar('Wind generation data deleted successfully', { variant: 'success' });
      } catch (error) {
        console.log('Wind generation data deleted successfully');
      }
      
      setRefreshTrigger(prev => prev + 1); // Trigger refetch
    } catch (error) {
      console.error('Error deleting data:', error);
      
      try {
        enqueueSnackbar('Failed to delete wind generation data', { variant: 'error' });
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
    windSpeedData,
    turbinePerformance,
    chartRef // Export the chart ref
  };
};

export default useWindAnalytics;