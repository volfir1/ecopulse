// useSolarAnalytics.js
import { useState, useEffect } from 'react';
import api from '@features/modules/api';
import { useSnackbar } from '@shared/index';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const useSolarAnalytics = () => {
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
    api.get(`/api/predictions/solar/?start_year=${startYear}&end_year=${endYear}`)
      .then(response => {
        const data = response.data.predictions;
        const formattedData = data.map(item => ({
          date: item.Year,
          value: item['Predicted Production']
        }));

        setGenerationData(formattedData);
        if (formattedData.length > 0) {
          setCurrentProjection(formattedData[formattedData.length - 1].value);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch solar data');
        setLoading(false);
      });
  };

  const handleStartYearChange = (year) => setSelectedStartYear(year);
  const handleEndYearChange = (year) => setSelectedEndYear(year);

  const handleDownload = async () => {
    try {
      toast.info('Preparing your download...');
      const doc = new jsPDF();
      doc.text('Solar Power Generation Summary', 14, 16);
      doc.autoTable({
        head: [['Year', 'Predicted Production (GWh)']],
        body: generationData.map(item => [item.date, item.value]),
        startY: 20,
      });
      doc.save('Solar_Power_Generation_Summary.pdf');
      toast.success('Summary downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download summary. Please try again.');
    }
  };

  const solarIrradianceData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    irradiance: 800 + Math.sin(i * 0.8) * 200 + Math.random() * 100,
    power: 4200 + Math.sin(i * 0.8) * 800 + Math.random() * 400
  }));

  const panelPerformance = Array.from({ length: 6 }, (_, i) => ({
    array: `Array ${i + 1}`,
    efficiency: 95 + Math.sin(i * 0.5) * 3 + Math.random() * 2,
    output: 2500 + Math.sin(i * 0.5) * 300 + Math.random() * 200
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
    solarIrradianceData,
    panelPerformance
  };
};

export default useSolarAnalytics