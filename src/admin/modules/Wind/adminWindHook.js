// adminWindHook.js - FIXED VERSION
import { useState, useEffect, useCallback, useRef } from 'react';
import api from '@features/modules/api';
import { useSnackbar } from '@shared/index';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

export const useWindAnalytics = () => {
  // Custom hooks
  const snackbar = useSnackbar();
  const enqueueSnackbar = snackbar?.enqueueSnackbar ||
                         (message => console.log('Snackbar message:', message));
 
  // State declarations in consistent order
  const [generationData, setGenerationData] = useState([]);
  const [mongoDbData, setMongoDbData] = useState([]);
  const [predictedData, setPredictedData] = useState([]);
  const [currentProjection, setCurrentProjection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStartYear, setSelectedStartYear] = useState(new Date().getFullYear());
  const [selectedEndYear, setSelectedEndYear] = useState(new Date().getFullYear() + 5);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [requestInProgress, setRequestInProgress] = useState(false); // Track API request status
 
  // Chart reference
  const chartRef = useRef(null);
  
  // Prevent infinite fetch loops with this ref
  const isDataFetched = useRef(false);
  
  // Helper function to clean response data
  const cleanResponse = (response) => {
    if (typeof response === 'string') {
      return response.replace(/NaN/g, 'null');
    }
    return response;
  };

  // Fetch wind-specific data
  const fetchData = useCallback(async (startYear, endYear) => {
    // Prevent multiple concurrent requests
    if (requestInProgress) {
      console.log("Request already in progress, skipping fetch");
      return;
    }
    
    // Set loading and request status
    setLoading(true);
    setRequestInProgress(true);
    
    try {
      console.log("Fetching data for year range:", startYear, "-", endYear);
      
      // Calculate dynamic year range
      const currentYear = new Date().getFullYear();
      const minYear = 2000; // Lowest historical year
      const maxYear = currentYear + 50; // Allow predictions up to 50 years in the future
      
      // Make the API request with full year range
      const response = await api.get(`/api/predictions/wind/?start_year=${minYear}&end_year=${maxYear}`);
      
      // Clean the response
      const cleanedResponse = typeof response.data === 'string' 
        ? cleanResponse(response.data)
        : JSON.stringify(response.data);

      // Parse the cleaned JSON string
      const responseData = JSON.parse(cleanedResponse);
      
      console.log("API Response received");

      // Check if the response contains the expected data
      if (responseData.status === "success" && Array.isArray(responseData.predictions)) {
        console.log("Processing predictions, count:", responseData.predictions.length);
        
        const formattedData = responseData.predictions.map(item => {
          // Get specifically the Wind (GWh) value
          const windValue = item['Wind (GWh)'] !== undefined ? 
                          parseFloat(item['Wind (GWh)']) : 
                          (item['Predicted Production'] !== undefined ? 
                            parseFloat(item['Predicted Production']) : 0);
          
          return {
            date: parseInt(item.Year),
            value: windValue,
            nonRenewableEnergy: item['Non-Renewable Energy (GWh)'] !== undefined ? 
                              parseFloat(item['Non-Renewable Energy (GWh)']) : null,
            population: item['Population (in millions)'] !== undefined ? 
                      parseFloat(item['Population (in millions)']) : null,
            gdp: item['Gross Domestic Product'] !== undefined ? 
                parseFloat(item['Gross Domestic Product']) : null,
            isPredicted: item.isPredicted === true, // Ensure boolean value
            _id: item._id || null // Store MongoDB ID if available
          };
        });

        // Filter out invalid data but keep all valid years
        const validData = formattedData.filter(item => 
          item.date !== null && item.date !== undefined && !isNaN(item.date)
        );
        
        console.log("Valid data processed:", validData.length);

        // Set the overall wind generation data
        setGenerationData(validData);
        
        // Use isPredicted flag for classification
        const mongoData = validData.filter(item => item.isPredicted === false);
        const predictData = validData.filter(item => item.isPredicted === true);
        
        console.log('Historical data count:', mongoData.length);
        console.log('Predicted data count:', predictData.length);
        
        setMongoDbData(mongoData);
        setPredictedData(predictData);
        
        // Set current projection
        if (validData.length > 0) {
          const sortedData = [...validData].sort((a, b) => b.date - a.date);
          if (sortedData.length > 0) {
            setCurrentProjection(sortedData[0].value);
          }
        }
      } else {
        throw new Error("Invalid data format in API response");
      }
    } catch (error) {
      console.error('Error fetching wind data:', error);
      enqueueSnackbar('Failed to fetch wind data. Please try again.', { variant: 'error' });
    } finally {
      setLoading(false);
      setRequestInProgress(false);
      isDataFetched.current = true; // Mark data as fetched regardless of success/failure
      console.log("Fetch complete, setting isDataFetched to true");
    }
  }, [enqueueSnackbar]);

  // Fetch data when component mounts or when refresh is triggered
  // FIXED: Simplified the dependency array and added clear debug logs
  useEffect(() => {
    console.log("Data fetch effect triggered");
    console.log("isDataFetched:", isDataFetched.current);
    console.log("requestInProgress:", requestInProgress);
    
    // Only fetch if not yet fetched or explicitly triggered with refreshTrigger
    if (!isDataFetched.current && !requestInProgress) {
      console.log("Running initial data fetch");
      fetchData(selectedStartYear, selectedEndYear);
    }
  }, [fetchData, selectedStartYear, selectedEndYear, requestInProgress, refreshTrigger]);
  
  // Year range handlers with request prevention
  const handleStartYearChange = useCallback((year) => {
    console.log("Start year changed to:", year);
    if (year !== selectedStartYear) {
      setSelectedStartYear(year);
      // Note: We don't reset isDataFetched here anymore
    }
  }, [selectedStartYear]);

  const handleEndYearChange = useCallback((year) => {
    console.log("End year changed to:", year);
    if (year !== selectedEndYear) {
      setSelectedEndYear(year);
      // Note: We don't reset isDataFetched here anymore
    }
  }, [selectedEndYear]);

  // Refresh data - FIXED: Only reset the flag if we're not already fetching
  const handleRefresh = useCallback(() => {
    console.log("Manual refresh requested");
    if (!requestInProgress) {
      console.log("Triggering manual refresh");
      // Only reset if we're not already fetching
      isDataFetched.current = false;
      setRefreshTrigger(prev => prev + 1);
    } else {
      console.log("Request in progress, ignoring refresh");
    }
  }, [requestInProgress]);

  // Wind-specific PDF download with chart and table
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
     
      // FIXED: Only include data within the selected year range
      const filteredGenerationData = generationData.filter(item => 
        item.date >= selectedStartYear && item.date <= selectedEndYear
      );
      
      console.log(`Filtered PDF data: ${filteredGenerationData.length} records between ${selectedStartYear}-${selectedEndYear}`);
     
      // Create table data - sorted by year for better readability
      doc.autoTable({
        head: [['Year', 'Wind Production (GWh)', 'Type']],
        body: filteredGenerationData
          .sort((a, b) => a.date - b.date) // Sort by year ascending
          .map(item => [
            item.date, 
            isNaN(item.value) ? 'N/A' : item.value.toFixed(2),
            item.isPredicted ? 'Predicted' : 'Historical'
          ]),
        startY: tableY,
        margin: { left: 15, right: 15 },
        headStyles: { fillColor: [100, 116, 139] }, // Slate color for wind
        styles: {
          fontSize: 10,
          cellPadding: 3
        },
        // Style predicted rows differently
        rowStyles: row => {
          return row.raw[2] === 'Predicted' ? { textColor: [105, 105, 105] } : { textColor: [0, 0, 139] };
        },
        // Add alternating row colors
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        }
      });
     
      // Save PDF - Add year range to filename for better organization
      doc.save(`Wind_Power_Generation_${selectedStartYear}-${selectedEndYear}.pdf`);
     
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
  }, [generationData, selectedStartYear, selectedEndYear, currentProjection, enqueueSnackbar]);
  

  // Wind-specific additional data
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

  // CRUD operations for wind data
  const addRecord = useCallback(async (year, value, additionalData = {}) => {
    if (requestInProgress) return; // Prevent multiple requests
    
    setLoading(true);
    setRequestInProgress(true);
    try {
      console.log("Adding record for year:", year);
      const payload = {
        Year: year,
        'Wind (GWh)': value, // FIXED: Use the correct field name matching your MongoDB
        'Non-Renewable Energy (GWh)': additionalData.nonRenewableEnergy || null,
        'Population (in millions)': additionalData.population || null,
        'Gross Domestic Product': additionalData.gdp || null,
        isPredicted: false // Mark as real data, not predicted
      };
     
      await api.post('/api/predictions/wind/', payload);
     
      try {
        enqueueSnackbar('Wind generation data added successfully', { variant: 'success' });
      } catch (error) {
        console.log('Wind generation data added successfully');
      }
     
      // Reset data fetched flag and trigger refresh
      isDataFetched.current = false;
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error adding wind data:', error);
     
      try {
        enqueueSnackbar('Failed to add wind generation data', { variant: 'error' });
      } catch (snackbarError) {
        console.error('Error showing notification:', snackbarError);
      }
    } finally {
      setLoading(false);
      setRequestInProgress(false);
    }
  }, [enqueueSnackbar, requestInProgress]);

  const updateRecord = useCallback(async (year, payload) => {
    if (requestInProgress) return; // Prevent multiple requests
    
    setLoading(true);
    setRequestInProgress(true);
    try {
      console.log("Updating record for year:", year);
      // Only update MongoDB data (not predicted data)
      const recordToUpdate = mongoDbData.find(item => item.date === year);
      
      if (!recordToUpdate) {
        throw new Error("Cannot update predicted data or record not found");
      }
      
      // FIXED: Make sure we're sending the right field name to the backend
      const updatedPayload = {
        ...payload,
        'Wind (GWh)': payload['Predicted Production'] || payload['Wind (GWh)']
      };
      
      // Remove the field if it exists to avoid duplicates
      if (updatedPayload['Predicted Production']) {
        delete updatedPayload['Predicted Production'];
      }
      
      await api.put(`/api/update/${year}/`, updatedPayload);
      
      try {
        enqueueSnackbar('Wind generation data updated successfully', { variant: 'success' });
      } catch (error) {
        console.log('Wind generation data updated successfully');
      }
     
      // Reset data fetched flag and trigger refresh
      isDataFetched.current = false;
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error updating wind data:', error);
     
      try {
        enqueueSnackbar('Failed to update wind generation data', { variant: 'error' });
      } catch (snackbarError) {
        console.error('Error showing notification:', snackbarError);
      }
    } finally {
      setLoading(false);
      setRequestInProgress(false);
    }
  }, [enqueueSnackbar, mongoDbData, requestInProgress]);

  const deleteRecord = useCallback(async (year) => {
    if (requestInProgress) return; // Prevent multiple requests
    
    setLoading(true);
    setRequestInProgress(true);
    try {
      console.log("Deleting record for year:", year);
      // Only delete MongoDB data (not predicted data)
      const recordToDelete = mongoDbData.find(item => item.date === year);
      
      if (!recordToDelete) {
        throw new Error("Cannot delete predicted data or record not found");
      }
      
      await api.delete(`/api/delete/${year}/`);
     
      try {
        enqueueSnackbar('Wind generation data deleted successfully', { variant: 'success' });
      } catch (error) {
        console.log('Wind generation data deleted successfully');
      }
     
      // Reset data fetched flag and trigger refresh
      isDataFetched.current = false;
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error deleting wind data:', error);
     
      try {
        enqueueSnackbar('Failed to delete wind generation data', { variant: 'error' });
      } catch (snackbarError) {
        console.error('Error showing notification:', snackbarError);
      }
    } finally {
      setLoading(false);
      setRequestInProgress(false);
    }
  }, [enqueueSnackbar, mongoDbData, requestInProgress]);

  // Check if a record is editable (only MongoDB records are editable)
  const isRecordEditable = useCallback((year) => {
    return mongoDbData.some(item => item.date === year);
  }, [mongoDbData]);

  return {
    generationData,     // All wind data combined
    mongoDbData,        // Only MongoDB wind data (editable)
    predictedData,      // Only predicted wind data (not editable)
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
    isRecordEditable,   // Helper function
    windSpeedData,      // Wind-specific data
    turbinePerformance, // Wind-specific data
    chartRef,           // Chart reference
    requestInProgress   // Track API request status
  };
};

export default useWindAnalytics;