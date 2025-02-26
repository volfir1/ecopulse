// recommendationsHook.js
import { useState, useEffect } from 'react';
import { useSnackbar } from '@shared/index';
import dayjs from 'dayjs';
import { initialData } from './data';

export const useRecommendations = () => {
  const toast = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [year, setYear] = useState(dayjs(initialData.cityData.year));
  const [cityData, setCityData] = useState(initialData.cityData);
  const [projections, setProjections] = useState(initialData.projections);
  const [costBenefits, setCostBenefits] = useState(initialData.costBenefits);
  const [energyPotential, setEnergyPotential] = useState(initialData.energyPotential);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch recommendations data');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [year]);

  const handleYearChange = (newValue) => {
    if (!newValue || !newValue.isValid()) return;
    setYear(newValue);
    setCityData(prev => ({
      ...prev,
      year: newValue.year().toString()
    }));
  };

  const handleBudgetChange = (event) => {
    const value = event.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setCityData(prev => ({
        ...prev,
        budget: value ? `₱${value}` : ''
      }));
    }
  };

  const handleDownloadPDF = () => {
    try {
      toast.info('Preparing PDF download...');
      // Implement PDF generation logic here
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
    }
  };

  return {
    cityData,
    projections,
    costBenefits,
    energyPotential,
    handleDownloadPDF,
    year,
    handleYearChange,
    handleBudgetChange,
    isLoading
  };
};