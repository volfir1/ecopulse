import { useState, useEffect } from 'react';
import api from '@features/modules/api';
import { useSnackbar } from '@shared/index';
import { downloadSummary } from './bioUtils';

export const useBiomassAnalytics = () => {
  const [generationData, setGenerationData] = useState([]);
  const [currentProjection, setCurrentProjection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStartYear, setSelectedStartYear] = useState(new Date().getFullYear());
  const [selectedEndYear, setSelectedEndYear] = useState(new Date().getFullYear() + 1);
  
  const toast = useSnackbar();

  useEffect(() => {
    fetchData(selectedStartYear, selectedEndYear);
  }, [selectedStartYear, selectedEndYear]);

  const fetchData = (startYear, endYear) => {
    setLoading(true);
    api.get(`/api/predictions/biomass/?start_year=${startYear}&end_year=${endYear}`)
      .then(response => {
        const data = response.data.predictions;
        console.log('Fetched data:', data);
        
        // Process the data to match the chart's expected format
        const formattedData = data.map(item => ({
          date: item.Year,
          value: item['Predicted Production']
        }));

        console.log('Formatted data:', formattedData);
        setGenerationData(formattedData);
        
        // Assuming the current month's projection is the last item in the array
        if (formattedData.length > 0) {
          setCurrentProjection(formattedData[formattedData.length - 1].value);
        }
        
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch biomass data. Please try again.');
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
      // Wait for the download summary function to complete
      const result = await downloadSummary(generationData);
      
      // If we get here, the user has completed the save dialog
      if (result === 'saved') {
        toast.success('Summary downloaded successfully!');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download summary. Please try again.');
    }
  };
  // Mock data for feedstock and efficiency since they're not in the API
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

  return {
    generationData,
    currentProjection,
    loading,
    selectedStartYear,
    selectedEndYear,
    handleStartYearChange,
    handleEndYearChange,
    handleDownload,
    feedstockData,
    efficiencyData
  };
};

export default useBiomassAnalytics;