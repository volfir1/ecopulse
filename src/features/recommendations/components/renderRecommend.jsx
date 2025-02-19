import { useState, useEffect } from 'react';
import { elements } from '@shared/index';
import dayjs from 'dayjs';

export const useRecommendations = () => {
  const [isLoading, setIsLoading] = useState(true);
  // Use dayjs objects for the years
  const [startYear, setStartYear] = useState(dayjs().subtract(3, 'year'));
  const [endYear, setEndYear] = useState(dayjs());
  const [cityData, setCityData] = useState({
    city: 'San Francisco',
    period: '2023-2026',
    year: '2023',
    budget: '$15M',
    location: {
      coordinates: '37.7749° N, 122.4194° W'
    }
  });
  const [projections, setProjections] = useState([]);
  const [costBenefits, setCostBenefits] = useState([]);
  const [energyPotential, setEnergyPotential] = useState([]);

  // Simulate data loading
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Get numerical year values for calculations
      const startYearNum = startYear.year();
      const endYearNum = endYear.year();

      // Update city data period based on selected years
      setCityData(prev => ({
        ...prev,
        period: `${startYearNum}-${endYearNum}`,
        year: startYearNum.toString()
      }));

      // Generate projections based on selected years
      const projectionYears = [];
      for (let year = startYearNum; year <= Math.min(startYearNum + 2, endYearNum); year++) {
        projectionYears.push({
          year,
          title: `${year === startYearNum ? 'Current' : 'Projected'} Renewable Output`,
          progress: 20 + ((year - startYearNum) * 25),
          details: [
            `${10 + ((year - startYearNum) * 5)}% increase in renewable capacity`,
            `${5 + ((year - startYearNum) * 3)}% reduction in carbon emissions`,
            `${year > startYearNum ? 'New' : 'Existing'} solar farm ${year > startYearNum ? 'deployment' : 'optimization'}`
          ]
        });
      }
      setProjections(projectionYears);

      // Set cost benefits data
      setCostBenefits([
        {
          label: 'Initial Investment',
          value: `$${(10 + (endYearNum - startYearNum) * 2.5).toFixed(1)}M`,
          icon: 'money',
          description: `Total capital expenditure for ${startYearNum}-${endYearNum}`
        },
        {
          label: 'Annual Savings',
          value: `$${(1.2 + (endYearNum - startYearNum) * 0.8).toFixed(1)}M`,
          icon: 'trending_up',
          description: `Projected yearly savings after implementation`
        },
        {
          label: 'ROI Timeline',
          value: `${7 - Math.min(3, (endYearNum - startYearNum))} years`,
          icon: 'calendar',
          description: `Expected time to recoup investment`
        },
        {
          label: 'Carbon Reduction',
          value: `${15 + (endYearNum - startYearNum) * 10}%`,
          icon: 'eco',
          description: `Projected reduction in carbon footprint`
        }
      ]);

      // Set energy potential data
      setEnergyPotential([
        {
          type: 'Solar',
          potential: `${75 + ((endYearNum - startYearNum) * 5)}MW`,
          details: `Rooftop and ground installations could power up to ${20000 + ((endYearNum - startYearNum) * 5000)} homes annually.`,
          icon: 'sun',
          color: elements.solar
        },
        {
          type: 'Wind',
          potential: `${45 + ((endYearNum - startYearNum) * 8)}MW`,
          details: `Coastal and highland turbines with efficiency ratings of ${30 + ((endYearNum - startYearNum) * 2)}% are feasible.`,
          icon: 'wind',
          color: elements.wind
        },
        {
          type: 'Geothermal',
          potential: `${15 + ((endYearNum - startYearNum) * 3)}MW`,
          details: `Underground reservoirs suitable for ${2 + Math.floor((endYearNum - startYearNum) / 2)} power plants.`,
          icon: 'thermometer',
          color: elements.geothermal
        }
      ]);
      
      setIsLoading(false);
    };

    fetchData();
  }, [startYear, endYear]);

  const handleYearChange = (start, end) => {
    setStartYear(start);
    setEndYear(end);
  };

  const handleSaveReport = () => {
    // Implement save functionality
    console.log('Saving report...');
    alert('Report saved successfully!');
  };

  const handleDownloadPDF = () => {
    // Implement PDF download
    console.log('Downloading PDF...');
    alert('PDF download started');
  };

  return {
    cityData,
    projections,
    costBenefits,
    energyPotential,
    handleSaveReport,
    handleDownloadPDF,
    startYear,
    endYear,
    handleYearChange,
    isLoading
  };
};