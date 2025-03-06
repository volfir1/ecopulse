// useDashboardSummary.js - Fixed Version
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSnackbar } from '@shared/index';

export const useDashboardSummary = () => {
  // Get snackbar notification function safely
  const snackbar = useSnackbar();
  const enqueueSnackbar = useMemo(() => {
    return snackbar?.enqueueSnackbar || 
           (message => console.log('Snackbar message:', message));
  }, [snackbar]); // Only depend on snackbar, not its methods
  
  // State variables
  const [loading, setLoading] = useState(true);
  const [selectedStartYear, setSelectedStartYear] = useState(new Date().getFullYear() - 4);
  const [selectedEndYear, setSelectedEndYear] = useState(new Date().getFullYear() + 1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalGeneration, setTotalGeneration] = useState(0);
  const [energyMix, setEnergyMix] = useState([]);
  const [yearlyTrends, setYearlyTrends] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  
  // Chart references
  const mixChartRef = useRef(null);
  const trendChartRef = useRef(null);
  const comparisonChartRef = useRef(null);

  // Generate sample data - moved OUTSIDE of the component render cycle
  const generateSampleData = useCallback((type, startYear, endYear) => {
    const years = endYear - startYear + 1;
    
    // Different patterns for different energy types
    const patternMap = {
      'Wind': (i) => 800 + Math.random() * 400 + i * 70,
      'Solar': (i) => 700 + Math.random() * 500 + i * 90,
      'Hydropower': (i) => 1200 + Math.random() * 600 + i * 75,
      'Geothermal': (i) => 900 + Math.random() * 300 + i * 60,
      'Biomass': (i) => 800 + Math.random() * 400 + Math.sin(i * Math.PI / 2) * 150
    };
    
    return Array.from({ length: years }, (_, i) => ({
      date: startYear + i,
      value: patternMap[type](i)
    }));
  }, []); // Empty dependency array - this function never changes

  // Generate all data at once to avoid re-generating on each render
  const allSampleData = useMemo(() => {
    const result = {
      Wind: generateSampleData('Wind', selectedStartYear, selectedEndYear),
      Solar: generateSampleData('Solar', selectedStartYear, selectedEndYear),
      Hydropower: generateSampleData('Hydropower', selectedStartYear, selectedEndYear),
      Geothermal: generateSampleData('Geothermal', selectedStartYear, selectedEndYear),
      Biomass: generateSampleData('Biomass', selectedStartYear, selectedEndYear)
    };
    return result;
  }, [generateSampleData, selectedStartYear, selectedEndYear, refreshTrigger]);
  
  // Process data using our locally generated sample data - SINGLE data processing effect
  useEffect(() => {
    const processData = () => {
      setLoading(true);
      
      try {
        // Create a placeholder for centralized data
        const combinedYearlyData = {};
        const latestYearData = [];
        
        // Process data sets into yearly aggregates
        [
          { data: allSampleData.Wind, label: 'Wind', color: '#64748B' },
          { data: allSampleData.Solar, label: 'Solar', color: '#FFD700' },
          { data: allSampleData.Hydropower, label: 'Hydropower', color: '#2E90E5' },
          { data: allSampleData.Geothermal, label: 'Geothermal', color: '#FF6B6B' },
          { data: allSampleData.Biomass, label: 'Biomass', color: '#16A34A' }
        ].forEach(source => {
          if (source.data && source.data.length > 0) {
            // Find the newest year in the dataset
            const maxYear = Math.max(...source.data.map(item => Number(item.date)));
            
            // Add latest year to the energy mix data
            const latestYearValue = source.data.find(item => Number(item.date) === maxYear)?.value || 0;
            latestYearData.push({
              label: source.label,
              value: latestYearValue,
              color: source.color
            });
            
            // Group all data by year for trend analysis
            source.data.forEach(item => {
              const year = Number(item.date);
              if (year >= selectedStartYear && year <= selectedEndYear) {
                if (!combinedYearlyData[year]) {
                  combinedYearlyData[year] = {
                    year: year,
                    total: 0
                  };
                }
                
                combinedYearlyData[year][source.label] = item.value;
                combinedYearlyData[year].total += item.value;
              }
            });
          }
        });
        
        // Calculate the total for the latest projections
        const totalLatestGen = latestYearData.reduce((sum, item) => sum + item.value, 0);
        setTotalGeneration(totalLatestGen);
        
        // Set energy mix data with percentages
        setEnergyMix(latestYearData.map(item => ({
          ...item,
          percentage: totalLatestGen > 0 ? (item.value / totalLatestGen * 100) : 0
        })));
        
        // Convert yearly data to array and sort by year
        const yearlyTrendsArray = Object.values(combinedYearlyData).sort((a, b) => a.year - b.year);
        setYearlyTrends(yearlyTrendsArray);
        
        // Create comparison data for the last two years
        if (yearlyTrendsArray.length >= 2) {
          const lastTwoYears = yearlyTrendsArray.slice(-2);
          const comparisonSources = ['Wind', 'Solar', 'Hydropower', 'Geothermal', 'Biomass'];
          
          const comparisonItems = comparisonSources.map(source => {
            const prevValue = lastTwoYears[0][source] || 0;
            const currentValue = lastTwoYears[1][source] || 0;
            const percentChange = prevValue > 0 
              ? ((currentValue - prevValue) / prevValue * 100) 
              : (currentValue > 0 ? 100 : 0);
              
            return {
              source,
              prevYear: lastTwoYears[0].year,
              prevValue,
              currentYear: lastTwoYears[1].year,
              currentValue,
              percentChange
            };
          });
          
          setComparisonData(comparisonItems);
        }
      } catch (error) {
        console.error('Error processing dashboard data:', error);
        try {
          enqueueSnackbar('Error loading dashboard summary data', { variant: 'error' });
        } catch (snackbarError) {
          console.error('Snackbar error:', snackbarError);
        }
      } finally {
        setLoading(false);
      }
    };
    
    processData();
  }, [allSampleData, selectedStartYear, selectedEndYear, enqueueSnackbar]);

  // Handle year range changes - these don't trigger immediate API calls now
  const handleStartYearChange = useCallback((year) => {
    setSelectedStartYear(year);
  }, []);

  const handleEndYearChange = useCallback((year) => {
    setSelectedEndYear(year);
  }, []);

  // Refresh data - just trigger a re-render
  const handleRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Get forecasts for future years
  const getForecastData = useCallback(() => {
    const currentYear = new Date().getFullYear();
    const forecastYears = 5;
    
    // Use the trend from the last few years to forecast future years
    // Simple linear projection for demonstration purposes
    if (yearlyTrends.length >= 2) {
      const lastFewYears = yearlyTrends.slice(-3); // Use last 3 years for trend
      const sources = ['Wind', 'Solar', 'Hydropower', 'Geothermal', 'Biomass'];
      
      const forecasts = [];
      
      // Create projected years
      for (let i = 1; i <= forecastYears; i++) {
        const forecastYear = currentYear + i;
        const forecast = { year: forecastYear };
        let total = 0;
        
        // For each energy source, calculate a projection
        sources.forEach(source => {
          // Find values for the last few years
          const values = lastFewYears.map(y => y[source] || 0);
          
          // Calculate average yearly growth
          const growthRates = [];
          for (let j = 1; j < values.length; j++) {
            if (values[j-1] > 0) {
              growthRates.push((values[j] - values[j-1]) / values[j-1]);
            }
          }
          
          // Average growth rate (or default to 5% if not enough data)
          const avgGrowth = growthRates.length > 0 
            ? growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length 
            : 0.05;
          
          // Apply growth rate for each projected year
          const baseValue = (lastFewYears[lastFewYears.length - 1][source] || 0);
          forecast[source] = baseValue * Math.pow(1 + avgGrowth, i);
          total += forecast[source];
        });
        
        forecast.total = total;
        forecasts.push(forecast);
      }
      
      return forecasts;
    }
    
    return [];
  }, [yearlyTrends]);

  // Determine the renewable source with the highest growth
  const getFastestGrowingSource = useCallback(() => {
    if (comparisonData.length > 0) {
      const sorted = [...comparisonData].sort((a, b) => b.percentChange - a.percentChange);
      return sorted[0];
    }
    return null;
  }, [comparisonData]);

  // Get the total capacity across all sources for the latest year
  const getTotalCapacity = useCallback(() => {
    if (yearlyTrends.length > 0) {
      const latestYear = yearlyTrends[yearlyTrends.length - 1];
      return latestYear.total;
    }
    return 0;
  }, [yearlyTrends]);

  return {
    loading,
    selectedStartYear,
    selectedEndYear,
    handleStartYearChange,
    handleEndYearChange,
    handleRefresh,
    totalGeneration,
    energyMix,
    yearlyTrends,
    comparisonData,
    getForecastData,
    getFastestGrowingSource,
    getTotalCapacity,
    mixChartRef,
    trendChartRef,
    comparisonChartRef
  };
};

export default useDashboardSummary;