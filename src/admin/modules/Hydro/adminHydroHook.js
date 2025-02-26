// adminHydroHook.js
import { useState, useEffect, useCallback, useRef } from 'react';
import api from '@features/modules/api';
import { useSnackbar } from '@shared/index';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

export const useHydropowerAnalytics = () => {
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

  // Helper function to generate sample data
  const generateSampleData = (startYear, endYear) => {
    const years = endYear - startYear + 1;
    return Array.from({ length: years }, (_, i) => ({
      date: startYear + i,
      value: 1200 + Math.random() * 600 + i * 75 // Formula for hydropower pattern
    }));
  };

  // Single useEffect for data fetching
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      if (!selectedStartYear || !selectedEndYear) return;
      
      try {
        setLoading(true);
        // Try to access the API
        try {
          console.log('Fetching data for year range:', selectedStartYear, selectedEndYear);
          const response = await api.get(
            `/api/predictions/hydro/?start_year=${selectedStartYear}&end_year=${selectedEndYear}`,
            { signal: controller.signal }
          );
          
          if (isMounted) {
            console.log('API Response:', response.data);
            const data = response.data.predictions;
            
            if (!data) throw new Error('No data received');
            
            const formattedData = data.map(item => ({
              date: item.Year,
              value: parseFloat(item['Predicted Production'])
            }));
            
            console.log('Formatted data:', formattedData);
            setGenerationData(formattedData);
            if (formattedData.length > 0) {
              setCurrentProjection(formattedData[formattedData.length - 1].value);
            }
          }
        } catch (apiError) {
          if (isMounted) {
            // Log detailed error info for debugging
            console.error('API Error:', apiError);
            console.error('API URL:', `/api/predictions/hydro/?start_year=${selectedStartYear}&end_year=${selectedEndYear}`);
            console.error('API Response status:', apiError.response?.status);
            console.error('API Response data:', apiError.response?.data);
            
            // Generate sample data for development
            console.log('Generating sample data due to API error');
            const sampleData = generateSampleData(selectedStartYear, selectedEndYear);
            setGenerationData(sampleData);
            if (sampleData.length > 0) {
              setCurrentProjection(sampleData[sampleData.length - 1].value);
            }
            
            try {
              enqueueSnackbar('Failed to fetch hydropower data', { variant: 'error' });
            } catch (snackbarError) {
              console.error('Snackbar error:', snackbarError);
            }
          }
        }
      } catch (error) {
        if (isMounted && !controller.signal.aborted) {
          console.error('Error in data loading process:', error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [selectedStartYear, selectedEndYear, refreshTrigger]); // fetchData removed from dependencies

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
      doc.text('Hydropower Generation Summary', 15, 15);
      
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
          doc.text('Hydropower Generation Chart', 15, 45);
        } catch (chartError) {
          console.error('Error capturing chart:', chartError);
          // Continue without chart if it fails
        }
      }
      
      // Add table data - position depends on if chart was included
      const tableY = chartRef.current ? 140 : 45;
      
      // Add table header
      doc.setFontSize(12);
      doc.text('Hydropower Generation Data Table', 15, tableY - 5);
      
      // Create table data
      doc.autoTable({
        head: [['Year', 'Predicted Production (GWh)']],
        body: generationData.map(item => [item.date, item.value.toFixed(2)]),
        startY: tableY,
        margin: { left: 15, right: 15 },
        headStyles: { fillColor: [46, 144, 229] }, // Blue color for hydropower
        styles: {
          fontSize: 10,
          cellPadding: 3
        }
      });
      
      // Save PDF
      doc.save('Hydropower_Generation_Summary.pdf');
      
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

  // Additional data for potential future use
  const waterFlowData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    flow: 4200 + Math.sin(i * 0.8) * 800 + Math.random() * 400,
    generation: 3800 + Math.sin(i * 0.8) * 600 + Math.random() * 300
  }));

  const turbineEfficiency = Array.from({ length: 8 }, (_, i) => ({
    turbine: `T${i + 1}`,
    efficiency: 85 + Math.sin(i * 0.5) * 10 + Math.random() * 5,
    output: 2800 + Math.sin(i * 0.7) * 400 + Math.random() * 200
  }));

  // Create, update, and delete methods for data management
  const addRecord = useCallback(async (year, value) => {
    setLoading(true);
    try {
      const payload = {
        Year: year,
        'Predicted Production': value
      };
      
      await api.post('/api/predictions/hydro/', payload);
      
      try {
        enqueueSnackbar('Hydropower generation data added successfully', { variant: 'success' });
      } catch (error) {
        console.log('Hydropower generation data added successfully');
      }
      
      setRefreshTrigger(prev => prev + 1); // Trigger refetch
    } catch (error) {
      console.error('Error adding data:', error);
      console.error('Error details:', error.response?.data);
      
      try {
        enqueueSnackbar('Failed to add hydropower generation data', { variant: 'error' });
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
      
      await api.put(`/api/predictions/hydro/${id}`, payload);
      
      try {
        enqueueSnackbar('Hydropower generation data updated successfully', { variant: 'success' });
      } catch (error) {
        console.log('Hydropower generation data updated successfully');
      }
      
      setRefreshTrigger(prev => prev + 1); // Trigger refetch
    } catch (error) {
      console.error('Error updating data:', error);
      console.error('Error details:', error.response?.data);
      
      try {
        enqueueSnackbar('Failed to update hydropower generation data', { variant: 'error' });
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
      await api.delete(`/api/predictions/hydro/${id}`);
      
      try {
        enqueueSnackbar('Hydropower generation data deleted successfully', { variant: 'success' });
      } catch (error) {
        console.log('Hydropower generation data deleted successfully');
      }
      
      setRefreshTrigger(prev => prev + 1); // Trigger refetch
    } catch (error) {
      console.error('Error deleting data:', error);
      console.error('Error details:', error.response?.data);
      
      try {
        enqueueSnackbar('Failed to delete hydropower generation data', { variant: 'error' });
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
    waterFlowData,
    turbineEfficiency,
    chartRef // Export the chart ref
  };
};

export default useHydropowerAnalytics;