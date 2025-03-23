import { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import { useSnackbar } from '@components/toast-notif/ToastNotification';

// Year picker hook for managing date ranges
export const useYearPicker = ({
  initialStartYear = 2025,
  initialEndYear = 2030,
  onStartYearChange,
  onEndYearChange
}) => {
  const [startYear, setStartYear] = useState(dayjs().year(initialStartYear));
  const [endYear, setEndYear] = useState(dayjs().year(initialEndYear));
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [yearRange, setYearRange] = useState({
    startYear: initialStartYear,
    endYear: initialEndYear
  });

  const handleStartYearChange = useCallback((newValue) => {
    const dayjsValue = dayjs.isDayjs(newValue) ? newValue : dayjs(newValue);
  
    if (!dayjsValue || !dayjsValue.isValid()) {
      setError(true);
      return;
    }
    
    const year = dayjsValue.year();

    setLoading(true);
    setYearRange(prev => ({ ...prev, startYear: year}));
    setError(false);
    setStartYear(dayjsValue);
    onStartYearChange?.(year);
  }, [onStartYearChange]);

  const handleEndYearChange = useCallback((newValue) => {
    const dayjsValue = dayjs.isDayjs(newValue) ? newValue : dayjs(newValue);

    if (!dayjsValue || !dayjsValue.isValid()) {
      setError(true);
      return;
    }
    
    const year = dayjsValue.year();

    // Validate that end year is after start year
    if (dayjsValue.year() < startYear.year()) {
      setError(true);
      return;
    }
    
    setLoading(true);
    setYearRange(prev => ({ ...prev, endYear: year}));
    setError(false);
    setEndYear(dayjsValue);
    onEndYearChange?.(year);
  }, [onEndYearChange, startYear]);

  // Reset handler - now resets to 2025 and 2030
  const handleReset = useCallback(() => {
    const defaultStartYear = dayjs().year(2025);
    const defaultEndYear = dayjs().year(2030);
    
    setLoading(true);
    setStartYear(defaultStartYear);
    setEndYear(defaultEndYear);
    setYearRange({
      startYear: 2025,
      endYear: 2030
    });
    onStartYearChange?.(defaultStartYear.year());
    onEndYearChange?.(defaultEndYear.year());
    setError(false);
  }, [onStartYearChange, onEndYearChange]);

  return {
    startYear,
    endYear,
    error,
    loading,
    yearRange,
    setLoading,
    handleStartYearChange,
    handleEndYearChange,
    handleReset
  };
};

// Hook for recommendation data management
export const useRecommendationData = () => {
  const [recommendation, setRecommendation] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState({});
  const toast = useSnackbar();

  // Fetch recommendation based on year and budget
  const fetchRecommendation = async (year, budget) => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/solar_recommendations/?year=${year}&budget=${budget}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recommendation');
      }
      
      const data = await response.json();
      setRecommendation(data);
      toast.success(`Successfully generated recommendation for ${year}`);
    } catch (err) {
      toast.error(err.message || 'An error occurred while fetching the recommendation');
    } finally {
      setLoading(false);
    }
  };

  // Fetch historical data
  const fetchHistoricalData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/peertopeer/');
      if (!response.ok) throw new Error('Failed to fetch historical data');
      const data = await response.json();
      setHistoricalData(data);
    } catch (err) {
      console.error('Error fetching historical data:', err);
      toast.error('Failed to load historical data');
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on year range
  const filterDataByYearRange = (data, startYear, endYear) => {
    if (!data) return [];
    
    const startYearValue = startYear?.year() || 2020;
    const endYearValue = endYear?.year() || 2023;
    
    return data.filter(item => 
      item.year >= startYearValue && item.year <= endYearValue
    );
  };

  // Modal handlers
  const openModal = (record = {}) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };
  
  const closeModal = () => setIsModalOpen(false);

  const handleSaveRecommendation = () => {
    // Logic to save recommendation
    toast.success('Recommendation saved successfully');
    closeModal();
  };

  return {
    recommendation,
    historicalData,
    loading,
    filteredData,
    isModalOpen,
    selectedRecord,
    setLoading,
    setFilteredData,
    fetchRecommendation,
    fetchHistoricalData,
    filterDataByYearRange,
    openModal,
    closeModal,
    handleSaveRecommendation
  };
};