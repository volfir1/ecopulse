// useGeothermalAnalytics.js
import { useState, useEffect } from 'react';
import api from '@features/modules/api';
import { useSnackbar } from '@shared/index';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const useGeothermalAnalytics = () => {
  const toast = useSnackbar();
  const [generationData, setGenerationData] = useState([]);
  const [currentProjection, setCurrentProjection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStartYear, setSelectedStartYear] = useState(new Date().getFullYear());
  const [selectedEndYear, setSelectedEndYear] = useState(new Date().getFullYear() + 1);

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

  const handleDownload = async () => {
    try {
      toast.info('Preparing your download...');
      
      const doc = new jsPDF();
      doc.text('Geothermal Power Generation Summary', 14, 16);
      doc.autoTable({
        head: [['Year', 'Predicted Production (GWH)']],
        body: generationData.map(item => [item.date, item.value]),
        startY: 20,
      });
      doc.save('Geothermal_Power_Generation_Summary.pdf');
      
      toast.success('Summary downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download summary. Please try again.');
    }
  };

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
    wellPerformance
  };
};

export default useGeothermalAnalytics;