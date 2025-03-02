// useGeothermalAnalytics.js
import { useState, useEffect, useCallback, useRef } from 'react';
import api from '@features/modules/api';
import { useSnackbar } from '@shared/index';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

export const useGeothermalAnalytics = () => {
  const toast = useSnackbar();
  const [generationData, setGenerationData] = useState([]);
  const [currentProjection, setCurrentProjection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStartYear, setSelectedStartYear] = useState(new Date().getFullYear());
  const [selectedEndYear, setSelectedEndYear] = useState(new Date().getFullYear() + 1);
  const chartRef = useRef(null);

  useEffect(() => {
    fetchData(selectedStartYear, selectedEndYear);
  }, [selectedStartYear, selectedEndYear]);

  const fetchData = (startYear, endYear) => {
    setLoading(true);
    api.get(`/api/predictions/geothermal/?start_year=${startYear}&end_year=${endYear}`)
      .then(response => {
        const data = response.data.predictions;
        console.log('Fetched data:', data);
        
        const formattedData = data.map(item => ({
          date: item.Year,
          value: item['Predicted Production']
        }));

        console.log('Formatted data:', formattedData);
        setGenerationData(formattedData);
 
        if (formattedData.length > 0) {
          setCurrentProjection(formattedData[formattedData.length - 1].value);
        }
 
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch geothermal data');
        setLoading(false);
      });
  };

  const handleStartYearChange = (year) => {
    console.log('Start Year Changed:', year);
    setSelectedStartYear(year);
  };

  const handleEndYearChange = (year) => {
    console.log('End Year Changed:', year);
    setSelectedEndYear(year);
  };

  const handleDownload = useCallback(async () => {
    try {
      toast.info('Preparing your download...');
      
      // Create new PDF
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add title and metadata
      doc.setFontSize(16);
      doc.text('Geothermal Power Generation Summary', 15, 15);
      
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
          doc.text('Geothermal Generation Chart', 15, 45);
        } catch (chartError) {
          console.error('Error capturing chart:', chartError);
          // Continue without chart if it fails
        }
      }
      
      // Add table data - position depends on if chart was included
      const tableY = chartRef.current ? 140 : 45;
      
      // Add table header
      doc.setFontSize(12);
      doc.text('Geothermal Generation Data Table', 15, tableY - 5);
      
      // Create table data
      doc.autoTable({
        head: [['Year', 'Predicted Production (GWh)']],
        body: generationData.map(item => [item.date, item.value.toFixed(2)]),
        startY: tableY,
        margin: { left: 15, right: 15 },
        headStyles: { fillColor: [255, 107, 107] }, // Red color for geothermal
        styles: {
          fontSize: 10,
          cellPadding: 3
        }
      });
      
      // Save PDF
      doc.save('Geothermal_Power_Generation_Summary.pdf');
      
      toast.success('Summary downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download summary. Please try again.');
    }
  }, [generationData, selectedStartYear, selectedEndYear, currentProjection, toast, chartRef]);

  // Mock data for temperature and well performance
  const temperatureData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    surface: 150 + Math.sin(i * 0.5) * 10 + Math.random() * 5,
    deep: 280 + Math.sin(i * 0.3) * 5 + Math.random() * 3
  }));

  const wellPerformance = Array.from({ length: 6 }, (_, i) => ({
    well: `Well ${i + 1}`,
    pressure: 85 + Math.sin(i * 0.7) * 10 + Math.random() * 5,
    output: 2600 + Math.sin(i * 0.6) * 300 + Math.random() * 200
  }));

  return {
    generationData,
    currentProjection,
    loading,
    selectedStartYear,
    selectedEndYear,
    handleStartYearChange,
    handleEndYearChange,
    handleDownload,
    temperatureData,
    wellPerformance,
    chartRef // Export the chart ref
  };
};

export default useGeothermalAnalytics;